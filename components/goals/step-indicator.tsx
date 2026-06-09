interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function StepIndicator({
  currentStep,
  totalSteps,
  steps,
}: StepIndicatorProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
                index < currentStep
                  ? "bg-primary text-white"
                  : index === currentStep - 1
                    ? "bg-primary text-white border-2 border-primary"
                    : "bg-muted text-foreground/60"
              }`}
            >
              {index < currentStep - 1 ? "✓" : index + 1}
            </div>

            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-all ${
                  index < currentStep - 1 ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xs font-bold text-foreground/60">
        {steps.map((step, index) => (
          <span
            key={step}
            className={`${index === currentStep - 1 ? "text-primary" : ""}`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
