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
    <div className={`rounded-[28px] border border-border bg-surface p-5 shadow-sm ${accentClasses[insight.accent]}`}>
      <p className="text-sm font-semibold">AI Insight</p>
      <p className="mt-4 text-base font-bold text-foreground">{insight.message}</p>
    </div>
  );
}
