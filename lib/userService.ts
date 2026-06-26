import { apiRequest } from "@/lib/api";
import { getStoredAppearance, setStoredAppearance } from "@/lib/theme";
import type {
  AppearancePreference,
  NotificationPreference,
  UserProfile,
  UserStats,
} from "@/lib/types";

type ApiProfile = {
  name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  level?: number | null;
  xp?: number | null;
  streak_days?: number | null;
};

type ApiPreferences = {
  appearance?: AppearancePreference | null;
  notifications?: NotificationPreference[] | null;
};

type AvatarUploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  uploadUrl: string;
};

type MeOverviewResponse = {
  profile: ApiProfile;
  preferences: ApiPreferences;
  stats: {
    activeGoals: number;
    currentStreak: number;
    completedMilestones: number;
    completionRate: number;
    totalXp: number;
  };
  summary: {
    totalHabits: number;
    totalMinutes: number;
    averageProgress: number;
    atRiskGoals: number;
    unreadNotifications: number;
  };
};

export type UserOverview = {
  profile: UserProfile;
  preferences: {
    appearance: AppearancePreference;
    notifications: NotificationPreference[];
  };
  stats: UserStats;
  summary: MeOverviewResponse["summary"];
};

const defaultNotifications: NotificationPreference[] = [
  { id: "daily-habit", title: "Daily Habit Reminders", enabled: true, description: "Stay on track with daily check-ins." },
  { id: "progress-updates", title: "Goal Progress Updates", enabled: true, description: "Get updates when goals move forward." },
  { id: "achievement-alerts", title: "Achievement Notifications", enabled: true, description: "Celebrate every badge you unlock." },
  { id: "ai-coach", title: "AI Coach Suggestions", enabled: false, description: "Receive smart prompts from your coach." },
  { id: "weekly-reports", title: "Weekly Reports", enabled: true, description: "Review your performance every week." },
];

function normalizeProfile(profile: ApiProfile): UserProfile {
  const usernameRaw = String(profile.username ?? "").trim();
  const username = usernameRaw ? (usernameRaw.startsWith("@") ? usernameRaw : `@${usernameRaw}`) : "@goalpath";

  return {
    name: String(profile.name ?? "GoalPath User").trim() || "GoalPath User",
    username,
    avatarUrl: String(profile.avatar_url ?? "").trim(),
    level: Number(profile.level ?? 1),
    xp: Number(profile.xp ?? 0),
    streakDays: Number(profile.streak_days ?? 0),
  };
}

function normalizePreferences(preferences?: ApiPreferences | null) {
  return {
    appearance: preferences?.appearance ?? getStoredAppearance(),
    notifications:
      preferences?.notifications && preferences.notifications.length > 0
        ? preferences.notifications
        : defaultNotifications,
  };
}

function normalizeOverview(payload: MeOverviewResponse): UserOverview {
  const preferences = normalizePreferences(payload.preferences);

  return {
    profile: normalizeProfile(payload.profile),
    preferences,
    stats: {
      activeGoals: Number(payload.stats?.activeGoals ?? 0),
      currentStreak: Number(payload.stats?.currentStreak ?? 0),
      completedMilestones: Number(payload.stats?.completedMilestones ?? 0),
      completionRate: Number(payload.stats?.completionRate ?? 0),
      totalXp: Number(payload.stats?.totalXp ?? 0),
    },
    summary: {
      totalHabits: Number(payload.summary?.totalHabits ?? 0),
      totalMinutes: Number(payload.summary?.totalMinutes ?? 0),
      averageProgress: Number(payload.summary?.averageProgress ?? 0),
      atRiskGoals: Number(payload.summary?.atRiskGoals ?? 0),
      unreadNotifications: Number(payload.summary?.unreadNotifications ?? 0),
    },
  };
}

export const userService = {
  async getOverview() {
    const response = await apiRequest<MeOverviewResponse>("/me/overview");
    const overview = normalizeOverview(response);
    setStoredAppearance(overview.preferences.appearance);
    return overview;
  },

  async updateProfile(input: { name?: string; username?: string; avatarUrl?: string }) {
    const response = await apiRequest<ApiProfile>("/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    return normalizeProfile(response);
  },

  async updatePreferences(input: {
    appearance?: AppearancePreference;
    notifications?: NotificationPreference[];
  }) {
    const response = await apiRequest<ApiPreferences>("/me/preferences", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    const preferences = normalizePreferences(response);
    setStoredAppearance(preferences.appearance);
    return preferences;
  },

  async uploadAvatar(file: File) {
    const signature = await apiRequest<AvatarUploadSignature>("/me/avatar/signature", {
      method: "POST",
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signature.apiKey);
    formData.append("timestamp", String(signature.timestamp));
    formData.append("signature", signature.signature);
    formData.append("folder", signature.folder);
    formData.append("public_id", signature.publicId);

    const response = await fetch(signature.uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error?.message ?? "Avatar upload failed.");
    }

    const payload = (await response.json()) as {
      secure_url?: string;
      public_id?: string;
    };

    if (!payload.secure_url) {
      throw new Error("Cloudinary did not return a secure URL.");
    }

    return {
      secureUrl: payload.secure_url,
      publicId: payload.public_id ?? signature.publicId,
    };
  },

  getAppearancePreference() {
    return getStoredAppearance();
  },

  setAppearancePreference(value: AppearancePreference) {
    setStoredAppearance(value);
  },
};
