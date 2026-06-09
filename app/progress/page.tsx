"use client";

import { useEffect, useState } from "react";
import { Activity, BrainCog, CheckCircle2, Flame, Sparkles, Trophy, TrendingUp } from "lucide-react";
import { DateRangeSelector } from "@/components/progress/date-range-selector";
import { StatCard } from "@/components/progress/stat-card";
import { GoalProgressCard } from "@/components/progress/goal-progress-card";
import { ConsistencyChart } from "@/components/progress/consistency-chart";
import { HabitRankingCard } from "@/components/progress/habit-ranking-card";
import { ActivityHeatmap } from "@/components/progress/activity-heatmap";
import { AchievementCard } from "@/components/progress/achievement-card";
import { AIInsightCard } from "@/components/progress/ai-insight-card";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { progressService } from "@/lib/progressService";
import type { DateRange, GoalProgress, HabitPerformance, Insight, ProgressStats, Achievement } from "@/lib/types";

const DEFAULT_RANGE: DateRange = "last-7-days";

export default function ProgressPage() {
  const [range, setRange] = useState<DateRange>(DEFAULT_RANGE);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [goals, setGoals] = useState<GoalProgress[]>([]);
  const [series, setSeries] = useState(progressService.getConsistencySeries(DEFAULT_RANGE));
  const [habits, setHabits] = useState<HabitPerformance[]>([]);
  const [heatmap, setHeatmap] = useState(progressService.getHeatmapData(DEFAULT_RANGE));
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    setStats(progressService.getProgressStats(range));
    setGoals(progressService.getGoalPerformance(range));
    setSeries(progressService.getConsistencySeries(range));
    setHabits(progressService.getHabitPerformance(range));
    setHeatmap(progressService.getHeatmapData(range));
    setAchievements(progressService.getAchievements(range));
    setInsights(progressService.getInsights(range));
  }, [range]);

  const emptyState = !stats && goals.length === 0 && series.length === 0 && habits.length === 0 && heatmap.length === 0;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 dark:bg-background dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-10">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary mb-3">Progress</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Track your growth and stay motivated.</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle className="bg-surface/80 dark:bg-surface/10" />
            <DateRangeSelector selectedRange={range} onChange={setRange} />
          </div>
        </div>

        {emptyState ? (
          <section className="rounded-[32px] border border-border bg-surface p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Activity className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">No progress data yet.</h2>
            <p className="text-foreground/60 mb-6">Start your first goal to unlock personalized analytics and streak tracking.</p>
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors">
              Start Your First Goal
            </button>
          </section>
        ) : (
          <>
            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-8">
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

            <section className="mb-8">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground/60 uppercase tracking-[0.24em]">Goal Performance</p>
                  <h2 className="text-2xl font-bold text-foreground">Progress toward your goals</h2>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {goals.map((goal) => (
                  <GoalProgressCard key={goal.id} goal={goal} />
                ))}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr] mb-8">
              <ConsistencyChart series={series} />
              <div className="grid gap-6">
                <div className="rounded-[28px] border border-border bg-surface p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                      <p className="text-sm font-semibold text-foreground/60 uppercase tracking-[0.24em]">Top Performing Habits</p>
                      <h3 className="text-xl font-bold text-foreground">Your best habits</h3>
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
                <div className="rounded-[28px] border border-border bg-surface p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground/60 uppercase tracking-[0.24em]">Achievements</p>
                      <h3 className="text-xl font-bold text-foreground">Unlocked badges</h3>
                    </div>
                    <Sparkles className="h-6 w-6 text-gold" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {achievements.map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </div>
                </div>
                <div className="rounded-[28px] border border-border bg-surface p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground/60 uppercase tracking-[0.24em]">AI Insights</p>
                      <h3 className="text-xl font-bold text-foreground">Smart guidance</h3>
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
