"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Goal, Habit, GoalFormData, GoalPeriod } from "@/lib/types";
import { goalService } from "@/lib/goalService";
import { StepIndicator } from "@/components/goals/step-indicator";
import { GoalSuggestionChip } from "@/components/goals/goal-suggestion-chip";
import { HabitSuggestionCard } from "@/components/goals/habit-suggestion-card";
import { HabitSettingsCard } from "@/components/goals/habit-settings-card";
import { ReviewGoalCard } from "@/components/goals/review-goal-card";
import { SuccessModal } from "@/components/goals/success-modal";
import { AppSidebar } from "@/components/app-sidebar";

const GOAL_SUGGESTIONS = [
  "Speak English Fluently",
  "Lose 5kg",
  "Win a Competition",
  "Improve Coding Skills",
  "Become a Content Creator",
  "Read More Books",
];

const PERIODS: { label: string; value: GoalPeriod }[] = [
  { label: "1 Month", value: "1month" },
  { label: "3 Months", value: "3months" },
  { label: "6 Months", value: "6months" },
  { label: "1 Year", value: "1year" },
];

export default function AddGoalPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  // Step 1 state
  const [customGoal, setCustomGoal] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<GoalPeriod | null>(null);

  // Step 2 state
  const [availableHabits, setAvailableHabits] = useState<Habit[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<Habit[]>([]);

  // Step 3 state
  const [habitSettings, setHabitSettings] = useState<Record<string, Habit>>({});
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [targetDate, setTargetDate] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [notificationPreference, setNotificationPreference] = useState<
    "all" | "important" | "none"
  >("all");

  // Step 4 state
  const [reviewData, setReviewData] = useState<Goal | null>(null);

  // Update available habits when selected goal changes
  useEffect(() => {
    const goalTitle = selectedGoal || customGoal;
    if (goalTitle) {
      const suggestions = goalService.getHabitSuggestions(goalTitle);
      setAvailableHabits(suggestions);
    }
  }, [selectedGoal, customGoal]);

  // Calculate target date when period is selected
  useEffect(() => {
    if (selectedPeriod && startDate) {
      const start = new Date(startDate);
      const periodDays: Record<GoalPeriod, number> = {
        "1month": 30,
        "3months": 90,
        "6months": 180,
        "1year": 365,
      };
      const target = new Date(start.getTime() + periodDays[selectedPeriod] * 24 * 60 * 60 * 1000);
      setTargetDate(target.toISOString().split("T")[0]);
    }
  }, [selectedPeriod, startDate]);

  const handleStep1Continue = () => {
    const goalTitle = selectedGoal || customGoal;
    if (goalTitle && selectedPeriod) {
      setCurrentStep(2);
    }
  };

  const handleStep2Continue = () => {
    if (selectedHabits.length > 0) {
      const settings: Record<string, Habit> = {};
      selectedHabits.forEach((habit) => {
        settings[habit.id] = habit;
      });
      setHabitSettings(settings);
      setCurrentStep(3);
    }
  };

  const handleStep3Continue = () => {
    const goalTitle = selectedGoal || customGoal;
    const review: Goal = {
      id: Date.now().toString(),
      title: goalTitle,
      category: "other",
      period: selectedPeriod!,
      progress: 0,
      habits: Object.values(habitSettings),
      startDate: new Date(startDate).toISOString(),
      targetDate: new Date(targetDate).toISOString(),
      reminderEnabled,
      notificationPreference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReviewData(review);
    setCurrentStep(4);
  };

  const handleSaveGoal = async () => {
    if (reviewData) {
      setSaving(true);
      setSaveError("");
      const formData: GoalFormData = {
        title: reviewData.title,
        period: reviewData.period,
        selectedHabits: reviewData.habits,
        startDate: reviewData.startDate,
        targetDate: reviewData.targetDate,
        reminderEnabled: reviewData.reminderEnabled,
        notificationPreference: reviewData.notificationPreference,
      };
      try {
        await goalService.saveGoalToApi(formData);
        setShowSuccess(true);
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : "Unable to save goal.");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleGoToToday = () => {
    router.push("/today");
  };

  const handleViewGoals = () => {
    router.push("/goals");
  };

  const steps = ["Goal", "Habits", "Schedule", "Review"];

  return (
    <div className="min-h-screen bg-background pb-20 lg:pl-[272px]">
      <AppSidebar active="goals" className="fixed inset-y-0 left-0 z-50 hidden lg:flex" />
      {/* Header */}
      <header className="fixed top-0 z-40 w-full border-b border-border bg-background/90 px-6 py-4 backdrop-blur-xl md:px-10 lg:left-[272px] lg:w-[calc(100%-272px)]">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                router.back();
              }
            }}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Add Goal</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-24 px-6 md:px-10 max-w-3xl mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={4} steps={steps} />

        {/* Step 1: Choose Goal */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                What do you want to achieve?
              </h2>
              <p className="text-foreground/60">
                Choose a suggestion or write your own goal.
              </p>
            </div>

            {/* Custom Goal Input */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Your Goal
              </label>
              <input
                type="text"
                value={customGoal}
                onChange={(e) => {
                  setCustomGoal(e.target.value);
                  setSelectedGoal(null);
                }}
                placeholder="e.g., Learn Guitar"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:border-primary bg-surface text-foreground"
              />
            </div>

            {/* Suggestions */}
            <div>
              <p className="text-sm font-semibold text-foreground/60 mb-3">
                Or choose from suggestions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {GOAL_SUGGESTIONS.map((suggestion) => (
                  <GoalSuggestionChip
                    key={suggestion}
                    label={suggestion}
                    isSelected={selectedGoal === suggestion}
                    onClick={() => {
                      setSelectedGoal(suggestion);
                      setCustomGoal("");
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Period Selector */}
            <div>
              <p className="text-sm font-semibold text-foreground/60 mb-3">
                How long do you want to achieve this goal?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PERIODS.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedPeriod === period.value
                        ? "bg-primary text-white"
                        : "bg-surface border-2 border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-border text-foreground font-bold hover:bg-muted transition-all"
              >
                Back
              </button>
              <button
                onClick={handleStep1Continue}
                disabled={
                  (!selectedGoal && !customGoal) || !selectedPeriod
                }
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
                  selectedGoal && selectedPeriod || customGoal && selectedPeriod
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-muted text-foreground/60 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Habit Breakdown */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                AI Habit Breakdown
              </h2>
              <p className="text-foreground/60">
                GoalPath recommends small habits to help you stay consistent.
              </p>
              <div className="mt-4 p-4 bg-surface border border-border rounded-lg">
                <p className="font-semibold text-foreground">
                  {selectedGoal || customGoal}
                </p>
              </div>
            </div>

            {/* Habit Suggestions */}
            <div>
              <p className="text-sm font-semibold text-foreground/60 mb-3">
                Select 1 or more habits:
              </p>
              <div className="space-y-3">
                {availableHabits.map((habit) => (
                  <HabitSuggestionCard
                    key={habit.id}
                    habit={habit}
                    isSelected={selectedHabits.some((h) => h.id === habit.id)}
                    onToggle={() => {
                      const isSelected = selectedHabits.some(
                        (h) => h.id === habit.id
                      );
                      if (isSelected) {
                        setSelectedHabits(
                          selectedHabits.filter((h) => h.id !== habit.id)
                        );
                      } else {
                        setSelectedHabits([...selectedHabits, habit]);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-border text-foreground font-bold hover:bg-muted transition-all"
              >
                Back
              </button>
              <button
                onClick={handleStep2Continue}
                disabled={selectedHabits.length === 0}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
                  selectedHabits.length > 0
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-muted text-foreground/60 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Habit Settings */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Set Your Habit Schedule
              </h2>
              <p className="text-foreground/60">
                Configure when and how often you want to do each habit.
              </p>
            </div>

            {/* Habit Settings */}
            <div className="space-y-4">
              {selectedHabits.map((habit) => (
                <HabitSettingsCard
                  key={habit.id}
                  habit={habitSettings[habit.id] || habit}
                  onUpdate={(updated) => {
                    setHabitSettings({
                      ...habitSettings,
                      [habit.id]: updated,
                    });
                  }}
                />
              ))}
            </div>

            {/* Goal Settings */}
            <div className="space-y-4 bg-surface border border-border rounded-[16px] p-6">
              <h3 className="font-bold text-foreground">Goal Settings</h3>

              {/* Start Date */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Target Date */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Reminder Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Reminders
                </label>
                <button
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                    reminderEnabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-surface transition-transform ${
                      reminderEnabled ? "translate-x-5" : "translate-x-0.5"
                    } mt-0.5`}
                  />
                </button>
              </div>

              {/* Notification Preference */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Notification Preference
                </label>
                <select
                  value={notificationPreference}
                  onChange={(e) =>
                    setNotificationPreference(
                      e.target.value as "all" | "important" | "none"
                    )
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="all">All Notifications</option>
                  <option value="important">Important Only</option>
                  <option value="none">No Notifications</option>
                </select>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-border text-foreground font-bold hover:bg-muted transition-all"
              >
                Back
              </button>
              <button
                onClick={handleStep3Continue}
                className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && reviewData && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Review Your GoalPath
              </h2>
              <p className="text-foreground/60">
                Make sure everything looks good before saving.
              </p>
            </div>

            <ReviewGoalCard goal={reviewData} />

            {/* Continue Button */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-border text-foreground font-bold hover:bg-muted transition-all"
              >
                Back
              </button>
              {saveError && <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{saveError}</p>}
              <button
                onClick={handleSaveGoal}
                disabled={saving}
                className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all disabled:cursor-wait disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Goal"}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onGoToToday={handleGoToToday}
        onViewGoals={handleViewGoals}
      />
    </div>
  );
}
