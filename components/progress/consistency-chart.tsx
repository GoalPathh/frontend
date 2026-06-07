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
  const points = normalizePoints(series);
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-[#6b7280]">Consistency Analytics</p>
          <h3 className="text-xl font-bold text-[#121221]">Daily completion rate</h3>
        </div>
        <div className="text-right text-sm text-[#6b7280]">
          <p>Completion %</p>
          <p className="font-semibold text-[#121221]">Habits Completed</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 100 50" className="w-full h-56">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9288F8" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
          <path d={path} fill="none" stroke="url(#lineGradient)" strokeWidth="1.8" strokeLinecap="round" />
          {points.map((point, index) => (
            <g key={index}>
              <circle cx={point.x} cy={point.y} r="1.9" fill="#9288F8" />
              <line x1={point.x} y1={point.y} x2={point.x} y2="50" stroke="#E5E7EB" strokeDasharray="1 2" />
            </g>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-[#6b7280]">
        {points.slice(-4).map((point, index) => (
          <div key={index} className="rounded-2xl bg-[#f8f9ff] p-3">
            <p className="font-semibold text-[#121221]">{point.label}</p>
            <p>{point.value}% • {point.habits} habits</p>
          </div>
        ))}
      </div>
    </div>
  );
}
