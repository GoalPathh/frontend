"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Lock, RotateCcw } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginPreview } from "@/components/auth/login-preview";
import { authService } from "@/lib/authService";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const authError = hash.get("error_description") ?? searchParams.get("error_description");

    if (authError) {
      setError(authError);
      return;
    }

    if (!accessToken || !refreshToken) {
      setError("Reset link is invalid or expired. Please request a new password reset link.");
      return;
    }

    // Call our internal Next.js API route to set the HTTP-only cookies
    fetch("/api/auth/cookies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to set cookies");
        setReady(true);
      })
      .catch((err) => setError(err.message));
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const confirmPassword = String(form.get("confirmPassword"));
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.updatePassword(password);
      await fetch("/api/auth/logout", { method: "POST" });
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 1200);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell aside={<LoginPreview />}>
      <div className="mb-8">
        <Link href="/login" className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
        <span className="mb-5 inline-flex rounded-full bg-primary/15 px-4 py-2 text-xs font-extrabold text-primary">
          New Password
        </span>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">Create a new password</h1>
        <p className="mt-3 max-w-md text-sm font-semibold leading-7 text-[#6b7280] sm:text-base">
          Use at least 8 characters. After updating, sign in again with your new password.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField
          id="new-password"
          label="New Password"
          icon={Lock}
          placeholder="Enter new password"
          type="password"
          autoComplete="new-password"
          name="password"
          required
          minLength={8}
          disabled={!ready || success}
        />
        <AuthField
          id="confirm-new-password"
          label="Confirm Password"
          icon={RotateCcw}
          placeholder="Confirm new password"
          type="password"
          autoComplete="new-password"
          name="confirmPassword"
          required
          minLength={8}
          disabled={!ready || success}
        />

        <button
          type="submit"
          disabled={!ready || loading || success}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primarySoft px-4 py-3 text-base font-extrabold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Updating..." : success ? "Password Updated" : "Update Password"}
          <CheckCircle2 className="size-5" aria-hidden="true" />
        </button>
      </form>

      {success && <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">Password updated. Redirecting to login...</p>}
      {error && <p className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{error}</p>}
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
