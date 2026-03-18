"use client";

import { useEffect, useState, useCallback } from "react";

// ── Types ──
interface Declaration {
  id: string;
  content: string;
  created_at: string;
  pinned: boolean;
}

// ── Post-write feedback messages ──
const FEEDBACK_MESSAGES = [
  "いい一行です。",
  "そのままでいいです。",
  "少し見えてきましたね。",
  "その言葉、残しておく価値があります。",
  "静かに、前へ。",
  "今日もあなたの物語が動きました。",
  "書くことで、見えてくるものがある。",
  "自分の言葉で語れている。それだけで十分です。",
];

// ── Mood config ──
const MOOD_MAP: Record<string, { label: string; color: string }> = {
  calm: { label: "穏やか", color: "#06B6D4" },
  energized: { label: "エネルギッシュ", color: "#F97316" },
  thoughtful: { label: "思索的", color: "#8B5CF6" },
  grateful: { label: "感謝", color: "#22C55E" },
  struggling: { label: "もがいている", color: "#EF4444" },
};

// ── Helpers ──
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

// ── Props ──
interface HeroMorningSectionProps {
  userName?: string | null;
}

export default function HeroMorningSection({
  userName,
}: HeroMorningSectionProps) {
  const [now, setNow] = useState<Date>(new Date());

  // Question & Input state
  const [todayPrompt, setTodayPrompt] = useState("今日、心に残ったことは？");
  const [inputText, setInputText] = useState("");
  const [selectedMood, setSelectedMood] = useState("thoughtful");
  const [saving, setSaving] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  // Post-write feedback
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Declaration state
  const [pinnedDecl, setPinnedDecl] = useState<Declaration | null>(null);
  const [declLoading, setDeclLoading] = useState(true);

  useEffect(() => {
    setNow(new Date());
  }, []);

  // Fetch AI daily question
  useEffect(() => {
    fetch("/api/ai/daily")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.prompt) setTodayPrompt(d.prompt);
      })
      .catch(() => {});
  }, []);

  // Fetch pinned declaration
  const fetchDeclaration = useCallback(async () => {
    try {
      const res = await fetch("/api/declarations");
      if (res.ok) {
        const data = await res.json();
        const decls: Declaration[] = data.declarations || [];
        const pinned = decls.find((d) => d.pinned);
        setPinnedDecl(pinned || null);
      }
    } catch {
      // keep null
    } finally {
      setDeclLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeclaration();
  }, [fetchDeclaration]);

  // Handle save reflection
  const handleSave = async () => {
    if (!inputText.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: inputText.trim(),
          mood: selectedMood,
          prompt: todayPrompt,
        }),
      });
      if (res.ok) {
        // Show feedback
        const msg =
          FEEDBACK_MESSAGES[Math.floor(Math.random() * FEEDBACK_MESSAGES.length)];
        setFeedback(msg);
        setShowFeedback(true);
        setInputText("");
        setShowMoodSelector(false);
        setSelectedMood("thoughtful");

        // Auto-hide feedback after 4s
        setTimeout(() => {
          setShowFeedback(false);
        }, 4000);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && inputText.trim()) {
      e.preventDefault();
      handleSave();
    }
  };

  const greeting = getGreeting();
  const dateStr = formatJapaneseDate(now);

  return (
    <section className="relative pt-4 pb-4">
      {/* ── Row 1: Date ── */}
      <time
        className="block text-[11px] tracking-[0.3em] mb-6"
        style={{ color: "var(--gold, #B8A88A)" }}
      >
        {dateStr}
      </time>

      {/* ── Row 2: Greeting + Copy ── */}
      <h1
        className="text-2xl md:text-3xl font-light leading-snug tracking-tight mb-2"
        style={{ color: "var(--ink, #1A1A1A)" }}
      >
        {greeting}
        {userName && (
          <span className="text-stone-400">、{userName}さん</span>
        )}
      </h1>
      <p className="text-[13px] text-stone-400 font-light leading-relaxed mb-8">
        今日も、あなたの物語が更新されます。
      </p>

      {/* ── Row 3: Today's Question ── */}
      <div className="mb-6">
        <p
          className="text-[10px] tracking-[0.25em] uppercase mb-3"
          style={{ color: "var(--gold, #B8A88A)" }}
        >
          Today&apos;s Question
        </p>
        <p
          className="text-lg md:text-xl font-light italic leading-relaxed"
          style={{ color: "var(--ink, #1A1A1A)" }}
        >
          {todayPrompt}
        </p>
      </div>

      {/* ── Row 4: One-line Input ── */}
      <div className="mb-6">
        {/* Feedback overlay (appears after save) */}
        {showFeedback && feedback && (
          <div className="mb-4 animate-fadeIn">
            <div
              className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
              style={{ backgroundColor: "rgba(184, 168, 138, 0.08)" }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: "var(--gold, #B8A88A)" }}
              />
              <p
                className="text-sm font-light italic"
                style={{ color: "var(--ink, #1A1A1A)" }}
              >
                {feedback}
              </p>
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (!showMoodSelector && e.target.value.length > 0) {
                setShowMoodSelector(true);
              }
            }}
            onFocus={() => {
              if (inputText.length > 0) setShowMoodSelector(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="ここに、今日の一行を..."
            className="w-full bg-transparent border-b pb-3 text-sm font-light placeholder:text-stone-300 focus:outline-none transition-colors"
            style={{
              borderColor: showMoodSelector
                ? "var(--gold, #B8A88A)"
                : "#E7E5E4",
              color: "var(--ink, #1A1A1A)",
            }}
          />
        </div>

        {/* Helper text */}
        {!showMoodSelector && !showFeedback && (
          <p className="text-[11px] text-stone-300 mt-2.5 font-light">
            まだ言葉にならなくても大丈夫です。Enterで記録。
          </p>
        )}

        {/* Expanded: mood selector + save */}
        {showMoodSelector && (
          <div className="mt-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {Object.entries(MOOD_MAP).map(([key, { label, color }]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMood(key)}
                    className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                      selectedMood === key
                        ? "text-white"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                    style={{
                      borderColor:
                        selectedMood === key ? color : `${color}30`,
                      backgroundColor:
                        selectedMood === key ? color : "transparent",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowMoodSelector(false);
                    setInputText("");
                  }}
                  className="text-[10px] text-stone-300 hover:text-stone-500 transition-colors"
                >
                  閉じる
                </button>
                <button
                  onClick={handleSave}
                  className="text-[10px] px-4 py-1.5 text-white rounded-lg transition-colors disabled:opacity-40"
                  style={{ backgroundColor: "var(--navy, #1C2D3F)" }}
                  disabled={!inputText.trim() || saving}
                >
                  {saving ? "..." : "記録"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Row 5: Pinned Declaration ── */}
      {!declLoading && pinnedDecl && (
        <div
          className="rounded-xl px-6 py-5 mt-2"
          style={{ backgroundColor: "var(--navy, #1C2D3F)" }}
        >
          <p
            className="text-[9px] tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            My Declaration
          </p>
          <p className="text-base text-white/90 font-light leading-relaxed">
            「{pinnedDecl.content}」
          </p>
        </div>
      )}

      {/* Default declaration (affirmation) */}
      {!declLoading && !pinnedDecl && (
        <div
          className="rounded-xl px-6 py-5 mt-2"
          style={{ backgroundColor: "var(--navy, #1C2D3F)" }}
        >
          <p
            className="text-[9px] tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            Affirmation
          </p>
          <p className="text-base text-white/90 font-light leading-relaxed">
            私は、更新を重ねる人生を生きる。
          </p>
        </div>
      )}
    </section>
  );
}
