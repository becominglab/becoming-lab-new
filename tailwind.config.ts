import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a2e",
        secondary: "#16213e",
        accent: "#e94560",
        background: "#fafafa",
        "text-main": "#333333",
      },
      fontFamily: {
        sans: ["Noto Sans JP", "Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Noto Sans JP", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
