import { Trash2, Edit2, Check } from "lucide-react";
import { Habit } from "@/lib/types";

interface HabitSuggestionCardProps {
  habit: Habit;
  isSelected: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function HabitSuggestionCard({
  habit,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}: HabitSuggestionCardProps) {
  const difficultyColors = {
    easy: "bg-[#dcfce7] text-[#166534]",
    medium: "bg-[#fef3c7] text-[#92400e]",
    hard: "bg-[#fee2e2] text-[#991b1b]",
  };

  return (
    <div
      onClick={onToggle}
      className={`p-4 rounded-[16px] border-2 transition-all cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-surface hover:border-primary"
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? "bg-primary border-primary"
              : "border-border hover:border-primary"
          }`}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-grow">
          <h3 className="font-semibold text-foreground mb-1">{habit.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-foreground/60">
              ⏱️ {habit.duration} min
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                difficultyColors[habit.difficulty]
              }`}
            >
              {habit.difficulty.charAt(0).toUpperCase() +
                habit.difficulty.slice(1)}
            </span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 flex-shrink-0">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 text-foreground/60 hover:text-primary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 text-foreground/60 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
