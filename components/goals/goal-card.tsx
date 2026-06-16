import { GoalDashboardGoal } from "@/lib/goalService";
import { AlertTriangle, CalendarDays, CheckCircle2, Flag, Zap } from "lucide-react";

interface GoalCardProps {
  goal: GoalDashboardGoal;
  onClick?: () => void;
  onDelete?: () => void;
}

const categoryIcons: Record<string, string> = {
  language: "🌍",
  fitness: "💪",
  skills: "🎯",
  creativity: "🎨",
  learning: "📚",
  other: "⭐",
};

const categoryColors: Record<string, string> = {
  language: "bg-sky/10 text-sky",
  fitness: "bg-coral/12 text-coral",
  skills: "bg-primary/10 text-primary",
  creativity: "bg-gold/20 text-[#8a6100]",
  learning: "bg-primary/10 text-primary",
  other: "bg-muted text-foreground/60",
};

const statusColors: Record<GoalDashboardGoal["status"], string> = {
  "On Track": "text-emerald-600 dark:text-emerald-400",
  "Behind Schedule": "text-amber-600 dark:text-amber-400",
  "At Risk": "text-coral",
};

function formatPeriod(period: GoalDashboardGoal["period"]) {
  switch (period) {
    case "1month":
      return "1 month";
    case "3months":
      return "3 months";
    case "6months":
      return "6 months";
    case "1year":
      return "1 year";
    default:
      return period;
  }
}

function formatTargetDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function GoalCard({ goal, onClick, onDelete }: GoalCardProps) {
  return (
    <article
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[20px] border border-border bg-surface p-5 shadow-card transition-all ${
        onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-soft" : ""
      }`}
    >
      <div className="absolute -right-12 -top-14 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mb-5 flex items-start justify-between gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-background text-3xl shadow-card">
          {categoryIcons[goal.category] ?? categoryIcons.other}
        </span>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold capitalize ${categoryColors[goal.category] ?? categoryColors.other}`}>
            {goal.category}
          </span>
          {onDelete && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-foreground/55 transition hover:border-coral/30 hover:text-coral"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <h3 className="relative mb-2 text-lg font-extrabold text-foreground transition-colors group-hover:text-primary">
        {goal.title}
      </h3>

      <p className="relative mb-5 text-sm leading-6 text-foreground/60">
        {goal.habits.length} active habit{goal.habits.length !== 1 ? "s" : ""} planned for {goal.totalMinutes} min/day.
      </p>

      <div className="relative mb-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-foreground/50">Progress</span>
          <span className="text-sm font-extrabold text-primary">{goal.progress}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-sky to-gold transition-all duration-500"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-[14px] border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Zap className="h-3.5 w-3.5" />
            <span className="font-extrabold">Daily</span>
          </div>
          <p className="font-bold text-foreground">{goal.totalMinutes} min</p>
        </div>
        <div className="rounded-[14px] border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="font-extrabold">Period</span>
          </div>
          <p className="font-bold text-foreground">{formatPeriod(goal.period)}</p>
        </div>
        <div className="rounded-[14px] border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Flag className="h-3.5 w-3.5" />
            <span className="font-extrabold">Milestones</span>
          </div>
          <p className="font-bold text-foreground">
            {goal.completedMilestoneCount}/{goal.milestoneCount}
          </p>
        </div>
        <div className="rounded-[14px] border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="font-extrabold">Status</span>
          </div>
          <p className={`font-bold ${statusColors[goal.status]}`}>
            {goal.status}
          </p>
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-2 text-xs font-bold text-foreground/60">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <span>
          Target {formatTargetDate(goal.targetDate)}
          {typeof goal.daysLeft === "number" ? ` • ${goal.daysLeft} days left` : ""}
        </span>
      </div>
    </article>
  );
}
