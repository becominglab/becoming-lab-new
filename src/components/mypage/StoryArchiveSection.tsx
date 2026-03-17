"use client";

import { useState, useEffect, useCallback } from "react";

// ── Types ──
interface StoryEntry {
  id: string;
  date: string;
  chapter: string;
  content: string;
  entry_type: "milestone" | "turning_point" | "everyday" | "insight";
}

// ── Constants ──
const TYPE_STYLES: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  milestone: { label: "節目", color: "#1B6B7A", bg: "#1B6B7A10" },
  turning_point: { label: "転機", color: "#D97706", bg: "#D9770610" },
  everyday: { label: "日常", color: "#6B7280", bg: "#6B728010" },
  insight: { label: "気づき", color: "#8B5CF6", bg: "#8B5CF610" },
};

export default function StoryArchiveSection() {
  const [stories, setStories] = useState<StoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );

  const fetchStories = useCallback(async () => {
    try {
      const res = await fetch("/api/stories");
      if (res.ok) {
        const data = await res.json();
        const storiesData = data.stories || [];
        setStories(storiesData);
        // Auto-expand the first chapter
        if (storiesData.length > 0) {
          setExpandedChapters(new Set([storiesData[0].chapter]));
        }
      }
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/stories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStories((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      // ignore
    }
  };

  const toggleChapter = (chapter: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapter)) {
        next.delete(chapter);
      } else {
        next.add(chapter);
      }
      return next;
    });
  };

  // Group by chapter
  const chapters = stories.reduce(
    (acc, s) => {
      if (!acc[s.chapter]) acc[s.chapter] = [];
      acc[s.chapter].push(s);
      return acc;
    },
    {} as Record<string, StoryEntry[]>
  );

  const chapterNames = Object.keys(chapters);

  return (
    <section>
      {/* Section Header */}
      <div className="mb-8">
        <p
          className="text-[10px] tracking-[0.35em] uppercase mb-3"
          style={{ color: "var(--gold, #B8A88A)" }}
        >
          Story Archive
        </p>
        <h2
          className="text-xl md:text-2xl font-light"
          style={{ color: "var(--ink, #1A1A1A)" }}
        >
          あなたの物語
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          あなたの人生は、あなたが紡ぐ一編の物語。
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1B6B7A] rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && stories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-stone-400 font-light">
            まだ物語がありません。
          </p>
          <p className="text-xs text-stone-300 mt-2">
            「紡ぐ」セクションから、最初の1ページを書き始めましょう。
          </p>
        </div>
      )}

      {!loading && stories.length > 0 && (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-stone-200" />

          <div className="space-y-6">
            {chapterNames.map((chapter) => {
              const entries = chapters[chapter];
              const isExpanded = expandedChapters.has(chapter);

              return (
                <div key={chapter}>
                  {/* Chapter Title */}
                  <button
                    onClick={() => toggleChapter(chapter)}
                    className="flex items-center gap-4 mb-3 relative w-full text-left group"
                  >
                    <div
                      className="w-[15px] h-[15px] rounded-full bg-white border-2 z-10 shrink-0 transition-colors"
                      style={{
                        borderColor: isExpanded
                          ? "var(--gold, #B8A88A)"
                          : "#D6D3D1",
                      }}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <h3
                        className="text-sm font-medium tracking-wide"
                        style={{ color: "var(--ink, #1A1A1A)" }}
                      >
                        {chapter}
                      </h3>
                      <span className="text-[10px] text-stone-400">
                        {entries.length} ページ
                      </span>
                      <span className="text-[10px] text-stone-300 ml-auto">
                        {isExpanded ? "▼" : "▶"}
                      </span>
                    </div>
                  </button>

                  {/* Entries */}
                  {isExpanded && (
                    <div className="space-y-2 ml-[7px] pl-6 border-l border-transparent animate-fadeIn">
                      {entries.map((entry) => {
                        const style = TYPE_STYLES[entry.entry_type];
                        const d = new Date(entry.date + "T00:00:00");
                        return (
                          <div key={entry.id} className="relative group">
                            <div className="absolute -left-[24.5px] top-3 w-[7px] h-[7px] rounded-full bg-stone-300 group-hover:bg-[#1B6B7A] transition-colors" />

                            <div className="p-4 rounded-xl hover:bg-stone-50/60 transition-colors">
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
                                    color: style?.color,
                                    backgroundColor: style?.bg,
                                  }}
                                >
                                  {style?.label}
                                </span>
                                <button
                                  onClick={() => handleDelete(entry.id)}
                                  className="text-[10px] text-stone-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-auto"
                                >
                                  削除
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed font-light">
                                {entry.content}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
