"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

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

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-card">
        {error ? (
          <>
            <h1 className="text-xl font-bold">Google login failed</h1>
            <p className="mt-3 text-sm leading-6 text-coral">{error}</p>
            <a href="/login" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">
              Return to login
            </a>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <h1 className="mt-4 text-xl font-bold">Completing Google login...</h1>
          </>
        )}
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background px-6">
          <Loader2 className="h-7 w-7 animate-spin text-primary" aria-label="Menyelesaikan login" />
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
