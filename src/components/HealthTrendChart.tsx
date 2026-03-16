"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type HistoryRow = Record<string, string | number | null>;

type Props = {
  history: HistoryRow[];
};

type MetricConfig = {
  key: string;
  label: string;
  unit: string;
  color: string;
};

const METRICS: MetricConfig[] = [
  { key: "weight_kg", label: "体重", unit: "kg", color: "#1B6B7A" },
  { key: "body_fat_pct", label: "体脂肪率", unit: "%", color: "#E8804C" },
  { key: "muscle_mass_kg", label: "筋肉量", unit: "kg", color: "#4CAF50" },
  {
    key: "basal_metabolic_rate",
    label: "基礎代謝",
    unit: "kcal",
    color: "#9C27B0",
  },
  {
    key: "visceral_fat_level",
    label: "内臓脂肪",
    unit: "",
    color: "#FF5722",
  },
  { key: "body_age", label: "体内年齢", unit: "歳", color: "#2196F3" },
];

export default function HealthTrendChart({ history }: Props) {
  const [selected, setSelected] = useState("weight_kg");

  const metric = METRICS.find((m) => m.key === selected) ?? METRICS[0];

  // 選択指標のデータがあるエントリのみ
  const chartData = history
    .filter((row) => row[selected] != null)
    .map((row) => ({
      date: formatShortDate(row.date as string),
      fullDate: row.date as string,
      value: Number(row[selected]),
    }));

  if (chartData.length === 0) {
    return (
      <div className="p-8 border border-dashed border-stone-300 rounded-lg text-center">
        <p className="text-sm text-stone-400">
          トレンドデータがまだありません
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* メトリック切替 */}
      <div className="flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setSelected(m.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selected === m.key
                ? "text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
            style={selected === m.key ? { backgroundColor: m.color } : {}}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* チャート */}
      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#a8a29e" }}
              tickLine={false}
              axisLine={{ stroke: "#e7e5e4" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#a8a29e" }}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
              width={45}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0];
                return (
                  <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-3">
                    <p className="text-xs text-stone-400 mb-1">
                      {(d.payload as { fullDate: string }).fullDate}
                    </p>
                    <p className="text-sm font-bold" style={{ color: metric.color }}>
                      {metric.label}: {Number(d.value).toFixed(1)}{" "}
                      {metric.unit}
                    </p>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={metric.color}
              strokeWidth={2}
              dot={{ r: 3, fill: metric.color }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
