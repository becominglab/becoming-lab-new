"use client";

import { useState } from "react";
import { GraduationCap, Loader2, X } from "lucide-react";

interface Props {
  mentorUserId: string;
  initialStatus: string | null; // null | 'pending' | 'accepted' | 'declined'
}

export default function MentorRequestButton({ mentorUserId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    setLoading(true);
    try {
      const res = await fetch("/api/sns/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentor_id: mentorUserId, message: message || undefined }),
      });
      if (res.ok) {
        setStatus("pending");
        setShowModal(false);
      }
    } finally {
      setLoading(false);
    }
  }

  if (status === "accepted") {
    return (
      <span className="flex items-center gap-1 text-xs text-teal-600 font-medium">
        <GraduationCap size={13} />
        メンター中
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="flex items-center gap-1 text-xs text-stone-400">
        <GraduationCap size={13} />
        リクエスト中
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1 px-3 py-1.5 border border-teal-500 text-teal-600 rounded-full text-xs font-medium hover:bg-teal-50 transition-colors"
      >
        <GraduationCap size={13} />
        メンターに依頼
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center sm:p-4">
          <div className="w-full max-w-md mx-auto bg-white rounded-t-2xl sm:rounded-2xl p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-stone-900 text-sm">メンターに依頼する</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-stone-400" />
              </button>
            </div>
            <p className="text-xs text-stone-400 mb-4">
              相談したいことや背景を伝えると、メンターが受け入れやすくなります
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="依頼メッセージ（任意）: どんなことを相談したいか..."
              maxLength={200}
              rows={3}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 mb-4"
            />
            <button
              onClick={handleRequest}
              disabled={loading}
              className="w-full py-3 bg-teal-600 disabled:bg-stone-200 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "依頼を送る"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
