'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState } from '@/lib/nobishiro/types';

interface RewardMilestone {
  id: string;
  name: string;
  icon: string;
  badgesRequired: number;
  isSpringComplete?: boolean;
}

const REWARD_MILESTONES: RewardMilestone[] = [
  { id: 'reward-3', name: '好きなおやつ', icon: '🍰', badgesRequired: 3 },
  { id: 'reward-5', name: '本屋さんで1冊', icon: '📚', badgesRequired: 5 },
  { id: 'reward-7', name: '家族でカフェ', icon: '☕', badgesRequired: 7 },
  { id: 'reward-10', name: 'おでかけ', icon: '🎡', badgesRequired: 10 },
  { id: 'reward-spring', name: '特別体験', icon: '🌟', badgesRequired: 20, isSpringComplete: true },
];

export default function RewardsPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nobishiro-quest');
      if (!stored) { router.replace('/mm'); return; }
      const s = JSON.parse(stored) as AppState;
      if (!s.currentUser) { router.replace('/mm'); return; }
      setState(s);
    } catch { router.replace('/mm'); }
  }, [router]);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  const badgeCount = state.earnedBadges?.length || 0;
  const claimedRewards = new Set((state.rewards || []).filter((r) => r.claimed).map((r) => r.id));

  // Find parent message for a reward
  const getParentMessage = (rewardId: string): string | null => {
    const comment = state.parentComments?.find((c) => c.text.includes(rewardId));
    return comment?.text || null;
  };

  const handleChestClick = (milestone: RewardMilestone) => {
    if (badgeCount >= milestone.badgesRequired && !claimedRewards.has(milestone.id)) {
      setOpeningId(milestone.id);
      setTimeout(() => setOpeningId(null), 1200);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 pt-10 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.push('/mm/home')}
            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white text-lg"
          >
            ←
          </button>
          <h1 className="text-white text-xl font-bold">ごほうび</h1>
        </div>
        <div className="bg-white/15 rounded-xl px-4 py-3 text-center">
          <p className="text-white text-sm">現在のバッジ数</p>
          <p className="text-white text-3xl font-bold mt-1">{badgeCount}<span className="text-base font-normal text-white/70"> バッジ</span></p>
        </div>
      </div>

      <div className="px-5 -mt-3 space-y-4">
        {REWARD_MILESTONES.map((milestone) => {
          const unlocked = badgeCount >= milestone.badgesRequired;
          const claimed = claimedRewards.has(milestone.id);
          const isOpening = openingId === milestone.id;
          const progressPct = Math.min(100, (badgeCount / milestone.badgesRequired) * 100);
          const parentMsg = unlocked ? getParentMessage(milestone.id) : null;

          return (
            <div
              key={milestone.id}
              className={`rounded-2xl p-5 transition-all duration-500 ${
                claimed
                  ? 'bg-white border-2 border-green-300 shadow-sm'
                  : unlocked
                  ? 'bg-white border-2 border-purple-300 shadow-lg'
                  : 'bg-white/70 border border-slate-200'
              }`}
              style={unlocked && !claimed ? { boxShadow: '0 0 16px rgba(168, 85, 247, 0.2)' } : undefined}
            >
              <div className="flex items-start gap-4">
                {/* Chest icon */}
                <button
                  onClick={() => handleChestClick(milestone)}
                  className={`text-4xl transition-all duration-500 ${
                    isOpening ? 'scale-125 animate-bounce' : ''
                  }`}
                >
                  {claimed ? (
                    <span className="relative">
                      🎁
                      <span className="absolute -top-1 -right-1 text-sm">✅</span>
                    </span>
                  ) : unlocked ? (
                    <span className="relative">
                      🎁
                      <span className="absolute -top-1 -right-2 text-xs animate-pulse">✨</span>
                    </span>
                  ) : (
                    <span className="grayscale opacity-50">🔒</span>
                  )}
                </button>

                <div className="flex-1">
                  {/* Title row */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{milestone.icon}</span>
                    <h3 className={`font-bold ${unlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                      {milestone.name}
                    </h3>
                    {milestone.isSpringComplete && (
                      <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">春休み完走</span>
                    )}
                  </div>

                  {/* Required badges */}
                  <p className={`text-xs mb-2 ${unlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                    {milestone.badgesRequired}バッジで解放
                  </p>

                  {/* Progress bar */}
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        unlocked
                          ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                          : 'bg-gradient-to-r from-slate-300 to-slate-400'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Status */}
                  {claimed ? (
                    <p className="text-sm text-green-600 font-medium">受け取り済み ✅</p>
                  ) : unlocked ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-purple-600 animate-pulse">解放！</span>
                      <span className="text-xs animate-ping">✨</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      あと{milestone.badgesRequired - badgeCount}バッジ（{badgeCount}/{milestone.badgesRequired}）
                    </p>
                  )}

                  {/* Parent message area */}
                  {unlocked && parentMsg && (
                    <div className="mt-3 bg-pink-50 border border-pink-100 rounded-xl px-3 py-2">
                      <p className="text-xs text-pink-500 font-medium mb-1">💌 親からのメッセージ</p>
                      <p className="text-sm text-slate-700">{parentMsg}</p>
                    </div>
                  )}

                  {unlocked && !parentMsg && !claimed && (
                    <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2">
                      <p className="text-xs text-purple-400">💌 親からのメッセージがここに表示されます</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Encouragement footer */}
        <div className="text-center py-4">
          <p className="text-sm text-slate-500">
            {badgeCount === 0
              ? 'バッジを集めて、ごほうびを解放しよう！'
              : badgeCount < 3
              ? `あと${3 - badgeCount}バッジで最初のごほうび！`
              : 'その調子！どんどんごほうびが近づいてるよ！'}
          </p>
        </div>
      </div>
    </div>
  );
}
