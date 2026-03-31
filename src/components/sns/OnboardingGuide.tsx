"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight, X } from "lucide-react";

interface Step {
  key: string;
  label: string;
  done: boolean;
  href: string;
}

export default function OnboardingGuide() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [allDone, setAllDone] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sns/onboarding")
      .then((r) => r.json())
      .then((d) => {
        setSteps(d.steps || []);
        setAllDone(d.all_done ?? false);
        setCompleted(d.onboarding_completed ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleDismiss() {
    setDismissed(true);
    await fetch("/api/sns/onboarding", { method: "POST" });
  }

  if (loading || completed || dismissed) return null;

  const doneCount = steps.filter((s) => s.done).length;
  const progress = steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-stone-50 to-teal-50 border border-teal-100 rounded-2xl p-4">
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-teal-600 mb-0.5">はじめてガイド</p>
          <p className="text-sm font-bold text-stone-800">
            {allDone ? "準備完了！🎉 SNSを楽しもう" : `あと${steps.length - doneCount}ステップで準備完了`}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 text-stone-300 hover:text-stone-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* プログレスバー */}
      <div className="h-1.5 bg-stone-200 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ステップ一覧 */}
      <div className="space-y-2">
        {steps.map((step) =>
          step.done ? (
            <div
              key={step.key}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-teal-50/50"
            >
              <CheckCircle2 size={18} className="text-teal-500 shrink-0" />
              <span className="flex-1 text-sm text-stone-400 line-through">
                {step.label}
              </span>
            </div>
          ) : (
            <Link
              key={step.key}
              href={step.href}
              className="flex items-center gap-3 p-2.5 rounded-xl transition-colors bg-white hover:bg-stone-50 active:scale-[0.98]"
            >
              <Circle size={18} className="text-stone-300 shrink-0" />
              <span className="flex-1 text-sm text-stone-700 font-medium">
                {step.label}
              </span>
              <ChevronRight size={16} className="text-stone-300 shrink-0" />
            </Link>
          )
        )}
      </div>

      {allDone && (
        <button
          onClick={handleDismiss}
          className="w-full mt-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors"
        >
          ガイドを閉じる
        </button>
      )}
    </div>
  );
}
