"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  CalendarCheck2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Flame,
  KeyRound,
  Loader2,
  LogOut,
  Palette,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { IntentLink } from "@/components/intent-link";
import { UserAvatar } from "@/components/user-avatar";
import { authService } from "@/lib/authService";
import {
  describeSubscriptionStatus,
  notifySubscriptionUpdated,
  subscriptionService,
} from "@/lib/subscriptionService";
import type { SubscriptionResponse } from "@/lib/types";
import { useProfileOverview } from "@/components/profile/use-profile-overview";

const quickLinks = [
  { title: "Personal Information", description: "Update your name, username, and avatar.", href: "/profile/personal-info", Icon: User },
  { title: "Appearance", description: "Choose a theme for your workspace.", href: "/profile/appearance", Icon: Palette },
  { title: "Notifications", description: "Choose which updates you receive.", href: "/profile/notifications", Icon: Bell },
  { title: "Security", description: "Change your account password.", href: "/profile/security", Icon: KeyRound },
  { title: "Subscription & Billing", description: "View your plan and payment history.", href: "/profile/subscription", Icon: CreditCard },
  { title: "Privacy", description: "Review how account data is used.", href: "/profile/privacy", Icon: ShieldCheck },
] as const;

function formatNumber(value: number) {
  return value.toLocaleString("id-ID");
}

