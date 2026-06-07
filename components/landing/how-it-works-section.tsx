import { ArrowRight } from "lucide-react";
import { workflow } from "@/lib/landing-content";
import { SectionHeading } from "@/components/landing/section-heading";
import { cn } from "@/lib/utils";

export function HowItWorksSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8" id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Workflow"
          title="From big ambition to daily action"
          description="GoalPath guides users through goal creation, AI breakdown, daily habits, consistency recovery, and achievement."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {workflow.map((step, index) => (
            <div key={step.title} className="relative">
              <article className="h-full rounded-card border border-border bg-surface p-5 text-center shadow-card">
                <div
                  className={cn(
                    "mx-auto mb-4 flex size-16 items-center justify-center rounded-full border-2 bg-white",
                    step.tone,
                  )}
                >
                  <step.icon className="size-7" aria-hidden="true" />
                </div>
                <h3 className="text-base font-extrabold">{step.title}</h3>
              </article>
              {index < workflow.length - 1 ? (
                <ArrowRight
                  className="absolute -right-5 top-1/2 z-10 hidden size-6 -translate-y-1/2 text-primary/45 lg:block"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

