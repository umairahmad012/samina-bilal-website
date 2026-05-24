import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import FilesBrowser, {
  type Manifest,
} from "@/components/admin/files/FilesBrowser";

// Source archive page — lists every file in the repo, categorized,
// with per-file download + one-shot zip. The manifest + raw files are
// generated at build time by `scripts/buildFileBundle.ts`; this page
// just reads them off the filesystem at request time.
//
// Intentionally NOT linked from anywhere — the URL itself is the
// access control. Reachable only via direct navigation to /files.
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Source files",
  robots: { index: false, follow: false },
};

async function loadManifest(): Promise<Manifest | null> {
  const path = resolve(process.cwd(), "public", "files", "manifest.json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Manifest;
  } catch {
    return null;
  }
}

export default async function FilesPage() {
  const manifest = await loadManifest();

  return (
    <main className="min-h-screen bg-cream-soft pt-24 md:pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-ink/55 hover:text-ink mb-6"
        >
          <ArrowLeft size={14} /> Back to site
        </Link>
        <p
          className="text-[0.65rem] tracking-[0.32em] uppercase text-ink/55 mb-3"
          style={{ fontWeight: 500 }}
        >
          Source Archive
        </p>
        <h1
          className="text-2xl md:text-3xl text-ink mb-2"
          style={{ fontWeight: 600, letterSpacing: "0.01em" }}
        >
          Every file behind this site.
        </h1>
        <p className="text-sm text-ink/65 max-w-2xl mb-10 leading-relaxed">
          Every source file that builds this website — categorized by purpose.
          Download any single file, or grab the full project as a zip. Useful
          for backup, sharing with a developer, or migrating later.
        </p>

        {manifest ? (
          <FilesBrowser manifest={manifest} />
        ) : (
          <div className="admin-card p-8 max-w-2xl">
            <p className="text-sm text-ink/85 mb-3">
              <strong>Source archive not built yet.</strong>
            </p>
            <p className="text-sm text-ink/65 leading-relaxed mb-4">
              The bundle hasn&rsquo;t been generated. Run the following locally
              and redeploy:
            </p>
            <pre className="text-xs bg-ink/5 px-4 py-3 rounded font-mono overflow-x-auto">
              npx tsx scripts/buildFileBundle.ts
            </pre>
            <p className="text-xs text-ink/55 mt-4 leading-relaxed">
              The script snapshots every file into{" "}
              <code className="font-mono text-[11px]">public/files/</code>,
              builds <code className="font-mono text-[11px]">all.zip</code>, and
              writes the manifest this page reads.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
