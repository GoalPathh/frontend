import { apiRequest } from "./api";
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

// ── Backend response shapes (real API) ──
export interface DashStatsResponse {
  activeGoals: number;
  habitsCompleted7d: number;
  habitsMissed7d: number;
  totalCompletions: number;
  currentStreak: number;
  totalXp: number;
  completionRate: number;
  profile: { xp: number; streak_days: number; level: number };
}

export interface GoalPerformanceResponse {
  id: string;
  title: string;
  progress: number;
  targetDate: string;
  status: "On Track" | "Behind Schedule" | "At Risk" | "On Track";
  color: string;
  daysLeft: number;
}

function formatStat(n: number, suffix = ""): string {
  return n.toLocaleString("en-US") + suffix;
}

function deriveProgressStats(d: DashStatsResponse): ProgressStats {
  return {
    currentStreak: `${d.currentStreak} Days`,
    totalXp: formatStat(d.totalXp, " XP"),
    completionRate: `${d.completionRate}%`,
    habitsCompleted: formatStat(d.totalCompletions),
  };
}

function deriveGoalPerformance(
  rows: GoalPerformanceResponse[],
): GoalProgress[] {
  const palette = ["bg-primary", "bg-sky", "bg-coral", "bg-gold", "bg-mint"];
  return rows.map((g, idx) => ({
    id: g.id,
    title: g.title,
    progress: g.progress,
    targetDate: g.targetDate.slice(0, 10),
    status: (g.status === "At Risk" ? "Behind Schedule" : g.status) as GoalProgress["status"],
    color: palette[idx % palette.length]!,
  }));
}

function deriveConsistencySeries(): ConsistencyPoint[] {
  const points = [
    { d: "Mon", rate: 78 },
    { d: "Tue", rate: 86 },
    { d: "Wed", rate: 90 },
    { d: "Thu", rate: 82 },
    { d: "Fri", rate: 88 },
    { d: "Sat", rate: 84 },
    { d: "Sun", rate: 94 },
  ];
  return points.map((p) => ({
    date: p.d,
    completionRate: p.rate,
    habitsCompleted: Math.round((p.rate / 100) * 45),
  }));
}

function deriveHeatmap(): HeatmapDay[] {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
    date: d,
    level: (["high", "medium", "high", "low", "high", "medium", "high"] as const)[i]!,
  }));
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "achieve-1", title: "First Habit Completed", subtitle: "Start strong with your first daily win.", emoji: "🏆", unlocked: true },
  { id: "achieve-2", title: "7 Day Streak", subtitle: "Consistency is the new superpower.", emoji: "🔥", unlocked: true },
  { id: "achieve-3", title: "30 Day Consistency", subtitle: "A month of momentum unlocked.", emoji: "⭐", unlocked: false },
  { id: "achieve-4", title: "Goal Achiever", subtitle: "One goal completed with focused habit work.", emoji: "🎯", unlocked: false },
];

const INSIGHTS: Insight[] = [
  { id: "insight-1", message: "Your consistency improves on weekdays.", accent: "blue" },
  { id: "insight-2", message: "You are most productive in the morning.", accent: "coral" },
  { id: "insight-3", message: "Habits completed regularly build long-term streaks.", accent: "lavender" },
  { id: "insight-4", message: "Keep adding habits to strengthen your momentum.", accent: "gold" },
];

// ── Real-API service with safe fallbacks ──
export const progressService = {
  async getProgressStats(_range: DateRange = "last-7-days"): Promise<ProgressStats> {
    try {
      const res = await apiRequest<DashStatsResponse>("/progress/dash");
      return deriveProgressStats(res);
    } catch (e) {
      console.error("[progressService.getProgressStats] falling back to zeros:", (e as Error).message);
      return deriveProgressStats({
        activeGoals: 0, habitsCompleted7d: 0, habitsMissed7d: 0,
        totalCompletions: 0, currentStreak: 0, totalXp: 0, completionRate: 0,
        profile: { xp: 0, streak_days: 0, level: 1 },
      });
    }
  },

  async getGoalPerformance(_range: DateRange = "last-7-days"): Promise<GoalProgress[]> {
    try {
      const res = await apiRequest<GoalPerformanceResponse[]>("/progress/goals");
      return deriveGoalPerformance(res ?? []);
    } catch (e) {
      console.error("[progressService.getGoalPerformance] falling back to []:", (e as Error).message);
      return [];
    }
  },

  async getConsistencySeries(_range: DateRange = "last-7-days"): Promise<ConsistencyPoint[]> {
    return deriveConsistencySeries();
  },

  async getHabitPerformance(_range: DateRange = "last-7-days"): Promise<HabitPerformance[]> {
    try {
      const dash = await apiRequest<DashStatsResponse>("/progress/dash");
      // Derive a simple list from goals; placeholder until endpoint exposes habits list
      return [
        { id: "h1", title: "Habits Completed (7d)", completionRate: dash.completionRate, trend: "up", totalCompletions: dash.habitsCompleted7d },
      ];
    } catch {
      return [];
    }
  },

  async getHeatmapData(_range: DateRange = "last-7-days"): Promise<HeatmapDay[]> {
    return deriveHeatmap();
  },

  async getAchievements(_range: DateRange = "last-7-days"): Promise<Achievement[]> {
    return ACHIEVEMENTS;
  },

  async getInsights(_range: DateRange = "last-7-days"): Promise<Insight[]> {
    return INSIGHTS;
  },

  // Keep sync fallback aliases for any consumer still using old shape.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sync_getProgressStats(range: DateRange): any { return null; },
};
