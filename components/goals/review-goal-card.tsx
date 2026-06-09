import { Goal } from "@/lib/types";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

interface ReviewGoalCardProps {
  goal: Omit<Goal, "id" | "createdAt" | "updatedAt">;
}

export function ReviewGoalCard({ goal }: ReviewGoalCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Goal Summary */}
      <div className="bg-surface border border-border rounded-[16px] p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">{goal.title}</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-foreground/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>
              {formatDate(goal.startDate)} - {formatDate(goal.targetDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{goal.period.replace(/([0-9]+)([a-z]+)/, "$1 $2").toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Selected Habits */}
      <div>
        <h4 className="font-bold text-foreground mb-3">Your Habits</h4>
        <div className="space-y-2">
          {goal.habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-start gap-3 p-3 bg-surface border border-border rounded-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {habit.title}
                </p>
                <p className="text-xs text-foreground/60">
                  {habit.duration} min • {habit.schedule.priority} priority •{" "}
                  {habit.schedule.activeDays.length} days/week
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-surface border border-border rounded-[16px] p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-foreground">Reminders</p>
          <span className={`text-sm font-bold ${goal.reminderEnabled ? "text-green-600" : "text-foreground/60"}`}>
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
