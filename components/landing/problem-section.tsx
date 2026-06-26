"use client";

import { useState } from "react";
import { BellOff, Goal, Repeat2, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const problems = [
  {
    title: "Consistency collapses",
    description:
      "Skip one day, the rest follows. Quit is the default — recovery isn't. The friction of starting over outweighs the memory of momentum.",
    icon: Repeat2,
  },
  {
    title: "Goals too big to start",
    description:
      "The plan sounds great on Sunday. By Wednesday the motivation is gone. Ambition is intoxicating, but execution requires ground-level simplicity.",
    icon: Goal,
  },
  {
    title: "Distractions win",
    description:
      "Another reminder is another thing to ignore attention was already on. Notifications become white noise when they lack immediate context.",
    icon: BellOff,
  },
  {
    title: "No visible proof",
    description:
      "Effort without visible score feels wasted. Motivation follows observation. When progress remains invisible, giving up feels inconsequential.",
    icon: TrendingDown,
  },
] as const;

export function ProblemSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section
      className="section bg-surface"
      id="problem"
      aria-labelledby="problem-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          {/* sticky-feel trailing heading column */}
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <p className="eyebrow text-[11px] font-bold uppercase tracking-eyebrow text-accent">
              The honest part
            </p>
            <h2
              id="problem-heading"
              className="display mt-4 text-[clamp(2rem,1.4rem+2.5vw,3.5rem)] font-semibold text-foreground leading-[1.05]"
            >
              Why most goals
              <br />
              <span className="text-muted-foreground/60">quietly die.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Habit research is clear on this: the failure isn&apos;t willpower
              — it&apos;s design. Default expectations assume a perfect day.
              Real days are messier than that.
            </p>
          </div>

          {/* interactive accordion list */}
          <div className="flex flex-col gap-4">
            {problems.map((p, i) => {
              const isActive = activeIndex === i;
              
              return (
                <div 
                  key={p.title}
                  data-reveal
                  style={{ transitionDelay: `${i * 100}ms` }}
                  className={cn(
                    "group relative overflow-hidden rounded-[1.5rem] border bg-background transition-all duration-500",
                    isActive 
                      ? "border-primary/30 shadow-[0_8px_30px_-12px_rgba(115,80,255,0.15)] ring-1 ring-primary/20" 
                      : "border-border hover:border-primary/20 hover:bg-surface-2"
                  )}
                >
                  {/* Subtle gradient background when active */}
                  <div 
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent transition-opacity duration-500",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />

                  <button
                    onClick={() => setActiveIndex(isActive ? null : i)}
                    className="relative flex w-full items-center justify-between p-6 sm:p-8 text-left outline-none"
                    aria-expanded={isActive}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
                        isActive 
                          ? "border-primary/20 bg-primary/10 text-primary" 
                          : "border-border bg-surface text-muted-foreground group-hover:text-foreground"
                      )}>
                        <p.icon className="size-5" aria-hidden="true" />
                      </div>
                      <h3 className={cn(
                        "display text-xl font-semibold transition-colors duration-300",
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}>
                        {p.title}
                      </h3>
                    </div>
                    
                    <span className="hidden numerals text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground sm:block">
                      0{i + 1}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="relative px-6 pb-8 pt-2 sm:px-8 sm:pl-[5.25rem]">
                          {/* Accent line */}
                          <div className="absolute left-[3.25rem] top-0 h-full w-[2px] bg-primary/20 sm:left-14" />
                          <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
                            {p.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
