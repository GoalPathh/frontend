"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyAppearance, getStoredAppearance, resolveAppearance, setStoredAppearance } from "@/lib/theme";
import type { AppearancePreference } from "@/lib/types";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [preference, setPreference] = useState<AppearancePreference>("light");
  const isDark = typeof window !== "undefined" && resolveAppearance(preference) === "dark";

  useEffect(() => {
    const stored = getStoredAppearance();
    setPreference(stored);
    applyAppearance(stored);
  }, []);

  const toggleTheme = () => {
    const nextPreference = isDark ? "light" : "dark";
    setPreference(nextPreference);
    setStoredAppearance(nextPreference);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-card transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary/20 active:translate-y-0",
        className,
      )}
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
