"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { USER_PROFILE_EVENT, userService, type UserOverview } from "@/lib/userService";

let cachedOverview: UserOverview | null = null;
let overviewRequest: Promise<UserOverview> | null = null;
let overviewCacheVersion = 0;

function requestOverview() {
  if (!overviewRequest) {
    const request = userService.getOverview();
    overviewRequest = request;
    void request.then(
      () => { if (overviewRequest === request) overviewRequest = null; },
      () => { if (overviewRequest === request) overviewRequest = null; },
    );
  }
  return overviewRequest;
}

export function useProfileOverview(nextPath: string) {
  const router = useRouter();
  const [overview, setOverviewState] = useState<UserOverview | null>(cachedOverview);
  const [loading, setLoading] = useState(cachedOverview === null);
  const [error, setError] = useState("");

  const setOverview: Dispatch<SetStateAction<UserOverview | null>> = useCallback((next) => {
    setOverviewState((current) => {
      const updated = typeof next === "function" ? next(current) : next;
      cachedOverview = updated;
      return updated;
    });
  }, []);

  const reload = useCallback(async () => {
    const requestVersion = overviewCacheVersion;
    setLoading(cachedOverview === null);
    setError("");
    try {
      const fresh = await requestOverview();
      if (requestVersion === overviewCacheVersion) setOverview(fresh);
    } catch (cause) {
      if (requestVersion !== overviewCacheVersion) return;
      if (cause instanceof ApiError && cause.status === 401) {
        router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
        return;
      }
      setError(cause instanceof Error ? cause.message : "Unable to load account details.");
    } finally {
      if (requestVersion === overviewCacheVersion) setLoading(false);
    }
  }, [nextPath, router, setOverview]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const handleProfileEvent = (event: Event) => {
      const profile = (event as CustomEvent<UserOverview["profile"] | null>).detail;
      if (!profile) {
        overviewCacheVersion += 1;
        cachedOverview = null;
        overviewRequest = null;
        setOverviewState(null);
        setLoading(true);
        return;
      }
      if (cachedOverview) {
        const updated = { ...cachedOverview, profile };
        cachedOverview = updated;
        setOverviewState(updated);
      }
    };
    window.addEventListener(USER_PROFILE_EVENT, handleProfileEvent);
    return () => window.removeEventListener(USER_PROFILE_EVENT, handleProfileEvent);
  }, []);

  return { overview, setOverview, loading, error, reload };
}
