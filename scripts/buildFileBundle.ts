/**
 * Snapshots every source file in the repo into public/files/ so the
 * live Netlify deploy can serve them from /files/<path>. Also builds
 * a manifest.json the /admin/files page reads to render the
 * categorized browser, and a one-shot all.zip for the "Download All"
 * button.
 *
 *   npx tsx scripts/buildFileBundle.ts
 *
 * Run this BEFORE `git push` whenever source files change — the
 * /admin/files page reads the snapshot, not the live tree, so a deploy
 * without re-running this will show stale files.
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const OUT = join(ROOT, "public", "files");
const RAW = join(OUT, "raw");
const ZIP_OUT = join(OUT, "all.zip");

// ── Categories ──────────────────────────────────────────────────────
type CategoryKey =
  | "wiring"
  | "page-builder"
  | "design"
  | "animation"
  | "admin-center"
  | "pages"
  | "styles"
  | "database"
  | "scripts"
  | "config";

const CATEGORY_META: Record<
  CategoryKey,
  { label: string; description: string; sort: number }
> = {
  wiring: {
    label: "Wiring & Data",
    description:
      "Core data loaders, Supabase clients, content registries — the glue between database and UI.",
    sort: 1,
  },
  "page-builder": {
    label: "Page Builder",
    description:
      "The block system — every section type that can be dropped onto a page, plus the renderer that turns DB rows into JSX.",
    sort: 2,
  },
  design: {
    label: "Design / Public Components",
    description:
      "Front-end components rendered on the public site — header, footer, galleries, hero, layout primitives.",
    sort: 3,
  },
  animation: {
    label: "Animation",
    description:
      "Shimmer text, scroll-reveal, animated number counter, gold AI loader, page-transition overlay.",
    sort: 4,
  },
  "admin-center": {
    label: "Admin Center",
    description:
      "Every admin route, server action, and dashboard component — the CMS Samina edits the site through.",
    sort: 5,
  },
  pages: {
    label: "Page Routes",
    description:
      "Top-level Next.js route files for the public site (home, buyers, sellers, etc.) plus layout, sitemap, robots.",
    sort: 6,
  },
  styles: {
    label: "Styles",
    description:
      "Global CSS, Tailwind config, PostCSS config — the design tokens that drive the whole site.",
    sort: 7,
  },
  database: {
    label: "Database / Migrations",
    description:
      "SQL migrations defining every Supabase table (closings, communities, reviews, page_blocks, etc.) and their RLS policies.",
    sort: 8,
  },
  scripts: {
    label: "Scripts & Seeders",
    description:
      "One-shot maintenance / seeding scripts — uploading photos to Cloudinary, seeding reviews, building this very bundle.",
    sort: 9,
  },
  config: {
    label: "Project Config",
    description:
      "package.json, tsconfig, next.config, netlify.toml, middleware — root-level config files.",
    sort: 10,
  },
};

// ── Path → category routing ─────────────────────────────────────────
function categorize(rel: string): CategoryKey | null {
  // 1) Admin center is the most specific — match first
  if (rel.startsWith("app/admin/")) return "admin-center";
  if (rel.startsWith("components/admin/")) return "admin-center";
  if (rel.startsWith("app/api/")) return "admin-center";

  // 2) Animation — match by filename before falling into design/page-builder
  const animationNames = [
    "ShimmerText.tsx",
    "Counter.tsx",
    "Reveal.tsx",
    "PageTransitionLoader.tsx",
    "ai-loader.tsx",
  ];
  if (animationNames.some((n) => rel.endsWith(n))) return "animation";

  // 3) Page Builder
  if (rel.startsWith("components/blocks/")) return "page-builder";
  if (rel === "lib/blockRegistry.ts") return "page-builder";

  // 4) Design / public components
  if (rel.startsWith("components/")) return "design";

  // 5) Page routes (public pages)
  if (rel.startsWith("app/") && rel.endsWith("/page.tsx")) return "pages";
  if (
    rel === "app/layout.tsx" ||
    rel === "app/sitemap.ts" ||
    rel === "app/robots.ts" ||
    rel === "app/not-found.tsx" ||
    rel === "app/error.tsx" ||
    rel === "app/globals.css" // styles handled below
  ) {
    if (rel === "app/globals.css") return "styles";
    return "pages";
  }

  // 6) Styles
  if (
    rel === "app/globals.css" ||
    rel === "tailwind.config.ts" ||
    rel === "tailwind.config.js" ||
    rel === "postcss.config.mjs" ||
    rel === "postcss.config.js"
  )
    return "styles";

  // 7) Wiring & Data
  if (rel.startsWith("lib/")) return "wiring";

  // 8) Database
  if (rel.startsWith("supabase/migrations/") && rel.endsWith(".sql"))
    return "database";

  // 9) Scripts
  if (rel.startsWith("scripts/")) return "scripts";

  // 10) Root config
  const configFiles = [
    "package.json",
    "tsconfig.json",
    "next.config.ts",
    "next.config.mjs",
    "next.config.js",
    "netlify.toml",
    "middleware.ts",
    ".env.example",
    ".gitignore",
    "eslint.config.mjs",
    "eslint.config.js",
    ".eslintrc.json",
    "next-env.d.ts",
    "components.json",
  ];
  if (configFiles.includes(rel)) return "config";

  return null;
}

// ── Filesystem walk ─────────────────────────────────────────────────
const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".netlify",
  ".vscode",
  ".idea",
  "coverage",
  "dist",
  "build",
  "out",
]);

// Skip large/binary public assets that aren't source. We DO walk the
// rest of /public though (favicons, og-image refs, etc are tiny).
const EXCLUDE_FILE_GLOBS = [
  /\.DS_Store$/,
  /^public\/files\//, // avoid recursion
  /^public\/images\//, // huge image pool — not source
  /^public\/uploads\//,
  /\.env(\.|$)/, // never bundle env files
  /\.log$/,
  /package-lock\.json$/, // huge + auto-generated; skip
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
];

type Entry = { absolute: string; relative: string; size: number };

function walk(dir: string, acc: Entry[] = []): Entry[] {
  for (const name of readdirSync(dir)) {
    if (EXCLUDE_DIRS.has(name)) continue;
    const abs = join(dir, name);
    const st = statSync(abs);
    const rel = relative(ROOT, abs).split(sep).join("/");
    if (st.isDirectory()) {
      if (EXCLUDE_FILE_GLOBS.some((re) => re.test(rel + "/"))) continue;
      walk(abs, acc);
    } else {
      if (EXCLUDE_FILE_GLOBS.some((re) => re.test(rel))) continue;
      acc.push({ absolute: abs, relative: rel, size: st.size });
    }
  }
  return acc;
}

// ── File header / description extraction ────────────────────────────
// Pulls the first JSDoc/block comment paragraph as a short description.
function describeFile(absolute: string): string {
  try {
    const text = readFileSync(absolute, "utf8");
    // SQL: -- comment block at top
    if (absolute.endsWith(".sql")) {
      const lines = text.split("\n").slice(0, 6);
      const m = lines
        .filter((l) => l.trim().startsWith("--"))
        .map((l) => l.replace(/^--\s?/, "").trim())
        .filter((l) => l.length > 0);
      return m.join(" ").slice(0, 220);
    }
    // JS/TS block /** */ or /* */
    const block = text.match(/^\s*\/\*+([\s\S]*?)\*\//);
    if (block) {
      return block[1]
        .replace(/^\s*\*\s?/gm, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 220);
    }
    // Plain // comments at top
    const lines = text.split("\n").slice(0, 4);
    const m = lines
      .filter((l) => l.trim().startsWith("//"))
      .map((l) => l.replace(/^\/\/\s?/, "").trim());
    if (m.length > 0) return m.join(" ").slice(0, 220);
    return "";
  } catch {
    return "";
  }
}

