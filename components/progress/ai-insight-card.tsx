import type { Insight } from "@/lib/types";

interface AIInsightCardProps {
  insight: Insight;
}

const accentClasses: Record<Insight["accent"], string> = {
  lavender: "bg-primary/10 text-primary",
  gold: "bg-gold/10 text-[#8a6100]",
  blue: "bg-sky/10 text-sky",
  coral: "bg-coral/10 text-coral",
  mint: "bg-primary/10 text-primary",
};

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <div className={`rounded-[18px] border border-border bg-surface p-4 shadow-card ${accentClasses[insight.accent]}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]">AI Insight</p>
      <p className="mt-3 text-sm font-bold leading-6 text-foreground">{insight.message}</p>
    </div>
  );
}
