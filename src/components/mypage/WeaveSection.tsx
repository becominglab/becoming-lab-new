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
  everyday: { label: "日常", color: "#6B7280", bg: "#6B728010" },
  insight: { label: "気づき", color: "#8B5CF6", bg: "#8B5CF610" },
  turning_point: { label: "転機", color: "#D97706", bg: "#D9770610" },
  milestone: { label: "節目", color: "#1B6B7A", bg: "#1B6B7A10" },
};

export default function WeaveSection() {
  const [stories, setStories] = useState<StoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formChapter, setFormChapter] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formType, setFormType] = useState<string>("everyday");
  const [saving, setSaving] = useState(false);

  const fetchStories = useCallback(async () => {
    try {
      const res = await fetch("/api/stories");
      if (res.ok) {
        const data = await res.json();
        setStories(data.stories || []);
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

  const handleCreate = async () => {
    if (!formContent.trim() || !formChapter.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter: formChapter.trim(),
          content: formContent.trim(),
          entry_type: formType,
        }),
      });
      if (res.ok) {
        setFormChapter("");
        setFormContent("");
        setFormType("everyday");
        setShowForm(false);
        await fetchStories();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  // Get existing chapters for the dropdown
  const existingChapters = [
    ...new Set(stories.map((s) => s.chapter)),
  ];

  // Recent 3 entries
  const recentEntries = stories.slice(0, 3);

  return (
    <section>
      {/* Section Header */}
      <div className="mb-8">
        <p
          className="text-[10px] tracking-[0.35em] uppercase mb-3"
          style={{ color: "var(--gold, #B8A88A)" }}
        >
          Weave
        </p>
        <h2
          className="text-xl md:text-2xl font-light"
          style={{ color: "var(--ink, #1A1A1A)" }}
        >
          紡ぐ
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          今日の1ページを、自分の物語として書く。
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1B6B7A] rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && (
        <>
          {/* ── Write Today's Page ── */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full p-8 rounded-xl border border-dashed transition-colors text-center group"
              style={{ borderColor: "var(--gold, #B8A88A)40" }}
            >
              <p
                className="text-[10px] tracking-[0.25em] uppercase mb-2"
                style={{ color: "var(--gold, #B8A88A)" }}
              >
                Today&apos;s Page
              </p>
              <p className="text-sm text-stone-400 group-hover:text-stone-600 transition-colors">
                今日の1ページを書く
              </p>
            </button>
          ) : (
            <div
              className="animate-fadeIn border rounded-xl p-6"
              style={{ borderColor: "var(--gold, #B8A88A)30" }}
            >
              <p
                className="text-[10px] tracking-[0.25em] uppercase mb-4"
                style={{ color: "var(--gold, #B8A88A)" }}
              >
                Today&apos;s Page
              </p>

              {/* Chapter selector */}
              <div className="mb-4">
                <label className="text-[10px] text-stone-400 block mb-1.5">
                  章
                </label>
                {existingChapters.length > 0 ? (
                  <div className="flex gap-2 items-center">
                    <select
                      value={formChapter}
                      onChange={(e) => setFormChapter(e.target.value)}
                      className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                      style={{ color: "var(--ink, #1A1A1A)" }}
                    >
                      <option value="">選択してください</option>
                      {existingChapters.map((ch) => (
                        <option key={ch} value={ch}>
                          {ch}
                        </option>
                      ))}
                      <option value="__new__">＋ 新しい章</option>
                    </select>
                    {formChapter === "__new__" && (
                      <input
                        type="text"
                        placeholder="章タイトル"
                        className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                        style={{ color: "var(--ink, #1A1A1A)" }}
                        onChange={(e) => setFormChapter(e.target.value)}
                        autoFocus
                      />
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formChapter}
                    onChange={(e) => setFormChapter(e.target.value)}
                    placeholder="例：第1章：始まり"
                    className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                    style={{ color: "var(--ink, #1A1A1A)" }}
                    autoFocus
                  />
                )}
              </div>

              {/* Entry Type Selector */}
              <div className="flex gap-2 mb-4">
                {Object.entries(TYPE_STYLES).map(([key, { label, color }]) => (
                  <button
                    key={key}
                    onClick={() => setFormType(key)}
                    className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                      formType === key
                        ? "text-white"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                    style={{
                      borderColor: formType === key ? color : `${color}40`,
                      backgroundColor:
                        formType === key ? color : "transparent",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="今日何があったか、何を感じたか..."
                className="w-full bg-white border border-stone-200 rounded-xl p-5 text-sm placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none leading-relaxed"
                style={{ color: "var(--ink, #1A1A1A)" }}
                rows={4}
              />

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormChapter("");
                    setFormContent("");
                    setFormType("everyday");
                  }}
                  className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleCreate}
                  className="text-xs px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-40"
                  style={{ backgroundColor: "var(--navy, #1C2D3F)" }}
                  disabled={
                    !formChapter.trim() ||
                    formChapter === "__new__" ||
                    !formContent.trim() ||
                    saving
                  }
                >
                  {saving ? "保存中..." : "物語に追加する"}
                </button>
              </div>
            </div>
          )}

          {/* ── Recent Pages ── */}
          {recentEntries.length > 0 && (
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-3">
                RECENT PAGES
              </p>
              <div className="space-y-2">
                {recentEntries.map((entry) => {
                  const style = TYPE_STYLES[entry.entry_type];
                  const d = new Date(entry.date + "T00:00:00");
                  return (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50/60 transition-colors"
                    >
                      <div className="pt-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: style?.color || "#9CA3AF",
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
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
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-light line-clamp-2">
                          {entry.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
