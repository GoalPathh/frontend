"use client";

import { useState } from "react";
import {
  BadgeCheck,
  CalendarCheck,
  ChartNoAxesCombined,
  Flame,
  Medal,
  MessageCircle,
  Settings2,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/components/landing/section-heading";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Data arrays
const aiHabits = [
  "Shadow one podcast episode (10 min)",
  "Learn 5 vocab words (3 min)",
  "Speak one sentence out loud (2 min)",
];

const chatLines = [
  { side: "user", body: "I feel too tired to do a full session today." },
  { side: "coach", body: "Switch to the 5-min version. Streak stays alive, no guilt loop." },
  { side: "user", body: "Done. XP updated." },
  { side: "coach", body: "Logged. Tomorrow the plan grow back." },
  { side: "user", body: "Thanks, the streak is safe 🔥" },
  { side: "coach", body: "Always. Rest up, see you tomorrow." },
];

const achievements = [
  { title: "First habit", icon: BadgeCheck },
  { title: "7-day streak", icon: Flame },
  { title: "Goal starter", icon: Medal },
  { title: "Comeback kid", icon: CalendarCheck },
];

// Interactive Demos
function AIPlanDemo() {
  return (
    <div className="w-full max-w-sm rounded-[2rem] border border-border bg-surface p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <header className="mb-6 flex items-center justify-between relative z-10">
        <span className="eyebrow text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          AI plan
        </span>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
          Ready
        </span>
      </header>
      <p className="display text-xl sm:text-2xl font-semibold text-foreground leading-tight relative z-10 mb-8">
        Today, you want to be <em className="not-italic text-primary font-bold">fluent</em>.
      </p>
      <ol className="space-y-3 relative z-10">
        {aiHabits.map((h, i) => (
          <motion.li
            key={h}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.32, 0.72, 0, 1] }}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-background px-4 py-3.5 transition-all duration-300 hover:border-primary/30 hover:bg-surface-2 hover:-translate-y-0.5 cursor-default shadow-sm"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-surface text-xs font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-surface">
              {i + 1}
            </span>
            <span className="text-sm font-semibold text-foreground/90">{h}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function ChatDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-[2rem] border border-primary/20 bg-primary p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
      {chatLines.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.15, type: "spring", stiffness: 200, damping: 20 }}
          className={
            "relative max-w-[85%] rounded-[1.25rem] px-5 py-3.5 text-[14px] font-medium leading-relaxed shadow-sm z-10 " +
            (m.side === "user"
              ? "ml-auto rounded-br-sm bg-surface text-primary"
              : "rounded-bl-sm bg-primary-deep text-surface border border-white/10")
          }
        >
          <div className="mb-1.5 flex items-center gap-1.5 opacity-60">
            <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", m.side === "user" ? "text-primary" : "text-surface")}>
              {m.side === "user" ? "You" : "Coach"}
            </span>
          </div>
          <p className={m.side === "user" ? "text-foreground" : "text-surface/90"}>{m.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

function AdaptiveDemo() {
  return (
    <div className="grid w-full max-w-sm gap-5 rounded-[2rem] bg-primary p-8 text-foreground shadow-2xl relative overflow-hidden">
       <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none" />
      <header className="flex items-center justify-between relative z-10">
        <span className="eyebrow text-[10px] font-bold uppercase tracking-eyebrow opacity-80">
          Today&apos;s intensity
        </span>
        <span className="rounded-full border border-foreground/20 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em]">
          Light mode
        </span>
      </header>
      <p className="display mt-2 text-2xl font-semibold leading-tight relative z-10">
        &ldquo;The habit gets easier when energy is low. The goal stays the same.&rdquo;
      </p>
      <div className="mt-4 relative z-10">
        <div className="h-2.5 overflow-hidden rounded-full bg-foreground/10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "33%" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="h-full rounded-full bg-foreground" 
          />
        </div>
        <ul className="mt-3 grid grid-cols-3 gap-2 numerals text-[11px] font-bold text-foreground/50 text-center">
          <li className="rounded-xl bg-foreground/5 px-2 py-2.5">Easy</li>
          <li className="rounded-xl bg-surface px-2 py-2.5 text-foreground shadow-sm">Light</li>
          <li className="rounded-xl bg-foreground/5 px-2 py-2.5">Full</li>
        </ul>
      </div>
    </div>
  );
}

function ProgressDemo() {
  const heights = [42, 58, 36, 72, 64, 86, 78, 92];
  return (
    <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-[1.4fr_1fr]">
      <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        <header className="mb-8 flex items-center justify-between relative z-10">
          <span className="eyebrow text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Weekly
          </span>
          <span className="numerals text-sm font-extrabold text-foreground">85%</span>
        </header>
        <div className="flex h-28 items-end gap-2 relative z-10">
          {heights.map((h, i) => (
            <motion.span
              key={h + i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.8, delay: 0.1 * i, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 rounded-t-md bg-primary origin-bottom"
              style={{ opacity: i === heights.length - 1 ? 1 : 0.35 + (i / heights.length) * 0.55 }}
            />
          ))}
        </div>
        <dl className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground pt-5 border-t border-border relative z-10">
          <div><dt className="font-bold uppercase tracking-wider text-[9px]">Streak</dt><dd className="numerals mt-1.5 text-base font-extrabold text-foreground">7d</dd></div>
          <div><dt className="font-bold uppercase tracking-wider text-[9px]">XP</dt><dd className="numerals mt-1.5 text-base font-extrabold text-foreground">+250</dd></div>
          <div><dt className="font-bold uppercase tracking-wider text-[9px]">Rank</dt><dd className="numerals mt-1.5 text-base font-extrabold text-foreground">#12</dd></div>
        </dl>
      </div>
      <div className="rounded-[2rem] border border-border bg-background p-6 flex flex-col justify-center shadow-xl">
        <span className="eyebrow text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 block">
          Trophies
        </span>
        <ul className="space-y-3">
          {achievements.slice(0,3).map((a, i) => (
            <motion.li
              key={a.title}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2.5 transition-transform hover:-translate-y-0.5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                <a.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-bold text-foreground">{a.title}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Main Component Structure
const features = [
  {
    id: "ai",
    title: "AI habit breakdown",
    kicker: "Sparkles AI",
    body: "Drop one ambition. Get a 5–10 minute starter habit sized to the day you actually have. No manual planning required.",
    icon: Sparkles,
    demo: AIPlanDemo,
  },
  {
    id: "coach",
    title: "Coach, awake at 2am",
    kicker: "Conversational",
    body: "Anchor chat that helps you simplify hard days — not a fresh reminder you ignore. Always there to negotiate your streak.",
    icon: MessageCircle,
    demo: ChatDemo,
  },
  {
    id: "adaptive",
    title: "Adaptive plan",
    kicker: "Anti-streak-shame",
    body: "When life slips, the plan shrinks. The goal stays. Switch to light mode to protect the habit loop on low-energy days.",
    icon: Settings2,
    demo: AdaptiveDemo,
  },
  {
    id: "progress",
    title: "Progress, observed",
    kicker: "Visible proof",
    body: "Streaks, XP, and weekly momentum. Effort becomes something you can see and hold onto.",
    icon: ChartNoAxesCombined,
    demo: ProgressDemo,
  },
];

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);

  return (
    <section className="section overflow-hidden bg-background" id="features">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            eyebrow="Features"
            title="Everything a tired person needs to stay consistent."
            description="GoalPath focuses on the smallest set of decisions that keep you moving. No bloated dashboard. Just the next right step."
            align="center"
          />
        </motion.div>

        {/* Interactive Split-Screen Layout */}
        <div className="mt-16 grid lg:grid-cols-[5fr_7fr] lg:gap-16 items-center">
          
          {/* LEFT: Feature Tabs */}
          <div className="flex flex-col gap-4 lg:pr-8">
            {features.map((feature) => {
              const isActive = activeFeature === feature.id;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={cn(
                    "group relative flex flex-col items-start gap-3 rounded-[2rem] border p-6 text-left transition-all duration-500 outline-none",
                    isActive 
                      ? "border-primary bg-surface shadow-xl ring-1 ring-primary/20 scale-[1.02]" 
                      : "border-border bg-transparent hover:border-primary/40 hover:bg-surface/50"
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className={cn(
                          "flex size-10 items-center justify-center rounded-xl transition-colors duration-300",
                          isActive ? "bg-primary text-surface" : "bg-muted text-muted-foreground group-hover:text-foreground"
                        )}>
                          <feature.icon className="size-5" />
                        </span>
                        <span className={cn(
                          "eyebrow text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}>
                          {feature.kicker}
                        </span>
                     </div>
                  </div>
                  
                  <div>
                    <h3 className={cn(
                      "display text-xl font-semibold mb-2 transition-colors",
                      isActive ? "text-foreground" : "text-foreground/70"
                    )}>
                      {feature.title}
                    </h3>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm leading-relaxed text-muted-foreground pb-2">
                            {feature.body}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Dynamic Canvas Frame */}
          <div className="relative mt-12 lg:mt-0 flex min-h-[550px] w-full items-center justify-center rounded-[3rem] border border-border bg-surface-2 p-4 sm:p-8 lg:p-12 overflow-hidden shadow-inner">
            {/* Ambient Background Glow based on active item */}
            <div className="absolute inset-0 opacity-30 transition-colors duration-1000" 
              style={{
                background: activeFeature === 'coach' 
                  ? 'radial-gradient(circle at center, rgb(var(--primary)) 0%, transparent 70%)'
                  : activeFeature === 'adaptive'
                  ? 'radial-gradient(circle at center, rgb(var(--accent)) 0%, transparent 70%)'
                  : 'radial-gradient(circle at center, rgb(var(--primary-soft)) 0%, transparent 70%)'
              }}
            />
            
            <AnimatePresence mode="wait">
              {features.map((feature) => {
                if (feature.id !== activeFeature) return null;
                const DemoComponent = feature.demo;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    className="relative z-10 flex w-full justify-center"
                  >
                    <DemoComponent />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
