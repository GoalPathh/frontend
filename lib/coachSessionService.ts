import { apiRequest } from "./api";

export interface CoachSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export const coachSessionService = {
  async list(): Promise<CoachSession[]> {
    try {
      const data = await apiRequest<{ data: CoachSession[] } | CoachSession[]>(
        "/coach/sessions",
      );
      const list = Array.isArray(data) ? data : (data as any).data ?? [];
      return list;
    } catch (e) {
      console.error("[coachSessionService.list] falling back to []:", (e as Error).message);
      return [];
    }
  },

  async create(title?: string): Promise<CoachSession | null> {
    try {
      const body = title ? JSON.stringify({ title }) : undefined;
      const res = await apiRequest<{ data: CoachSession } | CoachSession>(
        "/coach/sessions",
        { method: "POST", body },
      );
      return (res as any)?.data ?? (res as CoachSession) ?? null;
    } catch (e) {
      console.error("[coachSessionService.create] failed:", (e as Error).message);
      return null;
    }
  },

  async rename(id: string, title: string): Promise<CoachSession | null> {
    try {
      const res = await apiRequest<{ data: CoachSession } | CoachSession>(
        `/coach/sessions/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ title }),
        },
      );
      return (res as any)?.data ?? (res as CoachSession) ?? null;
    } catch (e) {
      console.error("[coachSessionService.rename] failed:", (e as Error).message);
      return null;
    }
  },

  async remove(id: string): Promise<boolean> {
    try {
      await apiRequest<void>(`/coach/sessions/${id}`, { method: "DELETE" });
      return true;
    } catch (e) {
      console.error("[coachSessionService.remove] failed:", (e as Error).message);
      return false;
    }
  },
};

/** Format an ISO timestamp to a short relative label. */
export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.max(1, Math.round((now - then) / 1000));
  if (diffSec < 60) return "baru saja";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m lalu`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}j lalu`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay === 1) return "kemarin";
  if (diffDay < 7) return `${diffDay}h lalu`;
  const diffWeek = Math.round(diffDay / 7);
  if (diffWeek < 4) return `${diffWeek}mg lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}
