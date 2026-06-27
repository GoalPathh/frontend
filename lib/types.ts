// Goal and Habit related types
export type GoalPeriod = "1month" | "3months" | "6months" | "1year";
export type HabitPriority = "low" | "medium" | "high";
export type TimeRange = "anytime" | "morning" | "afternoon" | "evening";
export type GoalCategory =
  | "language"
  | "fitness"
  | "skills"
  | "creativity"
  | "learning"
  | "other";

export interface HabitSchedule {
  timeRange: TimeRange;
  reminderTime?: string; // HH:mm format
  activeDays: string[]; // ['mon', 'tue', etc]
  priority: HabitPriority;
}

export interface Habit {
  id: string;
  title: string;
  duration: number; // in minutes
  difficulty: "easy" | "medium" | "hard";
  schedule: HabitSchedule;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  period: GoalPeriod;
  progress: number; // 0-100
  habits: Habit[];
  startDate: string;
  targetDate: string;
  reminderEnabled: boolean;
  notificationPreference: "all" | "important" | "none";
  createdAt: string;
  updatedAt: string;
}

export interface GoalFormData {
  title: string;
  category: GoalCategory;
  period: GoalPeriod;
  selectedHabits: Habit[];
  startDate: string;
  targetDate: string;
  reminderEnabled: boolean;
  notificationPreference: "all" | "important" | "none";
}

export type DateRange =
  | "last-7-days"
  | "last-30-days"
  | "last-3-months"
  | "last-6-months"
  | "last-year"
  | "custom";

export interface ProgressStats {
  currentStreak: string;
  totalXp: string;
  completionRate: string;
  habitsCompleted: string;
}

export interface GoalProgress {
  id: string;
  title: string;
  progress: number;
  targetDate: string;
  status: "On Track" | "Behind Schedule" | "At Risk" | "Completed";
  color: string;
}

export interface HabitPerformance {
  id: string;
  title: string;
  completionRate: number;
  trend: "up" | "down" | "flat";
  totalCompletions: number;
}

export interface HeatmapDay {
  date: string;
  level: "high" | "medium" | "low" | "none";
}

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  unlocked: boolean;
}

export interface Insight {
  id: string;
  message: string;
  accent: "lavender" | "gold" | "blue" | "coral" | "mint";
}

export interface ConsistencyPoint {
  date: string;
  completionRate: number;
  habitsCompleted: number;
}

export interface UserProfile {
  name: string;
  username: string;
  avatarUrl: string;
  level: number;
  xp: number;
  streakDays: number;
}

export interface UserStats {
  activeGoals: number;
  currentStreak: number;
  completedMilestones: number;
  completionRate: number;
  totalXp: number;
}

export interface NotificationPreference {
  id: string;
  title: string;
  enabled: boolean;
  description: string;
}

export type AppearancePreference = "light" | "dark" | "system";

export type WizardDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type WizardStep = "idle" | "duration" | "habits" | "schedule" | "milestones" | "review";

export interface WizardHabit {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number; // minutes
}

export interface WizardSchedule {
  activeDays: WizardDay[];
  reminderTime?: string; // HH:mm
}

export interface GoalWizardDraft {
  step: WizardStep;
  duration?: GoalPeriod;
  habits: WizardHabit[];
  schedule: WizardSchedule;
  notifications: "all" | "important" | "none";
  milestones: { title: string; target_date?: string }[];
}

export const GOAL_WIZARD_TAG = "[goal_finalized]";

export interface JourneyStep {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export type PersonaArchetype =
  | "Steady Builder"
  | "Comeback Captain"
  | "Momentum Maker"
  | "Streak Hunter"
  | "Marathon Runner"
  | "GoalPath Apprentice";

export type DifficultyAdvice = "easier" | "maintain" | "harder";

export interface PersonaFeatures {
  consistency: number;
  recovery: number;
  completionist: number;
  streak_hunter: number;
  momentum: number;
}

export interface PersonaEvidence {
  streaksRecovered: number;
  longestStreak: number;
  completedLast7: number;
  missedLast7: number;
  completionRate: number;
  avgDifficulty: "easy" | "medium" | "hard";
  goalCount: number;
  habitCount: number;
  newHabitsLast30: number;
  windowDays: number;
}

export interface PersonaMilestoneSuggestion {
  title: string;
  reason: string;
}

export interface PersonaAdvice {
  tone: string;
  difficulty: DifficultyAdvice;
  habit: string[];
  suggestedMilestone: PersonaMilestoneSuggestion | null;
}

export interface PersonaResponse {
  archetype: PersonaArchetype;
  headline: string;
  traits: PersonaFeatures;
  evidence: PersonaEvidence;
  advice: PersonaAdvice;
  generatedAt: string;
  windowDays: number;
}

// ── Subscription types (mirror backend/src/dto/subscription.ts) ──

export type SubscriptionTier = "free" | "premium";
export type SubscriptionStatus = "pending" | "active" | "expired" | "cancelled";

/** Sentinel error flag thrown by the backend when a free-tier limit or premium gate is hit. */
export const SUBSCRIPTION_GATE_CODE = 402;

export interface SubscriptionLimits {
  /** max active goals; null = unlimited */
  maxGoals: number | null;
  /** max habits per single goal; null = unlimited */
  maxHabitsPerGoal: number | null;
  /**
   * max user->coach messages per UTC day (Fair Use Policy).
   * Both tiers now have a CONCRETE cap — no longer `null`-able.
   * Premium is no longer "unlimited"; it's 50/day by default.
   */
  maxCoachMessagesPerDay: number;
  /** the percentage of the coach baseline this tier enjoys (10 | 100) */
  coachAccessPercentage: number;
}

/** Mirror of the `coach/getQuota` API response (daily-utc window). */
export interface CoachQuota {
  max_messages: number;
  used_messages: number;
  remaining_messages: number;
  /** how much of the baseline this tier represents (10 | 100) — for UI badge */
  access_percentage: number;
  /** ISO timestamp marking the current daily window's end (UTC 23:59:59.999) */
  reset_at: string | null;
  /** discriminator so the UI knows it's a daily cap, not the old 3-hour one */
  window: "daily-utc";
}

export interface PlanFeatures {
  unlimitedGoals: boolean;
  unlimitedHabits: boolean;
  fullAiCoachAccess: boolean;
  aiAdaptiveHabit: boolean;
  futureSelfSimulation: boolean;
  prioritySupport: boolean;
  advancedInsight: boolean;
}

export interface SubscriptionResponse {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  limits: SubscriptionLimits;
  features: PlanFeatures;
  premiumPriceIdr: number;
  premiumPeriodDays: number;
}

export interface SubscriptionCheckoutResponse {
  token: string;
  redirectUrl: string;
  orderId: string;
}

export interface SubscriptionWebhookAck {
  accepted: boolean;
  status: "pending" | "settlement" | "cancelled" | "failed";
  signatureMatch: boolean;
}

declare global {
  interface Window {
    /** Midtrans Snap global injected by snap.js. */
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: { finish_redirect_url?: string }) => void;
          onPending?: (result: { finish_redirect_url?: string }) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        },
      ) => void;
      embed?: (
        token: string,
        elementId: string,
        options: { embedId?: string; onSuccess?: () => void; onPending?: () => void; onError?: () => void; onClose?: () => void },
      ) => void;
    };
  }
}
