import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Flame,
  Moon,
  Sparkles,
  Sun,
  Target,
} from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { IntentLink } from "@/components/intent-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { TimeRange } from "@/lib/types";
import { getApiUrl } from "@/lib/api";
import { TodayHabit, TodayPlan, TodayProfile } from "@/lib/todayService";
import { TodayInteractiveClient } from "./client-interactive";

const timeRangeMeta: Record<TimeRange, { label: string; Icon: typeof Sun; className: string }> = {
  morning: { label: "Morning Routine", Icon: Sun, className: "text-orange-500" },
  afternoon: { label: "Noon Focus", Icon: Target, className: "text-yellow-600" },
  evening: { label: "Evening Reflection", Icon: Moon, className: "text-primary" },
  anytime: { label: "Anytime", Icon: Clock3, className: "text-sky" },
};

const goalCardVisuals: Record<string, { gradient: string; symbol: string }> = {
  language: { gradient: "from-sky-500 via-cyan-500 to-blue-700", symbol: "🌍" },
  fitness: { gradient: "from-rose-500 via-orange-500 to-amber-400", symbol: "💪" },
  skills: { gradient: "from-violet-500 via-indigo-500 to-blue-600", symbol: "🎯" },
  creativity: { gradient: "from-fuchsia-500 via-pink-500 to-rose-400", symbol: "🎨" },
  learning: { gradient: "from-emerald-500 via-teal-500 to-cyan-600", symbol: "📚" },
  other: { gradient: "from-primary via-sky to-gold", symbol: "⭐" },
};

function greetingName(profile: TodayProfile | null) {
  const name = profile?.name?.trim();
  if (name) return name.split(" ")[0];

  const username = profile?.username?.trim();
  if (username) return username.replace(/^@/, "");

  return "there";
}

function groupHabitsByTime(habits: TodayHabit[]) {
  return habits.reduce<Record<TimeRange, TodayHabit[]>>(
    (groups, habit) => {
      groups[habit.schedule.timeRange].push(habit);
      return groups;
    },
    { morning: [], afternoon: [], evening: [], anytime: [] },
  );
}

