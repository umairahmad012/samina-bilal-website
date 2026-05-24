"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CropArea } from "@/components/admin/media/CropEditor";

type Result = { ok: true } | { ok: false; error: string };

export type ClosingInput = {
  image_id: string | null;
  image_crop: CropArea | null;
  neighborhood: string;
  city: string;
  state: string;
  closed_year: number;
  is_visible: boolean;
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createClosing(input: ClosingInput): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  // Prepend at TOP — the newest closing should appear first on the
  // homepage gallery (which slices items[0..5]) and at the start of
  // the /closings page. We shift every existing row's display_order
  // down by 1, then insert the new row at display_order = 0.
  // Admin can still fine-tune the order with the up/down arrows.
  const { data: all } = await supabase
    .from("closings")
    .select("id, display_order")
    .order("display_order", { ascending: true });

  if (all && all.length > 0) {
    // Update in DESC order to avoid unique-index collisions if one
    // is ever added later. Currently there's no UNIQUE on
    // display_order, but this is safe regardless.
    const shifts = [...all]
      .sort((a, b) => b.display_order - a.display_order)
      .map((c) =>
        supabase
          .from("closings")
          .update({ display_order: c.display_order + 1 })
          .eq("id", c.id),
      );
    const results = await Promise.all(shifts);
    const firstErr = results.find((r) => r.error);
    if (firstErr?.error) return { ok: false, error: firstErr.error.message };
  }

  const { error } = await supabase
    .from("closings")
    .insert({ ...input, display_order: 0 });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/closings");
  revalidatePath("/closings");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateClosing(
  id: string,
  input: ClosingInput,
): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("closings").update(input).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/closings");
  revalidatePath("/closings");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteClosing(id: string): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("closings").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/closings");
  revalidatePath("/closings");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function reorderClosings(orderedIds: string[]): Promise<Result> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const updates = orderedIds.map((id, idx) =>
    supabase.from("closings").update({ display_order: idx }).eq("id", id),
  );
  const results = await Promise.all(updates);
  const firstErr = results.find((r) => r.error);
  if (firstErr?.error) return { ok: false, error: firstErr.error.message };

  revalidatePath("/admin/closings");
  revalidatePath("/closings");
  revalidatePath("/", "layout");
  return { ok: true };
}
