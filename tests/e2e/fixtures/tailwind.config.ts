import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0B0B0E",
        surface: "#151518",
        "surface-elevated": "#19191C",
        "accent-yellow": "#FCED3A",
        "accent-purple": "#AF52DE",
        "accent-cyan": "#21D4FD",
        "accent-pink": "#FF2A85",
        "accent-emerald": "#10B981",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
