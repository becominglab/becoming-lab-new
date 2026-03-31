"use client";

import { useState, useEffect } from "react";
import { Flame, CheckCircle2 } from "lucide-react";

function getNextMilestone(streak: number): { milestone: number; daysLeft: number } | null {
  const milestones = [3, 7, 14, 30, 100];
  for (const m of milestones) {
    if (streak < m && m - streak <= 3) {
      return { milestone: m, daysLeft: m - streak };
    }
  }
  return null;
}

const DAILY_PROMPTS = [
  "今日の進捗を一言でどうぞ 💬",
  "今日頑張ったことを共有しよう ✨",
  "今日の気づきを書いてみよう 📝",
  "今日の挑戦、どうだった？ 🎯",
  "今日の小さな勝利を報告しよう 🏆",
  "今日の自分を3点満点で採点すると？ 🌟",
  "今日、誰かに感謝したことある？ 🙏",
  "今日の振り返りをひとことで 🔄",
  "明日の目標を今日のうちに宣言しよう 📣",
  "今週の目標、どのくらい進んだ？ 📊",
  "今日いちばん印象に残ったことは？ 💡",
  "今日の体調・気分はどうだった？ 😊",
  "続けていることで、変わったと感じること 🌱",
  "今日の自分を一言でたとえると？ 🎭",
];

interface Props {
  onCheckinAndPost?: (prompt: string) => void;
}

export default function DailyCheckin({ onCheckinAndPost }: Props) {
  const [todayChecked, setTodayChecked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // 今日のプロンプト（日付で決定論的に選択）
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const prompt = DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];

  useEffect(() => {
    fetch("/api/sns/checkin")
      .then((r) => r.json())
      .then((d) => {
        setTodayChecked(d.today_checked ?? false);
        setStreak(d.streak ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleCheckin() {
    if (checking || todayChecked) return;
    setChecking(true);
    try {
      const res = await fetch("/api/sns/checkin", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setTodayChecked(true);
        setStreak(data.streak || 0);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 8000);
        // 投稿フォームを開く
        onCheckinAndPost?.(prompt);
      }
    } finally {
      setChecking(false);
    }
  }

  if (loading) return null;

  const dateLabel = today.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
  const nextMilestone = getNextMilestone(streak);

  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        todayChecked
          ? "bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200"
          : "bg-white border-stone-200"
      }`}
    >
      {/* ヘッダー行 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {todayChecked ? (
            <CheckCircle2 size={18} className="text-teal-500" />
          ) : (
            <div className="w-4.5 h-4.5 rounded-full border-2 border-stone-300" />
          )}
          <span className="text-xs font-medium text-stone-500">{dateLabel}</span>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 rounded-full px-2.5 py-0.5">
            <Flame size={12} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-600">{streak}日連続</span>
          </div>
        )}
      </div>

      {todayChecked ? (
        /* チェックイン済み */
        <div className="space-y-1">
          <p className="text-sm font-medium text-teal-700">
            {showCelebration ? `${streak}日連続チェックイン！🎉` : "今日もチェックイン済み！"}
          </p>
          <p className="text-xs text-stone-400">
            {showCelebration
              ? "この調子で続けよう✨ 今日の更新を投稿しよう！"
              : nextMilestone
              ? `あと${nextMilestone.daysLeft}日で${nextMilestone.milestone}日連続達成！`
              : "投稿してさらに仲間に共有しよう"}
          </p>
        </div>
      ) : (
        /* 未チェックイン */
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-stone-700 mb-0.5">今日のお題</p>
            <p className="text-sm text-stone-500">{prompt}</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
              <Flame size={14} className="text-orange-500 shrink-0" />
              <p className="text-xs text-orange-700 font-medium">
                {nextMilestone
                  ? `あと${nextMilestone.daysLeft}日で${nextMilestone.milestone}日連続達成！今日もチェックインしよう`
                  : `${streak}日連続が今日途切れます！チェックインで記録を守ろう`}
              </p>
            </div>
          )}
          <button
            onClick={handleCheckin}
            disabled={checking}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-stone-200 text-white text-sm font-medium rounded-xl transition-colors active:scale-[0.98]"
          >
            {checking ? "チェックイン中..." : "✓ 今日もチェックイン！"}
          </button>
        </div>
      )}
    </div>
  );
}
