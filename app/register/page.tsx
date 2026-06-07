import Link from "next/link";
import { ArrowRight, Lock, Mail, RotateCcw, UserRound } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { RegisterPreview } from "@/components/auth/register-preview";

export default function RegisterPage() {
  return (
    <AuthShell aside={<RegisterPreview />} reverse>
      <div className="mb-8">
        <span className="mb-5 inline-flex rounded-full bg-primary/15 px-4 py-2 text-xs font-extrabold text-primary">
          Start Your Growth Journey
        </span>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          Create Your Account
        </h1>
        <p className="mt-3 max-w-md text-sm font-semibold leading-7 text-[#6b7280] sm:text-base">
          Start turning your goals into consistent daily habits.
        </p>
      </div>

      <form className="space-y-4">
        <AuthField
          id="full-name"
          icon={UserRound}
          placeholder="Full Name"
          type="text"
          autoComplete="name"
        />
        <AuthField
          id="register-email"
          icon={Mail}
          placeholder="Email Address"
          type="email"
          autoComplete="email"
        />
        <AuthField
          id="register-password"
          icon={Lock}
          placeholder="Password"
          type="password"
          autoComplete="new-password"
        />
        <AuthField
          id="confirm-password"
          icon={RotateCcw}
          placeholder="Confirm Password"
          type="password"
          autoComplete="new-password"
        />

        <label className="flex items-start gap-3 text-sm font-semibold leading-6 text-[#6b7280]">
          <input
            className="mt-1 size-4 shrink-0 rounded border-border text-primary focus:ring-primary/25"
            type="checkbox"
          />
          <span>
            I agree to the{" "}
            <a href="#" className="font-extrabold text-primary hover:underline">
              Terms & Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primarySoft px-4 py-3 text-base font-extrabold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/20 active:translate-y-0"
        >
          Create Account
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

      <p className="mt-7 text-center text-sm font-semibold text-[#6b7280]">
        Already have an account?{" "}
        <Link href="/login" className="font-extrabold text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
