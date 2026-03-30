"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Flame, Heart, X } from "lucide-react";

interface WeekStats {
  post_count: number;
  reaction_count: number;
  streak: number;
  checkin_count: number;
}

export default function WeeklySummaryCard() {
  const [stats, setStats] = useState<WeekStats | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 月曜日のみ表示 (0=日, 1=月)
    const day = new Date().getDay();
    if (day !== 1) return;

    // 今週の集計を取得
    const weekKey = `weekly_summary_${getWeekKey()}`;
    if (localStorage.getItem(weekKey)) return; // 今週は既に見た

    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWeekKey = () => {
    const d = new Date();
    const year = d.getFullYear();
    const week = Math.ceil(d.getDate() / 7);
    return `${year}_${d.getMonth()}_${week}`;
  };

  const fetchStats = async () => {
    try {
      // 先週のチェックイン数
      const checkinRes = await fetch("/api/sns/checkin");
      const checkinData = await checkinRes.json();

      // 先週の投稿数
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const postsRes = await fetch(`/api/sns/posts?limit=50&cursor=${new Date().toISOString()}`);
      const postsData = await postsRes.json();
      const recentPosts = (postsData.posts || []).filter(
        (p: { created_at: string }) => p.created_at >= sevenDaysAgo
      );

      const totalReactions = recentPosts.reduce((sum: number, p: { reactions: { counts?: Record<string, number> } }) => {
        return sum + Object.values(p.reactions?.counts || {}).reduce((s: number, v) => s + (v as number), 0);
      }, 0);

      setStats({
        post_count: recentPosts.length,
        reaction_count: totalReactions,
        streak: checkinData.streak || 0,
        checkin_count: Math.min(checkinData.streak || 0, 7),
      });
    } catch {
      // silently fail
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(`weekly_summary_${getWeekKey()}`, "1");
  };

  if (!stats || dismissed) return null;

  const encouragement = stats.post_count >= 5
    ? "素晴らしい1週間でした！✨"
    : stats.post_count >= 2
    ? "着実に積み上げています 💪"
    : "今週も一歩ずつ進もう 🌱";

  return (
    <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl p-4 text-white">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <TrendingUp size={14} className="opacity-80" />
            <p className="text-xs font-medium opacity-80">先週のまとめ</p>
          </div>
          <p className="text-sm font-bold">{encouragement}</p>
        </div>
        <button onClick={handleDismiss} className="p-1 opacity-60 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/20 rounded-xl p-2.5 text-center">
          <p className="text-xl font-bold">{stats.post_count}</p>
          <p className="text-[10px] opacity-80">更新</p>
        </div>
        <div className="bg-white/20 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1">
            <Heart size={13} className="fill-white" />
            <p className="text-xl font-bold">{stats.reaction_count}</p>
          </div>
          <p className="text-[10px] opacity-80">もらった応援</p>
        </div>
        <div className="bg-white/20 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame size={13} />
            <p className="text-xl font-bold">{stats.streak}</p>
          </div>
          <p className="text-[10px] opacity-80">日ストリーク</p>
        </div>
      </div>
    </div>
  );
}
