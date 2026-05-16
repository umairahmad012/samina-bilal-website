/**
 * EMERGENCY recovery — removes the `backgroundImage` field (and PillarCard
 * `image` fields) from every row the seeder wrote, so the public site
 * falls back to the hardcoded fallback URLs in code. Preserves every
 * other field on each row.
 *
 *   npx tsx scripts/revertBackgroundImageContent.ts
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  try {
    const t = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of t.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
    }
  } catch {
    /* */
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key, { auth: { persistSession: false } });

const ROWS = [
  ["home", "hero"],
  ["home", "darkBreak1"],
  ["home", "darkBreak2"],
  ["home", "pathTeaser"],
  ["home", "reviews"],
  ["home", "services"], // strip card.image only
  ["about", "cta"],
  ["about", "darkBreak"],
  ["buyers", "hero"],
  ["buyers", "cta"],
  ["buyers", "darkBreak"],
  ["buyers", "firstTimeCallout"],
  ["sellers", "hero"],
  ["sellers", "cta"],
  ["sellers", "darkBreak"],
  ["sellers", "darkBreak2"],
  ["path", "hero"],
  ["path", "cta"],
  ["path", "darkBreak"],
  ["path", "stepImages"], // delete row entirely
  ["partners", "hero"],
  ["partners", "cta"],
  ["partners", "darkBreak"],
  ["communities", "hero"],
  ["communities", "darkBreak"],
  ["closings", "hero"],
  ["reviews", "hero"],
  ["reviews", "cta"],
  ["contact", "hero"],
] as const;

async function stripOne(page: string, key: string) {
  const { data } = await supabase
    .from("content_blocks")
    .select("value")
    .eq("page", page)
    .eq("key", key)
    .maybeSingle();

  // stepImages row is purely my creation — delete it.
  if (page === "path" && key === "stepImages") {
    await supabase
      .from("content_blocks")
      .delete()
      .eq("page", page)
      .eq("key", key);
    console.log(`✓ ${page}/${key} (deleted)`);
    return;
  }

  if (!data?.value) {
    console.log(`· ${page}/${key} (no row)`);
    return;
  }
  let parsed: Record<string, unknown>;
  try {
    parsed =
      typeof data.value === "string"
        ? JSON.parse(data.value)
        : (data.value as Record<string, unknown>);
  } catch {
    console.log(`· ${page}/${key} (unparseable, skipping)`);
    return;
  }

  // home/services — strip image off each card
  if (page === "home" && key === "services" && Array.isArray(parsed.cards)) {
    parsed.cards = (parsed.cards as Array<Record<string, unknown>>).map((c) => {
      const { image, ...rest } = c;
      return rest;
    });
  } else {
    delete parsed.backgroundImage;
  }

  await supabase
    .from("content_blocks")
    .upsert(
      { page, key, value: JSON.stringify(parsed) },
      { onConflict: "page,key" },
    );
  console.log(`✓ ${page}/${key}`);
}

async function main() {
  for (const [p, k] of ROWS) {
    try {
      await stripOne(p, k);
    } catch (e) {
      console.error(`✗ ${p}/${k}: ${e instanceof Error ? e.message : e}`);
    }
  }
}
main();
