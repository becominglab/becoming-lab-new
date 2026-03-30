import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Supabase が未設定の場合はスキップ
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/login",
    "/home/:path*",
    "/mypage/:path*",
    "/profile/:path*",
    "/api/strava/:path*",
    "/api/healthplanet/:path*",
    "/api/integrations/:path*",
    "/api/activities/:path*",
    "/api/health/:path*",
    "/api/auth/:path*",
    "/body/:path*",
    "/api/body/:path*",
    "/sns/:path*",
    "/api/sns/:path*",
  ],
};
