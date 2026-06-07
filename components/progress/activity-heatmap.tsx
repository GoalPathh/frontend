import type { HeatmapDay } from "@/lib/types";

interface ActivityHeatmapProps {
  days: HeatmapDay[];
}

const heatmapStyles: Record<HeatmapDay["level"], string> = {
  high: "bg-[#22C55E]",
  medium: "bg-[#60A5FA]",
  low: "bg-[#9288F8]",
  none: "bg-[#eef0fb]",
};

export function ActivityHeatmap({ days }: ActivityHeatmapProps) {
  const visibleDays = days.slice(0, 35);
  return (
    <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold text-[#6b7280]">Consistency Calendar</p>
        <h3 className="text-xl font-bold text-[#121221]">Heatmap of habit consistency</h3>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {visibleDays.map((day) => (
          <div
            key={day.date}
            className={`h-10 rounded-2xl ${heatmapStyles[day.level]} border border-[#e4e5f1]`}
            title={`${day.date}: ${day.level === "none" ? "No activity" : day.level === "low" ? "Low consistency" : day.level === "medium" ? "Medium consistency" : "High consistency"}`}
          />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-4 gap-3 text-sm text-[#6b7280]">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-[#f8f9ff] px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-[#22C55E]" /> High
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-[#f8f9ff] px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-[#60A5FA]" /> Medium
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-[#f8f9ff] px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-[#9288F8]" /> Low
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-[#f8f9ff] px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-[#eef0fb] border border-[#e4e5f1]" /> No activity
        </div>
      </div>
    </div>
  );
}
