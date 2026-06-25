import { Bot, Check, Circle, UserRound } from "lucide-react";

const habits = [
  { title: "Learn 5 new words", completed: true },
  { title: "Practice speaking 10 min", completed: false },
  { title: "Listen to a short podcast", completed: false },
] as const;

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[min(20rem,80vw)]">
      {/* iPhone 14 Pro Mockup Base */}
      <div className="relative z-10 w-full rounded-[3rem] border-[8px] border-[#222226] bg-[#0a0a0e] p-1.5 shadow-2xl ring-1 ring-inset ring-[#3a3a40]">
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-3 z-30 flex h-7 w-[100px] -translate-x-1/2 items-center justify-between rounded-full bg-black px-2 shadow-sm">
          <div className="size-2 rounded-full bg-[#111]" />
          <div className="size-2.5 rounded-full border border-[#222] bg-[#000]" />
        </div>

        {/* Screen */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0e] h-[34rem] shadow-inner">
          {/* Status Bar */}
          <div className="flex w-full items-center justify-between px-6 pt-5 pb-2 text-[11px] font-bold text-white">
            <span className="tracking-wider">9:41</span>
            <div className="flex items-center gap-1.5">
              {/* Signal */}
              <svg
                className="h-2.5 w-3"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M1 12h2v4H1zM5 9h2v7H5zM9 5h2v11H9zM13 1h2v15h-2z" />
              </svg>
              {/* Wifi */}
              <svg
                className="h-2.5 w-3.5"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4.6-2.6c2.5-2.5 6.6-2.5 9.2 0l1.4-1.4c-3.3-3.3-8.7-3.3-12 0l1.4 1.4zM.6 6.8c4.1-4.1 10.7-4.1 14.8 0l1.4-1.4C11.9 1 4.1 1-.8 5.4l1.4 1.4z" />
              </svg>
              {/* Battery */}
              <svg
                className="h-2.5 w-5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
              >
                <rect
                  x="1"
                  y="4"
                  width="12"
                  height="8"
                  rx="2"
                  strokeWidth="1.5"
                />
                <path d="M15 7v2" strokeWidth="1.5" strokeLinecap="round" />
                <rect
                  x="2"
                  y="5"
                  width="8"
                  height="6"
                  rx="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </div>
          </div>

          {/* App Content */}
          <div className="flex h-full flex-col px-5 pt-4">
            <div className="mb-6 flex items-center justify-between">
              <span className="rounded-full border border-[#34344a] bg-[#12121a] px-2.5 py-1 text-[10px] font-bold text-[#dcc8ff]">
                AI Coach · Live
              </span>
              <div className="flex size-8 items-center justify-center rounded-full bg-[#7350ff]/15 text-[#dcc8ff]">
                <UserRound className="size-3.5" aria-hidden="true" />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#9980ff]">
                This Morning
              </p>
              <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-[#f8f5ff]">
                Today&apos;s Focus
              </p>
            </div>

            <ul className="space-y-3">
              {habits.map((h) => (
                <li
                  key={h.title}
                  className="flex items-center gap-3.5 rounded-[1.25rem] border border-[#34344a]/50 bg-[#12121a] px-4 py-3.5 shadow-sm transition-transform active:scale-[0.98]"
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                      h.completed
                        ? "border-[#7350ff] bg-[#7350ff] text-white"
                        : "border-[#34344a] bg-[#1a1a26] text-transparent"
                    }`}
                  >
                    {h.completed ? (
                      <Check className="size-3.5" aria-hidden="true" />
                    ) : (
                      <Circle
                        className="size-2.5 fill-[#2a2a3a]"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      h.completed
                        ? "text-[#f8f5ff]/40 line-through"
                        : "text-[#f8f5ff]"
                    }`}
                  >
                    {h.title}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 relative overflow-hidden rounded-[1.5rem] bg-[#3c288c] p-5 text-white">
              <div className="absolute -right-4 -top-4 size-24 rounded-full bg-[#7350ff]/40 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#dcc8ff]">
                  <Bot className="size-3.5" aria-hidden="true" />
                  Coach Tip
                </div>
                <p className="text-[13px] font-medium leading-relaxed text-[#f8f5ff]/90">
                  You&apos;re more consistent on short sessions. Start with 10
                  minutes today and protect the streak.
                </p>
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 h-1.5 w-1/3 -translate-x-1/2 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Phone Shadow / Glow */}
      <div className="absolute -inset-4 z-0 rounded-[4rem] bg-[#7350ff]/20 blur-3xl opacity-50" />
    </div>
  );
}
