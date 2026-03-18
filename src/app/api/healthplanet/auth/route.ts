import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const HEALTHPLANET_AUTH_URL =
  "https://www.healthplanet.jp/oauth/auth";

export async function GET(request: NextRequest) {
  const clientId = process.env.HEALTHPLANET_CLIENT_ID?.trim();
  const redirectUri = process.env.HEALTHPLANET_REDIRECT_URI?.trim();

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

  // HealthPlanet API requires redirect_uri to be encoded with encodeURIComponent
  // (URLSearchParams encodes differently and HealthPlanet rejects it)
  const authUrl = `${HEALTHPLANET_AUTH_URL}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=innerscan`;

  return NextResponse.redirect(authUrl);
}
