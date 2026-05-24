/**
 * Uploads Samina's closing photos (in public/images/<address>.webp|jpg) to
 * Cloudinary under samina-closings/<slug>, inserts a `media` row for each,
 * then inserts a `closings` row pointing at it.
 *
 *   npx tsx scripts/uploadClosings.ts
 *
 * Idempotent — re-running skips uploads that already exist in Cloudinary
 * and skips closings whose neighborhood+city+year already exist in DB.
 */

import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
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
  } catch {}
}
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const apiKey = process.env.CLOUDINARY_API_KEY!;
const apiSecret = process.env.CLOUDINARY_API_SECRET!;
if (!supabaseUrl || !supabaseKey || !cloud || !apiKey || !apiSecret) {
  console.error("Missing env vars (Supabase + Cloudinary).");
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloud,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

type ClosingSpec = {
  file: string; // path under public/images/
  neighborhood: string; // small eyebrow on tile
  city: string;
  state: string;
  closed_year: number;
};

const CLOSINGS: ClosingSpec[] = [
  {
    file: "images/161 Pinewood Rd, Fredericksburg, VA 22405.webp",
    neighborhood: "Pinewood Road",
    city: "Fredericksburg",
    state: "VA",
    closed_year: 2026,
  },
  {
    file: "images/17964 Alicia Ave, Dumfries, VA 22026.webp",
    neighborhood: "Alicia Avenue",
    city: "Dumfries",
    state: "VA",
    closed_year: 2026,
  },
  {
    file: "images/12662 Castile Ct, Woodbridge, VA 22192.webp",
    neighborhood: "Castile Court",
    city: "Woodbridge",
    state: "VA",
    closed_year: 2025,
  },
  {
    file: "images/10946 Mission Ridge Dr, Manassas, VA 20109.webp",
    neighborhood: "Mission Ridge",
    city: "Manassas",
    state: "VA",
    closed_year: 2025,
  },
  {
    file: "images/8107 Cello Way, Manassas, VA 20111.webp",
    neighborhood: "Cello Way",
    city: "Manassas",
    state: "VA",
    closed_year: 2025,
  },
  {
    file: "images/6033 Tinley Mill Dr, Haymarket, VA 20169.jpg",
    neighborhood: "Tinley Mill",
    city: "Haymarket",
    state: "VA",
    closed_year: 2025,
  },
  {
    file: "images/39 Oak Rd, Stafford, VA 22556.webp",
    neighborhood: "Oak Road",
    city: "Stafford",
    state: "VA",
    closed_year: 2025,
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadOrFind(spec: ClosingSpec): Promise<{
  media_id: string;
  url: string;
}> {
  const fullPath = resolve(process.cwd(), "public", spec.file);
  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  const publicId = `samina-closings/${slugify(
    `${spec.neighborhood}-${spec.city}-${spec.closed_year}`,
  )}`;
  const alt = `${spec.neighborhood} — ${spec.city}, ${spec.state} closing (${spec.closed_year})`;

  let url: string;
  try {
    const existing = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });
    url = existing.secure_url as string;
    console.log(`  ↳ already on Cloudinary: ${publicId}`);
  } catch {
    const res = await cloudinary.uploader.upload(fullPath, {
      public_id: publicId,
      overwrite: false,
      resource_type: "image",
    });
    url = res.secure_url;
    console.log(`  ↳ uploaded → ${publicId}`);
  }

  const { data: existingRow } = await supabase
    .from("media")
    .select("id")
    .eq("cloudinary_public_id", publicId)
    .maybeSingle();

  if (existingRow?.id) {
    return { media_id: existingRow.id, url };
  }

  const { data: inserted, error } = await supabase
    .from("media")
    .insert({
      kind: "image",
      cloudinary_public_id: publicId,
      url,
      alt,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    throw new Error(`Insert media failed: ${error?.message}`);
  }
  return { media_id: inserted.id, url };
}

async function insertClosing(spec: ClosingSpec, imageId: string) {
  // Skip if same neighborhood+city+year already present
  const { data: existing } = await supabase
    .from("closings")
    .select("id")
    .eq("neighborhood", spec.neighborhood)
    .eq("city", spec.city)
    .eq("closed_year", spec.closed_year)
    .maybeSingle();

  if (existing?.id) {
    console.log(
      `  ↳ closing row exists, updating image_id only: ${existing.id}`,
    );
    const { error } = await supabase
      .from("closings")
      .update({ image_id: imageId, is_visible: true })
      .eq("id", existing.id);
    if (error) throw new Error(`Update closing failed: ${error.message}`);
    return;
  }

  const { data: last } = await supabase
    .from("closings")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (last?.display_order ?? -1) + 1;

  const { error } = await supabase.from("closings").insert({
    image_id: imageId,
    neighborhood: spec.neighborhood,
    city: spec.city,
    state: spec.state,
    closed_year: spec.closed_year,
    display_order: nextOrder,
    is_visible: true,
  });
  if (error) throw new Error(`Insert closing failed: ${error.message}`);
  console.log(`  ↳ closing inserted (display_order=${nextOrder})`);
}

async function main() {
  console.log(`Processing ${CLOSINGS.length} closings…\n`);
  for (const spec of CLOSINGS) {
    console.log(`• ${spec.neighborhood}, ${spec.city} (${spec.closed_year})`);
    try {
      const { media_id } = await uploadOrFind(spec);
      await insertClosing(spec, media_id);
    } catch (e) {
      console.error(
        `  ✗ ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }
  console.log(`\nDone.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
