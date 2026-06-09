"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Check, Moon, Monitor, Sun } from "lucide-react";
import { applyAppearance } from "@/lib/theme";
import type { AppearancePreference } from "@/lib/types";

interface AppearanceModalProps {
  open: boolean;
  currentPreference: AppearancePreference;
  onClose: () => void;
  onSave: (preference: AppearancePreference) => void;
}

const OPTIONS: Array<{ value: AppearancePreference; label: string; description: string; icon: ReactNode }> = [
  { value: "light", label: "Light Mode", description: "Bright interface for daytime focus.", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark Mode", description: "Soft tones for late-night planning.", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "System Default", description: "Match your device settings automatically.", icon: <Monitor className="h-4 w-4" /> },
];

export function AppearanceModal({ open, currentPreference, onClose, onSave }: AppearanceModalProps) {
  const [selection, setSelection] = useState<AppearancePreference>(currentPreference);

  useEffect(() => {
    setSelection(currentPreference);
  }, [currentPreference]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 py-6 sm:items-center sm:px-6">
      <div className="w-full max-w-xl rounded-[28px] bg-surface p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Appearance</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">Choose your theme</h2>
          </div>
          <button type="button" onClick={onClose} className="text-foreground/60 transition hover:text-foreground">
            Close
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelection(option.value)}
              className={`w-full rounded-[24px] border p-4 text-left transition ${selection === option.value ? "border-primary bg-primary/10" : "border-border bg-surface hover:border-primary/60"}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">{option.icon}</div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-foreground">{option.label}</p>
                  <p className="mt-1 text-sm text-foreground/60">{option.description}</p>
                </div>
                {selection === option.value && <Check className="h-5 w-5 text-primary" />}
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            applyAppearance(selection);
            onSave(selection);
          }}
          className="mt-6 w-full rounded-2xl bg-primary px-6 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
        >
          Save Preference
        </button>
      </div>
    </div>
  );
}
