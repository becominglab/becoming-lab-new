"use client";

type LatestEntry = {
  tag: string;
  label: string;
  value: string;
  unit: string;
  date: string;
  change: number | null;
};

type Props = {
  data: LatestEntry[];
};

// 表示優先順（主要→補助）
const TAG_ORDER = [
  "6021", // 体重
  "6022", // 体脂肪率
  "6023", // 筋肉量
  "6027", // 基礎代謝量
  "6026", // 内臓脂肪レベル
  "6028", // 体内年齢
  "6029", // 推定骨量
  "6024", // 筋肉スコア
  "6025", // 内臓脂肪レベル2
];

// 変動の正負で良い方向を示すかどうか（体重↓=良い、筋肉量↑=良い）
const LOWER_IS_BETTER: Record<string, boolean> = {
  "6021": true, // 体重
  "6022": true, // 体脂肪率
  "6025": true, // 内臓脂肪
  "6026": true, // 内臓脂肪
  "6028": true, // 体内年齢
};

export default function HealthLatestCards({ data }: Props) {
  const sorted = [...data].sort((a, b) => {
    const ai = TAG_ORDER.indexOf(a.tag);
    const bi = TAG_ORDER.indexOf(b.tag);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  // 主要4値
  const primaryTags = ["6021", "6022", "6023", "6027"];
  const primary = sorted.filter((e) => primaryTags.includes(e.tag));
  const secondary = sorted.filter((e) => !primaryTags.includes(e.tag));

  return (
    <div className="space-y-4">
      {/* 主要値（大きいカード） */}
      <div className="grid grid-cols-2 gap-3">
        {primary.map((entry) => (
          <div
            key={entry.tag}
            className="p-5 bg-white border border-stone-200 rounded-xl"
          >
            <p className="text-xs text-stone-400 mb-2">{entry.label}</p>
            <div className="flex items-end gap-1.5">
              <p className="text-3xl font-bold text-gray-900">
                {formatValue(entry.value)}
              </p>
              <p className="text-sm text-stone-500 mb-0.5">{entry.unit}</p>
            </div>
            {entry.change !== null && entry.change !== 0 && (
              <ChangeIndicator
                change={entry.change}
                unit={entry.unit}
                lowerIsBetter={!!LOWER_IS_BETTER[entry.tag]}
              />
            )}
          </div>
        ))}
      </div>

      {/* 補助値（小さいカード） */}
      {secondary.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {secondary.map((entry) => (
            <div
              key={entry.tag}
              className="p-3 bg-stone-50 rounded-lg text-center"
            >
              <p className="text-[10px] text-stone-400 mb-1">{entry.label}</p>
              <p className="text-lg font-bold text-gray-900">
                {formatValue(entry.value)}
              </p>
              {entry.unit && (
                <p className="text-[10px] text-stone-500">{entry.unit}</p>
              )}
              {entry.change !== null && entry.change !== 0 && (
                <ChangeIndicator
                  change={entry.change}
                  unit={entry.unit}
                  lowerIsBetter={!!LOWER_IS_BETTER[entry.tag]}
                  small
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatValue(val: string): string {
  const n = parseFloat(val);
  if (isNaN(n)) return val;
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(1);
}

function ChangeIndicator({
  change,
  unit,
  lowerIsBetter,
  small = false,
}: {
  change: number;
  unit: string;
  lowerIsBetter: boolean;
  small?: boolean;
}) {
  const isPositive = change > 0;
  const isGood = lowerIsBetter ? !isPositive : isPositive;
  const arrow = isPositive ? "↑" : "↓";
  const color = isGood ? "text-green-600" : "text-red-500";

  return (
    <p className={`${small ? "text-[10px]" : "text-xs"} ${color} mt-1`}>
      {arrow} {Math.abs(change).toFixed(1)}
      {unit && ` ${unit}`}
    </p>
  );
}
