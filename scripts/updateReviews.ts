/**
 * Trims long reviews to punchy ~2-3 sentence versions, and adds the
 * missing Terri Mccrea review. Idempotent.
 *
 *   npx tsx scripts/updateReviews.ts
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

const NOW = new Date();
function monthsAgoIso(m: number): string {
  const d = new Date(NOW);
  d.setMonth(d.getMonth() - m);
  return d.toISOString();
}

// Updates by external_id. Each quote is trimmed to ≤3 punchy sentences.
const UPDATES = [
  {
    external_id: "google-andy-le-2025-07",
    quote:
      "We've worked with a number of agents over the years — between my parents and me, we've bought five homes — and I can honestly say Samina is the best we've ever worked with. She was present, genuine, well-connected, and never made us feel rushed or pressured. We never felt like just another transaction — and that's exactly the kind of person you want on your side.",
  },
  {
    external_id: "google-thameena101-2025-12",
    quote:
      "Samina was a steadfast presence throughout my home buying journey. Her dedication, professionalism, and genuine care for her clients set her apart. If you're looking for someone who will truly advocate for you and help you find your dream home, look no further.",
  },
  {
    external_id: "google-nikki-sanders-2023-05",
    quote:
      "I highly recommend Samina for all of your real estate needs! She went above and beyond to help me secure an amazing home in this competitive market — punctual, responsive, well-organized, and incredibly knowledgeable. I'll be referring anyone new to the area to start with her.",
  },
];

// Terri McCrea moved to the Zillow seed (she shows on Zillow too) so we
// don't accidentally create duplicates across (source, external_id).

async function main() {
  console.log(`Trimming ${UPDATES.length} long reviews…\n`);

  for (const u of UPDATES) {
    const { data: existing } = await supabase
      .from("reviews")
      .select("id, author_name")
      .eq("source", "google")
      .eq("external_id", u.external_id)
      .maybeSingle();
    if (!existing?.id) {
      console.log(`  ✗ not found: ${u.external_id}`);
      continue;
    }
    const { error } = await supabase
      .from("reviews")
      .update({ quote: u.quote })
      .eq("id", existing.id);
    if (error) {
      console.error(`  ✗ ${u.external_id}: ${error.message}`);
    } else {
      console.log(
        `  ↳ trimmed: ${existing.author_name} (${u.quote.length} chars)`,
      );
    }
  }

  console.log(`\nFinal state:`);
  const { data: all } = await supabase
    .from("reviews")
    .select("author_name, quote, is_featured_homepage, display_order")
    .order("display_order", { ascending: true });
  for (const r of all || [])
    console.log(
      `  #${r.display_order} ${r.is_featured_homepage ? "★" : " "} ${r.author_name} (${r.quote.length}c)`,
    );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
