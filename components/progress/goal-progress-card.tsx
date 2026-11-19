import type { GoalProgress } from "@/lib/types";
import { AlertTriangle, CalendarDays, CheckCircle2, Target } from "lucide-react";

interface GoalProgressCardProps {
  goal: GoalProgress;
}

export function GoalProgressCard({ goal }: GoalProgressCardProps) {
  const StatusIcon = goal.status === "Behind Schedule" || goal.status === "At Risk"
    ? AlertTriangle
    : CheckCircle2;
  const statusTone =
    goal.status === "Completed"
      ? "bg-primary/10 text-primary"
      : goal.status === "At Risk"
        ? "bg-coral/12 text-coral"
        : goal.status === "Behind Schedule"
          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : "bg-primary/10 text-primary";

  return (
    <article className="rounded-[20px] border border-border bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-primary text-white shadow-card">
            <Target aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="break-words text-base font-extrabold text-foreground">{goal.title}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-foreground/50">
              <CalendarDays aria-hidden="true" className="size-3.5 text-primary" />
              Target {goal.targetDate}
            </p>
          </div>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${statusTone}`}>
          <StatusIcon aria-hidden="true" className="size-3.5" />
          {goal.status}
        </span>
      </div>
      <div className="mt-6 flex items-end justify-between gap-3">
        <span className="text-4xl font-extrabold text-foreground">{goal.progress}%</span>
        <div className="text-right text-sm font-bold text-foreground/60">Progress</div>
      </div>
      <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
        <div
          role="progressbar"
          aria-label={`${goal.title} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(100, Math.max(0, goal.progress))}
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${Math.min(100, Math.max(0, goal.progress))}%` }}
        />
      </div>
    </article>
  );
}
