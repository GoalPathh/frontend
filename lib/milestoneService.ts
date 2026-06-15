import { apiRequest } from "./api";

// Shape of milestone objects returned by backend (matches goal_milestones table).
export interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  target_date: string | null;
  sort_order: number;
  completed_at: string | null;
  created_at: string;
}

export interface SuggestedMilestone {
  title: string;
  target_date?: string;
}

export const milestoneService = {
  async list(goalId: string): Promise<Milestone[]> {
    return apiRequest<Milestone[]>(`/goals/${goalId}/milestones`);
  },

  async setMilestones(
    goalId: string,
    items: SuggestedMilestone[],
  ): Promise<Milestone[]> {
    const data = await apiRequest<{ data: Milestone[] }>(
      `/goals/${goalId}/milestones`,
      {
        method: "PUT",
        body: JSON.stringify({ milestones: items }),
      },
    );
    return (data as any).data ?? (data as any);
  },

  async toggle(
    goalId: string,
    milestoneId: string,
    completed: boolean,
  ): Promise<Milestone> {
    const data = await apiRequest<{ data: Milestone }>(
      `/goals/${goalId}/milestones/${milestoneId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ completed }),
      },
    );
    return (data as any).data ?? (data as any);
  },

  async suggest(input: {
    goalTitle: string;
    category?: string;
    duration?: string;
    habits?: { title: string; difficulty?: string }[];
  }): Promise<{ milestones: SuggestedMilestone[]; source: string }> {
    const data = await apiRequest<{
      data: { milestones: SuggestedMilestone[]; source: string };
    }>(`/milestones/suggest`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    return (data as any).data ?? (data as any);
  },
};
