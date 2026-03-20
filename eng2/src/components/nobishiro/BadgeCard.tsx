'use client';

import React from 'react';
import { Lock, Sparkles } from 'lucide-react';

interface BadgeCardProps {
  badge: {
    name: string;
    icon: string;
    description: string;
    category: string;
  };
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  progressMax?: number;
}

export default function BadgeCard({
  badge,
  earned,
  earnedAt,
  progress,
  progressMax,
}: BadgeCardProps) {
  const justEarned = earned && earnedAt != null;
  const showProgress = !earned && progress != null && progressMax != null && progressMax > 0;

  return (
    <div
      className={`
        relative rounded-2xl p-4 text-center transition-all duration-300
        ${earned
          ? 'bg-white shadow-md border border-amber-200'
          : 'bg-gray-50 border border-gray-200'
        }
      `}
    >
      {/* Sparkle effect for just-earned */}
      {justEarned && (
        <div className="absolute -top-1 -right-1 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
      )}

      {/* Icon */}
      <div
        className={`
          text-3xl mx-auto mb-2 w-14 h-14 flex items-center justify-center rounded-full
          ${earned
            ? 'bg-amber-50'
            : 'bg-gray-100 grayscale opacity-50'
          }
        `}
      >
        {earned ? (
          <span role="img" aria-label={badge.name}>{badge.icon}</span>
        ) : (
          <Lock className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Name */}
      <p
        className={`text-xs font-bold mb-0.5 ${
          earned ? 'text-gray-900' : 'text-gray-400'
        }`}
      >
        {badge.name}
      </p>

      {/* Description */}
      <p className={`text-[10px] leading-tight ${earned ? 'text-gray-500' : 'text-gray-300'}`}>
        {badge.description}
      </p>

      {/* Progress bar if not yet earned */}
      {showProgress && (
        <div className="mt-2">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((progress! / progressMax!) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {progress} / {progressMax}
          </p>
        </div>
      )}

      {/* Earned date */}
      {earned && earnedAt && (
        <p className="text-[10px] text-amber-600 mt-1">
          {new Date(earnedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
        </p>
      )}
    </div>
  );
}
