"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Bot, Image, Loader2, Save, ShieldCheck, UserRound } from "lucide-react";
import { IntentLink } from "@/components/intent-link";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";
import { useProfileOverview } from "@/components/profile/use-profile-overview";
import { userService } from "@/lib/userService";

export function PrivacySettings() {
  const { overview, setOverview, loading, error, reload } = useProfileOverview("/profile/privacy");
  const [personalizedCoach, setPersonalizedCoach] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (overview) setPersonalizedCoach(overview.preferences.privacy.personalizedCoach);
  }, [overview]);

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      const preferences = await userService.updatePreferences({ privacy: { personalizedCoach } });
      setPersonalizedCoach(preferences.privacy.personalizedCoach);
      setOverview((current) => current ? { ...current, preferences: { ...current.preferences, ...preferences } } : current);
      setFeedback({ tone: "success", message: "Privacy preference saved." });
    } catch (cause) {
      setFeedback({ tone: "error", message: cause instanceof Error ? cause.message : "Unable to save privacy preferences." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <ProfilePageHeader title="Privacy" description="Review how GoalPath uses account information and choose whether saved activity can personalize Coach." />
      {loading && !overview ? (
        <div className="space-y-4" aria-label="Loading privacy settings" aria-busy="true"><div className="h-52 animate-pulse rounded-[28px] border border-border bg-surface" /><div className="h-44 animate-pulse rounded-[28px] border border-border bg-surface" /></div>
      ) : error && !overview ? (
        <div className="rounded-[24px] border border-coral/25 bg-coral/10 p-6" role="alert"><p className="text-sm font-semibold text-coral">{error}</p><button type="button" onClick={() => void reload()} className="mt-4 min-h-11 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">Try again</button></div>
      ) : overview ? (
        <div className="space-y-5">
          <section className="rounded-[28px] border border-primary-soft/40 bg-surface p-5 shadow-card sm:p-7" aria-labelledby="privacy-preferences-title">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Bot aria-hidden="true" className="size-5" /></span>
              <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Privacy preferences</p><h2 id="privacy-preferences-title" className="mt-1 text-xl font-extrabold text-foreground">Personalized Coach</h2></div>
            </div>
            <div className="mt-5 flex flex-col gap-4 rounded-[20px] border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="max-w-2xl">
                <p className="text-sm font-extrabold text-foreground">Use saved goals and activity to personalize Coach</p>
                <p className="mt-1 text-sm leading-6 text-foreground/60">
                  {personalizedCoach
                    ? "Coach can use your goals, habits, milestones, progress, and persona data for relevant replies and scheduled goal-recovery suggestions."
                    : "Coach will not load those account snapshots for personalization. Scheduled goal-recovery suggestions are also skipped."}
                </p>
                <p className="mt-2 text-xs leading-5 text-foreground/45">Saved Coach conversations remain available. Messages in the active conversation can still provide context when this preference is off.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={personalizedCoach}
                aria-label="Use saved goals and activity to personalize Coach"
                onClick={() => setPersonalizedCoach((current) => !current)}
                disabled={saving}
                className={`relative inline-flex min-h-11 w-[72px] shrink-0 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 ${personalizedCoach ? "bg-primary" : "bg-foreground/20"}`}
              >
                <span className={`ml-1 inline-block size-8 rounded-full bg-surface shadow-sm transition-transform ${personalizedCoach ? "translate-x-8" : "translate-x-0"}`} />
              </button>
            </div>
            {feedback && <p role={feedback.tone === "error" ? "alert" : "status"} className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${feedback.tone === "error" ? "border border-coral/25 bg-coral/10 text-coral" : "border border-primary/20 bg-primary/10 text-primary"}`}>{feedback.message}</p>}
            <div className="mt-5 flex justify-end border-t border-border pt-5">
              <button type="button" onClick={() => void handleSave()} disabled={saving || personalizedCoach === overview.preferences.privacy.personalizedCoach} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                {saving ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Save aria-hidden="true" className="size-4" />}
                {saving ? "Saving…" : "Save Privacy Preference"}
              </button>
            </div>
          </section>

          <section className="rounded-[28px] border border-primary-soft/40 bg-surface p-5 shadow-card sm:p-7" aria-labelledby="data-use-title">
            <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ShieldCheck aria-hidden="true" className="size-5" /></span><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Data use</p><h2 id="data-use-title" className="mt-1 text-xl font-extrabold text-foreground">Account information</h2></div></div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-[20px] border border-border bg-background p-4"><div className="flex items-center gap-2 text-sm font-extrabold text-foreground"><UserRound aria-hidden="true" className="size-4 text-primary" /> Profile and activity</div><p className="mt-2 text-sm leading-6 text-foreground/60">Your name, username, goals, habits, and completion activity support your account and the features you use. The Coach preference above controls goal and activity context sent with Coach requests.</p></div>
              <div className="rounded-[20px] border border-border bg-background p-4"><div className="flex items-center gap-2 text-sm font-extrabold text-foreground"><Image aria-hidden="true" className="size-4 text-primary" /> Avatar image</div><p className="mt-2 text-sm leading-6 text-foreground/60">Profile images upload to Cloudinary. GoalPath saves the returned avatar URL on your profile and displays it in the app. You can replace it from Personal Information.</p></div>
            </div>
            <p className="mt-4 text-xs leading-5 text-foreground/50">Account data is managed under your authenticated account. The current app does not provide account export or deletion actions.</p>
          </section>

          <section className="rounded-[24px] border border-border bg-surface p-5 shadow-card sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div><h2 className="text-base font-extrabold text-foreground">Manage account details</h2><p className="mt-1 text-sm text-foreground/55">Update your profile or review notification delivery preferences.</p></div>
            <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
              <IntentLink href="/profile/personal-info" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-bold text-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Personal Information <ArrowRight aria-hidden="true" className="size-4" /></IntentLink>
              <IntentLink href="/profile/notifications" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-bold text-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Notifications <ArrowRight aria-hidden="true" className="size-4" /></IntentLink>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
