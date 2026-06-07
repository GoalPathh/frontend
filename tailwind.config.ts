import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        primarySoft: "rgb(var(--primary-soft) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        sky: "rgb(var(--sky) / <alpha-value>)",
        coral: "rgb(var(--coral) / <alpha-value>)",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(18, 18, 33, 0.09)",
        card: "0 12px 30px rgba(18, 18, 33, 0.07)",
      },
      borderRadius: {
        card: "18px",
        panel: "28px",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
