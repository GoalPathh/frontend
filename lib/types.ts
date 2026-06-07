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
  status: "On Track" | "Behind Schedule" | "Completed";
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
