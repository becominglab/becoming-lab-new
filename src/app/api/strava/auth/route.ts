import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize";

export async function GET(request: NextRequest) {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = process.env.STRAVA_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Strava OAuth is not configured" },
      { status: 500 }
    );
  }

  // 認証チェック
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(
      new URL("/login?redirect=/mypage", request.url)
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "read,activity:read_all",
  });

  return NextResponse.redirect(`${STRAVA_AUTH_URL}?${params.toString()}`);
}
