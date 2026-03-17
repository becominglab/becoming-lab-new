"use client";

import { useEffect, useState } from "react";

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

interface HeroMorningSectionProps {
  userName?: string | null;
  onScrollToWrite?: () => void;
}

export default function HeroMorningSection({
  userName,
  onScrollToWrite,
}: HeroMorningSectionProps) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    setNow(new Date());
  }, []);

  const greeting = getGreeting();
  const dateStr = formatJapaneseDate(now);

  return (
    <section className="relative pt-4 pb-8">
      {/* Date — small, quiet */}
      <time
        className="block text-[11px] tracking-[0.3em] mb-10"
        style={{ color: "var(--gold, #B8A88A)" }}
      >
        {dateStr}
      </time>

      {/* Greeting — large, warm */}
      <h1
        className="text-3xl md:text-[2.5rem] font-light leading-snug tracking-tight"
        style={{ color: "var(--ink, #1A1A1A)" }}
      >
        {greeting}
        {userName && (
          <span className="text-stone-400">、{userName}さん</span>
        )}
      </h1>

      {/* Hero copy */}
      <p className="text-[15px] text-stone-400 mt-5 font-light leading-relaxed">
        今日も、あなたの物語が更新されます。
      </p>

      {/* CTA — gentle, not pushy */}
      <button
        onClick={onScrollToWrite}
        className="mt-10 inline-flex items-center gap-2 text-xs tracking-wide px-5 py-2.5 rounded-full border transition-all hover:bg-stone-50"
        style={{
          borderColor: "var(--gold, #B8A88A)",
          color: "var(--ink, #1A1A1A)",
        }}
      >
        今日の一行を書く
        <span className="text-stone-300">→</span>
      </button>
    </section>
  );
}
