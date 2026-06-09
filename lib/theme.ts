import type { AppearancePreference } from "@/lib/types";

export const APPEARANCE_KEY = "goalpathAppearance";

export function resolveAppearance(preference: AppearancePreference) {
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return preference;
}

export function applyAppearance(preference: AppearancePreference) {
  if (typeof window === "undefined") return;

  const resolved = resolveAppearance(preference);
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function getStoredAppearance(): AppearancePreference {
  if (typeof window === "undefined") return "light";

  try {
    const stored = window.localStorage.getItem(APPEARANCE_KEY);
    return stored ? (JSON.parse(stored) as AppearancePreference) : "light";
  } catch {
    return "light";
  }
}

export function setStoredAppearance(preference: AppearancePreference) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(APPEARANCE_KEY, JSON.stringify(preference));
  applyAppearance(preference);
}
