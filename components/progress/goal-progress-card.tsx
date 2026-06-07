import type { GoalProgress } from "@/lib/types";

interface GoalProgressCardProps {
  goal: GoalProgress;
}

export function GoalProgressCard({ goal }: GoalProgressCardProps) {
  return (
    <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#6b7280]">{goal.title}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#6b7280]">Target {goal.targetDate}</p>
        </div>
        <span className="rounded-2xl bg-[#f3f4ff] px-3 py-1 text-xs font-semibold text-[#9288F8]">
          {goal.status}
        </span>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="text-3xl font-bold text-[#121221]">{goal.progress}%</span>
        <div className="text-sm font-medium text-[#6b7280]">{goal.status}</div>
      </div>
      <div className="mt-4 h-3 rounded-full bg-[#eef0fb] overflow-hidden">
        <div className={`${goal.color} h-full rounded-full`} style={{ width: `${goal.progress}%` }} />
      </div>
    </div>
  );
}
