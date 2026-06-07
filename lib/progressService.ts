import type {
  Achievement,
  ConsistencyPoint,
  DateRange,
  GoalProgress,
  HabitPerformance,
  Insight,
  ProgressStats,
  HeatmapDay,
} from "./types";

const statsByRange: Record<DateRange, ProgressStats> = {
  "last-7-days": {
    currentStreak: "12 Days",
    totalXp: "3,250 XP",
    completionRate: "84%",
    habitsCompleted: "248",
  },
  "last-30-days": {
    currentStreak: "12 Days",
    totalXp: "8,120 XP",
    completionRate: "79%",
    habitsCompleted: "930",
  },
  "last-3-months": {
    currentStreak: "12 Days",
    totalXp: "20,430 XP",
    completionRate: "82%",
    habitsCompleted: "2,540",
  },
  "last-6-months": {
    currentStreak: "12 Days",
    totalXp: "42,800 XP",
    completionRate: "80%",
    habitsCompleted: "5,410",
  },
  "last-year": {
    currentStreak: "12 Days",
    totalXp: "89,600 XP",
    completionRate: "81%",
    habitsCompleted: "11,200",
  },
  custom: {
    currentStreak: "12 Days",
    totalXp: "3,250 XP",
    completionRate: "84%",
    habitsCompleted: "248",
  },
};

const progressGoals: GoalProgress[] = [
  {
    id: "goal-english",
    title: "Speak English Fluently",
    progress: 68,
    targetDate: "2025-12-18",
    status: "On Track",
    color: "bg-[#60A5FA]",
  },
  {
    id: "goal-weight",
    title: "Lose 5kg",
    progress: 42,
    targetDate: "2025-09-14",
    status: "Behind Schedule",
    color: "bg-[#FB7185]",
  },
  {
    id: "goal-coding",
    title: "Improve Coding Skills",
    progress: 55,
    targetDate: "2025-11-03",
    status: "On Track",
    color: "bg-[#9288F8]",
  },
  {
    id: "goal-creator",
    title: "Become a Content Creator",
    progress: 37,
    targetDate: "2026-01-06",
    status: "Behind Schedule",
    color: "bg-[#22C55E]",
  },
];

const habitPerformance: HabitPerformance[] = [
  {
    id: "habit-vocab",
    title: "Learn 5 Vocabulary",
    completionRate: 92,
    trend: "up",
    totalCompletions: 68,
  },
  {
    id: "habit-speaking",
    title: "Practice Speaking",
    completionRate: 85,
    trend: "up",
    totalCompletions: 56,
  },
  {
    id: "habit-water",
    title: "Drink 2L Water",
    completionRate: 82,
    trend: "flat",
    totalCompletions: 62,
  },
];

const consistencyData: Record<DateRange, ConsistencyPoint[]> = {
  "last-7-days": [
    { date: "Mon", completionRate: 78, habitsCompleted: 32 },
    { date: "Tue", completionRate: 86, habitsCompleted: 36 },
    { date: "Wed", completionRate: 90, habitsCompleted: 39 },
    { date: "Thu", completionRate: 82, habitsCompleted: 34 },
    { date: "Fri", completionRate: 88, habitsCompleted: 38 },
    { date: "Sat", completionRate: 84, habitsCompleted: 35 },
    { date: "Sun", completionRate: 94, habitsCompleted: 42 },
  ],
  "last-30-days": Array.from({ length: 30 }, (_, index) => ({
    date: `D${index + 1}`,
    completionRate: 65 + Math.round(Math.sin(index / 4) * 12),
    habitsCompleted: 20 + Math.round(Math.cos(index / 3) * 5),
  })),
  "last-3-months": Array.from({ length: 12 }, (_, index) => ({
    date: `W${index + 1}`,
    completionRate: 70 + Math.round(Math.sin(index / 1.6) * 10),
    habitsCompleted: 25 + Math.round(Math.cos(index / 2) * 8),
  })),
  "last-6-months": Array.from({ length: 12 }, (_, index) => ({
    date: `M${index + 1}`,
    completionRate: 68 + Math.round(Math.cos(index / 2) * 9),
    habitsCompleted: 30 + Math.round(Math.sin(index / 1.8) * 12),
  })),
  "last-year": Array.from({ length: 12 }, (_, index) => ({
    date: `M${index + 1}`,
    completionRate: 72 + Math.round(Math.sin(index / 1.2) * 8),
    habitsCompleted: 28 + Math.round(Math.cos(index / 2) * 10),
  })),
  custom: [
    { date: "Custom 1", completionRate: 82, habitsCompleted: 33 },
    { date: "Custom 2", completionRate: 87, habitsCompleted: 37 },
    { date: "Custom 3", completionRate: 91, habitsCompleted: 40 },
  ],
};

