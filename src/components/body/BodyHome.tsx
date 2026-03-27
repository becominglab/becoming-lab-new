"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, ChevronRight, Sparkles } from "lucide-react";

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

export default function BodyHome({ userName }: BodyHomeProps) {
  const [todayLog, setTodayLog] = useState<Log | null>(null);
  const [streak, setStreak] = useState<Streak>({ current_streak: 0, max_streak: 0, last_log_date: null });
  const [coachMessage, setCoachMessage] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    Promise.all([
      fetch(`/api/body/logs?from=${today}&to=${today}`).then((r) => r.json()),
      fetch("/api/body/streaks").then((r) => r.json()),
      fetch("/api/body/coach").then((r) => r.json()),
      fetch("/api/body/profile").then((r) => r.json()),
    ])
      .then(([logsData, streakData, coachData, profileData]) => {
        if (logsData.logs?.length > 0) setTodayLog(logsData.logs[0]);
        if (streakData.streak) setStreak(streakData.streak);
        if (coachData.message) setCoachMessage(coachData.message);
        if (profileData.profile) setProfile(profileData.profile);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [today]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
      </div>
    );
  }

  const score = calcScore(todayLog);
  const logged = todayLog !== null;

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
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= score ? "bg-emerald-400" : "bg-stone-100"
                }`}
              />
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
          {streak.max_streak > 0 && (
            <p className="text-[10px] text-stone-400 mt-2">
              最高: {streak.max_streak}日
            </p>
          )}
        </div>
      </div>

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
