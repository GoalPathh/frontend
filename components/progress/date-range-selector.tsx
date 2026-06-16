import { CalendarDays } from "lucide-react";
import type { DateRange } from "@/lib/types";

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onChange: (value: DateRange) => void;
}

const OPTIONS: { label: string; shortLabel: string; value: DateRange }[] = [
  { label: "Last 7 Days", shortLabel: "7D", value: "last-7-days" },
  { label: "Last 30 Days", shortLabel: "30D", value: "last-30-days" },
  { label: "Last 3 Months", shortLabel: "3M", value: "last-3-months" },
  { label: "Last 6 Months", shortLabel: "6M", value: "last-6-months" },
  { label: "Last Year", shortLabel: "1Y", value: "last-year" },
];

export function DateRangeSelector({ selectedRange, onChange }: DateRangeSelectorProps) {
  const selectedLabel = OPTIONS.find((option) => option.value === selectedRange)?.label ?? "Last 7 Days";

  return (
    <div className="rounded-[20px] border border-border bg-surface p-3 shadow-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
            <CalendarDays className="h-4 w-4" />
          </span>
          Date Range
        </div>
        <span className="hidden rounded-full bg-muted px-3 py-1 text-xs font-bold text-foreground/60 sm:inline-flex">
          {selectedLabel}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {OPTIONS.map((option) => {
          const isActive = selectedRange === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-full px-3 py-2 text-xs font-extrabold transition ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-background text-foreground/60 hover:bg-muted hover:text-foreground"
              }`}
              aria-pressed={isActive}
            >
              <span className="sm:hidden">{option.shortLabel}</span>
              <span className="hidden sm:inline">{option.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
