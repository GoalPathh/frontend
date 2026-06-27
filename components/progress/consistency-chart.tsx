import type { ConsistencyPoint } from "@/lib/types";
import { useState } from "react";

interface ConsistencyChartProps {
  series: ConsistencyPoint[];
}

const chart = {
  width: 360,
  height: 150,
  left: 32,
  right: 14,
  top: 12,
  bottom: 24,
};

const innerWidth = chart.width - chart.left - chart.right;
const innerHeight = chart.height - chart.top - chart.bottom;

function formatDateLabel(value: string) {
  if (value === "No data") return value;

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en", { month: "short", day: "numeric" });
}

function normalizePoints(series: ConsistencyPoint[]) {
  return series.map((point, index) => ({
    x: chart.left + (index / Math.max(series.length - 1, 1)) * innerWidth,
    y:
      chart.top +
      (1 - Math.min(100, Math.max(0, point.completionRate)) / 100) * innerHeight,
    label: point.date,
    value: Math.min(100, Math.max(0, point.completionRate)),
    habits: point.habitsCompleted,
  }));
}

export function ConsistencyChart({ series }: ConsistencyChartProps) {
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const safeSeries =
    series.length > 0
      ? series
      : [{ date: "No data", completionRate: 0, habitsCompleted: 0 }];
  const points = normalizePoints(safeSeries);
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${path} L ${points[points.length - 1]?.x ?? chart.left} ${chart.height - chart.bottom} L ${points[0]?.x ?? chart.left} ${chart.height - chart.bottom} Z`;
  const summaryPoints = points.length > 4 ? points.slice(-4) : points;
  const axisLabels = points.length <= 1 ? points : [points[0], points[Math.floor(points.length / 2)], points[points.length - 1]];
  const activePoint = activePointIndex === null ? null : points[activePointIndex];

  return (
    <div className="rounded-[20px] border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
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

      <div className="rounded-[18px] border border-border bg-background px-2 py-2">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="block h-[176px] w-full overflow-visible sm:h-[190px]"
          role="img"
          aria-label="Daily completion rate chart"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(var(--primary))" />
              <stop offset="100%" stopColor="rgb(var(--sky))" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.18" />
              <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map((rate) => {
            const y = chart.top + (1 - rate / 100) * innerHeight;

            return (
              <g key={rate}>
                <line
                  x1={chart.left}
                  y1={y}
                  x2={chart.width - chart.right}
                  y2={y}
                  stroke="rgb(var(--border))"
                  strokeDasharray={rate === 0 ? "0" : "3 6"}
                  strokeWidth="1"
                />
                <text
                  x={chart.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-foreground/50 text-[10px] font-bold"
                >
                  {rate}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#areaGradient)" />
          <path d={path} fill="none" stroke="url(#lineGradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((point, index) => (
            <g key={index}>
              <line
                x1={point.x}
                y1={point.y}
                x2={point.x}
                y2={chart.height - chart.bottom}
                stroke="rgb(var(--border))"
                strokeDasharray="2 5"
                strokeWidth="1"
              />
              <g
                role="button"
                tabIndex={0}
                aria-label={`${formatDateLabel(point.label)}: ${point.value}% completion, ${point.habits} habits completed`}
                onClick={() => setActivePointIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActivePointIndex(index);
                  }
                }}
                onMouseEnter={() => setActivePointIndex(index)}
                onFocus={() => setActivePointIndex(index)}
                onBlur={() => setActivePointIndex(null)}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={activePointIndex === index ? "7" : "4.8"}
                  fill="rgb(var(--background))"
                  stroke="rgb(var(--primary))"
                  strokeWidth="2.6"
                  className="cursor-pointer transition"
                />
              </g>
            </g>
          ))}

          {activePoint && (
            <g pointerEvents="none">
              <line
                x1={activePoint.x}
                y1={chart.top}
                x2={activePoint.x}
                y2={chart.height - chart.bottom}
                stroke="rgb(var(--primary))"
                strokeDasharray="3 5"
                strokeWidth="1.4"
              />
              <g
                transform={`translate(${Math.min(Math.max(activePoint.x - 54, chart.left), chart.width - chart.right - 108)} ${Math.max(activePoint.y - 48, chart.top + 4)})`}
              >
                <rect width="108" height="38" rx="10" fill="rgb(var(--foreground))" opacity="0.92" />
                <text x="10" y="15" className="fill-background text-[10px] font-bold">
                  {formatDateLabel(activePoint.label)}
                </text>
                <text x="10" y="30" className="fill-background text-[11px] font-extrabold">
                  {activePoint.value}% • {activePoint.habits} habits
                </text>
              </g>
            </g>
          )}

          {axisLabels.map((point, index) => (
            <text
              key={`${point.label}-${index}`}
              x={point.x}
              y={chart.height - 10}
              textAnchor={index === 0 ? "start" : index === axisLabels.length - 1 ? "end" : "middle"}
              className="fill-foreground/50 text-[10px] font-bold"
            >
              {formatDateLabel(point.label)}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-foreground/60 sm:grid-cols-2">
        {summaryPoints.map((point, index) => (
          <div key={index} className="rounded-[14px] border border-border bg-background p-3">
            <p className="font-semibold text-foreground">{formatDateLabel(point.label)}</p>
            <p>
              {point.value}% • {point.habits} habits
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
