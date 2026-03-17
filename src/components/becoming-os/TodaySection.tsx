"use client";

import { useEffect, useState } from "react";

interface TodayData {
  activitiesToday: number;
  totalDistanceToday: number;
  totalDurationToday: number;
  streak: number;
}

// Fallback quote (used while AI loads or if AI is unavailable)
const FALLBACK_QUOTE = "更新を重ねることが、生きるということ。";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "静かな夜に";
  if (h < 11) return "おはようございます";
  if (h < 17) return "こんにちは";
  return "おつかれさまです";
}

function formatJapaneseDate(date: Date): string {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = weekdays[date.getDay()];
  return `${date.getFullYear()}年${m}月${d}日（${w}）`;
}

interface TodaySectionProps {
  userName?: string | null;
  pinnedDeclaration?: string | null;
}

export default function TodaySection({
  userName,
  pinnedDeclaration,
}: TodaySectionProps) {
  const [data, setData] = useState<TodayData | null>(null);
  const [now, setNow] = useState<Date>(new Date());
  const [quote, setQuote] = useState<string>(FALLBACK_QUOTE);
  const [aiSource, setAiSource] = useState<"ai" | "fallback">("fallback");

  useEffect(() => {
    setNow(new Date());
    // Fetch AI-generated daily quote
    fetch("/api/ai/daily")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.quote) {
          setQuote(d.quote);
          setAiSource(d.source || "fallback");
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  useEffect(() => {
    async function fetchToday() {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await fetch(
          `/api/activities?from=${today}&to=${today}&per_page=50`
        );
        if (res.ok) {
          const json = await res.json();
          const activities = json.activities || [];
          const totalDistance = activities.reduce(
            (sum: number, a: { distance_km: number | null }) =>
              sum + (a.distance_km || 0),
            0
          );
          const totalDuration = activities.reduce(
            (sum: number, a: { duration_minutes: number | null }) =>
              sum + (a.duration_minutes || 0),
            0
          );

          // Calculate streak from recent activities
          const streakRes = await fetch("/api/activities?per_page=90");
          let streak = 0;
          if (streakRes.ok) {
            const streakJson = await streakRes.json();
            const allActivities = streakJson.activities || [];
            const dates = new Set(
              allActivities.map((a: { date: string }) => a.date)
            );
            const checkDate = new Date();
            // If no activity today, start from yesterday
            if (!dates.has(checkDate.toISOString().split("T")[0])) {
              checkDate.setDate(checkDate.getDate() - 1);
            }
            while (dates.has(checkDate.toISOString().split("T")[0])) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
            }
          }

          setData({
            activitiesToday: activities.length,
            totalDistanceToday: totalDistance,
            totalDurationToday: totalDuration,
            streak,
          });
        }
      } catch {
        setData({
          activitiesToday: 0,
          totalDistanceToday: 0,
          totalDurationToday: 0,
          streak: 0,
        });
      }
    }
    fetchToday();
  }, []);

  const greeting = getGreeting();
  const dateStr = formatJapaneseDate(now);

  return (
    <section className="relative">
      {/* Date & Greeting */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-6">
          TODAY
        </p>
        <time className="block text-sm text-stone-400 mb-4 tracking-wide">
          {dateStr}
        </time>
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 leading-snug">
          {greeting}
          {userName && (
            <span className="text-stone-400">、{userName}さん</span>
          )}
        </h1>
        <p className="text-sm text-stone-400 mt-4 font-light leading-relaxed">
          今日もあなたの物語が、一行ずつ更新されていく。
        </p>
      </div>

      {/* Daily Quote */}
      <div className="bg-stone-50/80 rounded-xl p-5 mb-8 border-l-2 border-[#1B6B7A]">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[10px] tracking-[0.2em] text-stone-400">
            TODAY&apos;S WORD
          </p>
          {aiSource === "ai" && (
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#1B6B7A]/10 text-[#1B6B7A]">
              AI
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 font-light italic leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {/* Today's Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-stone-50/80 rounded-xl p-4">
          <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-2">
            ACTIVITIES
          </p>
          <p className="text-2xl font-light text-gray-900">
            {data?.activitiesToday ?? "—"}
          </p>
          <p className="text-xs text-stone-400 mt-1">件</p>
        </div>
        <div className="bg-stone-50/80 rounded-xl p-4">
          <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-2">
            DISTANCE
          </p>
          <p className="text-2xl font-light text-gray-900">
            {data ? data.totalDistanceToday.toFixed(1) : "—"}
          </p>
          <p className="text-xs text-stone-400 mt-1">km</p>
        </div>
        <div className="bg-stone-50/80 rounded-xl p-4">
          <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-2">
            TIME
          </p>
          <p className="text-2xl font-light text-gray-900">
            {data
              ? data.totalDurationToday >= 60
                ? `${Math.floor(data.totalDurationToday / 60)}h${data.totalDurationToday % 60 > 0 ? ` ${data.totalDurationToday % 60}m` : ""}`
                : data.totalDurationToday > 0
                  ? `${data.totalDurationToday}m`
                  : "0"
              : "—"}
          </p>
          <p className="text-xs text-stone-400 mt-1">今日</p>
        </div>
        <div className="bg-stone-50/80 rounded-xl p-4">
          <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-2">
            STREAK
          </p>
          <p className="text-2xl font-light text-gray-900">
            {data?.streak ?? "—"}
          </p>
          <p className="text-xs text-stone-400 mt-1">日連続</p>
        </div>
      </div>

      {/* Pinned Declaration */}
      {pinnedDeclaration && (
        <div className="mt-8 bg-gray-900 rounded-xl p-5">
          <p className="text-[10px] tracking-[0.2em] text-stone-500 mb-2">
            MY DECLARATION
          </p>
          <p className="text-sm text-white font-light leading-relaxed">
            {pinnedDeclaration}
          </p>
        </div>
      )}
    </section>
  );
}
