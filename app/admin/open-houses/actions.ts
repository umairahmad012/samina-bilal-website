"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CropArea } from "@/components/admin/media/CropEditor";
import type { FormField } from "@/lib/forms";

type Result = { ok: true; slug?: string } | { ok: false; error: string };

export type OpenHouseInput = {
  slug: string;
  heading: string;
  address: string;
  open_date: string | null; // YYYY-MM-DD
  open_time_label: string | null;

  hero_image_id: string | null;
  hero_image_crop: CropArea | null;
  second_image_id: string | null;
  second_image_crop: CropArea | null;
  third_image_id: string | null;
  third_image_crop: CropArea | null;

  features: string[];
  description: string;

  is_published: boolean;
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/** Fields that ship with every auto-generated open-house RSVP form. */
const RSVP_FIELDS: FormField[] = [
  { label: "Your name", name: "name", type: "text", required: true },
  { label: "Email", name: "email", type: "email", required: true },
  { label: "Phone", name: "phone", type: "phone" },
  {
    label: "How many people are coming?",
    name: "party_size",
    type: "number",
    placeholder: "1",
  },
];

export async function createOpenHouse(input: OpenHouseInput): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  // Auto-create the matching RSVP form so the landing page has somewhere
  // to send sign-ups. Slug is `open-house-<slug>` to keep namespaces clean.
  const formSlug = `open-house-${input.slug}`;
  const { data: formRow, error: formErr } = await supabase
    .from("forms")
    .insert({
      slug: formSlug,
      title: `RSVP — ${input.heading}`,
      description: `Sign up to attend the open house at ${input.address}.`,
      fields: RSVP_FIELDS,
      submit_label: "Save my spot",
      success_message:
        "Got it — we'll see you there. A reminder goes out the day before.",
      is_published: true,
    })
    .select("id")
    .single();
  if (formErr || !formRow) {
    return { ok: false, error: formErr?.message ?? "Could not create RSVP form." };
  }

  const { error } = await supabase.from("open_houses").insert({
    ...input,
    form_id: formRow.id,
  });
  if (error) {
    // Roll back the form so we don't leave orphans
    await supabase.from("forms").delete().eq("id", formRow.id);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/open-houses");
  revalidatePath(`/open-house/${input.slug}`);
  return { ok: true, slug: input.slug };
}

export async function updateOpenHouse(
  id: string,
  input: OpenHouseInput,
): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  // Keep the linked RSVP form's title + slug in sync if the open house
  // heading or slug changed.
  const { data: existing } = await supabase
    .from("open_houses")
    .select("form_id, slug")
    .eq("id", id)
    .single();
  if (existing?.form_id) {
    await supabase
      .from("forms")
      .update({
        slug: `open-house-${input.slug}`,
        title: `RSVP — ${input.heading}`,
        description: `Sign up to attend the open house at ${input.address}.`,
      })
      .eq("id", existing.form_id);
  }

  const { error } = await supabase
    .from("open_houses")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/open-houses");
  if (existing?.slug) revalidatePath(`/open-house/${existing.slug}`);
  revalidatePath(`/open-house/${input.slug}`);
  return { ok: true, slug: input.slug };
}

export async function deleteOpenHouse(id: string): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  // Drop the linked RSVP form too.
  const { data: row } = await supabase
    .from("open_houses")
    .select("form_id, slug")
    .eq("id", id)
    .single();
  if (row?.form_id) {
    await supabase.from("forms").delete().eq("id", row.form_id);
  }

  const { error } = await supabase.from("open_houses").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/open-houses");
  if (row?.slug) revalidatePath(`/open-house/${row.slug}`);
  return { ok: true };
}

export async function navigateToEditor(slug: string) {
  redirect(`/admin/open-houses/${slug}`);
}
