import { Bot, Check, Circle, UserRound } from "lucide-react";
import { habits } from "@/lib/landing-content";

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[min(18rem,82vw)] rounded-[2.4rem] border-[10px] border-[#121221] bg-[#121221] p-2 shadow-2xl">
      <div className="overflow-hidden rounded-[1.8rem] bg-white p-4">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6b7280]">
              Morning Routine
            </p>
            <p className="text-sm font-extrabold text-[#121221]">Today&apos;s Focus</p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
            <UserRound className="size-4" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.title}
              className="flex items-center gap-3 rounded-2xl border border-border bg-[#f8f9ff] p-3"
            >
              <span className="flex size-6 items-center justify-center rounded-full border border-primary/30 bg-white text-primary">
                {habit.completed ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Circle className="size-3" aria-hidden="true" />
                )}
              </span>
              <span className="text-xs font-bold text-[#121221]">{habit.title}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-primary p-4 text-white">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] opacity-80">
            <Bot className="size-3" aria-hidden="true" />
            AI Coach Tip
          </div>
          <p className="text-xs font-bold leading-5">
            You are more consistent with short sessions. Start with 10 minutes today.
          </p>
        </div>
      </div>
    </div>
  );
}

