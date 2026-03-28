import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/body/tanita
 * Returns: { connected: boolean, weight_kg?: number, measured_at?: string }
 *
 * If user has Health Planet connected, fetch today's weight from health_measurements
 * or fall back to the latest measurement within the last 7 days.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  // Check if Health Planet is connected
  const { data: integration } = await supabase
    .from("device_integrations")
    .select("access_token, connected_at")
    .eq("user_id", user.id)
    .eq("provider", "healthplanet")
    .maybeSingle();

  if (!integration) {
    return NextResponse.json({ connected: false });
  }

  // Try to get today's weight from health_measurements
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const { data: measurement } = await supabase
    .from("health_measurements")
    .select("weight_kg, measured_at")
    .eq("user_id", user.id)
    .gte("measured_at", `${weekAgoStr}T00:00:00Z`)
    .lte("measured_at", `${today}T23:59:59Z`)
    .not("weight_kg", "is", null)
    .order("measured_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (measurement?.weight_kg) {
    return NextResponse.json({
      connected: true,
      weight_kg: Number(measurement.weight_kg),
      measured_at: measurement.measured_at,
    });
  }

  return NextResponse.json({ connected: true, weight_kg: null });
}

/**
 * POST /api/body/tanita
 * Triggers a sync from Health Planet API and returns latest weight.
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data: integration } = await supabase
    .from("device_integrations")
    .select("access_token")
    .eq("user_id", user.id)
    .eq("provider", "healthplanet")
    .maybeSingle();

  if (!integration) {
    return NextResponse.json({ error: "not_connected" }, { status: 404 });
  }

  // Fetch latest data from Health Planet API
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const formatHpDate = (d: Date): string => {
    const yyyy = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const HH = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  };

  const params = new URLSearchParams({
    access_token: integration.access_token,
    date: "1",
    from: formatHpDate(weekAgo),
    to: formatHpDate(now),
    tag: "6021", // weight only
  });

  try {
    const res = await fetch(`https://www.healthplanet.jp/status/innerscan.json?${params}`);
    if (!res.ok) {
      return NextResponse.json({ error: "healthplanet_api_failed" }, { status: 502 });
    }

    const raw = await res.json();
    interface HpEntry { date: string; keydata: string; tag: string }
    const entries: HpEntry[] = raw.data ?? [];

    // Get the latest weight entry
    const sorted = entries
      .filter((e: HpEntry) => e.tag === "6021")
      .sort((a: HpEntry, b: HpEntry) => b.date.localeCompare(a.date));

    if (sorted.length === 0) {
      return NextResponse.json({ connected: true, weight_kg: null, synced: true });
    }

    const latest = sorted[0];
    const weightKg = parseFloat(latest.keydata);
    const dateKey = latest.date.slice(0, 8);
    const isoDate = `${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6, 8)}`;

    // Upsert to health_measurements
    await supabase.from("health_measurements").upsert({
      user_id: user.id,
      measured_at: `${isoDate}T00:00:00Z`,
      weight_kg: weightKg,
      source: "healthplanet",
    }, { onConflict: "user_id,measured_at,source" });

    return NextResponse.json({
      connected: true,
      weight_kg: weightKg,
      measured_at: `${isoDate}T00:00:00Z`,
      synced: true,
    });
  } catch (e) {
    console.error("[body/tanita] sync error:", e);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}
