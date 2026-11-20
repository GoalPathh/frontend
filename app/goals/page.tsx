import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { mapApiDashboard, type GoalDashboard } from "@/lib/goalService";
import { BottomNavigation } from "@/components/bottom-navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { IntentLink } from "@/components/intent-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { GoalsInteractiveHeader, AddGoalButton, CreateFirstGoalButton } from "./client-interactive";
import { ClientGoalCard } from "./client-goal-card";

export default async function GoalsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("goalpath_access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let dashboard: GoalDashboard | null = null;
  let loadError = "";

  try {
    const res = await fetch(`${getApiUrl()}/goals/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        redirect("/login");
      }
      throw new Error(`Request failed with status ${res.status}`);
    }

    const payload = await res.json();
    dashboard = mapApiDashboard(payload.data);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Unable to load goals.";
  }

  // Ensure safe fallbacks if dashboard failed to load
  const safeDashboard = dashboard ?? {
    summary: {
      activeGoals: 0,
      totalHabits: 0,
      totalMinutes: 0,
      averageProgress: 0,
      atRiskGoals: 0,
      completedMilestones: 0,
    },
    strongestGoal: null,
    goals: [],
  };

  const stats = [
    { label: "Active Goals", value: safeDashboard.summary.activeGoals, icon: Target },
    { label: "Daily Habits", value: safeDashboard.summary.totalHabits, icon: CheckCircle2 },
    { label: "Focus Time", value: `${safeDashboard.summary.totalMinutes}m`, icon: Zap },
    { label: "Milestones Done", value: safeDashboard.summary.completedMilestones, icon: Trophy },
  ];

  const strongestGoal = safeDashboard.strongestGoal;
  const strongestProgress = Math.min(100, Math.max(0, Number(strongestGoal?.progress) || 0));

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground lg:pl-[272px] lg:pb-10">
      <AppSidebar active="goals" className="fixed inset-y-0 left-0 z-50 hidden lg:flex" />

      <header className="fixed top-0 z-40 w-full border-b border-border bg-background/80 px-6 py-3 backdrop-blur-xl md:px-10 lg:left-[272px] lg:w-[calc(100%-272px)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-primary">Goals</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle className="size-10 bg-surface/80 dark:bg-surface/10" />
            <GoalsInteractiveHeader />
          </div>
        </div>
      </header>

      <main className="mx-auto mt-[92px] max-w-7xl space-y-6 px-5 md:px-10">
        {loadError && (
          <div className="rounded-2xl border border-coral/20 bg-coral/10 px-5 py-4 text-sm font-semibold text-coral">
            Goals could not be loaded: {loadError}
          </div>
        )}

        <section className="rounded-[24px] border border-border bg-surface p-5 shadow-card sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-center">
            <div>
              <div className="mb-4 inline-flex min-h-10 items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-4 w-4" />
                Goal dashboard
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Build big goals from small daily wins.
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-foreground/60 sm:text-base">
                Track your goals, daily habits, milestones, and progress in one place.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <AddGoalButton />
                <IntentLink
                  href="/today"
                  prefetch
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-extrabold text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary active:translate-y-0"
                >
                  View Today
                </IntentLink>
              </div>

              {safeDashboard.summary.atRiskGoals > 0 && (
                <div className="mt-5 inline-flex items-start gap-2 rounded-2xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {safeDashboard.summary.atRiskGoals} goal{safeDashboard.summary.atRiskGoals > 1 ? "s are" : " is"} currently off pace and may need adjustment.
                </div>
              )}
            </div>

            <div className="rounded-[18px] border border-border bg-background/80 p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-foreground/50">
                Top Momentum
              </p>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">
                    {strongestGoal?.title ?? "No goal yet"}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-foreground/60">
                    {strongestGoal
                      ? `${strongestGoal.habits.length} habits • ${strongestGoal.completedMilestoneCount}/${strongestGoal.milestoneCount} milestones completed`
                      : "Create your first goal to start tracking."}
                  </p>
                </div>
                <div
                  role="progressbar"
                  aria-label="Top goal progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={strongestProgress}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(rgb(var(--primary)) ${strongestProgress * 3.6}deg, rgb(var(--muted)) 0deg)`,
                  }}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-sm font-extrabold text-primary shadow-card">
                    {Math.round(strongestProgress)}%
                  </span>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${strongestProgress}%` }}
                />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-foreground/55">
                <CalendarDays className="h-4 w-4 text-primary" />
                {strongestGoal
                  ? `Target ${new Date(strongestGoal.targetDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`
                  : "No active target yet"}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-[18px] border border-border bg-surface p-5 shadow-card">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">{label}</p>
              <p className="mt-2 text-3xl font-extrabold text-foreground">
                {value}
              </p>
            </article>
          ))}
        </section>

        {!dashboard || dashboard.goals.length === 0 ? (
          <section className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-primary/30 bg-surface p-10 text-center shadow-card">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold text-foreground">No goals yet</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-foreground/60">
              Start with one goal. GoalPath will help you break it into small habits you can actually repeat.
            </p>
            <CreateFirstGoalButton />
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
                Synced with backend SSR
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {dashboard.goals.map((goal) => (
                <ClientGoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNavigation active="goals" />
    </div>
  );
}
