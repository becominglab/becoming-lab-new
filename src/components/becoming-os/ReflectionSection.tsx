"use client";

import { useState } from "react";

interface ReflectionEntry {
  id: string;
  date: string;
  content: string;
  mood: "calm" | "energized" | "thoughtful" | "grateful" | "struggling";
}

const MOOD_MAP: Record<string, { label: string; color: string }> = {
  calm: { label: "穏やか", color: "#06B6D4" },
  energized: { label: "エネルギッシュ", color: "#F97316" },
  thoughtful: { label: "思索的", color: "#8B5CF6" },
  grateful: { label: "感謝", color: "#22C55E" },
  struggling: { label: "もがいている", color: "#EF4444" },
};

// Mock data for reflection
const MOCK_REFLECTIONS: ReflectionEntry[] = [
  {
    id: "r1",
    date: "2026-03-17",
    content:
      "朝ランのあと、いつもの公園のベンチに座って考えた。「何のために走っているのか」という問いに、まだうまく答えられない。でも、走り終えたあとの清々しさが、ひとつの答えなのかもしれない。",
    mood: "thoughtful",
  },
  {
    id: "r2",
    date: "2026-03-15",
    content:
      "チームの打ち上げで、思いがけず感謝の言葉をもらった。自分では当たり前にやっていたことが、誰かの支えになっていたらしい。小さな行動の積み重ねを、もっと信じていいのかもしれない。",
    mood: "grateful",
  },
  {
    id: "r3",
    date: "2026-03-13",
    content:
      "新しいプロジェクトの方向性がまだ見えない。焦りはあるけれど、こういう「わからない時間」を丁寧に過ごすことが大事だと、過去の自分が教えてくれている。",
    mood: "struggling",
  },
];

const PROMPTS = [
  "今日、心に残ったことは？",
  "最近の自分に、一言かけるなら？",
  "いま、手放したいものは何？",
  "明日の自分に期待することは？",
];

export default function ReflectionSection() {
  const [reflections] = useState<ReflectionEntry[]>(MOCK_REFLECTIONS);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");

  const todayPrompt = PROMPTS[new Date().getDay() % PROMPTS.length];

  return (
    <section>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-3">
          REFLECTION
        </p>
        <h2 className="text-xl md:text-2xl font-light text-gray-900">
          内省の記録
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          立ち止まる時間が、次の一歩を照らす。
        </p>
      </div>

      {/* Today's Prompt */}
      <div
        className="bg-stone-50/80 rounded-xl p-6 mb-8 cursor-pointer hover:bg-stone-100/80 transition-colors"
        onClick={() => setShowInput(!showInput)}
      >
        <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-3">
          TODAY&apos;S PROMPT
        </p>
        <p className="text-base text-gray-700 font-light italic">
          &ldquo;{todayPrompt}&rdquo;
        </p>
        {!showInput && (
          <p className="text-xs text-stone-400 mt-3">
            タップして書き始める
          </p>
        )}
      </div>

      {/* Input Area */}
      {showInput && (
        <div className="mb-8 animate-fadeIn">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="今日の気づきを書いてみる..."
            className="w-full bg-white border border-stone-200 rounded-xl p-5 text-sm text-gray-700 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none leading-relaxed"
            rows={4}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              {Object.entries(MOOD_MAP).map(([key, { label, color }]) => (
                <button
                  key={key}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
                  style={{ borderColor: `${color}30` }}
                  title={label}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              className="text-xs px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
              disabled={!inputText.trim()}
            >
              記録する
            </button>
          </div>
        </div>
      )}

      {/* Past Reflections */}
      <div className="space-y-4">
        {reflections.map((r) => {
          const mood = MOOD_MAP[r.mood];
          const d = new Date(r.date + "T00:00:00");
          return (
            <div key={r.id} className="group">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50/60 transition-colors">
                <div className="pt-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: mood?.color || "#9CA3AF" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
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
                        color: mood?.color,
                        backgroundColor: `${mood?.color}10`,
                      }}
                    >
                      {mood?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">
                    {r.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
