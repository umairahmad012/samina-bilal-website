import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import SectionEditor from "@/components/admin/content/SectionEditor";
import {
  findSection,
  defaultValueFor,
  PAGE_ORDER,
  type PageKey,
} from "@/lib/contentRegistry";
import type { LibraryItem } from "@/components/admin/media/ImagePicker";

export default async function ContentSectionEditorPage({
  params,
}: {
  params: Promise<{ page: string; section: string }>;
}) {
  const { page: pageParam, section: sectionKey } = await params;
  if (!PAGE_ORDER.includes(pageParam as PageKey)) notFound();
  const page = pageParam as PageKey;

  const def = findSection(page, sectionKey);
  if (!def) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Read current saved value (if any)
  const { data: row } = await supabase
    .from("content_blocks")
    .select("value")
    .eq("page", page)
    .eq("key", sectionKey)
    .maybeSingle();

  const fallback = defaultValueFor(def) as Record<string, unknown>;
  let initial: Record<string, unknown> = fallback;
  if (row?.value) {
    try {
      const parsed = JSON.parse(row.value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        initial = parsed;
      }
    } catch {
      // keep fallback
    }
  }

  // Pull the media library for any image fields in this section
  const { data: media } = await supabase
    .from("media")
    .select("id, cloudinary_public_id, url, alt")
    .eq("kind", "image")
    .order("uploaded_at", { ascending: false });

  return (
    <AdminShell user={{ email: user.email ?? "" }}>
      <SectionEditor
        section={def}
        initialValue={initial}
        defaultValue={fallback}
        pageHref={`/admin/content/${page}`}
        library={(media ?? []) as LibraryItem[]}
      />
    </AdminShell>
  );
}
