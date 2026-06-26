"use client";

import { useRef } from "react";
import { Bot, CalendarCheck, Flag, Repeat2, Star } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const workflow = [
  {
    title: "Name the goal",
    body: "Type one ambition in plain language. No templates, no setup wizard.",
    icon: Flag,
  },
  {
    title: "AI breaks it down",
    body: "We split it into a 5–10 minute starter habit sized to your real schedule.",
    icon: Bot,
  },
  {
    title: "Daily micro-actions",
    body: "Tap today's one task. We surface it where your phone already lives.",
    icon: CalendarCheck,
  },
  {
    title: "Recover, don't restart",
    body: "Miss a day? Plan shrinks, goal doesn't. Streak resets, momentum stays.",
    icon: Repeat2,
  },
  {
    title: "Earn the proof",
    body: "XP, streaks, and badges make visible what otherwise feels invisible.",
    icon: Star,
  },
] as const;

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress purely over the section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Smooth out the scroll value so it feels premium and weighty
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section
      className="section border-y border-border bg-surface"
      id="how-it-works"
      aria-labelledby="how-heading"
      ref={containerRef}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16 items-start">
          
          {/* LEFT: Sticky Navigation Info */}
          <div className="flex flex-col gap-10 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="eyebrow text-[11px] font-bold uppercase tracking-eyebrow text-accent">
                How it works
              </p>
              <h2
                id="how-heading"
                className="display mt-4 text-[clamp(2rem,1.4rem+2.5vw,3rem)] font-semibold text-foreground leading-[1.05]"
              >
                From ambition
                <br />
                <span className="text-muted-foreground/60">to a single tap.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                No streak-shaming. No 47-step onboarding. The product is five
                moments — each takes less than a minute.
              </p>
            </motion.div>

            <div className="relative flex flex-col hidden lg:flex mt-4 pl-4">
              {/* Vertical line track */}
              <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-border/50 rounded-full" />
              
              {/* Animated active indicator line tied to scroll */}
              <motion.div
                className="absolute left-0 top-0 w-[2px] bg-primary rounded-full origin-top"
                style={{ scaleY: smoothProgress }}
              />

              {workflow.map((step, i) => {
                // Calculate thresholds for when this specific step should light up
                const stepStart = i / workflow.length;
                const stepEnd = (i + 1) / workflow.length;
                
                // Map the scroll progress to opacity and styling values
                const opacity = useTransform(smoothProgress, [stepStart - 0.1, stepStart, stepEnd, stepEnd + 0.1], [0.4, 1, 1, 0.4]);
                const xOffset = useTransform(smoothProgress, [stepStart - 0.1, stepStart, stepEnd, stepEnd + 0.1], [0, 8, 8, 0]);

                return (
                  <motion.div
                    key={`nav-${step.title}`}
                    style={{ opacity, x: xOffset }}
                    className="flex items-center gap-5 px-6 py-4 text-left relative"
                  >
                    <span className="numerals text-xs font-extrabold opacity-50">
                      0{i + 1}
                    </span>
                    <span className="display text-lg font-semibold tracking-wide text-foreground">
                      {step.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Scrollable Content List */}
          <div className="relative flex w-full flex-col gap-10 pb-32">
            {workflow.map((step, i) => (
              <motion.div 
                key={`card-${step.title}`}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-border p-8 sm:p-10 transition-all duration-500 hover:shadow-[0_8px_30px_-12px_rgba(115,80,255,0.15)] hover:-translate-y-1 bg-surface-2"
              >
                {/* Subtle internal gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Background numeral watermark */}
                <span className="absolute -right-4 -top-8 text-[150px] font-black leading-none text-muted opacity-10 select-none group-hover:opacity-20 transition-opacity duration-500">
                  {i + 1}
                </span>

                <div className="relative z-10 flex flex-col h-full">
                  <header className="flex items-start justify-between gap-4 mb-8">
                     <div className="flex size-14 items-center justify-center rounded-[1rem] shadow-sm transition-transform duration-300 group-hover:scale-110 border border-primary/20 bg-background/50 backdrop-blur-md">
                       <step.icon className="size-6 text-primary" />
                     </div>
                     <span className="rounded-full border border-border bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground shadow-sm">
                       Step 0{i + 1}
                     </span>
                  </header>

                  <h3 className="display mb-4 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="max-w-md text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}