export default async function TodayPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("goalpath_access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  // Fallback to UTC offset for SSR, client components handle real time.
  const tzOffset = -420;
  
  let plan: TodayPlan | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(`${getApiUrl()}/today?tzOffset=${tzOffset}`, {
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
      throw new Error(`Failed to fetch today data: ${res.status}`);
    }

    const payload = await res.json();
    plan = payload.data as TodayPlan;
  } catch (err) {
    error = (err as Error).message;
  }

  const todayHabits = plan?.habits ?? [];
  const groupedHabits = groupHabitsByTime(todayHabits);
  const profile = plan?.profile ?? null;
  const summary = plan?.summary;
  const completedCount = summary?.completedHabits ?? 0;
  const totalHabits = summary?.totalHabits ?? 0;
  const completionRate = summary?.completionRate ?? 0;
  const activeGoals = plan?.goals ?? [];
  const focusQueue = plan?.focusQueue ?? [];
  const xp = summary?.totalXp ?? profile?.xp ?? 0;
  const streak = summary?.currentStreak ?? profile?.streak_days ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased dark:bg-background dark:text-white lg:pl-[272px]">
      <AppSidebar active="today" className="fixed inset-y-0 left-0 z-50 hidden lg:flex" />
      <nav className="fixed top-0 z-40 w-full border-b border-border bg-background/80 px-6 py-3 backdrop-blur-xl dark:border-surface/10 dark:bg-background/80 md:px-10 lg:left-[272px] lg:w-[calc(100%-272px)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight text-primary">Today</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle className="size-10 bg-surface/80 dark:bg-surface/10" />
            <TodayInteractiveClient />
          </div>
        </div>
      </nav>

      <main className="mx-auto mt-[92px] max-w-7xl space-y-6 px-5 pb-32 md:px-10">
        {error && (
          <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        <header className="relative overflow-hidden rounded-[24px] border border-border bg-surface p-5 shadow-card sm:p-7 lg:p-8">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-gold/14 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                <CalendarDays className="h-4 w-4" />
                Today plan
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Hi {greetingName(profile)}
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-foreground/60 sm:text-base">
                {summary?.message ?? "Loading today's plan..."}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/coach" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0">
                  Start Focus
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <IntentLink href="/goals" prefetch className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-extrabold text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary active:translate-y-0">
                  Adjust Plan
                </IntentLink>
              </div>
            </div>

            <div className="rounded-[18px] border border-border bg-background/80 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-foreground/50">Completion</p>
                  <p className="mt-2 text-4xl font-extrabold text-foreground">{completionRate}%</p>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-[10px] border-primary/20 bg-surface text-lg font-extrabold text-primary shadow-card">
                  {completedCount}/{totalHabits}
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-primary via-sky to-gold transition-all" style={{ width: `${completionRate}%` }} />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground/60">{summary?.message ?? "No summary yet."}</p>
            </div>
          </div>
        </header>

        <section aria-label="Goal widgets" className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary">Your learning path</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">My Goals</h2>
            </div>
            <IntentLink href="/goals" prefetch className="text-sm font-bold text-primary transition hover:text-primary/75">
              Manage goals
            </IntentLink>
          </div>

          {activeGoals.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {activeGoals.map((goal) => {
                const progress = Math.min(100, Math.max(0, Number(goal.progress) || 0));
                const visual = goalCardVisuals[goal.category] ?? goalCardVisuals.other;

                return (
                  <article key={goal.id} className="rounded-[20px] border border-border bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
                    <div className={`relative flex h-32 items-start justify-between overflow-hidden rounded-[15px] bg-gradient-to-br ${visual.gradient} p-4`}>
                      <div className="absolute -right-8 -top-10 size-32 rounded-full border-[18px] border-white/10" />
                      <div className="absolute -bottom-12 left-1/3 size-28 rounded-full bg-white/10 blur-2xl" />
                      <span className="relative flex size-12 items-center justify-center rounded-[14px] bg-white/20 text-2xl shadow-sm backdrop-blur-sm">
                        {visual.symbol}
                      </span>
                      <span className="relative rounded-full bg-black/15 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur-sm">
                        {Math.round(progress)}% complete
                      </span>
                      <span className="absolute bottom-3 left-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/85">
                        {goal.category}
                      </span>
                    </div>

                    <div className="px-1 pb-1 pt-4">
                      <h3 className="min-h-12 text-base font-extrabold leading-6 text-foreground">{goal.title}</h3>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary via-sky to-gold" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="mt-3 text-xs font-semibold text-foreground/55">
                        {goal.todayCompletedHabits} of {goal.todayTotalHabits} habits done today
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-4 rounded-[20px] border border-dashed border-primary/30 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-foreground/60">Create a goal and its progress card will appear here.</p>
              <Link href="/goals/add" className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-primary/90">
                Create a goal
              </Link>
            </div>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard icon={<Flame className="h-10 w-10 text-orange-500" />} label={`${streak}d Streak`} />
              <MetricCard icon={<Sparkles className="h-10 w-10 text-primary" />} label={`${xp} XP`} />
              <MetricCard
                icon={<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary shadow-sm">{completionRate}%</div>}
                label="Done"
              />
            </div>

            <section className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Today's Habits</h2>
                <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary">
                  {completedCount} / {totalHabits} completed
                </span>
              </div>

              {totalHabits > 0 ? (
                (Object.keys(groupedHabits) as TimeRange[]).map((range) => (
                  <HabitGroup
                    key={range}
                    range={range}
                    habits={groupedHabits[range]}
                    planDate={plan?.date ?? new Date().toISOString().slice(0, 10)}
                  />
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-border bg-surface p-5">
                  <p className="text-sm font-bold text-foreground">No habits scheduled for today.</p>
                  <p className="mt-1 text-sm font-medium text-foreground/60">Add a habit from Goals to make this page track real progress.</p>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className="rounded-[20px] border border-border bg-surface p-5 shadow-card">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary">Focus Queue</p>
              <div className="mt-5 space-y-3">
                {focusQueue.length > 0 ? (
                  focusQueue.map((habit, index) => (
                    <div key={habit.id} className="flex items-center justify-between gap-3 rounded-[14px] border border-border bg-background p-3">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">{index === 0 ? "Now" : index === 1 ? "Next" : "Later"}</p>
                        <p className="mt-1 text-sm font-extrabold text-foreground">{habit.title}</p>
                        <p className="mt-0.5 text-xs font-semibold text-foreground/50">{habit.goalTitle}</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">{habit.duration} min</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[14px] border border-dashed border-border bg-background p-3 text-sm font-semibold text-foreground/60">
                    Nothing waiting right now.
                  </div>
                )}
              </div>
            </section>

            <div className="flex gap-4 rounded-[20px] border border-primary/20 p-6 shadow-sm glass-card">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.26em] text-primary">Daily Motivation</p>
                <p className="text-sm font-bold text-foreground">{plan?.motivation.title ?? "Daily focus"}</p>
                <p className="mt-1 text-sm font-medium text-foreground/60">{plan?.motivation.body ?? "Complete a habit to build momentum."}</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BottomNavigation active="today" />
    </div>
  );
}

function MetricCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-[18px] border border-border p-5 shadow-sm glass-card">
      <div className="mx-auto flex h-10 items-center justify-center">{icon}</div>
      <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-foreground/60">{label}</p>
    </div>
  );
}

function HabitGroup({
  range,
  habits,
  planDate,
}: {
  range: TimeRange;
  habits: TodayHabit[];
  planDate: string;
}) {
  if (habits.length === 0) return null;

  const meta = timeRangeMeta[range];
  const GroupIcon = meta.Icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-foreground/60">
        <GroupIcon className={`h-5 w-5 ${meta.className}`} />
        <span className="text-[10px] font-bold uppercase tracking-[0.28em]">{meta.label}</span>
      </div>
      <div className="space-y-2.5">
        {habits.map((habit) => {
          return (
            <TodayInteractiveClient 
              key={habit.id} 
              habit={habit} 
              planDate={planDate}
            />
          );
        })}
      </div>
    </div>
  );
}
