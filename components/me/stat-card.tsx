import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  accent: string;
}

export function StatCard({ title, value, icon, accent }: StatCardProps) {
  return (
    <div className="rounded-[24px] border border-[#e4e5f1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-2xl p-3 text-white" style={{ backgroundColor: accent }}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#6b7280]">{title}</p>
          <p className="mt-3 text-2xl font-bold text-[#121221]">{value}</p>
        </div>
      </div>
    </div>
  );
}
