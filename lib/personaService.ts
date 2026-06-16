import { apiRequest } from "./api";
import type { PersonaResponse } from "./types";

export const personaService = {
  async get(windowDays: number = 14): Promise<PersonaResponse | null> {
    try {
      const res = await apiRequest<{ data: PersonaResponse } | PersonaResponse>(
        `/progress/persona?windowDays=${windowDays}`,
      );
      return (res as any)?.data ?? (res as PersonaResponse) ?? null;
    } catch (e) {
      console.error("[personaService.get] falling back to null:", (e as Error).message);
      return null;
    }
  },

  async refresh(windowDays: number = 14): Promise<PersonaResponse | null> {
    try {
      const res = await apiRequest<{ data: PersonaResponse } | PersonaResponse>(
        `/progress/persona/refresh`,
        {
          method: "POST",
          body: JSON.stringify({ windowDays }),
        },
      );
      return (res as any)?.data ?? (res as PersonaResponse) ?? null;
    } catch (e) {
      console.error("[personaService.refresh] failed:", (e as Error).message);
      return null;
    }
  },
};
