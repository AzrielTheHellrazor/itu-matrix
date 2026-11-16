import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--bg-canvas, #0B0B0E)",
        "bg-canvas": "var(--bg-canvas, #0B0B0E)",
        surface: "var(--bg-surface, #151518)",
        "bg-surface": "var(--bg-surface, #151518)",
        "bg-surface-elevated": "var(--bg-surface-elevated, #19191C)",
        "bg-surface-hover": "var(--bg-surface-hover, #212126)",
        "bg-toolbar": "var(--bg-toolbar, #26262B)",
        "accent-yellow": "var(--accent-yellow, #FCED3A)",
        "accent-purple": "var(--accent-purple, #AF52DE)",
        "accent-cyan": "var(--accent-cyan, #21D4FD)",
        "accent-pink": "var(--accent-pink, #FF2A85)",
        "accent-emerald": "var(--accent-emerald, #10B981)",
        "accent-blue": "var(--accent-blue, #36A3F7)",
        "border-subtle": "var(--border-subtle, rgba(255, 255, 255, 0.1))",
        "border-active": "var(--border-active, rgba(255, 255, 255, 0.2))",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
