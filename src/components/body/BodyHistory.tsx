"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

// Dynamic import recharts to avoid SSR issues
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const AreaChart = dynamic(
  () => import("recharts").then((m) => m.AreaChart),
  { ssr: false }
);
const Area = dynamic(
  () => import("recharts").then((m) => m.Area),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((m) => m.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((m) => m.YAxis),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false }
);

// Dynamic imports for LineChart
const LineChart = dynamic(
  () => import("recharts").then((m) => m.LineChart),
  { ssr: false }
);
const Line = dynamic(
  () => import("recharts").then((m) => m.Line),
  { ssr: false }
);

interface Log {
  date: string;
  meal_score: number;
  workout_score: number;
  mood: number;
  weight_kg?: number | null;
}

function calcScore(log: Log): number {
  return (
    (log.meal_score >= 2 ? 1 : 0) +
    (log.workout_score >= 2 ? 1 : 0) +
    (log.mood >= 2 ? 1 : 0)
  );
}

const MEAL_LABELS = ["", "崩れた", "普通", "良い"];
const WORKOUT_LABELS = ["", "何もしてない", "軽く動いた", "しっかりやった"];
const MOOD_EMOJIS = ["", "😢", "😐", "😊"];
const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function getWeekDates(offset: number): { from: string; to: string; dates: string[] } {
  const today = new Date();
  today.setDate(today.getDate() - offset * 7);
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return { from: dates[0], to: dates[6], dates };
}

function getMonthRange(): { from: string; to: string } {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 29);
  return {
    from: from.toISOString().split("T")[0],
    to: today.toISOString().split("T")[0],
  };
}

