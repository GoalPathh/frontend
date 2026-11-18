import type { AppSection } from "@/components/app-sidebar";
import { BottomNavigation } from "@/components/bottom-navigation";

const titles: Record<AppSection, string> = {
  today: "Today",
  goals: "Goals",
  progress: "Progress",
  coach: "Coach",
  me: "Account",
  pricing: "Pricing",
};

export function RouteLoadingShell({ active }: { active: AppSection }) {
  return (
    <div
      aria-label={`Loading ${titles[active]}`}
      aria-busy="true"
      className="min-h-screen bg-background pb-32 text-foreground lg:pb-10 lg:pl-[272px]"
    >
      <aside className="fixed inset-y-0 left-0 hidden w-[272px] border-r border-border bg-surface p-5 lg:block">
        <div className="h-10 w-36 animate-pulse rounded-xl bg-muted" />
        <div className="mt-8 space-y-3 border-y border-border py-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="mt-5 h-28 animate-pulse rounded-2xl bg-muted" />
      </aside>

      <header className="fixed top-0 z-40 h-[68px] w-full border-b border-border bg-background/90 px-6 backdrop-blur-xl lg:left-[272px] lg:w-[calc(100%-272px)]" />
      <main className="mx-auto mt-24 max-w-7xl space-y-6 px-5 md:px-10">
        <div className="h-44 animate-pulse rounded-[24px] border border-border bg-surface" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[20px] border border-border bg-surface" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="h-72 animate-pulse rounded-[20px] border border-border bg-surface" />
          <div className="h-72 animate-pulse rounded-[20px] border border-border bg-surface" />
        </div>
      </main>
      <BottomNavigation active={active} />
    </div>
  );
}
