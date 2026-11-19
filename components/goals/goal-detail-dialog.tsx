"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AlertCircle, CalendarDays, Check, Clock3, Loader2, Pencil, Target, Trash2, X } from "lucide-react";
import { goalCategories, goalService } from "@/lib/goalService";
import { milestoneService, type Milestone } from "@/lib/milestoneService";
import { todayService, type TodayHabit } from "@/lib/todayService";
import type { Goal, GoalCategory, GoalPeriod } from "@/lib/types";

type GoalDetailDialogProps = {
  goalId: string;
  initialGoal?: Goal;
  preview?: GoalPreview;
  onClose: () => void;
  onChanged: () => void;
};

export type GoalPreview = {
  title: string;
  progress: number;
  targetDate: string;
};

type GoalEditDraft = {
  title: string;
  category: GoalCategory;
  period: GoalPeriod;
  startDate: string;
  targetDate: string;
  reminderEnabled: boolean;
  notificationPreference: Goal["notificationPreference"];
};

const periods: Array<{ label: string; value: GoalPeriod }> = [
  { label: "1 month", value: "1month" },
  { label: "3 months", value: "3months" },
  { label: "6 months", value: "6months" },
  { label: "1 year", value: "1year" },
];

const timeLabels = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  anytime: "Anytime",
} as const;

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function toDateInput(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function formatDate(value: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function editDraft(goal: Goal): GoalEditDraft {
  return {
    title: goal.title,
    category: goal.category,
    period: goal.period,
    startDate: toDateInput(goal.startDate),
    targetDate: toDateInput(goal.targetDate),
    reminderEnabled: goal.reminderEnabled,
    notificationPreference: goal.notificationPreference,
  };
}

function dateTime(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

export function GoalDetailDialog({ goalId, initialGoal, preview, onClose, onChanged }: GoalDetailDialogProps) {
  const [goal, setGoal] = useState<Goal | null>(initialGoal ?? null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestonesLoaded, setMilestonesLoaded] = useState(false);
  const [todayHabits, setTodayHabits] = useState<TodayHabit[]>([]);
  const [planDate, setPlanDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialGoal && !preview);
  const [loadError, setLoadError] = useState("");
  const [habitLoadError, setHabitLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GoalEditDraft | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      setLoading(!initialGoal && !preview);
      setLoadError("");
      setHabitLoadError("");
      setActionError("");
      setGoal(initialGoal ?? null);
      setMilestones([]);
      setMilestonesLoaded(false);
      setTodayHabits([]);
      setPlanDate(null);

      const [goalResult, milestoneResult, todayResult] = await Promise.allSettled([
        goalService.getGoalFromApi(goalId),
        milestoneService.list(goalId),
        todayService.getToday(),
      ]);

      if (!active) return;

      if (goalResult.status === "fulfilled") {
        setGoal(goalResult.value);
      } else {
        if (!initialGoal && !preview) setLoadError(errorMessage(goalResult.reason, "Unable to load this goal."));
        else setActionError(errorMessage(goalResult.reason, "Unable to refresh this goal."));
      }

      if (milestoneResult.status === "fulfilled") {
        setMilestones(milestoneResult.value);
        setMilestonesLoaded(true);
      } else {
        setMilestonesLoaded(true);
        const message = errorMessage(milestoneResult.reason, "Unable to load milestones.");
        if (initialGoal || preview) setActionError(message);
        else setLoadError((current) => current || message);
      }

      if (todayResult.status === "fulfilled") {
        setPlanDate(todayResult.value.date);
        setTodayHabits(todayResult.value.habits.filter((habit) => habit.goalId === goalId));
      } else {
        setHabitLoadError(errorMessage(todayResult.reason, "Today's habit status is unavailable."));
      }

      setLoading(false);
    }

    void loadDetails();
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      active = false;
      document.body.style.overflow = previousOverflow;
    };
  }, [goalId, initialGoal, preview, retryKey]);

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function handleToggleHabit(habit: TodayHabit) {
    if (!planDate || busyAction) return;
    const completed = !habit.completed;
    setBusyAction(habit.id);
    setActionError("");
    setTodayHabits((current) => current.map((item) => item.id === habit.id ? { ...item, completed } : item));
    try {
      await todayService.setHabitCompletion(habit.id, completed, planDate);
      onChanged();
    } catch (error) {
      setTodayHabits((current) => current.map((item) => item.id === habit.id ? { ...item, completed: habit.completed } : item));
      setActionError(errorMessage(error, "Unable to update this habit."));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleToggleMilestone(milestone: Milestone) {
    if (busyAction) return;
    const completed = !milestone.completed_at;
    const completedAt = completed ? new Date().toISOString() : null;
    setBusyAction(milestone.id);
    setActionError("");
    setMilestones((current) => current.map((item) => item.id === milestone.id ? { ...item, completed_at: completedAt } : item));
    try {
      const updated = await milestoneService.toggle(goalId, milestone.id, completed);
      setMilestones((current) => current.map((item) => item.id === updated.id ? updated : item));
      onChanged();
    } catch (error) {
      setMilestones((current) => current.map((item) => item.id === milestone.id ? { ...item, completed_at: milestone.completed_at } : item));
      setActionError(errorMessage(error, "Unable to update this milestone."));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !draft.title.trim() || busyAction) return;
    setBusyAction("save");
    setActionError("");
    try {
      const updated = await goalService.updateGoalFromApi(goalId, {
        ...draft,
        title: draft.title.trim(),
        startDate: dateTime(draft.startDate),
        targetDate: dateTime(draft.targetDate),
      });
      setGoal(updated);
      setEditing(false);
      setDraft(null);
      onChanged();
    } catch (error) {
      setActionError(errorMessage(error, "Unable to save this goal."));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleDelete() {
    if (!goal || busyAction) return;
    if (!window.confirm(`Delete "${goal.title}"? This goal and its habits will be removed.`)) return;

    setBusyAction("delete");
    setActionError("");
    try {
      await goalService.deleteGoalFromApi(goalId);
      onClose();
      onChanged();
    } catch (error) {
      setActionError(errorMessage(error, "Unable to delete this goal."));
      setBusyAction(null);
    }
  }

  function beginEditing() {
    if (!goal) return;
    setDraft(editDraft(goal));
    setActionError("");
    setEditing(true);
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/45 p-3 sm:p-6"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-detail-title"
        onKeyDown={handleDialogKeyDown}
        className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-[24px] border border-border bg-surface shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Goal details</p>
            <h2 id="goal-detail-title" className="mt-1 break-words text-xl font-extrabold text-foreground sm:text-2xl">
              {goal?.title ?? (loading ? "Loading goal" : "Goal details")}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close goal details"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground/70 transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </header>

        <div className="space-y-6 p-5 sm:p-7">
          {loading ? (
            <div className="flex min-h-40 items-center justify-center gap-3 text-sm font-semibold text-foreground/60" role="status">
              <Loader2 aria-hidden="true" className="size-5 animate-spin text-primary" />
              Loading goal details...
            </div>
          ) : loadError ? (
            <div className="rounded-[18px] border border-coral/25 bg-coral/10 p-5" role="alert">
              <div className="flex items-start gap-3 text-sm font-semibold text-coral">
                <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <p>{loadError}</p>
              </div>
              <button
                type="button"
                onClick={() => setRetryKey((current) => current + 1)}
                className="mt-4 min-h-11 rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Retry
              </button>
            </div>
          ) : goal ? (
            editing && draft ? (
              <form className="space-y-5" onSubmit={handleSave}>
                <div>
                  <label htmlFor="goal-title" className="mb-1.5 block text-sm font-bold text-foreground">Goal title</label>
                  <input
                    id="goal-title"
                    value={draft.title}
                    minLength={2}
                    maxLength={160}
                    required
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="goal-category" className="mb-1.5 block text-sm font-bold text-foreground">Category</label>
                    <select
                      id="goal-category"
                      value={draft.category}
                      onChange={(event) => setDraft({ ...draft, category: event.target.value as GoalCategory })}
                      className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {goalCategories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="goal-period" className="mb-1.5 block text-sm font-bold text-foreground">Period</label>
                    <select
                      id="goal-period"
                      value={draft.period}
                      onChange={(event) => setDraft({ ...draft, period: event.target.value as GoalPeriod })}
                      className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {periods.map((period) => <option key={period.value} value={period.value}>{period.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="goal-start-date" className="mb-1.5 block text-sm font-bold text-foreground">Start date</label>
                    <input
                      id="goal-start-date"
                      type="date"
                      value={draft.startDate}
                      required
                      onChange={(event) => setDraft({ ...draft, startDate: event.target.value })}
                      className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="goal-target-date" className="mb-1.5 block text-sm font-bold text-foreground">Target date</label>
                    <input
                      id="goal-target-date"
                      type="date"
                      value={draft.targetDate}
                      required
                      onChange={(event) => setDraft({ ...draft, targetDate: event.target.value })}
                      className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={draft.reminderEnabled}
                    onChange={(event) => setDraft({ ...draft, reminderEnabled: event.target.checked })}
                    className="size-4 accent-primary"
                  />
                  Reminders enabled
                </label>

                <div>
                  <label htmlFor="goal-notifications" className="mb-1.5 block text-sm font-bold text-foreground">Notification preference</label>
                  <select
                    id="goal-notifications"
                    value={draft.notificationPreference}
                    onChange={(event) => setDraft({ ...draft, notificationPreference: event.target.value as Goal["notificationPreference"] })}
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">All notifications</option>
                    <option value="important">Important only</option>
                    <option value="none">None</option>
                  </select>
                </div>

                {actionError && <p role="alert" className="rounded-xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{actionError}</p>}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => { setEditing(false); setDraft(null); setActionError(""); }} className="min-h-11 rounded-full border border-border bg-background px-5 py-2 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    Cancel
                  </button>
                  <button type="submit" disabled={busyAction !== null || !draft.title.trim()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    {busyAction === "save" && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                    Save changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <section className="rounded-[18px] border border-border bg-background p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">{goal.category}</p>
                      <p className="mt-1 text-sm font-semibold text-foreground/60">{periods.find((period) => period.value === goal.period)?.label ?? goal.period}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-extrabold tabular-nums text-foreground">{Math.round(Math.min(100, Math.max(0, Number(goal.progress) || 0)))}%</p>
                      <p className="text-xs font-bold text-foreground/55">Progress</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      role="progressbar"
                      aria-label={`${goal.title} progress`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.min(100, Math.max(0, Number(goal.progress) || 0))}
                      className="h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${Math.min(100, Math.max(0, Number(goal.progress) || 0))}%` }}
                    />
                  </div>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <p className="flex items-center gap-2 text-foreground/65"><CalendarDays aria-hidden="true" className="size-4 text-primary" />Start: {formatDate(goal.startDate)}</p>
                    <p className="flex items-center gap-2 text-foreground/65"><CalendarDays aria-hidden="true" className="size-4 text-primary" />Target: {formatDate(goal.targetDate)}</p>
                    <p className="flex items-center gap-2 text-foreground/65"><Clock3 aria-hidden="true" className="size-4 text-primary" />Reminders: {goal.reminderEnabled ? "On" : "Off"}</p>
                    <p className="flex items-center gap-2 text-foreground/65"><Target aria-hidden="true" className="size-4 text-primary" />Notifications: {goal.notificationPreference}</p>
                  </div>
                </section>

                <section aria-labelledby="goal-habits-title">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 id="goal-habits-title" className="text-base font-extrabold text-foreground">Habits</h3>
                    <span className="text-xs font-semibold text-foreground/50">{goal.habits.length} total</span>
                  </div>
                  {habitLoadError && <p role="alert" className="mb-3 rounded-xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{habitLoadError}</p>}
                  {goal.habits.length ? (
                    <ul className="space-y-2">
                      {goal.habits.map((habit) => {
                        const todayHabit = todayHabits.find((item) => item.id === habit.id);
                        const isBusy = busyAction === habit.id;
                        return (
                          <li key={habit.id} className="flex items-center gap-3 rounded-[16px] border border-border bg-background p-3">
                            {todayHabit ? (
                              <button
                                type="button"
                                disabled={busyAction !== null}
                                aria-label={`${todayHabit.completed ? "Mark incomplete" : "Mark complete"}: ${habit.title}`}
                                aria-pressed={todayHabit.completed}
                                aria-busy={isBusy}
                                onClick={() => void handleToggleHabit(todayHabit)}
                                className={`flex size-11 shrink-0 items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 ${todayHabit.completed ? "border-primary bg-primary text-white" : "border-border bg-surface text-primary hover:border-primary"}`}
                              >
                                {todayHabit.completed ? <Check aria-hidden="true" className="size-4" /> : null}
                              </button>
                            ) : (
                              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" title={planDate ? "Not scheduled today" : "Schedule status unavailable"}>
                                <Clock3 aria-hidden="true" className="size-4" />
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className={`break-words text-sm font-bold ${todayHabit?.completed ? "text-foreground/60 line-through" : "text-foreground"}`}>{habit.title}</p>
                              <p className="mt-1 text-xs font-semibold text-foreground/50">
                                {timeLabels[habit.schedule.timeRange]} · {habit.duration} min · {habit.schedule.activeDays.join(", ") || "No days set"}
                              </p>
                              {!todayHabit && planDate && !habitLoadError && <p className="mt-1 text-xs font-semibold text-foreground/45">Not scheduled today</p>}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="rounded-[16px] border border-dashed border-border bg-background p-4 text-sm font-semibold text-foreground/55">No habits attached to this goal.</div>
                  )}
                </section>

                <section aria-labelledby="goal-milestones-title">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 id="goal-milestones-title" className="text-base font-extrabold text-foreground">Milestones</h3>
                    <span className="text-xs font-semibold text-foreground/50">{milestonesLoaded ? `${milestones.filter((milestone) => milestone.completed_at).length} of ${milestones.length} done` : ""}</span>
                  </div>
                  {milestones.length ? (
                    <ul className="space-y-2">
                      {milestones.map((milestone) => (
                        <li key={milestone.id} className="flex items-center gap-3 rounded-[16px] border border-border bg-background p-3">
                          <input
                            type="checkbox"
                            checked={Boolean(milestone.completed_at)}
                            disabled={busyAction !== null}
                            aria-label={`${milestone.completed_at ? "Mark incomplete" : "Mark complete"}: ${milestone.title}`}
                            onChange={() => void handleToggleMilestone(milestone)}
                            className="size-5 shrink-0 accent-primary disabled:cursor-not-allowed"
                          />
                          <span className={`min-w-0 flex-1 break-words text-sm font-semibold ${milestone.completed_at ? "text-foreground/55 line-through" : "text-foreground"}`}>{milestone.title}</span>
                          <span className="shrink-0 text-xs font-semibold text-foreground/50">{formatDate(milestone.target_date)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : milestonesLoaded ? (
                    <div className="rounded-[16px] border border-dashed border-border bg-background p-4 text-sm font-semibold text-foreground/55">No milestones for this goal yet.</div>
                  ) : null}
                </section>

                {actionError && <p role="alert" className="rounded-xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{actionError}</p>}

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
                  <button type="button" disabled={busyAction !== null} onClick={() => void handleDelete()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-coral/30 px-5 py-2 text-sm font-bold text-coral transition hover:bg-coral/10 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral">
                    {busyAction === "delete" ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Trash2 aria-hidden="true" className="size-4" />}
                    Delete goal
                  </button>
                  <button type="button" disabled={busyAction !== null} onClick={beginEditing} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <Pencil aria-hidden="true" className="size-4" />
                    Edit goal
                  </button>
                </div>
              </>
            )
          ) : preview ? (
            <section className="rounded-[18px] border border-border bg-background p-4 sm:p-5" aria-labelledby="goal-preview-title">
              <div className="flex items-start justify-between gap-4">
                <h2 id="goal-preview-title" className="break-words text-lg font-extrabold text-foreground">{preview.title}</h2>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-extrabold tabular-nums text-foreground">{Math.round(Math.min(100, Math.max(0, Number(preview.progress) || 0)))}%</p>
                  <p className="text-xs font-bold text-foreground/55">Progress</p>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  role="progressbar"
                  aria-label={`${preview.title} progress`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.min(100, Math.max(0, Number(preview.progress) || 0))}
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{ width: `${Math.min(100, Math.max(0, Number(preview.progress) || 0))}%` }}
                />
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-foreground/65"><CalendarDays aria-hidden="true" className="size-4 text-primary" />Target: {formatDate(preview.targetDate)}</p>
              {actionError && <p role="alert" className="mt-4 rounded-xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{actionError}</p>}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
