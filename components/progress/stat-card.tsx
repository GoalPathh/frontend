import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  accentClass: string;
}

export function StatCard({ title, value, icon, accentClass }: StatCardProps) {
  return (
    <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-5 shadow-sm">
      <div className={`inline-flex items-center justify-center rounded-2xl p-3 ${accentClass} bg-opacity-10 text-opacity-100 mb-4`}>
        {icon}
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6b7280] mb-3">{title}</p>
      <h3 className="text-3xl font-bold text-[#121221]">{value}</h3>
    </div>
  );
}
