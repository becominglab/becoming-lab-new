import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options as Record<string, unknown>);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 保護されたページで未認証 → ログインへリダイレクト
  const protectedPages = ["/home", "/mypage", "/profile"];
  const isProtectedPage = protectedPages.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 保護されたAPIで未認証 → 401
  const protectedApis = [
    "/api/strava",
    "/api/healthplanet",
    "/api/integrations",
    "/api/activities",
    "/api/health",
  ];
  const isProtectedApi = protectedApis.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!user && isProtectedApi) {
    return NextResponse.json(
      { error: "not_authenticated" },
      { status: 401 }
    );
  }

  return supabaseResponse;
}
