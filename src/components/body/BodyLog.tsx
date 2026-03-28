"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Trophy, Sparkles, RefreshCw, Link2 } from "lucide-react";
import Link from "next/link";

const MEAL_OPTIONS = [
  { value: 1, label: "崩れた", color: "bg-red-50 border-red-200 text-red-700", activeColor: "bg-red-500 text-white border-red-500" },
  { value: 2, label: "普通", color: "bg-stone-50 border-stone-200 text-stone-700", activeColor: "bg-stone-500 text-white border-stone-500" },
  { value: 3, label: "良い", color: "bg-emerald-50 border-emerald-200 text-emerald-700", activeColor: "bg-emerald-500 text-white border-emerald-500" },
];

const WORKOUT_OPTIONS = [
  { value: 1, label: "何もしてない", color: "bg-red-50 border-red-200 text-red-700", activeColor: "bg-red-500 text-white border-red-500" },
  { value: 2, label: "軽く動いた", color: "bg-stone-50 border-stone-200 text-stone-700", activeColor: "bg-stone-500 text-white border-stone-500" },
  { value: 3, label: "しっかりやった", color: "bg-emerald-50 border-emerald-200 text-emerald-700", activeColor: "bg-emerald-500 text-white border-emerald-500" },
];

const MOOD_OPTIONS = [
  { value: 1, label: "😢", sublabel: "つらい", color: "bg-red-50 border-red-200", activeColor: "bg-red-500 text-white border-red-500" },
  { value: 2, label: "😐", sublabel: "普通", color: "bg-stone-50 border-stone-200", activeColor: "bg-stone-500 text-white border-stone-500" },
  { value: 3, label: "😊", sublabel: "良い", color: "bg-emerald-50 border-emerald-200", activeColor: "bg-emerald-500 text-white border-emerald-500" },
];

const MILESTONES: Record<number, { emoji: string; label: string }> = {
  3: { emoji: "🌱", label: "3日連続！芽が出た" },
  7: { emoji: "🌿", label: "1週間達成！習慣の種" },
  14: { emoji: "🌳", label: "2週間！根を張った" },
  30: { emoji: "🏆", label: "30日達成！もう止まらない" },
  50: { emoji: "💎", label: "50日！ダイヤモンドの意志" },
  100: { emoji: "👑", label: "100日！伝説の始まり" },
};

