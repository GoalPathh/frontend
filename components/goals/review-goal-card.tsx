import { Goal } from "@/lib/types";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

interface ReviewGoalCardProps {
  goal: Omit<Goal, "id" | "createdAt" | "updatedAt">;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCategory(category: Goal["category"]) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function ReviewGoalCard({ goal }: ReviewGoalCardProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-border bg-surface p-6">
        <h3 className="mb-4 text-lg font-bold text-foreground">{goal.title}</h3>
        <div className="grid gap-4 text-sm text-foreground/60 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>
              {formatDate(goal.startDate)} - {formatDate(goal.targetDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{goal.period.replace(/([0-9]+)([a-z]+)/, "$1 $2").toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>{formatCategory(goal.category)} category</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-bold text-foreground">Your Habits</h4>
        <div className="space-y-2">
          {goal.habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{habit.title}</p>
                <p className="text-xs text-foreground/60">
                  {habit.duration} min • {habit.schedule.priority} priority •{" "}
                  {habit.schedule.activeDays.length} days/week
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[16px] border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-foreground">Reminders</p>
          <span
            className={`text-sm font-bold ${
              goal.reminderEnabled ? "text-green-600 dark:text-green-400" : "text-foreground/60"
            }`}
          >
            {goal.reminderEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <p className="text-xs text-foreground/60">
          Notifications: {goal.notificationPreference}
        </p>
      </div>
    </div>
  );
}
