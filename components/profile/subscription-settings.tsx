"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Crown,
  Loader2,
  LockKeyhole,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  UserRoundCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { ProfilePageHeader } from "@/components/profile/profile-page-header";
import { ApiError } from "@/lib/api";
import { USER_PROFILE_EVENT } from "@/lib/userService";
import {
  describeTierLabel,
  isSubscriptionGateError,
  loadMidtransSnapScript,
  subscriptionService,
} from "@/lib/subscriptionService";
import type { SubscriptionPayment, SubscriptionResponse } from "@/lib/types";

type CheckoutStatus = "idle" | "loading" | "snap";
type UpgradeStatus = "success" | "pending" | "failed";

let cachedSubscription: SubscriptionResponse | null = null;
let cachedPayments: SubscriptionPayment[] | null = null;

const SNAP_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
const SNAP_IS_PRODUCTION = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";

const featureRows: Array<{
  key: keyof SubscriptionResponse["features"];
  label: string;
  description: string;
  Icon: typeof Target;
}> = [
  { key: "unlimitedGoals", label: "Unlimited Goals & Habits", description: "Create as many goals and habits as you need.", Icon: Target },
  { key: "aiAdaptiveHabit", label: "AI Adaptive Habit", description: "Adjust habit difficulty around your energy patterns.", Icon: Sparkles },
  { key: "futureSelfSimulation", label: "Future Self Simulation", description: "Preview possible progress over the next 7–180 days.", Icon: TrendingUp },
  { key: "fullAiCoachAccess", label: "Full AI Coach Access", description: "More daily messages for goal support.", Icon: Zap },
  { key: "advancedInsight", label: "Advanced Insight", description: "Heatmaps, time-of-day analysis, and goal risk signals.", Icon: Shield },
  { key: "prioritySupport", label: "Priority Support", description: "Faster responses through the Premium support channel.", Icon: UserRoundCheck },
];

function formatIdr(amount: number | string) {
  const value = Number(amount);
  return Number.isFinite(value)
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value)
    : "Amount unavailable";
}

