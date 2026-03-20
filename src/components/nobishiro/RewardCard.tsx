'use client';

import React from 'react';
import { Gift, Lock } from 'lucide-react';

interface RewardCardProps {
  reward: {
    name: string;
    badgesRequired: number;
    claimed: boolean;
  };
  currentBadges: number;
}

export default function RewardCard({ reward, currentBadges }: RewardCardProps) {
  const unlocked = currentBadges >= reward.badgesRequired;
  const percentage = Math.min((currentBadges / reward.badgesRequired) * 100, 100);

  return (
    <div
      className={`
        rounded-2xl p-5 transition-all duration-500
        ${unlocked
          ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-lg'
          : 'bg-white border border-gray-200 shadow-sm'
        }
        ${reward.claimed ? 'opacity-70' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Treasure chest icon */}
        <div
          className={`
            w-14 h-14 rounded-2xl flex items-center justify-center shrink-0
            ${unlocked
              ? 'bg-amber-400 text-white animate-pulse'
              : 'bg-gray-100 text-gray-400'
            }
          `}
        >
          {unlocked ? <Gift className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm ${unlocked ? 'text-amber-800' : 'text-gray-700'}`}>
            {reward.name}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            バッジ {reward.badgesRequired}個で解放
          </p>

          {/* Progress */}
          <div className="mt-2">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  unlocked ? 'bg-amber-400' : 'bg-gray-300'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {Math.min(currentBadges, reward.badgesRequired)} / {reward.badgesRequired}
            </p>
          </div>
        </div>
      </div>

      {/* Unlock banner */}
      {unlocked && !reward.claimed && (
        <div className="mt-3 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400 text-white text-sm font-bold animate-bounce">
            解放!
          </span>
        </div>
      )}

      {reward.claimed && (
        <p className="mt-2 text-center text-xs text-amber-600 font-medium">受け取り済み</p>
      )}
    </div>
  );
}
