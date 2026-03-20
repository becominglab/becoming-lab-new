'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState } from '@/lib/nobishiro/types';

const CHARACTER_LINES = [
  '今日も少しずつ進もう！',
  '苦手が見つかったらレベルアップのチャンス！',
  'その調子！',
  '前より進んでるよ！',
  'ここまで続けているの、すごい！',
  '今日の5分が、未来の自信になる。',
  'できた！が増える春休みにしよう！',
  '苦手を見つけられたら、それは前進。',
  'まちがいは、のびしろ。',
  '一歩ずつ、自分のペースでOK！',
];

const GREETINGS: Record<string, string> = {
  morning: 'おはよう！今日もがんばろう',
  afternoon: 'こんにちは！午後もファイト',
  evening: 'おつかれさま！今日もえらい',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return GREETINGS.morning;
  if (h < 17) return GREETINGS.afternoon;
  return GREETINGS.evening;
}

function getRandomLine() {
  return CHARACTER_LINES[Math.floor(Math.random() * CHARACTER_LINES.length)];
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export default function HomePage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [characterLine, setCharacterLine] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nobishiro-quest');
      if (!stored) { router.replace('/mm'); return; }
      const s = JSON.parse(stored) as AppState;
      if (!s.currentUser) { router.replace('/mm'); return; }
      setState(s);
      setCharacterLine(getRandomLine());
    } catch { router.replace('/mm'); }
  }, [router]);

  const getStreak = useCallback(() => {
    if (!state) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const log = state.dailyLogs[key];
      if (log?.studied) streak++;
      else if (i > 0) break;
    }
    return streak;
  }, [state]);

  const getBadgeCount = useCallback(() => {
    return state?.earnedBadges?.length || 0;
  }, [state]);

  const getNextReward = useCallback(() => {
    if (!state) return null;
    return state.rewards?.find((r) => !r.claimed) || null;
  }, [state]);

  const todayLog = state?.dailyLogs[getToday()];
  const latestComment = state?.parentComments?.slice(-1)[0];
  const isMitsuki = state?.currentUser === 'mitsuki';
  const userName = isMitsuki ? 'みつき' : 'みちる';

  if (!state) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin text-2xl">🌀</div></div>;

  const streak = getStreak();
  const badgeCount = getBadgeCount();
  const nextReward = getNextReward();
  const missionsToday = todayLog?.missionsCompleted || 0;

  const gradFrom = isMitsuki ? 'from-indigo-500' : 'from-emerald-500';
  const gradTo = isMitsuki ? 'to-slate-600' : 'to-teal-500';

  return (
    <div className="flex flex-col min-h-screen pb-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradFrom} ${gradTo} px-5 pt-10 pb-6 rounded-b-3xl`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm">{getGreeting()}</p>
            <h1 className="text-white text-xl font-bold">{userName}の冒険</h1>
          </div>
          <button
            onClick={() => router.push('/nobishiro/settings')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white"
          >
            ⚙️
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 text-center">
            <div className="text-white text-xl font-bold">{streak}</div>
            <div className="text-white/70 text-xs">連続日数</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 text-center">
            <div className="text-white text-xl font-bold">{badgeCount}</div>
            <div className="text-white/70 text-xs">バッジ</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 text-center">
            <div className="text-white text-xl font-bold">{missionsToday}</div>
            <div className="text-white/70 text-xs">今日のクリア</div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        {/* Character Bubble */}
        {state.settings.characterOn && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-start gap-3">
            <div className="text-3xl">{isMitsuki ? '🦉' : '🐱'}</div>
            <div className="flex-1">
              <p className="text-sm text-slate-700 leading-relaxed">{characterLine}</p>
            </div>
          </div>
        )}

        {/* Today's Mission CTA */}
        <button
          onClick={() => router.push('/nobishiro/mission')}
          className={`w-full bg-gradient-to-r ${gradFrom} ${gradTo} text-white rounded-2xl p-5 text-left shadow-lg hover:shadow-xl active:scale-[0.98] transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs font-medium mb-1">今日のミッション</p>
              <p className="text-lg font-bold">
                {isMitsuki ? '数学3問 / 国語3問 / ふりかえり1分' : '算数3問 / 国語3問 / ふりかえり1分'}
              </p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </button>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push('/nobishiro/map')}
            className="bg-white rounded-2xl border border-slate-100 p-4 text-left shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
          >
            <div className="text-2xl mb-2">🗺️</div>
            <p className="text-sm font-bold text-slate-700">学習マップ</p>
            <p className="text-xs text-slate-400 mt-1">苦手だけ復習する</p>
          </button>
          <button
            onClick={() => router.push('/nobishiro/juku')}
            className="bg-white rounded-2xl border border-slate-100 p-4 text-left shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
          >
            <div className="text-2xl mb-2">🏫</div>
            <p className="text-sm font-bold text-slate-700">塾に行った</p>
            <p className="text-xs text-slate-400 mt-1">塾の記録をつける</p>
          </button>
          <button
            onClick={() => router.push('/nobishiro/badges')}
            className="bg-white rounded-2xl border border-slate-100 p-4 text-left shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
          >
            <div className="text-2xl mb-2">🏅</div>
            <p className="text-sm font-bold text-slate-700">バッジを見る</p>
            <p className="text-xs text-slate-400 mt-1">{badgeCount}個ゲット中</p>
          </button>
          <button
            onClick={() => router.push('/nobishiro/calendar')}
            className="bg-white rounded-2xl border border-slate-100 p-4 text-left shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
          >
            <div className="text-2xl mb-2">📅</div>
            <p className="text-sm font-bold text-slate-700">カレンダー</p>
            <p className="text-xs text-slate-400 mt-1">春休みの地図</p>
          </button>
        </div>

        {/* Next Reward */}
        {nextReward && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎁</div>
              <div className="flex-1">
                <p className="text-xs text-amber-600 font-medium">次のごほうび</p>
                <p className="text-sm font-bold text-slate-700">{nextReward.name}</p>
                <div className="mt-2 h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (badgeCount / nextReward.badgesRequired) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-amber-500 mt-1">
                  あと{Math.max(0, nextReward.badgesRequired - badgeCount)}バッジ
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Parent Comment */}
        {latestComment && (
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💌</div>
              <div>
                <p className="text-xs text-pink-500 font-medium mb-1">親からのコメント</p>
                <p className="text-sm text-slate-700">{latestComment.text}</p>
              </div>
            </div>
          </div>
        )}

        {/* Streak message */}
        {streak > 0 && (
          <div className="text-center py-2">
            <p className="text-sm text-slate-500">
              🔥 {streak}日連続でがんばっている！えらい！
            </p>
          </div>
        )}

        {/* Bottom Nav */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => router.push('/nobishiro/parent')}
            className="flex-1 py-3 bg-slate-100 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            👨‍👩‍👧 親の画面
          </button>
          <button
            onClick={() => router.push('/nobishiro/rewards')}
            className="flex-1 py-3 bg-slate-100 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            🎁 ごほうび
          </button>
        </div>
      </div>
    </div>
  );
}
