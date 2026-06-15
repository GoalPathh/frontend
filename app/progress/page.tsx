"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowRight, BrainCog, CalendarDays, CheckCircle2, Flame, Sparkles, Trophy, TrendingUp } from "lucide-react";
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
import { progressService } from "@/lib/progressService";
import type { DateRange, GoalProgress, HabitPerformance, Insight, ProgressStats, Achievement } from "@/lib/types";

const DEFAULT_RANGE: DateRange = "last-7-days";

export default function ProgressPage() {
  const [range, setRange] = useState<DateRange>(DEFAULT_RANGE);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [goals, setGoals] = useState<GoalProgress[]>([]);
  const [series, setConsistencySeries] = useState<Awaited<ReturnType<typeof progressService.getConsistencySeries>>>([]);
  const [habits, setHabits] = useState<HabitPerformance[]>([]);
  const [heatmap, setHeatmapArr] = useState<Awaited<ReturnType<typeof progressService.getHeatmapData>>>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState<"idle" | "ok" | "error">("idle");
  const [reloadKey, setReloadKey] = useState(0);

  async function fetchAll(signal?: { cancelled: boolean }) {
    setLoading(true);
    setFetchStatus("idle");
    try {
      const [s, g, ser, h, hm, ach, ins] = await Promise.all([
        progressService.getProgressStats(range),
        progressService.getGoalPerformance(range),
        progressService.getConsistencySeries(range),
        progressService.getHabitPerformance(range),
        progressService.getHeatmapData(range),
        progressService.getAchievements(range),
        progressService.getInsights(range),
      ]);
      if (signal?.cancelled) return;
      // Only commit non-error fallbacks as last-resort.
      setStats(s);
      setGoals(g);
      setConsistencySeries(ser);
      setHabits(h);
      setHeatmapArr(hm);
      setAchievements(ach);
      setInsights(ins);
      const anyActivity =
        (g && g.length > 0) ||
        (s && s.habitsCompleted && s.habitsCompleted !== "0");
      setFetchStatus(anyActivity ? "ok" : "ok");
    } catch (e) {
      console.error("[progress-page] fetch failed:", e);
      if (!signal?.cancelled) setFetchStatus("error");
    } finally {
      if (!signal?.cancelled) setLoading(false);
    }
  }

  useEffect(() => {
    const signal = { cancelled: false };
    fetchAll(signal);
    return () => { signal.cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, reloadKey]);

  // Refetch when the tab regains focus (handles transient "Failed to fetch" cleanly)
  useEffect(() => {
    function onFocus() {
      setReloadKey((k) => k + 1);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
      return () => window.removeEventListener("focus", onFocus);
    }
  }, []);

  const emptyState = !stats && goals.length === 0 && series.length === 0 && habits.length === 0 && heatmap.length === 0;

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground dark:bg-background dark:text-white lg:pl-[272px] lg:pb-10">
      <AppSidebar active="progress" className="fixed inset-y-0 left-0 z-50 hidden lg:flex" />
      <div className="max-w-7xl mx-auto px-5 py-8 md:px-10">
        <div className="mb-8 flex justify-end">
          <ThemeToggle className="bg-surface/80 dark:bg-surface/10" />
        </div>

        {emptyState ? (
          <section className="rounded-[32px] border border-border bg-surface p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Activity className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">No progress data yet.</h2>
            <p className="text-foreground/60 mb-6">Start your first goal to unlock personalized analytics and streak tracking.</p>
            <a href="/goals/add" className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors">
              Start Your First Goal
            </a>
          </section>
        ) : (
          <>
            {fetchStatus === "error" && goals.length === 0 && (
              <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-coral/30 bg-coral/5 px-4 py-3 text-sm text-coral">
                <span>
                  Backend tidak terjangkau — menampilkan data kosong.
                </span>
                <button
                  onClick={() => setReloadKey((k) => k + 1)}
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
                    Review streaks, goal momentum, habit consistency, and AI insights across the date range that matters.
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
                </div>

                <DateRangeSelector selectedRange={range} onChange={setRange} />
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
              <StatCard
                title="Current Streak"
                value={stats?.currentStreak ?? "—"}
                icon={<Flame className="h-5 w-5 text-coral" />}
                accentClass="bg-coral/10 text-coral"
              />
              <StatCard
                title="Total XP"
                value={stats?.totalXp ?? "—"}
                icon={<Trophy className="h-5 w-5 text-gold" />}
                accentClass="bg-gold/10 text-[#8a6100]"
              />
              <StatCard
                title="Completion Rate"
                value={stats?.completionRate ?? "—"}
                icon={<TrendingUp className="h-5 w-5 text-sky" />}
                accentClass="bg-sky/10 text-sky"
              />
              <StatCard
                title="Habits Completed"
                value={stats?.habitsCompleted ?? "—"}
                icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                accentClass="bg-primary/10 text-primary"
              />
            </section>

            <section className="mb-6 rounded-[24px] border border-border bg-surface p-5 shadow-card sm:p-6">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-primary uppercase tracking-[0.24em]">Goal Performance</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-foreground">Progress toward your goals</h2>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {goals.map((goal) => (
                  <GoalProgressCard key={goal.id} goal={goal} />
                ))}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr] mb-6">
              <ConsistencyChart series={series} />
              <div className="grid gap-6">
                <div className="rounded-[20px] border border-border bg-surface p-5 shadow-card">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                      <p className="text-[10px] font-extrabold text-primary uppercase tracking-[0.24em]">Top Performing Habits</p>
                      <h3 className="mt-2 text-xl font-extrabold text-foreground">Your best habits</h3>
                    </div>
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-4">
                    {habits.map((habit, index) => (
                      <HabitRankingCard key={habit.id} rank={index + 1} habit={habit} />
                    ))}
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
                      <p className="text-[10px] font-extrabold text-primary uppercase tracking-[0.24em]">Achievements</p>
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
                      <p className="text-[10px] font-extrabold text-primary uppercase tracking-[0.24em]">AI Insights</p>
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
            <BottomNavigation active="progress" />
          </>
        )}
      </div>
    </div>
  );
}
