"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Types ──
interface Declaration {
  id: string;
  content: string;
  created_at: string;
  pinned: boolean;
}

interface ReflectionEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  prompt: string | null;
}

// ── Constants ──
const MOOD_MAP: Record<string, { label: string; color: string }> = {
  calm: { label: "穏やか", color: "#06B6D4" },
  energized: { label: "エネルギッシュ", color: "#F97316" },
  thoughtful: { label: "思索的", color: "#8B5CF6" },
  grateful: { label: "感謝", color: "#22C55E" },
  struggling: { label: "もがいている", color: "#EF4444" },
};

const FALLBACK_PROMPT = "今日、心に残ったことは？";

export default function ResetSection() {
  // ── Declaration state ──
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [declLoading, setDeclLoading] = useState(true);

  // ── Reflection state ──
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [refLoading, setRefLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("thoughtful");
  const [saving, setSaving] = useState(false);

  // ── AI prompt state ──
  const [todayPrompt, setTodayPrompt] = useState(FALLBACK_PROMPT);
  const [promptSource, setPromptSource] = useState<"ai" | "fallback">(
    "fallback"
  );

  // ── Data fetching ──
  const fetchDeclarations = useCallback(async () => {
    try {
      const res = await fetch("/api/declarations");
      if (res.ok) {
        const data = await res.json();
        setDeclarations(data.declarations || []);
      }
    } catch {
      // keep empty
    } finally {
      setDeclLoading(false);
    }
  }, []);

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
      setRefLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeclarations();
    fetchReflections();
  }, [fetchDeclarations, fetchReflections]);

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

  // ── Handlers ──
  const handleSaveReflection = async () => {
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
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReflection = async (id: string) => {
    try {
      const res = await fetch(`/api/reflections?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReflections((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      // ignore
    }
  };

  const handleUnpin = async (id: string) => {
    try {
      const res = await fetch("/api/declarations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pinned: false }),
      });
      if (res.ok) {
        await fetchDeclarations();
      }
    } catch {
      // ignore
    }
  };

  const pinned = declarations.find((d) => d.pinned);
  const loading = declLoading || refLoading;

  return (
    <section>
      {/* Section Header */}
      <div className="mb-8">
        <p
          className="text-[10px] tracking-[0.35em] uppercase mb-3"
          style={{ color: "var(--gold, #B8A88A)" }}
        >
          Reset
        </p>
        <h2
          className="text-xl md:text-2xl font-light"
          style={{ color: "var(--ink, #1A1A1A)" }}
        >
          整える
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          宣言を確認し、問いに向き合い、今の自分を見つめる。
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1B6B7A] rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && (
        <>
          {/* ── Pinned Declaration ── */}
          {pinned && (
            <div className="relative mb-8 group/pin">
              <div
                className="rounded-2xl p-8 md:p-10"
                style={{ backgroundColor: "var(--navy, #1C2D3F)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="text-[10px] tracking-[0.3em]"
                    style={{ color: "var(--gold, #B8A88A)" }}
                  >
                    MY DECLARATION
                  </p>
                  <button
                    onClick={() => handleUnpin(pinned.id)}
                    className="text-[10px] text-stone-500 hover:text-stone-300 transition-colors opacity-0 group-hover/pin:opacity-100"
                  >
                    ピン解除
                  </button>
                </div>
                <blockquote className="text-lg md:text-xl text-white font-light leading-relaxed">
                  {pinned.content}
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="w-px h-3"
                    style={{ backgroundColor: "var(--gold, #B8A88A)" }}
                  />
                  <time className="text-[10px] text-stone-500">
                    {new Date(pinned.created_at).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </div>
          )}

          {!pinned && declarations.length === 0 && (
            <div className="mb-8 p-6 rounded-xl border border-dashed border-stone-200 text-center">
              <p className="text-sm text-stone-400 font-light">
                まだ宣言がありません
              </p>
              <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-xs text-[#1B6B7A] mt-2 inline-block"
              >
                宣言を書く →
              </Link>
            </div>
          )}

          {/* ── Today's Question ── */}
          <div
            className="rounded-xl p-6 mb-8 cursor-pointer hover:bg-stone-100/80 transition-colors"
            style={{
              backgroundColor: "rgba(184, 168, 138, 0.08)",
            }}
            onClick={() => setShowInput(!showInput)}
          >
            <div className="flex items-center gap-2 mb-3">
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
              className="text-base font-light italic"
              style={{ color: "var(--ink, #1A1A1A)" }}
            >
              &ldquo;{todayPrompt}&rdquo;
            </p>
            {!showInput && (
              <p className="text-xs text-stone-400 mt-3">
                タップして書き始める
              </p>
            )}
          </div>

          {/* ── Reflection Input ── */}
          {showInput && (
            <div className="mb-8 animate-fadeIn">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="今日の気づきを書いてみる..."
                className="w-full bg-white border border-stone-200 rounded-xl p-5 text-sm placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none leading-relaxed"
                style={{ color: "var(--ink, #1A1A1A)" }}
                rows={4}
                autoFocus
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
                        borderColor:
                          selectedMood === key ? color : `${color}30`,
                        backgroundColor:
                          selectedMood === key ? color : "transparent",
                      }}
                      title={label}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSaveReflection}
                  className="text-xs px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-40"
                  style={{ backgroundColor: "var(--navy, #1C2D3F)" }}
                  disabled={!inputText.trim() || saving}
                >
                  {saving ? "保存中..." : "記録する"}
                </button>
              </div>
            </div>
          )}

          {/* ── Recent Reflections ── */}
          {reflections.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-2">
                RECENT REFLECTIONS
              </p>
              {reflections.map((r) => {
                const mood = MOOD_MAP[r.mood];
                const d = new Date(r.date + "T00:00:00");
                return (
                  <div key={r.id} className="group">
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50/60 transition-colors">
                      <div className="pt-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: mood?.color || "#9CA3AF",
                          }}
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
                            onClick={() => handleDeleteReflection(r.id)}
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
          )}

          {/* ── Manage Declarations Link ── */}
          {declarations.length > 0 && (
            <div className="mt-6 text-center">
              <Link
                href="/mypage#section-declarations"
                className="text-[10px] tracking-[0.15em] text-stone-400 hover:text-[#1B6B7A] transition-colors"
              >
                宣言を管理する →
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
