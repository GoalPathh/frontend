"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { LoginPreview } from "@/components/auth/login-preview";
import { authService } from "@/lib/authService";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await authService.login(String(form.get("email")), String(form.get("password")));
      const next = searchParams.get("next");
      router.push(next && /^\/(?!\/)/.test(next) ? next : "/today");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell aside={<LoginPreview />}>
      <div className="mb-9">
        <span className="mb-5 inline-flex rounded-full bg-primary/15 px-4 py-2 text-xs font-extrabold text-primary">
          Small Steps, Big Changes
        </span>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">Welcome Back</h1>
        <p className="mt-3 max-w-md text-sm font-semibold leading-7 text-[#6b7280] sm:text-base">
          Continue your journey and stay consistent with your goals.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField
          id="email"
          label="Email Address"
          icon={Mail}
          placeholder="name@example.com"
          type="email"
          autoComplete="email"
          name="email"
          required
        />
        <AuthField
          id="password"
          label="Password"
          icon={Lock}
          placeholder="Enter your password"
          type="password"
          autoComplete="current-password"
          name="password"
          required
        />

        <div className="flex flex-col gap-3 text-sm font-bold text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2">
            <input
              className="size-4 rounded border-border text-primary focus:ring-primary/25"
              type="checkbox"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-primary transition hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primarySoft px-4 py-3 text-base font-extrabold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/20 active:translate-y-0"
        >
          {loading ? "Signing In..." : "Sign In"}
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-4 py-1">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8a8797]">
            or
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleButton
          label="Continue with Google"
          loading={googleLoading}
          onClick={async () => {
            setGoogleLoading(true);
            setError("");
            try {
              const next = searchParams.get("next");
              await authService.loginWithGoogle(next && /^\/(?!\/)/.test(next) ? next : "/today");
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "Unable to connect to Google.");
              setGoogleLoading(false);
            }
          }}
        />
      </form>
      {error && <p className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{error}</p>}

      <p className="mt-8 text-center text-sm font-semibold text-[#6b7280]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-extrabold text-primary hover:underline">
          Create Account
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
