import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onGoToToday: () => void;
  onViewGoals: () => void;
}

export function SuccessModal({
  isOpen,
  onGoToToday,
  onViewGoals,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] p-8 max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative bg-primary rounded-full p-3">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#121221] mb-2">
            Your GoalPath is Ready!
          </h2>
          <p className="text-[#6b7280]">
            Your goal has been turned into small daily habits. Start your
            journey today.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={onGoToToday}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-all"
          >
            Go to Today
          </button>
          <button
            onClick={onViewGoals}
            className="w-full bg-[#eef0fb] text-primary font-bold py-3 rounded-xl hover:bg-[#e4e5f1] transition-all"
          >
            View Goals
          </button>
        </div>
      </div>
    </div>
  );
}
