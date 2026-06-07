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
      <div className="bg-white border border-[#e4e5f1] rounded-[16px] p-6">
        <h3 className="text-lg font-bold text-[#121221] mb-4">{goal.title}</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-[#6b7280]">
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
        <h4 className="font-bold text-[#121221] mb-3">Your Habits</h4>
        <div className="space-y-2">
          {goal.habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-start gap-3 p-3 bg-white border border-[#e4e5f1] rounded-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#121221] text-sm">
                  {habit.title}
                </p>
                <p className="text-xs text-[#6b7280]">
                  {habit.duration} min • {habit.schedule.priority} priority •{" "}
                  {habit.schedule.activeDays.length} days/week
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-[#e4e5f1] rounded-[16px] p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-[#121221]">Reminders</p>
          <span className={`text-sm font-bold ${goal.reminderEnabled ? "text-green-600" : "text-[#6b7280]"}`}>
            {goal.reminderEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <p className="text-xs text-[#6b7280]">
          Notifications: {goal.notificationPreference}
        </p>
      </div>
    </div>
  );
}
