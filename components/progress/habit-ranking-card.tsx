import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { HabitPerformance } from "@/lib/types";

interface HabitRankingCardProps {
  rank: number;
  habit: HabitPerformance;
}

export function HabitRankingCard({ rank, habit }: HabitRankingCardProps) {
  const trendIcon = habit.trend === "up" ? <ArrowUpRight className="h-4 w-4 text-gold" /> : habit.trend === "down" ? <ArrowDownRight className="h-4 w-4 text-coral" /> : <Minus className="h-4 w-4 text-foreground/60" />;

  return (
    <div className="rounded-[28px] border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-lg font-bold text-foreground">
          {rank}
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">{habit.title}</p>
          <p className="text-sm text-foreground/60">{habit.totalCompletions} completions</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-foreground">{habit.completionRate}%</p>
          <p className="text-sm text-foreground/60">Completion rate</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-2 text-sm font-semibold text-foreground">
          {trendIcon}
          {habit.trend === "up" ? "Improved" : habit.trend === "down" ? "Dropping" : "Stable"}
        </div>
      </div>
    </div>
  );
}
