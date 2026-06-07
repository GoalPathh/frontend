import { Goal, Habit, HabitSchedule, GoalFormData } from "./types";

const STORAGE_KEY = "goalpath_goals";

// Mock data for AI habit suggestions
const habitSuggestions: Record<string, Habit[]> = {
  speak: [
    {
      id: "habit-1",
      title: "Learn 5 new vocabulary words",
      duration: 15,
      difficulty: "easy",
      schedule: {
        timeRange: "anytime",
        activeDays: ["mon", "tue", "wed", "thu", "fri"],
        priority: "high",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "habit-2",
      title: "Practice speaking for 10 minutes",
      duration: 10,
      difficulty: "medium",
      schedule: {
        timeRange: "anytime",
        activeDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        priority: "high",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "habit-3",
      title: "Listen to an English podcast",
      duration: 30,
      difficulty: "easy",
      schedule: {
        timeRange: "anytime",
        activeDays: ["mon", "tue", "wed", "thu", "fri"],
        priority: "medium",
      },
      createdAt: new Date().toISOString(),
    },
  ],
  lose: [
    {
      id: "habit-1",
      title: "Walk 20 minutes",
      duration: 20,
      difficulty: "easy",
      schedule: {
        timeRange: "morning",
        activeDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        priority: "high",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "habit-2",
      title: "Drink 2L water",
      duration: 5,
      difficulty: "easy",
      schedule: {
        timeRange: "anytime",
        activeDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        priority: "high",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "habit-3",
      title: "Track daily meals",
      duration: 10,
      difficulty: "medium",
      schedule: {
        timeRange: "evening",
        activeDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        priority: "medium",
      },
      createdAt: new Date().toISOString(),
    },
  ],
  coding: [
    {
      id: "habit-1",
      title: "Code for 30 minutes",
      duration: 30,
      difficulty: "hard",
      schedule: {
        timeRange: "afternoon",
        activeDays: ["mon", "tue", "wed", "thu", "fri"],
        priority: "high",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "habit-2",
      title: "Solve 1 coding problem",
      duration: 25,
      difficulty: "medium",
      schedule: {
        timeRange: "afternoon",
        activeDays: ["mon", "tue", "wed", "thu", "fri"],
        priority: "high",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "habit-3",
      title: "Review yesterday's notes",
      duration: 15,
      difficulty: "easy",
      schedule: {
        timeRange: "morning",
        activeDays: ["mon", "tue", "wed", "thu", "fri"],
        priority: "medium",
      },
      createdAt: new Date().toISOString(),
    },
  ],
};

export const goalService = {
  // Get all goals from localStorage
  getAllGoals: (): Goal[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Get single goal by ID
  getGoalById: (id: string): Goal | null => {
    const goals = goalService.getAllGoals();
    return goals.find((g) => g.id === id) || null;
  },

  // Save new goal
  saveGoal: (formData: GoalFormData): Goal => {
    const goals = goalService.getAllGoals();
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: formData.title,
      category: "other",
      period: formData.period,
      progress: 0,
      habits: formData.selectedHabits,
      startDate: formData.startDate,
      targetDate: formData.targetDate,
      reminderEnabled: formData.reminderEnabled,
      notificationPreference: formData.notificationPreference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    goals.push(newGoal);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    }
    return newGoal;
  },

  // Update goal
  updateGoal: (id: string, updates: Partial<Goal>): Goal | null => {
    const goals = goalService.getAllGoals();
    const index = goals.findIndex((g) => g.id === id);

    if (index === -1) return null;

    goals[index] = {
      ...goals[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    }
    return goals[index];
  },

  // Delete goal
  deleteGoal: (id: string): boolean => {
    const goals = goalService.getAllGoals();
    const filtered = goals.filter((g) => g.id !== id);

    if (filtered.length === goals.length) return false;

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
    return true;
  },

  // Get habit suggestions based on goal title
  getHabitSuggestions: (goalTitle: string): Habit[] => {
    const lower = goalTitle.toLowerCase();

    if (lower.includes("english") || lower.includes("speak")) {
      return habitSuggestions.speak;
    }
    if (lower.includes("lose") || lower.includes("weight")) {
      return habitSuggestions.lose;
    }
    if (lower.includes("code") || lower.includes("coding")) {
      return habitSuggestions.coding;
    }

    return [];
  },

  // Initialize with mock data if empty
  initializeMockData: () => {
    const goals = goalService.getAllGoals();
    if (goals.length === 0 && typeof window !== "undefined") {
      const mockGoals: Goal[] = [
        {
          id: "goal-1",
          title: "Speak English Fluently",
          category: "language",
          period: "6months",
          progress: 68,
          habits: habitSuggestions.speak.slice(0, 2),
          startDate: new Date().toISOString(),
          targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          reminderEnabled: true,
          notificationPreference: "all",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "goal-2",
          title: "Lose 5kg",
          category: "fitness",
          period: "3months",
          progress: 42,
          habits: habitSuggestions.lose.slice(0, 2),
          startDate: new Date().toISOString(),
          targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          reminderEnabled: true,
          notificationPreference: "all",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "goal-3",
          title: "Improve Coding Skills",
          category: "skills",
          period: "6months",
          progress: 55,
          habits: habitSuggestions.coding.slice(0, 2),
          startDate: new Date().toISOString(),
          targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          reminderEnabled: true,
          notificationPreference: "all",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGoals));
    }
  },
};
