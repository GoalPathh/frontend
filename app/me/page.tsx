"use client";

import { useEffect, useRef, useState } from "react";
import {
  Award,
  BarChart3,
  Bell,
  ChevronRight,
  FileText,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  Sun,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileHeader } from "@/components/me/profile-header";
import { StatCard } from "@/components/me/stat-card";
import { AchievementCard } from "@/components/me/achievement-card";
import { GrowthTimeline } from "@/components/me/growth-timeline";
import { PreferenceCard } from "@/components/me/preference-card";
import { AppearanceModal } from "@/components/me/appearance-modal";
import { NotificationSettings } from "@/components/me/notification-settings";
import { AccountCard } from "@/components/me/account-card";
import { userService } from "@/lib/userService";
import type {
  Achievement,
  AppearancePreference,
  JourneyStep,
  NotificationPreference,
  UserProfile,
  UserStats,
} from "@/lib/types";

export default function MePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [journey, setJourney] = useState<JourneyStep[]>([]);
  const [appearance, setAppearance] = useState<AppearancePreference>("light");
  const [notifications, setNotifications] = useState<NotificationPreference[]>([]);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProfile(userService.getUserProfile());
    setStats(userService.getUserStats());
    setAchievements(userService.getAchievements());
    setJourney(userService.getJourney());
    setAppearance(userService.getAppearancePreference());
    setNotifications(userService.getNotificationPreferences());
  }, []);

  const handleAppearanceSave = (newPreference: AppearancePreference) => {
    setAppearance(newPreference);
    userService.setAppearancePreference(newPreference);
    setShowAppearanceModal(false);
  };

  const handleToggleNotification = (id: string) => {
    const updated = notifications.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item,
    );
    setNotifications(updated);
    userService.saveNotificationPreferences(updated);
  };

  const scrollToNotifications = () => {
    notificationsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 dark:bg-background dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Me</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground dark:text-white">Your GoalPath dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-foreground/60">
              A modern personal space to review your profile, achievements, settings, and growth journey.
            </p>
          </div>
          <ThemeToggle className="shrink-0 bg-surface/80 dark:bg-surface/10" />
        </div>

        {profile && (
          <ProfileHeader profile={profile} onEdit={() => alert("Edit profile flow coming soon.")} />
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Active Goals"
            value={stats?.activeGoals ?? "—"}
            icon={<Award className="h-5 w-5" />}
            accent="rgb(var(--primary))"
          />
          <StatCard
            title="Longest Streak"
            value={`${stats?.longestStreak ?? "—"} Days`}
            icon={<Zap className="h-5 w-5" />}
            accent="rgb(var(--coral))"
          />
          <StatCard
            title="Achievements"
            value={stats?.achievements ?? "—"}
            icon={<Trophy className="h-5 w-5" />}
            accent="rgb(var(--gold))"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats?.completionRate ?? "—"}%`}
            icon={<BarChart3 className="h-5 w-5" />}
            accent="rgb(var(--sky))"
          />
        </section>

        <section className="mt-10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Achievements</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">Unlocked badges & milestones</h2>
            </div>
            <button
              type="button"
              onClick={() => scrollToNotifications()}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary"
            >
              <ChevronRight className="h-4 w-4 text-primary" />
              Manage Settings
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.length ? (
              achievements.map((item) => <AchievementCard key={item.id} achievement={item} />)
            ) : (
              <div className="rounded-[28px] border border-border bg-surface p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Award className="h-8 w-8" />
                </div>
                <p className="text-xl font-semibold text-foreground">No achievements yet</p>
                <p className="mt-3 text-sm text-foreground/60">Start completing habits to unlock achievements.</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <GrowthTimeline journey={journey} />
          <div className="space-y-6">
            <div className="rounded-[28px] border border-border bg-surface p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Preferences</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">Personalize your experience</h2>
              <div className="mt-6 grid gap-4">
                <PreferenceCard
                  icon={<Sun className="h-5 w-5" />}
                  title="Appearance"
                  current={`${appearance.charAt(0).toUpperCase()}${appearance.slice(1)} Mode`}
                  actionLabel="Open appearance settings"
                  onAction={() => setShowAppearanceModal(true)}
                />
                <PreferenceCard
                  icon={<Bell className="h-5 w-5" />}
                  title="Notifications"
                  current={notifications.some((item) => item.enabled) ? "Enabled" : "Disabled"}
                  actionLabel="Manage notifications"
                  onAction={scrollToNotifications}
                />
                <PreferenceCard
                  icon={<Zap className="h-5 w-5" />}
                  title="Goal Reminders"
                  current={notifications.find((item) => item.id === "daily-habit")?.enabled ? "Enabled" : "Disabled"}
                  actionLabel="Configure reminder schedule"
                  onAction={scrollToNotifications}
                />
              </div>
            </div>

            <div ref={notificationsRef}>
              <NotificationSettings preferences={notifications} onToggle={handleToggleNotification} />
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Account</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">Manage your settings</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AccountCard icon={<User className="h-5 w-5" />} title="Edit Profile" subtitle="Update your personal information" href="#" />
            <AccountCard icon={<Lock className="h-5 w-5" />} title="Change Password" subtitle="Secure your account" href="#" />
            <AccountCard icon={<Mail className="h-5 w-5" />} title="Email Preferences" subtitle="Control email updates" href="#" />
            <AccountCard icon={<FileText className="h-5 w-5" />} title="Privacy Policy" subtitle="Review privacy options" href="#" />
            <AccountCard icon={<HelpCircle className="h-5 w-5" />} title="Help Center" subtitle="Get support and resources" href="#" />
          </div>
        </section>

        <section className="mt-10 rounded-[28px] border border-[#fee2e2] bg-[#fff1f2] p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#fb7185]">Danger Zone</p>
              <h2 className="mt-2 text-2xl font-bold text-[#b91c1c]">Logout</h2>
              <p className="mt-2 max-w-2xl text-sm text-[#7f1d1d]">
                Sign out of GoalPath and protect your account when you’re finished.
              </p>
            </div>
            <button type="button" className="inline-flex items-center gap-2 rounded-2xl border border-[#fca5a5] bg-[#fef2f2] px-5 py-3 text-sm font-semibold text-[#b91c1c] transition hover:bg-[#fee2e2]">
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
        onSave={handleAppearanceSave}
      />
    </div>
  );
}

