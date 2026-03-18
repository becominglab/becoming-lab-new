"use client";

import { useState, useEffect } from "react";

interface ReflectionEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
}

interface StoryEntry {
  id: string;
  date: string;
  content: string;
  entry_type: string;
  chapter: string;
}

const MOOD_LABELS: Record<string, string> = {
  calm: "穏やか",
  energized: "エネルギッシュ",
  thoughtful: "思索的",
  grateful: "感謝",
  struggling: "もがいている",
};

// Insight messages based on comparison
function generateInsight(
  pastEntry: { content: string; date: string; mood?: string },
  recentEntry: { content: string; date: string; mood?: string } | null
): string {
  if (!recentEntry) {
    return "あの日の自分が、今の自分を作っている。";
  }

  // Compare moods if available
  const pastMood = pastEntry.mood;
  const recentMood = recentEntry.mood;

  if (pastMood === "struggling" && recentMood && recentMood !== "struggling") {
    return "あの日もがいていた自分が、今ここにいる。それだけで前に進んでいる。";
  }
  if (pastMood && recentMood === "struggling") {
    return "今は苦しい時期かもしれない。でも、これも物語の一部になる。";
  }
  if (recentMood === "grateful") {
    return "感謝できている今の自分に気づけている。それ自体が成長の証。";
  }

  // Default insights
  const defaults = [
    "言葉が変わっている。それは、あなたが変わっている証拠です。",
    "あの日の問いが、今日の答えにつながっている。",
    "数日前の自分と今の自分。同じようで、少し違う。",
    "書き続けることで、見えてくる景色がある。",
    "過去の言葉は、未来の自分への手紙だった。",
  ];
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return defaults[dayOfYear % defaults.length];
}

function daysAgo(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  return Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

export default function InsightSection() {
  const [pastEntry, setPastEntry] = useState<{
    content: string;
    date: string;
    mood?: string;
    source: "reflection" | "story";
  } | null>(null);
  const [recentEntry, setRecentEntry] = useState<{
    content: string;
    date: string;
    mood?: string;
    source: "reflection" | "story";
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightMessage, setInsightMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [reflRes, storyRes] = await Promise.all([
          fetch("/api/reflections?limit=30"),
          fetch("/api/stories"),
        ]);

        let allEntries: {
          content: string;
          date: string;
          mood?: string;
          source: "reflection" | "story";
        }[] = [];

        if (reflRes.ok) {
          const reflData = await reflRes.json();
          const reflections: ReflectionEntry[] = reflData.reflections || [];
          allEntries = allEntries.concat(
            reflections.map((r) => ({
              content: r.content,
              date: r.date,
              mood: r.mood,
              source: "reflection" as const,
            }))
          );
        }

        if (storyRes.ok) {
          const storyData = await storyRes.json();
          const stories: StoryEntry[] = storyData.stories || [];
          allEntries = allEntries.concat(
            stories.map((s) => ({
              content: s.content,
              date: s.date,
              source: "story" as const,
            }))
          );
        }

        // Sort by date ascending
        allEntries.sort((a, b) => a.date.localeCompare(b.date));

        // Find entries 3+ days ago
        const pastEntries = allEntries.filter((e) => daysAgo(e.date) >= 3);
        // Find entries from last 2 days (today + yesterday)
        const recentEntries = allEntries.filter((e) => daysAgo(e.date) <= 1);

        if (pastEntries.length > 0) {
          // Pick a random past entry (weighted towards more recent past entries)
          const past = pastEntries[Math.floor(Math.random() * Math.min(3, pastEntries.length))];
          setPastEntry(past);

          const recent = recentEntries.length > 0 ? recentEntries[recentEntries.length - 1] : null;
          setRecentEntry(recent);

          setInsightMessage(generateInsight(past, recent));
        }
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Don't render if no past entries (user is new)
  if (loading || !pastEntry) return null;

  const pastDays = daysAgo(pastEntry.date);

  return (
    <section>
      <p
        className="text-[10px] tracking-[0.35em] uppercase mb-6"
        style={{ color: "var(--gold, #B8A88A)" }}
      >
        Insight
      </p>

      <div
        className="rounded-2xl p-8 md:p-10"
        style={{ backgroundColor: "rgba(184, 168, 138, 0.06)" }}
      >
        {/* Insight header */}
        <p
          className="text-sm font-light mb-6 italic"
          style={{ color: "var(--ink, #1A1A1A)" }}
        >
          {insightMessage}
        </p>

        {/* Past self card */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5 border-l-2"
            style={{
              borderColor: "var(--gold, #B8A88A)",
              backgroundColor: "rgba(255,255,255,0.6)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-stone-400">
                {formatShortDate(pastEntry.date)}
              </span>
              <span className="text-[10px] text-stone-300">
                {pastDays}日前のあなた
              </span>
              {pastEntry.mood && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-400">
                  {MOOD_LABELS[pastEntry.mood] || pastEntry.mood}
                </span>
              )}
            </div>
            <p
              className="text-sm font-light leading-relaxed"
              style={{ color: "var(--ink, #1A1A1A)" }}
            >
              「{pastEntry.content}」
            </p>
          </div>

          {/* Recent self card (if exists) */}
          {recentEntry && (
            <>
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-px h-4 bg-stone-200" />
                  <span className="text-[9px] text-stone-300 tracking-wider">
                    ↓
                  </span>
                  <div className="w-px h-4 bg-stone-200" />
                </div>
              </div>

              <div
                className="rounded-xl p-5 border-l-2"
                style={{
                  borderColor: "var(--brand, #1B6B7A)",
                  backgroundColor: "rgba(255,255,255,0.6)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-stone-400">
                    {formatShortDate(recentEntry.date)}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--brand, #1B6B7A)" }}>
                    今のあなた
                  </span>
                  {recentEntry.mood && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-400">
                      {MOOD_LABELS[recentEntry.mood] || recentEntry.mood}
                    </span>
                  )}
                </div>
                <p
                  className="text-sm font-light leading-relaxed"
                  style={{ color: "var(--ink, #1A1A1A)" }}
                >
                  「{recentEntry.content}」
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
