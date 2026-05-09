/**
 * Public-side reader for open houses. Renders the landing page +
 * printable A4 flyer at /open-house/[slug].
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cldUrl } from "./cloudinary";
import { DEFAULT_COMMUNITY_PHOTO } from "./imageDefaults";

let cached: SupabaseClient | null = null;
function client(): SupabaseClient | null {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  )
    return null;
  if (!cached) {
    cached = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } },
    );
  }
  return cached;
}

function asCropArea(
  v: unknown,
): { x: number; y: number; width: number; height: number } | undefined {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const r = v as Record<string, unknown>;
  if (
    typeof r.x === "number" &&
    typeof r.y === "number" &&
    typeof r.width === "number" &&
    typeof r.height === "number"
  ) {
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  }
  return undefined;
}

export type OpenHouse = {
  id: string;
  slug: string;
  heading: string;
  address: string;
  date: string | null;
  timeLabel: string | null;
  features: string[];
  description: string;
  formId: string | null;
  isPublished: boolean;
  hero: string;
  second: string;
  third: string;
};

type DbRow = {
  id: string;
  slug: string;
  heading: string;
  address: string;
  open_date: string | null;
  open_time_label: string | null;
  features: string[] | null;
  description: string | null;
  form_id: string | null;
  is_published: boolean;
  hero_image_crop: unknown;
  second_image_crop: unknown;
  third_image_crop: unknown;
  hero_media: { cloudinary_public_id: string | null; url: string } | null;
  second_media: { cloudinary_public_id: string | null; url: string } | null;
  third_media: { cloudinary_public_id: string | null; url: string } | null;
};

function buildUrl(
  media: DbRow["hero_media"],
  crop: unknown,
  width: number,
  fallback: string,
): string {
  if (!media) return fallback;
  if (media.cloudinary_public_id) {
    return cldUrl(media.cloudinary_public_id, {
      crop: "wide",
      width,
      cropArea: asCropArea(crop),
    });
  }
  return media.url || fallback;
}

const SELECT = `id, slug, heading, address, open_date, open_time_label,
  features, description, form_id, is_published,
  hero_image_crop, second_image_crop, third_image_crop,
  hero_media:hero_image_id ( cloudinary_public_id, url ),
  second_media:second_image_id ( cloudinary_public_id, url ),
  third_media:third_image_id ( cloudinary_public_id, url )`;

function rowToOpenHouse(row: DbRow): OpenHouse {
  return {
    id: row.id,
    slug: row.slug,
    heading: row.heading,
    address: row.address,
    date: row.open_date,
    timeLabel: row.open_time_label,
    features: row.features ?? [],
    description: row.description ?? "",
    formId: row.form_id,
    isPublished: row.is_published,
    hero: buildUrl(row.hero_media, row.hero_image_crop, 2000, DEFAULT_COMMUNITY_PHOTO),
    second: buildUrl(row.second_media, row.second_image_crop, 1200, DEFAULT_COMMUNITY_PHOTO),
    third: buildUrl(row.third_media, row.third_image_crop, 1200, DEFAULT_COMMUNITY_PHOTO),
  };
}

export async function getOpenHouseBySlug(slug: string): Promise<OpenHouse | null> {
  try {
    const supabase = client();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("open_houses")
      .select(SELECT)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return null;
    return rowToOpenHouse(data as unknown as DbRow);
  } catch {
    return null;
  }
}

export async function listOpenHouses(): Promise<OpenHouse[]> {
  try {
    const supabase = client();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("open_houses")
      .select(SELECT)
      .order("open_date", { ascending: false, nullsFirst: false });
    if (error || !data) return [];
    return (data as unknown as DbRow[]).map(rowToOpenHouse);
  } catch {
    return [];
  }
}
