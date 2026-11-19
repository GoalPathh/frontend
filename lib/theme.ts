import type { AppearancePreference } from "@/lib/types";

// This key is written only by an explicit theme toggle.
export const APPEARANCE_KEY = "goalpathAppearanceV2";
export const DEFAULT_APPEARANCE: AppearancePreference = "light";

export function resolveAppearance(preference: AppearancePreference) {
  if (preference === "system" && typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return preference === "dark" ? "dark" : "light";
}

export function applyAppearance(preference: AppearancePreference) {
  if (typeof window === "undefined") return;

  const resolved = resolveAppearance(preference);
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function getStoredAppearance(): AppearancePreference {
  if (typeof window === "undefined") return DEFAULT_APPEARANCE;

  try {
    const stored = window.localStorage.getItem(APPEARANCE_KEY);
    if (!stored) return DEFAULT_APPEARANCE;

    const parsed: unknown = JSON.parse(stored);
    if (parsed === "light" || parsed === "dark" || parsed === "system") return parsed;
    return DEFAULT_APPEARANCE;
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function setStoredAppearance(preference: AppearancePreference) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(APPEARANCE_KEY, JSON.stringify(preference));
  applyAppearance(preference);
}
