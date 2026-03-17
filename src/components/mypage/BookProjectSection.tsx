"use client";

import { useState, useEffect, useCallback } from "react";

// ── Types ──
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

        // Group by chapter and compute summaries
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

        const summaries = Object.entries(chapterMap).map(
          ([name, data]) => ({
            name,
            ...data,
          })
        );

        // Sort by first date (earliest first)
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

  // Find max pages for proportional bar
  const maxPages = Math.max(...chapters.map((c) => c.pages), 1);

  return (
    <section>
      {/* Section Header */}
      <div className="mb-8">
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
        <p className="text-sm text-stone-400 mt-2 font-light italic">
          まだ書かれていない章がある。
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1B6B7A] rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && chapters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-stone-400 font-light">
            まだ物語がありません。
          </p>
          <p className="text-xs text-stone-300 mt-2">
            あなたの本は、最初の1ページから始まります。
          </p>
        </div>
      )}

      {!loading && chapters.length > 0 && (
        <>
          {/* Chapter List */}
          <div className="space-y-4">
            {chapters.map((chapter, index) => {
              const barWidth = Math.max(
                (chapter.pages / maxPages) * 100,
                8
              );
              const firstD = new Date(chapter.firstDate + "T00:00:00");
              const lastD = new Date(chapter.lastDate + "T00:00:00");

              return (
                <div key={chapter.name} className="group">
                  <div className="flex items-center gap-4">
                    {/* Chapter number */}
                    <span
                      className="text-[10px] tracking-wider shrink-0 w-10 text-right"
                      style={{ color: "var(--gold, #B8A88A)" }}
                    >
                      Ch.{index + 1}
                    </span>

                    {/* Chapter info + bar */}
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

                      {/* Progress bar */}
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: "var(--gold, #B8A88A)",
                          }}
                        />
                      </div>

                      {/* Date range */}
                      <div className="flex items-center gap-2 mt-1">
                        <time className="text-[10px] text-stone-300">
                          {firstD.toLocaleDateString("ja-JP", {
                            month: "short",
                            day: "numeric",
                          })}
                          {chapter.firstDate !== chapter.lastDate && (
                            <>
                              {" — "}
                              {lastD.toLocaleDateString("ja-JP", {
                                month: "short",
                                day: "numeric",
                              })}
                            </>
                          )}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div
            className="mt-8 p-5 rounded-xl text-center"
            style={{ backgroundColor: "rgba(184, 168, 138, 0.08)" }}
          >
            <div className="flex items-center justify-center gap-6">
              <div>
                <p
                  className="text-2xl font-light"
                  style={{ color: "var(--ink, #1A1A1A)" }}
                >
                  {totalPages}
                </p>
                <p className="text-[10px] text-stone-400 mt-1">ページ</p>
              </div>
              <div
                className="w-px h-8"
                style={{ backgroundColor: "var(--gold, #B8A88A)40" }}
              />
              <div>
                <p
                  className="text-2xl font-light"
                  style={{ color: "var(--ink, #1A1A1A)" }}
                >
                  {chapters.length}
                </p>
                <p className="text-[10px] text-stone-400 mt-1">チャプター</p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
