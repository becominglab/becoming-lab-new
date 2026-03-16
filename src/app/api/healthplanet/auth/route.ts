import { NextResponse } from "next/server";

const HEALTHPLANET_AUTH_URL =
  "https://www.healthplanet.jp/oauth/auth";

export async function GET() {
  const clientId = process.env.HEALTHPLANET_CLIENT_ID;
  const redirectUri = process.env.HEALTHPLANET_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "HealthPlanet OAuth is not configured" },
      { status: 500 }
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
