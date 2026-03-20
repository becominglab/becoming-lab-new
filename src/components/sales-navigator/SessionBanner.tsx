"use client";

import { useState, useEffect } from "react";
import type { SessionData } from "@/app/sales-navigator/page";

function formatElapsed(start: Date): string {
  const diff = Math.floor((Date.now() - start.getTime()) / 1000);
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function SessionBanner({
  session,
  onEnd,
}: {
  session: SessionData;
  onEnd: () => void;
}) {
  const [elapsed, setElapsed] = useState("00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(formatElapsed(session.startTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [session.startTime]);

  return (
    <div className="sn-session-banner">
      <div className="sn-session-banner-top">
        <span className="sn-session-label">Active Session</span>
        <span className="sn-session-time">{elapsed}</span>
      </div>
      <div className="sn-session-customer">{session.customerName}</div>
      <div className="sn-session-meta">
        <span>{session.purpose}</span>
      </div>
      <div className="sn-session-controls">
        <button className="sn-ctrl-btn danger" onClick={onEnd}>
          終了
        </button>
      </div>
    </div>
  );
}
