import type { JourneyStep } from "@/lib/types";

interface GrowthTimelineProps {
  journey: JourneyStep[];
}

export function GrowthTimeline({ journey }: GrowthTimelineProps) {
  return (
    <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9288F8]">Your Growth Journey</p>
          <h2 className="text-2xl font-bold text-[#121221]">Milestones so far</h2>
        </div>
      </div>
      <div className="space-y-6">
        {journey.map((step, index) => (
          <div key={step.id} className="relative pl-10">
            <div className="absolute left-0 top-1 h-full w-px bg-[#e4e5f1]" />
            <div className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#e4e5f1] bg-white text-sm font-bold text-[#9288F8]">
              {index + 1}
            </div>
            <div className="rounded-[24px] border border-[#f1f3ff] bg-[#fafbff] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-[#121221]">{step.title}</p>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${step.completed ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#b91c1c]"}`}>
                  {step.completed ? "Completed" : "Pending"}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#6b7280]">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
