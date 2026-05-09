import type { ReactNode } from "react";
import "../globals.css";
import "./admin.css";

export const metadata = {
  title: "Admin · Samina Bilal",
};

/**
 * Admin layout — completely overrides the marketing-site layout (no public
 * Header/Footer). Renders the admin shell only when authenticated;
 * middleware bounces anonymous users to /admin/login.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
