"use client";

const TABS = [
  { id: "conversation" as const, icon: "💬", label: "会話" },
  { id: "profile" as const, icon: "👤", label: "分析" },
  { id: "quick" as const, icon: "⚡", label: "イメージ" },
  { id: "proposal" as const, icon: "✨", label: "AI提案" },
  { id: "score" as const, icon: "📊", label: "スコア" },
];

export default function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: "conversation" | "profile" | "quick" | "proposal" | "score") => void;
}) {
  return (
    <div className="sn-bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`sn-bottom-btn ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="sn-bottom-btn-icon">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
