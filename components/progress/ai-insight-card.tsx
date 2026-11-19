import type { Insight } from "@/lib/types";

interface AIInsightCardProps {
  insight: Insight;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <div className="rounded-[18px] border border-border bg-surface p-4 shadow-card">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]">AI Insight</p>
      <p className="mt-3 text-sm font-bold leading-6 text-foreground">{insight.message}</p>
    </div>
  );
}
