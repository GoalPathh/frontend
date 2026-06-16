import { apiRequest } from "./api";

export type NotificationType =
  | "habit_reminder"
  | "missed_habit"
  | "streak"
  | "coach_tip"
  | "progress_update"
  | "goal_risk";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
  notification_date: string;
  metadata?: Record<string, unknown>;
};

export const notificationService = {
  list() {
    return apiRequest<AppNotification[]>("/notifications");
  },

  markAllRead() {
    return apiRequest<AppNotification[]>("/notifications/read-all", {
      method: "PATCH",
    });
  },
};
