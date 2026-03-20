"use client";

import { useState, useCallback } from "react";
import HideLayout from "@/components/sales-navigator/HideLayout";
import TopBar from "@/components/sales-navigator/TopBar";
import SessionBanner from "@/components/sales-navigator/SessionBanner";
import PhaseBar from "@/components/sales-navigator/PhaseBar";
import BottomNav from "@/components/sales-navigator/BottomNav";
import ConversationTab from "@/components/sales-navigator/ConversationTab";
import ProfileTab from "@/components/sales-navigator/ProfileTab";
import ProposalTab from "@/components/sales-navigator/ProposalTab";
import QuickConceptTab from "@/components/sales-navigator/QuickConceptTab";
import ScoreTab from "@/components/sales-navigator/ScoreTab";
import NewSessionModal from "@/components/sales-navigator/NewSessionModal";

export type ConversationEntry = {
  id: string;
  text: string;
  category: "situation" | "behavior" | "emotion" | "value" | "future";
  keywords: string[];
  timestamp: Date;
  insight?: string;
};

export type CustomerProfile = {
  functional: number;
  sensory: number;
  experiential: number;
  allKeywords: string[];
};

export type Suggestion = {
  question: string;
  reason: string;
};

export type SessionData = {
  customerName: string;
  purpose: string;
  startTime: Date;
};

const PHASES = [
  "アイスブレイク",
  "状況ヒアリング",
  "深掘り",
  "価値観発見",
  "提案",
  "クロージング",
];

export default function SalesNavigatorPage() {
  const [activeTab, setActiveTab] = useState<"conversation" | "profile" | "quick" | "proposal" | "score">("conversation");
  const [session, setSession] = useState<SessionData | null>(null);
  const [showNewSession, setShowNewSession] = useState(true);
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>({
    functional: 0,
    sensory: 0,
    experiential: 0,
    allKeywords: [],
  });
  const [currentPhase, setCurrentPhase] = useState(0);
  const [depthScore, setDepthScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartSession = useCallback((name: string, purpose: string) => {
    setSession({ customerName: name, purpose, startTime: new Date() });
    setShowNewSession(false);
    setConversations([]);
    setSuggestions([]);
    setCustomerProfile({ functional: 0, sensory: 0, experiential: 0, allKeywords: [] });
    setCurrentPhase(0);
    setDepthScore(0);
  }, []);

  const handleAnalyze = useCallback(async (text: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/sales/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          conversationHistory: conversations.map((c) => ({
            category: c.category,
            text: c.text,
          })),
          customerProfile,
        }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const analysis = await res.json();

      const newEntry: ConversationEntry = {
        id: crypto.randomUUID(),
        text,
        category: analysis.category,
        keywords: analysis.keywords || [],
        timestamp: new Date(),
        insight: analysis.insight,
      };

      setConversations((prev) => [...prev, newEntry]);

      if (analysis.suggestions) {
        setSuggestions(analysis.suggestions);
      }

      if (analysis.customerType) {
        setCustomerProfile((prev) => {
          const count = conversations.length + 1;
          const blend = (old: number, next: number) =>
            Math.round((old * (count - 1) + next) / count);
          return {
            functional: blend(prev.functional, analysis.customerType.functional),
            sensory: blend(prev.sensory, analysis.customerType.sensory),
            experiential: blend(prev.experiential, analysis.customerType.experiential),
            allKeywords: [
              ...new Set([...prev.allKeywords, ...(analysis.keywords || [])]),
            ],
          };
        });
      }

      if (analysis.depthScore) {
        setDepthScore(analysis.depthScore);
        if (analysis.depthScore < 20) setCurrentPhase(0);
        else if (analysis.depthScore < 35) setCurrentPhase(1);
        else if (analysis.depthScore < 50) setCurrentPhase(2);
        else if (analysis.depthScore < 70) setCurrentPhase(3);
        else if (analysis.depthScore < 85) setCurrentPhase(4);
        else setCurrentPhase(5);
      }
    } catch {
      // Fallback: use local classification
      const categories: ConversationEntry["category"][] = [
        "situation", "behavior", "emotion", "value", "future",
      ];
      const keywords = text
        .split(/[\s、。,.]/)
        .filter((w) => w.length >= 2)
        .slice(0, 4);

      const newEntry: ConversationEntry = {
        id: crypto.randomUUID(),
        text,
        category: categories[Math.min(conversations.length, 4)],
        keywords,
        timestamp: new Date(),
      };
      setConversations((prev) => [...prev, newEntry]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [conversations, customerProfile]);

  const handleEndSession = useCallback(() => {
    setShowNewSession(true);
    setSession(null);
  }, []);

  if (showNewSession) {
    return (
      <div className="sn-app">
        <HideLayout />
        <TopBar isActive={false} />
        <NewSessionModal
          onStart={handleStartSession}
        />
      </div>
    );
  }

  return (
    <div className="sn-app">
      <HideLayout />
      <TopBar isActive={!!session} />

      {session && (
        <>
          <SessionBanner session={session} onEnd={handleEndSession} />
          <PhaseBar phases={PHASES} currentPhase={currentPhase} />
        </>
      )}

      <div className="sn-content">
        {activeTab === "conversation" && (
          <ConversationTab
            conversations={conversations}
            suggestions={suggestions}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
          />
        )}
        {activeTab === "profile" && (
          <ProfileTab
            profile={customerProfile}
            conversations={conversations}
          />
        )}
        {activeTab === "quick" && (
          <QuickConceptTab />
        )}
        {activeTab === "proposal" && (
          <ProposalTab
            conversations={conversations}
            profile={customerProfile}
          />
        )}
        {activeTab === "score" && (
          <ScoreTab
            depthScore={depthScore}
            conversations={conversations}
            profile={customerProfile}
            currentPhase={currentPhase}
            phases={PHASES}
          />
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
