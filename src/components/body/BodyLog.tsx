"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
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

export default function BodyLog() {
  const router = useRouter();
  const [meal, setMeal] = useState<number | null>(null);
  const [workout, setWorkout] = useState<number | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch(`/api/body/logs?from=${today}&to=${today}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.logs?.length > 0) {
          const log = d.logs[0];
          setMeal(log.meal_score);
          setWorkout(log.workout_score);
          setMood(log.mood);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [today]);

  const canSubmit = meal !== null && workout !== null && mood !== null;

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/body/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          meal_score: meal,
          workout_score: workout,
          mood,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => router.push("/body"), 800);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Link href="/body" className="text-stone-400 hover:text-stone-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase">
            TODAY&apos;S LOG
          </p>
          <h1 className="text-xl font-light text-gray-900 mt-1">
            今日の更新
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
