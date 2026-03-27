"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame, ChevronRight, Sparkles, ArrowRight, AlertCircle } from "lucide-react";

interface BodyHomeProps {
  userName: string | null;
}

interface Log {
  date: string;
  meal_score: number;
  workout_score: number;
  mood: number;
}

interface Streak {
  current_streak: number;
  max_streak: number;
  last_log_date: string | null;
}

interface Profile {
  why_text: string | null;
  goal_text: string | null;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "静かな夜に";
  if (h < 11) return "おはようございます";
  if (h < 17) return "こんにちは";
  return "おつかれさまです";
}

function calcScore(log: Log | null): number {
  if (!log) return 0;
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

function getStreakBadge(streak: number): { emoji: string; label: string } | null {
  if (streak >= 100) return { emoji: "👑", label: "伝説" };
  if (streak >= 50) return { emoji: "💎", label: "ダイヤモンド" };
  if (streak >= 30) return { emoji: "🏆", label: "マスター" };
  if (streak >= 14) return { emoji: "🌳", label: "定着" };
  if (streak >= 7) return { emoji: "🌿", label: "習慣の芽" };
  if (streak >= 3) return { emoji: "🌱", label: "スタート" };
  return null;
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

export default function BodyHome({ userName }: BodyHomeProps) {
  const router = useRouter();
  const [todayLog, setTodayLog] = useState<Log | null>(null);
  const [recentLogs, setRecentLogs] = useState<Log[]>([]);
  const [streak, setStreak] = useState<Streak>({ current_streak: 0, max_streak: 0, last_log_date: null });
  const [coachMessage, setCoachMessage] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const last7 = useMemo(() => getLast7Days(), []);
  const weekFrom = last7[0];

  useEffect(() => {
    Promise.all([
      fetch(`/api/body/logs?from=${weekFrom}&to=${today}&limit=7`).then((r) => r.json()),
      fetch("/api/body/streaks").then((r) => r.json()),
      fetch("/api/body/coach").then((r) => r.json()),
      fetch("/api/body/profile").then((r) => r.json()),
    ])
      .then(([logsData, streakData, coachData, profileData]) => {
        const logs: Log[] = logsData.logs || [];
        setRecentLogs(logs);
        const todayEntry = logs.find((l: Log) => l.date === today);
        if (todayEntry) setTodayLog(todayEntry);
        if (streakData.streak) setStreak(streakData.streak);
        if (coachData.message) setCoachMessage(coachData.message);
        if (profileData.profile) {
          setProfile(profileData.profile);
        } else {
          setShowOnboarding(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [today, weekFrom]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Onboarding (first-time user) ──
  if (showOnboarding) {
    return (
      <div className="px-6 pt-20 pb-28 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-8">
          <Sparkles size={28} className="text-white" />
        </div>

        <h1 className="text-2xl font-light text-gray-900 mb-3">
          Becoming Body へようこそ
        </h1>
        <p className="text-sm text-stone-500 font-light leading-relaxed mb-2">
          痩せるんじゃない、更新する。
        </p>
        <p className="text-sm text-stone-400 font-light leading-relaxed mb-10 max-w-xs">
          毎日10秒、食事・運動・気分を記録するだけ。
          <br />
          小さな積み重ねが、あなたを変えていきます。
        </p>

        <div className="w-full space-y-4 mb-10">
          <div className="bg-white rounded-2xl p-5 border border-stone-100 text-left">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-medium">1</span>
              <span className="text-sm font-medium text-gray-800">Whyを設定する</span>
            </div>
            <p className="text-xs text-stone-400 ml-11">なぜ変わりたいのか、言葉にしましょう</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-100 text-left">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500 text-sm font-medium">2</span>
              <span className="text-sm font-medium text-gray-800">毎日10秒で記録</span>
            </div>
            <p className="text-xs text-stone-400 ml-11">食事・運動・気分を3択でタップ</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-100 text-left">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500 text-sm font-medium">3</span>
              <span className="text-sm font-medium text-gray-800">変化を振り返る</span>
            </div>
            <p className="text-xs text-stone-400 ml-11">週間・月間で自分の変化が見える</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/body/profile")}
          className="w-full bg-gray-900 text-white py-4 rounded-xl text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          まずWhyを設定する <ArrowRight size={16} />
        </button>

        <button
          onClick={() => setShowOnboarding(false)}
          className="mt-4 text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          あとで設定する
        </button>
      </div>
    );
  }

  const score = calcScore(todayLog);
  const logged = todayLog !== null;

  // Check if yesterday is missing
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  })();
  const yesterdayLogged = recentLogs.some((l) => l.date === yesterday);
  const logsByDate = new Map(recentLogs.map((l) => [l.date, l]));

  return (
    <div className="px-6 pt-14 pb-8">
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-2">
          BECOMING BODY
        </p>
        <h1 className="text-2xl font-light text-gray-900">
          {getGreeting()}
          {userName && (
            <span className="text-stone-400">、{userName}さん</span>
          )}
        </h1>
      </div>

      {/* Yesterday Missing Banner */}
      {!yesterdayLogged && streak.current_streak > 0 && (
        <Link href={`/body/log?date=${yesterday}`}>
          <div className="bg-amber-50 rounded-2xl p-4 mb-6 border border-amber-100 flex items-center gap-3 hover:bg-amber-100 transition-colors">
            <AlertCircle size={18} className="text-amber-500 shrink-0" />
            <div>
              <p className="text-sm text-amber-800 font-medium">
                昨日の記録がまだです
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                タップして記録すればストリーク継続！
              </p>
            </div>
            <ChevronRight size={16} className="text-amber-300 ml-auto shrink-0" />
          </div>
        </Link>
      )}

      {/* AI Coach Message */}
      {coachMessage && (
        <div className="bg-white rounded-2xl p-5 mb-6 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">
              TODAY&apos;S MESSAGE
            </span>
          </div>
          <p className="text-sm text-gray-800 font-light leading-relaxed">
            {coachMessage}
          </p>
        </div>
      )}

      {/* Today's Log Status */}
      <Link href="/body/log">
        <div className="bg-white rounded-2xl p-5 mb-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">
              TODAY&apos;S UPDATE
            </span>
            <ChevronRight size={16} className="text-stone-300" />
          </div>

          {logged ? (
            <div className="grid grid-cols-3 gap-4">
              <LogItem label="食事" value={MEAL_LABELS[todayLog.meal_score]} ok={todayLog.meal_score >= 2} />
              <LogItem label="運動" value={WORKOUT_LABELS[todayLog.workout_score]} ok={todayLog.workout_score >= 2} />
              <LogItem label="気分" value={MOOD_EMOJIS[todayLog.mood]} ok={todayLog.mood >= 2} />
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-stone-400 font-light">
                タップして今日の記録をつけよう
              </p>
              <p className="text-xs text-stone-300 mt-1">10秒で完了</p>
            </div>
          )}
        </div>
      </Link>

      {/* 7-Day Mini Calendar */}
      <div className="bg-white rounded-2xl p-4 mb-6 border border-stone-100 shadow-sm">
        <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-3">
          THIS WEEK
        </p>
        <div className="flex justify-between">
          {last7.map((dateStr) => {
            const d = new Date(dateStr + "T00:00:00");
            const dayName = DAY_NAMES[d.getDay()];
            const isToday = dateStr === today;
            const log = logsByDate.get(dateStr);
            const logScore = log ? calcScore(log) : -1;

            return (
              <div key={dateStr} className="flex flex-col items-center gap-1.5">
                <span className={`text-[10px] ${isToday ? "text-gray-900 font-medium" : "text-stone-400"}`}>
                  {dayName}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                    isToday && !log
                      ? "border-2 border-dashed border-stone-300 text-stone-300"
                      : logScore === 3
                        ? "bg-emerald-500 text-white"
                        : logScore >= 1
                          ? "bg-emerald-100 text-emerald-700"
                          : dateStr > today
                            ? "bg-stone-50 text-stone-200"
                            : "bg-stone-100 text-stone-300"
                  }`}
                >
                  {log ? logScore : isToday ? "?" : dateStr > today ? "" : "·"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score & Streak */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Action Score */}
        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-3">
            SCORE
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-gray-900">{score}</span>
            <span className="text-sm text-stone-300">/ 3</span>
          </div>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full bg-stone-100 overflow-hidden">
                {i <= score && (
                  <div
                    className="h-full bg-emerald-400 rounded-full animate-score-grow"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-3">
            STREAK
          </p>
          <div className="flex items-baseline gap-1">
            <Flame size={20} className={streak.current_streak > 0 ? "text-orange-400" : "text-stone-200"} />
            <span className="text-3xl font-light text-gray-900">
              {streak.current_streak}
            </span>
            <span className="text-sm text-stone-300">日</span>
          </div>
          {(() => {
            const badge = getStreakBadge(streak.current_streak);
            if (badge) {
              return (
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs">{badge.emoji}</span>
                  <span className="text-[10px] text-stone-500">{badge.label}</span>
                </div>
              );
            }
            if (streak.max_streak > 0) {
              return (
                <p className="text-[10px] text-stone-400 mt-2">
                  最高: {streak.max_streak}日
                </p>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* History Link */}
      <Link href="/body/history">
        <div className="bg-white rounded-2xl p-4 mb-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-1">HISTORY</p>
            <p className="text-sm text-gray-700 font-light">週間・月間の振り返りを見る</p>
          </div>
          <ChevronRight size={16} className="text-stone-300" />
        </div>
      </Link>

      {/* Why */}
      <Link href="/body/profile">
        <div className="bg-gray-900 rounded-2xl p-5 border border-stone-800 shadow-sm hover:bg-gray-800 transition-colors">
          <p className="text-[10px] tracking-[0.2em] text-stone-500 uppercase mb-2">
            MY WHY
          </p>
          {profile?.why_text ? (
            <p className="text-sm text-white font-light leading-relaxed">
              {profile.why_text}
            </p>
          ) : (
            <p className="text-sm text-stone-500 font-light">
              変わりたい理由を言葉にしよう →
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

function LogItem({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-stone-400 mb-1">{label}</p>
      <p className={`text-sm font-medium ${ok ? "text-emerald-600" : "text-red-400"}`}>
        {value}
      </p>
    </div>
  );
}
