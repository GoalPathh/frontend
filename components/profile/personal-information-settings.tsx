"use client";

import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { ImageUp, Loader2, Save, UserRound } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";
import { useProfileOverview } from "@/components/profile/use-profile-overview";
import { userService } from "@/lib/userService";

type Feedback = { tone: "success" | "error"; message: string };

export function PersonalInformationSettings() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { overview, setOverview, loading, error, reload } = useProfileOverview("/profile/personal-info");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!overview) return;
    setName(overview.profile.name);
    setUsername(overview.profile.username);
  }, [overview]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const profile = await userService.updateProfile({
        name: name.trim(),
        username: username.trim(),
      });
      setOverview((current) => current ? { ...current, profile } : current);
      setFeedback({ tone: "success", message: "Profile information saved." });
    } catch (cause) {
      setFeedback({ tone: "error", message: cause instanceof Error ? cause.message : "Unable to save profile information." });
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback({ tone: "error", message: "Choose an image file to upload." });
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ tone: "error", message: "Avatar images must be 5 MB or smaller." });
      event.target.value = "";
      return;
    }

    setUploading(true);
    setFeedback(null);
    try {
      const uploaded = await userService.uploadAvatar(file);
      const profile = await userService.updateProfile({ avatarUrl: uploaded.secureUrl });
      setOverview((current) => current ? { ...current, profile } : current);
      setFeedback({ tone: "success", message: "Avatar uploaded and saved." });
    } catch (cause) {
      setFeedback({ tone: "error", message: cause instanceof Error ? cause.message : "Unable to upload avatar." });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <>
      <ProfilePageHeader title="Personal Information" description="Update the name, username, and avatar shown across your GoalPath account." />

      {loading && !overview ? (
        <div className="h-80 animate-pulse rounded-[28px] border border-border bg-surface" aria-label="Loading profile information" aria-busy="true" />
      ) : error && !overview ? (
        <div className="rounded-[24px] border border-coral/25 bg-coral/10 p-6" role="alert">
          <p className="text-sm font-semibold text-coral">{error}</p>
          <button type="button" onClick={() => void reload()} className="mt-4 min-h-11 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">Try again</button>
        </div>
      ) : overview ? (
        <form onSubmit={handleSave} className="rounded-[28px] border border-primary-soft/40 bg-surface p-5 shadow-card sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <UserAvatar avatarUrl={overview.profile.avatarUrl} name={name || overview.profile.name} className="size-24" iconClassName="size-10" imageSizes="96px" />
            <div>
              <p className="text-sm font-extrabold text-foreground">Profile avatar</p>
              <p className="mt-1 max-w-lg text-sm leading-6 text-foreground/55">Choose an image for your account. The image uploads securely to Cloudinary and is saved to your profile.</p>
              <input ref={fileRef} type="file" accept="image/*" onChange={(event) => void handleAvatarChange(event)} className="sr-only" aria-label="Choose profile avatar image" />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/25 bg-background px-4 py-2.5 text-sm font-bold text-primary transition hover:border-primary disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                {uploading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <ImageUp aria-hidden="true" className="size-4" />}
                {uploading ? "Uploading…" : "Upload avatar"}
              </button>
              <span className="ml-3 text-xs font-semibold text-foreground/45">JPG, PNG, or WebP · max 5 MB</span>
            </div>
          </div>

          {feedback && <p role={feedback.tone === "error" ? "alert" : "status"} className={`mt-6 rounded-2xl px-4 py-3 text-sm font-semibold ${feedback.tone === "error" ? "border border-coral/25 bg-coral/10 text-coral" : "border border-primary/20 bg-primary/10 text-primary"}`}>{feedback.message}</p>}

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-foreground">
              Full name
              <input id="profile-name" name="name" required minLength={2} maxLength={80} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="min-h-12 rounded-2xl border border-border bg-background px-4 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-foreground">
              Username
              <input id="profile-username" name="username" required minLength={2} maxLength={40} autoComplete="nickname" value={username} onChange={(event) => setUsername(event.target.value)} className="min-h-12 rounded-2xl border border-border bg-background px-4 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </label>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/50"><UserRound aria-hidden="true" className="size-4 text-primary" /> These details appear on your account and profile.</p>
            <button type="submit" disabled={saving || uploading} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              {saving ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Save aria-hidden="true" className="size-4" />}
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </form>
      ) : null}
    </>
  );
}
