"use client";

import { useEffect, useState } from "react";

interface HealthData {
  weight_kg: number | null;
  body_fat_pct: number | null;
  muscle_mass_kg: number | null;
  basal_metabolic_rate: number | null;
  measured_at: string;
}

const METRICS = [
  { key: "weight_kg" as const, label: "体重", unit: "kg", decimals: 1 },
  { key: "body_fat_pct" as const, label: "体脂肪率", unit: "%", decimals: 1 },
  { key: "muscle_mass_kg" as const, label: "筋肉量", unit: "kg", decimals: 1 },
  { key: "basal_metabolic_rate" as const, label: "基礎代謝", unit: "kcal", decimals: 0 },
];

export default function HealthSnapshotCards() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      try {
        // Try health history first
        const res = await fetch("/api/health/history?days=30");
        if (res.ok) {
          const json = await res.json();
          const measurements = json.measurements || [];
          if (measurements.length > 0) {
            setData(measurements[0]);
            return;
          }
        }
      } catch {
        // fall through
      }
      setData(null);
      setLoading(false);
    }
    fetchHealth().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-stone-50/80 rounded-xl p-4 animate-pulse">
            <div className="h-3 w-12 bg-stone-200 rounded mb-3" />
            <div className="h-6 w-16 bg-stone-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-6 bg-stone-50/50 rounded-xl">
        <p className="text-xs text-stone-400">体組成データがありません</p>
        <p className="text-[10px] text-stone-300 mt-1">
          TANITAを連携するか、手動で記録を追加しましょう
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {METRICS.map((m) => {
        const value = data[m.key];
        return (
          <div key={m.key} className="bg-stone-50/80 rounded-xl p-4">
            <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-1.5">
              {m.label}
            </p>
            <p className="text-xl font-light text-gray-900">
              {value != null ? value.toFixed(m.decimals) : "—"}
              <span className="text-xs text-stone-400 ml-1">{m.unit}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
