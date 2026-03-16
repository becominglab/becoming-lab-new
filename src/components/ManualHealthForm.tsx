"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onSaved: () => void;
};

export default function ManualHealthForm({ onClose, onSaved }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [measuredAt, setMeasuredAt] = useState(today);
  const [weightKg, setWeightKg] = useState("");
  const [bodyFatPct, setBodyFatPct] = useState("");
  const [muscleMassKg, setMuscleMassKg] = useState("");
  const [muscleScore, setMuscleScore] = useState("");
  const [visceralFat, setVisceralFat] = useState("");
  const [bmr, setBmr] = useState("");
  const [bodyAge, setBodyAge] = useState("");
  const [boneMassKg, setBoneMassKg] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/health/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measured_at: `${measuredAt}T00:00:00Z`,
          weight_kg: weightKg ? parseFloat(weightKg) : undefined,
          body_fat_pct: bodyFatPct ? parseFloat(bodyFatPct) : undefined,
          muscle_mass_kg: muscleMassKg ? parseFloat(muscleMassKg) : undefined,
          muscle_score: muscleScore ? parseInt(muscleScore, 10) : undefined,
          visceral_fat_level: visceralFat
            ? parseFloat(visceralFat)
            : undefined,
          basal_metabolic_rate: bmr ? parseInt(bmr, 10) : undefined,
          body_age: bodyAge ? parseInt(bodyAge, 10) : undefined,
          bone_mass_kg: boneMassKg ? parseFloat(boneMassKg) : undefined,
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
            体組成データを記録
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
              測定日
            </label>
            <input
              type="date"
              value={measuredAt}
              onChange={(e) => setMeasuredAt(e.target.value)}
              max={today}
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
            />
            <p className="text-xs text-stone-400 mt-1">
              過去の日付も入力できます
            </p>
          </div>

          {/* 主要値 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                体重 (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="72.5"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                体脂肪率 (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="60"
                value={bodyFatPct}
                onChange={(e) => setBodyFatPct(e.target.value)}
                placeholder="18.5"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                筋肉量 (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={muscleMassKg}
                onChange={(e) => setMuscleMassKg(e.target.value)}
                placeholder="55.2"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                基礎代謝量 (kcal)
              </label>
              <input
                type="number"
                min="0"
                value={bmr}
                onChange={(e) => setBmr(e.target.value)}
                placeholder="1680"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
              />
            </div>
          </div>

          {/* 補助値 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                内臓脂肪レベル
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={visceralFat}
                onChange={(e) => setVisceralFat(e.target.value)}
                placeholder="8.5"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                体内年齢 (歳)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={bodyAge}
                onChange={(e) => setBodyAge(e.target.value)}
                placeholder="35"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                推定骨量 (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={boneMassKg}
                onChange={(e) => setBoneMassKg(e.target.value)}
                placeholder="2.9"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                筋肉スコア
              </label>
              <input
                type="number"
                min="0"
                value={muscleScore}
                onChange={(e) => setMuscleScore(e.target.value)}
                placeholder="80"
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
              placeholder="体調、食事の状況など..."
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
