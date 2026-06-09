"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Target } from "lucide-react";
import { Goal } from "@/lib/types";
import { goalService } from "@/lib/goalService";
import { GoalCard } from "@/components/goals/goal-card";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data and load goals
    goalService.initializeMockData();
    const loadedGoals = goalService.getAllGoals();
    setGoals(loadedGoals);
    setIsLoading(false);
  }, []);

  const handleAddGoal = () => {
    router.push("/goals/add");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 dark:bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-background/90 backdrop-blur-xl border-b border-border px-6 py-4 dark:border-surface/10 dark:bg-background/90 md:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground dark:text-white">Your Goals</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle className="size-10 bg-surface/80 dark:bg-surface/10" />
            <button
              onClick={handleAddGoal}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Goal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-24 px-6 md:px-10 max-w-7xl mx-auto">
        {/* Page Description */}
        <div className="mb-12">
          <p className="text-foreground/60 text-lg">
            Turn your goals into small daily habits.
          </p>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-primary/10 rounded-full p-4 mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No goals yet</h2>
            <p className="text-foreground/60 mb-6">
              Create your first goal to get started!
            </p>
            <button
              onClick={handleAddGoal}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </main>

      <BottomNavigation active="goals" />
    </div>
  );
}
