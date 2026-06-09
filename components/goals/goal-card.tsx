import { Goal } from "@/lib/types";
import { Zap } from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const categoryIcons: Record<string, string> = {
    language: "🌍",
    fitness: "💪",
    skills: "🎯",
    creativity: "🎨",
    learning: "📚",
    other: "⭐",
  };

  const categoryColors: Record<string, string> = {
    language: "bg-blue-50 text-blue-700",
    fitness: "bg-orange-50 text-orange-700",
    skills: "bg-purple-50 text-purple-700",
    creativity: "bg-pink-50 text-pink-700",
    learning: "bg-green-50 text-green-700",
    other: "bg-gray-50 text-gray-700",
  };

  return (
    <div
      onClick={onClick}
      className="bg-surface border border-border rounded-[20px] p-6 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Header with Icon and Category */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{categoryIcons[goal.category]}</span>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[goal.category]}`}>
          {goal.progress}%
        </span>
      </div>

      {/* Goal Title */}
      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
        {goal.title}
      </h3>

      {/* Habit Count */}
      <p className="text-sm text-foreground/60 mb-4">
        {goal.habits.length} active habit{goal.habits.length !== 1 ? "s" : ""}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {/* Goal Period */}
      <div className="flex items-center justify-between text-xs text-foreground/60">
        <span>{goal.period.replace(/([0-9]+)([a-z]+)/, "$1 $2").toUpperCase()}</span>
        <div className="flex items-center gap-1 text-primary">
          <Zap className="w-3 h-3" />
          <span className="font-semibold">
            {goal.habits.reduce((sum, h) => sum + h.duration, 0)} min/day
          </span>
        </div>
      </div>
    </div>
  );
}
