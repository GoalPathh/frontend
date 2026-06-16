import { apiRequest } from "./api";
import type {
  Achievement,
  ConsistencyPoint,
  DateRange,
  GoalProgress,
  HabitPerformance,
  HeatmapDay,
  Insight,
  ProgressStats,
} from "./types";

type ProgressOverviewResponse = {
  range: DateRange;
  windowDays: number;
  summary: {
    activeGoals: number;
    currentStreak: number;
    totalXp: number;
    completionRate: number;
    habitsCompleted: number;
    habitsMissed: number;
    completedGoals: number;
    atRiskGoals: number;
    totalMilestones: number;
    completedMilestones: number;
  };
  goals: Array<{
    id: string;
    title: string;
    progress: number;
    targetDate: string;
    status: GoalProgress["status"];
    color: string;
    daysLeft: number;
  }>;
  consistencySeries: ConsistencyPoint[];
  habitPerformance: HabitPerformance[];
  heatmap: HeatmapDay[];
  achievements: Achievement[];
  insights: Insight[];
};

export type ProgressOverview = {
  range: DateRange;
  windowDays: number;
  summary: ProgressOverviewResponse["summary"];
  stats: ProgressStats;
  goals: GoalProgress[];
  series: ConsistencyPoint[];
  habits: HabitPerformance[];
  heatmap: HeatmapDay[];
  achievements: Achievement[];
  insights: Insight[];
};

function formatCount(value: number, suffix = "") {
  return `${value.toLocaleString("en-US")}${suffix}`;
}

function mapStats(summary: ProgressOverviewResponse["summary"]): ProgressStats {
  return {
    currentStreak: `${summary.currentStreak} Days`,
    totalXp: formatCount(summary.totalXp, " XP"),
    completionRate: `${summary.completionRate}%`,
    habitsCompleted: formatCount(summary.habitsCompleted),
  };
}

function mapGoals(goals: ProgressOverviewResponse["goals"]): GoalProgress[] {
  return goals.map((goal) => ({
    id: goal.id,
    title: goal.title,
    progress: goal.progress,
    targetDate: goal.targetDate.slice(0, 10),
    status: goal.status,
    color: goal.color,
  }));
}

export const progressService = {
  async getOverview(range: DateRange = "last-7-days"): Promise<ProgressOverview> {
    const data = await apiRequest<ProgressOverviewResponse>(`/progress/overview?range=${range}`);

    return {
      range: data.range,
      windowDays: data.windowDays,
      summary: data.summary,
      stats: mapStats(data.summary),
      goals: mapGoals(data.goals ?? []),
      series: data.consistencySeries ?? [],
      habits: data.habitPerformance ?? [],
      heatmap: data.heatmap ?? [],
      achievements: data.achievements ?? [],
      insights: data.insights ?? [],
    };
  },
};
