'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState } from '@/lib/nobishiro/types';

const STORAGE_KEY = 'nobishiro-quest';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

interface LineCategory {
  trigger: string;
  lines: string[];
}

const LINE_CATEGORIES: LineCategory[] = [
  {
    trigger: 'login',
    lines: [
      '今日も少しずつ進もう！',
      'おかえり！今日も冒険の続きだね',
      '今日の5分が、未来の自信になる',
      'まずはここに来たのがすごい！',
      'さあ、今日も一緒にがんばろう',
    ],
  },
  {
    trigger: 'streak',
    lines: [
      '{streak}日連続！すごい集中力！',
      'ここまで続けているの、すごい！',
      '毎日コツコツ、それが一番の力だよ',
      '続けること自体がすごいことなんだ',
      '{streak}日も続けてる！自分をほめよう！',
    ],
  },
  {
    trigger: 'badge',
    lines: [
      '新しいバッジゲット！成長してるね',
      'バッジが増えてきたね！',
      'がんばった証だね！すてきだよ',
      'ひとつずつ増えていくバッジ、大切にしよう',
    ],
  },
  {
    trigger: 'encouragement',
    lines: [
      '苦手が見つかったらレベルアップのチャンス！',
      '前より進んでるよ！',
      'まちがいは、のびしろ。',
      '苦手を見つけられたら、それは前進',
      'できた！が増える毎日にしよう！',
      '一歩ずつ、自分のペースでOK！',
      '全部できなくてもいい。やったことがえらい',
      '自分のいいところ、もっと見つけよう',
    ],
  },
];

export default function CharacterPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [displayLines, setDisplayLines] = useState<
    { trigger: string; text: string }[]
  >([]);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  const generateLines = useCallback(
    (appState: AppState) => {
      const lines: { trigger: string; text: string }[] = [];
      const streak = getStreak(appState);
      const badgeCount = appState.earnedBadges?.length || 0;
      const todayLog = appState.dailyLogs[getToday()];

      // Login line
      const loginLines = LINE_CATEGORIES.find((c) => c.trigger === 'login')!;
      lines.push({
        trigger: 'login',
        text: loginLines.lines[
          Math.floor(Math.random() * loginLines.lines.length)
        ],
      });

      // Streak lines
      if (streak >= 2) {
        const streakLines = LINE_CATEGORIES.find(
          (c) => c.trigger === 'streak'
        )!;
        const line =
          streakLines.lines[
            Math.floor(Math.random() * streakLines.lines.length)
          ];
        lines.push({
          trigger: 'streak',
          text: line.replace('{streak}', String(streak)),
        });
      }

      // Badge lines
      if (badgeCount > 0) {
        const badgeLines = LINE_CATEGORIES.find(
          (c) => c.trigger === 'badge'
        )!;
        lines.push({
          trigger: 'badge',
          text: badgeLines.lines[
            Math.floor(Math.random() * badgeLines.lines.length)
          ],
        });
      }

      // Encouragement
      const encourageLines = LINE_CATEGORIES.find(
        (c) => c.trigger === 'encouragement'
      )!;
      lines.push({
        trigger: 'encouragement',
        text: encourageLines.lines[
          Math.floor(Math.random() * encourageLines.lines.length)
        ],
      });

      // Extra encouragement if studied today
      if (todayLog?.studied) {
        lines.push({
          trigger: 'encouragement',
          text: '今日もがんばったね！えらい！',
        });
      }

      return lines;
    },
    []
  );

  const getStreak = (appState: AppState) => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const log = appState.dailyLogs[key];
      if (log?.studied) streak++;
      else if (i > 0) break;
    }
    return streak;
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) { router.replace('/mm'); return; }
      const s = JSON.parse(stored) as AppState;
      if (!s.currentUser) { router.replace('/mm'); return; }
      setState(s);
      setDisplayLines(generateLines(s));
    } catch { router.replace('/mm'); }
  }, [router, generateLines]);

  const refreshLine = (index: number) => {
    if (!state) return;
    const line = displayLines[index];
    const category = LINE_CATEGORIES.find((c) => c.trigger === line.trigger);
    if (!category) return;

    const streak = getStreak(state);
    let newText =
      category.lines[Math.floor(Math.random() * category.lines.length)];
    newText = newText.replace('{streak}', String(streak));

    const updated = [...displayLines];
    updated[index] = { ...updated[index], text: newText };
    setDisplayLines(updated);
    setTappedIndex(index);
    setTimeout(() => setTappedIndex(null), 500);
  };

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  const isMitsuki = state.currentUser === 'mitsuki';
  const characterEmoji = isMitsuki ? '🦉' : '🐱';
  const characterName = isMitsuki ? 'フクロウ先生' : 'ぼうけんネコ';
  const accentFrom = isMitsuki ? 'from-indigo-400' : 'from-emerald-400';
  const accentTo = isMitsuki ? 'to-purple-400' : 'to-teal-400';
  const bubbleBg = isMitsuki ? 'bg-indigo-50' : 'bg-emerald-50';
  const bubbleBorder = isMitsuki ? 'border-indigo-100' : 'border-emerald-100';
  const textColor = isMitsuki ? 'text-indigo-600' : 'text-emerald-600';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white pb-6">
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${accentFrom} ${accentTo} px-5 pt-10 pb-6 rounded-b-3xl`}
      >
        <button
          onClick={() => router.push('/mm/home')}
          className="text-white/80 text-sm mb-2"
        >
          ← ホームに戻る
        </button>
        <h1 className="text-white text-xl font-bold">
          {characterName}のことば
        </h1>
        <p className="text-white/70 text-sm mt-1">
          タップすると別のことばが聞けるよ
        </p>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {/* Character Display */}
        <div className="flex flex-col items-center py-6">
          <div className="text-7xl mb-2 animate-pulse">{characterEmoji}</div>
          <p className={`text-sm font-bold ${textColor}`}>{characterName}</p>
        </div>

        {/* Speech Bubbles */}
        <div className="space-y-3">
          {displayLines.map((line, i) => (
            <button
              key={`${line.trigger}-${i}`}
              onClick={() => refreshLine(i)}
              className={`w-full text-left ${bubbleBg} ${bubbleBorder} border rounded-2xl p-4 shadow-sm transition-all active:scale-[0.98] ${
                tappedIndex === i ? 'scale-[1.02] shadow-md' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0 mt-0.5">
                  {line.trigger === 'login' && '👋'}
                  {line.trigger === 'streak' && '🔥'}
                  {line.trigger === 'badge' && '🏅'}
                  {line.trigger === 'encouragement' && '💫'}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-1">
                    {line.trigger === 'login' && 'あいさつ'}
                    {line.trigger === 'streak' && '連続記録'}
                    {line.trigger === 'badge' && 'バッジ'}
                    {line.trigger === 'encouragement' && '応援'}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {line.text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Refresh All */}
        <button
          onClick={() => state && setDisplayLines(generateLines(state))}
          className={`w-full bg-gradient-to-r ${accentFrom} ${accentTo} text-white rounded-2xl py-4 text-sm font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all`}
        >
          ぜんぶ新しいことばにする
        </button>

        {/* Hint */}
        <p className="text-center text-xs text-slate-400">
          それぞれの吹き出しをタップしても、新しいことばが聞けるよ
        </p>
      </div>
    </div>
  );
}
