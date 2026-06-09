"use client";

import { useEffect, useRef, useState } from "react";
import {
  Award,
  BarChart3,
  Bell,
  CalendarCheck2,
  ChevronRight,
  FileText,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  Palette,
  PlusCircle,
  ShieldCheck,
  Sun,
  Trophy,
  User,
  UserCog,
  Zap,
} from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileHeader } from "@/components/me/profile-header";
import { StatCard } from "@/components/me/stat-card";
import { PreferenceCard } from "@/components/me/preference-card";
import { AppearanceModal } from "@/components/me/appearance-modal";
import { AccountCard } from "@/components/me/account-card";
import { userService } from "@/lib/userService";
import type {
  AppearancePreference,
  NotificationPreference,
  UserProfile,
  UserStats,
} from "@/lib/types";

export default function MePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [appearance, setAppearance] = useState<AppearancePreference>("light");
  const [notifications, setNotifications] = useState<NotificationPreference[]>([]);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProfile(userService.getUserProfile());
    setStats(userService.getUserStats());
    setAppearance(userService.getAppearancePreference());
    setNotifications(userService.getNotificationPreferences());
  }, []);

  const handleAppearanceSave = (newPreference: AppearancePreference) => {
    setAppearance(newPreference);
    userService.setAppearancePreference(newPreference);
    setShowAppearanceModal(false);
  };

  const scrollToSettings = () => {
    settingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const enabledNotifications = notifications.filter((item) => item.enabled).length;

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 dark:bg-background dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Me</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground dark:text-white md:text-4xl">Profile hub</h1>
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
              <AccountCard icon={<Award className="h-5 w-5" />} title="Goals" subtitle="Review and add goals" href="/goals" />
              <AccountCard icon={<BarChart3 className="h-5 w-5" />} title="Progress" subtitle="See charts and milestones" href="/progress" />
              <AccountCard icon={<UserCog className="h-5 w-5" />} title="Coach" subtitle="Get guided next steps" href="/coach" />
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Focus</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">Keep the profile simple</h2>
            <div className="mt-6 grid gap-3">
              <div className="rounded-[22px] border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#2563eb]">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Achievement details</p>
                    <a href="/progress" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      View in Progress <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="rounded-[22px] border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dcfce7] text-[#15803d]">
                    <PlusCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">New goal setup</p>
                    <a href="/goals/add" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Add from Goals <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={settingsRef} className="mt-10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Settings</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">Account shortcuts</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <PreferenceCard
              icon={<Palette className="h-5 w-5" />}
              title="Appearance"
              current={`${appearance.charAt(0).toUpperCase()}${appearance.slice(1)} Mode`}
              actionLabel="Open"
              onAction={() => setShowAppearanceModal(true)}
            />
            <PreferenceCard
              icon={<Bell className="h-5 w-5" />}
              title="Notifications"
              current={`${enabledNotifications} active`}
              actionLabel="Manage later"
              onAction={() => alert("Notification settings flow coming soon.")}
            />
            <AccountCard icon={<User className="h-5 w-5" />} title="Edit Profile" subtitle="Name, photo, username" href="#" />
            <AccountCard icon={<Lock className="h-5 w-5" />} title="Password" subtitle="Update account security" href="#" />
            <AccountCard icon={<Mail className="h-5 w-5" />} title="Email" subtitle="Control email updates" href="#" />
            <AccountCard icon={<ShieldCheck className="h-5 w-5" />} title="Privacy" subtitle="Review data options" href="#" />
            <AccountCard icon={<FileText className="h-5 w-5" />} title="Policy" subtitle="Read privacy policy" href="#" />
            <AccountCard icon={<HelpCircle className="h-5 w-5" />} title="Help" subtitle="Support and resources" href="#" />
          </div>
        </section>

        <section className="mt-10 rounded-[28px] border border-[#fee2e2] bg-[#fff1f2] p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#fb7185]">Danger Zone</p>
              <h2 className="mt-2 text-xl font-bold text-[#b91c1c]">Logout</h2>
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

