import { apiRequest } from "./api";

export interface AdminStats {
  totalUsers: number;
  totalGoals: number;
  totalHabits: number;
  totalSessions: number;
  premiumUsers: number;
}

export interface AdminUserItem {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  profile?: {
    name: string;
    username: string;
    avatar_url: string;
    level: number;
    xp: number;
  } | null;
  subscription?: {
    tier: string;
    status: string;
  } | null;
}

export interface AdminUsersResponse {
  users: AdminUserItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const adminService = {
  async getStats() {
    return apiRequest<AdminStats>("/admin/stats");
  },

  async getUsers(page = 1, limit = 20) {
    return apiRequest<AdminUsersResponse>(`/admin/users?page=${page}&limit=${limit}`);
  },

  async getUser(id: string) {
    return apiRequest<AdminUserItem>(`/admin/users/${id}`);
  },

  async updateUserRole(id: string, role: "USER" | "ADMIN") {
    return apiRequest<{ id: string; email: string; role: "USER" | "ADMIN" }>(
      `/admin/users/${id}/role`,
      {
        method: "PATCH",
        body: JSON.stringify({ role }),
      }
    );
  },
};
