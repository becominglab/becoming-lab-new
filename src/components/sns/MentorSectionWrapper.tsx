"use client";

import { useState } from "react";
import MentorSection from "./MentorSection";

export default function MentorSectionWrapper({ isMentor: initial }: { isMentor: boolean }) {
  const [isMentor, setIsMentor] = useState(initial);

  async function handleToggle(val: boolean) {
    setIsMentor(val);
    await fetch("/api/sns/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_mentor: val }),
    });
  }

  return <MentorSection isMentor={isMentor} onToggleMentor={handleToggle} />;
}
