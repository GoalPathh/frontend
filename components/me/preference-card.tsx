import type { ReactNode } from "react";

interface PreferenceCardProps {
  icon: ReactNode;
  title: string;
  current: string;
  actionLabel: string;
  onAction: () => void;
  accentClass?: string;
}

export function PreferenceCard({ icon, title, current, actionLabel, onAction, accentClass = "bg-primary/10 text-primary" }: PreferenceCardProps) {
  return (
    <button
      type="button"
      onClick={onAction}
      className="group rounded-[24px] border border-border bg-surface p-5 text-left shadow-sm transition hover:border-primary"
    >
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${accentClass}`}>{icon}</div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-2 text-sm text-foreground/60">Current: {current}</p>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm font-semibold text-primary">
        <span>{actionLabel}</span>
        <span className="text-base">›</span>
      </div>
    </button>
  );
}
