import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
const manifest = JSON.parse(
  readFileSync("scripts/.bg-image-uuids.json", "utf8"),
);

async function main() {
  const cardImages = [
    manifest.EXT02.media_id, // Buying
    manifest.SUB01.media_id, // Selling
    manifest.SUB02.media_id, // Path
  ];
  const { data: row, error: readErr } = await s
    .from("page_blocks")
    .select("id, data")
    .eq("page_key", "home")
    .eq("block_type", "three_cards")
    .maybeSingle();
  if (readErr || !row) {
    console.error("read failed:", readErr?.message);
    process.exit(1);
  }
  const data = row.data as Record<string, unknown>;
  const cards = Array.isArray(data.cards)
    ? (data.cards as Array<Record<string, unknown>>)
    : [];
  data.cards = cards.map((c, i) => ({
    ...c,
    image: { image_id: cardImages[i] },
  }));
  const { error } = await s
    .from("page_blocks")
    .update({ data })
    .eq("id", row.id);
  if (error) {
    console.error("update failed:", error.message);
    process.exit(1);
  }
  console.log("✓ updated home/services three_cards with per-card images");
}
main();
