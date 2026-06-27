import type { AppearancePreference } from "@/lib/types";

export const APPEARANCE_KEY = "goalpathAppearance";
export const DEFAULT_APPEARANCE: AppearancePreference = "light";

export function resolveAppearance(preference: AppearancePreference) {
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

    const parsed = JSON.parse(stored) as AppearancePreference;
    return parsed === "dark" ? "dark" : DEFAULT_APPEARANCE;
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function setStoredAppearance(preference: AppearancePreference) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(APPEARANCE_KEY, JSON.stringify(preference));
  applyAppearance(preference);
}
