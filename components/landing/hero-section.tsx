import { PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneMockup } from "@/components/landing/phone-mockup";
import { stats } from "@/lib/landing-content";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="page-band relative flex min-h-screen items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-sm font-bold text-primary shadow-card">
            <Sparkles className="size-4" aria-hidden="true" />
            Powered by adaptive goal AI
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Small Steps, <span className="text-primary">Big Changes</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#6b7280] sm:text-lg lg:mx-0">
            GoalPath transforms ambitious goals into manageable daily habits with AI
            planning, coaching, progress tracking, and rewarding gamification.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button className="w-full sm:w-auto">Get Started Free</Button>
            <Button variant="secondary" className="w-full sm:w-auto">
              <PlayCircle className="size-5" aria-hidden="true" />
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <PhoneMockup />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:absolute sm:inset-x-0 sm:top-4 sm:mt-0 sm:block">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "glass-surface rounded-card border-l-4 p-4 shadow-card sm:absolute sm:w-48",
                  stat.tone,
                  index === 0 && "sm:left-0 sm:top-8 float-soft",
                  index === 1 && "sm:bottom-12 sm:left-2 float-soft-delay",
                  index === 2 && "sm:right-0 sm:top-16 float-soft-delay",
                  index === 3 && "sm:bottom-4 sm:right-2 float-soft",
                )}
              >
                <div className="flex items-center gap-3">
                  <stat.icon className="size-6 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-lg font-extrabold leading-none">{stat.value}</p>
                    <p className="mt-1 text-xs font-bold text-[#6b7280]">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

