import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  accentClass: string;
}

export function StatCard({ title, value, icon, accentClass }: StatCardProps) {
  return (
    <div className="group rounded-[20px] border border-border bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className={`inline-flex items-center justify-center rounded-[14px] p-3 ${accentClass} mb-5`}>
        {icon}
      </div>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-foreground/50 mb-2">{title}</p>
      <h3 className="text-3xl font-extrabold text-foreground">{value}</h3>
    </div>
  );
}
