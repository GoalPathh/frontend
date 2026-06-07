interface GoalSuggestionChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function GoalSuggestionChip({
  label,
  isSelected,
  onClick,
}: GoalSuggestionChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
        isSelected
          ? "bg-primary text-white shadow-md"
          : "bg-[#eef0fb] text-[#121221] border-2 border-transparent hover:border-primary"
      }`}
    >
      {label}
    </button>
  );
}
