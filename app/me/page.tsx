"use client";

import { useEffect, useRef, useState } from "react";
import {
  Award,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  FileText,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  Sun,
  Trophy,
  User,
  UserCog,
  Zap,
} from "lucide-react";
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
    <div className="min-h-screen bg-[#f8f9ff] text-[#121221] pb-32">
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9288F8]">Me</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#121221]">Your GoalPath dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6b7280]">
            A modern personal space to review your profile, achievements, settings, and growth journey.
          </p>
        </div>

        {profile && (
          <ProfileHeader profile={profile} onEdit={() => alert("Edit profile flow coming soon.")} />
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Active Goals"
            value={stats?.activeGoals ?? "—"}
            icon={<Award className="h-5 w-5" />}
            accent="#9288F8"
          />
          <StatCard
            title="Longest Streak"
            value={`${stats?.longestStreak ?? "—"} Days`}
            icon={<Zap className="h-5 w-5" />}
            accent="#FB7185"
          />
          <StatCard
            title="Achievements"
            value={stats?.achievements ?? "—"}
            icon={<Trophy className="h-5 w-5" />}
            accent="#FBBF24"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats?.completionRate ?? "—"}%`}
            icon={<BarChart3 className="h-5 w-5" />}
            accent="#60A5FA"
          />
        </section>

        <section className="mt-10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9288F8]">Achievements</p>
              <h2 className="mt-2 text-2xl font-bold text-[#121221]">Unlocked badges & milestones</h2>
            </div>
            <button
              type="button"
              onClick={() => scrollToNotifications()}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#e4e5f1] bg-white px-4 py-3 text-sm font-semibold text-[#121221] transition hover:border-[#9288F8]"
            >
              <ChevronRight className="h-4 w-4 text-[#9288F8]" />
              Manage Settings
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.length ? (
              achievements.map((item) => <AchievementCard key={item.id} achievement={item} />)
            ) : (
              <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#9288F8]/10 text-[#9288F8]">
                  <Award className="h-8 w-8" />
                </div>
                <p className="text-xl font-semibold text-[#121221]">No achievements yet</p>
                <p className="mt-3 text-sm text-[#6b7280]">Start completing habits to unlock achievements.</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <GrowthTimeline journey={journey} />
          <div className="space-y-6">
            <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9288F8]">Preferences</p>
              <h2 className="mt-2 text-2xl font-bold text-[#121221]">Personalize your experience</h2>
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
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9288F8]">Account</p>
              <h2 className="mt-2 text-2xl font-bold text-[#121221]">Manage your settings</h2>
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

      <div className="fixed bottom-0 w-full z-50 px-4 pb-6 bg-[#f8f9ff]/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-around gap-2 rounded-[24px] glass-surface border-[#e4e5f1] p-3 shadow-lg">
          <a className="flex flex-col items-center justify-center px-3 py-2 text-[#6b7280] hover:text-primary transition-colors" href="/today">
            <CheckCircle2 className="h-6 w-6" />
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.24em]">Today</span>
          </a>
          <a className="flex flex-col items-center justify-center px-3 py-2 text-[#6b7280] hover:text-primary transition-colors" href="/goals">
            <Award className="h-6 w-6" />
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.24em]">Goals</span>
          </a>
          <a className="flex flex-col items-center justify-center px-3 py-2 text-[#6b7280] hover:text-primary transition-colors" href="/progress">
            <BarChart3 className="h-6 w-6" />
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.24em]">Progress</span>
          </a>
          <a className="flex flex-col items-center justify-center px-3 py-2 text-[#6b7280] hover:text-primary transition-colors" href="/coach">
            <UserCog className="h-6 w-6" />
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.24em]">Coach</span>
          </a>
          <a className="flex flex-col items-center justify-center rounded-xl bg-primary/10 px-3 py-2 text-primary" href="/me">
            <User className="h-6 w-6" />
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em]">Me</span>
          </a>
        </div>
      </div>

      <AppearanceModal
        open={showAppearanceModal}
        currentPreference={appearance}
        onClose={() => setShowAppearanceModal(false)}
        onSave={handleAppearanceSave}
      />
    </div>
  );
}

