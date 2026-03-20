'use client';

import React from 'react';
import type { UserType } from '@/lib/nobishiro/types';

interface CharacterBubbleProps {
  text: string;
  userType?: UserType;
}

export default function CharacterBubble({
  text,
  userType = 'mitsuki',
}: CharacterBubbleProps) {
  const isJunior = userType === 'mitsuki';

  return (
    <div className="flex items-end gap-2 animate-[fadeIn_0.4s_ease-out]">
      {/* Avatar */}
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0
          ${isJunior
            ? 'bg-indigo-100 text-indigo-600'
            : 'bg-emerald-100 text-emerald-600'
          }
        `}
      >
        {isJunior ? '🦉' : '🐾'}
      </div>

      {/* Speech bubble */}
      <div
        className={`
          relative max-w-[80%] rounded-2xl rounded-bl-md px-4 py-3
          animate-[bounceIn_0.5s_ease-out]
          ${isJunior
            ? 'bg-indigo-50 text-indigo-900 border border-indigo-100'
            : 'bg-emerald-50 text-emerald-900 border border-emerald-100'
          }
        `}
      >
        {/* Tail */}
        <div
          className={`
            absolute -left-1.5 bottom-2 w-3 h-3 rotate-45
            ${isJunior ? 'bg-indigo-50 border-l border-b border-indigo-100' : 'bg-emerald-50 border-l border-b border-emerald-100'}
          `}
        />
        <p className="text-sm leading-relaxed relative z-10">{text}</p>
      </div>
    </div>
  );
}
