"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type IntegrationStatus = {
  provider: string;
  connected: boolean;
  connectedAt: string;
  tokenExpired: boolean;
  athleteId: string | null;
};

type StravaActivity = {
  id: number;
  name: string;
  type: string;
  sportType: string;
  date: string;
  distance: number;
  movingTime: number;
  elevationGain: number;
  avgHeartrate: number | null;
  kudosCount: number;
};

type HealthPlanetEntry = {
  value: string;
  date: string;
  label: string;
  unit: string;
};

const PROVIDERS = [
  {
    key: "strava",
    label: "Strava",
    icon: "🚴",
    connectLabel: "Strava と連携する",
    authPath: "/api/strava/auth",
    color: "orange",
  },
  {
    key: "healthplanet",
    label: "HealthPlanet (TANITA)",
    icon: "🏥",
    connectLabel: "HealthPlanet と連携する",
    authPath: "/api/healthplanet/auth",
    color: "teal",
  },
  {
    key: "garmin",
    label: "Garmin",
    icon: "⌚",
    connectLabel: "Garmin と連携する",
    authPath: "/api/garmin/auth",
    color: "blue",
  },
  {
    key: "coros",
    label: "COROS",
    icon: "🏃",
    connectLabel: "COROS と連携する",
    authPath: "/api/coros/auth",
    color: "purple",
  },
] as const;

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}時間${m}分`;
  return `${m}分`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

function SportIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
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
  };
  return <span>{icons[type] ?? "🏅"}</span>;
}

export default function IntegrationDashboard() {
  const [statuses, setStatuses] = useState<IntegrationStatus[]>([]);
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [healthData, setHealthData] = useState<HealthPlanetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stravaLoading, setStravaLoading] = useState(false);
  const [healthLoading, setHealthLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const connectedProviders = new Set(statuses.map((s) => s.provider));

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/integrations/status");
      const data = await res.json();
      setStatuses(data.integrations ?? []);
      return data.integrations ?? [];
    } catch {
      return [];
    }
  }, []);

  const fetchStravaActivities = useCallback(async () => {
    setStravaLoading(true);
    try {
      const res = await fetch("/api/strava/activities");
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities ?? []);
      }
    } catch {
      // silent fail
    } finally {
      setStravaLoading(false);
    }
  }, []);

  const fetchHealthData = useCallback(async () => {
    setHealthLoading(true);
    try {
      const res = await fetch("/api/healthplanet/data");
      if (res.ok) {
        const data = await res.json();
        setHealthData(data.latest ?? []);
      }
    } catch {
      // silent fail
    } finally {
      setHealthLoading(false);
    }
  }, []);

  const syncAll = useCallback(async () => {
    const integrations = await fetchStatus();
    const providers = new Set(
      (integrations as IntegrationStatus[]).map(
        (s: IntegrationStatus) => s.provider
      )
    );

    const promises: Promise<void>[] = [];
    if (providers.has("strava")) promises.push(fetchStravaActivities());
    if (providers.has("healthplanet")) promises.push(fetchHealthData());
    await Promise.all(promises);

    setLastSynced(new Date());
    setLoading(false);
  }, [fetchStatus, fetchStravaActivities, fetchHealthData]);

  useEffect(() => {
    syncAll();
  }, [syncAll]);

  return (
    <div className="space-y-10">
      {/* 同期ステータス */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-1">
            DEVICE INTEGRATIONS
          </p>
          <h2 className="text-xl font-bold text-gray-900">デバイス連携</h2>
        </div>
        <div className="text-right">
          {lastSynced && (
            <p className="text-xs text-stone-400 mb-1">
              最終同期:{" "}
              {lastSynced.toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
          <button
            onClick={syncAll}
            disabled={loading}
            className="text-xs text-[#1B6B7A] hover:opacity-70 transition-opacity disabled:opacity-40"
          >
            {loading ? "同期中..." : "↻ 今すぐ同期"}
          </button>
        </div>
      </div>

      {/* 連携カード一覧 */}
      <div className="grid grid-cols-2 gap-3">
        {PROVIDERS.map((p) => {
          const status = statuses.find((s) => s.provider === p.key);
          const isConnected = !!status;

          return isConnected ? (
            <div
              key={p.key}
              className="p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{p.icon}</span>
                <span className="text-sm font-bold text-green-800">
                  {p.label}
                </span>
              </div>
              <p className="text-xs text-green-600">
                {status.tokenExpired ? (
                  <span className="text-amber-600">
                    ⚠ トークン期限切れ — 再連携してください
                  </span>
                ) : (
                  <>
                    ✓ 連携済み ・{" "}
                    {new Date(status.connectedAt).toLocaleDateString("ja-JP")}
                  </>
                )}
              </p>
            </div>
          ) : (
            <Link
              key={p.key}
              href={p.authPath}
              className="p-4 bg-white border border-stone-200 rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{p.icon}</span>
                <span className="text-sm font-bold text-gray-700 group-hover:text-[#1B6B7A] transition-colors">
                  {p.label}
                </span>
              </div>
              <p className="text-xs text-stone-400">未連携 — タップして連携</p>
            </Link>
          );
        })}
      </div>

      {/* === Strava アクティビティ === */}
      {connectedProviders.has("strava") && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              🚴 最近のアクティビティ
            </h3>
            {stravaLoading && (
              <span className="text-xs text-stone-400">読み込み中...</span>
            )}
          </div>

          {activities.length > 0 ? (
            <div className="space-y-3">
              {/* サマリー */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-stone-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {activities.length}
                  </p>
                  <p className="text-xs text-stone-400">アクティビティ</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {activities
                      .reduce((sum, a) => sum + a.distance, 0)
                      .toFixed(1)}
                  </p>
                  <p className="text-xs text-stone-400">合計 km</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTime(
                      activities.reduce((sum, a) => sum + a.movingTime, 0)
                    )}
                  </p>
                  <p className="text-xs text-stone-400">合計時間</p>
                </div>
              </div>

              {/* アクティビティ一覧 */}
              {activities.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 p-4 border border-stone-100 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div className="text-xl">
                    <SportIcon type={a.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {a.name}
                    </p>
                    <p className="text-xs text-stone-400">
                      {formatDate(a.date)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      {a.distance.toFixed(1)} km
                    </p>
                    <p className="text-xs text-stone-400">
                      {formatTime(a.movingTime)}
                      {a.avgHeartrate && ` ・ ♥${Math.round(a.avgHeartrate)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !stravaLoading && (
              <p className="text-sm text-stone-400 p-4 border border-dashed border-stone-200 rounded-lg text-center">
                アクティビティデータがまだありません
              </p>
            )
          )}
        </div>
      )}

      {/* === HealthPlanet 体組成データ === */}
      {connectedProviders.has("healthplanet") && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              🏥 体組成データ（TANITA）
            </h3>
            {healthLoading && (
              <span className="text-xs text-stone-400">読み込み中...</span>
            )}
          </div>

          {healthData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {healthData.map((entry, i) => (
                <div
                  key={i}
                  className="p-4 bg-stone-50 rounded-lg text-center"
                >
                  <p className="text-xs text-stone-400 mb-1">{entry.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {entry.value}
                  </p>
                  {entry.unit && (
                    <p className="text-xs text-stone-500">{entry.unit}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !healthLoading && (
              <p className="text-sm text-stone-400 p-4 border border-dashed border-stone-200 rounded-lg text-center">
                体組成データがまだありません
              </p>
            )
          )}
        </div>
      )}

      {/* Garmin / COROS 連携済みの場合のプレースホルダー */}
      {connectedProviders.has("garmin") && (
        <div className="p-6 bg-stone-50 rounded-lg">
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            ⌚ Garmin データ
          </h3>
          <p className="text-xs text-stone-400">
            Garmin Connect からのデータ同期は準備中です。連携は完了しています。
          </p>
        </div>
      )}

      {connectedProviders.has("coros") && (
        <div className="p-6 bg-stone-50 rounded-lg">
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            🏃 COROS データ
          </h3>
          <p className="text-xs text-stone-400">
            COROS からのデータ同期は準備中です。連携は完了しています。
          </p>
        </div>
      )}

      {/* 未連携の場合のヒント */}
      {statuses.length === 0 && !loading && (
        <div className="text-center py-8 border border-dashed border-stone-300 rounded-lg">
          <p className="text-stone-500 text-sm mb-2">
            デバイスを連携すると、ここにデータが表示されます
          </p>
          <p className="text-stone-400 text-xs">
            上のカードからサービスを選んで連携してください
          </p>
        </div>
      )}
    </div>
  );
}
