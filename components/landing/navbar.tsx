import { Target } from "lucide-react";
import { navigation } from "@/lib/landing-content";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const startButtonClass = cn(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/20 active:translate-y-0",
);

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-surface/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2 font-extrabold">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-card">
            <Target className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg tracking-tight">GoalPath</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-[#6b7280] transition hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle className="bg-white/80" />
          <a href="/login" className={cn(startButtonClass, "hidden sm:inline-flex")}>
            Get Started
          </a>
          <a href="/login" className={cn(startButtonClass, "sm:hidden")} aria-label="Get started">
            Start
          </a>
        </div>
      </nav>
    </header>
  );
}
