import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/landing/section-heading";

const comparison = [
  {
    title: "Without GoalPath",
    points: ["Ambitious goal", "No daily plan", "Missed habits", "Motivation drops"],
  },
  {
    title: "With GoalPath",
    points: ["AI habit plan", "Small daily actions", "Adaptive difficulty", "Visible growth"],
  },
];

export function FutureSelfSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8" id="progress">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Build a future self one habit at a time"
          description="The product story is simple: when users feel overwhelmed, GoalPath gives them the next small step."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {comparison.map((item, index) => (
            <article
              key={item.title}
              className="rounded-panel border border-border bg-surface p-6 shadow-card sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-extrabold">{item.title}</h3>
                {index === 1 ? (
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-white">
                    Recommended
                  </span>
                ) : null}
              </div>
              <div className="mt-6 space-y-4">
                {item.points.map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    {index === 1 ? (
                      <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
                    ) : (
                      <ArrowUpRight className="size-5 text-[#6b7280]" aria-hidden="true" />
                    )}
                    <span className="font-bold text-[#6b7280]">{point}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

