"use client";

import { useState } from "react";
import HeroMorningSection from "./HeroMorningSection";
import ResetSection from "./ResetSection";
import FaceSection from "./FaceSection";
import WeaveSection from "./WeaveSection";
import ChallengeSection from "../becoming-os/ChallengeSection";
import CommunitySection from "../becoming-os/CommunitySection";
import StoryArchiveSection from "./StoryArchiveSection";
import BookProjectSection from "./BookProjectSection";

const NAV_ITEMS = [
  { id: "hero", label: "TOP" },
  { id: "reset", label: "整える" },
  { id: "face", label: "向き合う" },
  { id: "weave", label: "紡ぐ" },
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

  return (
    <div className="min-h-screen bg-cream">
      {/* Floating Section Nav */}
      <nav className="sticky top-16 z-30 backdrop-blur-md border-b border-stone-100" style={{ backgroundColor: "rgba(247, 246, 243, 0.92)" }}>
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
        {/* HERO */}
        <div id="section-hero" className="pt-12 pb-16">
          <HeroMorningSection userName={userName} />
        </div>

        <Divider />

        {/* RESET — 整える */}
        <div id="section-reset" className="py-16">
          <ResetSection />
        </div>

        <Divider />

        {/* FACE — 向き合う */}
        <div id="section-face" className="py-16">
          <FaceSection />
        </div>

        <Divider />

        {/* WEAVE — 紡ぐ */}
        <div id="section-weave" className="py-16">
          <WeaveSection />
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

        {/* STORY ARCHIVE */}
        <div id="section-archive" className="py-16">
          <StoryArchiveSection />
        </div>

        <Divider />

        {/* BOOK PROJECT */}
        <div id="section-book" className="py-16">
          <BookProjectSection />
        </div>

        {/* Closing */}
        <div className="py-20 text-center">
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-4"
            style={{ color: "var(--gold, #B8A88A)" }}
          >
            becoming lab
          </p>
          <p
            className="text-sm font-light"
            style={{ color: "var(--ink, #1A1A1A)" }}
          >
            人生は、完成させるものではなく、更新し続けるもの。
          </p>
          <p className="text-xs text-stone-400 mt-2">
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
      <div
        className="w-8 h-px"
        style={{ backgroundColor: "var(--gold, #B8A88A)30" }}
      />
    </div>
  );
}
