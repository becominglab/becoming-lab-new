"use client";

import { useEffect } from "react";

export default function HideLayout() {
  useEffect(() => {
    // Hide root layout header/footer for standalone app experience
    const header = document.querySelector("body > header, main > header");
    const footer = document.querySelector("body > footer, main > footer");
    const main = document.querySelector("main");

    if (header instanceof HTMLElement) header.style.display = "none";
    if (footer instanceof HTMLElement) footer.style.display = "none";
    if (main instanceof HTMLElement) main.style.paddingTop = "0";
    document.body.style.background = "#0a0e17";

    return () => {
      if (header instanceof HTMLElement) header.style.display = "";
      if (footer instanceof HTMLElement) footer.style.display = "";
      if (main instanceof HTMLElement) main.style.paddingTop = "";
      document.body.style.background = "";
    };
  }, []);

  return null;
}
