"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Droplet, BookOpen, Mic, Utensils, Sun, Moon, Target, Globe2, X } from "lucide-react";
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
  const [completedOverride, setCompletedOverride] = useState<boolean | null>(null);
  const [actionError, setActionError] = useState("");
  const [habitPopup, setHabitPopup] = useState<{
    completed: boolean;
    title: string;
    xpDelta: number;
  } | null>(null);

  useEffect(() => {
    if (!habitPopup) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHabitPopup(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [habitPopup]);

  useEffect(() => {
    setCompletedOverride(null);
  }, [habit?.id, habit?.completed, planDate]);

  if (habit && planDate) {
    const Icon = getHabitIcon(habit.title, habit.schedule.timeRange);
    const XP_PER_HABIT_COMPLETION = 30;
    const completed = completedOverride ?? habit.completed;
    const xpDelta = completed ? -XP_PER_HABIT_COMPLETION : XP_PER_HABIT_COMPLETION;

    const handleToggle = async () => {
      if (isSaving) return;
      const nextCompleted = !completed;
      setCompletedOverride(nextCompleted);
      setActionError("");
      setIsSaving(true);
      try {
        await todayService.setHabitCompletion(habit.id, nextCompleted, planDate);
        setHabitPopup({
          completed: nextCompleted,
          title: habit.title,
          xpDelta,
        });
        router.refresh();
      } catch (err) {
        setCompletedOverride(null);
        setActionError(err instanceof Error ? err.message : "Unable to update this habit.");
        console.error("Failed to toggle habit:", err);
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleToggle}
          aria-label={`${completed ? "Mark incomplete" : "Mark complete"}: ${habit.title}; ${habit.goalTitle}; ${habit.duration} minutes; ${xpDelta > 0 ? "+" : ""}${xpDelta} XP`}
          aria-pressed={completed}
          aria-busy={isSaving}
          className={`w-full cursor-pointer rounded-[18px] border p-4 text-left transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none sm:p-5 ${
            completed
              ? "border-primary/50 bg-primary/5"
              : "border-primary-soft/40 bg-surface hover:border-primary"
          } disabled:cursor-not-allowed disabled:opacity-70`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
              <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${completed ? "border-primary bg-primary text-white" : "border-primary text-primary"}`}>
                {completed ? <Check aria-hidden="true" className="size-4" /> : null}
              </span>
              <div className="min-w-0 flex-1">
                <span className={`block break-words text-base ${completed ? "font-medium text-foreground/80 line-through" : "font-semibold text-foreground"}`}>
                  {habit.title}
                </span>
                <span className="mt-0.5 block break-words text-xs font-semibold text-foreground/70">{habit.goalTitle}</span>
              </div>
            </div>
            <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 pl-10">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">
              {XP_PER_HABIT_COMPLETION} XP
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">
              {habit.duration} min
            </span>
          </div>
        </button>
        {actionError && <p role="alert" className="mt-2 rounded-xl border border-coral/20 bg-coral/10 px-3 py-2 text-xs font-semibold text-coral">{actionError}</p>}

        {habitPopup && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 px-5 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="habit-popup-title"
            onClick={() => setHabitPopup(null)}
          >
            <div
              className="w-full max-w-sm rounded-[20px] border border-border bg-surface p-5 text-center shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setHabitPopup(null)}
                className="ml-auto flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground/70 transition hover:border-primary-soft hover:text-primary active:bg-primary-soft/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                aria-label="Close habit popup"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
              <div className="mx-auto mt-1 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                <Check aria-hidden="true" className="h-7 w-7" />
              </div>
              <h3 id="habit-popup-title" className="mt-4 text-xl font-extrabold tracking-tight text-foreground">
                {habitPopup.completed ? "Habit completed" : "Habit unchecked"}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-foreground/60">
                {habitPopup.title}
              </p>
              <div
                className={`mx-auto mt-4 inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${
                  habitPopup.xpDelta > 0 ? "bg-primary/10 text-primary" : "bg-coral/10 text-coral"
                }`}
              >
                {habitPopup.xpDelta > 0 ? "+" : ""}
                {habitPopup.xpDelta} XP
              </div>
              <button
                type="button"
                onClick={() => setHabitPopup(null)}
                className="mt-5 min-h-11 w-full cursor-pointer rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowNotifications((current) => !current)}
        className="relative flex size-11 cursor-pointer items-center justify-center rounded-full border border-primary-soft/50 bg-background text-primary shadow-card transition hover:bg-primary-soft/15 active:scale-95 active:bg-primary-soft/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
        aria-label="Open notifications"
        aria-expanded={showNotifications}
      >
        <Bell aria-hidden="true" className="h-5 w-5" />
        <span aria-hidden="true" className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
      </button>
      <NotificationsPanel open={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  );
}
