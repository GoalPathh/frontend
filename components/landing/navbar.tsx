import { Target } from "lucide-react";
import { navigation } from "@/lib/landing-content";
import { Button } from "@/components/ui/button";

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

        <Button className="hidden sm:inline-flex">Get Started</Button>
        <Button className="sm:hidden" aria-label="Get started">
          Start
        </Button>
      </nav>
    </header>
  );
}

