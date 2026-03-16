import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const COROS_TOKEN_URL = "https://open.coros.com/oauth2/accesstoken";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/mypage?error=coros_denied", request.url)
    );
  }

  const tokenResponse = await fetch(COROS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.COROS_CLIENT_ID,
      client_secret: process.env.COROS_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.COROS_REDIRECT_URI,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(
      new URL("/mypage?error=coros_token_failed", request.url)
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
        provider: "coros",
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token ?? null,
        token_expires_at: expiresAt,
        connected_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

  if (upsertError) {
    return NextResponse.redirect(
      new URL("/mypage?error=coros_save_failed", request.url)
    );
  }

  return NextResponse.redirect(new URL("/mypage?success=coros", request.url));
}