export default function BodyLog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [meal, setMeal] = useState<number | null>(null);
  const [workout, setWorkout] = useState<number | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [weightKg, setWeightKg] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<{ emoji: string; label: string } | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [tanitaStatus, setTanitaStatus] = useState<"loading" | "connected" | "not_connected" | "synced">("loading");
  const [tanitaSyncing, setTanitaSyncing] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split("T")[0]; })();
  const dateParam = searchParams.get("date");
  // Allow logging for yesterday or today only
  const targetDate = dateParam && dateParam >= yesterdayStr && dateParam <= todayStr ? dateParam : todayStr;
  const isBackfill = targetDate !== todayStr;

  useEffect(() => {
    fetch(`/api/body/logs?from=${targetDate}&to=${targetDate}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.logs?.length > 0) {
          const log = d.logs[0];
          setMeal(log.meal_score);
          setWorkout(log.workout_score);
          setMood(log.mood);
          if (log.weight_kg) setWeightKg(String(log.weight_kg));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [targetDate]);

  // Fetch Tanita weight on mount (only if no weight already set)
  useEffect(() => {
    fetch("/api/body/tanita")
      .then((r) => r.json())
      .then((d) => {
        if (d.connected) {
          setTanitaStatus("connected");
          // Auto-fill weight if not already set by existing log
          if (d.weight_kg && !weightKg) {
            setWeightKg(String(d.weight_kg));
            setTanitaStatus("synced");
          }
        } else {
          setTanitaStatus("not_connected");
        }
      })
      .catch(() => setTanitaStatus("not_connected"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTanitaSync = async () => {
    setTanitaSyncing(true);
    try {
      const res = await fetch("/api/body/tanita", { method: "POST" });
      const d = await res.json();
      if (d.weight_kg) {
        setWeightKg(String(d.weight_kg));
        setTanitaStatus("synced");
      }
    } catch {
      // ignore
    } finally {
      setTanitaSyncing(false);
    }
  };

  const canSubmit = meal !== null && workout !== null && mood !== null;

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/body/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: targetDate,
          meal_score: meal,
          workout_score: workout,
          mood,
          ...(weightKg ? { weight_kg: parseFloat(weightKg) } : {}),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(true);
        setShowCelebration(true);

        // Check for milestone
        const streak = data.streak?.current_streak;
        if (streak && MILESTONES[streak]) {
          setMilestone(MILESTONES[streak]);
        }

        setTimeout(() => router.push("/body"), milestone ? 2500 : 1500);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error || "保存に失敗しました。もう一度お試しください。");
      }
    } catch {
      setError("通信エラーが発生しました。接続を確認してください。");
    } finally {
      setSaving(false);
    }
  };

  // Auto-dismiss error after 4s
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Celebration overlay ──
  if (showCelebration) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-50">
        <div className="animate-bounce-in">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-emerald-200">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>
          <p className="text-xl font-light text-gray-900 text-center mb-2">
            記録しました！
          </p>
          <p className="text-sm text-stone-400 text-center">
            今日も自分を更新できた
          </p>
        </div>

        {milestone && (
          <div className="mt-8 animate-fade-in-up">
            <div className="bg-white rounded-2xl px-8 py-6 border border-amber-100 shadow-lg shadow-amber-50 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy size={18} className="text-amber-500" />
                <span className="text-[10px] tracking-[0.3em] text-amber-500 uppercase font-medium">
                  MILESTONE
                </span>
              </div>
              <p className="text-4xl mb-2">{milestone.emoji}</p>
              <p className="text-sm font-medium text-gray-800">
                {milestone.label}
              </p>
            </div>
          </div>
        )}

        {/* Confetti particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${10 + Math.random() * 80}%`,
                backgroundColor: ["#10b981", "#f59e0b", "#6366f1", "#ec4899", "#14b8a6"][i % 5],
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 pb-28">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-slide-down">
          <div className="mx-auto max-w-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm shadow-lg">
            {error}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Link href="/body" className="text-stone-400 hover:text-stone-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase">
            {isBackfill ? "YESTERDAY'S LOG" : "TODAY'S LOG"}
          </p>
          <h1 className="text-xl font-light text-gray-900 mt-1">
            {isBackfill ? "昨日の記録" : "今日の更新"}
          </h1>
        </div>
      </div>

      {/* Meal */}
      <Section title="食事" number={1}>
        <div className="grid grid-cols-3 gap-3">
          {MEAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMeal(opt.value)}
              className={`py-4 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
                meal === opt.value ? opt.activeColor : opt.color
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Workout */}
      <Section title="運動" number={2}>
        <div className="grid grid-cols-3 gap-3">
          {WORKOUT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setWorkout(opt.value)}
              className={`py-4 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
                workout === opt.value ? opt.activeColor : opt.color
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Mood */}
      <Section title="気分" number={3}>
        <div className="grid grid-cols-3 gap-3">
          {MOOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMood(opt.value)}
              className={`py-5 rounded-xl border-2 text-2xl transition-all active:scale-95 flex flex-col items-center gap-1 ${
                mood === opt.value ? opt.activeColor : opt.color
              }`}
            >
              <span>{opt.label}</span>
              <span className={`text-xs ${mood === opt.value ? "text-white/80" : "text-stone-400"}`}>
                {opt.sublabel}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* Weight (optional) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-stone-100 text-[10px] flex items-center justify-center text-stone-400 font-medium">
              +
            </span>
            <span className="text-sm font-medium text-gray-700">体重</span>
            <span className="text-[10px] text-stone-400 ml-1">任意</span>
          </div>
          {/* Tanita sync button */}
          {tanitaStatus === "connected" && (
            <button
              onClick={handleTanitaSync}
              disabled={tanitaSyncing}
              className="flex items-center gap-1.5 text-[10px] text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              <RefreshCw size={12} className={tanitaSyncing ? "animate-spin" : ""} />
              タニタから取得
            </button>
          )}
          {tanitaStatus === "synced" && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-500">
              <Check size={12} />
              タニタ連携済み
            </span>
          )}
          {tanitaStatus === "not_connected" && (
            <a
              href="/api/healthplanet/auth"
              className="flex items-center gap-1.5 text-[10px] text-stone-400 hover:text-indigo-500 transition-colors"
            >
              <Link2 size={12} />
              タニタ連携
            </a>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*\.?[0-9]*"
            placeholder="65.0"
            value={weightKg}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || /^\d{0,3}(\.\d{0,1})?$/.test(v)) {
                setWeightKg(v);
              }
            }}
            className={`w-full py-4 px-4 pr-12 rounded-xl border-2 text-sm text-gray-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors bg-white ${
              tanitaStatus === "synced" ? "border-indigo-200 bg-indigo-50/30" : "border-stone-200"
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
            kg
          </span>
        </div>
        {tanitaStatus === "synced" && (
          <p className="text-[10px] text-indigo-400 mt-1.5 ml-1">
            タニタの体組成計から自動取得しました
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || saving || saved}
        className={`w-full py-4 rounded-xl text-sm font-medium transition-all mt-4 ${
          saved
            ? "bg-emerald-500 text-white"
            : canSubmit
              ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
        }`}
      >
        {saved ? (
          <span className="flex items-center justify-center gap-2">
            <Check size={16} /> 記録しました
          </span>
        ) : saving ? (
          "保存中..."
        ) : (
          "記録する"
        )}
      </button>
    </div>
  );
}

function Section({
  title,
  number,
  children,
}: {
  title: string;
  number: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-5 h-5 rounded-full bg-stone-200 text-[10px] flex items-center justify-center text-stone-500 font-medium">
          {number}
        </span>
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      {children}
    </div>
  );
}
