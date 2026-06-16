import { apiRequest } from "./api";
import type { PersonaResponse } from "./types";

export const personaService = {
  async get(windowDays: number = 14): Promise<PersonaResponse | null> {
    try {
      return await apiRequest<PersonaResponse>(`/progress/persona?windowDays=${windowDays}`);
    } catch (error) {
      console.error("[personaService.get] falling back to null:", (error as Error).message);
      return null;
    }
  },

  async refresh(windowDays: number = 14): Promise<PersonaResponse | null> {
    try {
      return await apiRequest<PersonaResponse>("/progress/persona/refresh", {
        method: "POST",
        body: JSON.stringify({ windowDays }),
      });
    } catch (error) {
      console.error("[personaService.refresh] failed:", (error as Error).message);
      return null;
    }
  },
};
