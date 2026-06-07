import type { Insight } from "@/lib/types";

interface AIInsightCardProps {
  insight: Insight;
}

const accentClasses: Record<Insight["accent"], string> = {
  lavender: "bg-[#9288F8]/10 text-[#9288F8]",
  gold: "bg-[#FBBF24]/10 text-[#B27A00]",
  blue: "bg-[#60A5FA]/10 text-[#2563EB]",
  coral: "bg-[#FB7185]/10 text-[#B91C1C]",
  mint: "bg-[#22C55E]/10 text-[#166534]",
};

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <div className={`rounded-[28px] border border-[#e4e5f1] bg-white p-5 shadow-sm ${accentClasses[insight.accent]}`}>
      <p className="text-sm font-semibold">AI Insight</p>
      <p className="mt-4 text-base font-bold text-[#121221]">{insight.message}</p>
    </div>
  );
}
