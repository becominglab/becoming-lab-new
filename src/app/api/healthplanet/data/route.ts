import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const HEALTHPLANET_API = "https://www.healthplanet.jp/status";

/**
 * HealthPlanet (TANITA) の体組成データを取得
 * GET /api/healthplanet/data?days=30&sync=true
 *
 * HealthPlanet API仕様: https://www.healthplanet.jp/apis/api.html
 * 日付フォーマット: yyyyMMddHHmmss (14桁)
 * レート制限: 60リクエスト/時間
 */

// 公式APIドキュメント通りのタグマッピング
const TAG_NAMES: Record<string, string> = {
  "6021": "体重",
  "6022": "体脂肪率",
  "6023": "筋肉量",
  "6024": "筋肉スコア",
  "6025": "内臓脂肪レベル2",
  "6026": "内臓脂肪レベル",
  "6027": "基礎代謝量",
  "6028": "体内年齢",
  "6029": "推定骨量",
};

const TAG_UNITS: Record<string, string> = {
  "6021": "kg",
  "6022": "%",
  "6023": "kg",
  "6024": "点",
  "6025": "",
  "6026": "",
  "6027": "kcal",
  "6028": "歳",
  "6029": "kg",
};

// HealthPlanet日付フォーマット: yyyyMMddHHmmss
function formatHpDate(d: Date): string {
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}

// HealthPlanet日付文字列 → ISO日付
function hpDateToIso(hpDate: string): string {
  // "20260315120000" → "2026-03-15T12:00:00"
  const y = hpDate.slice(0, 4);
  const M = hpDate.slice(4, 6);
  const d = hpDate.slice(6, 8);
  const H = hpDate.slice(8, 10);
  const m = hpDate.slice(10, 12);
  const s = hpDate.slice(12, 14);
  return `${y}-${M}-${d}T${H}:${m}:${s}`;
}

type HpDataEntry = {
  date: string;
  keydata: string;
  tag: string;
  model: string;
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Math.min(parseInt(searchParams.get("days") ?? "30", 10), 365);
  const syncToDb = searchParams.get("sync") === "true";

  const { data: integration } = await supabase
    .from("device_integrations")
    .select("access_token")
    .eq("user_id", user.id)
    .eq("provider", "healthplanet")
    .maybeSingle();

  if (!integration) {
    return NextResponse.json({ error: "not_connected" }, { status: 404 });
  }

  // 指定日数分の体組成データを取得
  const now = new Date();
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    access_token: integration.access_token,
    date: "1", // 測定日基準
    from: formatHpDate(from),
    to: formatHpDate(now),
    tag: "6021,6022,6023,6024,6025,6026,6027,6028,6029",
  });

  const res = await fetch(`${HEALTHPLANET_API}/innerscan.json?${params}`);

  if (!res.ok) {
    return NextResponse.json(
      { error: "healthplanet_api_failed" },
      { status: res.status }
    );
  }

  const raw = await res.json();
  const entries: HpDataEntry[] = raw.data ?? [];

  // 最新値を抽出（タグごとに最新の1件）
  const latestByTag: Record<string, { value: string; date: string }> = {};
  const previousByTag: Record<string, { value: string; date: string }> = {};

  // 日付の降順でソート
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  for (const entry of sorted) {
    const tag = entry.tag;
    if (!latestByTag[tag]) {
      latestByTag[tag] = { value: entry.keydata, date: entry.date };
    } else if (!previousByTag[tag]) {
      previousByTag[tag] = { value: entry.keydata, date: entry.date };
    }
  }

  // 最新値 + 変動情報
  const latest = Object.entries(latestByTag).map(([tag, data]) => {
    const prev = previousByTag[tag];
    const change =
      prev && !isNaN(parseFloat(data.value)) && !isNaN(parseFloat(prev.value))
        ? parseFloat(data.value) - parseFloat(prev.value)
        : null;

    return {
      tag,
      label: TAG_NAMES[tag] ?? tag,
      value: data.value,
      unit: TAG_UNITS[tag] ?? "",
      date: data.date,
      change: change !== null ? Math.round(change * 100) / 100 : null,
    };
  });

  // 履歴データ（日付ごとにグループ化）
  const historyMap = new Map<
    string,
    Record<string, string | number | null>
  >();

  for (const entry of entries) {
    const dateKey = entry.date.slice(0, 8); // yyyyMMdd
    const isoDate = `${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6, 8)}`;

    if (!historyMap.has(isoDate)) {
      historyMap.set(isoDate, { date: isoDate });
    }

    const row = historyMap.get(isoDate)!;
    const val = parseFloat(entry.keydata);

    switch (entry.tag) {
      case "6021":
        row.weight_kg = val;
        break;
      case "6022":
        row.body_fat_pct = val;
        break;
      case "6023":
        row.muscle_mass_kg = val;
        break;
      case "6024":
        row.muscle_score = val;
        break;
      case "6025":
        row.visceral_fat_level2 = val;
        break;
      case "6026":
        row.visceral_fat_level = val;
        break;
      case "6027":
        row.basal_metabolic_rate = val;
        break;
      case "6028":
        row.body_age = val;
        break;
      case "6029":
        row.bone_mass_kg = val;
        break;
    }
  }

  const history = Array.from(historyMap.values()).sort((a, b) =>
    (a.date as string).localeCompare(b.date as string)
  );

  // DBに同期
  if (syncToDb && history.length > 0) {
    const upsertRows = history.map((row) => ({
      user_id: user.id,
      measured_at: `${row.date}T00:00:00Z`,
      weight_kg: row.weight_kg ?? null,
      body_fat_pct: row.body_fat_pct ?? null,
      muscle_mass_kg: row.muscle_mass_kg ?? null,
      muscle_score: row.muscle_score ?? null,
      visceral_fat_level: row.visceral_fat_level ?? null,
      basal_metabolic_rate: row.basal_metabolic_rate ?? null,
      body_age: row.body_age ?? null,
      bone_mass_kg: row.bone_mass_kg ?? null,
      source: "healthplanet",
    }));

    // 一件ずつupsert（日付の重複チェック）
    for (const row of upsertRows) {
      await supabase.from("health_measurements").upsert(row, {
        onConflict: "user_id,measured_at,source",
      });
    }
  }

  return NextResponse.json({
    latest,
    history,
    birthDate: raw.birth_date ?? null,
    height: raw.height ?? null,
    sex: raw.sex ?? null,
  });
}
