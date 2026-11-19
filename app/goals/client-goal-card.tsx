import { GoalDetailTrigger } from "@/components/goals/goal-detail-trigger";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalDashboardGoal } from "@/lib/goalService";

export function ClientGoalCard({ goal }: { goal: GoalDashboardGoal }) {
  return (
    <GoalDetailTrigger goalId={goal.id} initialGoal={goal} className="block">
      <GoalCard goal={goal} />
    </GoalDetailTrigger>
  );
}
