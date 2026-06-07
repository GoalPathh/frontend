"use client";

import Link from "next/link";
import { Moon, Sun, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function AuthHeader() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-2 font-extrabold">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-card">
          <Target className="size-5" aria-hidden="true" />
        </span>
        <span className="text-lg tracking-tight">GoalPath</span>
      </Link>

      <Button
        variant="secondary"
        className="size-11 px-0"
        onClick={() => setIsDark((current) => !current)}
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>
    </header>
  );
}

