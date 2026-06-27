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
  completion_date?: string;
  xp_delta?: number;
  total_xp?: number;
};

export type TodayHabit = Habit & {
  goalId: string;
  goalTitle: string;
  completed: boolean;
};

export type TodayGoal = Goal & {
  todayCompletedHabits: number;
  todayTotalHabits: number;
};

export type TodayPlan = {
  date: string;
  profile: TodayProfile;
  summary: TodaySummary;
  goals: TodayGoal[];
  habits: TodayHabit[];
  focusQueue: TodayHabit[];
  motivation: TodayMotivation;
};

export type TodayProfile = {
  name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  xp?: number;
  streak_days?: number;
  level?: number;
};

export type TodaySummary = {
  activeGoals: number;
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
  currentStreak: number;
  totalXp: number;
  level: number;
  habitsCompleted7d: number;
  habitsMissed7d: number;
  message: string;
};

export type TodayMotivation = {
  title: string;
  body: string;
  emphasis: string;
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
    const tzOffset = new Date().getTimezoneOffset();
    const data = await apiRequest<{
      date: string;
      profile: TodayProfile;
      summary: TodaySummary;
      goals: Array<ApiGoal & { todayCompletedHabits: number; todayTotalHabits: number }>;
      habits: TodayHabit[];
      focusQueue: TodayHabit[];
      motivation: TodayMotivation;
    }>(`/today?tzOffset=${tzOffset}`);

    return {
      date: data.date,
      profile: data.profile,
      summary: data.summary,
      goals: data.goals.map((goal) => ({
        ...mapApiGoal(goal),
        todayCompletedHabits: goal.todayCompletedHabits,
        todayTotalHabits: goal.todayTotalHabits,
      })),
      habits: data.habits ?? [],
      focusQueue: data.focusQueue ?? [],
      motivation: data.motivation,
    };
  },

  setHabitCompletion(habitId: string, completed: boolean, completionDate: string) {
    return apiRequest<TodayCompletion>(`/habits/${habitId}/completion`, {
      method: "PUT",
      body: JSON.stringify({ completed, completionDate }),
    });
  },
};
