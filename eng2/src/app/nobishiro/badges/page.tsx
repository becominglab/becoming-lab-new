'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState, EarnedBadge } from '@/lib/nobishiro/types';

interface BadgeDef {
  id: string;
  icon: string;
  name: string;
  category: 'streak' | 'subject' | 'growth' | 'juku';
  description: string;
  threshold: number;
  thresholdLabel: string;
}

const BADGE_CATEGORIES: { key: string; label: string; badges: BadgeDef[] }[] = [
  {
    key: 'streak',
    label: '継続系',
    badges: [
      { id: 'streak-1', icon: '🏃', name: 'はじめの一歩', category: 'streak', description: '1日学習した', threshold: 1, thresholdLabel: '1日' },
      { id: 'streak-3', icon: '🔥', name: '3日連続', category: 'streak', description: '3日連続で学習した', threshold: 3, thresholdLabel: '3日' },
      { id: 'streak-7', icon: '⭐', name: '7日連続', category: 'streak', description: '7日連続で学習した', threshold: 7, thresholdLabel: '7日' },
      { id: 'streak-10', icon: '🌸', name: '春休み前半クリア', category: 'streak', description: '10日間学習した', threshold: 10, thresholdLabel: '10日' },
      { id: 'streak-20', icon: '🏆', name: '春休み完走', category: 'streak', description: '20日間学習した', threshold: 20, thresholdLabel: '20日' },
    ],
  },
  {
    key: 'subject',
    label: '教科系',
    badges: [
      { id: 'subject-math-elem', icon: '🔢', name: '算数探検家', category: 'subject', description: '算数を5単元クリア', threshold: 5, thresholdLabel: '5単元' },
      { id: 'subject-math-jr', icon: '📐', name: '数学探検家', category: 'subject', description: '数学を5単元クリア', threshold: 5, thresholdLabel: '5単元' },
      { id: 'subject-japanese', icon: '📖', name: '国語名人', category: 'subject', description: '国語を5単元クリア', threshold: 5, thresholdLabel: '5単元' },
      { id: 'subject-english', icon: '🌍', name: '英語スターター', category: 'subject', description: '英語を5単元クリア', threshold: 5, thresholdLabel: '5単元' },
      { id: 'subject-science', icon: '🔬', name: '理科ラボ研究員', category: 'subject', description: '理科を5単元クリア', threshold: 5, thresholdLabel: '5単元' },
      { id: 'subject-social', icon: '🗾', name: '社会マップマスター', category: 'subject', description: '社会を5単元クリア', threshold: 5, thresholdLabel: '5単元' },
    ],
  },
  {
    key: 'growth',
    label: '成長系',
    badges: [
      { id: 'growth-hunter', icon: '🎯', name: 'のびしろハンター', category: 'growth', description: '成長単元を3つ発見', threshold: 3, thresholdLabel: '3単元' },
      { id: 'growth-retry', icon: '🔄', name: 'まちがい直し名人', category: 'growth', description: '5回リトライした', threshold: 5, thresholdLabel: '5回' },
      { id: 'growth-persistence', icon: '💪', name: 'ねばり強さバッジ', category: 'growth', description: '10回チャレンジした', threshold: 10, thresholdLabel: '10回' },
      { id: 'growth-overcome', icon: '🦸', name: '苦手克服チャレンジャー', category: 'growth', description: 'growthからcan_doに3つ変化', threshold: 3, thresholdLabel: '3単元' },
    ],
  },
  {
    key: 'juku',
    label: '塾連携系',
    badges: [
      { id: 'juku-go', icon: '🏫', name: '今日も塾へGO', category: 'juku', description: '塾に1回行った', threshold: 1, thresholdLabel: '1回' },
      { id: 'juku-review', icon: '📝', name: '塾のあと復習できた', category: 'juku', description: '塾の後に3回復習した', threshold: 3, thresholdLabel: '3回' },
      { id: 'juku-homework', icon: '✨', name: '宿題完了スター', category: 'juku', description: '宿題を5回完了した', threshold: 5, thresholdLabel: '5回' },
    ],
  },
];