export function ProfileHub() {
  const router = useRouter();
  const { overview, loading, error, reload } = useProfileOverview("/profile");
  const [loggingOut, setLoggingOut] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [trialStarting, setTrialStarting] = useState(false);
  const [trialError, setTrialError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void subscriptionService.getMySubscription().then((value) => {
      if (!cancelled) setSubscription(value);
    }).catch(() => {
      if (!cancelled) setSubscription(null);
    }).finally(() => {
      if (!cancelled) setSubscriptionLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    if (!window.confirm("Logout from GoalPath? You can sign in again at any time.")) return;
    setLoggingOut(true);
    await authService.logout();
    router.replace("/login");
  }

  async function handleStartTrial() {
    if (trialStarting) return;
    setTrialStarting(true);
    setTrialError("");
    try {
      setSubscription(await subscriptionService.startTrial());
    } catch (cause) {
      setTrialError(cause instanceof Error ? cause.message : "Unable to start the Premium trial.");
      await subscriptionService.getMySubscription().then((latest) => {
        setSubscription(latest);
        if (!latest.trialEligible) {
          setTrialError("");
          notifySubscriptionUpdated(latest);
        }
      }).catch(() => undefined);
    } finally {
      setTrialStarting(false);
    }
  }

  if (loading && !overview) {
    return (
      <div className="space-y-5 sm:space-y-6" aria-label="Loading profile" aria-busy="true">
        <div className="h-36 animate-pulse rounded-[24px] border border-border bg-surface sm:h-52 sm:rounded-[28px]" />
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-[18px] border border-border bg-surface sm:h-28 sm:rounded-[22px]" />)}
        </div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="rounded-[24px] border border-coral/25 bg-coral/10 p-6" role="alert">
        <p className="font-bold text-coral">Unable to open your profile</p>
        <p className="mt-2 text-sm text-foreground/70">{error}</p>
        <button type="button" onClick={() => void reload()} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          Try again <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    );
  }

  if (!overview) return null;
  const { profile, stats, summary, preferences } = overview;
  const accountFacts = [
    { label: "Username", value: profile.username },
    { label: "Appearance", value: `${preferences.appearance[0]?.toUpperCase() ?? ""}${preferences.appearance.slice(1)}` },
    { label: "Notifications enabled", value: `${preferences.notifications.filter((item) => item.enabled).length} of ${preferences.notifications.length}` },
    { label: "Unread updates", value: formatNumber(summary.unreadNotifications) },
  ];

  const statCards = [
    { label: "Active Goals", value: formatNumber(stats.activeGoals), Icon: Target, accent: "bg-primary/10 text-primary" },
    { label: "Current Streak", value: `${formatNumber(stats.currentStreak)} days`, Icon: Flame, accent: "bg-coral/10 text-coral" },
    { label: "Milestones Done", value: formatNumber(stats.completedMilestones), Icon: Trophy, accent: "bg-gold/15 text-[#8a6100]" },
    { label: "Completion Rate", value: `${Math.round(stats.completionRate)}%`, Icon: TrendingUp, accent: "bg-sky/10 text-sky" },
  ];

  return (
    <div className="space-y-5 sm:space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">Account</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:mt-2 sm:text-3xl md:text-4xl">Profile</h1>
          <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-foreground/60 sm:block">Your account details, activity, and settings in one place.</p>
        </div>
      </header>

      {error && <p role="alert" className="rounded-2xl border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{error}</p>}

      <section aria-labelledby="profile-overview-title" className="rounded-[24px] border border-primary-soft/50 bg-surface p-4 shadow-card sm:rounded-[28px] sm:p-7">
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-5">
            <UserAvatar avatarUrl={profile.avatarUrl} name={profile.name} className="size-16 shrink-0 sm:size-24" iconClassName="size-8 sm:size-10" imageSizes="96px" />
            <div className="min-w-0">
              <p id="profile-overview-title" className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary sm:text-xs sm:tracking-[0.2em]">Profile Overview</p>
              <h2 className="mt-1 break-words text-xl font-extrabold leading-tight text-foreground sm:mt-2 sm:text-3xl">{profile.name}</h2>
              <div aria-live="polite">
                {subscriptionLoading ? (
                  <p className="mt-1 text-xs font-semibold text-foreground/55 sm:text-sm">Loading plan status</p>
                ) : subscription?.trialEligible ? (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => void handleStartTrial()}
                      disabled={trialStarting}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-extrabold text-white transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {trialStarting ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Sparkles aria-hidden="true" className="size-4" />}
                      {trialStarting ? "Starting trial..." : `Start ${subscription.trialPeriodDays}-day Premium trial`}
                    </button>
                    <p className="mt-1 text-[10px] font-medium leading-4 text-foreground/55">No payment details needed. Returns to Free without an automatic charge.</p>
                  </div>
                ) : subscription ? (
                  <span className="mt-2 inline-flex min-h-7 items-center rounded-full bg-primary/10 px-3 text-xs font-extrabold text-primary">
                    {describeSubscriptionStatus(subscription)}
                  </span>
                ) : (
                  <p className="mt-1 text-xs font-semibold text-foreground/55 sm:text-sm">Plan status unavailable</p>
                )}
              </div>
              {trialError && <p role="alert" className="mt-2 text-xs font-semibold text-coral">{trialError}</p>}
              <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-primary/10 px-2 text-[10px] font-extrabold text-primary sm:min-h-9 sm:gap-2 sm:px-3 sm:text-xs"><Trophy aria-hidden="true" className="size-3.5 sm:size-4" /> Level {profile.level}</span>
                <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-sky/10 px-2 text-[10px] font-extrabold text-sky sm:min-h-9 sm:gap-2 sm:px-3 sm:text-xs"><Sparkles aria-hidden="true" className="size-3.5 sm:size-4" /> {formatNumber(stats.totalXp)} XP</span>
                <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-coral/10 px-2 text-[10px] font-extrabold text-coral sm:min-h-9 sm:gap-2 sm:px-3 sm:text-xs"><Flame aria-hidden="true" className="size-3.5 sm:size-4" /> {formatNumber(stats.currentStreak)} day streak</span>
              </div>
            </div>
          <IntentLink href="/profile/personal-info" aria-label="Edit profile" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:size-auto sm:gap-2 sm:rounded-full sm:px-5 sm:py-3 sm:text-sm sm:font-extrabold">
            <User aria-hidden="true" className="size-4" /><span className="sr-only sm:not-sr-only">Edit Profile</span>
          </IntentLink>
        </div>
      </section>

      <section aria-labelledby="account-statistics-title">
        <div className="mb-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">At a glance</p>
          <h2 id="account-statistics-title" className="mt-1 text-xl font-extrabold text-foreground">Account Statistics</h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
          {statCards.map(({ label, value, Icon, accent }) => (
            <div key={label} className="rounded-[18px] border border-primary-soft/40 bg-surface p-3 shadow-card sm:rounded-[22px] sm:p-5">
              <span className={`inline-flex size-9 items-center justify-center rounded-xl sm:size-11 sm:rounded-2xl ${accent}`}><Icon aria-hidden="true" className="size-4 sm:size-5" /></span>
              <p className="mt-2 text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-foreground/55 sm:mt-4 sm:text-xs sm:tracking-[0.16em]">{label}</p>
              <p className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="profile-quick-links-title">
        <div className="mb-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Manage your account</p>
          <h2 id="profile-quick-links-title" className="mt-1 text-xl font-extrabold text-foreground">Quick Links</h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-3">
          {quickLinks.map(({ title, description, href, Icon }) => (
            <IntentLink key={href} href={href} className="group flex min-h-[126px] flex-col gap-2.5 rounded-[18px] border border-primary-soft/40 bg-surface p-3 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:min-h-28 sm:flex-row sm:items-center sm:gap-4 sm:rounded-[22px] sm:p-5">
              <span className="flex items-center justify-between sm:contents">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-12 sm:rounded-2xl"><Icon aria-hidden="true" className="size-4 sm:size-5" /></span>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 sm:order-3 sm:size-5" />
              </span>
              <span className="min-w-0 flex-1 sm:order-2">
                <span className="block min-h-8 text-xs font-extrabold leading-4 text-foreground sm:min-h-0 sm:text-sm">{title}</span>
                <span className="mt-1 line-clamp-2 block text-[11px] leading-4 text-foreground/55 sm:text-xs sm:leading-5">{description}</span>
              </span>
            </IntentLink>
          ))}
        </div>
      </section>

      <section aria-labelledby="account-information-title" className="rounded-[24px] border border-primary-soft/40 bg-surface p-4 shadow-card sm:rounded-[28px] sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-11 sm:rounded-2xl"><CalendarCheck2 aria-hidden="true" className="size-4 sm:size-5" /></span>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary sm:text-xs sm:tracking-[0.2em]">Your GoalPath account</p>
            <h2 id="account-information-title" className="mt-1 text-lg font-extrabold leading-tight text-foreground sm:text-xl">Account Information</h2>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
          <div className="rounded-2xl border border-border bg-background p-2.5 sm:rounded-[18px] sm:p-4"><p className="text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-foreground/50 sm:text-[11px] sm:tracking-[0.14em]">Habits</p><p className="mt-1.5 text-base font-extrabold text-foreground sm:mt-2 sm:text-lg">{formatNumber(summary.totalHabits)}</p></div>
          <div className="rounded-2xl border border-border bg-background p-2.5 sm:rounded-[18px] sm:p-4"><p className="text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-foreground/50 sm:text-[11px] sm:tracking-[0.14em]">Minutes / day</p><p className="mt-1.5 text-base font-extrabold text-foreground sm:mt-2 sm:text-lg">{formatNumber(summary.totalMinutes)}</p></div>
          <div className="rounded-2xl border border-border bg-background p-2.5 sm:rounded-[18px] sm:p-4"><p className="text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-foreground/50 sm:text-[11px] sm:tracking-[0.14em]">Avg. progress</p><p className="mt-1.5 text-base font-extrabold text-foreground sm:mt-2 sm:text-lg">{Math.round(summary.averageProgress)}%</p></div>
        </div>
        <details className="group mt-3 border-t border-border pt-1 sm:mt-4">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-foreground/70 outline-none marker:content-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
            More account details
            <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="grid grid-cols-2 gap-2 pb-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
            {accountFacts.map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-border bg-background p-3 sm:rounded-[18px] sm:p-4">
                <p className="text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-foreground/50 sm:text-[11px] sm:tracking-[0.14em]">{label}</p>
                <p className="mt-1.5 break-words text-xs font-extrabold capitalize text-foreground sm:mt-2 sm:text-sm">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs leading-5 text-foreground/50">Account activity reflects your current goals, habits, milestones, and notifications.</p>
        </details>
      </section>

      <section aria-labelledby="danger-zone-title" className="flex items-center justify-between gap-3 rounded-[24px] border border-coral/25 bg-coral/5 p-4 sm:p-5">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-coral sm:text-xs">Danger Zone</p>
          <h2 id="danger-zone-title" className="mt-1 text-sm font-extrabold text-foreground sm:text-lg">Log out of GoalPath</h2>
          <p className="mt-1 hidden text-sm text-foreground/55 sm:block">You will need to sign in again to access your account.</p>
        </div>
        <button type="button" onClick={() => void handleLogout()} disabled={loggingOut} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-coral/30 bg-surface px-3 py-2.5 text-xs font-extrabold text-coral transition hover:bg-coral/10 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 sm:px-5 sm:text-sm">
          {loggingOut ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <LogOut aria-hidden="true" className="size-4" />}
          {loggingOut ? "Logging out..." : "Log out"}
        </button>
      </section>
    </div>
  );
}
