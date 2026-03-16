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

const SPORT_ICONS: Record<string, string> = {
  Run: "🏃",
  Ride: "🚴",
  Swim: "🏊",
  Walk: "🚶",
  Hike: "🥾",
  WeightTraining: "🏋️",
  Workout: "💪",
  Yoga: "🧘",
  VirtualRide: "🚴",
  VirtualRun: "🏃",
  TrailRun: "🏃‍♂️",
  Other: "🏅",
};

const ACTIVITY_LABELS: Record<string, string> = {
  Run: "ランニング",
  Ride: "サイクリング",
  Swim: "スイム",
  Walk: "ウォーキング",
  Hike: "ハイキング",
  WeightTraining: "ウェイト",
  Workout: "ワークアウト",
  Yoga: "ヨガ",
  TrailRun: "トレイルラン",
  VirtualRun: "バーチャルラン",
  VirtualRide: "バーチャルライド",
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}時間${m}分`;
  return `${m}分`;
}

function formatDateJa(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  });
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
      // 複数ページを同期（最大3ページ = 90件）
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

  // サマリー統計
  const totalDistance = activities.reduce(
    (sum, a) => sum + (a.distance_km ?? 0),
    0
  );
  const totalDuration = activities.reduce(
    (sum, a) => sum + (a.duration_minutes ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* アクションバー */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 bg-[#1B6B7A] text-white rounded-lg text-xs font-medium hover:bg-[#155a67] transition-colors disabled:opacity-50"
        >
          {syncing ? "同期中..." : "🔄 Stravaから同期"}
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 border border-[#1B6B7A] text-[#1B6B7A] rounded-lg text-xs font-medium hover:bg-[#1B6B7A]/5 transition-colors"
        >
          ✏️ 手動で記録
        </button>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="ml-auto px-3 py-2 border border-stone-300 rounded-lg text-xs text-gray-700 focus:outline-none focus:border-[#1B6B7A]"
        >
          <option value="">すべての種目</option>
          <option value="Run">ランニング</option>
          <option value="Ride">サイクリング</option>
          <option value="Swim">スイム</option>
          <option value="Walk">ウォーキング</option>
          <option value="Hike">ハイキング</option>
          <option value="WeightTraining">ウェイト</option>
          <option value="Workout">ワークアウト</option>
        </select>
      </div>

      {/* サマリー */}
      {total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-stone-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-stone-400">アクティビティ</p>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-900">
              {totalDistance.toFixed(1)}
            </p>
            <p className="text-xs text-stone-400">合計 km</p>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatDuration(totalDuration)}
            </p>
            <p className="text-xs text-stone-400">合計時間</p>
          </div>
        </div>
      )}

      {/* アクティビティ一覧 */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-sm text-stone-400">読み込み中...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-stone-300 rounded-lg">
          <p className="text-stone-500 text-sm mb-2">
            アクティビティがありません
          </p>
          <p className="text-stone-400 text-xs mb-4">
            Stravaから同期するか、手動で記録してください
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="text-xs text-[#1B6B7A] hover:opacity-70"
          >
            ✏️ 最初のアクティビティを記録する
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-4 p-4 border border-stone-100 rounded-lg hover:bg-stone-50 transition-colors group"
            >
              <div className="text-xl shrink-0">
                {SPORT_ICONS[a.activity_type] ?? "🏅"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {a.name ||
                      ACTIVITY_LABELS[a.activity_type] ||
                      a.activity_type}
                  </p>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                      a.source === "strava"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {a.source === "strava" ? "Strava" : "手動"}
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  {formatDateJa(a.date)}
                </p>
                {a.notes && (
                  <p className="text-xs text-stone-400 mt-1 truncate">
                    {a.notes}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                {a.distance_km != null && a.distance_km > 0 && (
                  <p className="text-sm font-bold text-gray-900">
                    {Number(a.distance_km).toFixed(1)} km
                  </p>
                )}
                <p className="text-xs text-stone-400">
                  {a.duration_minutes != null && a.duration_minutes > 0
                    ? formatDuration(a.duration_minutes)
                    : ""}
                  {a.heart_rate_avg != null
                    ? ` ・ ♥${a.heart_rate_avg}`
                    : ""}
                </p>
              </div>
              {a.source === "manual" && (
                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={deleting === a.id}
                  className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-all text-xs shrink-0"
                  title="削除"
                >
                  🗑
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg disabled:opacity-30 hover:bg-stone-50 transition-colors"
          >
            ← 前
          </button>
          <span className="text-xs text-stone-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg disabled:opacity-30 hover:bg-stone-50 transition-colors"
          >
            次 →
          </button>
        </div>
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