const heatmapData: Record<DateRange, HeatmapDay[]> = {
  "last-7-days": [
    { date: "Mon", level: "high" },
    { date: "Tue", level: "medium" },
    { date: "Wed", level: "high" },
    { date: "Thu", level: "low" },
    { date: "Fri", level: "high" },
    { date: "Sat", level: "medium" },
    { date: "Sun", level: "high" },
  ],
  "last-30-days": Array.from({ length: 30 }, (_, index) => ({
    date: `D${index + 1}`,
    level: index % 7 === 0 ? "none" : index % 5 === 0 ? "low" : index % 3 === 0 ? "medium" : "high",
  })),
  "last-3-months": Array.from({ length: 90 }, (_, index) => ({
    date: `D${index + 1}`,
    level:
      index % 6 === 0 ? "none" : index % 5 === 0 ? "low" : index % 4 === 0 ? "medium" : "high",
  })),
  "last-6-months": Array.from({ length: 180 }, (_, index) => ({
    date: `D${index + 1}`,
    level:
      index % 8 === 0 ? "none" : index % 6 === 0 ? "low" : index % 5 === 0 ? "medium" : "high",
  })),
  "last-year": Array.from({ length: 365 }, (_, index) => ({
    date: `D${index + 1}`,
    level:
      index % 10 === 0 ? "none" : index % 7 === 0 ? "low" : index % 5 === 0 ? "medium" : "high",
  })),
  custom: [
    { date: "C1", level: "medium" },
    { date: "C2", level: "high" },
    { date: "C3", level: "low" },
  ],
};

const achievements: Achievement[] = [
  {
    id: "achieve-1",
    title: "First Habit Completed",
    subtitle: "Start strong with your first daily win.",
    emoji: "🏆",
    unlocked: true,
  },
  {
    id: "achieve-2",
    title: "7 Day Streak",
    subtitle: "Consistency is the new superpower.",
    emoji: "🔥",
    unlocked: true,
  },
  {
    id: "achieve-3",
    title: "30 Day Consistency",
    subtitle: "A month of momentum unlocked.",
    emoji: "⭐",
    unlocked: false,
  },
  {
    id: "achieve-4",
    title: "Goal Achiever",
    subtitle: "One goal completed with focused habit work.",
    emoji: "🎯",
    unlocked: false,
  },
];

const insights: Insight[] = [
  {
    id: "insight-1",
    message: "Your consistency improves on weekdays.",
    accent: "blue",
  },
  {
    id: "insight-2",
    message: "You are most productive in the morning.",
    accent: "coral",
  },
  {
    id: "insight-3",
    message: "English learning habits have the highest completion rate.",
    accent: "lavender",
  },
  {
    id: "insight-4",
    message: "You may lose your streak in the next 3 days if activity decreases.",
    accent: "gold",
  },
];

export const progressService = {
  getProgressStats: (range: DateRange): ProgressStats => statsByRange[range] || statsByRange["last-7-days"],
  getGoalPerformance: (range: DateRange): GoalProgress[] => progressGoals,
  getConsistencySeries: (range: DateRange): ConsistencyPoint[] => consistencyData[range] || consistencyData["last-7-days"],
  getHabitPerformance: (range: DateRange): HabitPerformance[] => habitPerformance,
  getHeatmapData: (range: DateRange): HeatmapDay[] => heatmapData[range] || heatmapData["last-7-days"],
  getAchievements: (range: DateRange): Achievement[] => achievements,
  getInsights: (range: DateRange): Insight[] => insights,
};
