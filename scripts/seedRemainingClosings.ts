/**
 * Adds the 6 remaining 2025/2026 closings that don't have photo files,
 * using brand-pool SUB* images as placeholders (NEVER Unsplash), then
 * re-orders ALL closings by actual sold date so the homepage's top-6
 * shows the most-recent six.
 *
 *   npx tsx scripts/seedRemainingClosings.ts
 *
 * Idempotent. Safe to re-run.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
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
  } catch {}
}
loadEnv();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const manifest = JSON.parse(
  readFileSync(resolve(process.cwd(), "scripts/.bg-image-uuids.json"), "utf8"),
) as Record<string, { media_id: string }>;

// ── New 6 closings (photo-less) ─────────────────────────────────────
// Each gets a placeholder media_id cycled from SUB pool so the tile
// renders rather than 404. Use SUB (suburban) since these are homes
// in suburban VA/MD.
const PLACEHOLDER_POOL = ["SUB01", "SUB02", "SUB03", "SUB04", "SUB05", "SUB06"];

type Spec = {
  date: string; // ISO, used only for ordering
  neighborhood: string;
  city: string;
  state: string;
  closed_year: number;
  placeholderKey?: string; // if undefined, will not insert (existing row keeps photo)
};

const NEW: Spec[] = [
  {
    date: "2026-04-10",
    neighborhood: "Blue Spruce Drive",
    city: "Culpeper",
    state: "VA",
    closed_year: 2026,
    placeholderKey: "SUB01",
  },
  {
    date: "2025-10-28",
    neighborhood: "Fox Glove Court",
    city: "Woodbridge",
    state: "VA",
    closed_year: 2025,
    placeholderKey: "SUB02",
  },
  {
    date: "2025-07-08",
    neighborhood: "Lands End Court",
    city: "Dumfries",
    state: "VA",
    closed_year: 2025,
    placeholderKey: "SUB03",
  },
  {
    date: "2025-03-11",
    neighborhood: "Batley Court",
    city: "Fredericksburg",
    state: "VA",
    closed_year: 2025,
    placeholderKey: "SUB04",
  },
  {
    date: "2025-01-31",
    neighborhood: "Bullwhip Trail",
    city: "Lusby",
    state: "MD",
    closed_year: 2025,
    placeholderKey: "SUB05",
  },
  {
    date: "2025-01-21",
    neighborhood: "Cathedral Street",
    city: "Baltimore",
    state: "MD",
    closed_year: 2025,
    placeholderKey: "SUB06",
  },
];

// Existing 7 (already in DB) — listed with real sold-dates so we can
// renumber display_order chronologically across the full set.
const EXISTING: Omit<Spec, "placeholderKey">[] = [
  { date: "2026-03-27", neighborhood: "Alicia Avenue", city: "Dumfries", state: "VA", closed_year: 2026 },
  { date: "2026-03-06", neighborhood: "Pinewood Road", city: "Fredericksburg", state: "VA", closed_year: 2026 },
  { date: "2025-12-08", neighborhood: "Castile Court", city: "Woodbridge", state: "VA", closed_year: 2025 },
  { date: "2025-12-01", neighborhood: "Mission Ridge", city: "Manassas", state: "VA", closed_year: 2025 },
  { date: "2025-07-25", neighborhood: "Cello Way", city: "Manassas", state: "VA", closed_year: 2025 },
  { date: "2025-07-10", neighborhood: "Tinley Mill", city: "Haymarket", state: "VA", closed_year: 2025 },
  { date: "2025-06-25", neighborhood: "Oak Road", city: "Stafford", state: "VA", closed_year: 2025 },
];

async function ensureNewClosing(s: Spec) {
  const { data: existing } = await supabase
    .from("closings")
    .select("id")
    .eq("neighborhood", s.neighborhood)
    .eq("city", s.city)
    .eq("closed_year", s.closed_year)
    .maybeSingle();

  const media_id = s.placeholderKey
    ? manifest[s.placeholderKey]?.media_id ?? null
    : null;

  if (existing?.id) {
    console.log(`  ↳ exists: ${s.neighborhood}, ${s.city}`);
    return existing.id;
  }

  const { data, error } = await supabase
    .from("closings")
    .insert({
      image_id: media_id,
      neighborhood: s.neighborhood,
      city: s.city,
      state: s.state,
      closed_year: s.closed_year,
      is_visible: true,
      display_order: 999, // temporary; renumbered below
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message);
  console.log(`  ↳ inserted: ${s.neighborhood}, ${s.city}`);
  return data.id;
}

async function main() {
  console.log("Inserting 6 placeholder closings…");
  for (const s of NEW) await ensureNewClosing(s);

  console.log("\nRenumbering ALL closings by actual sold-date (newest first)…");
  const all = [...NEW, ...EXISTING]
    .map((s) => ({ ...s, ts: Date.parse(s.date) }))
    .sort((a, b) => b.ts - a.ts);

  for (let i = 0; i < all.length; i++) {
    const s = all[i];
    const { error } = await supabase
      .from("closings")
      .update({ display_order: i })
      .eq("neighborhood", s.neighborhood)
      .eq("city", s.city)
      .eq("closed_year", s.closed_year);
    if (error) console.error(`  ✗ ${s.neighborhood}: ${error.message}`);
    else console.log(`  #${i.toString().padStart(2)} ${s.date} — ${s.neighborhood}, ${s.city}`);
  }
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
