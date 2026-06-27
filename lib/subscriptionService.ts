import { ApiError, apiRequest } from "./api";
import {
  SUBSCRIPTION_GATE_CODE,
  type SubscriptionCheckoutResponse,
  type SubscriptionResponse,
  type SubscriptionTier,
  type SubscriptionWebhookAck,
} from "./types";

/**
 * Frontend wrapper for the backend subscription service.
 * All endpoints live at `${API_URL}/subscription/*`.
 */
export const subscriptionService = {
  async getMySubscription(): Promise<SubscriptionResponse> {
    return apiRequest<SubscriptionResponse>("/subscription");
  },

  async createCheckout(): Promise<SubscriptionCheckoutResponse> {
    return apiRequest<SubscriptionCheckoutResponse>("/subscription/checkout", {
      method: "POST",
    });
  },

  async refresh(): Promise<SubscriptionResponse> {
    return apiRequest<SubscriptionResponse>("/subscription/refresh", {
      method: "POST",
    });
  },

  async cancel(): Promise<SubscriptionResponse> {
    return apiRequest<SubscriptionResponse>("/subscription/cancel", {
      method: "POST",
    });
  },
};

/**
 * Inject Midtrans Snap.js into the page exactly once.
 * Returns a promise that resolves once `window.snap.pay` is callable.
 *
 * Sandbox base URL: https://app.sandbox.midtrans.com/snap/snap.js
 * Production:      https://app.midtrans.com/snap/snap.js
 *
 * The script tag carries `data-client-key` so the lib can authenticate
 * against the merchant's public client key.
 */
declare global {
  interface Window {
    __goalpathSnapReady?: boolean;
  }
}

export interface LoadSnapOptions {
  clientKey: string;
  isProduction: boolean;
}

let snapPromise: Promise<void> | null = null;
const SNAP_INIT_TIMEOUT_MS = 8000;

export function loadMidtransSnapScript({ clientKey, isProduction }: LoadSnapOptions): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.snap?.pay) return Promise.resolve();
  // Singleton promise cache: prevents concurrent callers from concurrently
  // injecting multiple <script> tags when the previous attempt failed.
  if (snapPromise) return snapPromise;

  const base = isProduction
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";

  snapPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${base}/snap/snap.js`;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    const startedAt = Date.now();
    const watcher = window.setInterval(() => {
      if (window.snap?.pay) {
        window.clearInterval(watcher);
        window.__goalpathSnapReady = true;
        resolve();
      } else if (Date.now() - startedAt > SNAP_INIT_TIMEOUT_MS) {
        window.clearInterval(watcher);
        snapPromise = null;
        window.__goalpathSnapReady = false;
        reject(new Error("Midtrans Snap failed to initialise within 8s."));
      }
    }, 120);
    script.onerror = () => {
      window.clearInterval(watcher);
      snapPromise = null;
      window.__goalpathSnapReady = false;
      reject(new Error("Failed to load Midtrans Snap script."));
    };
    document.head.appendChild(script);
  });

  return snapPromise;
}

/**
 * Detect whether an ApiError indicates the user has hit a free-tier limit
 * or tried to use a premium-only feature. Optional error code stays generic
 * (402) but consumers can decide how to respond (CTA, redirect, dialog, …).
 */
export function isSubscriptionGateError(error: unknown): boolean {
  return error instanceof ApiError && error.status === SUBSCRIPTION_GATE_CODE;
}

export function describeTierLabel(tier: SubscriptionTier): string {
  return tier === "premium" ? "Premium" : "Free";
}
