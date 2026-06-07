import { ArrowDown, BadgeCheck, Bolt, Flame, Trophy, UserX } from "lucide-react";

export function RegisterPreview() {
  return (
    <div className="relative flex w-full items-center justify-center p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(183,169,255,0.36),transparent_36%)]" />
      <div className="relative z-10 w-full max-w-sm space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">Meet Your Future Self</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#6b7280]">
            Visualize the transformation waiting for you.
          </p>
        </div>

        <article className="rounded-card border border-white/70 bg-white/55 p-5 opacity-85 shadow-card">
          <div className="mb-4 flex items-center gap-2 text-[#7e7a8d]">
            <UserX className="size-5" aria-hidden="true" />
            <span className="text-sm font-extrabold">Current You</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Inconsistent", "Distracted", "Unstructured"].map((tag) => (
              <span key={tag} className="rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold text-[#7e7a8d]">
                {tag}
              </span>
            ))}
          </div>
        </article>

        <div className="flex justify-center">
          <span className="grid size-10 place-items-center rounded-full bg-primary text-white shadow-card">
            <ArrowDown className="size-5" aria-hidden="true" />
          </span>
        </div>

        <article className="rounded-card border-2 border-primary/20 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <BadgeCheck className="size-5" aria-hidden="true" />
            <span className="text-lg font-extrabold">Future You</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-coral/15 px-3 py-1 text-xs font-extrabold text-[#8f2920]">
              <Flame className="size-3" /> Consistent
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky/15 px-3 py-1 text-xs font-extrabold text-[#245a96]">
              <Bolt className="size-3" /> Focused
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1 text-xs font-extrabold text-[#795900]">
              <Trophy className="size-3" /> Goal-Oriented
            </span>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="mb-2 flex items-center justify-between text-xs font-extrabold">
              <span className="text-[#6b7280]">Daily Streak</span>
              <span className="text-primary">12 Days</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[65%] rounded-full bg-primary" />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

