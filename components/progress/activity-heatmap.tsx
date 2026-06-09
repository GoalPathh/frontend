import type { HeatmapDay } from "@/lib/types";

interface ActivityHeatmapProps {
  days: HeatmapDay[];
}

const heatmapStyles: Record<HeatmapDay["level"], string> = {
  high: "bg-gold",
  medium: "bg-sky",
  low: "bg-primary",
  none: "bg-muted",
};

export function ActivityHeatmap({ days }: ActivityHeatmapProps) {
  const visibleDays = days.slice(0, 35);
  return (
    <div className="rounded-[20px] border border-border bg-surface p-5 shadow-card">
      <div className="mb-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Consistency Calendar</p>
        <h3 className="mt-2 text-xl font-extrabold text-foreground">Habit activity</h3>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {visibleDays.map((day) => (
          <div
            key={day.date}
            className={`h-9 rounded-[12px] ${heatmapStyles[day.level]} border border-border transition hover:scale-105`}
            title={`${day.date}: ${day.level === "none" ? "No activity" : day.level === "low" ? "Low consistency" : day.level === "medium" ? "Medium consistency" : "High consistency"}`}
          />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-bold text-foreground/60 sm:grid-cols-4">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-background px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-gold" /> High
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-background px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-sky" /> Medium
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-background px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-primary" /> Low
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-background px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-muted border border-border" /> No activity
        </div>
      </div>
    </div>
  );
}
