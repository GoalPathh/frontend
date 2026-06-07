import type { ReactNode } from "react";

interface PreferenceCardProps {
  icon: ReactNode;
  title: string;
  current: string;
  actionLabel: string;
  onAction: () => void;
  accentClass?: string;
}

export function PreferenceCard({ icon, title, current, actionLabel, onAction, accentClass = "bg-[#f3f2ff] text-[#9288F8]" }: PreferenceCardProps) {
  return (
    <button
      type="button"
      onClick={onAction}
      className="group rounded-[24px] border border-[#e4e5f1] bg-white p-5 text-left shadow-sm transition hover:border-[#9288F8]"
    >
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${accentClass}`}>{icon}</div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-[#121221]">{title}</p>
        <p className="mt-2 text-sm text-[#6b7280]">Current: {current}</p>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[#9288F8]">
        <span>{actionLabel}</span>
        <span className="text-base">›</span>
      </div>
    </button>
  );
}
