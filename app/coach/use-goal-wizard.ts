"use client";

import { useCallback, useEffect, useState } from "react";
import {
  GOAL_WIZARD_TAG,
  GoalPeriod,
  GoalWizardDraft,
  WizardDay,
  WizardHabit,
  WizardSchedule,
  WizardStep,
} from "@/lib/types";

const STORAGE_KEY = "goalpath_wizard_draft";

const EMPTY_DRAFT: GoalWizardDraft = {
  step: "idle",
  habits: [],
  schedule: { activeDays: [] },
  notifications: "all",
  milestones: [],
};

function loadFromStorage(): GoalWizardDraft {
  if (typeof window === "undefined") return EMPTY_DRAFT;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DRAFT;
    return { ...EMPTY_DRAFT, ...JSON.parse(raw) } as GoalWizardDraft;
  } catch {
    return EMPTY_DRAFT;
  }
}

function persist(draft: GoalWizardDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

/**
 * Build the standalone JSON message text that the backend will detect via GOAL_WIZARD_TAG.
 * Returns plain string for chat DB column; backend splits TAG from JSON.
 */
export function buildWizardMessageContent(draft: GoalWizardDraft): string {
  const payload = {
    duration: draft.duration,
    habits: draft.habits.map((h) => ({
      title: h.title,
      difficulty: h.difficulty,
      // store in minutes so backend keeps consistent unit
      duration_minutes: h.duration,
    })),
    schedule: {
      activeDays: draft.schedule.activeDays,
      reminderTime: draft.schedule.reminderTime,
    },
    notifications: draft.notifications,
  };
  return `${GOAL_WIZARD_TAG} ${JSON.stringify(payload)}`;
}

export function useGoalWizard() {
  const [draft, setDraft] = useState<GoalWizardDraft>(EMPTY_DRAFT);

  useEffect(() => {
    setDraft(loadFromStorage());
  }, []);

  useEffect(() => {
    persist(draft);
  }, [draft]);

  const setStep = useCallback((step: WizardStep) => {
    setDraft((d) => ({ ...d, step }));
  }, []);

  const setDuration = useCallback((duration: GoalPeriod) => {
    setDraft((d) => ({ ...d, duration, step: "habits" }));
  }, []);

  const addHabit = useCallback(() => {
    setDraft((d) => {
      if (d.habits.length >= 3) return d;
      return {
        ...d,
        habits: [
          ...d.habits,
          { title: "", difficulty: "medium", duration: 15 },
        ],
      };
    });
  }, []);

  const updateHabit = useCallback(
    (idx: number, patch: Partial<WizardHabit>) => {
      setDraft((d) => ({
        ...d,
        habits: d.habits.map((h, i) => (i === idx ? { ...h, ...patch } : h)),
      }));
    },
    []
  );

  const removeHabit = useCallback((idx: number) => {
    setDraft((d) => ({
      ...d,
      habits: d.habits.filter((_, i) => i !== idx),
    }));
  }, []);

  const toggleDay = useCallback((day: WizardDay) => {
    setDraft((d) => {
      const schedule: WizardSchedule = { ...d.schedule };
      if (schedule.activeDays.includes(day)) {
        schedule.activeDays = schedule.activeDays.filter((x) => x !== day);
      } else {
        schedule.activeDays = [...schedule.activeDays, day];
      }
      return { ...d, schedule };
    });
  }, []);

  const setReminderTime = useCallback((reminderTime: string | undefined) => {
    setDraft((d) => ({ ...d, schedule: { ...d.schedule, reminderTime } }));
  }, []);

  const goToSchedule = useCallback(() => {
    setDraft((d) => ({ ...d, step: "schedule" }));
  }, []);

  const goToReview = useCallback(() => {
    setDraft((d) => ({ ...d, step: "review" }));
  }, []);

  const goToMilestones = useCallback(() => {
    setDraft((d) => ({ ...d, step: "milestones" as WizardStep }));
  }, []);

  const startWizard = useCallback((prefill?: {
    hint?: string | null;
    duration?: GoalPeriod | null;
    category?: string | null;
    title?: string | null;
    habits?: Array<{ title: string; difficulty?: string }>;
  }) => {
    const nextDraft: GoalWizardDraft = {
      ...EMPTY_DRAFT,
      step: prefill?.duration ? "habits" : "duration",
      duration: prefill?.duration || undefined,
      habits: (prefill?.habits ?? []).slice(0, 3).map((h) => ({
        title: String(h.title ?? "").trim(),
        difficulty: ["easy", "medium", "hard"].includes(String(h.difficulty)) ? (h.difficulty as "easy" | "medium" | "hard") : "medium",
        duration: 15,
      })),
    };
    setDraft(nextDraft);
    // Category hint, if any, is consumed via setMeta from caller (page.tsx wizardMeta)
  }, []);

  const resetWizard = useCallback(() => {
    setDraft(EMPTY_DRAFT);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const cancelWizard = useCallback(() => {
    resetWizard();
  }, [resetWizard]);

  // Detect natural-language cancel intent (id-ID + en) so user can cancel wizard from chat.
  const isCancelMessage = useCallback((text: string) => {
    const t = text.trim().toLowerCase();
    if (!t) return false;
    return /^(batal|cancel|stop|nggak|jangan dulu|nggak dulu|nanti dulu|tidak dulu|skip|nevermind|ga jadi|ga dulu|maybe later|gdln|batalin)\b/i.test(t);
  }, []);

  const setMeta = useCallback((meta: { title: string; category: string }) => {
    setDraft((d) => ({ ...d, ...meta }));
  }, []);

  const setMilestones = useCallback(
    (
      ms: { title: string; target_date?: string }[] | ((prev: { title: string; target_date?: string }[]) => { title: string; target_date?: string }[]),
    ) => {
      setDraft((d) => ({
        ...d,
        milestones:
          typeof ms === "function"
            ? (ms as (p: { title: string; target_date?: string }[]) => { title: string; target_date?: string }[])(d.milestones)
            : ms,
      }));
    },
    [],
  );

  const updateMilestone = useCallback(
    (index: number, patch: Partial<{ title: string; target_date?: string }>) => {
      setDraft((d) => ({
        ...d,
        milestones: d.milestones.map((m, i) => (i === index ? { ...m, ...patch } : m)),
      }));
    },
    [],
  );

  const removeMilestone = useCallback((index: number) => {
    setDraft((d) => ({ ...d, milestones: d.milestones.filter((_, i) => i !== index) }));
  }, []);

  return {
    draft,
    setMeta,
    setStep,
    setDuration,
    addHabit,
    updateHabit,
    removeHabit,
    toggleDay,
    setReminderTime,
    goToSchedule,
    goToReview,
    startWizard,
    resetWizard,
    cancelWizard,
    isCancelMessage,
    setMilestones,
    updateMilestone,
    removeMilestone,
    goToMilestones,
  };
}
