import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { HabitPerformance } from "@/lib/types";

interface HabitRankingCardProps {
  rank: number;
  habit: HabitPerformance;
}

export function HabitRankingCard({ rank, habit }: HabitRankingCardProps) {
  const trendIcon = habit.trend === "up" ? <ArrowUpRight className="h-4 w-4 text-[#22C55E]" /> : habit.trend === "down" ? <ArrowDownRight className="h-4 w-4 text-[#FB7185]" /> : <Minus className="h-4 w-4 text-[#6b7280]" />;

  return (
    <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8f8ff] text-lg font-bold text-[#121221]">
          {rank}
        </div>
        <div>
          <p className="text-base font-semibold text-[#121221]">{habit.title}</p>
          <p className="text-sm text-[#6b7280]">{habit.totalCompletions} completions</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-[#121221]">{habit.completionRate}%</p>
          <p className="text-sm text-[#6b7280]">Completion rate</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-[#eef0fb] px-3 py-2 text-sm font-semibold text-[#121221]">
          {trendIcon}
          {habit.trend === "up" ? "Improved" : habit.trend === "down" ? "Dropping" : "Stable"}
        </div>
      </div>
    </div>
  );
}
