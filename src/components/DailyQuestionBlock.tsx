"use client";

import { useEffect, useState } from "react";

const FALLBACK = "あなたは今、何を見て見ぬふりをしていますか？";

export default function DailyQuestionBlock() {
  const [question, setQuestion] = useState(FALLBACK);

  useEffect(() => {
    fetch("/api/ai/daily")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.prompt) setQuestion(d.prompt);
      })
      .catch(() => {});
  }, []);

  return (
    <p
      className="text-xl md:text-2xl font-light italic leading-relaxed tracking-tight"
      style={{ color: "#111" }}
    >
      {question}
    </p>
  );
}
