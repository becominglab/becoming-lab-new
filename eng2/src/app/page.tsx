'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const children = [
  {
    id: 'asahi',
    name: 'あさひ',
    grade: '高校1年生',
    goal: '英検2級合格',
    emoji: '🌅',
    description: '英検2級コーチ',
    bgFrom: 'from-orange-50',
    bgTo: 'to-amber-50',
    border: 'border-orange-200',
    activeBorder: 'border-orange-400',
    accent: 'text-orange-600',
    btnBg: 'bg-gradient-to-r from-orange-500 to-amber-500',
    href: '/dashboard',
    external: false,
  },
  {
    id: 'mitsuki',
    name: 'みつき',
    grade: '新中学3年生',
    goal: '都立高校合格',
    emoji: '📘',
    description: 'のびしろクエスト',
    bgFrom: 'from-indigo-50',
    bgTo: 'to-slate-50',
    border: 'border-indigo-200',
    activeBorder: 'border-indigo-400',
    accent: 'text-indigo-600',
    btnBg: 'bg-gradient-to-r from-indigo-500 to-slate-600',
    href: '/nobishiro/select?user=mitsuki',
    external: false,
  },
  {
    id: 'michiru',
    name: 'みちる',
    grade: '新小学6年生',
    goal: '大妻中学合格',
    emoji: '🌟',
    description: 'のびしろクエスト',
    bgFrom: 'from-emerald-50',
    bgTo: 'to-teal-50',
    border: 'border-emerald-200',
    activeBorder: 'border-emerald-400',
    accent: 'text-emerald-600',
    btnBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    href: '/nobishiro/select?user=michiru',
    external: false,
  },
];

export default function FamilySelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleStart = () => {
    const child = children.find((c) => c.id === selected);
    if (!child) return;
    if (child.external) {
      window.location.href = child.href;
    } else {
      router.push(child.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50">
      <div className="mx-auto max-w-md min-h-screen flex flex-col px-5 py-8">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <div className="text-4xl mb-3">🏠</div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            おつか家の学び
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            だれが使う？自分のカードをえらんでね
          </p>
        </div>

        {/* Children Cards */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
          {children.map((child) => {
            const isSelected = selected === child.id;
            return (
              <button
                key={child.id}
                onClick={() => handleSelect(child.id)}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                  isSelected
                    ? `${child.activeBorder} bg-gradient-to-br ${child.bgFrom} ${child.bgTo} scale-[1.02] shadow-lg`
                    : `${child.border} bg-white hover:shadow-md`
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-sm">
                    {child.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className={`text-lg font-bold ${isSelected ? child.accent : 'text-slate-700'}`}>
                        {child.name}
                      </h2>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {child.grade}
                      </span>
                    </div>
                    <p className={`text-sm mt-0.5 ${isSelected ? child.accent : 'text-slate-500'}`}>
                      {child.goal}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      📱 {child.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className={`text-sm font-bold ${child.accent}`}>✓</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Start Button */}
        <div className={`mt-6 text-center transition-all duration-300 ${selected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button
            onClick={handleStart}
            className={`px-10 py-4 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ${
              selected ? children.find((c) => c.id === selected)!.btnBg : 'bg-slate-400'
            }`}
          >
            はじめる
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-300">おつか家 学習サポート</p>
        </div>
      </div>
    </div>
  );
}
