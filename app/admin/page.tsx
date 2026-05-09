import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import {
  FileText,
  Image as ImageIcon,
  Home as HomeIcon,
  Star,
  Users,
  Briefcase,
  UsersRound,
  DoorOpen,
} from "lucide-react";
import Link from "next/link";

const editorSections = [
  {
    href: "/admin/content",
    icon: FileText,
    title: "Content",
    description: "Headings, paragraphs, CTAs across every page.",
  },
  {
    href: "/admin/media",
    icon: ImageIcon,
    title: "Media Library",
    description: "Upload, crop, remove backgrounds. Swap images and videos.",
  },
  {
    href: "/admin/communities",
    icon: HomeIcon,
    title: "Communities",
    description: "Edit the 6 neighborhoods and their yearly market data.",
  },
  {
    href: "/admin/closings",
    icon: Briefcase,
    title: "Recent Closings",
    description: "Add and manage closed-sale entries.",
  },
  {
    href: "/admin/open-houses",
    icon: DoorOpen,
    title: "Open Houses",
    description:
      "Build a landing page + printable A4 flyer for each open house. Auto-generates an RSVP form.",
  },
  {
    href: "/admin/reviews",
    icon: Star,
    title: "Reviews",
    description: "Manage testimonials. Pull from Google. Share review link.",
  },
  {
    href: "/admin/partners",
    icon: Users,
    title: "Trusted Partners",
    description: "Lenders, inspectors, insurance, and trades.",
  },
  {
    href: "/admin/team",
    icon: UsersRound,
    title: "Team",
    description: "Invite teammates and manage owner / editor roles.",
  },
];

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in? Render the login form right here at /admin instead of
  // bouncing to a separate /admin/login URL. After login, send the user back
  // to wherever middleware redirected them from (if they were trying to hit
  // a deeper /admin/* route).
  if (!user) {
    const from = (await searchParams)?.from;
    return <AdminLoginForm from={from} />;
  }

  return (
    <AdminShell user={{ email: user.email ?? "" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="mb-10">
          <p
            className="text-[0.65rem] tracking-[0.32em] uppercase text-ink/55 mb-3"
            style={{ fontWeight: 500 }}
          >
            Site Editor
          </p>
          <h1
            className="text-2xl md:text-3xl text-ink mb-2"
            style={{ fontWeight: 300, letterSpacing: "0.04em" }}
          >
            What would you like to update?
          </h1>
          <p className="text-sm text-ink/65 max-w-xl">
            Every change is saved as a draft and published instantly. Version
            history is kept for 30 days — you can roll back any change.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {editorSections.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="admin-card group p-6 hover:border-navy/30 transition-colors flex flex-col"
              >
                <div className="text-navy mb-5">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3
                  className="text-base text-ink mb-1.5"
                  style={{ fontWeight: 500 }}
                >
                  {s.title}
                </h3>
                <p className="text-xs text-ink/65 leading-relaxed flex-1">
                  {s.description}
                </p>
                <span className="text-[0.65rem] tracking-[0.28em] uppercase text-navy mt-5 group-hover:underline underline-offset-4">
                  Open →
                </span>
              </Link>
            );
          })}
        </div>

        {/* Status — what's live and what's next */}
        <div className="mt-10 admin-card p-6 bg-cream-soft/50 border-dashed">
          <p className="text-xs tracking-[0.18em] uppercase text-ink/55 mb-2">
            What&rsquo;s live
          </p>
          <p className="text-sm text-ink/75 leading-relaxed">
            Everything is live. Edit copy, photos, communities, closings,
            reviews, and partners from the cards above. Build new forms in{" "}
            <a href="/admin/forms" className="text-navy underline underline-offset-2">Forms</a>{" "}
            — they auto-publish at <code className="text-[11px]">/form/[slug]</code>{" "}
            and feed{" "}
            <a href="/admin/inbox" className="text-navy underline underline-offset-2">Inbox</a>{" "}
            along with Contact and Sellers Valuation submissions. Public
            review link:{" "}
            <a href="/leave-review" target="_blank" className="text-navy underline underline-offset-2">/leave-review</a>.
          </p>
          <p className="text-xs tracking-[0.18em] uppercase text-ink/55 mt-5 mb-2">
            Coming next
          </p>
          <p className="text-sm text-ink/75 leading-relaxed">
            Team invites, then optional Google My Business review pulls.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
