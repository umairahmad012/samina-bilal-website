/**
 * Partners loader — reads partner_categories + partners (joined by category)
 * and falls back to the static `content.partners.categories` if DB unavailable.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { content } from "./content";

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

export type PartnerContact = {
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
};

export type PartnerCategory = {
  title: string;
  body: string;
  contacts: PartnerContact[];
};

type CatRow = {
  id: string;
  title: string;
  description: string | null;
  display_order: number;
};

type PartnerRow = {
  id: string;
  category_id: string | null;
  name: string;
  role: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  display_order: number;
};

export async function getPartnerCategories(): Promise<PartnerCategory[]> {
  try {
    const supabase = client();
    if (!supabase) return content.partners.categories;

    const [{ data: cats }, { data: partners }] = await Promise.all([
      supabase
        .from("partner_categories")
        .select("id, title, description, display_order")
        .eq("is_visible", true)
        .order("display_order", { ascending: true }),
      supabase
        .from("partners")
        .select(
          "id, category_id, name, role, company, phone, email, display_order",
        )
        .eq("is_visible", true)
        .order("display_order", { ascending: true }),
    ]);

    if (!cats || cats.length === 0) return content.partners.categories;

    const byCategory = new Map<string, PartnerRow[]>();
    for (const p of (partners ?? []) as PartnerRow[]) {
      if (!p.category_id) continue;
      const arr = byCategory.get(p.category_id) ?? [];
      arr.push(p);
      byCategory.set(p.category_id, arr);
    }

    return (cats as CatRow[]).map((cat) => ({
      title: cat.title,
      body: cat.description ?? "",
      contacts: (byCategory.get(cat.id) ?? []).map((p) => ({
        name: p.name,
        role: p.role ?? "",
        company: p.company ?? "",
        phone: p.phone ?? "",
        email: p.email ?? "",
      })),
    }));
  } catch {
    return content.partners.categories;
  }
}
