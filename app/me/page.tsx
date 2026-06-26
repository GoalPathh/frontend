"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarCheck2,
  ChevronRight,
  ImageUp,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Palette,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  User,
  UserCog,
  Zap,
} from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { ProfileHeader } from "@/components/me/profile-header";
import { StatCard } from "@/components/me/stat-card";
import { PreferenceCard } from "@/components/me/preference-card";
import { AppearanceModal } from "@/components/me/appearance-modal";
import { AccountCard } from "@/components/me/account-card";
import { NotificationSettings } from "@/components/me/notification-settings";
import { userService, type UserOverview } from "@/lib/userService";
import { authService } from "@/lib/authService";
import type {
  AppearancePreference,
  NotificationPreference,
  UserProfile,
  UserStats,
} from "@/lib/types";

type SaveTone = "success" | "error";

export default function MePage() {
  const router = useRouter();
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const notificationSettingsRef = useRef<HTMLDivElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const [overview, setOverview] = useState<UserOverview | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [appearance, setAppearance] = useState<AppearancePreference>("light");
  const [notifications, setNotifications] = useState<NotificationPreference[]>([]);
  const [profileForm, setProfileForm] = useState({ name: "", username: "", avatarUrl: "" });
  const [passwordForm, setPasswordForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ tone: SaveTone; message: string } | null>(null);

  const loadOverview = useCallback(async () => {
    setLoadingError("");
    try {
      const data = await userService.getOverview();
      setOverview(data);
      setProfile(data.profile);
      setStats(data.stats);
      setAppearance(data.preferences.appearance);
      setNotifications(data.preferences.notifications);
      setProfileForm({
        name: data.profile.name,
        username: data.profile.username,
        avatarUrl: data.profile.avatarUrl,
      });
    } catch (error) {
      setLoadingError(error instanceof Error ? error.message : "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const enabledNotifications = useMemo(
    () => notifications.filter((item) => item.enabled).length,
    [notifications],
  );

  const scrollToSettings = () => {
    settingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToNotificationSettings = () => {
    notificationSettingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setFeedback = (tone: SaveTone, message: string) => {
    setSaveFeedback({ tone, message });
  };

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileSaving(true);
    setSaveFeedback(null);

    try {
      const name = profileForm.name.trim();
      const username = profileForm.username.trim();
      const avatarUrl = profileForm.avatarUrl.trim();

      const updatedProfile = await userService.updateProfile({
        name,
        username: username || undefined,
        avatarUrl: avatarUrl || undefined,
      });
      setProfile(updatedProfile);
      setProfileForm({
        name: updatedProfile.name,
        username: updatedProfile.username,
        avatarUrl: updatedProfile.avatarUrl,
      });
      setFeedback("success", "Profile updated.");
    } catch (error) {
      setFeedback("error", error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFeedback("error", "Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFeedback("error", "Avatar image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setAvatarUploading(true);
    setSaveFeedback(null);

    try {
      const uploaded = await userService.uploadAvatar(file);
      const updatedProfile = await userService.updateProfile({ avatarUrl: uploaded.secureUrl });
      setProfile(updatedProfile);
      setProfileForm((current) => ({ ...current, avatarUrl: updatedProfile.avatarUrl }));
      setFeedback("success", "Avatar uploaded.");
    } catch (error) {
      setFeedback("error", error instanceof Error ? error.message : "Unable to upload avatar.");
    } finally {
      setAvatarUploading(false);
      event.target.value = "";
    }
  };

  const handleToggleNotification = (id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)),
    );
  };

  const handleNotificationSave = async () => {
    setNotificationSaving(true);
    setSaveFeedback(null);

    try {
      const preferences = await userService.updatePreferences({ notifications });
      setNotifications(preferences.notifications);
      setFeedback("success", "Notification settings updated.");
    } catch (error) {
      setFeedback(
        "error",
        error instanceof Error ? error.message : "Unable to update notification settings.",
      );
    } finally {
      setNotificationSaving(false);
    }
  };

  const handleAppearanceSave = async (newPreference: AppearancePreference) => {
    setAppearance(newPreference);
    setShowAppearanceModal(false);
    setSaveFeedback(null);

    try {
      const preferences = await userService.updatePreferences({ appearance: newPreference });
      setAppearance(preferences.appearance);
      setFeedback("success", "Appearance preference saved.");
    } catch (error) {
      setFeedback("error", error instanceof Error ? error.message : "Unable to save appearance.");
    }
  };

  const handlePasswordSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveFeedback(null);

    const password = passwordForm.password.trim();
    const confirmPassword = passwordForm.confirmPassword.trim();

    if (password.length < 8) {
      setFeedback("error", "Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFeedback("error", "Password confirmation does not match.");
      return;
    }

    setPasswordSaving(true);

    try {
      await authService.updatePassword(password);
      setPasswordForm({ password: "", confirmPassword: "" });
      setFeedback("success", "Password updated.");
    } catch (error) {
      setFeedback("error", error instanceof Error ? error.message : "Unable to update password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground lg:pl-[272px] lg:pb-10">
      <AppSidebar active="me" className="fixed inset-y-0 left-0 z-50 hidden lg:flex" />

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Profile</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Account hub
            </h1>
          </div>
          <ThemeToggle className="shrink-0 bg-surface/80 dark:bg-surface/10" />
        </div>

        {loadingError && (
          <div className="mb-6 rounded-[18px] border border-coral/20 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
            {loadingError}
          </div>
        )}

        {saveFeedback && (
          <div
            className={`mb-6 rounded-[18px] px-4 py-3 text-sm font-semibold ${
              saveFeedback.tone === "success"
                ? "border border-primary/20 bg-primary/10 text-primary"
                : "border border-coral/20 bg-coral/10 text-coral"
            }`}
          >
            {saveFeedback.message}
          </div>
        )}

        {loading && !profile ? (
          <div className="space-y-6">
            <div className="h-[176px] animate-pulse rounded-[28px] border border-border bg-surface" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-[24px] border border-border bg-surface" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {profile && <ProfileHeader profile={profile} onEdit={scrollToSettings} />}

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Active Goals"
                value={stats?.activeGoals ?? 0}
                icon={<Target className="h-5 w-5" />}
                accent="rgb(var(--primary))"
              />
              <StatCard
                title="Current Streak"
                value={`${stats?.currentStreak ?? 0} Days`}
                icon={<Zap className="h-5 w-5" />}
                accent="rgb(var(--coral))"
              />
              <StatCard
                title="Milestones Done"
                value={stats?.completedMilestones ?? 0}
                icon={<Trophy className="h-5 w-5" />}
                accent="rgb(var(--gold))"
              />
              <StatCard
                title="Completion Rate"
                value={`${stats?.completionRate ?? 0}%`}
                icon={<Sparkles className="h-5 w-5" />}
                accent="rgb(var(--sky))"
              />
            </section>

            <section className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-border bg-surface p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Quick links</p>
                    <h2 className="mt-2 text-2xl font-bold text-foreground">Go where you need</h2>
                  </div>
                  <button
                    type="button"
                    onClick={scrollToSettings}
                    className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary"
                  >
                    Settings
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <AccountCard icon={<CalendarCheck2 className="h-5 w-5" />} title="Today Plan" subtitle="Open your daily habits" href="/today" />
                  <AccountCard icon={<Target className="h-5 w-5" />} title="Goals" subtitle="Review active goals and add new ones" href="/goals" />
                  <AccountCard icon={<Sparkles className="h-5 w-5" />} title="Progress" subtitle="See consistency, milestones, and trends" href="/progress" />
                  <AccountCard icon={<UserCog className="h-5 w-5" />} title="Coach" subtitle="Continue your AI coaching sessions" href="/coach" />
                </div>
              </div>

              <div className="rounded-[28px] border border-border bg-surface p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Overview</p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">Account signals</h2>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <OverviewTile label="XP" value={`${stats?.totalXp ?? 0}`} />
                  <OverviewTile label="Unread Alerts" value={`${overview?.summary.unreadNotifications ?? 0}`} />
                  <OverviewTile label="Habit Load" value={`${overview?.summary.totalHabits ?? 0}`} />
                  <OverviewTile label="Focus Minutes" value={`${overview?.summary.totalMinutes ?? 0}m`} />
                </div>

                <div className="mt-5 rounded-[22px] border border-border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">Plan health</p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    {overview?.summary.atRiskGoals ?? 0} goal{(overview?.summary.atRiskGoals ?? 0) === 1 ? "" : "s"} at risk
                  </p>
                  <p className="mt-1 text-sm text-foreground/60">
                    Average progress across active goals is {overview?.summary.averageProgress ?? 0}%.
                  </p>
                </div>
              </div>
            </section>

            <section id="settings" ref={settingsRef} className="mt-10 scroll-mt-8 space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Settings</p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">Profile controls</h2>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <form onSubmit={handleProfileSave} className="rounded-[28px] border border-border bg-surface p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Edit Profile</p>
                      <h3 className="mt-1 text-xl font-bold text-foreground">Basic account details</h3>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <LabelledField
                      label="Full name"
                      value={profileForm.name}
                      onChange={(value) => setProfileForm((current) => ({ ...current, name: value }))}
                      placeholder="Your full name"
                    />
                    <LabelledField
                      label="Username"
                      value={profileForm.username}
                      onChange={(value) => setProfileForm((current) => ({ ...current, username: value }))}
                      placeholder="@goalpath"
                    />
                    <LabelledField
                      label="Avatar URL"
                      value={profileForm.avatarUrl}
                      onChange={(value) => setProfileForm((current) => ({ ...current, avatarUrl: value }))}
                      placeholder="https://..."
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <UserAvatar
                        avatarUrl={profileForm.avatarUrl}
                        name={profileForm.name}
                        className="size-12"
                        imageSizes="48px"
                      />
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(event) => void handleAvatarFileChange(event)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={avatarUploading}
                        className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {avatarUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <ImageUp className="h-4 w-4 text-primary" />
                        )}
                        {avatarUploading ? "Uploading..." : "Upload to Cloudinary"}
                      </button>
                      <p className="text-xs text-foreground/55">
                        JPG, PNG, or WebP. Max 5 MB.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {profileSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Profile
                  </button>
                </form>

                <div className="space-y-6">
                  <div className="rounded-[28px] border border-border bg-surface p-6 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-2">
                      <PreferenceCard
                        icon={<Palette className="h-5 w-5" />}
                        title="Appearance"
                        current={`${appearance.charAt(0).toUpperCase()}${appearance.slice(1)} Mode`}
                        actionLabel="Choose theme"
                        onAction={() => setShowAppearanceModal(true)}
                      />
                      <PreferenceCard
                        icon={<Bell className="h-5 w-5" />}
                        title="Notifications"
                        current={`${enabledNotifications} active`}
                        actionLabel="Review settings"
                        onAction={scrollToNotificationSettings}
                        accentClass="bg-sky/10 text-sky"
                      />
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSave} className="rounded-[28px] border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#2563eb]">
                        <KeyRound className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Security</p>
                        <h3 className="mt-1 text-xl font-bold text-foreground">Update password</h3>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4">
                      <LabelledField
                        label="New password"
                        type="password"
                        value={passwordForm.password}
                        onChange={(value) => setPasswordForm((current) => ({ ...current, password: value }))}
                        placeholder="Minimum 8 characters"
                      />
                      <LabelledField
                        label="Confirm password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(value) => setPasswordForm((current) => ({ ...current, confirmPassword: value }))}
                        placeholder="Repeat your new password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-bold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {passwordSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      Save Password
                    </button>
                  </form>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <div ref={notificationSettingsRef} className="scroll-mt-8">
                  <NotificationSettings preferences={notifications} onToggle={handleToggleNotification} />
                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => void handleNotificationSave()}
                      disabled={notificationSaving}
                      className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {notificationSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      Save Notifications
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[28px] border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/20 text-[#8a6100]">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Subscription</p>
                        <h3 className="mt-1 text-xl font-bold text-foreground">Billing status</h3>
                      </div>
                    </div>
                    <div className="mt-5 rounded-[22px] border border-dashed border-border bg-background p-4">
                      <p className="text-sm font-semibold text-foreground">No subscription data connected yet.</p>
                      <p className="mt-1 text-sm text-foreground/60">
                        This section is ready for billing integration once plan data is available from the backend.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Privacy</p>
                        <h3 className="mt-1 text-xl font-bold text-foreground">What is saved</h3>
                      </div>
                    </div>
                    <ul className="mt-5 space-y-3 text-sm text-foreground/60">
                      <li>We only keep the account details needed to personalize your GoalPath experience.</li>
                      <li>Your appearance and notification choices stay under your control from this page.</li>
                      <li>Avatar uploads are used only for your profile image and can be replaced anytime.</li>
                      <li>Password updates are handled through the secure authentication flow.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="mt-10 rounded-[28px] border border-[#fee2e2] bg-[#fff1f2] p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#fb7185]">Danger Zone</p>
              <h2 className="mt-2 text-xl font-bold text-[#b91c1c]">Logout</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                authService.logout();
                router.push("/login");
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#fca5a5] bg-[#fef2f2] px-5 py-3 text-sm font-semibold text-[#b91c1c] transition hover:bg-[#fee2e2]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </section>
      </div>

      <BottomNavigation active="me" />

      <AppearanceModal
        open={showAppearanceModal}
        currentPreference={appearance}
        onClose={() => setShowAppearanceModal(false)}
        onSave={(preference) => void handleAppearanceSave(preference)}
      />
    </div>
  );
}

function OverviewTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-border bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">{label}</p>
      <p className="mt-2 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function LabelledField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "password";
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}