// ── Main ────────────────────────────────────────────────────────────
function main() {
  console.log("Building source file bundle…\n");

  // Clean previous output
  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(RAW, { recursive: true });

  const entries = walk(ROOT);
  console.log(`Scanned ${entries.length} candidate files.`);

  const byCategory: Record<CategoryKey, Array<{
    path: string;
    name: string;
    size: number;
    description: string;
  }>> = {
    wiring: [],
    "page-builder": [],
    design: [],
    animation: [],
    "admin-center": [],
    pages: [],
    styles: [],
    database: [],
    scripts: [],
    config: [],
  };

  let copied = 0;
  for (const e of entries) {
    const cat = categorize(e.relative);
    if (!cat) continue;
    const dest = join(RAW, e.relative);
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(e.absolute, dest);
    byCategory[cat].push({
      path: e.relative,
      name: e.relative.split("/").pop()!,
      size: e.size,
      description: describeFile(e.absolute),
    });
    copied++;
  }

  // Sort each category alphabetically
  for (const k of Object.keys(byCategory) as CategoryKey[]) {
    byCategory[k].sort((a, b) => a.path.localeCompare(b.path));
  }

  // Manifest
  const manifest = {
    generated_at: new Date().toISOString(),
    total_files: copied,
    total_bytes: Object.values(byCategory)
      .flat()
      .reduce((sum, f) => sum + f.size, 0),
    categories: (Object.keys(byCategory) as CategoryKey[])
      .map((k) => ({
        key: k,
        label: CATEGORY_META[k].label,
        description: CATEGORY_META[k].description,
        sort: CATEGORY_META[k].sort,
        file_count: byCategory[k].length,
        files: byCategory[k],
      }))
      .sort((a, b) => a.sort - b.sort)
      .filter((c) => c.file_count > 0),
  };
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`✓ Copied ${copied} files into public/files/raw/`);
  console.log(`✓ Wrote manifest.json`);

  // Build the one-shot zip — uses the system `zip` command for zero deps.
  console.log("\nBuilding all.zip…");
  try {
    execSync(`cd "${RAW}" && zip -r -q "${ZIP_OUT}" .`, { stdio: "inherit" });
    const zipSize = statSync(ZIP_OUT).size;
    console.log(
      `✓ Wrote all.zip (${(zipSize / 1024).toFixed(1)} KB / ${zipSize.toLocaleString()} bytes)`,
    );
  } catch (e) {
    console.error("zip failed:", e instanceof Error ? e.message : e);
    process.exit(1);
  }

  console.log("\nPer-category summary:");
  for (const c of manifest.categories) {
    console.log(`  ${c.label.padEnd(30)} ${String(c.file_count).padStart(3)} files`);
  }
  console.log(
    `\nTotal: ${manifest.total_files} files / ${(manifest.total_bytes / 1024).toFixed(1)} KB source`,
  );
}

main();
