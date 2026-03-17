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

export default function ReflectionSection() {
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("thoughtful");
  const [saving, setSaving] = useState(false);
  const [todayPrompt, setTodayPrompt] = useState(FALLBACK_PROMPT);
  const [promptSource, setPromptSource] = useState<"ai" | "fallback">("fallback");

  const fetchReflections = useCallback(async () => {
    try {
      const res = await fetch("/api/reflections?limit=10");
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
      .catch(() => {
        /* keep fallback */
      });
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
        setShowInput(false);
        setSelectedMood("thoughtful");
        await fetchReflections();
      }
    } catch {
      // show nothing for now
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
    } catch {
      // ignore
    }
  };

  return (
    <section>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-3">
          REFLECTION
        </p>
        <h2 className="text-xl md:text-2xl font-light text-gray-900">
          内省の記録
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          立ち止まる時間が、次の一歩を照らす。
        </p>
      </div>

      {/* Today's Prompt */}
      <div
        className="bg-stone-50/80 rounded-xl p-6 mb-8 cursor-pointer hover:bg-stone-100/80 transition-colors"
        onClick={() => setShowInput(!showInput)}
      >
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[10px] tracking-[0.2em] text-stone-400">
            TODAY&apos;S PROMPT
          </p>
          {promptSource === "ai" && (
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#1B6B7A]/10 text-[#1B6B7A]">
              AI
            </span>
          )}
        </div>
        <p className="text-base text-gray-700 font-light italic">
          &ldquo;{todayPrompt}&rdquo;
        </p>
        {!showInput && (
          <p className="text-xs text-stone-400 mt-3">
            タップして書き始める
          </p>
        )}
      </div>

      {/* Input Area */}
      {showInput && (
        <div className="mb-8 animate-fadeIn">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="今日の気づきを書いてみる..."
            className="w-full bg-white border border-stone-200 rounded-xl p-5 text-sm text-gray-700 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none leading-relaxed"
            rows={4}
          />
          <div className="flex items-center justify-between mt-3">
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
                  title={label}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={handleSave}
              className="text-xs px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
              disabled={!inputText.trim() || saving}
            >
              {saving ? "保存中..." : "記録する"}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1B6B7A] rounded-full animate-spin mx-auto" />
        </div>
      )}

      {/* Empty State */}
      {!loading && reflections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-stone-400 font-light">
            まだ内省の記録がありません。
          </p>
          <p className="text-xs text-stone-300 mt-2">
            上のプロンプトをタップして、最初の記録を書いてみましょう。
          </p>
        </div>
      )}

      {/* Past Reflections */}
      <div className="space-y-4">
        {reflections.map((r) => {
          const mood = MOOD_MAP[r.mood];
          const d = new Date(r.date + "T00:00:00");
          return (
            <div key={r.id} className="group">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50/60 transition-colors">
                <div className="pt-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: mood?.color || "#9CA3AF" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <time className="text-[10px] text-stone-400">
                      {d.toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        color: mood?.color,
                        backgroundColor: `${mood?.color}10`,
                      }}
                    >
                      {mood?.label}
                    </span>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-[10px] text-stone-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-auto"
                    >
                      削除
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">
                    {r.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
