"use client";

import { useState, useEffect, useCallback } from "react";

interface ReflectionEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  prompt: string | null;
}

const MOOD_MAP: Record<string, { label: string; color: string }> = {
  calm: { label: "穏やか", color: "#06B6D4" },
  energized: { label: "エネルギッシュ", color: "#F97316" },
  thoughtful: { label: "思索的", color: "#8B5CF6" },
  grateful: { label: "感謝", color: "#22C55E" },
  struggling: { label: "もがいている", color: "#EF4444" },
};

const FALLBACK_PROMPT = "今日、心に残ったことは？";

export default function FaceSection() {
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("thoughtful");
  const [saving, setSaving] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);
  const [todayPrompt, setTodayPrompt] = useState(FALLBACK_PROMPT);
  const [promptSource, setPromptSource] = useState<"ai" | "fallback">("fallback");

  const fetchReflections = useCallback(async () => {
    try {
      const res = await fetch("/api/reflections?limit=5");
      if (res.ok) {
        const data = await res.json();
        setReflections(data.reflections || []);
      }
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReflections();
  }, [fetchReflections]);

  useEffect(() => {
    fetch("/api/ai/daily")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.prompt) {
          setTodayPrompt(d.prompt);
          setPromptSource(d.source || "fallback");
        }
      })
      .catch(() => {});
  }, []);

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
        setInputText("");
        setShowExpanded(false);
        setSelectedMood("thoughtful");
        await fetchReflections();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/reflections?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReflections((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {}
  };

  return (
    <section id="face-journal">
      {/* Section Label */}
      <p
        className="text-[10px] tracking-[0.35em] uppercase mb-8"
        style={{ color: "var(--gold, #B8A88A)" }}
      >
        向き合う
      </p>

      {/* Today's Question — the center of this section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <p
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            Today&apos;s Question
          </p>
          {promptSource === "ai" && (
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#1B6B7A]/10 text-[#1B6B7A]">
              AI
            </span>
          )}
        </div>
        <p
          className="text-xl md:text-2xl font-light italic leading-relaxed"
          style={{ color: "var(--ink, #1A1A1A)" }}
        >
          {todayPrompt}
        </p>
      </div>

      {/* One-line journal input */}
      <div className="mb-6">
        <div
          className="relative cursor-text"
          onClick={() => setShowExpanded(true)}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (!showExpanded) setShowExpanded(true);
            }}
            onFocus={() => setShowExpanded(true)}
            placeholder="ここに、今日の一行を..."
            className="w-full bg-transparent border-b pb-3 text-sm font-light placeholder:text-stone-300 focus:outline-none transition-colors"
            style={{
              borderColor: showExpanded
                ? "var(--gold, #B8A88A)"
                : "#E7E5E4",
              color: "var(--ink, #1A1A1A)",
            }}
          />
        </div>

        {/* Helper text */}
        {!showExpanded && (
          <p className="text-[11px] text-stone-300 mt-3 font-light">
            まだ言葉にならなくても大丈夫です。
          </p>
        )}

        {/* Expanded input area */}
        {showExpanded && (
          <div className="mt-4 animate-fadeIn">
            {/* Mood selector */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
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
                      borderColor: selectedMood === key ? color : `${color}30`,
                      backgroundColor: selectedMood === key ? color : "transparent",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowExpanded(false);
                    setInputText("");
                  }}
                  className="text-[10px] text-stone-400 hover:text-stone-600 transition-colors"
                >
                  閉じる
                </button>
                <button
                  onClick={handleSave}
                  className="text-xs px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-40"
                  style={{ backgroundColor: "var(--navy, #1C2D3F)" }}
                  disabled={!inputText.trim() || saving}
                >
                  {saving ? "..." : "記録する"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent reflections — quiet, below the fold */}
      {!loading && reflections.length > 0 && (
        <div className="mt-10 space-y-3">
          <p className="text-[10px] tracking-[0.2em] text-stone-300 mb-2">
            RECENT
          </p>
          {reflections.slice(0, 3).map((r) => {
            const mood = MOOD_MAP[r.mood];
            const d = new Date(r.date + "T00:00:00");
            return (
              <div key={r.id} className="group flex items-start gap-3">
                <div className="pt-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: mood?.color || "#9CA3AF" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <time className="text-[10px] text-stone-300">
                      {d.toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                    </time>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{ color: mood?.color, backgroundColor: `${mood?.color}10` }}
                    >
                      {mood?.label}
                    </span>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-[10px] text-stone-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-auto"
                    >
                      削除
                    </button>
                  </div>
                  <p className="text-sm text-stone-500 leading-relaxed font-light">
                    {r.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
