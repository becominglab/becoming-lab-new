import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const HEALTHPLANET_API = "https://www.healthplanet.jp/status";

/**
 * HealthPlanet (TANITA) の体組成データを取得
 * GET /api/healthplanet/data
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data: integration } = await supabase
    .from("device_integrations")
    .select("access_token")
    .eq("user_id", user.id)
    .eq("provider", "healthplanet")
    .maybeSingle();

  if (!integration) {
    return NextResponse.json({ error: "not_connected" }, { status: 404 });
  }

  // 過去30日分の体組成データを取得
  const now = new Date();
  const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const formatDate = (d: Date) =>
    d.toISOString().slice(0, 10).replace(/-/g, "");

  const params = new URLSearchParams({
    access_token: integration.access_token,
    date: "1", // 日付指定モード
    from: formatDate(from),
    to: formatDate(now),
    tag: "6021,6022,6023,6024,6025,6026,6027,6028,6029",
    // 6021:体重, 6022:体脂肪率, 6023:筋肉量, 6024:筋肉スコア
    // 6025:内臓脂肪レベル, 6026:基礎代謝量, 6027:体内年齢
    // 6028:推定骨量, 6029:BMI
  });

  const res = await fetch(`${HEALTHPLANET_API}/innerscan.json?${params}`);

  if (!res.ok) {
    return NextResponse.json(
      { error: "healthplanet_api_failed" },
      { status: res.status }
    );
  }

  const raw = await res.json();

  // タグ名の日本語マッピング
  const tagNames: Record<string, string> = {
    "6021": "体重",
    "6022": "体脂肪率",
    "6023": "筋肉量",
    "6024": "筋肉スコア",
    "6025": "内臓脂肪レベル",
    "6026": "基礎代謝量",
    "6027": "体内年齢",
    "6028": "推定骨量",
    "6029": "BMI",
  };

  const tagUnits: Record<string, string> = {
    "6021": "kg",
    "6022": "%",
    "6023": "kg",
    "6024": "点",
    "6025": "",
    "6026": "kcal",
    "6027": "歳",
    "6028": "kg",
    "6029": "",
  };

  // 最新値を抽出（タグごとに最新の1件）
  const latestByTag: Record<
    string,
    { value: string; date: string; label: string; unit: string }
  > = {};

  if (raw.data && Array.isArray(raw.data)) {
    for (const entry of raw.data) {
      const tag = entry.tag;
      if (
        !latestByTag[tag] ||
        entry.date > latestByTag[tag].date
      ) {
        latestByTag[tag] = {
          value: entry.keydata,
          date: entry.date,
          label: tagNames[tag] ?? tag,
          unit: tagUnits[tag] ?? "",
        };
      }
    }
  }

  return NextResponse.json({
    latest: Object.values(latestByTag),
    raw: raw.data ?? [],
  });
}
