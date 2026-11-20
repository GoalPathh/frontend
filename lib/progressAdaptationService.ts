import { apiRequest } from "@/lib/api";
import type { DateRange } from "@/lib/types";
import { USER_PROFILE_EVENT } from "@/lib/userService";

export const PROGRESS_REFRESH_EVENT = "goalpath:progress-refresh";

export type AdaptationChanges = {
  title?: string;
  duration?: number;
  timeRange?: "anytime" | "morning" | "afternoon" | "evening";
  activeDays?: string[];
};

export type AdaptationRecommendation = {
  id: string;
  goalId: string;
  habitId: string;
  goalTitle: string;
  habitTitle: string;
  type: "reduce_difficulty" | "optimize_schedule" | "habit_replacement" | "recovery_plan";
  title: string;
  reason: string;
  changes: AdaptationChanges;
  before?: AdaptationChanges;
  status: "pending";
};

export type AdaptationInsight = {
  id: string;
  title: string;
  observation: string;
  reason: string;
  recommendation: string;
};

export type AdaptationDay = {
  day: string;
  key: string;
  observations?: number;
  scheduled: number;
  planned?: number;
  pending?: number;
  completed: number;
  missed: number;
  completionRate: number | null;
};

export type AdaptationHistoryItem = {
  id: string;
  goalId: string | null;
  habitId: string | null;
  goalTitle: string;
  habitTitle: string;
  title: string;
  type: string;
  status: "pending" | "applied" | "dismissed";
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  createdAt: string;
  resolvedAt: string | null;
};

export type GoalAdaptationReview = {
  id: string;
  title: string;
  progress: number;
  targetDate: string;
  status: string;
  expectedProgress: number;
  daysLeft: number;
  behindBy: number;
  completionRate: number;
  completed: number;
  scheduled: number;
  plannedScheduled: number;
  pendingToday: number;
  missed: number;
  weeklyHabitCompletion: number;
  consistencyTrend: "up" | "down" | "steady" | "insufficient-data";
  bestDays: string[];
  missedDays: string[];
  weekdayStats: AdaptationDay[];
  habits: Array<{
    id: string;
    title: string;
    duration: number;
    difficulty: string;
    completionRate: number;
    completed: number;
    scheduled: number;
    pending: number;
    missed: number;
  }>;
  bottleneckHabit: {
    title: string;
    completionRate: number;
    completed: number;
    scheduled: number;
    duration: number;
  } | null;
  insight: string;
  narrative: string;
  recommendations: AdaptationRecommendation[];
};

export type ProgressAdaptation = {
  range: DateRange;
  windowDays: number;
  analysisSource: "ai" | "rules" | "insufficient-data";
  coachPersonalizationEnabled: boolean;
  hasEnoughData: boolean;
  analysis: {
    narrative: string;
    insights: AdaptationInsight[];
    leastProductiveDay: AdaptationDay | null;
    mostProductiveDay: AdaptationDay | null;
    frequentlyMissedDays: AdaptationDay[];
    bestTimeSlot: {
      slot: string;
      label: string;
      scheduled: number;
      completed: number;
      completionRate: number | null;
    } | null;
  };
  performance: {
    completionRate: number;
    completed: number;
    scheduled: number;
    plannedScheduled: number;
    pendingToday: number;
    missed: number;
    activeDays: number;
    dayCount: number;
    consistencyScore: number;
    previousCompletionRate: number;
    hasPreviousData: boolean;
    changePoints: number | null;
  };
  productivityByDay: AdaptationDay[];
  recommendations: AdaptationRecommendation[];
  history: AdaptationHistoryItem[];
  goalReview: GoalAdaptationReview | null;
};

const cache = new Map<string, ProgressAdaptation>();
if (typeof window !== "undefined") {
  window.addEventListener(USER_PROFILE_EVENT, (event) => {
    if ((event as CustomEvent<unknown>).detail === null) cache.clear();
  });
}

export const progressAdaptationService = {
  peek(range: DateRange, goalId?: string) {
    return cache.get(`${range}:${goalId ?? "all"}`) ?? null;
  },

  async get(range: DateRange, goalId?: string, refresh = false): Promise<ProgressAdaptation> {
    const key = `${range}:${goalId ?? "all"}`;
    if (!refresh && cache.has(key)) return cache.get(key)!;
    const query = new URLSearchParams({ range });
    if (goalId) query.set("goalId", goalId);
    const data = await apiRequest<ProgressAdaptation>(`/progress/adaptation?${query.toString()}`);
    cache.set(key, data);
    return data;
  },

  async apply(recommendationId: string, changes?: AdaptationChanges) {
    const data = await apiRequest<{ id: string; status: "applied"; before: unknown; after: unknown }>(
      `/progress/adaptation/${recommendationId}/apply`,
      { method: "POST", body: JSON.stringify(changes ?? {}) },
    );
    cache.clear();
    if (typeof window !== "undefined") window.dispatchEvent(new Event(PROGRESS_REFRESH_EVENT));
    return data;
  },

  async dismiss(recommendationId: string) {
    const data = await apiRequest<{ id: string; status: "dismissed" }>(
      `/progress/adaptation/${recommendationId}/dismiss`,
      { method: "POST", body: JSON.stringify({}) },
    );
    cache.clear();
    return data;
  },
};
