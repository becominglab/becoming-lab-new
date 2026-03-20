"use client";

import type { CustomerProfile, ConversationEntry } from "@/app/sales-navigator/page";

const CATEGORY_LABELS: Record<ConversationEntry["category"], string> = {
  situation: "状況",
  behavior: "行動",
  emotion: "感情",
  value: "価値観",
  future: "未来",
};

function TypeCard({
  icon,
  label,
  score,
  isDominant,
}: {
  icon: string;
  label: string;
  score: number;
  isDominant: boolean;
}) {
  return (
    <div className={`sn-type-card ${isDominant ? "dominant" : ""}`}>
      <div className="sn-type-icon">{icon}</div>
      <div className="sn-type-label">{label}</div>
      <div className="sn-type-score">
        {score}
        <span className="sn-type-score-unit">%</span>
      </div>
    </div>
  );
}

function RadarChart({ profile }: { profile: CustomerProfile }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 75;
  const labels = [
    { key: "functional" as const, label: "機能", angle: -90 },
    { key: "sensory" as const, label: "感性", angle: 30 },
    { key: "experiential" as const, label: "体験", angle: 150 },
  ];

  const toXY = (angle: number, r: number) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  });

  const dataPoints = labels.map((l) => {
    const val = profile[l.key] / 100;
    return toXY(l.angle, maxR * val);
  });

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="sn-radar-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid */}
        {gridLevels.map((level) => {
          const pts = labels
            .map((l) => toXY(l.angle, maxR * level))
            .map((p) => `${p.x},${p.y}`)
            .join(" ");
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth={1}
            />
          );
        })}

        {/* Axes */}
        {labels.map((l) => {
          const end = toXY(l.angle, maxR);
          return (
            <line
              key={l.key}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth={1}
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(0, 138, 183, 0.1)"
          stroke="#008AB7"
          strokeWidth={2}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#008AB7"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
        ))}

        {/* Labels */}
        {labels.map((l) => {
          const pos = toXY(l.angle, maxR + 18);
          return (
            <text
              key={l.key}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#555555"
              fontSize={11}
              fontWeight={500}
            >
              {l.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default function ProfileTab({
  profile,
  conversations,
}: {
  profile: CustomerProfile;
  conversations: ConversationEntry[];
}) {
  const maxScore = Math.max(profile.functional, profile.sensory, profile.experiential);

  const categoryCounts = conversations.reduce(
    (acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (conversations.length === 0) {
    return (
      <div className="sn-empty">
        <div className="sn-empty-icon">👤</div>
        <div className="sn-empty-text">
          会話データが蓄積されると
          <br />
          顧客プロファイルが表示されます
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Customer Type */}
      <div className="sn-card">
        <div className="sn-card-header">
          <span className="sn-card-title">
            <span style={{ fontSize: 15 }}>🎯</span>
            顧客タイプ
          </span>
          <span className="sn-card-badge gold">
            {maxScore === profile.functional
              ? "機能型"
              : maxScore === profile.sensory
              ? "感性型"
              : "体験型"}
          </span>
        </div>

        <div className="sn-profile-type">
          <TypeCard
            icon="⚙️"
            label="機能重視"
            score={profile.functional}
            isDominant={profile.functional === maxScore && maxScore > 0}
          />
          <TypeCard
            icon="🎨"
            label="感性重視"
            score={profile.sensory}
            isDominant={profile.sensory === maxScore && maxScore > 0}
          />
          <TypeCard
            icon="🌟"
            label="体験重視"
            score={profile.experiential}
            isDominant={profile.experiential === maxScore && maxScore > 0}
          />
        </div>

        <RadarChart profile={profile} />
      </div>

      {/* Category Distribution */}
      <div className="sn-card">
        <div className="sn-card-header">
          <span className="sn-card-title">
            <span style={{ fontSize: 15 }}>📊</span>
            会話カテゴリ分布
          </span>
        </div>
        {(Object.keys(CATEGORY_LABELS) as ConversationEntry["category"][]).map(
          (cat) => {
            const count = categoryCounts[cat] || 0;
            const pct =
              conversations.length > 0
                ? Math.round((count / conversations.length) * 100)
                : 0;
            return (
              <div
                key={cat}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span
                  className={`sn-log-tag ${cat}`}
                  style={{ minWidth: 48, textAlign: "center" }}
                >
                  {CATEGORY_LABELS[cat]}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: "rgba(0,0,0,0.04)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      borderRadius: 3,
                      background:
                        cat === "value"
                          ? "#2E9E6E"
                          : cat === "emotion"
                          ? "#D4891C"
                          : cat === "future"
                          ? "#C46084"
                          : cat === "behavior"
                          ? "#6E5EB5"
                          : "#008AB7",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "#9A9A9A",
                    minWidth: 32,
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {count}件
                </span>
              </div>
            );
          }
        )}
      </div>

      {/* Keywords */}
      {profile.allKeywords.length > 0 && (
        <div className="sn-card">
          <div className="sn-card-header">
            <span className="sn-card-title">
              <span style={{ fontSize: 15 }}>🔑</span>
              抽出キーワード
            </span>
          </div>
          <div className="sn-keywords">
            {profile.allKeywords.map((kw, i) => (
              <span
                key={kw}
                className={`sn-keyword ${i < 3 ? "highlight" : ""}`}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
