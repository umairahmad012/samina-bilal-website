import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import CommunityForm from "@/components/admin/communities/CommunityForm";
import type { CommunityInput } from "@/app/admin/communities/actions";
import type { LibraryItem } from "@/components/admin/media/ImagePicker";

export default async function EditCommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: row } = await supabase
    .from("communities")
    .select(
      `id, slug, name, state, tagline, about, market_year_summary, samina_quote,
       median_price, yoy_change, yoy_direction, days_on_market, market_type,
       data_year, image_id, hero_image_id, is_visible, price_tiers, life`,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!row) notFound();

  const { data: media } = await supabase
    .from("media")
    .select("id, cloudinary_public_id, url, alt")
    .eq("kind", "image")
    .order("uploaded_at", { ascending: false });

  const initial: CommunityInput = {
    slug: row.slug,
    name: row.name,
    state: row.state,
    tagline: row.tagline ?? "",
    about: row.about ?? "",
    market_year_summary: row.market_year_summary ?? "",
    samina_quote: row.samina_quote ?? "",
    median_price: row.median_price ?? "",
    yoy_change: row.yoy_change ?? "",
    yoy_direction: (row.yoy_direction ?? "flat") as CommunityInput["yoy_direction"],
    days_on_market: row.days_on_market ?? "",
    market_type: row.market_type ?? "Balanced",
    data_year: row.data_year ?? new Date().getFullYear(),
    image_id: row.image_id ?? null,
    hero_image_id: row.hero_image_id ?? null,
    is_visible: row.is_visible ?? true,
    price_tiers: Array.isArray(row.price_tiers)
      ? (row.price_tiers as CommunityInput["price_tiers"])
      : [],
    life:
      row.life && typeof row.life === "object" && !Array.isArray(row.life)
        ? (row.life as CommunityInput["life"])
        : { schools: "", parks: "", dining: "", commute: "" },
  };

  return (
    <AdminShell user={{ email: user.email ?? "" }}>
      <CommunityForm
        existingId={row.id as string}
        initial={initial}
        library={(media ?? []) as LibraryItem[]}
      />
    </AdminShell>
  );
}
