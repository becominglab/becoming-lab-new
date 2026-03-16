import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 全連携ステータスを一括取得する API
 * GET /api/integrations/status
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ integrations: [] });
  }

  const { data: integrations } = await supabase
    .from("device_integrations")
    .select("provider, connected_at, token_expires_at, athlete_id")
    .eq("user_id", user.id);

  const result = (integrations ?? []).map((i: { provider: string; connected_at: string; token_expires_at: string | null; athlete_id: string | null }) => ({
    provider: i.provider,
    connected: true,
    connectedAt: i.connected_at,
    tokenExpired: i.token_expires_at
      ? new Date(i.token_expires_at) < new Date()
      : false,
    athleteId: i.athlete_id,
  }));

  return NextResponse.json({ integrations: result });
}
