"use client";

import { useState } from "react";
import {
  Cpu,
  Flame,
  Menu,
  Mic,
  MoreHorizontal,
  Paperclip,
  Send,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB2w4bl-LhdQY2a24NLuM-SKFio6jOZlAkPV4x2D654Th6P_tKpcS_zKUNhcVMJuqEuEbBovvJqkqijZBXF8idVU7g9_22yyjGk0NokMNfm2gMjCWFotmgA9uG4y69LevHyu-WK7YFRqyizIrKIPpfr-B5tis939-TUQ-ZaLEnUrzRUvTeQ6Kk_l9wnzFUBaC5jmf5iwnjT_JRHEgP_vj0Rxn_olwLhLPrNnWmNI1TxUJmiEehIl8uuWRvg5GwBrgZ4skhtuKuo7jvS6p0beDH";

const insightItems = [
  { title: "Today's Goal", Icon: Target },
  { title: "Streak", Icon: Flame },
  { title: "Suggested Micro Habit", Icon: Sparkles },
] as const;

function CoachMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-[92%] items-start gap-3 sm:max-w-[85%]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 sm:size-10">
        <Cpu className="h-5 w-5" />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3.5 text-sm font-medium leading-6 shadow-sm sm:px-5 sm:py-4 sm:text-[15px] sm:leading-7">
        {children}
      </div>
    </div>
  );
}

function InsightsPanel() {
  return (
    <aside className="hidden w-64 shrink-0 2xl:block">
      <div className="sticky top-24 rounded-3xl border border-border bg-surface/80 p-4 shadow-card backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2 px-1">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">Coach insights</h2>
        </div>
        <div className="space-y-2">
          {insightItems.map(({ title, Icon }) => (
            <div key={title} className="rounded-2xl border border-border bg-background/70 p-3">
              <div className="flex items-center gap-2 text-foreground/60">
                <Icon className="h-4 w-4 text-primary" />
                <p className="text-xs font-bold">{title}</p>
              </div>
              <p className="mt-2 text-[11px] font-medium leading-5 text-foreground/40">No insight available yet.</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function CoachPage() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex h-dvh max-w-full overflow-hidden bg-background text-foreground dark:bg-background dark:text-white">
      <AppSidebar active="coach" coachSessions className="hidden lg:flex" />

      {showHistory && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
            aria-label="Close chat history"
          />
          <div className="relative h-full w-[min(86vw,320px)] shadow-2xl">
            <button
              onClick={() => setShowHistory(false)}
              className="absolute right-4 top-5 z-10 rounded-xl p-2 text-foreground/50 transition hover:bg-muted hover:text-primary"
              aria-label="Close chat history"
            >
              <X className="h-5 w-5" />
            </button>
            <AppSidebar
              active="coach"
              coachSessions
              className="w-full"
              onNavigate={() => setShowHistory(false)}
            />
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 border-b border-border bg-surface/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setShowHistory(true)}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-primary transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30 lg:hidden"
                aria-label="Open chat history"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">Coach</h1>
                  <span className="hidden rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-primary sm:inline">
                    AI assistant
                  </span>
                </div>
                <p className="truncate text-[11px] font-medium text-foreground/45 sm:text-xs">
                  Your personal growth assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <ThemeToggle className="size-10 bg-background dark:bg-surface/10" />
              <button
                className="flex size-10 items-center justify-center rounded-xl text-foreground/45 transition hover:bg-muted hover:text-primary"
                aria-label="Coach options"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 justify-center gap-6 overflow-hidden px-0 2xl:px-6">
          <div className="flex min-w-0 max-w-[860px] flex-1 flex-col">
            <section className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8" aria-label="Coach conversation">
              <div className="space-y-7">
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/35">Today</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <CoachMessage>
                    Hi! I&apos;ll help you stay consistent with your goal. How are you feeling about your progress today?
                  </CoachMessage>
                  <div className="ml-12 mt-3 flex flex-wrap gap-2 sm:ml-[52px]">
                    {["Motivate Me", "Simplify Today", "Adjust My Plan", "I Feel Tired"].map((label) => (
                      <button
                        key={label}
                        className="rounded-full border border-primary/20 bg-surface px-3.5 py-2 text-xs font-bold text-primary shadow-sm transition hover:border-primary/40 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98]"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-end gap-3">
                  <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-primary px-4 py-3.5 text-sm font-semibold leading-6 text-white shadow-md shadow-primary/20 sm:px-5 sm:py-4 sm:text-[15px]">
                    I feel tired today.
                  </div>
                  <img src={profileImage} alt="Alex Rivera" className="size-9 rounded-full border border-border object-cover sm:size-10" />
                </div>

                <CoachMessage>
                  That&apos;s okay. Let&apos;s make today lighter so you can still stay consistent. Consistency is better
                  than intensity when energy is low. Would you like to do a 5-minute micro-habit instead?
                </CoachMessage>
              </div>
            </section>

            <footer className="shrink-0 border-t border-border bg-background/95 px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:px-6 lg:pb-5">
              <div className="rounded-2xl border border-border bg-surface p-2 shadow-card focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
                <div className="flex items-center gap-1">
                  <button
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl text-foreground/45 transition hover:bg-muted hover:text-primary"
                    aria-label="Use microphone"
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Tell me what's on your mind..."
                    className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm font-medium text-foreground outline-none placeholder:text-foreground/35"
                  />
                  <button
                    className="hidden size-10 shrink-0 items-center justify-center rounded-xl text-foreground/45 transition hover:bg-muted hover:text-primary sm:flex"
                    aria-label="Attach a file"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-center text-[9px] font-semibold tracking-wide text-foreground/35">
                GoalPath AI can make mistakes. Check important info.
              </p>
            </footer>
          </div>

          <InsightsPanel />
        </div>

        <div className="lg:hidden">
          <BottomNavigation active="coach" />
        </div>
      </main>
    </div>
  );
}
