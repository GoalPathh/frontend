"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Crown,
  Loader2,
  Lock,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  describeTierLabel,
  isSubscriptionGateError,
  loadMidtransSnapScript,
  subscriptionService,
} from "@/lib/subscriptionService";
import { hasAuthSession } from "@/lib/api";
import type {
  SubscriptionResponse,
  SubscriptionTier,
} from "@/lib/types";

type CheckoutStatus = "idle" | "loading" | "snap" | "error";

const SNAP_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
const SNAP_IS_PRODUCTION = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";

const FEATURE_ROWS: Array<{
  key: keyof SubscriptionResponse["features"];
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    key: "unlimitedGoals",
    label: "Unlimited Goals & Habits",
    description: "Buat sebanyak yang kamu mau — gak ada batasan jumlah goal atau habit per goal.",
    icon: <Target className="h-4 w-4" />,
  },
  {
    key: "aiAdaptiveHabit",
    label: "AI Adaptive Habit",
    description: "AI coach otomatis menyesuaikan kesulitan habit berdasarkan pola energi kamu.",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    key: "futureSelfSimulation",
    label: "Future Self Simulation",
    description: "Simulasi 7–180 hari ke depan untuk memprediksi streak, milestone, dan persona shift.",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    key: "fullAiCoachAccess",
    label: "Full AI Coach Access",
    description: "Chat coach tanpa batas harian — brainstorming goal kapan pun kamu butuh.",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    key: "advancedInsight",
    label: "Advanced Insight",
    description: "Heatmap, time-of-day analysis, dan risk-flagging yang lebih tajam dari data biasa.",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    key: "prioritySupport",
    label: "Priority Support",
    description: "Respons lebih cepat untuk pertanyaan & bug report lewat channel khusus Premium.",
    icon: <UserCheck className="h-4 w-4" />,
  },
];

const FREE_HIGHLIGHTS: Array<{ label: string; value: string; icon: React.ReactNode }> = [
  { label: "Goals", value: "Hingga 3 goal aktif", icon: <Target className="h-4 w-4" /> },
  { label: "Habits per goal", value: "Hingga 5 habit", icon: <Sparkles className="h-4 w-4" /> },
  { label: "Coach messages", value: "10 pesan / hari", icon: <Zap className="h-4 w-4" /> },
  { label: "Insight dasar", value: "✓", icon: <Shield className="h-4 w-4" /> },
];

