"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error.tsx] Route error boundary caught:", error);
  }, [error]);

  return (
    <div
      style={{
        padding: "40px 20px",
        textAlign: "center",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "20px", marginBottom: "12px" }}>Something went wrong</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        We hit a problem rendering this page. Please try again.
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
    </div>
  );
}