export default function BodyHistory() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekLogs, setWeekLogs] = useState<Log[]>([]);
  const [monthLogs, setMonthLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize week to prevent infinite useEffect loop
  const week = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Fetch week data
  useEffect(() => {
    fetch(`/api/body/logs?from=${week.from}&to=${week.to}&limit=7`)
      .then((r) => r.json())
      .then((d) => setWeekLogs(d.logs || []))
      .catch(() => setWeekLogs([]));
  }, [week.from, week.to]);

  // Fetch month data
  useEffect(() => {
    const { from, to } = getMonthRange();
    fetch(`/api/body/logs?from=${from}&to=${to}&limit=30`)
      .then((r) => r.json())
      .then((d) => {
        setMonthLogs(d.logs || []);
        setLoading(false);
      })
      .catch(() => {
        setMonthLogs([]);
        setLoading(false);
      });
  }, []);

  const logByDate = new Map(weekLogs.map((l) => [l.date, l]));

  // Build chart data for month view
  const { chartData, weightData, hasWeight } = useMemo(() => {
    const { from } = getMonthRange();
    const fromDate = new Date(from + "T00:00:00");
    const monthMap = new Map(monthLogs.map((l) => [l.date, l]));
    const scoreArr: { date: string; label: string; score: number | null }[] = [];
    const weightArr: { date: string; label: string; weight: number | null }[] = [];
    let anyWeight = false;

    for (let i = 0; i < 30; i++) {
      const d = new Date(fromDate);
      d.setDate(fromDate.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const log = monthMap.get(dateStr);
      scoreArr.push({
        date: dateStr,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        score: log ? calcScore(log) : null,
      });
      const w = log?.weight_kg ? Number(log.weight_kg) : null;
      if (w) anyWeight = true;
      weightArr.push({
        date: dateStr,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        weight: w,
      });
    }
    return { chartData: scoreArr, weightData: weightArr, hasWeight: anyWeight };
  }, [monthLogs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
      </div>
    );
  }

  const weekLabel = (() => {
    const fromDate = new Date(week.from + "T00:00:00");
    const toDate = new Date(week.to + "T00:00:00");
    return `${fromDate.getMonth() + 1}/${fromDate.getDate()} 〜 ${toDate.getMonth() + 1}/${toDate.getDate()}`;
  })();

  const loggedDaysThisWeek = weekLogs.length;
  const weekAvgScore =
    weekLogs.length > 0
      ? (weekLogs.reduce((s, l) => s + calcScore(l), 0) / weekLogs.length).toFixed(1)
      : "-";

  return (
    <div className="px-6 pt-12 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Link href="/body" className="text-stone-400 hover:text-stone-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase">
            HISTORY
          </p>
          <h1 className="text-xl font-light text-gray-900 mt-1">ふりかえり</h1>
        </div>
      </div>

      {/* Week Navigator */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="p-2 rounded-lg hover:bg-stone-100 text-stone-400"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm text-stone-600 font-medium">{weekLabel}</span>
        <button
          onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
          disabled={weekOffset === 0}
          className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border border-stone-100">
          <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">記録日数</p>
          <p className="text-2xl font-light text-gray-900">
            {loggedDaysThisWeek}<span className="text-sm text-stone-300"> / 7日</span>
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-100">
          <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">平均スコア</p>
          <p className="text-2xl font-light text-gray-900">
            {weekAvgScore}<span className="text-sm text-stone-300"> / 3</span>
          </p>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden mb-8">
        {week.dates.map((dateStr) => {
          const log = logByDate.get(dateStr);
          const d = new Date(dateStr + "T00:00:00");
          const dayName = DAY_NAMES[d.getDay()];
          const isToday = dateStr === todayStr;
          const isFuture = dateStr > todayStr;

          return (
            <div
              key={dateStr}
              className={`flex items-center px-4 py-3 border-b border-stone-50 last:border-b-0 ${
                isToday ? "bg-stone-50" : ""
              }`}
            >
              <div className="w-16 flex items-center gap-2">
                <span
                  className={`text-xs font-medium ${
                    isToday
                      ? "bg-gray-900 text-white px-1.5 py-0.5 rounded"
                      : d.getDay() === 0 || d.getDay() === 6
                        ? "text-stone-400"
                        : "text-stone-600"
                  }`}
                >
                  {dayName}
                </span>
                <span className="text-xs text-stone-400">
                  {formatDateShort(dateStr)}
                </span>
              </div>

              {isFuture ? (
                <span className="text-xs text-stone-300 ml-auto">—</span>
              ) : log ? (
                <div className="flex items-center gap-4 ml-auto">
                  <span
                    className={`text-xs ${
                      log.meal_score >= 2 ? "text-emerald-600" : "text-red-400"
                    }`}
                  >
                    {MEAL_LABELS[log.meal_score]}
                  </span>
                  <span
                    className={`text-xs ${
                      log.workout_score >= 2 ? "text-emerald-600" : "text-red-400"
                    }`}
                  >
                    {WORKOUT_LABELS[log.workout_score]}
                  </span>
                  <span className="text-sm">{MOOD_EMOJIS[log.mood]}</span>
                  <span
                    className={`text-xs font-medium w-6 text-center ${
                      calcScore(log) === 3
                        ? "text-emerald-600"
                        : calcScore(log) >= 2
                          ? "text-stone-600"
                          : "text-red-400"
                    }`}
                  >
                    {calcScore(log)}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-stone-300 ml-auto">未記録</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Monthly Score Chart */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-4">
          30-DAY SCORE TREND
        </p>
        {monthLogs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-stone-100 text-center">
            <p className="text-sm text-stone-400 font-light">記録が増えるとグラフが表示されます</p>
            <p className="text-xs text-stone-300 mt-1">まずは1日記録してみましょう</p>
          </div>
        ) : (
        <div className="bg-white rounded-2xl p-4 border border-stone-100">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#a8a29e" }}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis
                domain={[0, 3]}
                ticks={[0, 1, 2, 3]}
                tick={{ fontSize: 10, fill: "#a8a29e" }}
                tickLine={false}
                axisLine={false}
                width={20}
              />
              <Tooltip
                formatter={(value: unknown) => [`${value} / 3`, "スコア"]}
                labelFormatter={(label: unknown) => String(label)}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e7e5e4",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#scoreGrad)"
                connectNulls
                dot={{ r: 2, fill: "#10b981" }}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        )}
      </div>

      {/* Weight Chart (shown only if user has weight data) */}
      {hasWeight && (
        <div className="mb-4">
          <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-4">
            WEIGHT TREND
          </p>
          <div className="bg-white rounded-2xl p-4 border border-stone-100">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#a8a29e" }}
                  tickLine={false}
                  axisLine={false}
                  interval={6}
                />
                <YAxis
                  domain={[(min: number) => Math.floor(min - 1), (max: number) => Math.ceil(max + 1)]}
                  tick={{ fontSize: 10, fill: "#a8a29e" }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                  unit="kg"
                />
                <Tooltip
                  formatter={(value: unknown) => [`${value} kg`, "体重"]}
                  labelFormatter={(label: unknown) => String(label)}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e7e5e4",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#6366f1"
                  strokeWidth={2}
                  connectNulls
                  dot={{ r: 2, fill: "#6366f1" }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
