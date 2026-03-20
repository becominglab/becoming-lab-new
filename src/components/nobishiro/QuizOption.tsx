'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface QuizOptionProps {
  text: string;
  selected: boolean;
  correct?: boolean | null;
  onClick: () => void;
  disabled?: boolean;
}

export default function QuizOption({
  text,
  selected,
  correct = null,
  onClick,
  disabled = false,
}: QuizOptionProps) {
  // Determine visual state
  const answered = correct !== null;
  const isCorrect = correct === true;
  const isIncorrect = correct === false;

  let bgClass = 'bg-white border-gray-200 text-gray-900';
  let iconEl: React.ReactNode = null;

  if (answered && selected && isCorrect) {
    bgClass = 'bg-emerald-50 border-emerald-400 text-emerald-800';
    iconEl = (
      <div className="w-7 h-7 rounded-full bg-emerald-400 text-white flex items-center justify-center shrink-0">
        <Check className="w-4 h-4" />
      </div>
    );
  } else if (answered && selected && isIncorrect) {
    // "のびしろ" coloring - amber, not red
    bgClass = 'bg-amber-50 border-amber-400 text-amber-800';
    iconEl = (
      <div className="w-7 h-7 rounded-full bg-amber-400 text-white flex items-center justify-center shrink-0">
        <X className="w-4 h-4" />
      </div>
    );
  } else if (selected) {
    bgClass = 'bg-indigo-50 border-indigo-400 text-indigo-800';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full min-h-14 flex items-center gap-3 px-4 py-3 rounded-2xl
        border-2 text-left text-sm font-medium
        transition-all duration-200
        active:scale-[0.98]
        disabled:pointer-events-none
        ${bgClass}
      `}
    >
      <span className="flex-1">{text}</span>
      {iconEl}
    </button>
  );
}
