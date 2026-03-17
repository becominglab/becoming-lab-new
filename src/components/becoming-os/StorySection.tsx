"use client";

import { useState } from "react";

interface StoryEntry {
  id: string;
  date: string;
  chapter: string;
  content: string;
  type: "milestone" | "turning_point" | "everyday" | "insight";
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

const MOCK_STORIES: StoryEntry[] = [
  {
    id: "s1",
    date: "2026-03-16",
    chapter: "第3章：走ることの意味",
    content:
      "初めて20kmを走り切った。体は重かったけれど、15kmあたりで不思議な軽さが訪れた。ランナーズハイというものだろうか。自分の体がまだ知らない可能性を持っていることに驚いた。",
    type: "milestone",
  },
  {
    id: "s2",
    date: "2026-03-10",
    chapter: "第3章：走ることの意味",
    content:
      "「なぜ走るのか」と聞かれて、うまく答えられなかった。でも帰り道に気づいた。走ることは、自分と対話する時間なのだ。答えが見つからないことも含めて。",
    type: "insight",
  },
  {
    id: "s3",
    date: "2026-02-22",
    chapter: "第2章：習慣の再構築",
    content:
      "3週間続いた早起きの習慣が途切れた。自分を責めそうになったけれど、「途切れた」ことよりも「3週間続いた」ことの方が大事だと思い直した。明日からまた始めればいい。",
    type: "everyday",
  },
  {
    id: "s4",
    date: "2026-02-01",
    chapter: "第1章：始まり",
    content:
      "becoming lab に登録した日。「自分を更新する」という言葉が刺さった。完成を目指すのではなく、更新を重ねる。この考え方が、いまの自分にはちょうどいい。",
    type: "turning_point",
  },
];

export default function StorySection() {
  const [stories] = useState<StoryEntry[]>(MOCK_STORIES);

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

      {/* Timeline */}
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
                  const style = TYPE_STYLES[entry.type];
                  const d = new Date(entry.date + "T00:00:00");
                  return (
                    <div
                      key={entry.id}
                      className="relative group"
                    >
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
    </section>
  );
}
