import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const HEALTHPLANET_AUTH_URL =
  "https://www.healthplanet.jp/oauth/auth";

export async function GET(request: NextRequest) {
  const clientId = process.env.HEALTHPLANET_CLIENT_ID;
  const redirectUri = process.env.HEALTHPLANET_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "HealthPlanet OAuth is not configured" },
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
    scope: "innerscan",
  });

  return NextResponse.redirect(
    `${HEALTHPLANET_AUTH_URL}?${params.toString()}`
  );
}
