import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import PartnersManager, {
  type CategoryRow,
  type PartnerRow,
} from "@/components/admin/partners/PartnersManager";

export default async function PartnersAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ data: cats }, { data: partners }] = await Promise.all([
    supabase
      .from("partner_categories")
      .select("id, title, description, display_order, is_visible")
      .order("display_order", { ascending: true }),
    supabase
      .from("partners")
      .select(
        "id, category_id, name, role, company, phone, email, display_order, is_visible",
      )
      .order("display_order", { ascending: true }),
  ]);

  return (
    <AdminShell user={{ email: user.email ?? "" }}>
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-ink/55 hover:text-ink mb-6"
        >
          <ArrowLeft size={14} /> Back to Site Editor
        </Link>
        <p
          className="text-[0.65rem] tracking-[0.32em] uppercase text-ink/55 mb-3"
          style={{ fontWeight: 500 }}
        >
          Site Editor · Trusted Partners
        </p>
        <h1
          className="text-2xl md:text-3xl text-ink mb-2"
          style={{ fontWeight: 300, letterSpacing: "0.04em" }}
        >
          Lenders, inspectors, trades.
        </h1>
        <p className="text-sm text-ink/65 max-w-2xl mb-8">
          Manage the categories shown on the Trusted Partners page and the
          contacts inside each. Add, edit, reorder, hide.
        </p>

        <PartnersManager
          categories={(cats ?? []) as CategoryRow[]}
          partners={(partners ?? []) as PartnerRow[]}
        />
      </div>
    </AdminShell>
  );
}
