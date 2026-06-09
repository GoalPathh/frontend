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
      <div className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9288F8]">Appearance</p>
            <h2 className="mt-2 text-2xl font-bold text-[#121221]">Choose your theme</h2>
          </div>
          <button type="button" onClick={onClose} className="text-[#6b7280] transition hover:text-[#121221]">
            Close
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelection(option.value)}
              className={`w-full rounded-[24px] border p-4 text-left transition ${selection === option.value ? "border-[#9288F8] bg-[#f8f5ff]" : "border-[#e4e5f1] bg-white hover:border-[#9288F8]/60"}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#f3f2ff] text-[#9288F8]">{option.icon}</div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-[#121221]">{option.label}</p>
                  <p className="mt-1 text-sm text-[#6b7280]">{option.description}</p>
                </div>
                {selection === option.value && <Check className="h-5 w-5 text-[#9288F8]" />}
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
          className="mt-6 w-full rounded-2xl bg-[#9288F8] px-6 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white shadow-lg shadow-[#9288F8]/20 transition hover:bg-[#7a6de4]"
        >
          Save Preference
        </button>
      </div>
    </div>
  );
}
