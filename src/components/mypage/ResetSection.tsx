"use client";

import { useState, useEffect, useCallback } from "react";

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
}

const MOOD_MAP: Record<string, { label: string; color: string }> = {
  calm: { label: "穏やか", color: "#06B6D4" },
  energized: { label: "エネルギッシュ", color: "#F97316" },
  thoughtful: { label: "思索的", color: "#8B5CF6" },
  grateful: { label: "感謝", color: "#22C55E" },
  struggling: { label: "もがいている", color: "#EF4444" },
};

const FALLBACK_QUOTE = "焦らなくていい。深く進めば、遠くへ届く。";

export default function ResetSection() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<string>(FALLBACK_QUOTE);
  const [aiSource, setAiSource] = useState<"ai" | "fallback">("fallback");

  // Declaration input
  const [showDeclInput, setShowDeclInput] = useState(false);
  const [declText, setDeclText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [declRes, reflRes] = await Promise.all([
        fetch("/api/declarations"),
        fetch("/api/reflections?limit=5"),
      ]);
      if (declRes.ok) {
        const data = await declRes.json();
        setDeclarations(data.declarations || []);
      }
      if (reflRes.ok) {
        const data = await reflRes.json();
        setReflections(data.reflections || []);
      }
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetch("/api/ai/daily")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.quote) {
          setQuote(d.quote);
          setAiSource(d.source || "fallback");
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveDeclaration = async () => {
    if (!declText.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/declarations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: declText.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.declaration?.id) {
          await fetch("/api/declarations", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: data.declaration.id, pinned: true }),
          });
        }
        setDeclText("");
        setShowDeclInput(false);
        await fetchData();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReflection = async (id: string) => {
    try {
      const res = await fetch(`/api/reflections?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReflections((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {}
  };

  const pinned = declarations.find((d) => d.pinned);
  const recentDeclarations = declarations.filter((d) => !d.pinned).slice(0, 2);

  return (
    <section>
      {/* Section Label */}
      <p
        className="text-[10px] tracking-[0.35em] uppercase mb-8"
        style={{ color: "var(--gold, #B8A88A)" }}
      >
        整える
      </p>

      {/* Today's Word — the calm anchor */}
      <div
        className="rounded-2xl p-8 md:p-10 mb-8"
        style={{ backgroundColor: "rgba(184, 168, 138, 0.06)" }}
      >
        <div className="flex items-center gap-2 mb-4">
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
        <p
          className="text-lg md:text-xl font-light italic leading-relaxed"
          style={{ color: "var(--ink, #1A1A1A)" }}
        >
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {/* Declaration Management */}
      {!loading && (
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-4">
            あなたの宣言
          </p>

          {pinned && (
            <div className="pl-4 border-l-2 mb-4" style={{ borderColor: "var(--gold, #B8A88A)" }}>
              <p
                className="text-sm font-light leading-relaxed"
                style={{ color: "var(--ink, #1A1A1A)" }}
              >
                {pinned.content}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <time className="text-[10px] text-stone-300">
                  {new Date(pinned.created_at).toLocaleDateString("ja-JP", {
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#B8A88A]/10 text-[#B8A88A]">
                  ピン留め中
                </span>
              </div>
            </div>
          )}

          {recentDeclarations.map((d) => (
            <div
              key={d.id}
              className="pl-4 border-l border-stone-200 mb-3"
            >
              <p className="text-sm text-stone-500 font-light leading-relaxed">
                {d.content}
              </p>
              <time className="text-[10px] text-stone-300 mt-1 block">
                {new Date(d.created_at).toLocaleDateString("ja-JP", {
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          ))}

          {/* Add/Update declaration */}
          {!showDeclInput ? (
            <button
              onClick={() => setShowDeclInput(true)}
              className="text-[10px] tracking-wide px-4 py-2 rounded-full border transition-colors hover:bg-stone-50 mt-2"
              style={{
                borderColor: "var(--gold, #B8A88A)",
                color: "var(--ink, #1A1A1A)",
              }}
            >
              {pinned ? "宣言を更新する" : "最初の宣言を書く"}
            </button>
          ) : (
            <div className="mt-4 animate-fadeIn">
              <textarea
                value={declText}
                onChange={(e) => setDeclText(e.target.value)}
                placeholder="自分に宣言する..."
                className="w-full bg-white border border-stone-200 rounded-xl p-5 text-sm placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none leading-relaxed"
                style={{ color: "var(--ink, #1A1A1A)" }}
                rows={2}
                autoFocus
              />
              <div className="flex items-center justify-end gap-3 mt-3">
                <button
                  onClick={() => {
                    setShowDeclInput(false);
                    setDeclText("");
                  }}
                  className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSaveDeclaration}
                  className="text-xs px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-40"
                  style={{ backgroundColor: "var(--navy, #1C2D3F)" }}
                  disabled={!declText.trim() || saving}
                >
                  {saving ? "保存中..." : "宣言する"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Reflections — your recent writings */}
      {!loading && reflections.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.2em] text-stone-300 mb-2">
            最近の内省
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
                      {d.toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{
                        color: mood?.color,
                        backgroundColor: `${mood?.color}10`,
                      }}
                    >
                      {mood?.label}
                    </span>
                    <button
                      onClick={() => handleDeleteReflection(r.id)}
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
