/**
 * Wires every uploaded background image (see scripts/.bg-image-uuids.json)
 * into the matching `content_blocks` row's `backgroundImage` field so
 * Samina can swap them from /admin/content → <Section> editor.
 *
 *   npx tsx scripts/seedBackgroundImageContent.ts
 *
 * Preserves any existing fields on each row; only sets/overwrites the
 * `backgroundImage.image_id` value(s). Idempotent.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  try {
    const text = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      const [, k, v] = m;
      if (!process.env[k]) process.env[k] = v.replace(/^"(.*)"$/, "$1");
    }
  } catch {
    /* ignore */
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const MANIFEST_PATH = resolve(process.cwd(), "scripts/.bg-image-uuids.json");
if (!existsSync(MANIFEST_PATH)) {
  console.error(
    "Manifest missing. Run `npx tsx scripts/uploadBackgroundImages.ts` first.",
  );
  process.exit(1);
}
const MANIFEST: Record<string, { media_id: string }> = JSON.parse(
  readFileSync(MANIFEST_PATH, "utf8"),
);

function mediaId(poolKey: string): string {
  const m = MANIFEST[poolKey];
  if (!m) {
    throw new Error(`Pool key ${poolKey} not in manifest`);
  }
  return m.media_id;
}

// ── assignment matrix ──────────────────────────────────────────────
// Each entry mutates one content_blocks row. Path is `page.key`. The
// `mutate` fn receives the parsed value JSON and returns the new value.
type Edit = {
  page: string;
  key: string;
  mutate: (current: Record<string, unknown>) => Record<string, unknown>;
};

function setBg(poolKey: string): Edit["mutate"] {
  return (current) => ({
    ...current,
    backgroundImage: { image_id: mediaId(poolKey) },
  });
}

const EDITS: Edit[] = [
  // ─ Home
  { page: "home", key: "hero",        mutate: setBg("EXT01") },
  { page: "home", key: "darkBreak1",  mutate: setBg("INT01") },
  { page: "home", key: "darkBreak2",  mutate: setBg("KIT01") },
  { page: "home", key: "pathTeaser",  mutate: setBg("SUB03") },
  { page: "home", key: "reviews",     mutate: setBg("KIT02") },

  // Home "services" has 3 cards; each card has its own image field.
  {
    page: "home",
    key: "services",
    mutate: (current) => {
      const cards = Array.isArray(current.cards) ? current.cards : [];
      // Pad up to 3 cards so the assignment doesn't crash on an empty
      // services row. Actual card content stays in lib/content.ts defaults.
      const padded = [...cards];
      while (padded.length < 3) padded.push({});
      padded[0] = { ...(padded[0] || {}), image: { image_id: mediaId("EXT02") } };
      padded[1] = { ...(padded[1] || {}), image: { image_id: mediaId("SUB01") } };
      padded[2] = { ...(padded[2] || {}), image: { image_id: mediaId("SUB02") } };
      return { ...current, cards: padded };
    },
  },

  // ─ About (hero uses Samina's portrait, not bg pool — leave alone)
  { page: "about", key: "cta",       mutate: setBg("KIT03") },
  { page: "about", key: "darkBreak", mutate: setBg("INT02") },

  // ─ Buyers
  { page: "buyers", key: "hero",             mutate: setBg("EXT04") },
  { page: "buyers", key: "cta",              mutate: setBg("INT03") },
  { page: "buyers", key: "darkBreak",        mutate: setBg("KIT04") },
  { page: "buyers", key: "firstTimeCallout", mutate: setBg("SUB05") },

  // ─ Sellers
  { page: "sellers", key: "hero",        mutate: setBg("EXT05") },
  { page: "sellers", key: "cta",         mutate: setBg("SUB04") },
  { page: "sellers", key: "darkBreak",   mutate: setBg("INT04") },
  { page: "sellers", key: "darkBreak2",  mutate: setBg("KIT05") },

  // ─ Path to Ownership
  { page: "path", key: "hero",      mutate: setBg("SUB05") },
  { page: "path", key: "cta",       mutate: setBg("KIT02") },
  { page: "path", key: "darkBreak", mutate: setBg("EXT08") },
  {
    page: "path",
    key: "stepImages",
    mutate: (current) => ({
      ...current,
      step1: { image_id: mediaId("INT05") },
      step2: { image_id: mediaId("KIT01") },
      step3: { image_id: mediaId("EXT06") },
      step4: { image_id: mediaId("EXT07") },
    }),
  },

  // ─ Partners
  { page: "partners", key: "hero",      mutate: setBg("EXT09") },
  { page: "partners", key: "cta",       mutate: setBg("INT01") },
  { page: "partners", key: "darkBreak", mutate: setBg("SUB06") },

  // ─ Communities
  { page: "communities", key: "hero",      mutate: setBg("SUB01") },
  { page: "communities", key: "darkBreak", mutate: setBg("SUB02") },

  // ─ Closings
  { page: "closings", key: "hero", mutate: setBg("EXT10") },

  // ─ Reviews
  { page: "reviews", key: "hero", mutate: setBg("KIT04") },
  { page: "reviews", key: "cta",  mutate: setBg("SUB03") },

  // ─ Contact
  { page: "contact", key: "hero", mutate: setBg("EXT01") },
];

async function upsertOne(edit: Edit) {
  // Read existing row (if any) — preserve every existing field
  const { data: row } = await supabase
    .from("content_blocks")
    .select("value")
    .eq("page", edit.page)
    .eq("key", edit.key)
    .maybeSingle();

  let current: Record<string, unknown> = {};
  if (row?.value) {
    try {
      const parsed =
        typeof row.value === "string" ? JSON.parse(row.value) : row.value;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        current = parsed as Record<string, unknown>;
      }
    } catch {
      current = {};
    }
  }

  const next = edit.mutate(current);
  const valueText = JSON.stringify(next);

  const { error } = await supabase
    .from("content_blocks")
    .upsert(
      { page: edit.page, key: edit.key, value: valueText },
      { onConflict: "page,key" },
    );

  if (error) {
    throw new Error(`${edit.page}/${edit.key}: ${error.message}`);
  }
  console.log(`✓ ${edit.page}/${edit.key}`);
}

async function main() {
  console.log(`Seeding ${EDITS.length} content_blocks rows…`);
  for (const e of EDITS) {
    try {
      await upsertOne(e);
    } catch (err) {
      console.error(`✗ ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  console.log("\nDone. Visit /admin/content → any section → 'Background Image' to swap.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
