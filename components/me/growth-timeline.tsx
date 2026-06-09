import type { JourneyStep } from "@/lib/types";

interface GrowthTimelineProps {
  journey: JourneyStep[];
}

export function GrowthTimeline({ journey }: GrowthTimelineProps) {
  return (
    <div className="rounded-[28px] border border-border bg-surface p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Your Growth Journey</p>
          <h2 className="text-2xl font-bold text-foreground">Milestones so far</h2>
        </div>
      </div>
      <div className="space-y-6">
        {journey.map((step, index) => (
          <div key={step.id} className="relative pl-10">
            <div className="absolute left-0 top-1 h-full w-px bg-border" />
            <div className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-sm font-bold text-primary">
              {index + 1}
            </div>
            <div className="rounded-[24px] border border-[#f1f3ff] bg-[#fafbff] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-foreground">{step.title}</p>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${step.completed ? "bg-gold/20 text-[#8a6100]" : "bg-coral/15 text-coral"}`}>
                  {step.completed ? "Completed" : "Pending"}
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground/60">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
