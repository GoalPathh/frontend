"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Monitor, Moon, Save, Sun } from "lucide-react";
import type { AppearancePreference } from "@/lib/types";
import { userService } from "@/lib/userService";
import { useProfileOverview } from "@/components/profile/use-profile-overview";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";

const options: Array<{ value: AppearancePreference; title: string; description: string; Icon: typeof Sun }> = [
  { value: "system", title: "System theme", description: "Follow your device light or dark setting.", Icon: Monitor },
  { value: "light", title: "Light mode", description: "Use the bright GoalPath palette.", Icon: Sun },
  { value: "dark", title: "Dark mode", description: "Use darker surfaces for low-light sessions.", Icon: Moon },
];

export function AppearanceSettings() {
  const { overview, setOverview, loading, error, reload } = useProfileOverview("/profile/appearance");
  const [selection, setSelection] = useState<AppearancePreference>("light");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (overview) setSelection(overview.preferences.appearance);
  }, [overview]);

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      const preferences = await userService.updatePreferences({ appearance: selection });
      setSelection(preferences.appearance);
      setOverview((current) => current ? { ...current, preferences: { ...current.preferences, ...preferences } } : current);
      setFeedback({ tone: "success", message: "Theme preference saved." });
    } catch (cause) {
      setFeedback({ tone: "error", message: cause instanceof Error ? cause.message : "Unable to save your theme preference." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <ProfilePageHeader title="Appearance" description="Choose how GoalPath looks on this device and across your account." />
      {loading && !overview ? (
        <div className="h-72 animate-pulse rounded-[28px] border border-border bg-surface" aria-label="Loading appearance settings" aria-busy="true" />
      ) : error && !overview ? (
        <div className="rounded-[24px] border border-coral/25 bg-coral/10 p-6" role="alert"><p className="text-sm font-semibold text-coral">{error}</p><button type="button" onClick={() => void reload()} className="mt-4 min-h-11 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">Try again</button></div>
      ) : overview ? (
        <section className="rounded-[28px] border border-primary-soft/40 bg-surface p-5 shadow-card sm:p-7" aria-labelledby="appearance-options-title">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Theme preference</p>
          <h2 id="appearance-options-title" className="mt-1 text-xl font-extrabold text-foreground">Choose your theme</h2>
          <div className="mt-5 grid gap-3" role="radiogroup" aria-labelledby="appearance-options-title">
            {options.map(({ value, title, description, Icon }) => {
              const selected = selection === value;
              return (
                <button key={value} type="button" role="radio" aria-checked={selected} onClick={() => setSelection(value)} className={`flex min-h-20 items-center gap-4 rounded-[20px] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selected ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"}`}>
                  <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${selected ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}><Icon aria-hidden="true" className="size-5" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-extrabold text-foreground">{title}</span><span className="mt-1 block text-xs leading-5 text-foreground/55">{description}</span></span>
                  {selected && <Check aria-hidden="true" className="size-5 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
          {feedback && <p role={feedback.tone === "error" ? "alert" : "status"} className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${feedback.tone === "error" ? "border border-coral/25 bg-coral/10 text-coral" : "border border-primary/20 bg-primary/10 text-primary"}`}>{feedback.message}</p>}
          <div className="mt-6 flex justify-end border-t border-border pt-5">
            <button type="button" onClick={() => void handleSave()} disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              {saving ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Save aria-hidden="true" className="size-4" />}
              {saving ? "Saving…" : "Save Preference"}
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
