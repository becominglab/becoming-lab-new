'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AppState, UserType, UnitStatus } from '@/lib/nobishiro/types';

interface SubjectDef {
  id: string;
  name: string;
  units: string[];
}

const SUBJECT_DATA: Record<UserType, SubjectDef[]> = {
  mitsuki: [
    { id: 'math', name: '数学', units: ['正負の数', '文字式', '一次方程式', '連立方程式', '一次関数', '図形', '確率', '資料の活用'] },
    { id: 'english', name: '英語', units: ['be動詞', '一般動詞', '助動詞', '過去形', '進行形', '不定詞', '動名詞', '比較', '基本文法', '単語'] },
    { id: 'japanese', name: '国語', units: ['漢字', '文法', '説明文', '物語文', '古文の基礎'] },
    { id: 'science', name: '理科', units: ['物質', '化学変化', '電流', '光・音', '生物', '地学の基礎'] },
    { id: 'social', name: '社会', units: ['地理', '歴史', '公民の入口'] },
  ],
  michiru: [
    { id: 'math', name: '算数', units: ['小数', '分数', '割合', '速さ', '面積', '体積', '図形', '規則性', '場合の数の基礎'] },
    { id: 'japanese', name: '国語', units: ['漢字', '語彙', 'ことわざ', '慣用句', '説明文', '物語文', '主語述語', '接続語', '要旨'] },
    { id: 'science', name: '理科', units: ['植物', '動物', '天気', '水の変化', 'てこ', '電気', '月と星'] },
    { id: 'social', name: '社会', units: ['日本の地理', '都道府県', '産業', '歴史人物基礎', '日本のくらし', '政治の入口'] },
  ],
};

const SUBJECT_ICONS: Record<string, string> = {
  math: '🔢',
  english: '🔤',
  japanese: '📖',
  science: '🔬',
  social: '🌏',
};

// Island visual stages based on completion percentage
const ISLAND_STAGES = [
  { threshold: 0, emoji: '🌫️', label: '霧の島' },
  { threshold: 10, emoji: '🏝️', label: '発見した島' },
  { threshold: 30, emoji: '🌴', label: '緑の芽吹き' },
  { threshold: 60, emoji: '🏡', label: '育つ村' },
  { threshold: 90, emoji: '🏰', label: '栄える島' },
  { threshold: 100, emoji: '✨', label: '完全制覇' },
];

function getIslandStage(pct: number) {
  let stage = ISLAND_STAGES[0];
  for (const s of ISLAND_STAGES) {
    if (pct >= s.threshold) stage = s;
  }
  return stage;
}

function getUnitStatus(state: AppState, subjectId: string, unitName: string): UnitStatus {
  const key = `${subjectId}:${unitName}`;
  return state.unitProgress[key]?.status || 'unchecked';
}

export default function MapPage() {
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

  if (!state || !state.currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  const user = state.currentUser;
  const isMitsuki = user === 'mitsuki';
  const subjects = SUBJECT_DATA[user];

  const accentBg = isMitsuki ? 'bg-indigo-500' : 'bg-emerald-500';
  const accentText = isMitsuki ? 'text-indigo-600' : 'text-emerald-600';
  const accentBorder = isMitsuki ? 'border-indigo-200' : 'border-emerald-200';
  const accentLight = isMitsuki ? 'bg-indigo-50' : 'bg-emerald-50';
  const gradFrom = isMitsuki ? 'from-indigo-500' : 'from-emerald-500';
  const gradTo = isMitsuki ? 'to-slate-600' : 'to-teal-500';

  function getSubjectStats(subject: SubjectDef) {
    let growthCount = 0;
    let canDoCount = 0;
    let strongCount = 0;
    let checkedCount = 0;

    for (const unitName of subject.units) {
      const status = getUnitStatus(state!, subject.id, unitName);
      if (status !== 'unchecked') checkedCount++;
      if (status === 'growth') growthCount++;
      if (status === 'can_do') canDoCount++;
      if (status === 'strong') strongCount++;
    }

    const total = subject.units.length;
    const progressPct = total > 0 ? Math.round(((canDoCount + strongCount) / total) * 100) : 0;

    return { growthCount, canDoCount, strongCount, checkedCount, total, progressPct };
  }

  const totalUnits = subjects.reduce((sum, s) => sum + s.units.length, 0);
  const totalCleared = subjects.reduce((sum, s) => {
    const stats = getSubjectStats(s);
    return sum + stats.canDoCount + stats.strongCount;
  }, 0);
  const overallPct = totalUnits > 0 ? Math.round((totalCleared / totalUnits) * 100) : 0;
  const overallStage = getIslandStage(overallPct);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 pb-8">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradFrom} ${gradTo} px-5 pt-10 pb-6 rounded-b-3xl`}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.push('/mm/home')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            ←
          </button>
          <div>
            <h1 className="text-white text-xl font-bold">学習マップ</h1>
            <p className="text-white/70 text-sm">科目の島をタップして冒険しよう</p>
          </div>
        </div>

        {/* Overall Progress Island */}
        <div className="bg-white/15 rounded-2xl p-4 text-center">
          <div className="text-4xl mb-1">{overallStage.emoji}</div>
          <p className="text-white text-sm font-medium">{overallStage.label}</p>
          <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden mx-8">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <p className="text-white/70 text-xs mt-1">全体 {overallPct}% 開拓済み</p>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="px-5 -mt-4 space-y-4 max-w-md mx-auto w-full">
        {subjects.map((subject) => {
          const stats = getSubjectStats(subject);
          const island = getIslandStage(stats.progressPct);

          return (
            <button
              key={subject.id}
              onClick={() => router.push(`/mm/subjects?subject=${subject.id}`)}
              className={`w-full bg-white rounded-2xl border ${accentBorder} p-5 text-left shadow-sm hover:shadow-md active:scale-[0.98] transition-all`}
            >
              <div className="flex items-start gap-4">
                {/* Island Visual */}
                <div className={`w-16 h-16 ${accentLight} rounded-xl flex items-center justify-center text-3xl relative`}>
                  {island.emoji}
                  {stats.progressPct === 100 && (
                    <div className="absolute -top-1 -right-1 text-sm">👑</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-base font-bold text-slate-800">
                      {SUBJECT_ICONS[subject.id] || '📚'} {subject.name}
                    </h2>
                    <span className={`text-sm font-bold ${accentText}`}>{stats.progressPct}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${accentBg} rounded-full transition-all duration-500`}
                      style={{ width: `${stats.progressPct}%` }}
                    />
                  </div>

                  {/* Status Counts */}
                  <div className="flex gap-3 text-xs">
                    {stats.growthCount > 0 && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <span>🌱</span>
                        <span>のびしろ {stats.growthCount}</span>
                      </span>
                    )}
                    {(stats.canDoCount + stats.strongCount) > 0 && (
                      <span className="flex items-center gap-1 text-green-600">
                        <span>🏁</span>
                        <span>できる {stats.canDoCount + stats.strongCount}</span>
                      </span>
                    )}
                    {stats.checkedCount === 0 && (
                      <span className="text-slate-400">まだ未開拓</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Unit Count Footer */}
              <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                <span className="text-xs text-slate-400">{stats.total}単元</span>
                <span className={`text-xs ${accentText} font-medium`}>冒険する →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
