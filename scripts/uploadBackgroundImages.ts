/**
 * One-shot uploader: pushes every PNG under public/images/Light * to
 * Samina's Cloudinary, inserts a `media` row for each, and writes the
 * resulting media UUIDs to scripts/.bg-image-uuids.json.
 *
 *   npx tsx scripts/uploadBackgroundImages.ts
 *
 * Idempotent — re-running with the manifest in place skips uploads that
 * already have a media row (matched by cloudinary_public_id).
 *
 * After this finishes, run `scripts/seedBackgroundImageContent.ts` to
 * point every content_blocks `backgroundImage` field at these uploads.
 */

import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename } from "node:path";

// ── env ─────────────────────────────────────────────────────────────
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
if (!supabaseUrl || !supabaseKey || !cloud || !apiKey || !apiSecret) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
  );
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

// ── slot map: stable key → relative path under public/ ──────────────
// Stable keys (EXT01, SUB01, etc.) are what the seeder script will
// reference. Filenames may change in source control; the key won't.
const POOL: Record<string, string> = {
  EXT01: "images/Light Exterior/Gemini_Generated_Image_end3jcend3jcend3.png",
  EXT02: "images/Light Exterior/Gemini_Generated_Image_fp3enofp3enofp3e.png",
  EXT03: "images/Light Exterior/Gemini_Generated_Image_io60ydio60ydio60.png",
  EXT04: "images/Light Exterior/Gemini_Generated_Image_j7jh1qj7jh1qj7jh.png",
  EXT05: "images/Light Exterior/Gemini_Generated_Image_kg7blwkg7blwkg7b.png",
  EXT06: "images/Light Exterior/Gemini_Generated_Image_me0zvtme0zvtme0z.png",
  EXT07: "images/Light Exterior/Gemini_Generated_Image_mwf53omwf53omwf5.png",
  EXT08: "images/Light Exterior/Gemini_Generated_Image_oibh09oibh09oibh.png",
  EXT09: "images/Light Exterior/Gemini_Generated_Image_q79v04q79v04q79v.png",
  EXT10: "images/Light Exterior/Gemini_Generated_Image_uvsq4vuvsq4vuvsq.png",
  SUB01: "images/Light Sburban/Gemini_Generated_Image_2g305d2g305d2g30.png",
  SUB02: "images/Light Sburban/Gemini_Generated_Image_cln91tcln91tcln9.png",
  SUB03: "images/Light Sburban/Gemini_Generated_Image_dsi7y8dsi7y8dsi7.png",
  SUB04: "images/Light Sburban/Gemini_Generated_Image_hvi90qhvi90qhvi9.png",
  SUB05: "images/Light Sburban/Gemini_Generated_Image_j0eufqj0eufqj0eu.png",
  SUB06: "images/Light Sburban/Gemini_Generated_Image_z6i65ez6i65ez6i6.png",
  INT01: "images/Light Interior/A. Light interior1.png",
  INT02: "images/Light Interior/A. Light interior2.png",
  INT03: "images/Light Interior/A. Light interior3.png",
  INT04: "images/Light Interior/A. Light interior4.png",
  INT05: "images/Light Interior/A. Light interior5.png",
  KIT01: "images/Light Interior/Light interior + Kitchen1.png",
  KIT02: "images/Light Interior/Light interior + Kitchen2.png",
  KIT03: "images/Light Interior/Light interior + Kitchen3.png",
  KIT04: "images/Light Interior/Light interior + Kitchen4.png",
  KIT05: "images/Light Interior/Light interior + Kitchen5.png",
};

// Friendly alt text per pool key — lets the Media Library show meaningful labels
const ALT: Record<string, string> = {
  EXT01: "Light exterior — modern home elevation 1",
  EXT02: "Light exterior — modern home elevation 2",
  EXT03: "Light exterior — modern home elevation 3",
  EXT04: "Light exterior — modern home elevation 4",
  EXT05: "Light exterior — modern home elevation 5",
  EXT06: "Light exterior — modern home elevation 6",
  EXT07: "Light exterior — modern home elevation 7",
  EXT08: "Light exterior — modern home elevation 8",
  EXT09: "Light exterior — modern home elevation 9",
  EXT10: "Light exterior — modern home elevation 10",
  SUB01: "Light suburban neighborhood 1",
  SUB02: "Light suburban neighborhood 2",
  SUB03: "Light suburban neighborhood 3",
  SUB04: "Light suburban neighborhood 4",
  SUB05: "Light suburban neighborhood 5",
  SUB06: "Light suburban neighborhood 6",
  INT01: "Light interior — open living 1",
  INT02: "Light interior — open living 2",
  INT03: "Light interior — open living 3",
  INT04: "Light interior — open living 4",
  INT05: "Light interior — open living 5",
  KIT01: "Light interior — kitchen 1",
  KIT02: "Light interior — kitchen 2",
  KIT03: "Light interior — kitchen 3",
  KIT04: "Light interior — kitchen 4",
  KIT05: "Light interior — kitchen 5",
};

const MANIFEST_PATH = resolve(process.cwd(), "scripts/.bg-image-uuids.json");

type Manifest = Record<
  string,
  { media_id: string; cloudinary_public_id: string; url: string }
>;

async function loadManifest(): Promise<Manifest> {
  if (!existsSync(MANIFEST_PATH)) return {};
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

async function saveManifest(m: Manifest) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2));
}

async function uploadOne(key: string, relPath: string): Promise<{
  media_id: string;
  cloudinary_public_id: string;
  url: string;
}> {
  const fullPath = resolve(process.cwd(), "public", relPath);
  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  // Folder under Cloudinary asset library: samina-bg/<key>
  const publicId = `samina-bg/${key}`;

  // Check Cloudinary first — skip upload if asset already exists
  let url: string;
  try {
    const existing = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });
    url = existing.secure_url as string;
    console.log(`  ↳ ${key} already on Cloudinary, skipping upload`);
  } catch {
    const res = await cloudinary.uploader.upload(fullPath, {
      public_id: publicId,
      overwrite: false,
      resource_type: "image",
    });
    url = res.secure_url;
    console.log(`  ↳ ${key} uploaded → ${publicId}`);
  }

  // Find existing media row by cloudinary_public_id, else insert
  const { data: existingRow } = await supabase
    .from("media")
    .select("id")
    .eq("cloudinary_public_id", publicId)
    .maybeSingle();

  if (existingRow?.id) {
    console.log(`  ↳ ${key} media row exists: ${existingRow.id}`);
    return { media_id: existingRow.id, cloudinary_public_id: publicId, url };
  }

  const { data: inserted, error } = await supabase
    .from("media")
    .insert({
      kind: "image",
      cloudinary_public_id: publicId,
      url,
      alt: ALT[key] ?? key,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    throw new Error(`Insert media failed for ${key}: ${error?.message}`);
  }
  console.log(`  ↳ ${key} media row inserted: ${inserted.id}`);
  return { media_id: inserted.id, cloudinary_public_id: publicId, url };
}

async function main() {
  console.log(`Uploading ${Object.keys(POOL).length} images to Cloudinary…`);
  const manifest = await loadManifest();
  for (const [key, relPath] of Object.entries(POOL)) {
    if (manifest[key]) {
      console.log(`✓ ${key} already in manifest (media_id=${manifest[key].media_id}) — skipping`);
      continue;
    }
    try {
      manifest[key] = await uploadOne(key, relPath);
      await saveManifest(manifest);
    } catch (e) {
      console.error(`✗ ${key}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  console.log(`\nManifest written: ${MANIFEST_PATH}`);
  console.log(`${Object.keys(manifest).length} images registered.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
