import { apiRequest, unwrapApiData, type MaybeApiData } from "./api";

export interface CoachSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export interface CoachQuota {
  max_messages: number;
  used_messages: number;
  remaining_messages: number;
  /** how much of the baseline this tier represents (10 | 100) — for UI badge */
  access_percentage: number;
  /** ISO timestamp marking the current daily window's end (UTC 23:59:59.999) */
  reset_at: string | null;
  /** discriminator so the UI knows it's a daily cap, not the old 3-hour one */
  window: "daily-utc";
}

export const coachSessionService = {
  async getQuota(): Promise<CoachQuota | null> {
    try {
      const data = await apiRequest<{ data: CoachQuota } | CoachQuota>("/coach/quota");
      return (data as any)?.data ?? (data as CoachQuota) ?? null;
    } catch (e) {
      console.error("[coachSessionService.getQuota] failed:", (e as Error).message);
      return null;
    }
  },

  async list(): Promise<CoachSession[]> {
    try {
      const data = await apiRequest<MaybeApiData<CoachSession[]>>(
        "/coach/sessions",
      );
      return unwrapApiData(data);
    } catch (e) {
      console.error("[coachSessionService.list] falling back to []:", (e as Error).message);
      return [];
    }
  },

  async create(title?: string): Promise<CoachSession | null> {
    try {
      const body = title ? JSON.stringify({ title }) : undefined;
      const response = await apiRequest<MaybeApiData<CoachSession>>(
        "/coach/sessions",
        { method: "POST", body },
      );
      return unwrapApiData(response);
    } catch (e) {
      console.error("[coachSessionService.create] failed:", (e as Error).message);
      return null;
    }
  },

  async rename(id: string, title: string): Promise<CoachSession | null> {
    try {
      const response = await apiRequest<MaybeApiData<CoachSession>>(
        `/coach/sessions/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ title }),
        },
      );
      return unwrapApiData(response);
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

/**
 * SWR-managed quota cache key. Lives here so the React hook, the
 * `fetchCoachQuota` fetcher, and the `readCoachQuotaFallback` hydrator
 * all agree on the same identifier — keeping cache, dedupe, and
 * sessionStorage in lockstep.
 */
export const COACH_QUOTA_SWR_KEY = "/coach/quota";

/**
 * sessionStorage key for the last known good quota snapshot. Bumped to
 * `v2` after accessPercentage was added to the response shape so any
 * stale entry from the previous schema is discarded rather than
 * rendered as "Akses undefined%".
 */
export const COACH_QUOTA_CACHE_KEY = "coach_quota_cache_v2";
export const COACH_QUOTA_CACHE_LEGACY_KEYS = ["coach_quota_cache", "coach_quota_cache_v1"];

/**
 * Pure fetcher for SWR — thin wrapper around the typed `apiRequest`.
 * SWR passes the cache key as the first argument; we ignore it because
 * we always read the same endpoint. Throws on non-2xx so SWR bubbles
 * the error to its `error` field (no silent `null` returns that would
 * flip the UI into the loading-spinner state forever).
 */
export async function fetchCoachQuota(_key: string): Promise<CoachQuota> {
  const data = await apiRequest<{ data: CoachQuota } | CoachQuota>("/coach/quota");
  return ((data as any)?.data ?? (data as CoachQuota)) as CoachQuota;
}

/**
 * Synchronous fallbackData reader used by `useSWR` on the very first
 * render. Returns `undefined` when no cached snapshot exists or when
 * the cached shape is invalid — letting SWR transparently flip to the
 * loading state on a true cold start (first visit, cleared storage).
 */
export function readCoachQuotaFallback(): CoachQuota | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.sessionStorage.getItem(COACH_QUOTA_CACHE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<CoachQuota>;
    if (
      typeof parsed?.max_messages !== "number" ||
      typeof parsed?.used_messages !== "number" ||
      typeof parsed?.remaining_messages !== "number" ||
      typeof parsed?.access_percentage !== "number"
    ) {
      // Shape mismatch: drop it so SWR fetches fresh from the API.
      window.sessionStorage.removeItem(COACH_QUOTA_CACHE_KEY);
      return undefined;
    }
    return parsed as CoachQuota;
  } catch {
    return undefined;
  }
}

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
