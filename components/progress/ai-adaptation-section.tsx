"use client";

import { useEffect, useState } from "react";
import { AlertCircle, BrainCircuit, CalendarCheck, ChartNoAxesColumnIncreasing, Clock3, Sparkles, Target, TrendingDown, TrendingUp } from "lucide-react";
import { AdaptationHistory } from "@/components/progress/adaptation-history";
import { RecommendationCard } from "@/components/progress/recommendation-card";
import { progressAdaptationService, type ProgressAdaptation } from "@/lib/progressAdaptationService";
import type { DateRange } from "@/lib/types";

const DAY_SHORT: Record<string, string> = {
  Sunday: "Sun", Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat",
};

function signedPoints(value: number) {
  return `${value > 0 ? "+" : ""}${value} pts`;
}

export function AIAdaptationSection({
  range,
  onAnalysisLoaded,
}: {
  range: DateRange;
  onAnalysisLoaded?: (data: ProgressAdaptation) => void;
}) {
  const [data, setData] = useState<ProgressAdaptation | null>(() => progressAdaptationService.peek(range));
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const cached = progressAdaptationService.peek(range);
    setData(cached);
    if (cached) {
      onAnalysisLoaded?.(cached);
    }
    setError("");
    void progressAdaptationService.get(range, undefined, true).then((fresh) => {
      if (!active) return;
      setData(fresh);
      onAnalysisLoaded?.(fresh);
    }).catch((cause) => {
      if (active) setError(cause instanceof Error ? cause.message : "AI Adaptation is unavailable right now.");
    });
    return () => { active = false; };
  }, [range, reloadKey, onAnalysisLoaded]);

  const reload = () => setReloadKey((value) => value + 1);
  const sourceLabel = data?.analysisSource === "ai"
    ? "AI analysis"
    : data?.analysisSource === "rules"
      ? "Activity patterns"
      : "Collecting activity";
  const hasRepeatedWeekdays = data?.productivityByDay.some((day) => (day.observations ?? 0) >= 2) ?? false;

  return (
    <section className="mb-6 overflow-hidden rounded-[24px] border border-primary/20 bg-surface shadow-card">
      <div className="border-b border-primary/10 bg-primary/[0.035] p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-primary text-white shadow-card"><BrainCircuit className="size-5" /></span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">AI Adaptation</p>
                <span className="rounded-full border border-primary/15 bg-surface px-2.5 py-1 text-[10px] font-bold text-primary">{sourceLabel}</span>
              </div>
              <h2 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl">Understand your pattern. Adjust with intent.</h2>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-foreground/60 sm:text-sm">
                Uses your scheduled habits and completion history for the selected date range. Changes are only saved after you choose to apply them.
              </p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-foreground/60">
            <CalendarCheck className="size-3.5 text-primary" /> {data?.windowDays ?? "—"} day range
          </span>
        </div>
      </div>

      {!data && !error && (
        <div className="p-5 sm:p-6" aria-live="polite">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-background" />)}
          </div>
          <p className="mt-4 text-sm text-foreground/55">Reading your real habit schedule and completion history…</p>
        </div>
      )}

      {error && !data && (
        <div className="m-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-coral/20 bg-coral/5 p-4 sm:m-6">
          <p className="flex items-start gap-2 text-sm font-semibold text-coral"><AlertCircle className="mt-0.5 size-4 shrink-0" />{error}</p>
          <button type="button" onClick={reload} className="min-h-10 rounded-full border border-coral/20 bg-surface px-4 text-xs font-extrabold text-coral">Try again</button>
        </div>
      )}

      {data && (
        <div className="space-y-6 p-5 sm:p-6">
          <section aria-labelledby="adaptation-performance-title">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h3 id="adaptation-performance-title" className="text-base font-extrabold text-foreground">Weekly Performance Analysis</h3>
                <p className="mt-1 text-xs text-foreground/55">Selected period · compared with the previous {data.windowDays} days</p>
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-extrabold ${data.performance.changePoints === null || data.performance.changePoints >= 0 ? "text-primary" : "text-coral"}`}>
                {data.performance.changePoints !== null && data.performance.changePoints < 0 ? <TrendingDown className="size-3.5" /> : <TrendingUp className="size-3.5" />}
                {data.performance.changePoints === null ? "No previous scheduled data" : `${signedPoints(data.performance.changePoints)} vs previous period`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Metric label={data.windowDays === 7 ? "Weekly progress" : "Period progress"} value={`${data.performance.completionRate}%`} detail={`${data.performance.completed}/${data.performance.scheduled} due`} />
              <Metric label="Completed habits" value={`${data.performance.completed}/${data.performance.scheduled}`} detail={`${data.performance.missed} missed · ${data.performance.pendingToday} still in progress today`} />
              <Metric label="Active days" value={`${data.performance.activeDays}/${data.performance.dayCount}`} detail="Days with at least one completion" />
              <Metric label="Consistency" value={`${data.performance.consistencyScore}%`} detail="Completed / scheduled opportunities" />
            </div>
          </section>

          <section aria-labelledby="productivity-pattern-title" className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[18px] border border-border bg-background p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <ChartNoAxesColumnIncreasing className="size-4 text-primary" />
                <h3 id="productivity-pattern-title" className="text-sm font-extrabold text-foreground">Productivity Pattern</h3>
              </div>
              <div className="flex h-32 items-end gap-2 sm:h-36 sm:gap-3" role="img" aria-label="Scheduled habit completion rate by weekday">
                {data.productivityByDay.map((day) => {
                  const rate = day.completionRate ?? 0;
                  const pending = day.pending ?? 0;
                  const height = day.scheduled ? Math.min(100, Math.max(8, rate)) : pending ? 8 : 4;
                  return (
                    <div key={day.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2" title={day.scheduled ? `${day.day}: ${day.completed}/${day.scheduled} due completed (${rate}%)` : pending ? `${day.day}: ${pending} scheduled today, still in progress` : `${day.day}: no scheduled habits`}>
                      <span className="text-[10px] font-bold text-foreground/55">{day.scheduled ? `${rate}%` : pending ? "…" : "—"}</span>
                      <div className="flex h-[82px] w-full items-end justify-center rounded-t-lg bg-primary/[0.06] sm:h-[96px]">
                        <div className={`w-full max-w-9 rounded-t-lg ${day.scheduled ? "bg-primary" : pending ? "bg-primary/35" : "bg-border"}`} style={{ height: `${height}%` }} />
                      </div>
                      <span className="text-[10px] font-extrabold text-foreground/55">{DAY_SHORT[day.day]}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] leading-5 text-foreground/50">Unscheduled days are shown as —. Habits scheduled for today are still in progress, not missed.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <PatternCard
                icon={<Sparkles className="size-4" />}
                label="Most productive day"
                value={data.analysis.mostProductiveDay?.day ?? "Not enough scheduled data"}
                detail={data.analysis.mostProductiveDay ? `${data.analysis.mostProductiveDay.completionRate}% · ${data.analysis.mostProductiveDay.completed}/${data.analysis.mostProductiveDay.scheduled}` : "A weekday appears after it has scheduled habits."}
              />
              <PatternCard
                icon={<Target className="size-4" />}
                label="Lowest completion day"
                value={data.analysis.leastProductiveDay?.day ?? "Not enough scheduled data"}
                detail={data.analysis.leastProductiveDay ? `${data.analysis.leastProductiveDay.completionRate}% · ${data.analysis.leastProductiveDay.missed} scheduled missed` : "No unscheduled day is treated as a failure."}
              />
              <PatternCard
                icon={<CalendarCheck className="size-4" />}
                label="Frequently missed days"
                value={data.analysis.frequentlyMissedDays.map((day) => DAY_SHORT[day.day]).join(", ") || (hasRepeatedWeekdays ? "No repeated misses" : "Need more data")}
                detail={data.analysis.frequentlyMissedDays.length ? data.analysis.frequentlyMissedDays.map((day) => `${DAY_SHORT[day.day]}: ${day.missed}`).join(" · ") + " scheduled misses across repeated weekdays" : hasRepeatedWeekdays ? "No repeated scheduled misses across observed weekdays." : "More than one scheduled weekday occurrence is needed."}
              />
              <PatternCard
                icon={<Clock3 className="size-4" />}
                label="Best scheduled time slot"
                value={data.analysis.bestTimeSlot?.label ?? "Not enough data"}
                detail={data.analysis.bestTimeSlot ? `${data.analysis.bestTimeSlot.completionRate}% · ${data.analysis.bestTimeSlot.completed}/${data.analysis.bestTimeSlot.scheduled}` : "Time slot patterns need scheduled habits."}
              />
            </div>
          </section>

          {!data.coachPersonalizationEnabled && (
            <p className="rounded-xl border border-border bg-background px-4 py-3 text-xs leading-5 text-foreground/60">
              Personalized Coach data is off. Activity totals and recommendations are calculated on GoalPath and were not sent to the AI provider.
            </p>
          )}

          {!data.hasEnoughData && (
            <p className="rounded-xl border border-dashed border-primary/20 bg-primary/[0.03] px-4 py-3 text-sm leading-6 text-foreground/65">
              {data.performance.scheduled === 0
                ? "There are no scheduled habit opportunities in this range yet. Rest days and unscheduled days are excluded from misses."
                : "AI patterns need at least six scheduled habit opportunities and two completions in this range. Keep logging habits to build a reliable picture."}
            </p>
          )}

          <section aria-labelledby="personalized-recommendations-title">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h3 id="personalized-recommendations-title" className="text-base font-extrabold text-foreground">Personalized Recommendations</h3>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">Up to 3</span>
            </div>
            {data.recommendations.length ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {data.recommendations.slice(0, 3).map((recommendation) => <RecommendationCard key={recommendation.id} recommendation={recommendation} range={range} onChanged={reload} />)}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border bg-background p-4 text-sm leading-6 text-foreground/60">
                {data.hasEnoughData ? "No plan change is needed from the current evidence. Keep following your schedule and check back after more activity." : "Personalized recommendations will appear when there is enough scheduled activity to support them."}
              </p>
            )}
          </section>

          <AdaptationHistory items={data.history} />
        </div>
      )}
    </section>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="min-w-0 rounded-2xl border border-border bg-background px-3 py-3.5 sm:px-4">
    <p className="truncate text-[10px] font-extrabold uppercase tracking-wide text-foreground/50">{label}</p>
    <p className="mt-1 text-xl font-extrabold text-primary sm:text-2xl">{value}</p>
    <p className="mt-1 text-[10px] leading-4 text-foreground/55">{detail}</p>
  </div>;
}

function PatternCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <div className="rounded-[18px] border border-border bg-background p-4">
    <div className="flex items-center gap-2 text-primary">{icon}<span className="text-[10px] font-extrabold uppercase tracking-wide">{label}</span></div>
    <p className="mt-2 text-base font-extrabold text-foreground">{value}</p>
    <p className="mt-1 text-xs text-foreground/55">{detail}</p>
  </div>;
}
