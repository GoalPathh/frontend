"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

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
      setError("Google login did not return a valid session.");
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
        const next = searchParams.get("next");
        router.replace(next && /^\/(?!\/)/.test(next) ? next : "/today");
      })
      .catch((err) => setError(err.message));
  }, [router, searchParams]);

  if (!error) {
    return (
      <main className="min-h-screen bg-background" aria-busy="true">
        <span className="sr-only" role="status">Signing in</span>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-card">
        <h1 className="text-xl font-bold">Google login failed</h1>
        <p className="mt-3 text-sm leading-6 text-coral">{error}</p>
        <a href="/login" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">
          Return to login
        </a>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={<main className="min-h-screen bg-background" aria-busy="true" />}
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
