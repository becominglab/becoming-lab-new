"use client";

import { useState, useEffect, useCallback } from "react";

interface StoryEntry {
  id: string;
  date: string;
  chapter: string;
  content: string;
  entry_type: "milestone" | "turning_point" | "everyday" | "insight";
}

const TYPE_STYLES: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  milestone: { label: "マイルストーン", color: "#1B6B7A", bg: "#1B6B7A10" },
  turning_point: { label: "転機", color: "#D97706", bg: "#D9770610" },
  everyday: { label: "日常", color: "#6B7280", bg: "#6B728010" },
  insight: { label: "気づき", color: "#8B5CF6", bg: "#8B5CF610" },
};

export default function StorySection() {
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

  // Group by chapter
  const chapters = stories.reduce(
    (acc, s) => {
      if (!acc[s.chapter]) acc[s.chapter] = [];
      acc[s.chapter].push(s);
      return acc;
    },
    {} as Record<string, StoryEntry[]>
  );

  return (
    <section>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-3">
          STORY
        </p>
        <h2 className="text-xl md:text-2xl font-light text-gray-900">
          自分の物語
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          あなたの人生は、あなたが紡ぐ一編の物語。
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1B6B7A] rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && (
        <>
          {/* Empty State */}
          {stories.length === 0 && !showForm && (
            <div className="text-center py-12">
              <p className="text-sm text-stone-400 font-light">
                まだ物語がありません。
              </p>
              <p className="text-xs text-stone-300 mt-2">
                あなたの物語の最初の一章を書き始めましょう。
              </p>
            </div>
          )}

          {/* Timeline */}
          {stories.length > 0 && (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-stone-200" />

              <div className="space-y-8">
                {Object.entries(chapters).map(([chapter, entries]) => (
                  <div key={chapter}>
                    {/* Chapter Title */}
                    <div className="flex items-center gap-4 mb-4 relative">
                      <div className="w-[15px] h-[15px] rounded-full bg-white border-2 border-stone-300 z-10 shrink-0" />
                      <h3 className="text-sm font-medium text-gray-700 tracking-wide">
                        {chapter}
                      </h3>
                    </div>

                    {/* Entries */}
                    <div className="space-y-3 ml-[7px] pl-6 border-l border-transparent">
                      {entries.map((entry) => {
                        const style = TYPE_STYLES[entry.entry_type];
                        const d = new Date(entry.date + "T00:00:00");
                        return (
                          <div key={entry.id} className="relative group">
                            {/* Connector dot */}
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Story */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full mt-6 p-5 rounded-xl border border-dashed border-stone-200 hover:border-stone-400 transition-colors text-center group"
            >
              <p className="text-sm text-stone-400 group-hover:text-stone-600 transition-colors">
                物語に新しいページを書く
              </p>
            </button>
          ) : (
            <div className="mt-6 animate-fadeIn border border-stone-200 rounded-xl p-6">
              <input
                type="text"
                value={formChapter}
                onChange={(e) => setFormChapter(e.target.value)}
                placeholder="章タイトル（例：第1章：始まり）"
                className="w-full bg-transparent text-base text-gray-900 placeholder:text-stone-300 focus:outline-none mb-3"
                autoFocus
              />

              {/* Entry Type Selector */}
              <div className="flex gap-2 mb-3">
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
                      backgroundColor: formType === key ? color : "transparent",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="この日何があったか、何を感じたか..."
                className="w-full bg-transparent text-sm text-gray-700 placeholder:text-stone-300 focus:outline-none resize-none leading-relaxed mb-3"
                rows={4}
              />

              <div className="flex items-center justify-end gap-3">
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
                  className="text-xs px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
                  disabled={!formChapter.trim() || !formContent.trim() || saving}
                >
                  {saving ? "保存中..." : "物語に追加"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
