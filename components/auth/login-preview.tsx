import { Bot, Flame, Medal, TrendingUp } from "lucide-react";

const cards = [
  {
    label: "Current Streak",
    value: "7 Days",
    icon: Flame,
    className: "left-6 top-8 border-coral",
  },
  {
    label: "XP Earned",
    value: "250 XP",
    icon: Medal,
    className: "right-6 top-40 border-gold",
  },
  {
    label: "Completion",
    value: "85%",
    icon: TrendingUp,
    className: "bottom-40 left-16 border-sky",
  },
];

export function LoginPreview() {
  return (
    <div className="relative flex w-full items-center justify-center p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(146,136,248,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.26),transparent_32%)]" />
      <div className="relative h-[520px] w-full max-w-md">
        {cards.map((card, index) => (
          <article
            key={card.label}
            className={`glass-surface absolute w-56 rounded-card border-l-4 p-4 shadow-card ${
              card.className
            } ${index === 1 ? "float-soft-delay" : "float-soft"}`}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-white text-primary">
                <card.icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#6b7280]">
                  {card.label}
                </p>
                <p className="text-lg font-extrabold">{card.value}</p>
              </div>
            </div>
          </article>
        ))}

        <article className="glass-surface absolute bottom-8 right-8 w-64 rounded-card border-2 border-primary/20 p-4 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-primary/15 text-primary">
              <Bot className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-primary">AI Coach</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#6b7280]">
                Ready to crush today&apos;s tasks?
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

