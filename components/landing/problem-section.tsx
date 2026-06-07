import { problems } from "@/lib/landing-content";
import { SectionHeading } from "@/components/landing/section-heading";
import { cn } from "@/lib/utils";

export function ProblemSection() {
  return (
    <section className="bg-surface px-4 py-20 sm:px-6 sm:py-24 lg:px-8" id="problem">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Why do most goals fail?"
          description="Traditional habit tracking is static. Real life is messy, attention is fragmented, and big goals often feel too heavy to start."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem) => (
            <article
              key={problem.title}
              className={cn(
                "rounded-card border border-border border-t-4 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft",
                problem.border,
              )}
            >
              <problem.icon className={cn("mb-5 size-8", problem.accent)} aria-hidden="true" />
              <h3 className="text-lg font-extrabold">{problem.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6b7280]">{problem.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

