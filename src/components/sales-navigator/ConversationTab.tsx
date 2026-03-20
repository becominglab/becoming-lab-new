"use client";

import { useState, useRef, useEffect } from "react";
import type { ConversationEntry, Suggestion } from "@/app/sales-navigator/page";

const CATEGORY_LABELS: Record<ConversationEntry["category"], string> = {
  situation: "状況",
  behavior: "行動",
  emotion: "感情",
  value: "価値観",
  future: "未来",
};

const QUICK_PROMPTS = [
  "今のお住まいで不便に感じることは？",
  "休日はどのように過ごされますか？",
  "理想の暮らしのイメージは？",
  "ご家族で大切にしていることは？",
];

export default function ConversationTab({
  conversations,
  suggestions,
  isAnalyzing,
  onAnalyze,
}: {
  conversations: ConversationEntry[];
  suggestions: Suggestion[];
  isAnalyzing: boolean;
  onAnalyze: (text: string) => void;
}) {
  const [inputText, setInputText] = useState("");
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  const handleSubmit = () => {
    if (!inputText.trim() || isAnalyzing) return;
    onAnalyze(inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Input Area */}
      <div className="sn-card">
        <div className="sn-card-header">
          <span className="sn-card-title">
            <span style={{ fontSize: 15 }}>🎙</span>
            顧客の発言を入力
          </span>
          {isAnalyzing && <div className="sn-spinner" />}
        </div>
        <div className="sn-input-area">
          <textarea
            className="sn-textarea"
            placeholder="お客様の発言を入力..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <button
            className="sn-send-btn"
            onClick={handleSubmit}
            disabled={!inputText.trim() || isAnalyzing}
          >
            ↑
          </button>
        </div>

        {/* Quick Prompts */}
        {conversations.length === 0 && (
          <div className="sn-quick-actions">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                className="sn-quick-btn"
                onClick={() => setInputText(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="sn-card">
          <div className="sn-card-header">
            <span className="sn-card-title">
              <span style={{ fontSize: 15 }}>💡</span>
              次の質問
            </span>
            <span className="sn-card-badge blue">AI提案</span>
          </div>
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="sn-suggestion"
              onClick={() => setInputText(s.question)}
            >
              <div className="sn-suggestion-label">Question {i + 1}</div>
              <div className="sn-suggestion-text">{s.question}</div>
              <div className="sn-suggestion-reason">{s.reason}</div>
            </div>
          ))}
        </div>
      )}

      {/* Conversation Log */}
      {conversations.length > 0 && (
        <div className="sn-card">
          <div className="sn-card-header">
            <span className="sn-card-title">
              <span style={{ fontSize: 15 }}>📝</span>
              会話ログ
            </span>
            <span className="sn-card-badge green">
              {conversations.length}件
            </span>
          </div>
          {conversations.map((entry) => (
            <div key={entry.id} className={`sn-log-item ${entry.category}`}>
              <div className="sn-log-header">
                <span className={`sn-log-tag ${entry.category}`}>
                  {CATEGORY_LABELS[entry.category]}
                </span>
                <span className="sn-log-time">
                  {entry.timestamp.toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="sn-log-text">{entry.text}</div>
              {entry.keywords.length > 0 && (
                <div
                  className="sn-keywords"
                  style={{ marginTop: 8 }}
                >
                  {entry.keywords.map((kw) => (
                    <span key={kw} className="sn-keyword">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
              {entry.insight && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: "#555555",
                    fontStyle: "italic",
                    paddingLeft: 8,
                    borderLeft: "2px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {entry.insight}
                </div>
              )}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}

      {/* Empty State */}
      {conversations.length === 0 && (
        <div className="sn-empty">
          <div className="sn-empty-icon">🏠</div>
          <div className="sn-empty-text">
            お客様の発言を入力すると
            <br />
            AIが自動で分析・分類します
          </div>
        </div>
      )}
    </>
  );
}
