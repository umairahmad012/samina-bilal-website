/**
 * Seeds Samina's 9 Google reviews into public.reviews. Dedups by the
 * UNIQUE (source, external_id) constraint — re-running is safe.
 *
 *   npx tsx scripts/seedReviews.ts
 *
 * 3 of 9 are flagged is_featured_homepage=true to fill the home-page
 * reviews_strip (3-column grid). All 9 show on /reviews.
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

type ReviewSpec = {
  external_id: string; // stable id for dedup
  author_name: string;
  quote: string;
  rating: number;
  monthsAgo: number;
  featured_home: boolean;
};

// Today as anchor for "X months ago" → written_at
const NOW = new Date();
function monthsAgoIso(m: number): string {
  const d = new Date(NOW);
  d.setMonth(d.getMonth() - m);
  return d.toISOString();
}

const REVIEWS: ReviewSpec[] = [
  {
    external_id: "google-andy-le-2025-07",
    author_name: "Andy Le",
    quote:
      "We've worked with a number of agents over the years, between my parents and me, we've bought five homes and I can honestly say Samina is the best we've ever worked with.",
    rating: 5,
    monthsAgo: 10,
    featured_home: true,
  },
  {
    external_id: "google-shasif-naseer-2025-08",
    author_name: "Shasif Naseer",
    quote:
      "Top-Rated Realtor Who Truly Goes Above and Beyond. Samina is hands-down one of the best real estate agents we've worked with.",
    rating: 5,
    monthsAgo: 9,
    featured_home: true,
  },
  {
    external_id: "google-thameena101-2025-12",
    author_name: "Thameena101",
    quote:
      "I am incredibly grateful to have had the opportunity to work with Miss Samina Bilal throughout my home buying journey. From the very beginning, she has been a steadfast presence, guiding me at every step of the way.",
    rating: 5,
    monthsAgo: 5,
    featured_home: true,
  },
  {
    external_id: "google-muhammad-mahmood-2025-11",
    author_name: "Muhammad Mahmood",
    quote:
      "Samina went above and beyond to make sure everything went smoothly from start to finish. Excellent communication, honest advice, and a great understanding of the market. Couldn't have asked for a better experience.",
    rating: 5,
    monthsAgo: 6,
    featured_home: false,
  },
  {
    external_id: "google-m-2025-09",
    author_name: "M.",
    quote:
      "We had a fantastic experience working with Samina Bilal! From start to finish, she was incredibly helpful, professional, and responsive. Samina took the time to understand exactly what we were looking for and guided us through the entire process.",
    rating: 5,
    monthsAgo: 8,
    featured_home: false,
  },
  {
    external_id: "google-jaweria-ahmad-2025-05",
    author_name: "Jaweria Ahmad",
    quote:
      "Samina was incredibly professional and attentive in helping us find a rental home. She understood our needs perfectly, provided excellent options, and was always available to answer our questions. Her dedication made the process smooth and stress-free. Highly recommend!",
    rating: 5,
    monthsAgo: 12,
    featured_home: false,
  },
  {
    external_id: "google-kofi-amankwah-2025-05",
    author_name: "Kofi Amankwah",
    quote:
      "Samina did an amazing job helping us find a rental property during a critical time. She was professional, efficient, and truly went above and beyond to meet our needs. Highly recommend her services!",
    rating: 5,
    monthsAgo: 12,
    featured_home: false,
  },
  {
    external_id: "google-hassan-raza-2024-05",
    author_name: "Hassan Raza",
    quote:
      "This was my first time buying a house and Samina killed it at every part of the way, I wouldn't have been able to get this property if it wasn't for her. In a market like this you need Samina by your side. I highly recommend her expertise!",
    rating: 5,
    monthsAgo: 24,
    featured_home: false,
  },
  {
    external_id: "google-nikki-sanders-2023-05",
    author_name: "Nikki Sanders",
    quote:
      "I highly recommend Samina for all of your real estate needs! Samina is a dedicated professional, who went above and beyond to help me secure an amazing home to meet my needs in this competitive market! She's punctual, very responsive, well-informed.",
    rating: 5,
    monthsAgo: 36,
    featured_home: false,
  },
];

async function main() {
  console.log(`Seeding ${REVIEWS.length} Google reviews…\n`);

  // Sort newest first for display_order
  const sorted = [...REVIEWS].sort((a, b) => a.monthsAgo - b.monthsAgo);

  for (let i = 0; i < sorted.length; i++) {
    const r = sorted[i];
    // Check if exists by (source, external_id)
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("source", "google")
      .eq("external_id", r.external_id)
      .maybeSingle();

    if (existing?.id) {
      console.log(`  ↳ exists: ${r.author_name} — updating display_order/featured flag`);
      const { error } = await supabase
        .from("reviews")
        .update({
          display_order: i,
          is_featured_homepage: r.featured_home,
          is_visible: true,
        })
        .eq("id", existing.id);
      if (error) console.error(`    ✗ ${error.message}`);
      continue;
    }

    const { error } = await supabase.from("reviews").insert({
      source: "google",
      external_id: r.external_id,
      author_name: r.author_name,
      author_short_label: null, // falls back to author_name in renderer
      rating: r.rating,
      quote: r.quote,
      written_at: monthsAgoIso(r.monthsAgo),
      is_featured_homepage: r.featured_home,
      is_visible: true,
      display_order: i,
      status: "approved",
    });
    if (error) {
      console.error(`  ✗ ${r.author_name}: ${error.message}`);
    } else {
      console.log(
        `  ↳ inserted: ${r.author_name}${r.featured_home ? " ★ HOMEPAGE" : ""}`,
      );
    }
  }

  console.log(`\nDone.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
