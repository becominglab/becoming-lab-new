import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/mypage?error=strava_denied", request.url)
    );
  }

  // Exchange code for token
  const tokenResponse = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(
      new URL("/mypage?error=strava_token_failed", request.url)
    );
  }

  const tokenData = await tokenResponse.json();

  // Save to Supabase
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/mypage?error=not_authenticated", request.url)
    );
  }

  const { error: upsertError } = await supabase
    .from("device_integrations")
    .upsert(
      {
        user_id: user.id,
        provider: "strava",
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(
          tokenData.expires_at * 1000
        ).toISOString(),
        athlete_id: String(tokenData.athlete?.id ?? ""),
        connected_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

  if (upsertError) {
    return NextResponse.redirect(
      new URL("/mypage?error=strava_save_failed", request.url)
    );
  }

  return NextResponse.redirect(new URL("/mypage?success=strava", request.url));
}
