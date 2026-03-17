"use client";

import { useState, useEffect, useCallback } from "react";
import ManualActivityForm from "./ManualActivityForm";

type Activity = {
  id: string;
  date: string;
  activity_type: string;
  name: string | null;
  distance_km: number | null;
  duration_minutes: number | null;
  heart_rate_avg: number | null;
  elevation_m: number | null;
  notes: string | null;
  source: string;
  strava_activity_id: number | null;
};

const SPORT_CONFIG: Record<
  string,
  { icon: string; label: string; color: string }
> = {
  Run: { icon: "🏃", label: "ランニング", color: "#FC4C02" },
  Ride: { icon: "🚴", label: "サイクリング", color: "#2D8CFF" },
  Swim: { icon: "🏊", label: "スイム", color: "#00BCD4" },
  Walk: { icon: "🚶", label: "ウォーキング", color: "#4CAF50" },
  Hike: { icon: "🥾", label: "ハイキング", color: "#8BC34A" },
  WeightTraining: { icon: "🏋️", label: "ウェイト", color: "#9C27B0" },
  Workout: { icon: "💪", label: "ワークアウト", color: "#FF5722" },
  Yoga: { icon: "🧘", label: "ヨガ", color: "#E91E63" },
  TrailRun: { icon: "🏃‍♂️", label: "トレイルラン", color: "#795548" },
  VirtualRun: { icon: "🏃", label: "バーチャルラン", color: "#FF9800" },
  VirtualRide: { icon: "🚴", label: "バーチャルライド", color: "#03A9F4" },
  Other: { icon: "🏅", label: "その他", color: "#607D8B" },
};

