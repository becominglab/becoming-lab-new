"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { GraduationCap, Users, Check, X } from "lucide-react";

interface Connection {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: string;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public_profiles?: any;
}

interface Props {
  isMentor: boolean;
  onToggleMentor: (val: boolean) => void;
}

export default function MentorSection({ isMentor, onToggleMentor }: Props) {
  const [tab, setTab] = useState<"mentors" | "mentees" | "requests">("mentors");
  const [connections, setConnections] = useState<Connection[]>([]);
  const [requests, setRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === "requests") {
        const res = await fetch("/api/sns/mentors?tab=requests");
        const data = await res.json();
        setRequests(data.requests || []);
      } else {
        const res = await fetch(`/api/sns/mentors?tab=${tab}`);
        const data = await res.json();
        setConnections(data.connections || []);
      }
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function respondToRequest(connectionId: string, status: "accepted" | "declined") {
    setActionLoading(connectionId);
    try {
      await fetch(`/api/sns/mentors/${connectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadData();
    } finally {
      setActionLoading(null);
    }
  }

  async function disconnect(connectionId: string) {
    setActionLoading(connectionId);
    try {
      await fetch(`/api/sns/mentors/${connectionId}`, { method: "DELETE" });
      loadData();
    } finally {
      setActionLoading(null);
    }
  }

  const displayList = tab === "requests" ? requests : connections;

  return (
    <div className="bg-white rounded-2xl p-4 border border-stone-100">
      {/* ヘッダー + メンタートグル */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <GraduationCap size={18} className="text-teal-600" />
          <h3 className="font-semibold text-stone-800 text-sm">メンター制度</h3>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs text-stone-400">メンターになる</span>
          <button
            onClick={() => onToggleMentor(!isMentor)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              isMentor ? "bg-teal-500" : "bg-stone-200"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isMentor ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      <p className="text-xs text-stone-400 mb-3">
        挑戦の経験者がサポート役に。「さがす」タブからメンターを探せます
      </p>

      {isMentor && (
        <p className="text-xs text-teal-600 bg-teal-50 rounded-lg px-3 py-2 mb-4">
          ✓ あなたはメンターとして公開されています。「維持中」フェーズの方がメンター候補に表示されます。
        </p>
      )}

      {/* タブ */}
      <div className="flex gap-1 mb-3">
        {(["mentors", "mentees", "requests"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === t ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
            }`}
          >
            {t === "mentors" ? "メンター" : t === "mentees" ? "メンティー" : "リクエスト"}
          </button>
        ))}
      </div>

      {/* コンテンツ */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-200 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-stone-200 rounded w-24" />
                <div className="h-2.5 bg-stone-100 rounded w-32" />
              </div>
              <div className="h-7 w-12 bg-stone-100 rounded-lg" />
            </div>
          ))}
        </div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-6">
          <Users size={24} className="mx-auto text-stone-200 mb-2" />
          <p className="text-xs text-stone-400">
            {tab === "mentors"
              ? "まだメンターがいません"
              : tab === "mentees"
              ? "まだメンティーがいません"
              : "リクエストはありません"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayList.map((c) => {
            const profile = c.public_profiles;
            const isLoading = actionLoading === c.id;
            return (
              <div key={c.id} className="flex items-center gap-3">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.nickname}
                    width={36}
                    height={36}
                    className="rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {profile?.nickname?.[0] || "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {profile?.nickname}
                  </p>
                  {c.message && (
                    <p className="text-xs text-stone-400 truncate">{c.message}</p>
                  )}
                </div>
                {tab === "requests" ? (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => respondToRequest(c.id, "accepted")}
                      disabled={isLoading}
                      title="承認する"
                      className="w-9 h-9 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => respondToRequest(c.id, "declined")}
                      disabled={isLoading}
                      title="断る"
                      className="w-9 h-9 bg-stone-200 hover:bg-stone-300 text-stone-500 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => disconnect(c.id)}
                    disabled={isLoading}
                    className="px-2.5 py-1 text-xs text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-stone-200"
                  >
                    解除
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
