import { apiRequest } from "./api";
import { Goal, Habit } from "./types";

type ApiHabit = {
  id: string;
  title: string;
  duration: number;
  difficulty: Habit["difficulty"];
  time_range: Habit["schedule"]["timeRange"];
  reminder_time: string | null;
  active_days: string[] | null;
  priority: Habit["schedule"]["priority"];
  created_at: string;
};

type ApiGoal = {
  id: string;
  title: string;
  category: Goal["category"];
  period: Goal["period"];
  progress: number | string;
  habits?: ApiHabit[];
  start_date: string;
  target_date: string;
  reminder_enabled: boolean;
  notification_preference: Goal["notificationPreference"];
  created_at: string;
  updated_at: string;
};

export type TodayCompletion = {
  habit_id: string;
  completed: boolean;
};

export type TodayPlan = {
  date: string;
  goals: Goal[];
  completions: TodayCompletion[];
};

export type TodayProfile = {
  name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
};

export type TodayStats = {
  habitsCompleted7d: number;
  habitsMissed7d: number;
  totalCompletions: number;
  currentStreak: number;
  totalXp: number;
  completionRate: number;
  profile?: {
    xp?: number;
    streak_days?: number;
    level?: number;
  };
};

function mapApiGoal(row: ApiGoal): Goal {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    period: row.period,
    progress: Number(row.progress) || 0,
    habits: (row.habits ?? []).map((habit) => ({
      id: habit.id,
      title: habit.title,
      duration: habit.duration,
      difficulty: habit.difficulty,
      schedule: {
        timeRange: habit.time_range,
        reminderTime: habit.reminder_time ?? undefined,
        activeDays: habit.active_days ?? [],
        priority: habit.priority,
      },
      createdAt: habit.created_at,
    })),
    startDate: row.start_date,
    targetDate: row.target_date,
    reminderEnabled: row.reminder_enabled,
    notificationPreference: row.notification_preference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const todayService = {
  async getToday(): Promise<TodayPlan> {
    const data = await apiRequest<{ date: string; goals: ApiGoal[]; completions: TodayCompletion[] }>("/today");
    return {
      date: data.date,
      goals: data.goals.map(mapApiGoal),
      completions: data.completions ?? [],
    };
  },

  getProfile() {
    return apiRequest<TodayProfile>("/me");
  },

  getStats() {
    return apiRequest<TodayStats>("/progress/dash");
  },

  setHabitCompletion(habitId: string, completed: boolean, completionDate: string) {
    return apiRequest<TodayCompletion>(`/habits/${habitId}/completion`, {
      method: "PUT",
      body: JSON.stringify({ completed, completionDate }),
    });
  },
};
