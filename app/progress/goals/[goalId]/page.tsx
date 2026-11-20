"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, BrainCircuit, CalendarDays, CheckCircle2, Clock3, TrendingDown, TrendingUp } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { RecommendationCard } from "@/components/progress/recommendation-card";
import { AdaptationHistory } from "@/components/progress/adaptation-history";
import { GoalDetailTrigger } from "@/components/goals/goal-detail-trigger";
import { progressAdaptationService, type ProgressAdaptation } from "@/lib/progressAdaptationService";
import type { DateRange } from "@/lib/types";

const VALID_RANGES: DateRange[] = ["last-7-days", "last-30-days", "last-3-months", "last-6-months", "last-year", "custom"];

export default function GoalReviewPage() {
  return <Suspense fallback={null}><GoalReviewContent /></Suspense>;
}

function GoalReviewContent() {
  const params = useParams<{ goalId: string }>();
  const searchParams = useSearchParams();
  const goalId = params.goalId;
  const queryRange = searchParams.get("range");
  const range: DateRange = VALID_RANGES.includes(queryRange as DateRange) ? queryRange as DateRange : "last-7-days";
  const [data, setData] = useState<ProgressAdaptation | null>(() => progressAdaptationService.peek(range, goalId));
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const cached = progressAdaptationService.peek(range, goalId);
    if (cached) setData(cached);
    setError("");
    void progressAdaptationService.get(range, goalId, true).then((fresh) => {
      if (!active) return;
      setData(fresh);
    }).catch((cause) => {
      if (active) setError(cause instanceof Error ? cause.message : "Unable to load this goal review.");
    });
    return () => { active = false; };
  }, [goalId, range, reloadKey]);

  const review = data?.goalReview;
  const sourceLabel = data?.analysisSource === "ai" ? "AI analysis" : data?.analysisSource === "rules" ? "Activity patterns" : "Collecting activity";

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground lg:pl-[272px] lg:pb-10">
      <AppSidebar active="progress" className="fixed inset-y-0 left-0 z-50 hidden lg:flex" />
      <header className="fixed top-0 z-40 w-full border-b border-border bg-background/80 px-5 py-3 backdrop-blur-xl sm:px-8 lg:left-[272px] lg:w-[calc(100%-272px)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Progress / AI Goal Review</p>
            <h1 className="truncate text-lg font-bold tracking-tight text-primary">{review?.title ?? "Goal Review"}</h1>
          </div>
          <ThemeToggle className="size-10 shrink-0 bg-surface/80 dark:bg-surface/10" />
        </div>
      </header>

      <main id="main" className="mx-auto mt-[84px] max-w-7xl px-4 sm:px-7 lg:px-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/progress?range=${range}`} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-bold text-foreground/65 transition hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <ArrowLeft className="size-4" /> Back to Progress
          </Link>
          <GoalDetailTrigger goalId={goalId} onChanged={() => setReloadKey((value) => value + 1)} className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-xs font-extrabold text-foreground transition hover:border-primary hover:text-primary">
            Manage goal & habits
          </GoalDetailTrigger>
        </div>

        {error && <p role="alert" className="mb-4 rounded-2xl border border-coral/20 bg-coral/5 p-4 text-sm font-semibold text-coral">{error}</p>}
        {!review && !error && <div className="space-y-4" aria-live="polite"><div className="h-40 animate-pulse rounded-[24px] bg-surface" /><div className="h-60 animate-pulse rounded-[24px] bg-surface" /><p className="text-sm text-foreground/55">Loading goal activity and schedule…</p></div>}

        {review && (
          <>
            <section className="mb-5 rounded-[24px] border border-primary/20 bg-surface p-5 shadow-card sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-primary"><BrainCircuit className="size-3.5" /> AI Goal Review · {sourceLabel}</span>
                  <h2 className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl">{review.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-foreground/65">{review.narrative}</p>
                </div>
                <div className="grid min-w-0 grid-cols-2 gap-2 sm:min-w-[18rem]">
                  <ReviewMetric label="Goal completion" value={`${review.progress}%`} />
                  <ReviewMetric label="Selected range" value={`${review.completionRate}%`} detail={`${review.completed}/${review.scheduled} due`} />
                  <ReviewMetric label="Habits completed" value={`${review.completed}/${review.scheduled}`} detail={`${review.pendingToday} scheduled today in progress`} />
                  <ReviewMetric label="Scheduled missed" value={`${review.missed}`} detail="Open today is excluded" />
                </div>
              </div>
              <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
                <div className="flex items-start gap-2"><CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" /><p className="text-xs leading-5 text-foreground/65"><strong className="text-foreground">Deadline:</strong> {review.daysLeft < 0 ? `${Math.abs(review.daysLeft)} days overdue` : `${review.daysLeft} days left`} · {review.progress}% complete vs {review.expectedProgress}% expected.</p></div>
                <div className="flex items-start gap-2">{review.consistencyTrend === "down" ? <TrendingDown className="mt-0.5 size-4 shrink-0 text-coral" /> : <TrendingUp className="mt-0.5 size-4 shrink-0 text-primary" />}<p className="text-xs leading-5 text-foreground/65"><strong className="text-foreground">Consistency trend:</strong> {trendLabel(review.consistencyTrend)} compared with the previous equal period.</p></div>
                <div className="flex items-start gap-2"><Clock3 className="mt-0.5 size-4 shrink-0 text-primary" /><p className="text-xs leading-5 text-foreground/65"><strong className="text-foreground">Best days:</strong> {review.bestDays.join(", ") || "Not enough scheduled data"}. <strong className="text-foreground">Frequently missed:</strong> {review.missedDays.join(", ") || "No repeated missed day detected"}.</p></div>
              </div>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${review.title} goal progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={review.progress}>
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, review.progress))}%` }} />
              </div>
            </section>

            <div className="mb-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-[22px] border border-border bg-surface p-5 shadow-card sm:p-6">
                <div className="mb-4 flex items-center gap-2"><CalendarDays className="size-4 text-primary" /><h3 className="text-base font-extrabold">Goal consistency by day</h3></div>
                <div className="grid grid-cols-7 gap-2">
                  {review.weekdayStats.map((day) => <div key={day.key} className="min-w-0 rounded-xl bg-background px-1.5 py-3 text-center sm:px-2">
                    <p className="text-[9px] font-extrabold uppercase text-foreground/50 sm:text-[10px]">{day.day.slice(0, 3)}</p>
                    <p className="mt-2 text-sm font-extrabold text-primary">{day.completionRate === null ? "—" : `${day.completionRate}%`}</p>
                    <p className="mt-1 text-[9px] text-foreground/50">{day.scheduled ? `${day.completed}/${day.scheduled}` : day.pending ? "In progress" : "No plan"}</p>
                  </div>)}
                </div>
                <p className="mt-3 text-xs leading-5 text-foreground/55">Days without a scheduled habit are excluded from missed counts.</p>
              </section>

              <section className="rounded-[22px] border border-border bg-surface p-5 shadow-card sm:p-6">
                <div className="mb-4 flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /><h3 className="text-base font-extrabold">Habit difficulty & consistency</h3></div>
                {review.habits.length ? <div className="space-y-3">{review.habits.map((habit) => <div key={habit.id} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-foreground">{habit.title}</p><p className="mt-1 text-[10px] font-semibold capitalize text-foreground/50">{habit.difficulty} · {habit.duration} min</p></div><span className="shrink-0 text-sm font-extrabold text-primary">{habit.completionRate}%</span></div>
                  <p className="mt-2 text-[10px] text-foreground/55">{habit.completed}/{habit.scheduled} due completed · {habit.missed} missed{habit.pending ? ` · ${habit.pending} in progress today` : ""}</p>
                </div>)}</div> : <p className="rounded-xl border border-dashed border-border p-4 text-sm text-foreground/60">No habits are attached to this goal yet.</p>}
              </section>
            </div>

            <section className="mb-5 rounded-[22px] border border-primary/20 bg-surface p-5 shadow-card sm:p-6">
              <div className="mb-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Personalized recommendation</p>
                <h3 className="mt-1 text-lg font-extrabold text-foreground">Choose what happens to this plan</h3>
                <p className="mt-1 text-xs leading-5 text-foreground/55">Nothing changes until you apply a recommendation. Customize it or keep the current plan.</p>
              </div>
              {review.recommendations.length ? <div className="grid gap-3">{review.recommendations.map((recommendation) => <RecommendationCard key={recommendation.id} recommendation={recommendation} range={range} onChanged={() => setReloadKey((value) => value + 1)} />)}</div> : (
                <div className="rounded-xl border border-dashed border-border bg-background p-4 text-sm leading-6 text-foreground/60">
                  {review.scheduled < 6 || review.completed < 2 ? "More scheduled activity is needed before this goal can receive a reliable plan change." : "No goal-specific change is supported by the current activity. Keep the plan or review it after more completions."}
                </div>
              )}
            </section>

            <AdaptationHistory items={data?.history ?? []} />
          </>
        )}
      </main>
      <BottomNavigation active="progress" />
    </div>
  );
}

function ReviewMetric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return <div className="rounded-xl border border-border bg-background px-3 py-3"><p className="text-[9px] font-extrabold uppercase tracking-wide text-foreground/50">{label}</p><p className="mt-1 text-lg font-extrabold text-primary">{value}</p>{detail && <p className="mt-1 text-[9px] leading-4 text-foreground/50">{detail}</p>}</div>;
}

function trendLabel(trend: string) {
  if (trend === "up") return "Improving";
  if (trend === "down") return "Declining";
  if (trend === "steady") return "Steady";
  return "Not enough data";
}
