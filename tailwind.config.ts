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
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          2: "rgb(var(--surface-2) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--foreground) / 0.62)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          soft: "rgb(var(--primary-soft) / <alpha-value>)",
          deep: "rgb(var(--primary-deep) / <alpha-value>)",
        },
        accent: "rgb(var(--accent) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        // Legacy coral/sky/gold — kept as semantic tokens (still rally around
        // accent "amber" being the only true accent on landing). Used only
        // where meaning demands them (motivation/streak/clarity).
        gold: "rgb(var(--accent) / <alpha-value>)",
        sky: "rgb(82 152 236 / <alpha-value>)",
        coral: "rgb(255 138 128 / <alpha-value>)",
      },
      boxShadow: {
        soft: "0 18px 40px -16px rgb(var(--foreground) / 0.18)",
        card: "0 2px 0 rgb(var(--border))",
        ring: "0 0 0 1px rgb(var(--border))",
        lift: "0 22px 48px -20px rgb(var(--primary) / 0.32)",
        glow: "0 0 0 1px rgb(var(--accent) / 0.4), 0 24px 60px -28px rgb(var(--accent) / 0.6)",
      },
      borderRadius: {
        card: "var(--r-card)",
        panel: "var(--r-panel)",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-bricolage)", "var(--font-jakarta)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        eyebrow: "0.18em",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
