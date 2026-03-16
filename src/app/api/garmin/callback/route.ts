import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const GARMIN_TOKEN_URL = "https://connectapi.garmin.com/oauth-service/oauth/token";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/mypage?error=garmin_denied", request.url)
    );
  }

  const tokenResponse = await fetch(GARMIN_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GARMIN_CLIENT_ID!,
      client_secret: process.env.GARMIN_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.GARMIN_REDIRECT_URI!,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(
      new URL("/mypage?error=garmin_token_failed", request.url)
    );
  }

  const tokenData = await tokenResponse.json();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/mypage?error=not_authenticated", request.url)
    );
  }

  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
    : null;

  const { error: upsertError } = await supabase
    .from("device_integrations")
    .upsert(
      {
        user_id: user.id,
        provider: "garmin",
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token ?? null,
        token_expires_at: expiresAt,
        connected_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

  if (upsertError) {
    return NextResponse.redirect(
      new URL("/mypage?error=garmin_save_failed", request.url)
    );
  }

  return NextResponse.redirect(new URL("/mypage?success=garmin", request.url));
}
