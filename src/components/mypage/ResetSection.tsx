"use client";

import { useState, useEffect, useCallback } from "react";

interface Declaration {
  id: string;
  content: string;
  created_at: string;
  pinned: boolean;
}

const FALLBACK_QUOTE = "焦らなくていい。深く進めば、遠くへ届く。";

export default function ResetSection() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<string>(FALLBACK_QUOTE);
  const [aiSource, setAiSource] = useState<"ai" | "fallback">("fallback");

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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeclarations();
  }, [fetchDeclarations]);

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

      {/* Past Declaration */}
      {!loading && (pinned || recentDeclarations.length > 0) && (
        <div className="space-y-4">
          <p className="text-[10px] tracking-[0.2em] text-stone-400">
            あなたの言葉
          </p>

          {pinned && (
            <div className="pl-4 border-l-2" style={{ borderColor: "var(--gold, #B8A88A)" }}>
              <p
                className="text-sm font-light leading-relaxed"
                style={{ color: "var(--ink, #1A1A1A)" }}
              >
                {pinned.content}
              </p>
              <time className="text-[10px] text-stone-300 mt-2 block">
                {new Date(pinned.created_at).toLocaleDateString("ja-JP", {
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          )}

          {recentDeclarations.map((d) => (
            <div
              key={d.id}
              className="pl-4 border-l border-stone-200"
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
        </div>
      )}
    </section>
  );
}
