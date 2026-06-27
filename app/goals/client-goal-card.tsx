"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalDashboardGoal, goalService } from "@/lib/goalService";

export function ClientGoalCard({ goal }: { goal: GoalDashboardGoal }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${goal.title}"? This goal and its habits will be removed.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await goalService.deleteGoalFromApi(goal.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete goal:", error);
      alert(error instanceof Error ? error.message : "Unable to delete goal.");
      setIsDeleting(false); // only reset if it fails, otherwise it unmounts
    }
  };

  return (
    <div className={isDeleting ? "opacity-60 pointer-events-none" : ""}>
      <GoalCard goal={goal} onDelete={handleDelete} />
    </div>
  );
}
