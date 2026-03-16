import { NextResponse } from "next/server";

/**
 * Garmin Health API OAuth
 * 注意: Garmin Health API はパートナー契約が必要です。
 * 契約後に発行される client_id / secret を .env.local に設定してください。
 * 現在は OAuth 2.0 フローで実装しています。
 */
const GARMIN_AUTH_URL = "https://connect.garmin.com/oauthConfirm";

export async function GET() {
  const clientId = process.env.GARMIN_CLIENT_ID;
  const redirectUri = process.env.GARMIN_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Garmin OAuth is not configured" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "activity_detail,daily_detail,body_composition",
  });

  return NextResponse.redirect(`${GARMIN_AUTH_URL}?${params.toString()}`);
}
