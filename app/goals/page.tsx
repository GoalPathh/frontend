"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, Flame, Plus, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { Goal } from "@/lib/types";
import { goalService } from "@/lib/goalService";
import { GoalCard } from "@/components/goals/goal-card";
import { BottomNavigation } from "@/components/bottom-navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    goalService.getGoalsFromApi()
      .then(setGoals)
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Unable to load goals."));
  }, []);

  const handleAddGoal = () => {
    router.push("/goals/add");
  };

  const totalHabits = goals.reduce((sum, goal) => sum + goal.habits.length, 0);
  const totalMinutes = goals.reduce((sum, goal) => sum + goal.habits.reduce((habitSum, habit) => habitSum + habit.duration, 0), 0);
  const averageProgress = goals.length ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0;
  const strongestGoal = goals.reduce<Goal | null>((best, goal) => (!best || goal.progress > best.progress ? goal : best), null);

  const stats = [
    { label: "Active Goals", value: goals.length, icon: Target, tone: "bg-primary/10 text-primary" },
    { label: "Daily Habits", value: totalHabits, icon: CheckCircle2, tone: "bg-sky/10 text-sky" },
    { label: "Focus Time", value: `${totalMinutes}m`, icon: Zap, tone: "bg-gold/20 text-[#8a6100]" },
    { label: "Avg Progress", value: `${averageProgress}%`, icon: Trophy, tone: "bg-coral/12 text-coral" },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground dark:bg-background lg:pl-[272px] lg:pb-10">
      <AppSidebar active="goals" className="fixed inset-y-0 left-0 z-50 hidden lg:flex" />
      <header className="fixed top-0 z-40 w-full border-b border-border bg-background/90 px-6 py-4 backdrop-blur-xl dark:border-surface/10 dark:bg-background/90 md:px-10 lg:left-[272px] lg:w-[calc(100%-272px)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Goals</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle className="size-10 bg-surface/80 dark:bg-surface/10" />
            <button
              onClick={handleAddGoal}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Goal</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mt-24 px-5 md:px-10 max-w-7xl mx-auto space-y-8">
        {loadError && (
          <div className="rounded-2xl border border-coral/20 bg-coral/10 px-5 py-4 text-sm font-semibold text-coral">
            Goals could not be loaded: {loadError}
          </div>
        )}
        <section className="relative overflow-hidden rounded-[24px] border border-border bg-surface p-5 shadow-card sm:p-7 lg:p-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-gold/14 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-4 w-4" />
                Goal dashboard
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Build big goals from small daily wins.
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-foreground/60 sm:text-base">
                Track every goal, habit, reminder, and progress signal in one focused place. Keep the plan realistic and easy to continue.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAddGoal}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0"
                >
                  Add New Goal
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="/today"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-extrabold text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary active:translate-y-0"
                >
                  View Today
                </a>
              </div>
            </div>

            <div className="rounded-[20px] border border-border bg-background/80 p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-foreground/50">Top Momentum</p>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">{strongestGoal?.title ?? "No goal yet"}</h3>
                  <p className="mt-2 text-sm font-semibold text-foreground/60">
                    {strongestGoal ? `${strongestGoal.habits.length} active habits` : "Create your first goal to start tracking."}
                  </p>
                </div>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[10px] border-primary/20 bg-surface text-lg font-extrabold text-primary shadow-card">
                  {strongestGoal?.progress ?? 0}%
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-primary via-sky to-gold" style={{ width: `${strongestGoal?.progress ?? 0}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <article key={label} className="rounded-[18px] border border-border bg-surface p-5 shadow-card">
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-foreground/50">{label}</p>
              <p className="mt-2 text-3xl font-extrabold text-foreground">{value}</p>
            </article>
          ))}
        </section>

        {goals.length === 0 ? (
          <section className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-primary/30 bg-surface p-10 text-center shadow-card">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold text-foreground">No goals yet</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-foreground/60">
              Start with one goal. GoalPath will help you break it into small habits you can actually repeat.
            </p>
            <button
              onClick={handleAddGoal}
              className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              Create Your First Goal
            </button>
          </section>
        ) : (
          <section className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary">Your active plan</p>
                <h2 className="mt-2 text-2xl font-extrabold text-foreground">Goals in progress</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold text-foreground/60">
                <CalendarDays className="h-4 w-4 text-primary" />
                Updated today
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNavigation active="goals" />
    </div>
  );
}
