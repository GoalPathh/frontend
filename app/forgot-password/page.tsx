"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, Mail, Send } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginPreview } from "@/components/auth/login-preview";
import { authService } from "@/lib/authService";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await authService.forgotPassword(String(form.get("email")));
      setMessage(result.message);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to send reset email.");
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
          Account Recovery
        </span>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">Reset your password</h1>
        <p className="mt-3 max-w-md text-sm font-semibold leading-7 text-[#6b7280] sm:text-base">
          Enter your email and we&apos;ll send a secure link to create a new password.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField
          id="forgot-email"
          label="Email Address"
          icon={Mail}
          placeholder="name@example.com"
          type="email"
          autoComplete="email"
          name="email"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primarySoft px-4 py-3 text-base font-extrabold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/20 active:translate-y-0 disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send Reset Link"}
          <Send className="size-5" aria-hidden="true" />
        </button>
      </form>

      {message && (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {message}
        </p>
      )}
      {error && <p className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">{error}</p>}
    </AuthShell>
  );
}
