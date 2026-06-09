import { ChevronDown } from "lucide-react";
import type { DateRange } from "@/lib/types";

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onChange: (value: DateRange) => void;
}

const OPTIONS: { label: string; value: DateRange }[] = [
  { label: "Last 7 Days", value: "last-7-days" },
  { label: "Last 30 Days", value: "last-30-days" },
  { label: "Last 3 Months", value: "last-3-months" },
  { label: "Last 6 Months", value: "last-6-months" },
  { label: "Last Year", value: "last-year" },
  { label: "Custom Range", value: "custom" },
];

export function DateRangeSelector({ selectedRange, onChange }: DateRangeSelectorProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-3xl border border-border bg-surface px-4 py-3 shadow-sm">
      <span className="text-sm font-semibold text-foreground/60">Range</span>
      <div className="relative">
        <select
          className="appearance-none pr-8 bg-transparent text-sm font-semibold text-foreground focus:outline-none"
          value={selectedRange}
          onChange={(event) => onChange(event.target.value as DateRange)}
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
      </div>
    </div>
  );
}
