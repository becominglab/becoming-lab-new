'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState, DailyLog } from '@/lib/nobishiro/types';

const SPRING_START = '2026-03-25';
const SPRING_END = '2026-04-06';

function getDaysInRange(start: string, end: string): string[] {
  const days: string[] = [];
  const current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    days.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

const ENCOURAGING_MESSAGES = [
  '春休みの地図が埋まってきたね！',
  'すこしずつ前に進んでる！',
  'がんばった日がキラキラしてる！',
  '自分のペースでOK！',
];

function getEncouragement(studiedDays: number): string {
  if (studiedDays === 0) return 'さあ、春休みの冒険を始めよう！';
  if (studiedDays < 3) return 'いいスタートだね！';
  if (studiedDays < 7) return '春休みの地図が埋まってきたね！';
  if (studiedDays < 14) return 'すごい！もう半分以上がんばった！';
  return 'ここまで来たらゴールまであと少し！';
}

export default function CalendarPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nobishiro-quest');
      if (!stored) { router.replace('/mm'); return; }
      const s = JSON.parse(stored) as AppState;
      if (!s.currentUser) { router.replace('/mm'); return; }
      setState(s);
    } catch { router.replace('/mm'); }
  }, [router]);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  const today = getToday();
  const springDays = getDaysInRange(SPRING_START, SPRING_END);
  const logs = state.dailyLogs || {};

  // Stats
  const studiedDays = springDays.filter((d) => logs[d]?.studied).length;
  const jukuDays = springDays.filter((d) => logs[d]?.juku).length;
  const badgeDays = springDays.filter((d) => logs[d]?.badgesEarned?.length > 0).length;

  // Streak calculation within spring break
  const streakDays = new Set<string>();
  let currentStreak: string[] = [];
  for (const day of springDays) {
    if (logs[day]?.studied) {
      currentStreak.push(day);
    } else {
      if (currentStreak.length >= 2) {
        currentStreak.forEach((d) => streakDays.add(d));
      }
      currentStreak = [];
    }
  }
  if (currentStreak.length >= 2) {
    currentStreak.forEach((d) => streakDays.add(d));
  }

  // Get first day of week for padding
  const firstDayOfWeek = new Date(SPRING_START).getDay();

  // Build calendar grid with padding
  const calendarCells: (string | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  springDays.forEach((d) => calendarCells.push(d));

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-500 px-5 pt-10 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.push('/mm/home')}
            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white text-lg"
          >
            ←
          </button>
          <h1 className="text-white text-xl font-bold">春休みカレンダー</h1>
        </div>
        <p className="text-white/70 text-sm text-center">2026年 3月〜4月</p>

        {/* Stats */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 text-center">
            <div className="text-white text-xl font-bold">{studiedDays}</div>
            <div className="text-white/70 text-xs">学習した日</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 text-center">
            <div className="text-white text-xl font-bold">{jukuDays}</div>
            <div className="text-white/70 text-xs">塾の日</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 text-center">
            <div className="text-white text-xl font-bold">{badgeDays}</div>
            <div className="text-white/70 text-xs">バッジの日</div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-3 space-y-4">
        {/* Encouragement */}
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-4 text-center">
          <p className="text-sm text-slate-700">
            ここまで<span className="font-bold text-sky-600">{studiedDays}日</span>がんばった！
          </p>
          <p className="text-xs text-slate-400 mt-1">{getEncouragement(studiedDays)}</p>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAY_LABELS.map((label, i) => (
              <div
                key={label}
                className={`text-center text-xs font-medium py-1 ${
                  i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const log: DailyLog | undefined = logs[day];
              const isToday = day === today;
              const studied = log?.studied;
              const juku = log?.juku;
              const hasBadge = log?.badgesEarned && log.badgesEarned.length > 0;
              const parentCommented = log?.parentCommented;
              const isStreakDay = streakDays.has(day);
              const dayNum = new Date(day).getDate();
              const isPast = day < today;
              const isFuture = day > today;

              return (
                <div
                  key={day}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    isToday
                      ? 'ring-2 ring-sky-400 ring-offset-1'
                      : ''
                  } ${
                    studied
                      ? isStreakDay
                        ? 'bg-gradient-to-br from-green-100 to-emerald-100'
                        : 'bg-green-50'
                      : isFuture
                      ? 'bg-slate-50'
                      : 'bg-slate-50/50'
                  }`}
                >
                  {/* Day number */}
                  <span className={`text-xs font-medium ${
                    studied ? 'text-green-700' : isToday ? 'text-sky-600' : 'text-slate-400'
                  }`}>
                    {dayNum}
                  </span>

                  {/* Status icons */}
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                    {studied && <span className="text-[10px]">✅</span>}
                    {juku && <span className="text-[10px]">🏫</span>}
                    {hasBadge && <span className="text-[10px]">⭐</span>}
                    {parentCommented && <span className="text-[10px]">💌</span>}
                  </div>

                  {/* Streak connector (visual left border for consecutive days) */}
                  {isStreakDay && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-green-300 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h3 className="text-xs font-bold text-slate-500 mb-2">マークの意味</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">✅</span>
              <span className="text-xs text-slate-600">学習した日</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🏫</span>
              <span className="text-xs text-slate-600">塾に行った日</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">⭐</span>
              <span className="text-xs text-slate-600">バッジ獲得</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">💌</span>
              <span className="text-xs text-slate-600">親からコメント</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-100 border border-green-200" />
              <span className="text-xs text-slate-600">連続日（ストリーク）</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded ring-2 ring-sky-400" />
              <span className="text-xs text-slate-600">今日</span>
            </div>
          </div>
        </div>

        {/* Gentle note */}
        <div className="text-center py-2">
          <p className="text-xs text-slate-400">
            空白の日があっても大丈夫。自分のペースで進もう。
          </p>
        </div>
      </div>
    </div>
  );
}