function getProgressForBadge(badge: BadgeDef, state: AppState): number {
  const logs = Object.values(state.dailyLogs || {});
  const progress = Object.values(state.unitProgress || {});

  switch (badge.id) {
    case 'streak-1':
    case 'streak-3':
    case 'streak-7':
    case 'streak-10':
    case 'streak-20': {
      const studiedDays = logs.filter((l) => l.studied).length;
      return Math.min(studiedDays, badge.threshold);
    }
    case 'subject-math-elem':
      return progress.filter((p) => p.subjectId.includes('math') && p.status === 'can_do').length;
    case 'subject-math-jr':
      return progress.filter((p) => p.subjectId.includes('math') && p.status === 'can_do').length;
    case 'subject-japanese':
      return progress.filter((p) => p.subjectId.includes('japanese') && p.status === 'can_do').length;
    case 'subject-english':
      return progress.filter((p) => p.subjectId.includes('english') && p.status === 'can_do').length;
    case 'subject-science':
      return progress.filter((p) => p.subjectId.includes('science') && p.status === 'can_do').length;
    case 'subject-social':
      return progress.filter((p) => p.subjectId.includes('social') && p.status === 'can_do').length;
    case 'growth-hunter':
      return progress.filter((p) => p.status === 'growth').length;
    case 'growth-retry': {
      const retries = state.answerRecords?.filter((r) => r.retryScheduled && r.retryScheduled.length > 0).length || 0;
      return Math.min(retries, badge.threshold);
    }
    case 'growth-persistence': {
      const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
      return Math.min(totalAttempts, badge.threshold);
    }
    case 'growth-overcome':
      return progress.filter((p) => p.status === 'can_do' && p.attempts > 1).length;
    case 'juku-go':
      return Math.min(logs.filter((l) => l.juku).length, badge.threshold);
    case 'juku-review':
      return Math.min(logs.filter((l) => l.jukuReview).length, badge.threshold);
    case 'juku-homework':
      return Math.min(logs.filter((l) => l.missionsCompleted >= 3).length, badge.threshold);
    default:
      return 0;
  }
}

export default function BadgesPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);

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

  const earnedMap = new Map<string, EarnedBadge>();
  (state.earnedBadges || []).forEach((eb) => earnedMap.set(eb.badgeId, eb));

  const totalEarned = earnedMap.size;
  const totalBadges = BADGE_CATEGORIES.reduce((sum, c) => sum + c.badges.length, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 pt-10 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.push('/nobishiro/home')}
            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white text-lg"
          >
            ←
          </button>
          <h1 className="text-white text-xl font-bold">バッジコレクション</h1>
        </div>
        <div className="bg-white/15 rounded-xl px-4 py-3 text-center">
          <p className="text-white text-3xl font-bold">{totalEarned}<span className="text-base font-normal text-white/70"> / {totalBadges}</span></p>
          <p className="text-white/70 text-xs mt-1">獲得バッジ</p>
        </div>
      </div>

      <div className="px-5 -mt-3 space-y-6">
        {BADGE_CATEGORIES.map((category) => (
          <div key={category.key}>
            <h2 className="text-sm font-bold text-slate-600 mb-3 mt-4">{category.label}</h2>
            <div className="grid grid-cols-2 gap-3">
              {category.badges.map((badge) => {
                const earned = earnedMap.get(badge.id);
                const progress = getProgressForBadge(badge, state);
                const progressPct = Math.min(100, (progress / badge.threshold) * 100);

                return (
                  <div
                    key={badge.id}
                    className={`relative rounded-2xl p-4 transition-all ${
                      earned
                        ? 'bg-white border-2 border-amber-300 shadow-md'
                        : 'bg-white/60 border border-slate-200'
                    }`}
                    style={earned ? { boxShadow: '0 0 12px rgba(251, 191, 36, 0.3)' } : undefined}
                  >
                    {/* Sparkle for earned */}
                    {earned && (
                      <div className="absolute -top-1 -right-1 text-xs animate-pulse">✨</div>
                    )}

                    {/* Icon */}
                    <div className={`text-3xl mb-2 ${earned ? '' : 'grayscale opacity-40'}`}>
                      {earned ? badge.icon : '🔒'}
                    </div>

                    {/* Name */}
                    <p className={`text-sm font-bold mb-1 ${earned ? 'text-slate-800' : 'text-slate-400'}`}>
                      {badge.name}
                    </p>

                    {/* Description */}
                    <p className={`text-xs mb-2 ${earned ? 'text-slate-500' : 'text-slate-300'}`}>
                      {badge.description}
                    </p>

                    {/* Earned date or progress */}
                    {earned ? (
                      <p className="text-xs text-amber-600 font-medium">
                        {new Date(earned.earnedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} 獲得
                      </p>
                    ) : (
                      <div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full bg-gradient-to-r from-amber-300 to-orange-300 rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400">
                          あと少し（{progress}/{badge.threshold}）
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
