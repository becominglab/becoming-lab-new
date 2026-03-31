"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { X } from "lucide-react";

interface UserItem {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  challenge_tags: string[];
  is_following: boolean;
}

interface Props {
  userId: string;
  currentUserId: string;
  type: "followers" | "following";
  onClose: () => void;
}

export default function FollowListModal({ userId, currentUserId, type, onClose }: Props) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/sns/follows/list?type=${type}&user_id=${userId}`)
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId, type]);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
          <h2 className="text-sm font-semibold text-stone-800">
            {type === "followers" ? "フォロワー" : "フォロー中"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-4 space-y-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-stone-200 rounded w-28" />
                    <div className="h-3 bg-stone-100 rounded w-40" />
                  </div>
                  <div className="h-7 w-14 bg-stone-100 rounded-full" />
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-400 text-sm">
                {type === "followers" ? "まだフォロワーがいません" : "フォロー中のユーザーがいません"}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {users.map((u) => (
                <div key={u.user_id} className="flex items-center gap-3">
                  <Link href={`/sns/profile/${u.user_id}`} onClick={onClose} className="shrink-0">
                    {u.avatar_url ? (
                      <Image
                        src={u.avatar_url}
                        alt={u.nickname}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                        {u.nickname?.[0] || "?"}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/sns/profile/${u.user_id}`}
                      onClick={onClose}
                      className="text-sm font-medium text-stone-800 hover:underline block truncate"
                    >
                      {u.nickname}
                    </Link>
                    {u.bio && (
                      <p className="text-xs text-stone-400 truncate">{u.bio}</p>
                    )}
                  </div>
                  {u.user_id !== currentUserId && (
                    <FollowButton
                      userId={u.user_id}
                      isFollowing={u.is_following}
                      compact
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
