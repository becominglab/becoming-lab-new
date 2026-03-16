import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/home/:path*",
    "/mypage/:path*",
    "/profile/:path*",
    "/api/strava/:path*",
    "/api/healthplanet/:path*",
    "/api/garmin/:path*",
    "/api/coros/:path*",
  ],
};
