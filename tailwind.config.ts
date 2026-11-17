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
        surface: "var(--bg-surface, #111115)",
        "bg-surface": "var(--bg-surface, #111115)",
        "bg-surface-elevated": "var(--bg-surface-elevated, #17171C)",
        "bg-surface-hover": "var(--bg-surface-hover, #1D1D24)",
        "accent-purple": "var(--accent-purple, #AF52DE)",
        "accent-cyan": "var(--accent-cyan, #21D4FD)",
        "accent-amber": "var(--accent-amber, #F59E0B)",
        "border-subtle": "var(--border-subtle, rgba(255, 255, 255, 0.08))",
        "border-active": "var(--border-active, rgba(255, 255, 255, 0.18))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: [
          "var(--font-jetbrains-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
