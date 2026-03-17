"use client";

import { useState } from "react";
import TodaySection from "../becoming-os/TodaySection";
import ActionSection from "../becoming-os/ActionSection";
import ReflectionSection from "../becoming-os/ReflectionSection";
import ChallengeSection from "../becoming-os/ChallengeSection";
import CommunitySection from "../becoming-os/CommunitySection";
import StorySection from "../becoming-os/StorySection";
import DeclarationSection from "../becoming-os/DeclarationSection";

const NAV_ITEMS = [
  { id: "today", label: "TODAY" },
  { id: "action", label: "ACTION" },
  { id: "reflection", label: "REFLECTION" },
  { id: "challenge", label: "CHALLENGE" },
  { id: "community", label: "COMMUNITY" },
  { id: "story", label: "STORY" },
] as const;

interface MyPageDashboardProps {
  userName?: string | null;
}

export default function MyPageDashboard({ userName }: MyPageDashboardProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(`section-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Floating Section Nav */}
      <nav className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-[10px] tracking-[0.15em] px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  activeSection === item.id
                    ? "bg-gray-900 text-white"
                    : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Sections */}
      <div className="max-w-2xl mx-auto px-6 md:px-8">
        {/* TODAY */}
        <div id="section-today" className="pt-12 pb-16">
          <TodaySection userName={userName} />
        </div>

        <Divider />

        {/* ACTION */}
        <div id="section-action" className="py-16">
          <ActionSection />
        </div>

        <Divider />

        {/* REFLECTION */}
        <div id="section-reflection" className="py-16">
          <ReflectionSection />
        </div>

        <Divider />

        {/* CHALLENGE */}
        <div id="section-challenge" className="py-16">
          <ChallengeSection />
        </div>

        <Divider />

        {/* COMMUNITY */}
        <div id="section-community" className="py-16">
          <CommunitySection />
        </div>

        <Divider />

        {/* STORY & DECLARATION */}
        <div id="section-story" className="py-16">
          <StorySection />
        </div>

        <div className="py-16">
          <DeclarationSection />
        </div>

        {/* Footer Message */}
        <div className="py-20 text-center">
          <p className="text-[10px] tracking-[0.35em] text-stone-300 uppercase mb-4">
            BECOMING OS
          </p>
          <p className="text-sm text-stone-400 font-light">
            人生は、完成させるものではなく、更新し続けるもの。
          </p>
          <p className="text-xs text-stone-300 mt-2">
            あなたの物語は、まだ途中です。
          </p>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="w-8 h-px bg-stone-200" />
    </div>
  );
}
