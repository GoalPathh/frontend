import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { LoginPreview } from "@/components/auth/login-preview";

export default function LoginPage() {
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

      <form className="space-y-5">
        <AuthField
          id="email"
          label="Email Address"
          icon={Mail}
          placeholder="name@example.com"
          type="email"
          autoComplete="email"
        />
        <AuthField
          id="password"
          label="Password"
          icon={Lock}
          placeholder="Enter your password"
          type="password"
          autoComplete="current-password"
        />

        <div className="flex flex-col gap-3 text-sm font-bold text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2">
            <input
              className="size-4 rounded border-border text-primary focus:ring-primary/25"
              type="checkbox"
            />
            Remember me
          </label>
          <a href="#" className="text-primary transition hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primarySoft px-4 py-3 text-base font-extrabold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/20 active:translate-y-0"
        >
          Sign In
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-4 py-1">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8a8797]">
            or
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleButton label="Continue with Google" />
      </form>

      <p className="mt-8 text-center text-sm font-semibold text-[#6b7280]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-extrabold text-primary hover:underline">
          Create Account
        </Link>
      </p>
    </AuthShell>
  );
}
