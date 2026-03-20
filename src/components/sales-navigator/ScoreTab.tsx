"use client";

import type { ConversationEntry, CustomerProfile } from "@/app/sales-navigator/page";

function ScoreRing({
  value,
  maxValue,
  label,
  color,
  size = 100,
}: {
  value: number;
  maxValue: number;
  label: string;
  color: string;
  size?: number;
}) {
  const r = (size - 12) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / maxValue) * circumference;

  return (
    <div className="sn-score-ring" style={{ width: size, height: size }}>
      <svg>
        <circle
          className="sn-score-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={r}
        />
        <circle
          className="sn-score-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="sn-score-ring-label">
        <div className="sn-score-value">{value}</div>
        <div className="sn-score-unit">{label}</div>
      </div>
    </div>
  );
}

export default function ScoreTab({
  depthScore,
  conversations,
  profile,
  currentPhase,
  phases,
}: {
  depthScore: number;
  conversations: ConversationEntry[];
  profile: CustomerProfile;
  currentPhase: number;
  phases: string[];
}) {
  const valueCount = conversations.filter(
    (c) => c.category === "value" || c.category === "future"
  ).length;
  const emotionCount = conversations.filter(
    (c) => c.category === "emotion"
  ).length;
  const engagementScore = Math.min(
    100,
    conversations.length * 12 + valueCount * 15 + emotionCount * 10
  );

  const maxType = Math.max(
    profile.functional,
    profile.sensory,
    profile.experiential
  );
  const clarityScore = maxType > 0 ? Math.min(100, Math.round(maxType * 1.2)) : 0;

  const overallScore = Math.round(
    depthScore * 0.4 + engagementScore * 0.3 + clarityScore * 0.3
  );

  if (conversations.length === 0) {
    return (
      <div className="sn-empty">
        <div className="sn-empty-icon">📊</div>
        <div className="sn-empty-text">
          会話データが蓄積されると
          <br />
          接客スコアが表示されます
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overall Score */}
      <div className="sn-card">
        <div className="sn-card-header">
          <span className="sn-card-title">
            <span style={{ fontSize: 15 }}>🏆</span>
            接客スコア
          </span>
          <span
            className={`sn-card-badge ${
              overallScore >= 70
                ? "green"
                : overallScore >= 40
                ? "blue"
                : "red"
            }`}
          >
            {overallScore >= 70
              ? "Good"
              : overallScore >= 40
              ? "Building"
              : "Start"}
          </span>
        </div>
        <div className="sn-score-ring-container">
          <ScoreRing
            value={overallScore}
            maxValue={100}
            label="総合"
            color={
              overallScore >= 70
                ? "#2E9E6E"
                : overallScore >= 40
                ? "#008AB7"
                : "#D4891C"
            }
            size={110}
          />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="sn-card">
        <div className="sn-card-header">
          <span className="sn-card-title">
            <span style={{ fontSize: 15 }}>📋</span>
            KPI詳細
          </span>
        </div>
        <div className="sn-kpi-grid">
          <div className="sn-kpi">
            <div className="sn-kpi-label">深掘り度</div>
            <div className="sn-kpi-value">{depthScore}</div>
            <div
              className={`sn-kpi-change ${depthScore >= 50 ? "up" : "down"}`}
            >
              {depthScore >= 50 ? "◎ 良好" : "△ もう少し深く"}
            </div>
          </div>
          <div className="sn-kpi">
            <div className="sn-kpi-label">エンゲージメント</div>
            <div className="sn-kpi-value">{engagementScore}</div>
            <div
              className={`sn-kpi-change ${
                engagementScore >= 50 ? "up" : "down"
              }`}
            >
              {engagementScore >= 50 ? "◎ 高い" : "△ 引き出す"}
            </div>
          </div>
          <div className="sn-kpi">
            <div className="sn-kpi-label">タイプ明瞭度</div>
            <div className="sn-kpi-value">{clarityScore}</div>
            <div
              className={`sn-kpi-change ${
                clarityScore >= 50 ? "up" : "down"
              }`}
            >
              {clarityScore >= 50 ? "◎ 明確" : "△ 探索中"}
            </div>
          </div>
          <div className="sn-kpi">
            <div className="sn-kpi-label">会話数</div>
            <div className="sn-kpi-value">{conversations.length}</div>
            <div className="sn-kpi-change up">
              {conversations.length >= 5 ? "◎ 充実" : "継続中"}
            </div>
          </div>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="sn-card">
        <div className="sn-card-header">
          <span className="sn-card-title">
            <span style={{ fontSize: 15 }}>🗺</span>
            接客フェーズ
          </span>
        </div>
        {phases.map((phase, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom:
                i < phases.length - 1
                  ? "1px solid rgba(0,0,0,0.04)"
                  : "none",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                fontWeight: 600,
                background:
                  i < currentPhase
                    ? "#2E9E6E"
                    : i === currentPhase
                    ? "#008AB7"
                    : "rgba(0,0,0,0.06)",
                color:
                  i <= currentPhase ? "white" : "rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
            >
              {i < currentPhase ? "✓" : i + 1}
            </div>
            <span
              style={{
                fontSize: 13,
                color:
                  i === currentPhase
                    ? "#161616"
                    : i < currentPhase
                    ? "#555555"
                    : "#9A9A9A",
                fontWeight: i === currentPhase ? 600 : 400,
              }}
            >
              {phase}
            </span>
            {i === currentPhase && (
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  color: "#008AB7",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 100,
                  background: "rgba(0, 138, 183, 0.08)",
                }}
              >
                NOW
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="sn-card">
        <div className="sn-card-header">
          <span className="sn-card-title">
            <span style={{ fontSize: 15 }}>💡</span>
            AIインサイト
          </span>
        </div>
        {conversations.filter((c) => c.insight).length > 0 ? (
          conversations
            .filter((c) => c.insight)
            .slice(-3)
            .map((c) => (
              <div key={c.id} className="sn-insight-item">
                <div
                  className={`sn-insight-icon ${
                    c.category === "value"
                      ? "green"
                      : c.category === "emotion"
                      ? "gold"
                      : "blue"
                  }`}
                >
                  {c.category === "value"
                    ? "💎"
                    : c.category === "emotion"
                    ? "❤️"
                    : c.category === "future"
                    ? "🔮"
                    : "💡"}
                </div>
                <div className="sn-insight-text">{c.insight}</div>
              </div>
            ))
        ) : (
          <div
            style={{
              fontSize: 13,
              color: "#9A9A9A",
              textAlign: "center",
              padding: 16,
            }}
          >
            会話が進むとインサイトが表示されます
          </div>
        )}
      </div>
    </>
  );
}
