'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState, UnitProgress } from '@/lib/nobishiro/types';

const STORAGE_KEY = 'nobishiro-quest';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

const VOICE_SUGGESTIONS = [
  '苦手を見つけられたのが前進だね',
  '続けているのがすごいね',
  '自分でふりかえりできたのがえらいね',
  '塾のあとに復習しているのがすごい',
  '一歩ずつ成長しているね',
  '今日もがんばったね',
  '自分のペースで進められているね',
  '昨日の自分より進んでいるよ',
];

const STAMPS = ['👏', '🎉', '💪', '❤️', '⭐'];

export default function ParentPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [view, setView] = useState<'parent' | 'child'>('parent');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) { router.replace('/mm'); return; }
      const s = JSON.parse(stored) as AppState;
      setState(s);
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

  const getGrowthUnits = useCallback(() => {
    if (!state) return [];
    return Object.values(state.unitProgress).filter(
      (u: UnitProgress) => u.status === 'growth'
    );
  }, [state]);

  const generatePraisePoints = useCallback(() => {
    if (!state) return [];
    const points: string[] = [];
    const todayLog = state.dailyLogs[getToday()];
    const streak = getStreak();
    const growthUnits = getGrowthUnits();

    if (todayLog?.studied) points.push('今日も学習に取り組みました');
    if (todayLog?.missionsCompleted && todayLog.missionsCompleted > 0)
      points.push(`ミッションを${todayLog.missionsCompleted}つクリアしました`);
    if (todayLog?.juku) points.push('塾に行って、がんばりました');
    if (todayLog?.reflection) points.push('自分でふりかえりができました');
    if (streak >= 3) points.push(`${streak}日連続で続けています`);
    if (growthUnits.length > 0)
      points.push(`のびしろ単元を${growthUnits.length}つ見つけました`);
    if (points.length === 0) points.push('アプリを開いたことが第一歩です');

    return points;
  }, [state, getStreak, getGrowthUnits]);

  const sendQuickStamp = (stamp: string) => {
    if (!state) return;
    const newComment = {
      id: `stamp-${Date.now()}`,
      text: stamp,
      type: 'stamp' as const,
      createdAt: new Date().toISOString(),
    };
    const todayKey = getToday();
    const updated: AppState = {
      ...state,
      parentComments: [...state.parentComments, newComment],
      dailyLogs: {
        ...state.dailyLogs,
        [todayKey]: {
          ...(state.dailyLogs[todayKey] || {
            date: todayKey,
            studied: false,
            juku: false,
            missionsCompleted: 0,
            badgesEarned: [],
            parentCommented: false,
          }),
          parentCommented: true,
        },
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setState(updated);
  };

  const toggleJuku = () => {
    if (!state) return;
    const todayKey = getToday();
    const currentLog = state.dailyLogs[todayKey];
    const updated: AppState = {
      ...state,
      dailyLogs: {
        ...state.dailyLogs,
        [todayKey]: {
          ...(currentLog || {
            date: todayKey,
            studied: false,
            juku: false,
            missionsCompleted: 0,
            badgesEarned: [],
            parentCommented: false,
          }),
          juku: !currentLog?.juku,
        },
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setState(updated);
  };

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  const todayLog = state.dailyLogs[getToday()];
  const streak = getStreak();
  const badgeCount = state.earnedBadges?.length || 0;
  const growthUnits = getGrowthUnits();
  const praisePoints = generatePraisePoints();
  const isMitsuki = state.currentUser === 'mitsuki';
  const userName = isMitsuki ? 'みつき' : 'みちる';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-400 to-pink-400 px-5 pt-10 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.push('/mm/home')}
            className="text-white/80 text-sm"
          >
            ← ホームに戻る
          </button>
        </div>
        <h1 className="text-white text-xl font-bold">おうちの方の画面</h1>
        <p className="text-white/70 text-sm mt-1">
          {userName}のがんばりを見守りましょう
        </p>

        {/* View Toggle */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setView('parent')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === 'parent'
                ? 'bg-white text-rose-500'
                : 'bg-white/20 text-white'
            }`}
          >
            親の画面
          </button>
          <button
            onClick={() => setView('child')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === 'child'
                ? 'bg-white text-rose-500'
                : 'bg-white/20 text-white'
            }`}
          >
            子どもの画面
          </button>
        </div>
      </div>

      {view === 'child' ? (
        <div className="px-5 mt-4">
          <div className="bg-white rounded-2xl border border-rose-100 p-5 text-center">
            <p className="text-slate-500 text-sm mb-3">
              子どもの画面を確認するには
            </p>
            <button
              onClick={() => router.push('/mm/home')}
              className="bg-rose-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-500 transition-colors"
            >
              ホーム画面へ移動
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5 -mt-3 space-y-4">
          {/* 1. できたこと - Today's Activity Summary */}
          <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
            <h2 className="text-sm font-bold text-rose-500 mb-3 flex items-center gap-2">
              <span>🌸</span> 今日やったこと
            </h2>
            {todayLog?.studied ? (
              <div className="space-y-2">
                {todayLog.missionsCompleted > 0 && (
                  <p className="text-sm text-slate-700">
                    ミッションを{todayLog.missionsCompleted}つクリア
                  </p>
                )}
                {todayLog.juku && (
                  <p className="text-sm text-slate-700">塾に行きました</p>
                )}
                {todayLog.reflection && (
                  <div className="bg-rose-50 rounded-xl p-3 mt-2">
                    <p className="text-xs text-rose-400 font-medium mb-1">
                      ふりかえり
                    </p>
                    <p className="text-sm text-slate-600">
                      できたこと: {todayLog.reflection.done}
                    </p>
                    <p className="text-sm text-slate-600">
                      のびしろ: {todayLog.reflection.growth}
                    </p>
                    <p className="text-sm text-slate-600">
                      あした: {todayLog.reflection.tomorrow}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                まだ今日の記録はありません
              </p>
            )}
          </div>

          {/* 2. 続けたこと - Streak & Badges */}
          <div className="flex gap-3">
            <div className="flex-1 bg-white rounded-2xl border border-rose-100 p-4 shadow-sm text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xl font-bold text-slate-700">{streak}日</div>
              <div className="text-xs text-slate-400">連続記録</div>
            </div>
            <div className="flex-1 bg-white rounded-2xl border border-rose-100 p-4 shadow-sm text-center">
              <div className="text-2xl mb-1">🏅</div>
              <div className="text-xl font-bold text-slate-700">
                {badgeCount}個
              </div>
              <div className="text-xs text-slate-400">バッジ数</div>
            </div>
            <div className="flex-1 bg-white rounded-2xl border border-rose-100 p-4 shadow-sm text-center">
              <div className="text-2xl mb-1">🏫</div>
              <div className="text-xl font-bold text-slate-700">
                {todayLog?.juku ? '出席' : '未'}
              </div>
              <div className="text-xs text-slate-400">塾</div>
            </div>
          </div>

          {/* 3. 苦手発見 - のびしろ単元 */}
          <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
            <h2 className="text-sm font-bold text-rose-500 mb-3 flex items-center gap-2">
              <span>🌱</span> のびしろ単元（ここを見つけられた！）
            </h2>
            {growthUnits.length > 0 ? (
              <div className="space-y-2">
                {growthUnits.slice(0, 5).map((u) => (
                  <div
                    key={u.unitId}
                    className="flex items-center gap-2 bg-rose-50 rounded-xl px-3 py-2"
                  >
                    <span className="text-amber-500 text-sm">🌱</span>
                    <span className="text-sm text-slate-600">{u.unitId}</span>
                    <span className="text-xs text-slate-400 ml-auto">
                      {u.attempts}回挑戦
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                まだのびしろ単元はありません
              </p>
            )}
          </div>

          {/* 4. 気分 */}
          {todayLog?.mood && (
            <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
              <h2 className="text-sm font-bold text-rose-500 mb-2 flex items-center gap-2">
                <span>💭</span> 今日の気分
              </h2>
              <p className="text-lg">{todayLog.mood}</p>
            </div>
          )}

          {/* 5. ほめポイント & おすすめの声かけ */}
          <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-4">
            <h2 className="text-sm font-bold text-rose-600 mb-3 flex items-center gap-2">
              <span>✨</span> 今日のほめポイント
            </h2>
            <div className="space-y-2 mb-4">
              {praisePoints.map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 text-sm mt-0.5">●</span>
                  <span className="text-sm text-slate-700">{p}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xs font-bold text-rose-500 mb-2">
              おすすめの声かけ
            </h3>
            <div className="space-y-2">
              {VOICE_SUGGESTIONS.slice(0, 3).map((s, i) => (
                <div
                  key={i}
                  className="bg-white/70 rounded-xl px-3 py-2 text-sm text-slate-600"
                >
                  「{s}」
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Quick Stamps */}
            <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
              <h2 className="text-sm font-bold text-rose-500 mb-3">
                応援スタンプ送信
              </h2>
              <div className="flex gap-3 justify-center">
                {STAMPS.map((stamp) => (
                  <button
                    key={stamp}
                    onClick={() => sendQuickStamp(stamp)}
                    className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-2xl hover:bg-rose-100 active:scale-90 transition-all"
                  >
                    {stamp}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/mm/parent/comment')}
                className="bg-white rounded-2xl border border-rose-100 p-4 text-left shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
              >
                <div className="text-2xl mb-2">💌</div>
                <p className="text-sm font-bold text-slate-700">
                  コメント送信
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  応援メッセージを送る
                </p>
              </button>
              <button
                onClick={() => router.push('/mm/rewards')}
                className="bg-white rounded-2xl border border-rose-100 p-4 text-left shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
              >
                <div className="text-2xl mb-2">🎁</div>
                <p className="text-sm font-bold text-slate-700">ごほうび付与</p>
                <p className="text-xs text-slate-400 mt-1">
                  ごほうびを設定する
                </p>
              </button>
            </div>

            {/* Juku Toggle */}
            <button
              onClick={toggleJuku}
              className={`w-full rounded-2xl p-4 text-left shadow-sm transition-all active:scale-[0.98] ${
                todayLog?.juku
                  ? 'bg-rose-400 text-white'
                  : 'bg-white border border-rose-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏫</span>
                  <div>
                    <p className="text-sm font-bold">塾出席チェック</p>
                    <p
                      className={`text-xs mt-0.5 ${
                        todayLog?.juku ? 'text-white/70' : 'text-slate-400'
                      }`}
                    >
                      {todayLog?.juku
                        ? '出席済み（タップで取消）'
                        : 'タップで出席記録'}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${
                    todayLog?.juku ? 'bg-white/30 justify-end' : 'bg-slate-200'
                  }`}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow" />
                </div>
              </div>
            </button>

            {/* Family Mission */}
            <button
              onClick={() => router.push('/mm/family-mission')}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-2xl p-4 text-left shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👨‍👩‍👧</span>
                <div>
                  <p className="text-sm font-bold">親子ミッション</p>
                  <p className="text-xs text-white/70 mt-0.5">
                    一緒にチャレンジしよう
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
