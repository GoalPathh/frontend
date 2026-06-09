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
    <div className="min-h-screen bg-[#f8f9ff] text-[#121221] pb-20 dark:bg-[#121221] dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-10">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9288F8] mb-3">Progress</p>
            <h1 className="text-4xl font-bold tracking-tight text-[#121221]">Track your growth and stay motivated.</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle className="bg-white/80 dark:bg-white/10" />
            <DateRangeSelector selectedRange={range} onChange={setRange} />
          </div>
        </div>

        {emptyState ? (
          <section className="rounded-[32px] border border-[#e4e5f1] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#9288F8]/10 text-[#9288F8]">
              <Activity className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-[#121221] mb-3">No progress data yet.</h2>
            <p className="text-[#6b7280] mb-6">Start your first goal to unlock personalized analytics and streak tracking.</p>
            <button className="rounded-full bg-[#9288F8] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#7a6de4] transition-colors">
              Start Your First Goal
            </button>
          </section>
        ) : (
          <>
            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-8">
              <StatCard
                title="Current Streak"
                value={stats?.currentStreak ?? "—"}
                icon={<Flame className="h-5 w-5 text-[#FB7185]" />}
                accentClass="bg-[#FB7185]/10 text-[#FB7185]"
              />
              <StatCard
                title="Total XP"
                value={stats?.totalXp ?? "—"}
                icon={<Trophy className="h-5 w-5 text-[#FBBF24]" />}
                accentClass="bg-[#FBBF24]/10 text-[#B27A00]"
              />
              <StatCard
                title="Completion Rate"
                value={stats?.completionRate ?? "—"}
                icon={<TrendingUp className="h-5 w-5 text-[#60A5FA]" />}
                accentClass="bg-[#60A5FA]/10 text-[#2563EB]"
              />
              <StatCard
                title="Habits Completed"
                value={stats?.habitsCompleted ?? "—"}
                icon={<CheckCircle2 className="h-5 w-5 text-[#22C55E]" />}
                accentClass="bg-[#22C55E]/10 text-[#166534]"
              />
            </section>

            <section className="mb-8">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6b7280] uppercase tracking-[0.24em]">Goal Performance</p>
                  <h2 className="text-2xl font-bold text-[#121221]">Progress toward your goals</h2>
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
                <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                      <p className="text-sm font-semibold text-[#6b7280] uppercase tracking-[0.24em]">Top Performing Habits</p>
                      <h3 className="text-xl font-bold text-[#121221]">Your best habits</h3>
                    </div>
                    <Sparkles className="h-6 w-6 text-[#9288F8]" />
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
                <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#6b7280] uppercase tracking-[0.24em]">Achievements</p>
                      <h3 className="text-xl font-bold text-[#121221]">Unlocked badges</h3>
                    </div>
                    <Sparkles className="h-6 w-6 text-[#FBBF24]" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {achievements.map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </div>
                </div>
                <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#6b7280] uppercase tracking-[0.24em]">AI Insights</p>
                      <h3 className="text-xl font-bold text-[#121221]">Smart guidance</h3>
                    </div>
                    <BrainCog className="h-6 w-6 text-[#9288F8]" />
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
