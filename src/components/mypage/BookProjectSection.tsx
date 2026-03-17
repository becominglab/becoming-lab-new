"use client";

import { useState, useEffect, useCallback } from "react";

interface StoryEntry {
  id: string;
  date: string;
  chapter: string;
  content: string;
  entry_type: string;
}

interface ChapterSummary {
  name: string;
  pages: number;
  firstDate: string;
  lastDate: string;
}

export default function BookProjectSection() {
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStories = useCallback(async () => {
    try {
      const res = await fetch("/api/stories");
      if (res.ok) {
        const data = await res.json();
        const stories: StoryEntry[] = data.stories || [];

        const chapterMap: Record<
          string,
          { pages: number; firstDate: string; lastDate: string }
        > = {};

        stories.forEach((s) => {
          if (!chapterMap[s.chapter]) {
            chapterMap[s.chapter] = {
              pages: 0,
              firstDate: s.date,
              lastDate: s.date,
            };
          }
          chapterMap[s.chapter].pages++;
          if (s.date < chapterMap[s.chapter].firstDate) {
            chapterMap[s.chapter].firstDate = s.date;
          }
          if (s.date > chapterMap[s.chapter].lastDate) {
            chapterMap[s.chapter].lastDate = s.date;
          }
        });

        const summaries = Object.entries(chapterMap).map(([name, data]) => ({
          name,
          ...data,
        }));

        summaries.sort((a, b) => a.firstDate.localeCompare(b.firstDate));

        setChapters(summaries);
        setTotalPages(stories.length);
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

  const maxPages = Math.max(...chapters.map((c) => c.pages), 1);

  return (
    <section>
      {/* Section Header */}
      <p
        className="text-[10px] tracking-[0.35em] uppercase mb-3"
        style={{ color: "var(--gold, #B8A88A)" }}
      >
        Your Book
      </p>
      <h2
        className="text-xl md:text-2xl font-light"
        style={{ color: "var(--ink, #1A1A1A)" }}
      >
        あなたの本
      </h2>
      <p className="text-sm text-stone-400 mt-2 font-light mb-8">
        日々の記録は、やがて一冊の本になります。
      </p>

      {loading && (
        <div className="text-center py-8">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1B6B7A] rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && chapters.length === 0 && (
        <div
          className="text-center py-14 rounded-2xl"
          style={{ backgroundColor: "rgba(184, 168, 138, 0.06)" }}
        >
          <p
            className="text-lg font-light italic mb-2"
            style={{ color: "var(--ink, #1A1A1A)" }}
          >
            まだ途中にいる
          </p>
          <p className="text-xs text-stone-400">
            あなたの本は、最初の1ページから始まります。
          </p>
        </div>
      )}

      {!loading && chapters.length > 0 && (
        <>
          {/* Book Title */}
          <div
            className="rounded-2xl p-8 mb-8 text-center"
            style={{ backgroundColor: "rgba(184, 168, 138, 0.06)" }}
          >
            <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-3">
              仮タイトル
            </p>
            <p
              className="text-lg md:text-xl font-light italic"
              style={{ color: "var(--ink, #1A1A1A)" }}
            >
              『まだ途中にいる』
            </p>
          </div>

          {/* Chapter List */}
          <div className="space-y-5 mb-8">
            {chapters.map((chapter, index) => {
              const barWidth = Math.max(
                (chapter.pages / maxPages) * 100,
                8
              );

              return (
                <div key={chapter.name}>
                  <div className="flex items-center gap-4">
                    <span
                      className="text-[10px] tracking-wider shrink-0 w-10 text-right"
                      style={{ color: "var(--gold, #B8A88A)" }}
                    >
                      Ch.{index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <h3
                          className="text-sm font-medium"
                          style={{ color: "var(--ink, #1A1A1A)" }}
                        >
                          {chapter.name}
                        </h3>
                        <span className="text-[10px] text-stone-400">
                          {chapter.pages} ページ
                        </span>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: "var(--gold, #B8A88A)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary + Actions */}
          <div className="flex items-center justify-between p-5 rounded-xl" style={{ backgroundColor: "rgba(184, 168, 138, 0.06)" }}>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xl font-light" style={{ color: "var(--ink, #1A1A1A)" }}>
                  {totalPages}
                </p>
                <p className="text-[10px] text-stone-400">ページ</p>
              </div>
              <div className="w-px h-6 bg-stone-200" />
              <div>
                <p className="text-xl font-light" style={{ color: "var(--ink, #1A1A1A)" }}>
                  {chapters.length}
                </p>
                <p className="text-[10px] text-stone-400">チャプター</p>
              </div>
            </div>

            <button
              className="text-[10px] tracking-wide px-4 py-2 rounded-full border transition-colors hover:bg-stone-50"
              style={{
                borderColor: "var(--gold, #B8A88A)",
                color: "var(--ink, #1A1A1A)",
              }}
            >
              下書きを生成する
            </button>
          </div>
        </>
      )}
    </section>
  );
}
