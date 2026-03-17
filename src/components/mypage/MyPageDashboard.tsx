"use client";

import { useState, useCallback } from "react";
import HeroMorningSection from "./HeroMorningSection";
import ResetSection from "./ResetSection";
import FaceSection from "./FaceSection";
import WeaveSection from "./WeaveSection";
import ActionMeaningSection from "./ActionMeaningSection";
import ChallengeSection from "../becoming-os/ChallengeSection";
import CommunitySection from "../becoming-os/CommunitySection";
import StoryArchiveSection from "./StoryArchiveSection";
import BookProjectSection from "./BookProjectSection";

const NAV_ITEMS = [
  { id: "hero", label: "TOP" },
  { id: "reset", label: "整える" },
  { id: "face", label: "向き合う" },
  { id: "weave", label: "紡ぐ" },
  { id: "action", label: "ACTION" },
  { id: "challenge", label: "CHALLENGE" },
  { id: "community", label: "COMMUNITY" },
  { id: "archive", label: "STORY" },
  { id: "book", label: "BOOK" },
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

  const scrollToWrite = useCallback(() => {
    const el = document.getElementById("face-journal");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      {/* Floating Section Nav */}
      <nav
        className="sticky top-16 z-30 backdrop-blur-md border-b border-stone-100/60"
        style={{ backgroundColor: "rgba(247, 246, 243, 0.92)" }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-[10px] tracking-[0.12em] px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  activeSection === item.id
                    ? "text-white"
                    : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
                }`}
                style={
                  activeSection === item.id
                    ? { backgroundColor: "var(--navy, #1C2D3F)" }
                    : undefined
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Sections */}
      <div className="max-w-2xl mx-auto px-6 md:px-8">
        {/* 1. HERO — Morning Ritual */}
        <div id="section-hero" className="pt-12 pb-8">
          <HeroMorningSection userName={userName} onScrollToWrite={scrollToWrite} />
        </div>

        <SectionDivider />

        {/* 2. RESET — 整える */}
        <div id="section-reset" className="py-12">
          <ResetSection />
        </div>

        <SectionDivider />

        {/* 3. FACE — 向き合う */}
        <div id="section-face" className="py-12">
          <FaceSection />
        </div>

        <SectionDivider />

        {/* 4. WEAVE — 紡ぐ */}
        <div id="section-weave" className="py-12">
          <WeaveSection />
        </div>

        <SectionDivider />

        {/* 5. ACTION — 行動の意味 */}
        <div id="section-action" className="py-12">
          <ActionMeaningSection />
        </div>

        <SectionDivider />

        {/* 6. CHALLENGE */}
        <div id="section-challenge" className="py-12">
          <ChallengeSection />
        </div>

        <SectionDivider />

        {/* 7. COMMUNITY */}
        <div id="section-community" className="py-12">
          <CommunitySection />
        </div>

        <SectionDivider />

        {/* 8. STORY ARCHIVE */}
        <div id="section-archive" className="py-12">
          <StoryArchiveSection />
        </div>

        <SectionDivider />

        {/* 9. BOOK PROJECT */}
        <div id="section-book" className="py-12">
          <BookProjectSection />
        </div>

        {/* 10. FOOTER PHILOSOPHY */}
        <div className="py-20 text-center">
          <div
            className="w-8 h-px mx-auto mb-8"
            style={{ backgroundColor: "var(--gold, #B8A88A)" }}
          />
          <p
            className="text-sm font-light leading-loose"
            style={{ color: "var(--ink, #1A1A1A)" }}
          >
            人生は、完成させるものではなく、
            <br />
            更新し続けるもの。
          </p>
          <p className="text-xs text-stone-400 mt-4">
            あなたの物語は、まだ途中です。
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="w-6 h-px bg-stone-200/60" />
    </div>
  );
}
