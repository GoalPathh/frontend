"use client";

/**
 * Explicit global-error boundary — required by Next.js 16+ to work around the
 * "Could not find global-error.js#default in client manifest" runtime crash.
 * See: https://github.com/vercel/next.js/issues/84493
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          padding: "40px 20px",
          textAlign: "center",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <h1 style={{ fontSize: "20px", marginBottom: "12px" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          We hit an unexpected error. Please try again.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#5b6cff",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
