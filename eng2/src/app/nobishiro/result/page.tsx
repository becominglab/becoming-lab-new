'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AppState, EarnedBadge } from '@/lib/nobishiro/types';
import { BADGES, QUESTIONS } from '@/lib/nobishiro/data';
import {
  getState,
  completeMission,
  checkAndAwardBadges,
  getStreak,
} from '@/lib/nobishiro/store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function getEncouragingMessage(correct: number, total: number): { text: string; emoji: string } {
  if (total === 0) return { text: 'おつかれさま！', emoji: '🌈' };
  if (correct === total) return { text: 'パーフェクト！すごい！🎉', emoji: '🎉' };
  if (correct >= total * 0.7) return { text: `いい感じ！${correct}問もできた！`, emoji: '✨' };
  if (correct >= 1) return { text: `苦手を${total - correct}つ発見できた！それも成長！`, emoji: '🌱' };
  return { text: 'のびしろたくさん発見！これからが楽しみ！', emoji: '🚀' };
}

function getNobishiroUnits(state: AppState, subject: string): string[] {
  const incorrectQIds = new Set(
    state.answerRecords.filter((r) => !r.correct).map((r) => r.questionId),
  );
  const units = new Set<string>();
  for (const q of QUESTIONS) {
    if (q.subject === subject && incorrectQIds.has(q.id)) {
      units.add(q.unit);
    }
  }
  return Array.from(units);
}

