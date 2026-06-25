"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BrainCog,
  CalendarDays,
  CheckCircle2,
  Flame,
  Sparkles,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { DateRangeSelector } from "@/components/progress/date-range-selector";
import { StatCard } from "@/components/progress/stat-card";
import { GoalProgressCard } from "@/components/progress/goal-progress-card";
import { ConsistencyChart } from "@/components/progress/consistency-chart";
import { HabitRankingCard } from "@/components/progress/habit-ranking-card";
import { ActivityHeatmap } from "@/components/progress/activity-heatmap";
import { AchievementCard } from "@/components/progress/achievement-card";
import { AIInsightCard } from "@/components/progress/ai-insight-card";
import { BottomNavigation } from "@/components/bottom-navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { progressService, type ProgressOverview } from "@/lib/progressService";
import { personaService } from "@/lib/personaService";
import { PersonaCard } from "@/components/progress/persona-card";
import type { DateRange, PersonaResponse } from "@/lib/types";

const DEFAULT_RANGE: DateRange = "last-7-days";

export default function ProgressPage() {
  const [range, setRange] = useState<DateRange>(DEFAULT_RANGE);
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [persona, setPersona] = useState<PersonaResponse | null>(null);
  const [personaLoading, setPersonaLoading] = useState(false);
  const [personaWindowDays, setPersonaWindowDays] = useState<number>(14);
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState<"idle" | "ok" | "error">("idle");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setFetchStatus("idle");
      setPersonaLoading(true);

      try {
        const [progressData, personaData] = await Promise.all([
          progressService.getOverview(range),
          personaService.get(personaWindowDays),
        ]);

        if (cancelled) return;

        setOverview(progressData);
        setPersona(personaData);
        setFetchStatus("ok");
      } catch (error) {
        console.error("[progress-page] fetch failed:", error);
        if (!cancelled) setFetchStatus("error");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setPersonaLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [range, reloadKey, personaWindowDays]);

  useEffect(() => {
    function onFocus() {
      setReloadKey((key) => key + 1);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
      return () => window.removeEventListener("focus", onFocus);
    }
  }, []);

  const handleRefreshPersona = async () => {
    setPersonaLoading(true);
    const fresh = await personaService.refresh(personaWindowDays);
    setPersona(fresh);
    setPersonaLoading(false);
  };

  const handleWindowDaysChange = (nextWindowDays: number) => {
    setPersonaWindowDays(nextWindowDays);
  };

  const summary = overview?.summary;
  const stats = overview?.stats;
  const goals = overview?.goals ?? [];
  const series = overview?.series ?? [];
  const habits = overview?.habits ?? [];
  const heatmap = overview?.heatmap ?? [];
  const achievements = overview?.achievements ?? [];
  const insights = overview?.insights ?? [];
  const emptyState = !loading && overview !== null && summary?.activeGoals === 0 && goals.length === 0;

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground lg:pl-[272px] lg:pb-10">
      <AppSidebar active="progress" className="fixed inset-y-0 left-0 z-50 hidden lg:flex" />

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-10">
        <div className="mb-8 flex justify-end">
          <ThemeToggle className="bg-surface/80 dark:bg-surface/10" />
        </div>

        {fetchStatus === "error" && !overview && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-coral/30 bg-coral/5 px-4 py-3 text-sm text-coral">
            <span>Backend tidak terjangkau. Progress belum bisa dimuat.</span>
            <button
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex items-center gap-1.5 rounded-full bg-coral px-3 py-1.5 text-[11px] font-extrabold text-white"
            >
              Coba lagi
            </button>
          </div>
        )}

        <section className="relative mb-6 overflow-hidden rounded-[24px] border border-border bg-surface p-5 shadow-card sm:p-7 lg:p-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-sky/12 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                <TrendingUp className="h-4 w-4" />
                Progress dashboard
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                See what is working, then repeat it.
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-foreground/60 sm:text-base">
                Review streaks, goal momentum, habit consistency, and action signals from your real progress data.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-extrabold text-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {range.replace(/-/g, " ")}
                </span>
                <a
                  href="/goals"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-extrabold text-foreground transition hover:border-primary hover:text-primary"
                >
                  Manage goals
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {summary && summary.atRiskGoals > 0 && (
                <div className="mt-5 inline-flex items-start gap-2 rounded-2xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {summary.atRiskGoals} goal{summary.atRiskGoals > 1 ? "s are" : " is"} behind pace in the current view.
                </div>
              )}
            </div>

            <DateRangeSelector selectedRange={range} onChange={setRange} />
          </div>
        </section>

        <section className="mb-6" data-testid="persona-card">
          <PersonaCard
            persona={persona}
            loading={personaLoading}
            onRefresh={handleRefreshPersona}
            windowDays={personaWindowDays}
            onWindowDaysChange={handleWindowDaysChange}
          />
        </section>

        {loading && !overview ? (
          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-[18px] border border-border bg-surface" />
              ))}
            </section>
            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
              <div className="h-[320px] animate-pulse rounded-[20px] border border-border bg-surface" />
              <div className="grid gap-6">
                <div className="h-[240px] animate-pulse rounded-[20px] border border-border bg-surface" />
                <div className="h-[240px] animate-pulse rounded-[20px] border border-border bg-surface" />
              </div>
            </section>
          </div>
        ) : emptyState ? (
          <section className="rounded-[32px] border border-border bg-surface p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Activity className="h-10 w-10" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-foreground">No progress data yet.</h2>
            <p className="mb-6 text-foreground/60">
              Start your first goal to unlock progress analytics, streak tracking, and habit rankings.
            </p>
            <a
              href="/goals/add"
              className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              Start Your First Goal
            </a>
          </section>
        ) : overview ? (
          <>
            <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Current Streak"
                value={stats?.currentStreak ?? "0 Days"}
                icon={<Flame className="h-5 w-5 text-coral" />}
                accentClass="bg-coral/10 text-coral"
              />
              <StatCard
                title="Total XP"
                value={stats?.totalXp ?? "0 XP"}
                icon={<Trophy className="h-5 w-5 text-gold" />}
                accentClass="bg-gold/10 text-[#8a6100]"
              />
              <StatCard
                title="Completion Rate"
                value={stats?.completionRate ?? "0%"}
                icon={<TrendingUp className="h-5 w-5 text-sky" />}
                accentClass="bg-sky/10 text-sky"
              />
              <StatCard
                title="Habits Completed"
                value={stats?.habitsCompleted ?? "0"}
                icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                accentClass="bg-primary/10 text-primary"
              />
            </section>

            <section className="mb-6 rounded-[24px] border border-border bg-surface p-5 shadow-card sm:p-6">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary">
                    Goal Performance
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold text-foreground">
                    Progress toward your goals
                  </h2>
                </div>
                <div className="rounded-full border border-border bg-background px-4 py-2 text-sm font-bold text-foreground/60">
                  {summary?.completedGoals ?? 0} completed • {summary?.atRiskGoals ?? 0} at risk
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {goals.map((goal) => (
                  <GoalProgressCard key={goal.id} goal={goal} />
                ))}
              </div>
            </section>

            <section className="mb-6 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
              <ConsistencyChart series={series} />

              <div className="grid gap-6">
                <div className="rounded-[20px] border border-border bg-surface p-5 shadow-card">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary">
                        Top Performing Habits
                      </p>
                      <h3 className="mt-2 text-xl font-extrabold text-foreground">Your best habits</h3>
                    </div>
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>

                  <div className="space-y-4">
                    {habits.length === 0 ? (
                      <div className="rounded-[18px] border border-dashed border-border bg-background p-4 text-sm text-foreground/60">
                        No completed habit pattern yet in this range.
                      </div>
                    ) : (
                      habits.map((habit, index) => (
                        <HabitRankingCard key={habit.id} rank={index + 1} habit={habit} />
                      ))
                    )}
                  </div>
                </div>

                <ActivityHeatmap days={heatmap} />
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="grid gap-6">
                <div className="rounded-[20px] border border-border bg-surface p-5 shadow-card">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary">Achievements</p>
                      <h3 className="mt-2 text-xl font-extrabold text-foreground">Unlocked badges</h3>
                    </div>
                    <Sparkles className="h-6 w-6 text-gold" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {achievements.map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </div>
                </div>

                <div className="rounded-[20px] border border-border bg-surface p-5 shadow-card">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary">AI Insights</p>
                      <h3 className="mt-2 text-xl font-extrabold text-foreground">Smart guidance</h3>
                    </div>
                    <BrainCog className="h-6 w-6 text-primary" />
                  </div>

                  <div className="grid gap-4">
                    {insights.map((insight) => (
                      <AIInsightCard key={insight.id} insight={insight} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>

      <BottomNavigation active="progress" />
    </div>
  );
}
