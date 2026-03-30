"use client";

import { useState, useEffect } from "react";

interface DayData {
  body_log: boolean;
  reflection: boolean;
  story: boolean;
  post: boolean;
  count: number;
}

interface Props {
  userId?: string;
  year?: number;
}

const INTENSITY_COLORS = [
  "bg-stone-100",   // 0
  "bg-teal-200",    // 1
  "bg-teal-300",    // 2
  "bg-teal-500",    // 3
  "bg-teal-700",    // 4+
];

const MONTH_LABELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

function getColor(count: number): string {
  return INTENSITY_COLORS[Math.min(count, 4)];
}

function getDatesForYear(year: number): string[][] {
  const weeks: string[][] = [];
  const start = new Date(year, 0, 1);
  // 年の初日の曜日を取得 (0=日, 6=土)
  const startDow = start.getDay();

  // 年の初日が含まれる週の日曜日から開始
  const firstSunday = new Date(start);
  firstSunday.setDate(firstSunday.getDate() - startDow);

  let current = new Date(firstSunday);
  const endOfYear = new Date(year, 11, 31);

  while (current <= endOfYear || weeks.length < 53) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toISOString().split("T")[0];
      const isInYear = current.getFullYear() === year;
      week.push(isInYear ? dateStr : "");
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
    if (current.getFullYear() > year && weeks.length >= 52) break;
  }

  return weeks;
}

export default function UpdateCalendar({ userId, year: initialYear }: Props) {
  const year = initialYear || new Date().getFullYear();
  const [days, setDays] = useState<Record<string, DayData>>({});
  const [tooltip, setTooltip] = useState<{ date: string; data: DayData } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ year: year.toString() });
    if (userId) params.set("user_id", userId);

    fetch(`/api/sns/calendar?${params}`)
      .then((r) => r.json())
      .then((data) => setDays(data.days || {}))
      .catch(() => {});
  }, [userId, year]);

  const weeks = getDatesForYear(year);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-stone-500">{year}年の更新カレンダー</h3>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-0.5" style={{ minWidth: "max-content" }}>
          {/* 月ラベル */}
          <div className="flex gap-0.5 mb-1 pl-5">
            {MONTH_LABELS.map((m, i) => (
              <span
                key={i}
                className="text-[8px] text-stone-400"
                style={{ width: `${(weeks.length / 12) * 11}px`, textAlign: "left" }}
              >
                {m}月
              </span>
            ))}
          </div>

          {/* カレンダーグリッド */}
          <div className="flex gap-0.5">
            {/* 曜日ラベル */}
            <div className="flex flex-col gap-0.5 pr-1">
              {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
                <span key={i} className="text-[8px] text-stone-400 h-[11px] flex items-center justify-end w-3">
                  {i % 2 === 1 ? d : ""}
                </span>
              ))}
            </div>

            {/* 週の列 */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((date, di) => {
                  if (!date) {
                    return <div key={di} className="w-[11px] h-[11px]" />;
                  }
                  const dayData = days[date];
                  const count = dayData?.count || 0;

                  return (
                    <div
                      key={di}
                      className={`w-[11px] h-[11px] rounded-sm ${getColor(count)} cursor-pointer transition-colors hover:ring-1 hover:ring-stone-400`}
                      onMouseEnter={() => dayData && setTooltip({ date, data: dayData })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ツールチップ */}
      {tooltip && (
        <div className="text-xs text-stone-600 bg-white border border-stone-200 rounded p-2 inline-block">
          <span className="font-medium">{tooltip.date}</span>
          <span className="text-stone-400 ml-2">
            {tooltip.data.body_log && "Body "}
            {tooltip.data.reflection && "振り返り "}
            {tooltip.data.story && "ストーリー "}
            {tooltip.data.post && "投稿 "}
          </span>
        </div>
      )}

      {/* 凡例 */}
      <div className="flex items-center gap-1 text-[9px] text-stone-400">
        <span>少</span>
        {INTENSITY_COLORS.map((color, i) => (
          <div key={i} className={`w-[10px] h-[10px] rounded-sm ${color}`} />
        ))}
        <span>多</span>
      </div>
    </div>
  );
}
