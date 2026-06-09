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
          description="GoalPath turns big goals into tiny actions, keeps motivation visible, and helps users recover when life gets messy."
        />

        <div className="grid gap-5 lg:grid-cols-12">
          {features.map((feature, featureIndex) => (
            <article
              key={feature.title}
              className={cn(
                "group relative overflow-hidden rounded-[18px] border p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:p-7",
                feature.variant === "large" && "border-primary/15 bg-white lg:col-span-7",
                feature.variant === "primary" && "border-primary bg-primary text-white lg:col-span-5",
                feature.variant === "gold" && "border-gold/45 bg-[#fff6d8] text-[#4b3500] lg:col-span-5",
                feature.variant === "analytics" && "border-sky/20 bg-white lg:col-span-7",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-[14px]",
                    feature.variant === "primary"
                      ? "bg-white/16 text-white"
                      : feature.variant === "gold"
                        ? "bg-gold/25 text-[#8a6100]"
                        : feature.variant === "analytics"
                          ? "bg-sky/12 text-sky"
                          : "bg-primary/12 text-primary",
                  )}
                >
                  <feature.icon className="size-6" aria-hidden="true" />
                </div>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]",
                    feature.variant === "primary"
                      ? "border-white/25 text-white/80"
                      : "border-border bg-white/70 text-[#6b7280]",
                  )}
                >
                  0{featureIndex + 1}
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-extrabold">{feature.title}</h3>
              <p
                className={cn(
                  "mt-3 max-w-xl text-sm leading-7",
                  feature.variant === "primary" ? "text-white/82" : "text-[#6b7280]",
                  feature.variant === "gold" && "text-[#6f5100]",
                )}
              >
                {feature.description}
              </p>

              <div className="mt-6 grid gap-2">
                {feature.metrics.map((metric) => (
                  <div
                    key={metric}
                    className={cn(
                      "flex items-center justify-between rounded-[12px] border px-4 py-3 text-sm font-extrabold",
                      feature.variant === "primary"
                        ? "border-white/18 bg-white/12 text-white"
                        : "border-border bg-white/76 text-[#121221]",
                    )}
                  >
                    <span>{metric}</span>
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        feature.variant === "gold"
                          ? "bg-gold"
                          : feature.variant === "analytics"
                            ? "bg-sky"
                            : feature.variant === "primary"
                              ? "bg-white"
                              : "bg-primary",
                      )}
                    />
                  </div>
                ))}
              </div>

              {feature.variant === "large" ? (
                <div className="mt-8 rounded-[16px] border border-primary/12 bg-[#f8f9ff] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">AI plan</p>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">Ready</span>
                  </div>
                  <div className="space-y-3">
                    {["Shadowing 10 min", "Learn 5 words", "Speak one sentence"].map((habit, index) => (
                      <div key={habit} className="flex items-center gap-3 rounded-[12px] bg-white p-3 shadow-card">
                        <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">
                          {index + 1}
                        </span>
                        <span className="text-sm font-extrabold text-[#121221]">{habit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {feature.variant === "primary" ? (
                <div className="mt-8 space-y-3">
                  <div className="ml-auto max-w-[82%] rounded-[16px] rounded-br-[4px] bg-white/18 p-4 text-sm font-bold leading-6 text-white">
                    I feel too tired to finish today.
                  </div>
                  <div className="max-w-[88%] rounded-[16px] rounded-bl-[4px] bg-white p-4 text-sm font-bold leading-6 text-primary">
                    Switch to a 5-minute micro-habit and keep your streak alive.
                  </div>
                </div>
              ) : null}

              {feature.variant === "gold" ? (
                <div className="mt-8 rounded-[16px] border border-gold/35 bg-white/70 p-5">
                  <div className="mb-4 flex items-center justify-between text-sm font-extrabold">
                    <span>Today intensity</span>
                    <span className="text-[#8a6100]">Light mode</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#ffe59b]">
                    <div className="h-full w-[48%] rounded-full bg-gold" />
                  </div>
                  <p className="mt-4 text-sm font-bold leading-6 text-[#6f5100]">
                    Goal stays the same. The habit gets easier when energy is low.
                  </p>
                </div>
              ) : null}

              {feature.variant === "analytics" ? (
                <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_0.8fr]">
                  <div className="rounded-[16px] border border-border bg-[#f8f9ff] p-5">
                    <div className="mb-5 flex items-end gap-2">
                      {[42, 58, 36, 72, 64, 86, 78].map((height, index) => (
                        <span
                          key={height + index}
                          className={cn(
                            "flex-1 rounded-t-full",
                            index % 3 === 0 ? "bg-coral/80" : index % 3 === 1 ? "bg-sky/80" : "bg-primary/75",
                          )}
                          style={{ height }}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-[#6b7280]">Weekly completion trend</p>
                  </div>
                  <div className="rounded-[16px] border border-border bg-[#f8f9ff] p-5">
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
