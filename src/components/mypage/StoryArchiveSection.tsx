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

const ENTRY_TYPES = [
  { value: "everyday", label: "日常" },
  { value: "insight", label: "気づき" },
  { value: "turning_point", label: "転機" },
  { value: "milestone", label: "節目" },
] as const;

function todayJP(): string {
  const d = new Date();
  return `${d.getMonth() + 1}月${d.getDate()}日（${"日月火水木金土"[d.getDay()]}）`;
}

export default function StoryArchiveSection() {
  const [stories, setStories] = useState<StoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );

  // ── Story Input State ──
  const [showInput, setShowInput] = useState(false);
  const [inputContent, setInputContent] = useState("");
  const [inputType, setInputType] = useState<string>("everyday");
  const [inputChapter, setInputChapter] = useState("");
  const [isNewChapter, setIsNewChapter] = useState(false);
  const [newChapterName, setNewChapterName] = useState("");
  const [suggestingTitle, setSuggestingTitle] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  // Get unique chapter names (ordered by most recent)
  const chapterNames = stories.reduce<string[]>((acc, s) => {
    if (!acc.includes(s.chapter)) acc.push(s.chapter);
    return acc;
  }, []);

  // Set default chapter when stories load
  useEffect(() => {
    if (chapterNames.length > 0 && !inputChapter) {
      setInputChapter(chapterNames[0]);
    }
  }, [chapterNames, inputChapter]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/stories?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) setStories((prev) => prev.filter((s) => s.id !== deleteId));
    } catch {}
    finally { setDeleteId(null); }
  };

  const handleSaveStory = async () => {
    if (!inputContent.trim() || saving) return;
    const chapter = isNewChapter ? newChapterName.trim() : inputChapter;
    if (!chapter) return;

    setSaving(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: inputContent.trim(),
          chapter,
          entry_type: inputType,
        }),
      });
      if (res.ok) {
        setInputContent("");
        setInputType("everyday");
        setIsNewChapter(false);
        setNewChapterName("");
        setShowInput(false);
        await fetchStories();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleSuggestChapterTitle = async () => {
    setSuggestingTitle(true);
    try {
      const res = await fetch("/api/ai/chapter-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recentContent: inputContent.trim() || undefined,
          existingChapters: chapterNames,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.title) {
          setNewChapterName(data.title);
        }
      }
    } catch {
      // ignore
    } finally {
      setSuggestingTitle(false);
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

  const chapterKeys = Object.keys(chapters);

  return (
    <section>
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.25)" }} onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl p-6 mx-6 max-w-sm w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-medium mb-2" style={{ color: "var(--ink, #1A1A1A)" }}>このページを削除しますか？</h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-6">元に戻すことはできません。<br />大切な記録は削除前にご確認ください。</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="text-xs px-4 py-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors">キャンセル</button>
              <button onClick={handleDeleteConfirm} className="text-xs px-4 py-2 rounded-lg text-white transition-colors" style={{ backgroundColor: "#DC2626" }}>削除する</button>
            </div>
          </div>
        </div>
      )}

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

      {/* ── Story Input Form ── */}
      {!showInput ? (
        <button onClick={() => setShowInput(true)} className="w-full mb-8 flex items-center gap-4 p-4 rounded-xl border transition-colors hover:bg-[#1B6B7A]/5 text-left" style={{ borderColor: "#1B6B7A", backgroundColor: "rgba(27,107,122,0.03)" }}>
          <span className="text-xl shrink-0">✍️</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: "#1B6B7A" }}>今日の1ページを書く</p>
            <p className="text-[10px] mt-0.5" style={{ color: "#4a9a7a" }}>{todayJP()} · {chapterNames.length > 0 ? chapterNames[0] : "今日のスタート"}</p>
          </div>
          <span className="text-sm shrink-0" style={{ color: "#1B6B7A" }}>→</span>
        </button>
      ) : (
        <div className="mb-8 border border-stone-200 rounded-xl p-6 animate-fadeIn">
          <p
            className="text-[10px] tracking-[0.25em] uppercase mb-4"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            Today&apos;s Page
          </p>

          {/* Chapter Selection */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-[10px] text-stone-400 tracking-wide">
                章
              </label>
              {!isNewChapter ? (
                <div className="flex items-center gap-2 flex-1">
                  <select
                    value={inputChapter}
                    onChange={(e) => setInputChapter(e.target.value)}
                    className="flex-1 text-xs bg-transparent border-b border-stone-200 pb-1 focus:outline-none focus:border-stone-400 text-gray-700"
                  >
                    {chapterNames.map((ch) => (
                      <option key={ch} value={ch}>
                        {ch}
                      </option>
                    ))}
                    {chapterNames.length === 0 && (
                      <option value="">章がありません</option>
                    )}
                  </select>
                  <button
                    onClick={() => setIsNewChapter(true)}
                    className="text-[10px] text-stone-400 hover:text-[#1B6B7A] transition-colors whitespace-nowrap"
                  >
                    + 新しい章
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    placeholder="新しい章のタイトル"
                    className="flex-1 text-xs bg-transparent border-b border-stone-200 pb-1 focus:outline-none focus:border-stone-400 text-gray-700 placeholder:text-stone-300"
                    autoFocus
                  />
                  <button
                    onClick={handleSuggestChapterTitle}
                    disabled={suggestingTitle}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-stone-200 text-stone-400 hover:text-[#1B6B7A] hover:border-[#1B6B7A] transition-colors whitespace-nowrap disabled:opacity-40"
                  >
                    {suggestingTitle ? "考え中..." : "AIで提案"}
                  </button>
                  {chapterNames.length > 0 && (
                    <button
                      onClick={() => {
                        setIsNewChapter(false);
                        setNewChapterName("");
                      }}
                      className="text-[10px] text-stone-300 hover:text-stone-500 transition-colors"
                    >
                      戻る
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Entry Type */}
          <div className="flex items-center gap-2 mb-4">
            <label className="text-[10px] text-stone-400 tracking-wide mr-1">
              種類
            </label>
            {ENTRY_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setInputType(t.value)}
                className={`text-[10px] px-2.5 py-1 rounded-full transition-colors ${
                  inputType === t.value
                    ? "text-white"
                    : "text-stone-400 bg-stone-50 hover:bg-stone-100"
                }`}
                style={
                  inputType === t.value
                    ? {
                        backgroundColor:
                          TYPE_STYLES[t.value]?.color || "#6B7280",
                      }
                    : undefined
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <textarea
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="今日何があったか、何を感じたか..."
            className="w-full bg-transparent text-sm text-gray-700 placeholder:text-stone-300 focus:outline-none resize-none leading-relaxed mb-4"
            style={{ color: "var(--ink, #1A1A1A)" }}
            rows={3}
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setShowInput(false);
                setInputContent("");
                setInputType("everyday");
                setIsNewChapter(false);
                setNewChapterName("");
              }}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSaveStory}
              className="text-xs px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-40"
              style={{ backgroundColor: "var(--navy, #1C2D3F)" }}
              disabled={
                !inputContent.trim() ||
                (!isNewChapter && !inputChapter) ||
                (isNewChapter && !newChapterName.trim()) ||
                saving
              }
            >
              {saving ? "保存中..." : "物語に追加する"}
            </button>
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1B6B7A] rounded-full animate-spin mx-auto" />
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && stories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-stone-400 font-light">
            まだ物語がありません。
          </p>
          <p className="text-xs text-stone-300 mt-2">
            上のボタンから、最初の1ページを書き始めましょう。
          </p>
        </div>
      )}

      {/* ── Timeline ── */}
      {!loading && stories.length > 0 && (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-stone-200" />

          <div className="space-y-6">
            {chapterKeys.map((chapter) => {
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
                                <button onClick={() => setDeleteId(entry.id)} className="text-[11px] text-stone-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-auto" title="このページを削除">🗑</button>
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
