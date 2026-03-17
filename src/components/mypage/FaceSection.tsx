"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HealthSnapshotCards from "./HealthSnapshotCards";

// ── Types ──
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

interface TodayStats {
  activitiesToday: number;
  totalDistanceToday: number;
  totalDurationToday: number;
  streak: number;
}

// ── Constants ──
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

export default function FaceSection() {
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch recent activities
        const res = await fetch("/api/activities?per_page=5");
        if (res.ok) {
          const json = await res.json();
          setActivities(json.activities || []);
        }

        // Fetch today's stats
        const today = new Date().toISOString().split("T")[0];
        const todayRes = await fetch(
          `/api/activities?from=${today}&to=${today}&per_page=50`
        );
        if (todayRes.ok) {
          const todayJson = await todayRes.json();
          const todayActs = todayJson.activities || [];
          const totalDistance = todayActs.reduce(
            (sum: number, a: { distance_km: number | null }) =>
              sum + (a.distance_km || 0),
            0
          );
          const totalDuration = todayActs.reduce(
            (sum: number, a: { duration_minutes: number | null }) =>
              sum + (a.duration_minutes || 0),
            0
          );

          // Calculate streak
          const streakRes = await fetch("/api/activities?per_page=90");
          let streak = 0;
          if (streakRes.ok) {
            const streakJson = await streakRes.json();
            const allActs = streakJson.activities || [];
            const dates = new Set(
              allActs.map((a: { date: string }) => a.date)
            );
            const checkDate = new Date();
            if (!dates.has(checkDate.toISOString().split("T")[0])) {
              checkDate.setDate(checkDate.getDate() - 1);
            }
            while (dates.has(checkDate.toISOString().split("T")[0])) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
            }
          }

          setTodayStats({
            activitiesToday: todayActs.length,
            totalDistanceToday: totalDistance,
            totalDurationToday: totalDuration,
            streak,
          });
        }
      } catch {
        setTodayStats({
          activitiesToday: 0,
          totalDistanceToday: 0,
          totalDurationToday: 0,
          streak: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <section>
      {/* Section Header */}
      <div className="mb-8">
        <p
          className="text-[10px] tracking-[0.35em] uppercase mb-3"
          style={{ color: "var(--gold, #B8A88A)" }}
        >
          Face
        </p>
        <h2
          className="text-xl md:text-2xl font-light"
          style={{ color: "var(--ink, #1A1A1A)" }}
        >
          向き合う
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          数値と事実を、淡々と見つめる。
        </p>
      </div>

      {/* ── Today's Snapshot ── */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(184, 168, 138, 0.08)" }}>
          <p
            className="text-[10px] tracking-[0.2em] mb-2"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            ACTIVITIES
          </p>
          <p
            className="text-2xl font-light"
            style={{ color: "var(--ink, #1A1A1A)" }}
          >
            {todayStats?.activitiesToday ?? "—"}
          </p>
          <p className="text-xs text-stone-400 mt-1">件</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(184, 168, 138, 0.08)" }}>
          <p
            className="text-[10px] tracking-[0.2em] mb-2"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            DISTANCE
          </p>
          <p
            className="text-2xl font-light"
            style={{ color: "var(--ink, #1A1A1A)" }}
          >
            {todayStats ? todayStats.totalDistanceToday.toFixed(1) : "—"}
          </p>
          <p className="text-xs text-stone-400 mt-1">km</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(184, 168, 138, 0.08)" }}>
          <p
            className="text-[10px] tracking-[0.2em] mb-2"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            TIME
          </p>
          <p
            className="text-2xl font-light"
            style={{ color: "var(--ink, #1A1A1A)" }}
          >
            {todayStats
              ? todayStats.totalDurationToday >= 60
                ? `${Math.floor(todayStats.totalDurationToday / 60)}h${todayStats.totalDurationToday % 60 > 0 ? `${todayStats.totalDurationToday % 60}m` : ""}`
                : todayStats.totalDurationToday > 0
                  ? `${todayStats.totalDurationToday}m`
                  : "0"
              : "—"}
          </p>
          <p className="text-xs text-stone-400 mt-1">今日</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(184, 168, 138, 0.08)" }}>
          <p
            className="text-[10px] tracking-[0.2em] mb-2"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            STREAK
          </p>
          <p
            className="text-2xl font-light"
            style={{ color: "var(--ink, #1A1A1A)" }}
          >
            {todayStats?.streak ?? "—"}
          </p>
          <p className="text-xs text-stone-400 mt-1">日連続</p>
        </div>
      </div>

      {/* ── Health Snapshot ── */}
      <div className="mb-8">
        <p
          className="text-[10px] tracking-[0.25em] uppercase mb-4"
          style={{ color: "var(--gold, #B8A88A)" }}
        >
          Body Data
        </p>
        <HealthSnapshotCards />
      </div>

      {/* ── Recent Activities ── */}
      <div className="mb-8">
        <p
          className="text-[10px] tracking-[0.25em] uppercase mb-4"
          style={{ color: "var(--gold, #B8A88A)" }}
        >
          This Week
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 bg-stone-50/50 rounded-xl">
            <p className="text-stone-400 text-sm">まだ記録がありません</p>
            <p className="text-xs text-stone-300 mt-2">
              Stravaを連携するか、手動で記録を追加しましょう
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-stone-50/80 transition-colors"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      SPORT_COLORS[a.activity_type] || SPORT_COLORS.Other,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--ink, #1A1A1A)" }}
                    >
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
                <span className="text-[9px] tracking-wider text-stone-300 uppercase shrink-0">
                  {a.source}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Sub-page Links ── */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/mypage/activities"
          className="p-4 rounded-xl hover:bg-stone-100/80 transition-colors text-center group"
          style={{ backgroundColor: "rgba(184, 168, 138, 0.08)" }}
        >
          <p
            className="text-[10px] tracking-[0.2em] mb-1"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            HISTORY
          </p>
          <p className="text-sm text-gray-700 group-hover:text-[#1B6B7A] transition-colors">
            アクティビティ履歴
          </p>
        </Link>
        <Link
          href="/mypage/health"
          className="p-4 rounded-xl hover:bg-stone-100/80 transition-colors text-center group"
          style={{ backgroundColor: "rgba(184, 168, 138, 0.08)" }}
        >
          <p
            className="text-[10px] tracking-[0.2em] mb-1"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            HEALTH
          </p>
          <p className="text-sm text-gray-700 group-hover:text-[#1B6B7A] transition-colors">
            体組成データ詳細
          </p>
        </Link>
      </div>
    </section>
  );
}
