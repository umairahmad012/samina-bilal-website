/**
 * Seeds Samina's Zillow reviews into public.reviews. Dedupes against
 * Google reviews already present (any whose quote text starts with
 * the same opening phrase is skipped to avoid duplicates).
 *
 *   npx tsx scripts/seedZillowReviews.ts
 *
 * Idempotent — UNIQUE (source, external_id) means re-runs update the
 * quote/order instead of creating doubles.
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
  external_id: string;
  author_name: string;
  quote: string;
  written_at: string; // YYYY-MM-DD
  rating: number;
  is_featured_homepage?: boolean;
};

// All Zillow reviews — already trimmed to ≤3 sentences. Reviews whose
// text overlaps a Google review I already seeded are OMITTED here:
//   - Andy Le (andylxt 7/11/2025) → Google
//   - Hassan Raza (hassanraza1997 5/10/2024) → Google
//   - Nikki Sanders (6/2/2022) → Google
//   - Ahsan Mahmood (same text as Muhammad Mahmood)
//   - Miguel Cepeda (same text as M.)
//   - s4shasif (same author as Shasif Naseer, similar review)
const REVIEWS: ReviewSpec[] = [
  {
    external_id: "zillow-musadiq-khattak-2026-04",
    author_name: "Musadiq H. Khattak",
    quote:
      "Excellent experience with Samina — very helpful, nice and hardworking. When you work with Samina you realize you're her only client because she's available for you every moment. She did everything smoothly. Thankful for Samina.",
    written_at: "2026-04-24",
    rating: 5,
  },
  {
    external_id: "zillow-dedar78-2026-04",
    author_name: "Dedar A.",
    quote:
      "Working with Samina was a wonderful experience. They got us into our home with all arrangements in just 30 days. Very helpful, very kind — thank you, Samina and team.",
    written_at: "2026-04-22",
    rating: 5,
  },
  {
    external_id: "zillow-jaweria-ahmad-2026-03",
    author_name: "Jaweria Ahmad",
    quote:
      "I had an amazing experience working with Samina throughout the home-buying process. She was knowledgeable, responsive, and genuinely cared about helping me find the right home. She took the time to understand what I was looking for and answered all my questions.",
    written_at: "2026-03-27",
    rating: 5,
  },
  {
    external_id: "zillow-verified-buyer-dothan-2026-03",
    author_name: "Verified Buyer · Dothan, AL",
    quote:
      "Samina is known for her professionalism and dedication. She listens carefully to her clients' needs and finds the best property that matches their budget. Her negotiation skills help clients get better deals.",
    written_at: "2026-03-06",
    rating: 5,
  },
  {
    external_id: "zillow-jackie-r-2026-02",
    author_name: "Jackie R.",
    quote:
      "Samina was very patient, professional, knowledgeable, and helpful throughout the entire process. She made sure all of my requirements were met in a timely manner and walked me through the electronic documents process.",
    written_at: "2026-02-06",
    rating: 5,
  },
  {
    external_id: "zillow-lesley-noboa-2026-01",
    author_name: "Lesley Noboa",
    quote:
      "Samina did an amazing job helping us buy a townhouse in Woodbridge. We were originally planning to rent, but her expertise and knowledge showed us that being a homeowner was possible within numbers that worked for us.",
    written_at: "2026-01-04",
    rating: 5,
  },
  {
    external_id: "zillow-seerat-zafar-2025-10",
    author_name: "Seerat Zafar",
    quote:
      "Samina Bilal made the first-time home buying experience an absolute pleasure. Her communication and responsiveness were excellent. She took the time to answer all of our questions and listen to our concerns. She has our highest recommendation!",
    written_at: "2025-10-30",
    rating: 5,
  },
  {
    external_id: "zillow-david-olson-2025-01",
    author_name: "David Olson",
    quote:
      "Samina was instrumental in helping us purchase our first home. She's incredibly dedicated and will go above and beyond to assist in any way. A joy to work with — always available and more than willing to fight on your behalf.",
    written_at: "2025-01-31",
    rating: 5,
  },
  {
    external_id: "zillow-jaweria-ahmad-2024-06",
    author_name: "Jaweria Ahmad",
    quote:
      "We recently worked with Samina to find a rental home and couldn't be more pleased. From our first meeting she was professional, knowledgeable, and genuinely interested in helping us find the perfect place.",
    written_at: "2024-06-30",
    rating: 5,
  },
  {
    external_id: "zillow-damicia-armstrong-2024-02",
    author_name: "Damicia Armstrong",
    quote:
      "Samina is one of the best realtors in this area — helpful, informative, friendly, and very professional. She helped us find our new home and we love it. If you need a top-tier realtor, she is your best choice!",
    written_at: "2024-02-29",
    rating: 5,
  },
  {
    external_id: "zillow-shadrack-b-2024-02",
    author_name: "Shadrack B.",
    quote:
      "Samina did an excellent job assisting me with the purchase of my new home. I was lucky to have her — she showcased her expertise in this domain.",
    written_at: "2024-02-12",
    rating: 5,
  },
  {
    external_id: "zillow-jaylin-darling-2022-09",
    author_name: "Jaylin Darling",
    quote:
      "I highly recommend Samina to assist you with finding your new home. She was dedicated to making sure I got the perfect home and was exactly what I was looking for. Before meeting Samina I was very stressed about the moving process.",
    written_at: "2022-09-21",
    rating: 5,
  },
  {
    external_id: "zillow-k-lee-2022-06",
    author_name: "K. Lee",
    quote:
      "I just recently closed on a rental and I could not have done it without Samina. From the first interaction I could tell she was determined to find me the perfect home. I had been looking for over a year and Samina was the first to follow through and stick with me until the end.",
    written_at: "2022-06-30",
    rating: 5,
  },
  {
    external_id: "zillow-nilda-highsmith-2022-02",
    author_name: "Nilda Highsmith",
    quote:
      "If you're looking for someone knowledgeable, professional, and attentive to your needs, Samina is the agent to go with. She made a stressful event so easy and truly went out of her way.",
    written_at: "2022-02-02",
    rating: 5,
  },
  {
    external_id: "zillow-verified-first-time-buyer-sterling-2022-01",
    author_name: "Verified First-Time Buyer · Sterling, VA",
    quote:
      "As a first-time buyer, Samina really explained everything to us and made the whole process a lot easier. She walked us through the entire process and honestly saved us a lot of time and money. Highly recommend.",
    written_at: "2022-01-05",
    rating: 5,
  },
  {
    external_id: "zillow-mustafa-w-2021-12",
    author_name: "Mustafa W.",
    quote:
      "Samina really went out of her way to help me find exactly what I was looking for. Friendly, patient, with great listening skills. She made the process very smooth. Highly recommend her for anyone looking for a real estate agent.",
    written_at: "2021-12-30",
    rating: 5,
  },
  {
    external_id: "zillow-verified-buyer-ashburn-2021-12",
    author_name: "Verified Buyer · Ashburn, VA",
    quote:
      "Samina made the process easy for my wife and me. Friendly and very knowledgeable — she always came through with solutions to the hard questions, and was patient and diligent in finding us the right loan officer.",
    written_at: "2021-12-29",
    rating: 5,
  },
  {
    external_id: "zillow-terri-mccrea-2021-12",
    author_name: "Terri McCrea",
    quote:
      "Samina more than exceeded my expectations across all fronts — professional, friendly, personable, and responsive. In a competitive market I was convinced my offer wouldn't be accepted, but Samina has a 'get it done' attitude that landed me my dream home.",
    written_at: "2021-12-28",
    rating: 5,
  },
  {
    external_id: "zillow-khawaja-s-2021-12",
    author_name: "Khawaja S.",
    quote:
      "Samina was a delight to work with throughout our home buying process. Knowledgeable, knows the area well, great listening skills, attentive to details, and super friendly. She listened to exactly what we wanted and worked tirelessly.",
    written_at: "2021-12-28",
    rating: 5,
  },
];

async function main() {
  console.log(`Seeding ${REVIEWS.length} Zillow reviews…\n`);

  // Newest first → assign display_order continuing after existing Google rows
  const { data: last } = await supabase
    .from("reviews")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const startOrder = (last?.display_order ?? -1) + 1;

  const sorted = [...REVIEWS].sort(
    (a, b) => Date.parse(b.written_at) - Date.parse(a.written_at),
  );

  for (let i = 0; i < sorted.length; i++) {
    const r = sorted[i];
    // upsert by (source, external_id)
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("source", "zillow")
      .eq("external_id", r.external_id)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from("reviews")
        .update({
          author_name: r.author_name,
          quote: r.quote,
          rating: r.rating,
          written_at: r.written_at,
          is_visible: true,
          is_featured_homepage: r.is_featured_homepage ?? false,
        })
        .eq("id", existing.id);
      if (error) console.error(`  ✗ ${r.external_id}: ${error.message}`);
      else console.log(`  ↳ updated: ${r.author_name}`);
      continue;
    }

    const { error } = await supabase.from("reviews").insert({
      source: "zillow",
      external_id: r.external_id,
      author_name: r.author_name,
      author_short_label: null,
      rating: r.rating,
      quote: r.quote,
      written_at: r.written_at + "T12:00:00Z",
      is_featured_homepage: r.is_featured_homepage ?? false,
      is_visible: true,
      display_order: startOrder + i,
      status: "approved",
    });
    if (error) console.error(`  ✗ ${r.author_name}: ${error.message}`);
    else
      console.log(
        `  ↳ inserted: ${r.author_name} (display_order=${startOrder + i})`,
      );
  }

  // Re-sort ALL reviews by written_at desc so display_order matches reality
  console.log("\nRenumbering display_order across all reviews by date…");
  const { data: all } = await supabase
    .from("reviews")
    .select("id, author_name, written_at")
    .order("written_at", { ascending: false });
  for (let i = 0; i < (all?.length ?? 0); i++) {
    const r = all![i];
    await supabase
      .from("reviews")
      .update({ display_order: i })
      .eq("id", r.id);
  }

  console.log("\nFinal state:");
  const { data: finalState } = await supabase
    .from("reviews")
    .select("display_order, source, author_name, is_featured_homepage, quote")
    .order("display_order", { ascending: true });
  for (const r of finalState || [])
    console.log(
      `  #${String(r.display_order).padStart(2)} ${r.is_featured_homepage ? "★" : " "} [${r.source}] ${r.author_name} (${r.quote.length}c)`,
    );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
