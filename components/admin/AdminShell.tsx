"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutTemplate,
  Inbox,
  ClipboardList,
  LogOut,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

const tabs = [
  { label: "Site Editor", href: "/admin", icon: LayoutTemplate },
  { label: "Inbox", href: "/admin/inbox", icon: Inbox },
  { label: "Forms", href: "/admin/forms", icon: ClipboardList },
];

export default function AdminShell({
  user,
  children,
}: {
  user: { email: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-black/8 px-5 md:px-8 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 -ml-1.5 rounded hover:bg-black/5"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
          <Link
            href="/admin"
            className="text-base text-ink"
            style={{ fontWeight: 300, letterSpacing: "0.06em" }}
          >
            Samina&nbsp;Bilal · Admin
          </Link>
        </div>

        {/* Desktop tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((t) => {
            const active =
              t.href === "/admin"
                ? pathname === "/admin" ||
                  (pathname.startsWith("/admin") &&
                    !pathname.startsWith("/admin/inbox") &&
                    !pathname.startsWith("/admin/forms"))
                : pathname.startsWith(t.href);
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn("admin-tab", active && "active")}
              >
                <Icon size={15} strokeWidth={1.75} />
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-ink/55">{user.email}</span>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-ink/70 hover:text-ink rounded hover:bg-black/5"
            title="Sign out"
          >
            <LogOut size={14} strokeWidth={1.75} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Mobile slide-down nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-black/8 px-5 py-4 space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setMobileOpen(false)}
                className="admin-tab w-full justify-start"
              >
                <Icon size={15} strokeWidth={1.75} />
                {t.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
