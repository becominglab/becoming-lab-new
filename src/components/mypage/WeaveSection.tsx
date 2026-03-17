"use client";

import { useState, useEffect, useCallback } from "react";

interface Declaration {
  id: string;
  content: string;
  created_at: string;
  pinned: boolean;
}

interface StoryEntry {
  id: string;
  chapter: string;
}

export default function WeaveSection() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [stories, setStories] = useState<StoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeclInput, setShowDeclInput] = useState(false);
  const [declText, setDeclText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [declRes, storyRes] = await Promise.all([
        fetch("/api/declarations"),
        fetch("/api/stories"),
      ]);
      if (declRes.ok) {
        const d = await declRes.json();
        setDeclarations(d.declarations || []);
      }
      if (storyRes.ok) {
        const s = await storyRes.json();
        setStories(s.stories || []);
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
        // Auto-pin the new declaration
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

  const pinned = declarations.find((d) => d.pinned);

  // Current chapter = most recent chapter from stories
  const currentChapter = stories.length > 0 ? stories[0].chapter : null;

  return (
    <section>
      {/* Section Label */}
      <p
        className="text-[10px] tracking-[0.35em] uppercase mb-8"
        style={{ color: "var(--gold, #B8A88A)" }}
      >
        紡ぐ
      </p>

      {/* Declaration Block — the emotional peak */}
      <div
        className="rounded-2xl p-10 md:p-12 text-center relative"
        style={{ backgroundColor: "var(--navy, #1C2D3F)" }}
      >
        <p
          className="text-[10px] tracking-[0.3em] uppercase mb-6"
          style={{ color: "var(--gold, #B8A88A)" }}
        >
          My Declaration
        </p>

        {loading ? (
          <div className="py-8">
            <div className="w-5 h-5 border-2 border-stone-600 border-t-stone-400 rounded-full animate-spin mx-auto" />
          </div>
        ) : pinned ? (
          <>
            <blockquote
              className="text-xl md:text-2xl text-white font-light leading-relaxed"
            >
              私は今、「{pinned.content}」
            </blockquote>

            {currentChapter && (
              <p className="text-[11px] text-stone-500 mt-6">
                {currentChapter}
              </p>
            )}

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setShowDeclInput(true)}
                className="text-[10px] tracking-wide px-4 py-2 rounded-full border border-stone-600 text-stone-400 hover:text-stone-300 hover:border-stone-500 transition-colors"
              >
                宣言を更新する
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-base text-stone-400 font-light mb-6">
              まだ宣言がありません。
            </p>
            <p className="text-sm text-stone-500 font-light mb-8">
              自分への宣言を書いて、意志を形にしましょう。
            </p>
            <button
              onClick={() => setShowDeclInput(true)}
              className="text-[10px] tracking-wide px-4 py-2 rounded-full border border-stone-600 text-stone-400 hover:text-stone-300 hover:border-stone-500 transition-colors"
            >
              最初の宣言を書く
            </button>
          </>
        )}
      </div>

      {/* Declaration Input */}
      {showDeclInput && (
        <div className="mt-6 animate-fadeIn">
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
    </section>
  );
}
