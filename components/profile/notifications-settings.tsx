"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2, Save } from "lucide-react";
import { NotificationSettings } from "@/components/me/notification-settings";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";
import { useProfileOverview } from "@/components/profile/use-profile-overview";
import { userService } from "@/lib/userService";
import type { NotificationPreference } from "@/lib/types";

export function ProfileNotificationsSettings() {
  const { overview, setOverview, loading, error, reload } = useProfileOverview("/profile/notifications");
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (overview) setPreferences(overview.preferences.notifications);
  }, [overview]);

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      const saved = await userService.updatePreferences({ notifications: preferences });
      setPreferences(saved.notifications);
      setOverview((current) => current ? { ...current, preferences: { ...current.preferences, ...saved } } : current);
      setFeedback({ tone: "success", message: "Notification preferences saved." });
    } catch (cause) {
      setFeedback({ tone: "error", message: cause instanceof Error ? cause.message : "Unable to save notifications." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <ProfilePageHeader title="Notifications" description="Choose which reminders and account updates GoalPath sends you." />
      {loading && !overview ? (
        <div className="h-80 animate-pulse rounded-[28px] border border-border bg-surface" aria-label="Loading notification settings" aria-busy="true" />
      ) : error && !overview ? (
        <div className="rounded-[24px] border border-coral/25 bg-coral/10 p-6" role="alert"><p className="text-sm font-semibold text-coral">{error}</p><button type="button" onClick={() => void reload()} className="mt-4 min-h-11 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">Try again</button></div>
      ) : overview ? (
        <section className="rounded-[28px] border border-primary-soft/40 bg-surface p-5 shadow-card sm:p-7" aria-labelledby="notification-preferences-title">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Bell aria-hidden="true" className="size-5" /></span>
            <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Notification preferences</p><h2 id="notification-preferences-title" className="mt-1 text-xl font-extrabold text-foreground">Stay informed your way</h2></div>
          </div>
          <fieldset disabled={saving} className="min-w-0">
            <legend className="sr-only">Notification preferences</legend>
            <NotificationSettings preferences={preferences} onToggle={(id) => setPreferences((current) => current.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item))} />
          </fieldset>
          {feedback && <p role={feedback.tone === "error" ? "alert" : "status"} className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${feedback.tone === "error" ? "border border-coral/25 bg-coral/10 text-coral" : "border border-primary/20 bg-primary/10 text-primary"}`}>{feedback.message}</p>}
          <div className="mt-6 flex justify-end border-t border-border pt-5">
            <button type="button" onClick={() => void handleSave()} disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              {saving ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Save aria-hidden="true" className="size-4" />}
              {saving ? "Saving…" : "Save Notifications"}
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
