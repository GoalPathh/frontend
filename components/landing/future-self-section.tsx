import { ArrowRight, CheckCircle2, X } from "lucide-react";

const without = [
  "Ambitious goal",
  "No daily plan",
  "Missed habits",
  "Motivation drops",
  "Restart every Monday",
];

const withGoalpath = [
  "AI habit plan",
  "5–10 min starter",
  "Adaptive on hard days",
  "Visible XP & streak",
  "Recovery, not restart",
];

export function FutureSelfSection() {
  return (
    <section
      className="section bg-muted"
      id="progress"
      aria-labelledby="future-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <p className="eyebrow text-[11px] font-bold uppercase tracking-eyebrow text-accent">
              Future self
            </p>
            <h2
              id="future-heading"
              className="display mt-4 text-[clamp(2rem,1.4rem+2.5vw,3rem)] font-semibold text-foreground"
            >
              A version of you,
              <br />
              built one habit
              <br />
              at a time.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              The product story is simple: when life gets heavy, GoalPath hands
              you the next small step instead of a lecture.
            </p>

            {/* pull quote — single amber punctuation on the page */}
            <blockquote className="mt-8 border-l-2 border-accent pl-5">
              <p className="display text-lg font-semibold leading-snug text-foreground sm:text-xl">
                &ldquo;You don&apos;t need another productivity app. You need
                one fewer decision each morning.&rdquo;
              </p>
              <footer className="mt-3 text-xs font-bold uppercase tracking-eyebrow text-muted-foreground">
                — GoalPath, design principle 01
              </footer>
            </blockquote>
          </div>

          {/* editorial comparison — two ruled columns, no card chrome */}
          <div className="grid gap-px overflow-hidden rounded-panel border border-border bg-border lg:grid-cols-2">
            {[
              {
                title: "Without GoalPath",
                points: without,
                tone: "muted-line",
                icon: X,
                recommended: false,
              },
              {
                title: "With GoalPath",
                points: withGoalpath,
                tone: "primary-line",
                icon: CheckCircle2,
                recommended: true,
              },
            ].map((col) => (
              <article
                key={col.title}
                className={
                  "grid grid-rows-[auto_1fr_auto] gap-4 bg-background p-6 sm:p-8 " +
                  (col.recommended ? "bg-surface" : "")
                }
                data-reveal
              >
                <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        "flex size-9 items-center justify-center rounded-full " +
                        (col.recommended
                          ? "bg-primary text-surface"
                          : "bg-muted text-muted-foreground")
                      }
                    >
                      <col.icon className="size-4" aria-hidden="true" />
                    </span>
                    <h3 className="display text-xl font-semibold text-foreground">
                      {col.title}
                    </h3>
                  </div>
                  {col.recommended ? (
                    <span className="rounded-pill border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-eyebrow text-primary">
                      Recommended
                    </span>
                  ) : null}
                </header>

                <ul className="space-y-3 pt-1">
                  {col.points.map((p, i) => (
                    <li
                      key={p}
                      className="flex items-center gap-3 text-sm font-bold text-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className={
                          "numerals text-[11px] font-extrabold " +
                          (col.recommended
                            ? "text-primary"
                            : "text-muted-foreground")
                        }
                      >
                        0{i + 1}
                      </span>
                      <span className="flex-1">{p}</span>
                      {col.recommended ? (
                        <CheckCircle2
                          className="size-4 text-primary"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowRight
                          className="size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  ))}
                </ul>

                <footer className="pt-2 text-xs font-bold text-muted-foreground">
                  {col.recommended
                    ? "Streak protection, day 1."
                    : "Average lifespan of a New Year resolution: 19 days."}
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
