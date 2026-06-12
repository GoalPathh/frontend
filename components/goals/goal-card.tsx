import { Goal } from "@/lib/types";
import { CalendarDays, CheckCircle2, Zap } from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
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

  const totalMinutes = goal.habits.reduce((sum, habit) => sum + habit.duration, 0);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-surface border border-border rounded-[20px] p-5 shadow-card transition-all group ${
        onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-soft" : "cursor-default"
      }`}
    >
      <div className="absolute -right-12 -top-14 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4 mb-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-background text-3xl shadow-card">{categoryIcons[goal.category]}</span>
        <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full ${categoryColors[goal.category]}`}>
          {goal.category}
        </span>
      </div>

      <h3 className="relative text-lg font-extrabold text-foreground mb-2 group-hover:text-primary transition-colors">
        {goal.title}
      </h3>

      <p className="relative text-sm leading-6 text-foreground/60 mb-5">
        {goal.habits.length} active habit{goal.habits.length !== 1 ? "s" : ""} planned for {totalMinutes} min/day.
      </p>

      <div className="relative mb-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-foreground/50">Progress</span>
          <span className="text-sm font-extrabold text-primary">{goal.progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-sky to-gold rounded-full transition-all duration-500"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-[14px] border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Zap className="w-3.5 h-3.5" />
            <span className="font-extrabold">Daily</span>
          </div>
          <p className="font-bold text-foreground">{totalMinutes} min</p>
        </div>
        <div className="rounded-[14px] border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <CalendarDays className="w-3.5 h-3.5" />
            <span className="font-extrabold">Period</span>
          </div>
          <p className="font-bold text-foreground">{goal.period.replace(/([0-9]+)([a-z]+)/, "$1 $2")}</p>
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-2 text-xs font-bold text-foreground/60">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        Target {goal.targetDate}
      </div>
    </div>
  );
}
