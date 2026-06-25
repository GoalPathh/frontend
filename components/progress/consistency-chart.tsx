import type { ConsistencyPoint } from "@/lib/types";

interface ConsistencyChartProps {
  series: ConsistencyPoint[];
}

function normalizePoints(series: ConsistencyPoint[]) {
  const maxRate = Math.max(...series.map((point) => point.completionRate), 100);
  const minRate = Math.min(...series.map((point) => point.completionRate), 0);

  return series.map((point, index) => ({
    x: (index / Math.max(series.length - 1, 1)) * 100,
    y: 100 - ((point.completionRate - minRate) / Math.max(maxRate - minRate, 1)) * 100,
    label: point.date,
    value: point.completionRate,
    habits: point.habitsCompleted,
  }));
}

export function ConsistencyChart({ series }: ConsistencyChartProps) {
  const safeSeries =
    series.length > 0
      ? series
      : [{ date: "No data", completionRate: 0, habitsCompleted: 0 }];
  const points = normalizePoints(safeSeries);
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="rounded-[20px] border border-border bg-surface p-5 shadow-card">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">
            Consistency Analytics
          </p>
          <h3 className="mt-2 text-xl font-extrabold text-foreground">Daily completion rate</h3>
        </div>
        <div className="hidden text-right text-sm text-foreground/60 sm:block">
          <p>Completion %</p>
          <p className="font-semibold text-foreground">Habits Completed</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 100 50" className="h-48 w-full sm:h-56">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(var(--primary))" />
              <stop offset="100%" stopColor="rgb(var(--sky))" />
            </linearGradient>
          </defs>
          <path d={path} fill="none" stroke="url(#lineGradient)" strokeWidth="1.8" strokeLinecap="round" />
          {points.map((point, index) => (
            <g key={index}>
              <circle cx={point.x} cy={point.y} r="1.9" fill="rgb(var(--primary))" />
              <line x1={point.x} y1={point.y} x2={point.x} y2="50" stroke="rgb(var(--border))" strokeDasharray="1 2" />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-foreground/60">
        {points.slice(-4).map((point, index) => (
          <div key={index} className="rounded-[14px] border border-border bg-background p-3">
            <p className="font-semibold text-foreground">{point.label}</p>
            <p>
              {point.value}% • {point.habits} habits
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