function getSportConfig(type: string) {
  return SPORT_CONFIG[type] ?? SPORT_CONFIG.Other;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatPace(distanceKm: number, durationMinutes: number): string {
  if (distanceKm <= 0) return "";
  const paceMin = durationMinutes / distanceKm;
  const m = Math.floor(paceMin);
  const s = Math.round((paceMin - m) * 60);
  return `${m}'${s.toString().padStart(2, "0")}"`;
}

function formatSpeed(distanceKm: number, durationMinutes: number): string {
  if (durationMinutes <= 0) return "";
  return (distanceKm / (durationMinutes / 60)).toFixed(1);
}

function formatDateRelative(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "今日";
  if (diffDays === 1) return "昨日";
  if (diffDays < 7) return `${diffDays}日前`;

  return d.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

function formatDateFull(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

// 日付ごとにグループ化
function groupByDate(activities: Activity[]): Map<string, Activity[]> {
  const map = new Map<string, Activity[]>();
  for (const a of activities) {
    const key = a.date;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  }
  return map;
}

// 週間サマリー計算
function calcWeekStats(activities: Activity[]) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStr = weekAgo.toISOString().split("T")[0];

  const thisWeek = activities.filter((a) => a.date >= weekStr);
  return {
    count: thisWeek.length,
    distance: thisWeek.reduce((s, a) => s + (a.distance_km ?? 0), 0),
    duration: thisWeek.reduce((s, a) => s + (a.duration_minutes ?? 0), 0),
    elevation: thisWeek.reduce((s, a) => s + (a.elevation_m ?? 0), 0),
  };
}

function StatCard({
  value,
  unit,
  label,
  accent,
}: {
  value: string;
  unit?: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 ${accent ? "bg-[#1B6B7A] text-white" : "bg-white border border-stone-200"}`}
    >
      <div className="flex items-baseline gap-1">
        <span
          className={`text-2xl font-bold ${accent ? "text-white" : "text-gray-900"}`}
        >
          {value}
        </span>
        {unit && (
          <span
            className={`text-xs ${accent ? "text-white/70" : "text-stone-400"}`}
          >
            {unit}
          </span>
        )}
      </div>
      <p
        className={`text-xs mt-1 ${accent ? "text-white/70" : "text-stone-400"}`}
      >
        {label}
      </p>
    </div>
  );
}

function ActivityCard({
  activity,
  onDelete,
  deleting,
}: {
  activity: Activity;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const config = getSportConfig(activity.activity_type);
  const hasDistance =
    activity.distance_km != null && activity.distance_km > 0;
  const hasDuration =
    activity.duration_minutes != null && activity.duration_minutes > 0;
  const isRunOrWalk = ["Run", "TrailRun", "VirtualRun", "Walk", "Hike"].includes(
    activity.activity_type
  );
  const isRide = ["Ride", "VirtualRide"].includes(activity.activity_type);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* ヘッダー: 種目カラーバー */}
      <div className="h-1" style={{ backgroundColor: config.color }} />

      <div className="p-4">
        {/* 上部: 種目アイコン + タイトル + ソース */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
            style={{ backgroundColor: `${config.color}15` }}
          >
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {activity.name || config.label}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-stone-400">
                {formatDateRelative(activity.date)}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  activity.source === "strava"
                    ? "bg-[#FC4C02]/10 text-[#FC4C02]"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                {activity.source === "strava" ? "Strava" : "手動"}
              </span>
            </div>
          </div>
          {activity.source === "manual" && (
            <button
              onClick={() => onDelete(activity.id)}
              disabled={deleting}
              className="text-stone-300 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
              title="削除"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        {/* メインスタッツ */}
        <div className="grid grid-cols-3 gap-3">
          {hasDistance && (
            <div>
              <p className="text-lg font-bold text-gray-900">
                {Number(activity.distance_km).toFixed(1)}
              </p>
              <p className="text-[11px] text-stone-400">距離 (km)</p>
            </div>
          )}
          {hasDuration && (
            <div>
              <p className="text-lg font-bold text-gray-900">
                {formatDuration(activity.duration_minutes!)}
              </p>
              <p className="text-[11px] text-stone-400">時間</p>
            </div>
          )}
          {hasDistance && hasDuration && isRunOrWalk && (
            <div>
              <p className="text-lg font-bold text-gray-900">
                {formatPace(activity.distance_km!, activity.duration_minutes!)}
              </p>
              <p className="text-[11px] text-stone-400">ペース (/km)</p>
            </div>
          )}
          {hasDistance && hasDuration && isRide && (
            <div>
              <p className="text-lg font-bold text-gray-900">
                {formatSpeed(activity.distance_km!, activity.duration_minutes!)}
              </p>
              <p className="text-[11px] text-stone-400">速度 (km/h)</p>
            </div>
          )}
        </div>

        {/* サブスタッツ */}
        {(activity.heart_rate_avg || activity.elevation_m) && (
          <div className="flex gap-4 mt-3 pt-3 border-t border-stone-100">
            {activity.heart_rate_avg != null && (
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="text-xs text-stone-600 font-medium">
                  {activity.heart_rate_avg} bpm
                </span>
              </div>
            )}
            {activity.elevation_m != null && activity.elevation_m > 0 && (
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-xs text-stone-600 font-medium">
                  {Math.round(activity.elevation_m)} m
                </span>
              </div>
            )}
          </div>
        )}

        {/* メモ */}
        {activity.notes && (
          <p className="text-xs text-stone-400 mt-2 italic">
            {activity.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ActivityTimeline() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<string>("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "20",
      });
      if (filter) params.set("type", filter);

      const res = await fetch(`/api/activities?${params}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotal(data.total ?? 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      for (let p = 1; p <= 3; p++) {
        const res = await fetch(
          `/api/strava/activities?page=${p}&per_page=30&sync=true`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.activities.length === 0) break;
        } else {
          break;
        }
      }
      await fetchActivities();
    } catch {
      // silent
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このアクティビティを削除しますか？")) return;
    setDeleting(id);
    try {
      await fetch(`/api/activities/manual?id=${id}`, { method: "DELETE" });
      await fetchActivities();
    } catch {
      // silent
    } finally {
      setDeleting(null);
    }
  };

  const weekStats = calcWeekStats(activities);
  const grouped = groupByDate(activities);

  const filterTypes = [
    { value: "", label: "すべて" },
    { value: "Run", label: "ラン" },
    { value: "Ride", label: "バイク" },
    { value: "Swim", label: "スイム" },
    { value: "Walk", label: "ウォーク" },
    { value: "WeightTraining", label: "ウェイト" },
    { value: "Workout", label: "ワークアウト" },
  ];

  return (
    <div className="space-y-6">
      {/* アクションバー */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FC4C02] text-white rounded-xl text-xs font-bold hover:bg-[#e04400] transition-colors disabled:opacity-50 shadow-sm"
        >
          <svg
            className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {syncing ? "同期中..." : "Strava同期"}
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 rounded-xl text-xs font-medium hover:bg-stone-50 transition-colors shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          手動記録
        </button>
      </div>

      {/* 週間サマリー */}
      {total > 0 && (
        <div>
          <p className="text-xs font-bold text-stone-400 tracking-wider mb-3">
            THIS WEEK
          </p>
          <div className="grid grid-cols-4 gap-2">
            <StatCard
              value={weekStats.count.toString()}
              label="アクティビティ"
              accent
            />
            <StatCard
              value={weekStats.distance.toFixed(1)}
              unit="km"
              label="距離"
            />
            <StatCard
              value={formatDuration(weekStats.duration)}
              label="時間"
            />
            <StatCard
              value={Math.round(weekStats.elevation).toString()}
              unit="m"
              label="獲得標高"
            />
          </div>
        </div>
      )}

      {/* フィルタータブ */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {filterTypes.map((ft) => (
          <button
            key={ft.value}
            onClick={() => {
              setFilter(ft.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === ft.value
                ? "bg-[#1B6B7A] text-white"
                : "bg-stone-100 text-stone-500 hover:bg-stone-200"
            }`}
          >
            {ft.label}
          </button>
        ))}
      </div>

      {/* アクティビティ一覧 */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-2 border-stone-200 border-t-[#1B6B7A] rounded-full animate-spin" />
          <p className="text-sm text-stone-400 mt-3">読み込み中...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
          <div className="text-4xl mb-4">🏃‍♂️</div>
          <p className="text-stone-600 font-medium mb-1">
            アクティビティがありません
          </p>
          <p className="text-stone-400 text-xs mb-6">
            Stravaから同期するか、手動で記録してみましょう
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleSync}
              className="px-4 py-2 bg-[#FC4C02] text-white rounded-lg text-xs font-bold hover:bg-[#e04400] transition-colors"
            >
              Strava同期
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 border border-stone-300 text-stone-600 rounded-lg text-xs font-medium hover:bg-stone-50 transition-colors"
            >
              手動で記録
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([date, acts]) => (
            <div key={date}>
              {/* 日付ヘッダー */}
              <div className="flex items-center gap-3 mb-3">
                <p className="text-xs font-bold text-stone-400">
                  {formatDateFull(date)}
                </p>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              {/* その日のアクティビティ */}
              <div className="space-y-3">
                {acts.map((a) => (
                  <ActivityCard
                    key={a.id}
                    activity={a}
                    onDelete={handleDelete}
                    deleting={deleting === a.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-10 h-10 flex items-center justify-center border border-stone-200 rounded-xl disabled:opacity-30 hover:bg-stone-50 transition-colors"
          >
            <svg
              className="w-4 h-4 text-stone-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-medium transition-colors ${
                    page === pageNum
                      ? "bg-[#1B6B7A] text-white"
                      : "text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-10 h-10 flex items-center justify-center border border-stone-200 rounded-xl disabled:opacity-30 hover:bg-stone-50 transition-colors"
          >
            <svg
              className="w-4 h-4 text-stone-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* 全体の件数 */}
      {total > 0 && (
        <p className="text-center text-xs text-stone-400">
          全 {total} 件のアクティビティ
        </p>
      )}

      {/* 手動入力フォーム */}
      {showForm && (
        <ManualActivityForm
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchActivities();
          }}
        />
      )}
    </div>
  );
}
