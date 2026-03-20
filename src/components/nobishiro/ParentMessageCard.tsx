'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface ParentMessageCardProps {
  comment: {
    text: string;
    type: string;
    createdAt: string;
  };
}

export default function ParentMessageCard({ comment }: ParentMessageCardProps) {
  const date = new Date(comment.createdAt);
  const timeStr = date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 border border-pink-100 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center shrink-0 mt-0.5">
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 leading-relaxed">{comment.text}</p>
          <p className="text-[10px] text-gray-400 mt-2">{timeStr}</p>
        </div>
      </div>
    </div>
  );
}
