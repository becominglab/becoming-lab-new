"use client";

import { useState } from "react";
import type { ConversationEntry, CustomerProfile } from "@/app/sales-navigator/page";

type Proposal = {
  conceptName: string;
  conceptSubtitle?: string;
  description: string;
  features: { title: string; description: string }[];
  keywords?: string[];
  closingRate?: number;
  priceRange?: string;
  talkingPoints?: string[];
};

export default function ProposalTab({
  conversations,
  profile,
}: {
  conversations: ConversationEntry[];
  profile: CustomerProfile;
}) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (conversations.length < 2) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/sales/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationHistory: conversations.map((c) => ({
            category: c.category,
            text: c.text,
          })),
          customerProfile: profile,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setProposal(data);
    } catch {
      // Fallback proposal
      setProposal({
        conceptName: "心地よい余白",
        conceptSubtitle: "Comfortable Margin",
        description:
          "お客様の暮らしの中にある「大切な時間」を育む空間。機能性と感性のバランスを追求した、唯一無二の住まいをご提案します。",
        features: [
          {
            title: "光のデザイン",
            description: "自然光を活かした開放的なリビング設計",
          },
          {
            title: "素材の対話",
            description: "無垢材とスチールの調和が生む上質な空気感",
          },
          {
            title: "動線の美学",
            description: "家族の気配を感じながら過ごせる回遊動線",
          },
        ],
        keywords: ["自然光", "無垢材", "回遊動線"],
        closingRate: 72,
        talkingPoints: [
          "「余白のある暮らし」というコンセプトに共感いただけるかと思います",
          "お子様が成長されても柔軟に使い方を変えられる設計です",
        ],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (conversations.length < 2) {
    return (
      <div className="sn-empty">
        <div className="sn-empty-icon">✨</div>
        <div className="sn-empty-text">
          会話データが2件以上になると
          <br />
          空間コンセプトを生成できます
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Generate Button */}
      {!proposal && (
        <div className="sn-card">
          <div className="sn-card-header">
            <span className="sn-card-title">
              <span style={{ fontSize: 15 }}>🏗</span>
              空間コンセプト生成
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#555555",
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            {conversations.length}件の会話データと顧客プロファイルから、
            最適な空間コンセプトをAIが自動生成します。
          </p>
          <button
            className="sn-generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span className="sn-spinner" />
                生成中...
              </span>
            ) : (
              "コンセプトを生成する"
            )}
          </button>
        </div>
      )}

      {/* Proposal Display */}
      {proposal && (
        <>
          <div className="sn-proposal">
            {proposal.conceptSubtitle && (
              <div
                style={{
                  fontSize: 10,
                  color: "#555555",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {proposal.conceptSubtitle}
              </div>
            )}
            <div className="sn-proposal-concept">
              「{proposal.conceptName}」
            </div>
            <div className="sn-proposal-desc">{proposal.description}</div>

            <div className="sn-divider" />

            <div className="sn-proposal-features">
              {proposal.features.map((f, i) => (
                <div key={i} className="sn-proposal-feature">
                  <span className="sn-proposal-feature-icon">◆</span>
                  <div>
                    <strong style={{ color: "#161616", fontWeight: 600 }}>
                      {f.title}
                    </strong>
                    <br />
                    {f.description}
                  </div>
                </div>
              ))}
            </div>

            {proposal.keywords && (
              <div className="sn-keywords" style={{ marginTop: 16 }}>
                {proposal.keywords.map((kw) => (
                  <span key={kw} className="sn-keyword highlight">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Closing Rate */}
          {proposal.closingRate && (
            <div className="sn-card" style={{ marginTop: 12 }}>
              <div className="sn-card-header">
                <span className="sn-card-title">
                  <span style={{ fontSize: 15 }}>📈</span>
                  成約予測
                </span>
                <span className="sn-card-badge gold">
                  {proposal.closingRate}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  background: "rgba(0,0,0,0.04)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${proposal.closingRate}%`,
                    height: "100%",
                    borderRadius: 3,
                    background:
                      proposal.closingRate >= 70
                        ? "linear-gradient(90deg, #2E9E6E, #2E9E6E)"
                        : proposal.closingRate >= 40
                        ? "linear-gradient(90deg, #D4891C, #D4891C)"
                        : "linear-gradient(90deg, #C4442D, #C4442D)",
                    transition: "width 1s ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* Talking Points */}
          {proposal.talkingPoints && proposal.talkingPoints.length > 0 && (
            <div className="sn-card" style={{ marginTop: 12 }}>
              <div className="sn-card-header">
                <span className="sn-card-title">
                  <span style={{ fontSize: 15 }}>🗣</span>
                  トークポイント
                </span>
              </div>
              {proposal.talkingPoints.map((point, i) => (
                <div key={i} className="sn-insight-item">
                  <div className="sn-insight-icon gold">💬</div>
                  <div className="sn-insight-text">{point}</div>
                </div>
              ))}
            </div>
          )}

          {/* Regenerate */}
          <button
            className="sn-ctrl-btn"
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ width: "100%", marginTop: 12, padding: 12 }}
          >
            {isGenerating ? "再生成中..." : "別のコンセプトを生成"}
          </button>
        </>
      )}
    </>
  );
}
