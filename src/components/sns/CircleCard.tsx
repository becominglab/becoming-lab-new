"use client";

import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

interface Circle {
  id: string;
  name: string;
  theme_tag: string;
  description?: string;
  max_members: number;
  member_count: number;
  is_full?: boolean;
  my_role?: string;
}

export default function CircleCard({ circle }: { circle: Circle }) {
  const router = useRouter();
  const fillRate = circle.member_count / circle.max_members;

  return (
    <button
      onClick={() => router.push(`/sns/circles/${circle.id}`)}
      className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
    >
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{circle.name}</h3>
          <span className="text-xs text-teal-600">#{circle.theme_tag}</span>
        </div>
        {circle.my_role === "owner" && (
          <span className="shrink-0 text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full ml-2">
            オーナー
          </span>
        )}
        {circle.my_role === "member" && (
          <span className="shrink-0 text-xs px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded-full ml-2">
            参加中
          </span>
        )}
      </div>

      {circle.description && (
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{circle.description}</p>
      )}

      {/* メンバー進捗バー */}
      <div className="flex items-center gap-2">
        <Users size={12} className="text-gray-400 shrink-0" />
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              fillRate >= 1 ? "bg-red-400" : fillRate >= 0.7 ? "bg-amber-400" : "bg-teal-400"
            }`}
            style={{ width: `${Math.min(fillRate * 100, 100)}%` }}
          />
        </div>
        <span className="shrink-0 text-xs text-gray-400">
          {circle.member_count}/{circle.max_members}人
        </span>
        {circle.is_full && (
          <span className="shrink-0 text-xs text-red-500">満員</span>
        )}
      </div>
    </button>
  );
}
