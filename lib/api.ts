const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const TOKEN_KEY = "goalpath_access_token";
const REFRESH_TOKEN_KEY = "goalpath_refresh_token";

type ApiResponse<T> = { data: T };
export type MaybeApiData<T> = T | ApiResponse<T>;

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function hasAuthSession() {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.localStorage.getItem(TOKEN_KEY) ||
    window.localStorage.getItem(REFRESH_TOKEN_KEY),
  );
}

export function setAccessToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function setRefreshToken(token: string) {
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearAccessToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function unwrapApiData<T>(payload: MaybeApiData<T>): T {
  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "data" in payload
  ) {
    return payload.data as T;
  }

  return payload as T;
}

async function request<T>(path: string, options: RequestInit, retryOnUnauthorized: boolean): Promise<T> {
  const token = getAccessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401 && retryOnUnauthorized && typeof window !== "undefined") {
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshResponse.ok) {
        const payload = await refreshResponse.json();
        const session = payload.data?.session;
        if (session?.access_token && session?.refresh_token) {
          setAccessToken(session.access_token);
          setRefreshToken(session.refresh_token);
          return request<T>(path, options, false);
        }
      }
      clearAccessToken();
    }
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError(
      payload?.error?.message ?? `Request failed with status ${response.status}.`,
      response.status,
    );
  }

  if (response.status === 204) return undefined as T;
  return ((await response.json()) as ApiResponse<T>).data;
}

export function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, options, true);
}
