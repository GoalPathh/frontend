"use client";

import { Moon, Sun } from "lucide-react";
import { setStoredAppearance } from "@/lib/theme";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const toggleTheme = () => {
    const nextPreference = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    setStoredAppearance(nextPreference);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-card transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary/20 active:translate-y-0",
        className,
      )}
    >
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
    </button>
  );
}
