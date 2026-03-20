'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState } from '@/lib/nobishiro/types';

const STORAGE_KEY = 'nobishiro-quest';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

const SUBJECT_OPTIONS = [
  '算数',
  '数学',
  '国語',
  '英語',
  '理科',
  '社会',
  'その他',
];

export default function JukuPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState | null>(null);
  const [checked, setChecked] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [difficult, setDifficult] = useState('');
  const [nextCheck, setNextCheck] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) { router.replace('/mm'); return; }
      const s = JSON.parse(stored) as AppState;
      setState(s);
      const todayLog = s.dailyLogs[getToday()];
      if (todayLog?.juku) setChecked(true);
      if (todayLog?.jukuReview) {
        setSelectedSubjects(
          todayLog.jukuReview.subject
            ? todayLog.jukuReview.subject.split(',')
            : []
        );
        setDifficult(todayLog.jukuReview.difficult || '');
        setNextCheck(todayLog.jukuReview.nextCheck || '');
      }
    } catch { router.replace('/mm'); }
  }, [router]);

  const handleJukuCheck = () => {
    if (!state) return;
    const todayKey = getToday();
    const updated: AppState = {
      ...state,
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
          juku: true,
        },
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setState(updated);
    setChecked(true);
  };

  const toggleSubject = (sub: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleSaveReview = () => {
    if (!state) return;
    const todayKey = getToday();
    const updated: AppState = {
      ...state,
      dailyLogs: {
        ...state.dailyLogs,
        [todayKey]: {
          ...state.dailyLogs[todayKey],
          jukuReview: {
            subject: selectedSubjects.join(','),
            difficult,
            nextCheck,
          },
          studied: true,
        },
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setState(updated);
    setSaved(true);
    setTimeout(() => router.push('/nobishiro/home'), 2000);
  };

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  const todayLog = state.dailyLogs[getToday()];
  const alreadyChecked = todayLog?.juku && !checked;

  if (saved) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <div className="text-6xl mb-4 animate-bounce">🏫</div>
          <h2 className="text-xl font-bold text-indigo-600 mb-2">
            塾の記録を保存しました！
          </h2>
          <p className="text-sm text-slate-500 text-center">
            今日もおつかれさま。ホームに戻ります...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-400 px-5 pt-10 pb-6 rounded-b-3xl">
        <button
          onClick={() => router.push('/nobishiro/home')}
          className="text-white/80 text-sm mb-2"
        >
          ← ホームに戻る
        </button>
        <h1 className="text-white text-xl font-bold">塾チェック</h1>
        <p className="text-white/70 text-sm mt-1">塾の記録をつけよう</p>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {/* Already Checked Today */}
        {alreadyChecked && !showReview && (
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-lg font-bold text-slate-700 mb-2">
              今日はもう塾チェック済み！
            </h2>
            <p className="text-sm text-slate-400 mb-4">おつかれさま！</p>
            <button
              onClick={() => setShowReview(true)}
              className="bg-blue-100 text-blue-600 px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              記録を編集する
            </button>
          </div>
        )}

        {/* Juku Check Button */}
        {!checked && !alreadyChecked && (
          <button
            onClick={handleJukuCheck}
            className="w-full bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
          >
            <div className="text-5xl mb-4">🏫</div>
            <p className="text-xl font-bold">今日は塾に行った</p>
            <p className="text-white/70 text-sm mt-2">タップして記録する</p>
          </button>
        )}

        {/* After Check - Prompt for Review */}
        {checked && !showReview && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-lg font-bold text-slate-700 mb-2">
                今日も塾おつかれさま！
              </h2>
              <p className="text-sm text-slate-500">
                このまま1分だけ復習すると追加ポイント！
              </p>
            </div>

            <button
              onClick={() => setShowReview(true)}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl p-5 text-center shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
            >
              <p className="text-lg font-bold">1分だけ復習する</p>
              <p className="text-white/70 text-sm mt-1">
                追加ポイントがもらえるよ
              </p>
            </button>

            <button
              onClick={() => router.push('/nobishiro/home')}
              className="w-full py-3 text-slate-400 text-sm"
            >
              スキップしてホームに戻る
            </button>
          </div>
        )}

        {/* Review Form */}
        {showReview && (
          <div className="space-y-4">
            {/* Subject Selection */}
            <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
              <h2 className="text-sm font-bold text-blue-500 mb-3">
                今日やった教科
              </h2>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_OPTIONS.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => toggleSubject(sub)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                      selectedSubjects.includes(sub)
                        ? 'bg-blue-400 text-white'
                        : 'bg-blue-50 text-slate-600 hover:bg-blue-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficult Parts */}
            <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
              <h2 className="text-sm font-bold text-blue-500 mb-3">
                難しかったところ
              </h2>
              <textarea
                value={difficult}
                onChange={(e) => setDifficult(e.target.value)}
                placeholder="例: 一次方程式の文章題"
                rows={3}
                className="w-full bg-blue-50 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 border-none outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
            </div>

            {/* Next Check */}
            <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
              <h2 className="text-sm font-bold text-blue-500 mb-3">
                明日確認したいこと
              </h2>
              <textarea
                value={nextCheck}
                onChange={(e) => setNextCheck(e.target.value)}
                placeholder="例: 文章題の解き方をもう一度見直す"
                rows={3}
                className="w-full bg-blue-50 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 border-none outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveReview}
              className="w-full bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-2xl py-4 text-lg font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
            >
              記録する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
