"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Loader2, Droplet, BookOpen, Mic, Utensils, Sun, Moon, Target, Globe2 } from "lucide-react";
import { NotificationsPanel } from "@/components/notifications-panel";
import { todayService, TodayHabit } from "@/lib/todayService";
import { TimeRange } from "@/lib/types";

function getHabitIcon(title: string, timeRange: TimeRange) {
  const lower = title.toLowerCase();
  if (lower.includes("water") || lower.includes("drink")) return Droplet;
  if (lower.includes("read") || lower.includes("book") || lower.includes("vocab")) return BookOpen;
  if (lower.includes("speak") || lower.includes("shadow")) return Mic;
  if (lower.includes("lunch") || lower.includes("meal") || lower.includes("food")) return Utensils;
  if (timeRange === "morning") return Sun;
  if (timeRange === "evening") return Moon;
  if (timeRange === "afternoon") return Target;
  return Globe2;
}

// Top nav icons wrapper
export function TodayInteractiveClient({ planDate, habit }: { planDate?: string, habit?: TodayHabit }) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (habit && planDate) {
    const Icon = getHabitIcon(habit.title, habit.schedule.timeRange);

    const handleToggle = async () => {
      if (isSaving) return;
      setIsSaving(true);
      try {
        await todayService.setHabitCompletion(habit.id, !habit.completed, planDate);
        router.refresh();
      } catch (err) {
        console.error("Failed to toggle habit:", err);
      } finally {
        setIsSaving(false);
      }
    };

    const XP_PER_HABIT_COMPLETION = 30;
    const xpDelta = habit.completed ? -XP_PER_HABIT_COMPLETION : XP_PER_HABIT_COMPLETION;

    return (
      <button
        type="button"
        disabled={isSaving}
        onClick={handleToggle}
        className={`w-full rounded-[18px] border border-border p-4 text-left transition-transform active:scale-[0.99] sm:p-5 ${
          habit.completed ? "glass-panel" : "shadow-sm hover:border-primary/40 glass-card"
        } disabled:cursor-not-allowed disabled:opacity-70`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${habit.completed ? "bg-primary text-white shadow-md" : "border-2 border-foreground/30"}`}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : habit.completed ? <Check className="h-4 w-4" /> : null}
            </div>
            <div className="min-w-0">
              <span className={`block truncate text-base ${habit.completed ? "font-medium text-foreground/60 line-through opacity-70" : "font-semibold text-foreground"}`}>
                {habit.title}
              </span>
              <span className="mt-0.5 block truncate text-xs font-semibold text-foreground/45">{habit.goalTitle}</span>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2 text-foreground/60">
            <span
              className={`hidden rounded-full px-2.5 py-1 text-xs font-extrabold sm:inline-flex ${
                habit.completed
                  ? "bg-coral/10 text-coral"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {xpDelta > 0 ? "+" : ""}
              {xpDelta} XP
            </span>
            <span className="hidden rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary sm:inline-flex">{habit.duration} min</span>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 sm:hidden">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${
              habit.completed
                ? "bg-coral/10 text-coral"
                : "bg-primary/10 text-primary"
            }`}
          >
            {xpDelta > 0 ? "+" : ""}
            {xpDelta} XP
          </span>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">{habit.duration} min</span>
        </div>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowNotifications((current) => !current)}
        className="relative flex size-10 items-center justify-center rounded-full border border-border bg-surface/80 text-primary shadow-card transition hover:-translate-y-0.5 active:translate-y-0"
        aria-label="Open notifications"
        aria-expanded={showNotifications}
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(89,79,187,0.4)]" />
      </button>
      <NotificationsPanel open={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  );
}
