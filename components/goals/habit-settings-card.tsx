"use client";

import { Habit, HabitSchedule, TimeRange, HabitPriority } from "@/lib/types";
import { Clock, Bell, Calendar } from "lucide-react";

interface HabitSettingsCardProps {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
}

const daysOfWeek = [
  { short: "Mon", value: "mon" },
  { short: "Tue", value: "tue" },
  { short: "Wed", value: "wed" },
  { short: "Thu", value: "thu" },
  { short: "Fri", value: "fri" },
  { short: "Sat", value: "sat" },
  { short: "Sun", value: "sun" },
];

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: "Anytime", value: "anytime" },
  { label: "Morning", value: "morning" },
  { label: "Afternoon", value: "afternoon" },
  { label: "Evening", value: "evening" },
];

const priorities: { label: string; value: HabitPriority }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export function HabitSettingsCard({
  habit,
  onUpdate,
}: HabitSettingsCardProps) {
  const handleScheduleChange = (updates: Partial<HabitSchedule>) => {
    const updated: Habit = {
      ...habit,
      schedule: {
        ...habit.schedule,
        ...updates,
      },
    };
    onUpdate(updated);
  };

  const handleToggleDay = (day: string) => {
    const newDays = habit.schedule.activeDays.includes(day)
      ? habit.schedule.activeDays.filter((d) => d !== day)
      : [...habit.schedule.activeDays, day];

    handleScheduleChange({ activeDays: newDays });
  };

  return (
    <div className="bg-surface border border-border rounded-[16px] p-6 space-y-6">
      <h3 className="font-bold text-foreground">{habit.title}</h3>

      {/* Time Range */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
          <Clock className="w-4 h-4" /> Time Range
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleScheduleChange({ timeRange: range.value })}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                habit.schedule.timeRange === range.value
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-muted"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reminder Time */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
          <Bell className="w-4 h-4" /> Reminder Time
        </label>
        <input
          type="time"
          value={habit.schedule.reminderTime || "09:00"}
          onChange={(e) =>
            handleScheduleChange({ reminderTime: e.target.value })
          }
          className="w-full px-4 py-2 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      {/* Active Days */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
          <Calendar className="w-4 h-4" /> Active Days
        </label>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day.value}
              onClick={() => handleToggleDay(day.value)}
              className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                habit.schedule.activeDays.includes(day.value)
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-muted"
              }`}
            >
              {day.short}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">
          Priority
        </label>
        <div className="grid grid-cols-3 gap-2">
          {priorities.map((priority) => (
            <button
              key={priority.value}
              onClick={() =>
                handleScheduleChange({ priority: priority.value })
              }
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                habit.schedule.priority === priority.value
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-muted"
              }`}
            >
              {priority.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
