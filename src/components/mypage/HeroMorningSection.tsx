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

const FALLBACK_QUOTE = "更新を重ねることが、生きるということ。";

interface HeroMorningSectionProps {
  userName?: string | null;
}

export default function HeroMorningSection({
  userName,
}: HeroMorningSectionProps) {
  const [now, setNow] = useState<Date>(new Date());
  const [quote, setQuote] = useState<string>(FALLBACK_QUOTE);
  const [aiSource, setAiSource] = useState<"ai" | "fallback">("fallback");

  useEffect(() => {
    setNow(new Date());

    fetch("/api/ai/daily")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.quote) {
          setQuote(d.quote);
          setAiSource(d.source || "fallback");
        }
      })
      .catch(() => {
        /* keep fallback */
      });
  }, []);

  const greeting = getGreeting();
  const dateStr = formatJapaneseDate(now);

  return (
    <section className="relative">
      {/* Date */}
      <time
        className="block text-xs tracking-widest mb-6"
        style={{ color: "var(--gold, #B8A88A)" }}
      >
        {dateStr}
      </time>

      {/* Greeting */}
      <h1 className="text-3xl md:text-4xl font-light leading-snug" style={{ color: "var(--ink, #1A1A1A)" }}>
        {greeting}
        {userName && (
          <span className="text-stone-400">、{userName}さん</span>
        )}
      </h1>

      <p className="text-sm text-stone-400 mt-4 font-light leading-relaxed">
        今日もあなたの物語が、一行ずつ更新されていく。
      </p>

      {/* Daily Quote */}
      <div className="mt-8 rounded-xl p-6 border-l-2" style={{ borderColor: "var(--gold, #B8A88A)", backgroundColor: "var(--bg-cream, #F7F6F3)" }}>
        <div className="flex items-center gap-2 mb-2">
          <p
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            Today&apos;s Word
          </p>
          {aiSource === "ai" && (
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#1B6B7A]/10 text-[#1B6B7A]">
              AI
            </span>
          )}
        </div>
        <p className="text-sm font-light italic leading-relaxed" style={{ color: "var(--ink, #1A1A1A)" }}>
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </section>
  );
}
