"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CalendarCheck, Clock3, Loader2, RotateCcw, Sparkles, Target } from "lucide-react";
import {
  progressAdaptationService,
  type AdaptationChanges,
  type AdaptationRecommendation,
} from "@/lib/progressAdaptationService";
import type { DateRange } from "@/lib/types";

const DAY_OPTIONS = [
  ["mon", "M"], ["tue", "T"], ["wed", "W"], ["thu", "T"], ["fri", "F"], ["sat", "S"], ["sun", "S"],
] as const;

const TYPE_LABELS: Record<AdaptationRecommendation["type"], string> = {
  reduce_difficulty: "Reduce difficulty",
  optimize_schedule: "Optimize schedule",
  habit_replacement: "Smaller alternative",
  recovery_plan: "Recovery plan",
};

function RecommendationIcon({ type }: { type: AdaptationRecommendation["type"] }) {
  const Icon = type === "optimize_schedule" ? CalendarCheck
    : type === "recovery_plan" ? RotateCcw
      : type === "habit_replacement" ? Target
        : Clock3;
  return <Icon aria-hidden="true" className="size-4" />;
}

function initialChanges(recommendation: AdaptationRecommendation): AdaptationChanges {
  const before = recommendation.before ?? {};
  return {
    title: recommendation.changes.title ?? String(before.title ?? recommendation.habitTitle),
    duration: recommendation.changes.duration ?? Number(before.duration ?? 15),
    timeRange: recommendation.changes.timeRange ?? (before.timeRange as AdaptationChanges["timeRange"]) ?? "anytime",
    activeDays: recommendation.changes.activeDays ?? (Array.isArray(before.activeDays) ? before.activeDays : []),
  };
}

export function RecommendationCard({
  recommendation,
  range,
  onChanged,
}: {
  recommendation: AdaptationRecommendation;
  range: DateRange;
  onChanged?: () => void;
}) {
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<AdaptationChanges>(() => initialChanges(recommendation));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setDraft(initialChanges(recommendation)), [recommendation]);

  const changeSummary = [
    recommendation.changes.duration !== undefined && `${recommendation.changes.duration} min`,
    recommendation.changes.timeRange && recommendation.changes.timeRange !== "anytime" && recommendation.changes.timeRange,
    recommendation.changes.activeDays && `${recommendation.changes.activeDays.length} scheduled days`,
    recommendation.changes.title && "habit name update",
  ].filter(Boolean).join(" · ");

  async function apply(changes?: AdaptationChanges) {
    setBusy(true);
    setError("");
    try {
      await progressAdaptationService.apply(recommendation.id, changes);
      onChanged?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this plan.");
    } finally {
      setBusy(false);
    }
  }

  async function keepCurrent() {
    setBusy(true);
    setError("");
    try {
      await progressAdaptationService.dismiss(recommendation.id);
      onChanged?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this choice.");
    } finally {
      setBusy(false);
    }
  }

  function toggleDay(day: string) {
    const activeDays = draft.activeDays ?? [];
    setDraft({ ...draft, activeDays: activeDays.includes(day) ? activeDays.filter((item) => item !== day) : [...activeDays, day] });
  }

  return (
    <article className="rounded-[18px] border border-primary/15 bg-background p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <RecommendationIcon type={recommendation.type} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-primary">
              {TYPE_LABELS[recommendation.type]}
            </span>
          </div>
          <h4 className="mt-2 text-sm font-extrabold text-foreground">{recommendation.title}</h4>
          <p className="mt-1 text-xs font-semibold text-foreground/65">{recommendation.goalTitle} · {recommendation.habitTitle}</p>
          <p className="mt-2 text-sm leading-6 text-foreground/75">{recommendation.reason}</p>
          {changeSummary && <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary"><Sparkles className="size-3.5" /> Proposed: {changeSummary}</p>}
          <Link href={`/progress/goals/${recommendation.goalId}?range=${range}`} className="mt-3 inline-flex min-h-9 items-center gap-1.5 text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Open AI Goal Review <ArrowRight className="size-3.5" />
          </Link>

          {customizing && (
            <div className="mt-4 space-y-3 rounded-xl border border-border bg-surface p-3">
              {recommendation.changes.title !== undefined && (
                <label className="block text-xs font-bold text-foreground">
                  Habit name
                  <input value={draft.title ?? ""} maxLength={120} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="mt-1.5 min-h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </label>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-bold text-foreground">
                  Duration (minutes)
                  <input type="number" min={1} max={1440} value={draft.duration ?? 15} onChange={(event) => setDraft({ ...draft, duration: Number(event.target.value) })} className="mt-1.5 min-h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </label>
                <label className="block text-xs font-bold text-foreground">
                  Time of day
                  <select value={draft.timeRange ?? "anytime"} onChange={(event) => setDraft({ ...draft, timeRange: event.target.value as AdaptationChanges["timeRange"] })} className="mt-1.5 min-h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary">
                    <option value="anytime">Anytime</option><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option>
                  </select>
                </label>
              </div>
              <fieldset>
                <legend className="mb-2 text-xs font-bold text-foreground">Scheduled days <span className="font-medium text-foreground/50">(none means every day)</span></legend>
                <div className="flex flex-wrap gap-1.5">
                  {DAY_OPTIONS.map(([day, label]) => {
                    const selected = (draft.activeDays ?? []).includes(day);
                    return <button key={day} type="button" aria-label={`Schedule on ${({ mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" } as const)[day]}`} aria-pressed={selected} onClick={() => toggleDay(day)} className={`size-9 rounded-full text-xs font-extrabold transition ${selected ? "bg-primary text-white" : "border border-border bg-background text-foreground/60 hover:border-primary"}`}>{label}</button>;
                  })}
                </div>
              </fieldset>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={busy} onClick={() => void apply(draft)} className="min-h-10 rounded-full bg-primary px-4 text-xs font-extrabold text-white disabled:opacity-60">Save Custom Plan</button>
                <button type="button" onClick={() => setCustomizing(false)} className="min-h-10 rounded-full border border-border px-4 text-xs font-bold text-foreground">Cancel</button>
              </div>
            </div>
          )}
          {error && <p role="alert" className="mt-3 text-xs font-semibold text-coral">{error}</p>}
          {!customizing && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" disabled={busy} onClick={() => void apply()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-extrabold text-white transition hover:bg-primary/90 disabled:opacity-60">
                {busy ? <Loader2 className="size-3.5 animate-spin" /> : <BrainCircuit className="size-3.5" />}
                Apply Recommendation
              </button>
              <button type="button" disabled={busy} onClick={() => setCustomizing(true)} className="min-h-10 rounded-full border border-border bg-surface px-4 text-xs font-bold text-foreground transition hover:border-primary hover:text-primary">Customize Plan</button>
              <button type="button" disabled={busy} onClick={() => void keepCurrent()} className="min-h-10 rounded-full px-3 text-xs font-bold text-foreground/60 transition hover:text-foreground">Keep Current Plan</button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
