import { apiRequest } from "./api";
import { Goal, GoalCategory, GoalFormData, Habit } from "./types";

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

type ApiGoalDashboardGoal = ApiGoal & {
  totalMinutes?: number;
  status?: "On Track" | "Behind Schedule" | "At Risk";
  daysLeft?: number | null;
  milestoneCount?: number;
  completedMilestoneCount?: number;
};

type ApiGoalDashboardResponse = {
  summary: GoalDashboard["summary"];
  strongestGoal: ApiGoalDashboardGoal | null;
  goals: ApiGoalDashboardGoal[];
};

export type GoalDashboardGoal = Goal & {
  totalMinutes: number;
  status: "On Track" | "Behind Schedule" | "At Risk";
  daysLeft: number | null;
  milestoneCount: number;
  completedMilestoneCount: number;
};

export type GoalDashboard = {
  summary: {
    activeGoals: number;
    totalHabits: number;
    totalMinutes: number;
    averageProgress: number;
    atRiskGoals: number;
    completedMilestones: number;
  };
  strongestGoal: GoalDashboardGoal | null;
  goals: GoalDashboardGoal[];
};

const starterHabitSuggestions: Record<string, Habit[]> = {
  speak: [
    {
      id: "starter-habit-1",
      title: "Learn 5 new vocabulary words",
      duration: 15,
      difficulty: "easy",
      schedule: { timeRange: "anytime", activeDays: ["mon", "tue", "wed", "thu", "fri"], priority: "high" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "starter-habit-2",
      title: "Practice speaking for 10 minutes",
      duration: 10,
      difficulty: "medium",
      schedule: { timeRange: "anytime", activeDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], priority: "high" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "starter-habit-3",
      title: "Listen to an English podcast",
      duration: 30,
      difficulty: "easy",
      schedule: { timeRange: "anytime", activeDays: ["mon", "tue", "wed", "thu", "fri"], priority: "medium" },
      createdAt: new Date().toISOString(),
    },
  ],
  lose: [
    {
      id: "starter-habit-4",
      title: "Walk 20 minutes",
      duration: 20,
      difficulty: "easy",
      schedule: { timeRange: "morning", activeDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], priority: "high" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "starter-habit-5",
      title: "Drink 2L water",
      duration: 5,
      difficulty: "easy",
      schedule: { timeRange: "anytime", activeDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], priority: "high" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "starter-habit-6",
      title: "Track daily meals",
      duration: 10,
      difficulty: "medium",
      schedule: { timeRange: "evening", activeDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], priority: "medium" },
      createdAt: new Date().toISOString(),
    },
  ],
  coding: [
    {
      id: "starter-habit-7",
      title: "Code for 30 minutes",
      duration: 30,
      difficulty: "hard",
      schedule: { timeRange: "afternoon", activeDays: ["mon", "tue", "wed", "thu", "fri"], priority: "high" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "starter-habit-8",
      title: "Solve 1 coding problem",
      duration: 25,
      difficulty: "medium",
      schedule: { timeRange: "afternoon", activeDays: ["mon", "tue", "wed", "thu", "fri"], priority: "high" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "starter-habit-9",
      title: "Review yesterday's notes",
      duration: 15,
      difficulty: "easy",
      schedule: { timeRange: "morning", activeDays: ["mon", "tue", "wed", "thu", "fri"], priority: "medium" },
      createdAt: new Date().toISOString(),
    },
  ],
};

function buildGenericHabitSuggestions(goalTitle: string): Habit[] {
  const normalizedTitle = goalTitle.trim() || "your goal";
  const now = new Date().toISOString();

  return [
    {
      id: "starter-generic-1",
      title: `Work on ${normalizedTitle} for 15 minutes`,
      duration: 15,
      difficulty: "easy",
      schedule: { timeRange: "anytime", activeDays: ["mon", "tue", "wed", "thu", "fri"], priority: "high" },
      createdAt: now,
    },
    {
      id: "starter-generic-2",
      title: `Review progress for ${normalizedTitle}`,
      duration: 10,
      difficulty: "easy",
      schedule: { timeRange: "evening", activeDays: ["mon", "wed", "fri", "sun"], priority: "medium" },
      createdAt: now,
    },
    {
      id: "starter-generic-3",
      title: `Prepare the next small step for ${normalizedTitle}`,
      duration: 10,
      difficulty: "medium",
      schedule: { timeRange: "morning", activeDays: ["mon", "tue", "thu", "sat"], priority: "medium" },
      createdAt: now,
    },
  ];
}

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

function mapDashboardGoal(row: ApiGoalDashboardGoal): GoalDashboardGoal {
  return {
    ...mapApiGoal(row),
    totalMinutes: Number(row.totalMinutes ?? 0),
    status: row.status ?? "On Track",
    daysLeft: typeof row.daysLeft === "number" ? row.daysLeft : null,
    milestoneCount: Number(row.milestoneCount ?? 0),
    completedMilestoneCount: Number(row.completedMilestoneCount ?? 0),
  };
}

export const goalCategories: Array<{ label: string; value: GoalCategory }> = [
  { label: "Language", value: "language" },
  { label: "Fitness", value: "fitness" },
  { label: "Skills", value: "skills" },
  { label: "Creativity", value: "creativity" },
  { label: "Learning", value: "learning" },
  { label: "Other", value: "other" },
];

export const goalService = {
  async getGoalsFromApi(): Promise<Goal[]> {
    const rows = await apiRequest<ApiGoal[]>("/goals");
    return rows.map(mapApiGoal);
  },

  async getDashboard(): Promise<GoalDashboard> {
    const data = await apiRequest<ApiGoalDashboardResponse>("/goals/dashboard");

    return {
      summary: data.summary,
      strongestGoal: data.strongestGoal ? mapDashboardGoal(data.strongestGoal) : null,
      goals: (data.goals ?? []).map(mapDashboardGoal),
    };
  },

  async saveGoalToApi(formData: GoalFormData): Promise<Goal> {
    const row = await apiRequest<ApiGoal>("/goals", {
      method: "POST",
      body: JSON.stringify({ ...formData, progress: 0 }),
    });
    return mapApiGoal(row);
  },

  async deleteGoalFromApi(id: string) {
    return apiRequest<void>(`/goals/${id}`, { method: "DELETE" });
  },

  getHabitSuggestions(goalTitle: string): Habit[] {
    const lower = goalTitle.toLowerCase();
    if (lower.includes("english") || lower.includes("speak") || lower.includes("language")) return starterHabitSuggestions.speak;
    if (lower.includes("lose") || lower.includes("weight") || lower.includes("fitness")) return starterHabitSuggestions.lose;
    if (lower.includes("code") || lower.includes("coding") || lower.includes("developer")) return starterHabitSuggestions.coding;
    return buildGenericHabitSuggestions(goalTitle);
  },
};
