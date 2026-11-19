"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { GoalDetailTrigger } from "@/components/goals/goal-detail-trigger";
import { AchievementCard } from "@/components/progress/achievement-card";
import { AIInsightCard } from "@/components/progress/ai-insight-card";
import { BottomNavigation } from "@/components/bottom-navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { IntentLink } from "@/components/intent-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { progressService, type ProgressOverview } from "@/lib/progressService";
import { personaService } from "@/lib/personaService";
import { PersonaCard } from "@/components/progress/persona-card";
import { USER_PROFILE_EVENT } from "@/lib/userService";
import type { DateRange, PersonaResponse } from "@/lib/types";

const DEFAULT_RANGE: DateRange = "last-7-days";
const progressCache = new Map<DateRange, ProgressOverview>();
let cachedPersona: PersonaResponse | null = null;

export default function ProgressPage() {
  const [range, setRange] = useState<DateRange>(DEFAULT_RANGE);
  const [overview, setOverview] = useState<ProgressOverview | null>(() => progressCache.get(DEFAULT_RANGE) ?? null);
  const [persona, setPersona] = useState<PersonaResponse | null>(cachedPersona);
  const [personaLoading, setPersonaLoading] = useState(cachedPersona === null);
  const [personaWindowDays, setPersonaWindowDays] = useState<number>(14);
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState<"idle" | "ok" | "error">("idle");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setFetchStatus("idle");
      setPersonaLoading(cachedPersona === null);

      try {
        const [progressData, personaData] = await Promise.all([
          progressService.getOverview(range),
          personaService.get(personaWindowDays),
        ]);

        if (cancelled) return;

        setOverview(progressData);
        progressCache.set(range, progressData);
        setPersona(personaData);
        cachedPersona = personaData;
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
    const clearAccountData = (event: Event) => {
      if ((event as CustomEvent<unknown>).detail !== null) return;
      progressCache.clear();
      cachedPersona = null;
      setOverview(null);
      setPersona(null);
      setLoading(true);
    };
    window.addEventListener(USER_PROFILE_EVENT, clearAccountData);
    return () => window.removeEventListener(USER_PROFILE_EVENT, clearAccountData);
  }, []);

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

      <header className="fixed top-0 z-40 w-full border-b border-border bg-background/80 px-6 py-3 backdrop-blur-xl md:px-10 lg:left-[272px] lg:w-[calc(100%-272px)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-primary">Progress</h1>
          <ThemeToggle className="size-10 bg-surface/80 dark:bg-surface/10" />
        </div>
      </header>

      <main className="mx-auto mt-[92px] max-w-7xl px-5 md:px-10">

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

        <section className="mb-6 rounded-[24px] border border-border bg-surface p-5 shadow-card sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-center">
            <div>
              <div className="mb-4 inline-flex min-h-10 items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
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
                <IntentLink
                  href="/goals"
                  prefetch
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-extrabold text-foreground transition hover:border-primary hover:text-primary"
                >
                  Manage goals
                  <ArrowRight className="h-4 w-4" />
                </IntentLink>
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
            <Link
              href="/goals/add"
              className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              Start Your First Goal
            </Link>
          </section>
        ) : overview ? (
          <>
            <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Current Streak"
                value={stats?.currentStreak ?? "0 Days"}
                icon={<Flame className="h-5 w-5 text-primary" />}
                accentClass="bg-primary/10 text-primary"
              />
              <StatCard
                title="Total XP"
                value={stats?.totalXp ?? "0 XP"}
                icon={<Trophy className="h-5 w-5 text-primary" />}
                accentClass="bg-primary/10 text-primary"
              />
              <StatCard
                title="Completion Rate"
                value={stats?.completionRate ?? "0%"}
                icon={<TrendingUp className="h-5 w-5 text-primary" />}
                accentClass="bg-primary/10 text-primary"
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
                  <GoalDetailTrigger
                    key={goal.id}
                    goalId={goal.id}
                    preview={{ title: goal.title, progress: goal.progress, targetDate: goal.targetDate }}
                    className="block"
                    onChanged={() => setReloadKey((key) => key + 1)}
                  >
                    <GoalProgressCard goal={goal} />
                  </GoalDetailTrigger>
                ))}
              </div>
            </section>

            <section className="mb-6 grid gap-6 xl:grid-cols-[1.35fr_0.85fr] xl:items-start">
              <div className="grid gap-6">
                <ConsistencyChart series={series} />

                <div className="rounded-[20px] border border-border bg-surface p-5 shadow-card">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary">Achievements</p>
                      <h3 className="mt-2 text-xl font-extrabold text-foreground">Unlocked badges</h3>
                    </div>
                    <Sparkles className="h-6 w-6 text-primary" />
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
          </>
        ) : null}
      </main>

      <BottomNavigation active="progress" />
    </div>
  );
}
