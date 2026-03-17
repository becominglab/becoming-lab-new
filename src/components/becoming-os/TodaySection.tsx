"use client";

import { useEffect, useState } from "react";

interface TodayData {
  activitiesToday: number;
  totalDistanceToday: number;
  totalDurationToday: number;
  streak: number;
}

const DAILY_QUOTES = [
  "完璧を目指すより、まず終わらせろ。",
  "昨日の自分を超えることだけに集中する。",
  "小さな一歩が、やがて大きな旅になる。",
  "変化を恐れるな。変わらないことを恐れろ。",
  "今日やらなかったことは、明日もやらない。",
  "習慣は、第二の天性である。",
  "始めることが、すでに半分を終えたこと。",
  "自分を信じろ。他の誰もあなたにはなれない。",
  "失敗とは、やめた時にだけ起こるものだ。",
  "一日一日が、自分を編集するチャンス。",
  "走れない日は歩け。歩けない日は立て。",
  "迷ったときは、より勇気のいる方を選べ。",
  "過程を楽しめる者が、最も遠くへ行ける。",
  "考えすぎるな。動け。",
  "いまの自分は、過去の選択の結果だ。",
  "できない理由ではなく、できる方法を探せ。",
  "継続は力なり。しかし、正しい方向にのみ。",
  "自分のペースでいい。でも止まるな。",
  "限界は、自分が決めているだけだ。",
  "昨日植えた木が、明日の日陰を作る。",
  "準備ができてから始めるのでは遅い。",
  "人生に正解はない。あるのは選択だけだ。",
  "体を動かすと、心も動き出す。",
  "記録は嘘をつかない。",
  "静かに、しかし確実に、前へ。",
  "弱さを知ることが、強さの始まり。",
  "今日の汗は、明日の自信になる。",
  "言葉にすることで、意志は力を持つ。",
  "不安は、挑戦している証拠だ。",
  "更新を重ねることが、生きるということ。",
];

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

function getDailyQuote(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
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

  useEffect(() => {
    setNow(new Date());
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
  const quote = getDailyQuote();

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
        <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-2">
          TODAY&apos;S WORD
        </p>
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
