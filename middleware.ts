/**
 * Middleware — refreshes Supabase auth session on every request and protects
 * /admin routes. Unauthenticated users hitting /admin are bounced to /admin/login.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Skip if Supabase isn't configured yet (lets the rest of the site work
  // before the admin panel is set up). Once env vars exist, /admin guards on.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAdmin = path.startsWith("/admin");
  const isAdminRoot = path === "/admin"; // root renders login OR dashboard
  const isAdminLogin = path === "/admin/login"; // legacy route → redirects to /admin
  const isAdminSignup = path === "/admin/signup";
  const isAdminPublic = isAdminRoot || isAdminLogin || isAdminSignup;

  // Block access to deeper /admin/* routes without auth — bounce to /admin
  // (which renders the login form). /admin itself, /admin/login, and
  // /admin/signup are always reachable.
  if (isAdmin && !isAdminPublic && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("from", path);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from /admin/signup (they already have
  // an account) and from the legacy /admin/login URL.
  if ((isAdminLogin || isAdminSignup) && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.delete("from");
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Run middleware on /admin and on auth callback routes; skip static assets.
    "/((?!_next/static|_next/image|favicon.ico|images/|videos/|closings/).*)",
  ],
};
