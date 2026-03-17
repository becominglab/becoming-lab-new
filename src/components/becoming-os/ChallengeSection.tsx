"use client";

import { useState, useEffect, useCallback } from "react";

interface Milestone {
  label: string;
  done: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  target_date: string | null;
  progress: number;
  status: "active" | "completed" | "paused";
  milestones: Milestone[];
}

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
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchChallenges = useCallback(async () => {
    try {
      const res = await fetch("/api/challenges");
      if (res.ok) {
        const data = await res.json();
        setChallenges(data.challenges || []);
      }
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleCreate = async () => {
    if (!formTitle.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          description: formDesc.trim() || null,
          target_date: formTarget || null,
        }),
      });
      if (res.ok) {
        setFormTitle("");
        setFormDesc("");
        setFormTarget("");
        setShowForm(false);
        await fetchChallenges();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleProgressClick = async (
    challenge: Challenge,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = Math.round((x / rect.width) * 100);
    try {
      const res = await fetch("/api/challenges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: challenge.id, progress: newProgress }),
      });
      if (res.ok) {
        setChallenges((prev) =>
          prev.map((c) =>
            c.id === challenge.id
              ? { ...c, progress: Math.min(100, Math.max(0, newProgress)) }
              : c
          )
        );
      }
    } catch {
      // ignore
    }
  };

  const handleMilestoneToggle = async (
    challenge: Challenge,
    milestoneIndex: number
  ) => {
    const newMilestones = (challenge.milestones || []).map((m, i) =>
      i === milestoneIndex ? { ...m, done: !m.done } : m
    );
    try {
      const res = await fetch("/api/challenges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: challenge.id, milestones: newMilestones }),
      });
      if (res.ok) {
        setChallenges((prev) =>
          prev.map((c) =>
            c.id === challenge.id ? { ...c, milestones: newMilestones } : c
          )
        );
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/challenges?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setChallenges((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      // ignore
    }
  };

  const activeChallenges = challenges.filter((c) => c.status === "active");
  const completedChallenges = challenges.filter((c) => c.status === "completed");

  return (
    <section>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "var(--gold, #B8A88A)" }}>
          CHALLENGE
        </p>
        <h2 className="text-xl md:text-2xl font-light" style={{ color: "var(--ink, #1A1A1A)" }}>
          いま挑んでいること
        </h2>
        <p className="text-sm text-stone-400 mt-2 font-light">
          宣言し、行動し、積み重ねる。
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
          {challenges.length === 0 && !showForm && (
            <div className="text-center py-12">
              <p className="text-sm text-stone-400 font-light">
                まだ挑戦がありません。
              </p>
              <p className="text-xs text-stone-300 mt-2">
                新しい挑戦を始めて、成長の記録を残しましょう。
              </p>
            </div>
          )}

          {/* Active Challenges */}
          <div className="space-y-4">
            {activeChallenges.map((c) => {
              const remaining = daysRemaining(c.target_date);
              const milestones = c.milestones || [];
              const doneMilestones = milestones.filter((m) => m.done).length;
              return (
                <div
                  key={c.id}
                  className="group border border-stone-200 rounded-xl p-6 hover:border-stone-300 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900">
                        {c.title}
                      </h3>
                      {c.description && (
                        <p className="text-xs text-stone-400 mt-1 font-light">
                          {c.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {remaining && (
                        <span className="text-[10px] text-stone-400 bg-stone-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          {remaining}
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-[10px] text-stone-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        削除
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar (clickable) */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-stone-400">
                        進捗（クリックで更新）
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">
                        {c.progress}%
                      </span>
                    </div>
                    <div
                      className="h-2 bg-stone-100 rounded-full overflow-hidden cursor-pointer hover:bg-stone-200 transition-colors"
                      onClick={(e) => handleProgressClick(c, e)}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${c.progress}%`,
                          backgroundColor: "#1B6B7A",
                        }}
                      />
                    </div>
                  </div>

                  {/* Milestones (clickable) */}
                  {milestones.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {milestones.map((m, i) => (
                        <button
                          key={i}
                          onClick={() => handleMilestoneToggle(c, i)}
                          className={`text-[10px] px-2.5 py-1 rounded-full transition-colors cursor-pointer hover:opacity-80 ${
                            m.done
                              ? "bg-[#1B6B7A]/10 text-[#1B6B7A]"
                              : "bg-stone-50 text-stone-400 hover:bg-stone-100"
                          }`}
                        >
                          {m.done ? "✓ " : "○ "}
                          {m.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Bottom meta */}
                  {milestones.length > 0 && (
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-stone-100">
                      <span className="text-[10px] text-stone-300">
                        {doneMilestones}/{milestones.length} マイルストーン
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Completed Challenges */}
          {completedChallenges.length > 0 && (
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.2em] text-stone-400 mb-3">
                COMPLETED
              </p>
              <div className="space-y-2">
                {completedChallenges.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-stone-50/60 text-stone-400"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light line-through">
                        {c.title}
                      </span>
                      <span className="text-[10px]">✓ 達成</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Challenge */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full mt-6 p-5 rounded-xl border border-dashed border-stone-200 hover:border-stone-400 transition-colors text-center group"
            >
              <p className="text-sm text-stone-400 group-hover:text-stone-600 transition-colors">
                新しい挑戦を始める
              </p>
            </button>
          ) : (
            <div className="mt-6 animate-fadeIn border border-stone-200 rounded-xl p-6">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="例：フルマラソン完走"
                className="w-full bg-transparent text-base text-gray-900 placeholder:text-stone-300 focus:outline-none mb-3"
                autoFocus
              />
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="詳細（任意）"
                className="w-full bg-transparent text-sm text-gray-700 placeholder:text-stone-300 focus:outline-none resize-none leading-relaxed mb-3"
                rows={2}
              />
              <div className="flex items-center gap-4 mb-4">
                <label className="text-[10px] text-stone-400">目標日</label>
                <input
                  type="date"
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  className="text-xs text-gray-700 bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-400 pb-1"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormTitle("");
                    setFormDesc("");
                    setFormTarget("");
                  }}
                  className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleCreate}
                  className="text-xs px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-40"
                  style={{ backgroundColor: "var(--navy, #1C2D3F)" }}
                  disabled={!formTitle.trim() || saving}
                >
                  {saving ? "作成中..." : "挑戦を作成"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
