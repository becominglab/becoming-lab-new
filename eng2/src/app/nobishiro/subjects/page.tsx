'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

const STATUS_CONFIG: Record<UnitStatus, { icon: string; label: string; bgClass: string; textClass: string; borderClass: string }> = {
  unchecked: { icon: '🌫️', label: '未チェック', bgClass: 'bg-slate-50', textClass: 'text-slate-400', borderClass: 'border-slate-200' },
  growth: { icon: '🌱', label: 'のびしろ', bgClass: 'bg-amber-50', textClass: 'text-amber-600', borderClass: 'border-amber-200' },
  can_do: { icon: '🏁', label: 'できる', bgClass: 'bg-green-50', textClass: 'text-green-600', borderClass: 'border-green-200' },
  strong: { icon: '⭐', label: '得意', bgClass: 'bg-yellow-50', textClass: 'text-yellow-600', borderClass: 'border-yellow-300' },
};

function getUnitStatus(state: AppState, subjectId: string, unitName: string): UnitStatus {
  const key = `${subjectId}:${unitName}`;
  return state.unitProgress[key]?.status || 'unchecked';
}

function SubjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<AppState | null>(null);

  const subjectId = searchParams.get('subject');

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
  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-5">
        <p className="text-slate-500 text-sm">科目が見つかりません</p>
        <button
          onClick={() => router.push('/nobishiro/map')}
          className="px-6 py-3 bg-slate-100 rounded-xl text-sm font-medium text-slate-600 active:scale-95 transition-transform"
        >
          マップに戻る
        </button>
      </div>
    );
  }

  const gradFrom = isMitsuki ? 'from-indigo-500' : 'from-emerald-500';
  const gradTo = isMitsuki ? 'to-slate-600' : 'to-teal-500';

  // Find recommended units (growth status)
  const growthUnits = subject.units.filter(
    (unitName) => getUnitStatus(state, subject.id, unitName) === 'growth'
  );

  // Calculate stats
  const totalUnits = subject.units.length;
  const canDoCount = subject.units.filter((u) => {
    const s = getUnitStatus(state, subject.id, u);
    return s === 'can_do' || s === 'strong';
  }).length;
  const progressPct = totalUnits > 0 ? Math.round((canDoCount / totalUnits) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 pb-8">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradFrom} ${gradTo} px-5 pt-10 pb-6 rounded-b-3xl`}>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.push('/nobishiro/map')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            ←
          </button>
          <div>
            <h1 className="text-white text-xl font-bold">
              {SUBJECT_ICONS[subject.id] || '📚'} {subject.name}
            </h1>
            <p className="text-white/70 text-sm">{totalUnits}単元</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/15 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/80 text-xs">進捗</span>
            <span className="text-white text-sm font-bold">{progressPct}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4 max-w-md mx-auto w-full">
        {/* Recommended Section */}
        {growthUnits.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <h2 className="text-sm font-bold text-amber-700">今日おすすめの単元</h2>
            </div>
            <p className="text-xs text-amber-600 mb-3">のびしろ単元を優先的に復習しよう！</p>
            <div className="flex flex-wrap gap-2">
              {growthUnits.map((unitName) => (
                <button
                  key={unitName}
                  onClick={() => router.push(`/nobishiro/quiz?subject=${subject.id}&unit=${encodeURIComponent(unitName)}`)}
                  className="px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm font-medium text-amber-700 active:scale-95 transition-transform hover:shadow-sm"
                >
                  🌱 {unitName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Unit List */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-500 px-1">すべての単元</h2>

          {subject.units.map((unitName, index) => {
            const status = getUnitStatus(state, subject.id, unitName);
            const config = STATUS_CONFIG[status];

            return (
              <button
                key={unitName}
                onClick={() => router.push(`/nobishiro/quiz?subject=${subject.id}&unit=${encodeURIComponent(unitName)}`)}
                className={`w-full ${config.bgClass} border ${config.borderClass} rounded-2xl p-4 text-left active:scale-[0.98] transition-all hover:shadow-sm ${
                  status === 'strong' ? 'ring-1 ring-yellow-300/50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Order Number */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    status === 'unchecked'
                      ? 'bg-slate-200 text-slate-400'
                      : status === 'growth'
                        ? 'bg-amber-200 text-amber-700'
                        : status === 'can_do'
                          ? 'bg-green-200 text-green-700'
                          : 'bg-yellow-200 text-yellow-700'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Unit Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-bold ${
                        status === 'unchecked' ? 'text-slate-500' : 'text-slate-800'
                      }`}>
                        {unitName}
                      </h3>
                    </div>
                    {state.unitProgress[`${subject.id}:${unitName}`] && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {state.unitProgress[`${subject.id}:${unitName}`].attempts}回挑戦 ・ 正解{state.unitProgress[`${subject.id}:${unitName}`].correctCount}問
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xl">{config.icon}</span>
                    <span className={`text-[10px] font-medium ${config.textClass}`}>{config.label}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <p className="text-xs font-bold text-slate-500 mb-2">ステータスの見方</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(STATUS_CONFIG) as [UnitStatus, typeof STATUS_CONFIG[UnitStatus]][]).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-sm">{cfg.icon}</span>
                <span className={`text-xs ${cfg.textClass}`}>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubjectsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    }>
      <SubjectsContent />
    </Suspense>
  );
}
