"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HealthSnapshotCards from "./HealthSnapshotCards";

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

// Contextual meaning for each activity type
const SPORT_MEANING: Record<string, string> = {
  Run: "自分と向き合うために",
  Ride: "風を感じながら前へ進むために",
  Swim: "水の中で思考をリセットするために",
  Walk: "歩きながら考えるために",
  Hike: "自然の中で自分を取り戻すために",
  WeightTraining: "体を鍛え、心を整えるために",
  Workout: "限界を押し広げるために",
  Yoga: "内側と対話するために",
  TrailRun: "自然の中で挑戦するために",
  VirtualRun: "距離を超えて走るために",
  VirtualRide: "どこまでも走り続けるために",
  Other: "自分を更新するために",
};

function formatDuration(min: number): string {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h${m}m` : `${h}h`;
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

export default function ActionMeaningSection() {
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

  return (
    <section>
      {/* Section Label */}
      <p
        className="text-[10px] tracking-[0.35em] uppercase mb-3"
        style={{ color: "var(--gold, #B8A88A)" }}
      >
        Action
      </p>
      <h2
        className="text-xl md:text-2xl font-light mb-2"
        style={{ color: "var(--ink, #1A1A1A)" }}
      >
        行動の意味
      </h2>
      <p className="text-sm text-stone-400 font-light mb-8">
        動いた分だけ、自分が更新される。
      </p>

      {/* Activity List — meaning first, numbers second */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-10 rounded-xl" style={{ backgroundColor: "rgba(184, 168, 138, 0.06)" }}>
          <p className="text-sm text-stone-400 font-light">まだ記録がありません</p>
          <p className="text-xs text-stone-300 mt-2">
            Stravaを連携するか、手動で記録を追加しましょう
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((a) => {
            const meaning =
              SPORT_MEANING[a.activity_type] || SPORT_MEANING.Other;
            const label =
              a.name || SPORT_LABELS[a.activity_type] || a.activity_type;

            return (
              <div
                key={a.id}
                className="p-5 rounded-xl transition-colors hover:bg-stone-50/60"
              >
                {/* Meaning line — the main message */}
                <p className="text-sm font-light leading-relaxed mb-2" style={{ color: "var(--ink, #1A1A1A)" }}>
                  <span className="text-stone-400">{meaning}</span>
                  {a.distance_km
                    ? ` ${a.distance_km.toFixed(1)}km ${label === SPORT_LABELS[a.activity_type] ? "" : "— " + label}`
                    : ` ${label}`}
                </p>

                {/* Meta — subtle */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-stone-300">
                    {formatRelativeDate(a.date)}
                  </span>
                  {a.duration_minutes && (
                    <span className="text-[10px] text-stone-300">
                      {formatDuration(a.duration_minutes)}
                    </span>
                  )}
                  {a.heart_rate_avg && (
                    <span className="text-[10px] text-stone-300">
                      ♥ {a.heart_rate_avg}
                    </span>
                  )}
                  <span className="text-[9px] text-stone-200 uppercase ml-auto">
                    {a.source}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Health Data — quiet, secondary */}
      <div className="mt-10">
        <p
          className="text-[10px] tracking-[0.25em] uppercase mb-4"
          style={{ color: "var(--gold, #B8A88A)" }}
        >
          Body Data
        </p>
        <HealthSnapshotCards />
      </div>

      {/* Sub-page Links */}
      <div className="grid grid-cols-2 gap-3 mt-8">
        <Link
          href="/mypage/activities"
          className="p-4 rounded-xl hover:bg-stone-100/80 transition-colors text-center group"
          style={{ backgroundColor: "rgba(184, 168, 138, 0.06)" }}
        >
          <p className="text-[10px] tracking-[0.2em] mb-1" style={{ color: "var(--gold, #B8A88A)" }}>
            HISTORY
          </p>
          <p className="text-sm text-gray-700 group-hover:text-[#1B6B7A] transition-colors">
            アクティビティ履歴
          </p>
        </Link>
        <Link
          href="/mypage/health"
          className="p-4 rounded-xl hover:bg-stone-100/80 transition-colors text-center group"
          style={{ backgroundColor: "rgba(184, 168, 138, 0.06)" }}
        >
          <p className="text-[10px] tracking-[0.2em] mb-1" style={{ color: "var(--gold, #B8A88A)" }}>
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
