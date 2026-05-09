"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

export type ReviewSource = "manual" | "google" | "zillow" | "realtor";

export type ReviewInput = {
  source: ReviewSource;
  external_id: string | null;
  author_name: string;
  author_short_label: string;
  rating: number;
  quote: string;
  is_featured_homepage: boolean;
  is_visible: boolean;
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createReview(input: ReviewInput): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data: existing } = await supabase
    .from("reviews")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (existing?.display_order ?? -1) + 1;

  const { error } = await supabase
    .from("reviews")
    .insert({ ...input, display_order: nextOrder });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateReview(
  id: string,
  input: ReviewInput,
): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("reviews").update(input).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteReview(id: string): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function reorderReviews(orderedIds: string[]): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const updates = orderedIds.map((id, idx) =>
    supabase.from("reviews").update({ display_order: idx }).eq("id", id),
  );
  const results = await Promise.all(updates);
  const firstErr = results.find((r) => r.error);
  if (firstErr?.error) return { ok: false, error: firstErr.error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/", "layout");
  return { ok: true };
}

// =============================================================================
// Submissions (public-facing /leave-review form → review_submissions)
// =============================================================================

export async function approveSubmission(submissionId: string): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data: sub, error: subErr } = await supabase
    .from("review_submissions")
    .select("id, author_name, rating, quote")
    .eq("id", submissionId)
    .single();
  if (subErr || !sub) return { ok: false, error: subErr?.message ?? "Not found." };

  const { error: insErr } = await supabase.from("reviews").insert({
    source: "manual",
    author_name: sub.author_name,
    author_short_label: sub.author_name,
    rating: sub.rating ?? 5,
    quote: sub.quote,
    is_visible: true,
  });
  if (insErr) return { ok: false, error: insErr.message };

  await supabase
    .from("review_submissions")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", submissionId);

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function rejectSubmission(submissionId: string): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase
    .from("review_submissions")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", submissionId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/reviews");
  return { ok: true };
}

// =============================================================================
// Public submission (called from /leave-review)
// =============================================================================

export async function submitPublicReview(input: {
  author_name: string;
  author_email: string;
  author_phone: string;
  rating: number;
  quote: string;
  consent_post_to_google: boolean;
}): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("review_submissions").insert({
    author_name: input.author_name || null,
    author_email: input.author_email || null,
    author_phone: input.author_phone || null,
    rating: input.rating,
    quote: input.quote,
    consent_post_to_google: input.consent_post_to_google,
    status: "pending",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/reviews");
  return { ok: true };
}
