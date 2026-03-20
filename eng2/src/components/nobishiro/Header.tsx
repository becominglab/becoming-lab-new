'use client';

import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { UserType } from '@/lib/nobishiro/types';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  userType?: UserType;
}

export default function Header({
  title,
  showBack = false,
  onBack,
  userType = 'mitsuki',
}: HeaderProps) {
  const isJunior = userType === 'mitsuki';

  return (
    <header
      className={`
        sticky top-0 z-50 px-4 py-3 flex items-center gap-3
        ${isJunior
          ? 'bg-gradient-to-r from-indigo-600 to-slate-700 text-white'
          : 'bg-gradient-to-r from-emerald-500 to-amber-400 text-white'
        }
      `}
    >
      {showBack && (
        <button
          onClick={onBack}
          className="min-w-10 min-h-10 flex items-center justify-center rounded-full bg-white/20 active:bg-white/30 transition-colors"
          aria-label="戻る"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-2 flex-1">
        <Sparkles className="w-5 h-5 shrink-0" />
        <h1 className="text-lg font-bold truncate">
          {title ?? 'のびしろクエスト'}
        </h1>
      </div>
    </header>
  );
}
