'use client';

import React from 'react';
import { CloudFog, Sprout, Flag, Sparkles } from 'lucide-react';

interface UnitStatusCardProps {
  unit: {
    id: string;
    name: string;
  };
  status: 'unchecked' | 'growth' | 'can_do' | 'strong';
  onClick: () => void;
}

const statusConfig: Record<
  string,
  { icon: React.ReactNode; bg: string; border: string; text: string; label: string }
> = {
  unchecked: {
    icon: <CloudFog className="w-5 h-5" />,
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-400',
    label: '未チェック',
  },
  growth: {
    icon: <Sprout className="w-5 h-5" />,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    label: 'のびしろ',
  },
  can_do: {
    icon: <Flag className="w-5 h-5" />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    label: 'できる!',
  },
  strong: {
    icon: <Sparkles className="w-5 h-5" />,
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-600',
    label: 'バッチリ!',
  },
};

export default function UnitStatusCard({ unit, status, onClick }: UnitStatusCardProps) {
  const config = statusConfig[status] ?? statusConfig.unchecked;

  return (
    <button
      onClick={onClick}
      className={`
        w-full min-h-16 flex items-center gap-3 p-4 rounded-2xl
        border shadow-sm transition-all active:scale-[0.98]
        ${config.bg} ${config.border}
      `}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.text} ${config.bg}`}>
        {config.icon}
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-sm text-gray-900">{unit.name}</p>
        <p className={`text-xs mt-0.5 font-medium ${config.text}`}>{config.label}</p>
      </div>
      {status === 'strong' && (
        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse shrink-0" />
      )}
    </button>
  );
}
