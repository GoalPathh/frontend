import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { HabitPerformance } from "@/lib/types";

interface HabitRankingCardProps {
  rank: number;
  habit: HabitPerformance;
}

export function HabitRankingCard({ rank, habit }: HabitRankingCardProps) {
  const trendIcon = habit.trend === "up" ? <ArrowUpRight className="h-4 w-4 text-gold" /> : habit.trend === "down" ? <ArrowDownRight className="h-4 w-4 text-coral" /> : <Minus className="h-4 w-4 text-foreground/60" />;

  return (
    <div className="rounded-[18px] border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary/10 text-sm font-extrabold text-primary">
          {rank}
        </div>
        <div>
          <p className="text-sm font-extrabold text-foreground">{habit.title}</p>
          <p className="text-sm text-foreground/60">{habit.totalCompletions} completions</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-extrabold text-foreground">{habit.completionRate}%</p>
          <p className="text-sm text-foreground/60">Completion rate</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-2 text-xs font-extrabold text-foreground">
          {trendIcon}
          {habit.trend === "up" ? "Improved" : habit.trend === "down" ? "Dropping" : "Stable"}
        </div>
      </div>
    </div>
  );
}
