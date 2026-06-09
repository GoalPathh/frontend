import type { GoalProgress } from "@/lib/types";

interface GoalProgressCardProps {
  goal: GoalProgress;
}

export function GoalProgressCard({ goal }: GoalProgressCardProps) {
  const statusTone =
    goal.status === "Completed"
      ? "bg-gold/20 text-[#8a6100]"
      : goal.status === "Behind Schedule"
        ? "bg-coral/12 text-coral"
        : "bg-primary/10 text-primary";

  return (
    <div className="rounded-[20px] border border-border bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-base font-extrabold text-foreground">{goal.title}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground/50">Target {goal.targetDate}</p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${statusTone}`}>
          {goal.status}
        </span>
      </div>
      <div className="mt-6 flex items-end justify-between gap-3">
        <span className="text-4xl font-extrabold text-foreground">{goal.progress}%</span>
        <div className="text-right text-sm font-bold text-foreground/60">progress</div>
      </div>
      <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-primary via-sky to-gold" style={{ width: `${goal.progress}%` }} />
      </div>
    </div>
  );
}
