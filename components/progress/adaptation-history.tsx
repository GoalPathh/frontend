import { Check, Clock3, X } from "lucide-react";
import type { AdaptationHistoryItem } from "@/lib/progressAdaptationService";

function snapshotLine(value: Record<string, unknown> | null) {
  if (!value) return "";
  const duration = typeof value.duration === "number" ? `${value.duration} min` : null;
  const days = Array.isArray(value.activeDays) && value.activeDays.length ? `${value.activeDays.length} days/week` : null;
  return [duration, days].filter(Boolean).join(" · ");
}

function progressLine(value: Record<string, unknown> | null, side: "before" | "after", baseline?: Record<string, unknown> | null) {
  if (!value) return "";
  if (side === "before" && typeof value.baselineCompletionRate === "number") {
    return `Baseline consistency ${value.baselineCompletionRate}% (${value.baselineCompleted}/${value.baselineScheduled})`;
  }
  if (side === "after") {
    const followUp = value.followUp as { completionRate: number | null; completed: number; scheduled: number } | undefined;
    if (followUp?.completionRate !== null && followUp?.completionRate !== undefined) {
      const previousRate = typeof baseline?.baselineCompletionRate === "number" ? baseline.baselineCompletionRate : null;
      const change = previousRate === null ? "" : `, ${followUp.completionRate - previousRate > 0 ? "+" : ""}${followUp.completionRate - previousRate} pts`;
      return `After: ${followUp.completionRate}% consistency (${followUp.completed}/${followUp.scheduled}${change})`;
    }
    if (followUp) return "After: collecting post-change activity";
  }
  return "";
}

export function AdaptationHistory({ items }: { items: AdaptationHistoryItem[] }) {
  return (
    <section className="rounded-[20px] border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Clock3 className="size-5" /></span>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Adaptation History</p>
          <h3 className="mt-1 text-lg font-extrabold text-foreground">Your plan decisions</h3>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-background p-4 text-sm leading-6 text-foreground/60">
          Recommendations and plan changes will appear here after they are generated or applied.
        </p>
      ) : (
        <ol className="space-y-3">
          {items.map((item) => {
            const applied = item.status === "applied";
            const Icon = applied ? Check : item.status === "dismissed" ? X : Clock3;
            const statusLabel = applied ? "Applied" : item.status === "dismissed" ? "Kept current plan" : "Suggested";
            const before = snapshotLine(item.before);
            const after = snapshotLine(item.after);
            return (
              <li key={item.id} className="rounded-xl border border-border bg-background p-3.5">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${applied ? "bg-primary/10 text-primary" : item.status === "dismissed" ? "bg-muted text-foreground/50" : "bg-primary/10 text-primary"}`}><Icon className="size-3.5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-extrabold text-foreground">{item.title}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-foreground/50">{statusLabel}</span>
                    </div>
                    <p className="mt-1 text-xs text-foreground/60">{item.goalTitle} · {item.habitTitle}</p>
                    {before && <p className="mt-2 text-xs leading-5 text-foreground/60">
                      Before: {before}{progressLine(item.before, "before") ? ` · ${progressLine(item.before, "before")}` : ""}
                      {after ? ` · Plan: ${after}` : ""}{progressLine(item.after, "after", item.before) ? ` · ${progressLine(item.after, "after", item.before)}` : item.status === "applied" ? " · Collecting post-change activity" : ""}
                    </p>}
                    <time className="mt-2 block text-[10px] font-semibold text-foreground/45" dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
