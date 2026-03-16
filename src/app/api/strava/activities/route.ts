import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const STRAVA_API = "https://www.strava.com/api/v3";

/**
 * Strava のアクティビティを取得
 * GET /api/strava/activities?page=1&per_page=30&sync=true
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = Math.min(parseInt(searchParams.get("per_page") ?? "10", 10), 50);
  const syncToDb = searchParams.get("sync") === "true";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data: integration } = await supabase
    .from("device_integrations")
    .select("access_token, refresh_token, token_expires_at")
    .eq("user_id", user.id)
    .eq("provider", "strava")
    .maybeSingle();

  if (!integration) {
    return NextResponse.json({ error: "not_connected" }, { status: 404 });
  }

  let accessToken = integration.access_token;

  // トークンの有効期限チェック＆リフレッシュ
  if (
    integration.token_expires_at &&
    new Date(integration.token_expires_at) < new Date()
  ) {
    const refreshRes = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: integration.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!refreshRes.ok) {
      return NextResponse.json(
        { error: "token_refresh_failed" },
        { status: 502 }
      );
    }

    const refreshData = await refreshRes.json();
    accessToken = refreshData.access_token;

    await supabase
      .from("device_integrations")
      .update({
        access_token: refreshData.access_token,
        refresh_token: refreshData.refresh_token,
        token_expires_at: new Date(
          refreshData.expires_at * 1000
        ).toISOString(),
      })
      .eq("user_id", user.id)
      .eq("provider", "strava");
  }

  // Stravaからアクティビティを取得
  const res = await fetch(
    `${STRAVA_API}/athlete/activities?per_page=${perPage}&page=${page}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "strava_api_failed" },
      { status: res.status }
    );
  }

  const activities = await res.json();

  const simplified = activities.map(
    (a: {
      id: number;
      name: string;
      type: string;
      sport_type: string;
      start_date_local: string;
      distance: number;
      moving_time: number;
      elapsed_time: number;
      total_elevation_gain: number;
      average_heartrate?: number;
      max_heartrate?: number;
      average_speed: number;
      kudos_count: number;
    }) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      sportType: a.sport_type,
      date: a.start_date_local,
      distance: Math.round(a.distance) / 1000,
      movingTime: a.moving_time,
      elapsedTime: a.elapsed_time,
      elevationGain: a.total_elevation_gain,
      avgHeartrate: a.average_heartrate ?? null,
      maxHeartrate: a.max_heartrate ?? null,
      avgSpeed: a.average_speed,
      kudosCount: a.kudos_count,
    })
  );

  // DBに同期（upsert）
  if (syncToDb && simplified.length > 0) {
    const upsertRows = simplified.map((a: {
      id: number;
      name: string;
      type: string;
      sportType: string;
      date: string;
      distance: number;
      movingTime: number;
      elevationGain: number;
      avgHeartrate: number | null;
    }) => ({
      user_id: user.id,
      date: a.date.split("T")[0],
      activity_type: a.sportType || a.type,
      name: a.name,
      distance_km: a.distance,
      duration_minutes: Math.round(a.movingTime / 60),
      heart_rate_avg: a.avgHeartrate ? Math.round(a.avgHeartrate) : null,
      elevation_m: a.elevationGain,
      source: "strava",
      strava_activity_id: a.id,
    }));

    await supabase
      .from("activity_logs")
      .upsert(upsertRows, { onConflict: "strava_activity_id" });
  }

  return NextResponse.json({ activities: simplified, page, perPage });
}
