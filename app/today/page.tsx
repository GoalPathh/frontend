"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  Droplet,
  Edit3,
  Flame,
  Globe2,
  Menu,
  Mic,
  Moon,
  Quote,
  Sparkles,
  Sun,
  Target,
  Utensils,
  Zap,
} from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsPanel } from "@/components/notifications-panel";

export default function TodayPage() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
  <div className="min-h-screen bg-background text-foreground antialiased dark:bg-background dark:text-white lg:pl-[272px]">
      <AppSidebar active="today" className="fixed inset-y-0 left-0 z-50 hidden lg:flex" />
      <nav className="fixed top-0 z-40 w-full border-b border-border bg-background/80 px-6 py-3 backdrop-blur-xl dark:border-surface/10 dark:bg-background/80 md:px-10 lg:left-[272px] lg:w-[calc(100%-272px)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/me" className="text-primary active:scale-95 duration-200 lg:hidden" aria-label="Open profile">
              <Menu className="h-6 w-6" />
            </a>
            <h1 className="text-xl font-bold text-primary tracking-tight">Today</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle className="size-10 bg-surface/80 dark:bg-surface/10" />
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((current) => !current)}
                className="relative flex size-10 items-center justify-center rounded-full border border-border bg-surface/80 text-primary shadow-card transition hover:-translate-y-0.5 active:translate-y-0"
                aria-label="Open notifications"
                aria-expanded={showNotifications}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(89,79,187,0.4)]" />
              </button>
              <NotificationsPanel open={showNotifications} onClose={() => setShowNotifications(false)} />
            </div>
          </div>
        </div>
      </nav>

      <main className="mt-[92px] px-5 md:px-10 max-w-7xl mx-auto space-y-6 pb-32">
        <header className="relative overflow-hidden rounded-[24px] border border-border bg-surface p-5 shadow-card sm:p-7 lg:p-8">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-gold/14 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                <CalendarDays className="h-4 w-4" />
                Today plan
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Hi Rahma 👋</h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-foreground/60 sm:text-base">
                Keep today simple: finish the next small habit, protect your streak, and let the plan stay realistic.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href="/coach" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0">
                  Start Focus
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="/goals" className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-extrabold text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary active:translate-y-0">
                  Adjust Plan
                </a>
              </div>
            </div>

            <div className="rounded-[18px] border border-border bg-background/80 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-foreground/50">Completion</p>
                  <p className="mt-2 text-4xl font-extrabold text-foreground">68%</p>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-[10px] border-primary/20 bg-surface text-lg font-extrabold text-primary shadow-card">
                  2/7
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-primary via-sky to-gold" />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground/60">Two habits done. One more keeps momentum strong.</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[20px] glass-card p-5 border border-border shadow-card sm:p-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-[80px]" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Current Goals</h3>
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="truncate">English Fluency</span>
                  <span className="text-[10px] uppercase text-foreground/60">75%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="w-[75%] h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="truncate">Lose Weight</span>
                  <span className="text-[10px] uppercase text-foreground/60">40%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="w-[40%] h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="truncate">Learn 5 Vocab</span>
                  <span className="text-[10px] uppercase text-foreground/60">20%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="w-[20%] h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="truncate">Read 10 Min</span>
                  <span className="text-[10px] uppercase text-foreground/60">0%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="w-[0%] h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" />
                </div>
              </div>
            </div>
            <a href="/goals" className="block w-full rounded-xl gradient-btn py-3 text-center text-xs font-bold uppercase tracking-[0.24em] text-white shadow-md transition active:scale-[0.98]">
              View Strategy
            </a>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[18px] glass-card border border-border p-5 shadow-sm">
            <Flame className="mx-auto h-10 w-10 text-orange-500" />
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.24em] text-foreground/60 font-bold">7d Streak</p>
          </div>
          <div className="rounded-[18px] glass-card border border-border p-5 shadow-sm">
            <Sparkles className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.24em] text-foreground/60 font-bold">320 XP</p>
          </div>
          <div className="rounded-[18px] glass-card border border-border p-5 shadow-sm">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary shadow-sm">
              68%
            </div>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.24em] text-foreground/60 font-bold">Done</p>
          </div>
        </div>

        <section className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Today's Habits</h2>
            <span className="text-[10px] uppercase tracking-[0.32em] text-primary font-bold">2 / 7 COMPLETED</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#5a5d72]">
              <Sun className="h-5 w-5 text-orange-500" />
              <span className="text-[10px] uppercase tracking-[0.28em] font-bold">Morning Routine</span>
            </div>
            <div className="space-y-2.5">
              <button className="w-full glass-panel rounded-[18px] p-4 sm:p-5 flex items-center justify-between text-left active:scale-[0.99] transition-transform border border-border">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-base text-[#5a5d72] line-through opacity-60 font-medium">Shadowing 10 min</span>
                </div>
                <Globe2 className="h-5 w-5 text-[#5a5d72]" />
              </button>
              <button className="w-full rounded-[18px] glass-card border border-border p-4 sm:p-5 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-transform hover:border-primary/40">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#5a5d72]/30" />
                  <span className="text-base font-semibold text-foreground">Drink 500ml Water</span>
                </div>
                <Droplet className="h-5 w-5 text-[#5a5d72]" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground/60">
              <Target className="h-5 w-5 text-yellow-600" />
              <span className="text-[10px] uppercase tracking-[0.28em] font-bold">Noon Focus</span>
            </div>
            <div className="space-y-2.5">
              <button className="w-full glass-panel rounded-[18px] p-4 sm:p-5 flex items-center justify-between text-left active:scale-[0.99] transition-transform border border-border">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-base text-foreground/60 line-through opacity-60 font-medium">Learn 5 vocabulary words</span>
                </div>
                <BookOpen className="h-5 w-5 text-foreground/60" />
              </button>
              <button className="w-full rounded-[18px] glass-card border border-border p-4 sm:p-5 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-transform hover:border-primary/40">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground/30" />
                  <span className="text-base font-semibold text-foreground">Healthy Lunch</span>
                </div>
                <Utensils className="h-5 w-5 text-foreground/60" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground/60">
              <Moon className="h-5 w-5 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.28em] font-bold">Evening Reflection</span>
            </div>
            <div className="space-y-2.5">
              <button className="w-full rounded-[18px] glass-card border border-border p-4 sm:p-5 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-transform hover:border-primary/40">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground/30" />
                  <span className="text-base font-semibold text-foreground">Speaking practice</span>
                </div>
                <Mic className="h-5 w-5 text-foreground/60" />
              </button>
              <button className="w-full rounded-[18px] glass-card border border-border p-4 sm:p-5 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-transform hover:border-primary/40">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground/30" />
                  <span className="text-base font-semibold text-foreground">Review vocabulary</span>
                </div>
                <BookOpen className="h-5 w-5 text-foreground/60" />
              </button>
              <button className="w-full rounded-[18px] glass-card border border-border p-4 sm:p-5 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-transform hover:border-primary/40">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground/30" />
                  <span className="text-base font-semibold text-foreground">Journaling</span>
                </div>
                <Edit3 className="h-5 w-5 text-foreground/60" />
              </button>
            </div>
          </div>
        </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className="rounded-[20px] border border-border bg-surface p-5 shadow-card">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary">Focus Queue</p>
              <div className="mt-5 space-y-3">
                {[
                  ["Now", "Drink 500ml Water", "2 min"],
                  ["Next", "Healthy Lunch", "15 min"],
                  ["Later", "Speaking practice", "10 min"],
                ].map(([time, title, duration]) => (
                  <div key={title} className="flex items-center justify-between gap-3 rounded-[14px] border border-border bg-background p-3">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">{time}</p>
                      <p className="mt-1 text-sm font-extrabold text-foreground">{title}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">{duration}</span>
                  </div>
                ))}
              </div>
            </section>

        <div className="rounded-[20px] glass-card border border-primary/20 p-6 shadow-sm flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
            <Quote className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] font-bold text-primary mb-1">
              Daily Motivation
            </p>
            <p className="text-sm italic font-medium text-foreground/60">
              "Success is the sum of small efforts, repeated day-in and day-out."
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/70">
              — Robert Collier
            </p>
          </div>
        </div>
          </aside>
        </div>
      </main>

      <BottomNavigation active="today" />
    </div>
  );
}
