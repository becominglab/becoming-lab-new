"use client";

import { useState } from "react";

const ACTIVITY_TYPES = [
  "Run",
  "Ride",
  "Swim",
  "Walk",
  "Hike",
  "WeightTraining",
  "Workout",
  "Yoga",
  "TrailRun",
  "VirtualRun",
  "VirtualRide",
  "Other",
];

const ACTIVITY_LABELS: Record<string, string> = {
  Run: "ランニング",
  Ride: "サイクリング",
  Swim: "スイム",
  Walk: "ウォーキング",
  Hike: "ハイキング",
  WeightTraining: "ウェイトトレーニング",
  Workout: "ワークアウト",
  Yoga: "ヨガ",
  TrailRun: "トレイルラン",
  VirtualRun: "バーチャルラン",
  VirtualRide: "バーチャルライド",
  Other: "その他",
};

type Props = {
  onClose: () => void;
  onSaved: () => void;
};

export default function ManualActivityForm({ onClose, onSaved }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [activityType, setActivityType] = useState("Run");
  const [name, setName] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [durationH, setDurationH] = useState("");
  const [durationM, setDurationM] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [elevation, setElevation] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const durationMinutes =
      (parseInt(durationH || "0", 10) * 60) + parseInt(durationM || "0", 10);

    try {
      const res = await fetch("/api/activities/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          activity_type: activityType,
          name: name || undefined,
          distance_km: distanceKm ? parseFloat(distanceKm) : undefined,
          duration_minutes: durationMinutes > 0 ? durationMinutes : undefined,
          heart_rate_avg: heartRate ? parseInt(heartRate, 10) : undefined,
          elevation_m: elevation ? parseFloat(elevation) : undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "保存に失敗しました");
        return;
      }

      onSaved();
    } catch {
      setError("エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h3 className="text-sm font-bold text-gray-900">
            アクティビティを記録
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* 日付 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              日付
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
            />
            <p className="text-xs text-stone-400 mt-1">
              過去の日付も入力できます
            </p>
          </div>

          {/* 種目 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              種目
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ACTIVITY_LABELS[t] ?? t}
                </option>
              ))}
            </select>
          </div>

          {/* 名前 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              タイトル（任意）
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 朝ラン 皇居2周"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
            />
          </div>

          {/* 距離 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              距離（km）
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              placeholder="10.5"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
            />
          </div>

          {/* 時間 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              時間
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={durationH}
                onChange={(e) => setDurationH(e.target.value)}
                placeholder="0"
                className="w-20 px-3 py-2 border border-stone-300 rounded-lg text-sm text-center focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
              />
              <span className="text-xs text-stone-500">時間</span>
              <input
                type="number"
                min="0"
                max="59"
                value={durationM}
                onChange={(e) => setDurationM(e.target.value)}
                placeholder="0"
                className="w-20 px-3 py-2 border border-stone-300 rounded-lg text-sm text-center focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
              />
              <span className="text-xs text-stone-500">分</span>
            </div>
          </div>

          {/* 心拍数・獲得標高 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                平均心拍数
              </label>
              <input
                type="number"
                min="0"
                max="250"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="145"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                獲得標高 (m)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={elevation}
                onChange={(e) => setElevation(e.target.value)}
                placeholder="120"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
              />
            </div>
          </div>

          {/* メモ */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              メモ（任意）
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="調子が良かった、ペースを意識した等..."
              rows={2}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A] resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-stone-300 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#1B6B7A] text-white rounded-lg text-sm font-medium hover:bg-[#155a67] transition-colors disabled:opacity-50"
            >
              {saving ? "保存中..." : "記録する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
