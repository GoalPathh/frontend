import type { Insight } from "@/lib/types";

interface AIInsightCardProps {
  insight: Insight | {
    id: string;
    title: string;
    observation: string;
    reason: string;
    recommendation: string;
  };
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  const observation = "observation" in insight ? insight.observation : insight.message;
  return (
    <div className="rounded-[18px] border border-border bg-surface p-4 shadow-card">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">
        {"title" in insight ? insight.title : "Activity insight"}
      </p>
      <p className="mt-2 text-sm font-bold leading-6 text-foreground">{observation}</p>
      {"reason" in insight && (
        <>
          <p className="mt-2 text-xs leading-5 text-foreground/60">{insight.reason}</p>
          <p className="mt-3 border-t border-border pt-3 text-xs font-semibold leading-5 text-primary">{insight.recommendation}</p>
        </>
      )}
    </div>
  );
}
