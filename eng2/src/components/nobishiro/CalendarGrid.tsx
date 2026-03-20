'use client';

import React, { useMemo } from 'react';
import { Star, Heart } from 'lucide-react';

interface DayLog {
  studied: boolean;
  juku: boolean;
  badgesEarned: string[];
  parentCommented: boolean;
}

interface CalendarGridProps {
  dailyLogs: Record<string, DayLog>;
  startDate: string;
  endDate: string;
}

function dateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const d = new Date(start);
  const endD = new Date(end);
  while (d <= endD) {
    dates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

export default function CalendarGrid({
  dailyLogs,
  startDate,
  endDate,
}: CalendarGridProps) {
  const days = useMemo(() => dateRange(startDate, endDate), [startDate, endDate]);

  // Pad the beginning to align to the correct weekday
  const firstDow = new Date(startDate).getDay();
  const padBefore = firstDow;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`text-center text-[10px] font-medium ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* padding cells */}
        {Array.from({ length: padBefore }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((date, idx) => {
          const log = dailyLogs[date];
          const studied = log?.studied ?? false;
          const juku = log?.juku ?? false;
          const hasBadge = (log?.badgesEarned?.length ?? 0) > 0;
          const hasComment = log?.parentCommented ?? false;
          const isToday = date === today;
          const isFuture = date > today;

          // Check streak connection: studied today and previous day
          const prevDate = idx > 0 ? days[idx - 1] : null;
          const prevStudied = prevDate ? (dailyLogs[prevDate]?.studied ?? false) : false;
          const streakConnected = studied && prevStudied;

          const dayNum = new Date(date).getDate();

          return (
            <div
              key={date}
              className={`
                relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs
                transition-colors
                ${studied
                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                  : isFuture
                    ? 'bg-gray-50 text-gray-300'
                    : 'bg-gray-50 text-gray-400'
                }
                ${isToday ? 'ring-2 ring-indigo-400 ring-offset-1' : ''}
                ${streakConnected ? 'shadow-sm' : ''}
              `}
            >
              <span className="text-[10px] leading-none">{dayNum}</span>

              {/* Indicators */}
              <div className="flex items-center gap-0.5 mt-0.5">
                {juku && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
                {hasBadge && (
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                )}
                {hasComment && (
                  <Heart className="w-2.5 h-2.5 text-pink-400 fill-pink-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-emerald-100" /> 学習した日
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> 塾
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> バッジ
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-2.5 h-2.5 text-pink-400 fill-pink-400" /> おうちの人
        </span>
      </div>
    </div>
  );
}