function formatDate(value: string | null) {
  if (!value) return "No active paid period";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function formatLabel(value: string | null) {
  if (!value) return "Not recorded";
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function paymentStatus(status: string) {
  if (status === "settlement") return "Paid";
  return formatLabel(status);
}

export function SubscriptionSettings({ upgradeStatus }: { upgradeStatus?: string }) {
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(cachedSubscription);
  const [payments, setPayments] = useState<SubscriptionPayment[]>(cachedPayments ?? []);
  const [loading, setLoading] = useState(cachedSubscription === null);
  const [subscriptionError, setSubscriptionError] = useState("");
  const [paymentsError, setPaymentsError] = useState("");
  const [actionMessage, setActionMessage] = useState<{ tone: "success" | "error" | "pending"; message: string } | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
  const [cancelling, setCancelling] = useState(false);

  const loadAccount = useCallback(async () => {
    setLoading(cachedSubscription === null);
    setSubscriptionError("");
    setPaymentsError("");
    const shouldRefresh = upgradeStatus === "success" || upgradeStatus === "pending";
    const subscriptionRequest = shouldRefresh
      ? subscriptionService.refresh().catch(() => subscriptionService.getMySubscription())
      : subscriptionService.getMySubscription();
    const [subscriptionResult, paymentsResult] = await Promise.allSettled([
      subscriptionRequest,
      subscriptionService.getPaymentHistory(),
    ]);

    if (subscriptionResult.status === "fulfilled") {
      cachedSubscription = subscriptionResult.value;
      setSubscription(subscriptionResult.value);
    } else if (subscriptionResult.reason instanceof ApiError && subscriptionResult.reason.status === 401) {
      router.replace(`/login?next=${encodeURIComponent("/profile/subscription")}`);
    } else {
      setSubscriptionError(subscriptionResult.reason instanceof Error ? subscriptionResult.reason.message : "Unable to load subscription status.");
    }

    if (paymentsResult.status === "fulfilled") {
      cachedPayments = paymentsResult.value;
      setPayments(paymentsResult.value);
    } else if (paymentsResult.reason instanceof ApiError && paymentsResult.reason.status === 401) {
      router.replace(`/login?next=${encodeURIComponent("/profile/subscription")}`);
    } else {
      setPaymentsError(paymentsResult.reason instanceof Error ? paymentsResult.reason.message : "Unable to load billing history.");
    }
    setLoading(false);
  }, [router, upgradeStatus]);

  useEffect(() => {
    if (upgradeStatus === "success") {
      setActionMessage({ tone: "success", message: "Payment completed. Subscription status has been refreshed." });
    } else if (upgradeStatus === "pending") {
      setActionMessage({ tone: "pending", message: "Payment is still processing. The account status has been refreshed." });
    } else if (upgradeStatus === "failed") {
      setActionMessage({ tone: "error", message: "Payment did not complete. You can try checkout again." });
    }
    if (upgradeStatus) router.replace("/profile/subscription");
  }, [router, upgradeStatus]);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  useEffect(() => {
    const clearAccountData = (event: Event) => {
      if ((event as CustomEvent<unknown>).detail !== null) return;
      cachedSubscription = null;
      cachedPayments = null;
      setSubscription(null);
      setPayments([]);
      setLoading(true);
    };
    window.addEventListener(USER_PROFILE_EVENT, clearAccountData);
    return () => window.removeEventListener(USER_PROFILE_EVENT, clearAccountData);
  }, []);

  const premiumPrice = useMemo(() => {
    if (!subscription) return "Loading price…";
    return formatIdr(subscription.premiumPriceIdr);
  }, [subscription]);
  const latestPaymentMethod = payments.find((payment) => payment.payment_type)?.payment_type ?? null;
  const isPremium = subscription?.tier === "premium";

  async function handleSubscribe() {
    setActionMessage(null);
    setCheckoutStatus("loading");
    try {
      const checkout = await subscriptionService.createCheckout();
      if (!SNAP_CLIENT_KEY) throw new Error("Midtrans is not configured in this frontend. Add NEXT_PUBLIC_MIDTRANS_CLIENT_KEY to enable checkout.");
      await loadMidtransSnapScript({ clientKey: SNAP_CLIENT_KEY, isProduction: SNAP_IS_PRODUCTION });
      if (!window.snap?.pay) throw new Error("Midtrans checkout did not finish loading. Try again.");
      setCheckoutStatus("snap");
      window.snap.pay(checkout.token, {
        onSuccess: () => router.push("/profile/subscription?upgrade=success"),
        onPending: () => router.push("/profile/subscription?upgrade=pending"),
        onError: () => {
          setCheckoutStatus("idle");
          setActionMessage({ tone: "error", message: "Midtrans could not process the payment. Try checkout again." });
        },
        onClose: () => setCheckoutStatus("idle"),
      });
    } catch (cause) {
      setCheckoutStatus("idle");
      if (cause instanceof ApiError && cause.status === 401) {
        router.push(`/login?next=${encodeURIComponent("/profile/subscription")}`);
      } else if (isSubscriptionGateError(cause)) {
        setActionMessage({ tone: "error", message: "An active subscription already exists. Refreshing your account status." });
        void loadAccount();
      } else {
        setActionMessage({ tone: "error", message: cause instanceof Error ? cause.message : "Unable to start checkout." });
      }
    }
  }

  async function handleCancel() {
    if (!subscription || !window.confirm("Cancel auto-renewal for this subscription?")) return;
    setCancelling(true);
    setActionMessage(null);
    try {
      const updated = await subscriptionService.cancel();
      cachedSubscription = updated;
      setSubscription(updated);
      setActionMessage({ tone: "success", message: "Auto-renewal setting updated." });
    } catch (cause) {
      setActionMessage({ tone: "error", message: cause instanceof Error ? cause.message : "Unable to update the subscription." });
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <ProfilePageHeader title="Subscription & Billing" description="Review your current plan, manage Premium, and see payments recorded for your account." />

      {actionMessage && <p role={actionMessage.tone === "error" ? "alert" : "status"} className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${actionMessage.tone === "error" ? "border-coral/25 bg-coral/10 text-coral" : actionMessage.tone === "pending" ? "border-gold/30 bg-gold/15 text-[#8a6100]" : "border-primary/20 bg-primary/10 text-primary"}`}>{actionMessage.message}</p>}

      {subscriptionError && <p role="alert" className="mb-5 rounded-2xl border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{subscriptionError}</p>}

      {loading && !subscription ? (
        <div className="grid gap-5 lg:grid-cols-2" aria-label="Loading subscription information" aria-busy="true"><div className="h-80 animate-pulse rounded-[28px] border border-border bg-surface" /><div className="h-80 animate-pulse rounded-[28px] border border-border bg-surface" /></div>
      ) : subscription ? (
        <>
          <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[28px] border border-primary-soft/40 bg-surface p-5 shadow-card sm:p-7" aria-labelledby="current-plan-title">
              <div className="flex items-center gap-3">
                <span className={`flex size-12 items-center justify-center rounded-2xl ${isPremium ? "bg-primary/10 text-primary" : "bg-foreground/5 text-foreground/60"}`}>
                  {isPremium ? <Crown aria-hidden="true" className="size-5" /> : <LockKeyhole aria-hidden="true" className="size-5" />}
                </span>
                <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Current subscription plan</p><h2 id="current-plan-title" className="mt-1 text-2xl font-extrabold text-foreground">{describeTierLabel(subscription.tier)}</h2></div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-extrabold ${subscription.tier === "premium" ? "bg-primary/10 text-primary" : "bg-foreground/5 text-foreground/60"}`}>{subscription.tier === "premium" ? "Premium status" : "Free plan"}</span>
                <span className="inline-flex min-h-8 items-center rounded-full border border-border bg-background px-3 text-xs font-bold capitalize text-foreground/65">{formatLabel(subscription.status)}</span>
              </div>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] border border-border bg-background p-4"><dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/50">Premium price</dt><dd className="mt-2 text-lg font-extrabold text-foreground">{premiumPrice}</dd></div>
                <div className="rounded-[18px] border border-border bg-background p-4"><dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/50">Billing period</dt><dd className="mt-2 text-lg font-extrabold text-foreground">{subscription.premiumPeriodDays} days</dd></div>
                <div className="rounded-[18px] border border-border bg-background p-4"><dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/50">Subscription expires</dt><dd className="mt-2 text-sm font-extrabold text-foreground">{formatDate(subscription.currentPeriodEnd)}</dd></div>
                <div className="rounded-[18px] border border-border bg-background p-4"><dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/50">Latest payment method</dt><dd className="mt-2 text-sm font-extrabold text-foreground">{formatLabel(latestPaymentMethod)}</dd></div>
              </dl>
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                {isPremium ? (
                  subscription.status === "active" ? (
                    <button type="button" onClick={() => void handleCancel()} disabled={cancelling} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-coral/30 bg-background px-5 py-2.5 text-sm font-extrabold text-coral transition hover:bg-coral/10 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2">
                      {cancelling ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <LockKeyhole aria-hidden="true" className="size-4" />}
                      {cancelling ? "Updating…" : "Cancel auto-renewal"}
                    </button>
                  ) : <p className="text-sm font-semibold text-foreground/60">Subscription status: {formatLabel(subscription.status)}.</p>
                ) : (
                  <button type="button" onClick={() => void handleSubscribe()} disabled={checkoutStatus !== "idle"} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    {checkoutStatus === "loading" ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : checkoutStatus === "snap" ? <Wallet aria-hidden="true" className="size-4" /> : <Crown aria-hidden="true" className="size-4" />}
                    {checkoutStatus === "loading" ? "Preparing payment…" : checkoutStatus === "snap" ? "Complete payment in Midtrans" : "Upgrade to Premium"}
                    {checkoutStatus === "idle" && <ArrowRight aria-hidden="true" className="size-4" />}
                  </button>
                )}
                <span className="text-xs font-semibold text-foreground/45">Payment processing through Midtrans.</span>
              </div>
            </section>

            <section className="rounded-[28px] border border-primary-soft/40 bg-surface p-5 shadow-card sm:p-7" aria-labelledby="premium-features-title">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Plan details</p>
              <h2 id="premium-features-title" className="mt-1 text-xl font-extrabold text-foreground">Premium features</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {featureRows.map(({ key, label, description, Icon }) => {
                  const enabled = subscription.features[key];
                  return <li key={key} className="flex gap-3 rounded-[18px] border border-border bg-background p-3.5">
                    <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl ${enabled ? "bg-primary/10 text-primary" : "bg-foreground/5 text-foreground/35"}`}><Icon aria-hidden="true" className="size-4" /></span>
                    <span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2 text-sm font-extrabold text-foreground"><span>{label}</span>{enabled && <Check aria-hidden="true" className="size-4 shrink-0 text-primary" />}</span><span className="mt-1 block text-xs leading-5 text-foreground/55">{description}</span></span>
                  </li>;
                })}
              </ul>
            </section>
          </div>

          <section className="mt-6 rounded-[28px] border border-primary-soft/40 bg-surface p-5 shadow-card sm:p-7" aria-labelledby="billing-history-title">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Wallet aria-hidden="true" className="size-5" /></span>
              <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Your recorded transactions</p><h2 id="billing-history-title" className="mt-1 text-xl font-extrabold text-foreground">Billing History</h2></div>
            </div>
            {paymentsError ? <p role="alert" className="mt-5 rounded-2xl border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{paymentsError}</p> : payments.length ? (
              <ul className="mt-5 space-y-3">
                {payments.map((payment) => (
                  <li key={payment.order_id} className="grid gap-3 rounded-[18px] border border-border bg-background p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-5">
                    <div className="min-w-0"><p className="break-all text-sm font-extrabold text-foreground">{payment.order_id}</p><p className="mt-1 text-xs font-semibold text-foreground/50">{formatDate(payment.created_at)}</p></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/45">Payment method</p><p className="mt-1 text-sm font-bold text-foreground">{formatLabel(payment.payment_type)}</p></div>
                    <div className="flex items-center justify-between gap-4 sm:text-right"><span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary">{paymentStatus(payment.status)}</span><span className="text-sm font-extrabold text-foreground">{formatIdr(payment.gross_amount)}</span></div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-5 rounded-[18px] border border-dashed border-border bg-background p-5 text-sm font-semibold text-foreground/55">No payment transactions are recorded for this account.</div>
            )}
          </section>
        </>
      ) : null}
    </>
  );
}