function getRecommendedUnit(state: AppState, subject: string): string | null {
  const nobishiro = getNobishiroUnits(state, subject);
  return nobishiro.length > 0 ? nobishiro[0] : null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ResultPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const correct = parseInt(searchParams.get('correct') || '0', 10);
  const total = parseInt(searchParams.get('total') || '0', 10);
  const subject = searchParams.get('subject') || '';

  const [state, setState] = useState<AppState | null>(null);
  const [newBadges, setNewBadges] = useState<EarnedBadge[]>([]);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mounted, setMounted] = useState(false);

  // On mount: update state with results
  useEffect(() => {
    const prevState = getState();
    if (!prevState.currentUser) {
      router.replace('/mm');
      return;
    }

    const prevPoints = prevState.totalPoints;
    const prevBadgeIds = new Set(prevState.earnedBadges.map((b) => b.badgeId));

    // Complete mission and check for badges
    let nextState = completeMission(prevState, 'quiz');
    nextState = checkAndAwardBadges(nextState);

    // Update daily log with today's badge
    const todayStr = today();
    const todayLog = nextState.dailyLogs[todayStr];
    if (todayLog) {
      const newBadgeIds = nextState.earnedBadges
        .filter((b) => !prevBadgeIds.has(b.badgeId))
        .map((b) => b.badgeId);
      nextState = {
        ...nextState,
        dailyLogs: {
          ...nextState.dailyLogs,
          [todayStr]: {
            ...todayLog,
            badgesEarned: [...(todayLog.badgesEarned || []), ...newBadgeIds],
          },
        },
      };
    }

    setState(nextState);
    setPointsEarned(nextState.totalPoints - prevPoints);
    setNewBadges(nextState.earnedBadges.filter((b) => !prevBadgeIds.has(b.badgeId)));

    // Trigger celebration for good scores
    if (correct >= total * 0.7 && total > 0) {
      setShowCelebration(true);
    }

    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMitsuki = state?.currentUser === 'mitsuki';
  const streak = state ? getStreak(state) : 0;
  const message = useMemo(() => getEncouragingMessage(correct, total), [correct, total]);
  const recommendedUnit = state ? getRecommendedUnit(state, subject) : null;
  const nobishiroUnits = state ? getNobishiroUnits(state, subject) : [];

  // Theme colors
  const accentText = isMitsuki ? 'text-indigo-600' : 'text-emerald-600';
  const accentBgLight = isMitsuki ? 'bg-indigo-50' : 'bg-emerald-50';
  const accentBorder = isMitsuki ? 'border-indigo-100' : 'border-emerald-100';
  const gradFrom = isMitsuki ? 'from-indigo-500' : 'from-emerald-500';
  const gradTo = isMitsuki ? 'to-slate-600' : 'to-teal-500';
  const accentBgMedium = isMitsuki ? 'bg-indigo-100' : 'bg-emerald-100';

  if (!mounted || !state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-8 relative overflow-hidden">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                fontSize: `${16 + Math.random() * 16}px`,
              }}
            >
              {['⭐', '🌟', '✨', '💫', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className={`bg-gradient-to-r ${gradFrom} ${gradTo} px-5 pt-10 pb-8 rounded-b-3xl text-center`}>
        <p className="text-white/80 text-sm mb-2">ミッション完了！</p>
        <div className="text-6xl mb-3">{message.emoji}</div>
        <h1 className="text-white text-xl font-bold mb-1">{message.text}</h1>
        {subject && (
          <p className="text-white/70 text-sm">{subject}</p>
        )}
      </div>

      <div className="px-5 -mt-4 space-y-4">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* 正解数 */}
            <div>
              <div className={`text-3xl font-bold ${accentText}`}>
                {correct}<span className="text-lg text-slate-400">/{total}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">正解数</p>
            </div>
            {/* 今日のポイント */}
            <div>
              <div className="text-3xl font-bold text-amber-500">
                +{pointsEarned}
              </div>
              <p className="text-xs text-slate-500 mt-1">今日のポイント</p>
            </div>
            {/* 合計ポイント */}
            <div>
              <div className="text-3xl font-bold text-slate-700">
                {state.totalPoints}
              </div>
              <p className="text-xs text-slate-500 mt-1">合計ポイント</p>
            </div>
          </div>

          {/* Score bar */}
          <div className="mt-4">
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${gradFrom} ${gradTo} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${total > 0 ? (correct / total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">
              {total}問中{correct}問正解
            </p>
          </div>
        </div>

        {/* New Badges */}
        {newBadges.length > 0 && (
          <div className={`${accentBgLight} border ${accentBorder} rounded-2xl p-5`}>
            <p className={`text-sm font-bold ${accentText} mb-3`}>
              🏅 新しいバッジを獲得！
            </p>
            <div className="space-y-3">
              {newBadges.map((earned) => {
                const badge = BADGES.find((b) => b.id === earned.badgeId);
                if (!badge) return null;
                return (
                  <div
                    key={earned.badgeId}
                    className="flex items-center gap-3 bg-white rounded-xl p-3 animate-pulse"
                  >
                    <div className="text-3xl animate-spin" style={{ animationDuration: '3s' }}>
                      {badge.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">{badge.name}</p>
                      <p className="text-xs text-slate-500">{badge.description}</p>
                    </div>
                    <div className="ml-auto text-lg">✨</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Streak */}
        {streak > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4 text-center">
            <p className="text-2xl mb-1">🔥</p>
            <p className="text-sm font-bold text-orange-600">
              {streak}日連続でえらい！
            </p>
            <p className="text-xs text-orange-400 mt-1">
              毎日コツコツ、その調子！
            </p>
          </div>
        )}

        {/* のびしろ発見 */}
        {nobishiroUnits.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <p className="text-sm font-bold text-slate-700 mb-3">
              🌱 発見したのびしろ単元
            </p>
            <div className="flex flex-wrap gap-2">
              {nobishiroUnits.map((unit) => (
                <span
                  key={unit}
                  className={`${accentBgMedium} ${accentText} text-xs font-medium px-3 py-1.5 rounded-full`}
                >
                  {unit}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              のびしろ = 伸びるところ。次にチャレンジすればもっとできるよ！
            </p>
          </div>
        )}

        {/* Next Recommendation */}
        {recommendedUnit && (
          <div className={`${accentBgLight} border ${accentBorder} rounded-2xl p-4`}>
            <p className="text-xs text-slate-500 mb-1">次のおすすめ</p>
            <p className={`text-sm font-bold ${accentText}`}>
              次は「{recommendedUnit}のもう1回」に挑戦しよう
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => router.push('/nobishiro/mission')}
            className={`w-full bg-gradient-to-r ${gradFrom} ${gradTo} text-white rounded-2xl py-4 text-base font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all`}
          >
            🎯 もう1回やる
          </button>
          <button
            onClick={() => router.push('/nobishiro/home')}
            className={`w-full ${accentBgLight} ${accentText} border ${accentBorder} rounded-2xl py-4 text-base font-bold hover:opacity-90 active:scale-[0.98] transition-all`}
          >
            🏠 今日はここまで
          </button>
          <button
            onClick={() => router.push('/nobishiro/parent')}
            className="w-full bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 text-pink-600 rounded-2xl py-4 text-base font-bold hover:opacity-90 active:scale-[0.98] transition-all"
          >
            💌 親に見せる
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin text-2xl">🌀</div></div>}>
      <ResultPageInner />
    </Suspense>
  );
}
