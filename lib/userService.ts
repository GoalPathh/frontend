import { APPEARANCE_KEY } from "@/lib/theme";

const NOTIFICATION_KEY = "goalpathNotifications";

const defaultProfile = {
  name: "Rahma Aulia",
  username: "@rahma",
  avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
  level: 12,
  xp: 3250,
  streakDays: 12,
};

const defaultStats = {
  activeGoals: 4,
  longestStreak: 28,
  achievements: 12,
  completionRate: 84,
};

const defaultAchievements = [
  { id: "first-habit", title: "First Habit Completed", subtitle: "Kickstarted your journey", emoji: "🏆", unlocked: true },
  { id: "7-day-streak", title: "7 Day Streak", subtitle: "Powered through a full week", emoji: "🔥", unlocked: true },
  { id: "30-day-consistency", title: "30 Day Consistency", subtitle: "Committed for a month", emoji: "⭐", unlocked: true },
  { id: "goal-achiever", title: "Goal Achiever", subtitle: "Completed your first goal", emoji: "🎯", unlocked: true },
  { id: "productivity-master", title: "Productivity Master", subtitle: "Maintained daily focus", emoji: "🏅", unlocked: false },
  { id: "mindful-momentum", title: "Mindful Momentum", subtitle: "Built a calm routine", emoji: "🌿", unlocked: false },
];

const defaultJourney = [
  { id: "joined", title: "Joined GoalPath", date: "Jan 2, 2025", completed: true },
  { id: "first-goal", title: "First Goal Created", date: "Jan 3, 2025", completed: true },
  { id: "seven-day", title: "First 7 Day Streak", date: "Jan 10, 2025", completed: true },
  { id: "hundred-xp", title: "100 XP Earned", date: "Jan 12, 2025", completed: true },
  { id: "first-achievement", title: "First Goal Achieved", date: "Jan 16, 2025", completed: true },
];

const defaultNotificationPreferences = [
  { id: "daily-habit", title: "Daily Habit Reminders", enabled: true, description: "Stay on track with daily check-ins." },
  { id: "progress-updates", title: "Goal Progress Updates", enabled: true, description: "Get updates when goals move forward." },
  { id: "achievement-alerts", title: "Achievement Notifications", enabled: true, description: "Celebrate every badge you unlock." },
  { id: "ai-coach", title: "AI Coach Suggestions", enabled: false, description: "Receive smart prompts from your coach." },
  { id: "weekly-reports", title: "Weekly Reports", enabled: true, description: "Review your performance every week." },
];

const isBrowser = typeof window !== "undefined";

function getLocalStorageItem<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function setLocalStorageItem<T>(key: string, value: T) {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const userService = {
  getUserProfile() {
    return defaultProfile;
  },

  getUserStats() {
    return defaultStats;
  },

  getAchievements() {
    return defaultAchievements;
  },

  getJourney() {
    return defaultJourney;
  },

  getAppearancePreference() {
    return getLocalStorageItem<"light" | "dark" | "system">(APPEARANCE_KEY, "light");
  },

  setAppearancePreference(value: "light" | "dark" | "system") {
    setLocalStorageItem(APPEARANCE_KEY, value);
  },

  getNotificationPreferences() {
    return getLocalStorageItem(NOTIFICATION_KEY, defaultNotificationPreferences);
  },

  saveNotificationPreferences(preferences: Array<{ id: string; title: string; enabled: boolean; description: string }>) {
    setLocalStorageItem(NOTIFICATION_KEY, preferences);
  },
};
