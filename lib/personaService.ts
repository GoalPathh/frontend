import { apiRequest, unwrapApiData, type MaybeApiData } from "./api";
import type { PersonaResponse } from "./types";

export const personaService = {
  async get(windowDays: number = 14): Promise<PersonaResponse | null> {
    try {
      const response = await apiRequest<MaybeApiData<PersonaResponse>>(
        `/progress/persona?windowDays=${windowDays}`,
      );
      return unwrapApiData(response);
    } catch (e) {
      console.error("[personaService.get] falling back to null:", (e as Error).message);
      return null;
    }
  },

  async refresh(windowDays: number = 14): Promise<PersonaResponse | null> {
    try {
      const response = await apiRequest<MaybeApiData<PersonaResponse>>(
        `/progress/persona/refresh`,
        {
          method: "POST",
          body: JSON.stringify({ windowDays }),
        },
      );
      return unwrapApiData(response);
    } catch (e) {
      console.error("[personaService.refresh] failed:", (e as Error).message);
      return null;
    }
  },
};