export default function PricingPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(hasAuthSession());
    setHydrated(true);
    if (hasAuthSession()) {
      void subscriptionService
        .getMySubscription()
        .then((sub) => setSubscription(sub))
        .catch(() => setSubscription(null));
    }
  }, []);

  const formattedPrice = useMemo(() => {
    const price = subscription?.premiumPriceIdr ?? 150_000;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  }, [subscription]);

  const isPremium = subscription?.tier === "premium";

  const handleSubscribe = useCallback(async () => {
    setErrorMessage("");
    if (!hasAuthSession()) {
      router.push("/login?next=/pricing");
      return;
    }

    setCheckoutStatus("loading");
    try {
      const checkout = await subscriptionService.createCheckout();

      if (!SNAP_CLIENT_KEY) {
        setCheckoutStatus("error");
        setErrorMessage(
          "Midtrans client key belum di-set di frontend (NEXT_PUBLIC_MIDTRANS_CLIENT_KEY). Tambahkan variable itu dulu di .env frontend untuk mengaktifkan Snap.",
        );
        return;
      }

      await loadMidtransSnapScript({ clientKey: SNAP_CLIENT_KEY, isProduction: SNAP_IS_PRODUCTION });
      setCheckoutStatus("snap");

      window.snap?.pay(checkout.token, {
        onSuccess: () => {
          startTransition(() => router.push("/me?upgrade=success"));
        },
        onPending: () => {
          startTransition(() => router.push("/me?upgrade=pending"));
        },
        onError: () => {
          setCheckoutStatus("error");
          setErrorMessage("Pembayaran gagal diproses oleh Midtrans. Coba lagi atau ganti metode pembayaran.");
        },
        onClose: () => {
          setCheckoutStatus("idle");
        },
      });
    } catch (error) {
      setCheckoutStatus("error");
      if (isSubscriptionGateError(error)) {
        setErrorMessage("Kamu sudah punya langganan aktif. Refresh halaman untuk melihat status terbaru.");
        void subscriptionService.refresh().then(setSubscription).catch(() => undefined);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Terjadi kesalahan tak terduga saat memulai checkout.");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground lg:pl-[272px] lg:pb-10">
      <AppSidebar active="pricing" className="fixed inset-y-0 left-0 z-50 hidden lg:flex" />

      <div className="mx-auto max-w-5xl px-5 py-8 md:px-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Pricing</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Pilih plan yang cocok buat kamu
            </h1>
          </div>
          <ThemeToggle className="shrink-0 bg-surface/80 dark:bg-surface/10" />
        </div>

        {hydrated && isAuthenticated && isPremium && (
          <div className="mb-6 rounded-[20px] border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
            Kamu sudah punya plan {describeTierLabel("premium")} aktif. Terima kasih sudah mendukung GoalPath! 🎉
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-[20px] border border-coral/30 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Free card */}
          <div className="flex flex-col rounded-[28px] border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground/5 text-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground/60">Free</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">Mulai tanpa biaya</h3>
              </div>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">Rp 0</span>
              <span className="text-sm font-semibold text-foreground/55">selamanya</span>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-foreground">
              {FREE_HIGHLIGHTS.map((item) => (
                <li key={item.label} className="flex items-start gap-3 rounded-xl bg-background px-3 py-2.5">
                  <span className="mt-0.5 text-primary">{item.icon}</span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">{item.label}</span>
                    <span className="block font-semibold">{item.value}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-[18px] border border-dashed border-border bg-background p-4 text-xs text-foreground/55">
              Cocok buat kamu yang baru mulai eksplor GoalPath. Tidak ada kartu kredit, tidak ada waktu percobaan.
            </div>

            <button
              type="button"
              disabled
              className="mt-6 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-border bg-background px-5 py-3 text-sm font-bold text-foreground/55"
            >
              <Lock className="h-4 w-4" />
              {isPremium ? "Tetap di akun ini" : "Plan kamu saat ini"}
            </button>
          </div>

          {/* Premium card */}
          <div className="relative flex flex-col rounded-[28px] border border-primary/40 bg-gradient-to-br from-primary/15 via-surface to-surface p-6 shadow-lg shadow-primary/10">
            <div className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[12px] font-bold uppercase tracking-[0.22em] text-white shadow-lg shadow-primary/30">
              <Crown className="h-3.5 w-3.5" />
              Recommended
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Premium</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">Unlock semuanya</h3>
              </div>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{formattedPrice}</span>
              <span className="text-sm font-semibold text-foreground/55">/ bulan</span>
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">
              Pembayaran via Midtrans • Sandbox mode
            </p>

            <ul className="mt-5 space-y-3 text-sm text-foreground">
              {FEATURE_ROWS.map((row) => {
                const enabled = subscription?.features?.[row.key] ?? (isPremium);
                return (
                  <li
                    key={row.key}
                    className="flex items-start gap-3 rounded-xl bg-background px-3 py-2.5"
                  >
                    <span className={`mt-0.5 ${enabled ? "text-primary" : "text-foreground/55"}`}>{row.icon}</span>
                    <span className="flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">
                        {row.label}
                      </span>
                      <span className="block text-foreground/80">{row.description}</span>
                    </span>
                    <span
                      className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full ${
                        enabled ? "bg-primary text-white" : "bg-foreground/10 text-foreground/55"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => void handleSubscribe()}
              disabled={isPremium || checkoutStatus === "loading" || checkoutStatus === "snap"}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {checkoutStatus === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyiapkan pembayaran...
                </>
              ) : checkoutStatus === "snap" ? (
                <>
                  <Wallet className="h-4 w-4" />
                  Selesaikan di popup Midtrans
                </>
              ) : isPremium ? (
                <>
                  <Check className="h-4 w-4" />
                  Sudah Premium
                </>
              ) : (
                <>
                  Subscribe sekarang
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-foreground/55">
              Pembayaran diproses lewat <strong>Midtrans Snap (sandbox)</strong>. Tidak ada tagihan nyata di mode dev.
            </p>
          </div>
        </div>

        {/* FAQ / confidence bar */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <ConfidenceCard title="Batalkan kapan saja" body="Status Premium berhenti otomatis di akhir periode. Tidak ada kontrak panjang." />
          <ConfidenceCard title="Data tetap aman" body="Subscription row & payment log tersimpan di Supabase dengan RLS aktif." />
          <ConfidenceCard
            title="Transparansi harga"
            body={`${formattedPrice} sudah termasuk akses ke semua fitur Premium di atas.`}
          />
        </div>
      </div>

      <BottomNavigation active="pricing" />
    </div>
  );
}

function ConfidenceCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[22px] border border-border bg-surface p-5 text-sm text-foreground shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{title}</p>
      <p className="mt-2 font-semibold">{body}</p>
    </div>
  );
}
