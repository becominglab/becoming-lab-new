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

  const getDismissKey = () => {
    // 3日ごとにリセット (ISO date / 3日)
    const d = new Date();
    const daysSinceEpoch = Math.floor(d.getTime() / (3 * 24 * 60 * 60 * 1000));
    return `weekly_summary_${daysSinceEpoch}`;
  };

  useEffect(() => {
    // 今期間すでに見ていたらスキップ
    const dismissKey = getDismissKey();
    if (localStorage.getItem(dismissKey)) return;

    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/sns/weekly-summary");
      const data = await res.json();

      setStats({
        post_count: data.post_count || 0,
        reaction_count: data.reaction_count || 0,
        streak: data.streak || 0,
        checkin_count: Math.min(data.streak || 0, 7),
      });
    } catch {
      // silently fail
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(getDismissKey(), "1");
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
            <p className="text-xs font-medium opacity-80">直近7日のまとめ</p>
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
