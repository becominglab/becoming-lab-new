'use client';

import React from 'react';
import { Pencil, RefreshCw, Building2, Heart, Check } from 'lucide-react';

interface MissionCardProps {
  mission: {
    type: string;
    title: string;
    subject?: string;
    questionCount?: number;
    completed: boolean;
  };
  onClick: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  quiz: <Pencil className="w-5 h-5" />,
  review: <RefreshCw className="w-5 h-5" />,
  juku: <Building2 className="w-5 h-5" />,
  reflection: <Heart className="w-5 h-5" />,
};

const typeBg: Record<string, string> = {
  quiz: 'bg-blue-50 text-blue-600',
  review: 'bg-purple-50 text-purple-600',
  juku: 'bg-cyan-50 text-cyan-600',
  reflection: 'bg-pink-50 text-pink-600',
};

export default function MissionCard({ mission, onClick }: MissionCardProps) {
  const icon = typeIcons[mission.type] ?? <Pencil className="w-5 h-5" />;
  const iconStyle = typeBg[mission.type] ?? 'bg-gray-50 text-gray-600';

  return (
    <button
      onClick={onClick}
      className={`
        w-full min-h-16 flex items-center gap-3 p-4 rounded-2xl
        bg-white shadow-sm border border-gray-100
        active:scale-[0.98] transition-transform
        ${mission.completed ? 'opacity-70' : ''}
      `}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconStyle}`}>
        {icon}
      </div>

      <div className="flex-1 text-left">
        <p className="font-semibold text-gray-900 text-sm">{mission.title}</p>
        {mission.subject && (
          <p className="text-xs text-gray-500 mt-0.5">
            {mission.subject}
            {mission.questionCount != null && ` ・ ${mission.questionCount}問`}
          </p>
        )}
      </div>

      {mission.completed && (
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4" />
        </div>
      )}
    </button>
  );
}
