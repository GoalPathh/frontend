const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

type ApiResponse<T> = { data: T };
export type MaybeApiData<T> = T | ApiResponse<T>;

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

// Server Component helper (requires passing headers manually)
export function getApiUrl() {
  return API_URL;
}

export function hasAuthSession() {
  return typeof window !== "undefined";
}

// Since we use httpOnly cookies, the browser automatically sends them to the backend 
// IF the frontend and backend are on the same domain.
// However, since they are on different ports/domains (3000 vs 4000), 
// we must ensure credentials are included.
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
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include", // This tells fetch to send cookies with cross-origin requests
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401 && retryOnUnauthorized && typeof window !== "undefined") {
    // Attempt backend-side refresh via cookie
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // backend routes.ts falls back to reading cookie if body token is missing
    });
    
    if (refreshResponse.ok) {
      return request<T>(path, options, false);
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
