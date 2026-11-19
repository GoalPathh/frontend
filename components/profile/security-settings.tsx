"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, Loader2, LockKeyhole, Save } from "lucide-react";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";
import { useProfileOverview } from "@/components/profile/use-profile-overview";
import { authService } from "@/lib/authService";

export function SecuritySettings() {
  const { overview, loading, error, reload } = useProfileOverview("/profile/security");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    const password = newPassword.trim();
    const confirmation = confirmPassword.trim();
    if (password.length < 8) {
      setFeedback({ tone: "error", message: "Use at least 8 characters for your new password." });
      return;
    }
    if (password !== confirmation) {
      setFeedback({ tone: "error", message: "The password confirmation does not match." });
      return;
    }

    setSaving(true);
    try {
      await authService.updatePassword(password);
      setNewPassword("");
      setConfirmPassword("");
      setFeedback({ tone: "success", message: "Password updated." });
    } catch (cause) {
      setFeedback({ tone: "error", message: cause instanceof Error ? cause.message : "Unable to update your password." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <ProfilePageHeader title="Security" description="Change the password you use to sign in to GoalPath." />
      {loading && !overview ? (
        <div className="h-72 animate-pulse rounded-[28px] border border-border bg-surface" aria-label="Loading security settings" aria-busy="true" />
      ) : error && !overview ? (
        <div className="rounded-[24px] border border-coral/25 bg-coral/10 p-6" role="alert"><p className="text-sm font-semibold text-coral">{error}</p><button type="button" onClick={() => void reload()} className="mt-4 min-h-11 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">Try again</button></div>
      ) : overview ? (
        <form onSubmit={handleSave} className="max-w-3xl rounded-[28px] border border-primary-soft/40 bg-surface p-5 shadow-card sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LockKeyhole aria-hidden="true" className="size-5" /></span>
            <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Account security</p><h2 className="mt-1 text-xl font-extrabold text-foreground">Update password</h2></div>
          </div>
          <div className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm font-bold text-foreground">
              New password
              <input type="password" name="new-password" autoComplete="new-password" required minLength={8} maxLength={128} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="min-h-12 rounded-2xl border border-border bg-background px-4 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
              <span className="text-xs font-medium text-foreground/50">At least 8 characters.</span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-foreground">
              Confirm new password
              <input type="password" name="confirm-password" autoComplete="new-password" required minLength={8} maxLength={128} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="min-h-12 rounded-2xl border border-border bg-background px-4 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </label>
          </div>
          {feedback && <p role={feedback.tone === "error" ? "alert" : "status"} className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${feedback.tone === "error" ? "border border-coral/25 bg-coral/10 text-coral" : "border border-primary/20 bg-primary/10 text-primary"}`}>{feedback.message}</p>}
          <div className="mt-6 flex justify-end border-t border-border pt-5">
            <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              {saving ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Save aria-hidden="true" className="size-4" />}
              {saving ? "Saving…" : "Save Password"}
            </button>
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-foreground/50"><KeyRound aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" /> Password changes are handled by GoalPath authentication and are not stored in your profile settings.</p>
        </form>
      ) : null}
    </>
  );
}
