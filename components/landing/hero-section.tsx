"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const tickerMoments = [
  { value: "7d", label: "streak alive", tone: "primary" },
  { value: "+12", label: "XP earned just now", tone: "accent" },
  { value: "92%", label: "weekly completion", tone: "primary" },
  { value: "3/3", label: "habits done today", tone: "primary" },
] as const;

function useTicker(intervalMs: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setI((p) => (p + 1) % tickerMoments.length),
      intervalMs,
    );
    return () => clearInterval(t);
  }, [intervalMs]);
  return i;
}

function HabitTicker() {
  const moment = useTicker(2600);
  const item = tickerMoments[moment];
  return (
    <div className="pointer-events-none absolute -left-3 top-12 z-20 hidden w-44 lg:block">
      <div
        key={moment}
        className="ticker-item glass-surface flex items-center gap-3 rounded-card border-l-4 border-l-primary px-4 py-3"
      >
        <span
          aria-hidden="true"
          className={cn(
            "size-2.5 shrink-0 rounded-full",
            item.tone === "accent" ? "bg-accent" : "bg-primary",
          )}
        />
        <div className="min-w-0 leading-tight">
          <p className="numerals text-sm font-extrabold text-foreground">
            {item.value}
          </p>
          <p className="truncate text-[11px] font-bold text-muted-foreground">
            {item.label}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="page-band relative flex min-h-[100svh] items-center px-4 pb-16 pt-24 sm:px-6 lg:px-10">
      {/* hairline divider at top of section marks editorial entrance */}
      <div
        aria-hidden="true"
        className="hairline absolute inset-x-4 top-20 sm:inset-x-6 lg:inset-x-10"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[7fr_5fr]">
        {/* LEFT — headline column */}
        <div className="mx-auto max-w-2xl lg:mx-0">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-eyebrow text-foreground shadow-card">
            <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
            For ambitious quiet hustlers
          </p>

          <h1 className="display text-[clamp(2.75rem,1.6rem+5vw,5.25rem)] text-foreground">
            Small steps,
            <br />
            <span
              className="relative inline-block whitespace-nowrap text-primary"
              aria-label="real changes"
            >
              real changes
              <svg
                viewBox="0 0 220 14"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-3 w-full text-accent"
              >
                <path
                  d="M2 9 C 60 2, 140 2, 218 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            GoalPath breaks your biggest goal into a single small habit that
            fits the day you actually have — and an AI coach who&apos;s awake at
            2am when the streak almost dies.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="/register"
              className="group inline-flex min-h-12 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-bold text-surface shadow-lift transition duration-200 hover:-translate-y-0.5 hover:bg-primary-deep focus:outline-none focus:ring-4 focus:ring-primary/30 active:translate-y-0"
            >
              Start your first goal
              <ArrowUpRight
                className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-sm font-bold text-foreground underline decoration-muted decoration-2 underline-offset-[6px] transition hover:decoration-primary"
            >
              See how it works
            </a>
          </div>

          {/* accessible, low-key social proof line */}
          <p className="mt-8 numerals text-xs font-bold text-muted-foreground">
            <span className="text-foreground">2,400+</span> goals started this
            week
            <span aria-hidden="true" className="mx-2 text-accent">
              ·
            </span>
            <span className="text-foreground">No credit card</span>
          </p>
        </div>

        {/* RIGHT — phone mockup with floating ticker */}
        <div className="relative mx-auto w-full max-w-md lg:pb-8">
          <div className="relative">
            <PhoneMockup />
            <HabitTicker />
          </div>

          {/* secondary floating stat — single, restrained */}
          <div className="absolute -bottom-6 -right-2 hidden lg:block">
            <div className="float-soft-delay glass-surface rounded-card border-l-4 border-l-accent px-4 py-3">
              <p className="numerals text-base font-extrabold text-foreground">
                85%
              </p>
              <p className="text-[11px] font-bold text-muted-foreground">
                completion rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* bottom hairline — editorial finish */}
      <div
        aria-hidden="true"
        className="hairline absolute inset-x-4 bottom-12 sm:inset-x-6 lg:inset-x-10"
      />
    </section>
  );
}

import { PhoneMockup } from "./phone-mockup";
