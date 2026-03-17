"use client";

import { useState } from "react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  targetDate: string | null;
  progress: number; // 0-100
  status: "active" | "completed" | "paused";
  milestones: { label: string; done: boolean }[];
}

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "フルマラソン完走",
    description:
      "2026年秋のマラソン大会に向けて、週4回のランニング習慣を確立する。",
    startDate: "2026-01-15",
    targetDate: "2026-10-18",
    progress: 35,
    status: "active",
    milestones: [
      { label: "月間100km達成", done: true },
      { label: "ハーフマラソン完走", done: false },
      { label: "30km走クリア", done: false },
      { label: "フルマラソン完走", done: false },
    ],
  },
  {
    id: "c2",
    title: "毎朝の内省を30日続ける",
    description: "朝5分の振り返り習慣。自分との対話を日課にする。",
    startDate: "2026-03-01",
    targetDate: "2026-03-31",
    progress: 56,
    status: "active",
    milestones: [
      { label: "7日連続", done: true },
      { label: "14日連続", done: true },
      { label: "21日連続", done: false },
      { label: "30日完走", done: false },
    ],
  },
  {
    id: "c3",
    title: "体脂肪率15%以下",
    description: "食事改善とトレーニングで体組成を最適化する。",
    startDate: "2026-02-01",
    targetDate: "2026-06-30",
    progress: 20,
    status: "active",
    milestones: [
      { label: "食事記録を始める", done: true },
      { label: "体脂肪率18%", done: false },
      { label: "体脂肪率16%", done: false },
      { label: "体脂肪率15%達成", done: false },
    ],
  },
];

function daysRemaining(target: string | null): string | null {
  if (!target) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const t = new Date(target + "T00:00:00");
  const diff = Math.ceil(
    (t.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return "期限超過";
  if (diff === 0) return "今日まで";
  return `残り${diff}日`;
}

export default function ChallengeSection() {
  const [challenges] = useState<Challenge[]>(MOCK_CHALLENGES);

  return (
    <section>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-3">
          CHALLENGE
        </p>
        <h2 className="text-xl md:text-2xl font-light text-gray-900">
          いま挑んでいること
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          宣言し、行動し、積み重ねる。
        </p>
      </div>

      <div className="space-y-4">
        {challenges.map((c) => {
          const remaining = daysRemaining(c.targetDate);
          const doneMilestones = c.milestones.filter((m) => m.done).length;
          return (
            <div
              key={c.id}
              className="border border-stone-200 rounded-xl p-6 hover:border-stone-300 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {c.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 font-light">
                    {c.description}
                  </p>
                </div>
                {remaining && (
                  <span className="text-[10px] text-stone-400 bg-stone-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {remaining}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-stone-400">進捗</span>
                  <span className="text-[10px] text-stone-500 font-medium">
                    {c.progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${c.progress}%`,
                      backgroundColor: "#1B6B7A",
                    }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="flex flex-wrap gap-2">
                {c.milestones.map((m, i) => (
                  <span
                    key={i}
                    className={`text-[10px] px-2.5 py-1 rounded-full transition-colors ${
                      m.done
                        ? "bg-[#1B6B7A]/10 text-[#1B6B7A]"
                        : "bg-stone-50 text-stone-400"
                    }`}
                  >
                    {m.done ? "✓ " : ""}
                    {m.label}
                  </span>
                ))}
              </div>

              {/* Bottom meta */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-stone-100">
                <span className="text-[10px] text-stone-300">
                  {doneMilestones}/{c.milestones.length} マイルストーン
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
