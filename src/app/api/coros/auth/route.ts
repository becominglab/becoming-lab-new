import { NextResponse } from "next/server";

/**
 * COROS Open Platform OAuth 2.0
 * https://open.coros.com にてアプリ登録が必要です。
 */
const COROS_AUTH_URL = "https://open.coros.com/oauth2/authorize";

export async function GET() {
  const clientId = process.env.COROS_CLIENT_ID;
  const redirectUri = process.env.COROS_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "COROS OAuth is not configured" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
  });

  return NextResponse.redirect(`${COROS_AUTH_URL}?${params.toString()}`);
}
