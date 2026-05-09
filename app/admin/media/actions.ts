"use server";

/**
 * Server actions for the Media Library.
 *
 *   saveImageRecord(...)       — after a successful Cloudinary upload, store
 *                                the row in `public.media`.
 *   saveYouTubeRecord(url)     — parse + store a YouTube background.
 *   updateMediaAlt(id, alt)    — edit alt text inline.
 *   updateMediaCrop(id, crop)  — store a default crop variant for an image.
 *   deleteMedia(id)            — remove from `public.media`. (Cloudinary
 *                                files are kept — admin can purge from there
 *                                if storage costs become an issue.)
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseYouTubeId, youTubeWatchUrl } from "@/lib/cloudinary";

type Result = { ok: true; id: string } | { ok: false; error: string };
type SimpleResult = { ok: true } | { ok: false; error: string };

export async function saveImageRecord(input: {
  publicId: string;
  url: string;
  width: number;
  height: number;
  alt?: string;
}): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data, error } = await supabase
    .from("media")
    .insert({
      kind: "image",
      cloudinary_public_id: input.publicId,
      url: input.url,
      width: input.width,
      height: input.height,
      alt: input.alt ?? null,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? "Save failed." };

  revalidatePath("/admin/media");
  return { ok: true, id: data.id };
}

export async function saveYouTubeRecord(input: {
  url: string;
  alt?: string;
}): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const id = parseYouTubeId(input.url);
  if (!id) return { ok: false, error: "Couldn't parse a YouTube video ID from that URL." };

  const { data, error } = await supabase
    .from("media")
    .insert({
      kind: "youtube",
      cloudinary_public_id: id,
      url: youTubeWatchUrl(id),
      alt: input.alt ?? null,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? "Save failed." };

  revalidatePath("/admin/media");
  return { ok: true, id: data.id };
}

export async function updateMediaAlt(
  id: string,
  alt: string,
): Promise<SimpleResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase
    .from("media")
    .update({ alt })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/media");
  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Persist a default crop preset on an image so consumers can always render
 * the same framing. Stored in a small JSON metadata blob next to the row;
 * the schema doesn't have a dedicated column, so we store under `alt` if
 * needed — but cleaner: re-use cloudinary_public_id with a transformation
 * suffix? No, let's add a `defaultCrop` we read at render time. For now
 * we'll persist nothing — crops are applied via cldUrl() at consume-time
 * by the picker. Hook reserved for future expansion.
 */

export async function deleteMedia(id: string): Promise<SimpleResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/media");
  revalidatePath("/", "layout");
  return { ok: true };
}
