import { achievements, features } from "@/lib/landing-content";
import { SectionHeading } from "@/components/landing/section-heading";
import { cn } from "@/lib/utils";

export function FeaturesSection() {
  return (
    <section className="bg-muted px-4 py-20 sm:px-6 sm:py-24 lg:px-8" id="features">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          align="left"
          title="Everything Gen Z needs to stay consistent"
          description="The landing page keeps the premium SaaS feel from Stitch, but the code is now modular and easier to maintain."
        />

        <div className="grid gap-5 lg:grid-cols-12">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={cn(
                "rounded-panel border border-border p-6 shadow-card sm:p-8",
                feature.variant === "large" && "bg-white lg:col-span-8",
                feature.variant === "primary" && "bg-primary text-white lg:col-span-4",
                feature.variant === "gold" && "bg-[#fff2c7] text-[#4b3500] lg:col-span-4",
                feature.variant === "analytics" && "bg-white lg:col-span-8",
              )}
            >
              <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <feature.icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-extrabold">{feature.title}</h3>
              <p
                className={cn(
                  "mt-3 max-w-xl text-sm leading-7",
                  feature.variant === "primary" ? "text-white/82" : "text-[#6b7280]",
                  feature.variant === "gold" && "text-[#6f5100]",
                )}
              >
                {feature.description}
              </p>

              {feature.variant === "analytics" ? (
                <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_0.8fr]">
                  <div className="rounded-card border border-border bg-[#f8f9ff] p-5">
                    <div className="mb-5 flex items-end gap-2">
                      {[42, 58, 36, 72, 64, 86, 78].map((height, index) => (
                        <span
                          key={height + index}
                          className="flex-1 rounded-t-full bg-primary/75"
                          style={{ height }}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-[#6b7280]">Weekly completion trend</p>
                  </div>
                  <div className="rounded-card border border-border bg-[#f8f9ff] p-5">
                    <p className="text-sm font-bold text-[#6b7280]">Achievements</p>
                    <div className="mt-4 space-y-3">
                      {achievements.map((achievement) => (
                        <div key={achievement.title} className="flex items-center gap-3">
                          <span className="flex size-9 items-center justify-center rounded-full bg-gold/20 text-[#8a6100]">
                            <achievement.icon className="size-5" aria-hidden="true" />
                          </span>
                          <span className="text-sm font-extrabold">{achievement.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

