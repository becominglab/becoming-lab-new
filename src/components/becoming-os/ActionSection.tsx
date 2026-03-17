"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Activity {
  id: string;
  date: string;
  activity_type: string;
  name: string | null;
  distance_km: number | null;
  duration_minutes: number | null;
  heart_rate_avg: number | null;
  source: string;
}

const SPORT_COLORS: Record<string, string> = {
  Run: "#F97316",
  Ride: "#3B82F6",
  Swim: "#06B6D4",
  Walk: "#84CC16",
  Hike: "#22C55E",
  WeightTraining: "#A855F7",
  Workout: "#EC4899",
  Yoga: "#14B8A6",
  TrailRun: "#D97706",
  VirtualRun: "#FB923C",
  VirtualRide: "#60A5FA",
  Other: "#6B7280",
};

const SPORT_LABELS: Record<string, string> = {
  Run: "ランニング",
  Ride: "サイクリング",
  Swim: "スイミング",
  Walk: "ウォーキング",
  Hike: "ハイキング",
  WeightTraining: "ウェイト",
  Workout: "ワークアウト",
  Yoga: "ヨガ",
  TrailRun: "トレイルラン",
  VirtualRun: "仮想ラン",
  VirtualRide: "仮想ライド",
  Other: "その他",
};

function formatDuration(min: number): string {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${min}m`;
}

function formatRelativeDate(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  const diff = Math.floor(
    (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "今日";
  if (diff === 1) return "昨日";
  if (diff <= 6) return `${diff}日前`;
  return d.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

export default function ActionSection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch("/api/activities?per_page=5");
        if (res.ok) {
          const json = await res.json();
          setActivities(json.activities || []);
        }
      } catch {
        // use empty
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  // Weekly stats
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStr = weekAgo.toISOString().split("T")[0];
  const thisWeek = activities.filter((a) => a.date >= weekStr);
  const weekDistance = thisWeek.reduce(
    (s, a) => s + (a.distance_km || 0),
    0
  );
  const weekDuration = thisWeek.reduce(
    (s, a) => s + (a.duration_minutes || 0),
    0
  );

  return (
    <section>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-3">
          ACTION
        </p>
        <h2 className="text-xl md:text-2xl font-light text-gray-900">
          行動の記録
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          動いた分だけ、自分が更新される。
        </p>
      </div>

      {/* Weekly Summary Bar */}
      <div className="flex items-center gap-6 mb-8 bg-stone-50/80 rounded-xl px-6 py-4">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-stone-400">
            THIS WEEK
          </p>
          <p className="text-lg font-light text-gray-900 mt-1">
            {thisWeek.length}
            <span className="text-xs text-stone-400 ml-1">activities</span>
          </p>
        </div>
        <div className="w-px h-8 bg-stone-200" />
        <div>
          <p className="text-[10px] tracking-[0.2em] text-stone-400">
            DISTANCE
          </p>
          <p className="text-lg font-light text-gray-900 mt-1">
            {weekDistance.toFixed(1)}
            <span className="text-xs text-stone-400 ml-1">km</span>
          </p>
        </div>
        <div className="w-px h-8 bg-stone-200" />
        <div>
          <p className="text-[10px] tracking-[0.2em] text-stone-400">TIME</p>
          <p className="text-lg font-light text-gray-900 mt-1">
            {weekDuration > 0 ? formatDuration(weekDuration) : "—"}
          </p>
        </div>
      </div>

      {/* Activity List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 bg-stone-50/50 rounded-xl">
          <p className="text-stone-400 text-sm">まだ記録がありません</p>
          <p className="text-xs text-stone-300 mt-2">
            Stravaを連携するか、手動で記録を追加しましょう
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-stone-50/80 transition-colors group"
            >
              {/* Sport Color Dot */}
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    SPORT_COLORS[a.activity_type] || SPORT_COLORS.Other,
                }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {a.name ||
                      SPORT_LABELS[a.activity_type] ||
                      a.activity_type}
                  </p>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {formatRelativeDate(a.date)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {a.distance_km && (
                    <span className="text-xs text-stone-500">
                      {a.distance_km.toFixed(1)} km
                    </span>
                  )}
                  {a.duration_minutes && (
                    <span className="text-xs text-stone-500">
                      {formatDuration(a.duration_minutes)}
                    </span>
                  )}
                  {a.heart_rate_avg && (
                    <span className="text-xs text-stone-400">
                      ♥ {a.heart_rate_avg}
                    </span>
                  )}
                </div>
              </div>

              {/* Source badge */}
              <span className="text-[9px] tracking-wider text-stone-300 uppercase shrink-0">
                {a.source}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Link to full history */}
      <div className="mt-6 text-center">
        <Link
          href="/mypage/activities"
          className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-[#1B6B7A] transition-colors"
        >
          すべてのアクティビティを見る
          <span className="text-[10px]">→</span>
        </Link>
      </div>
    </section>
  );
}
