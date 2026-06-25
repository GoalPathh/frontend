"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Award, BellRing, Bot, CheckCircle2, Clock, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppNotification, notificationService, NotificationType } from "@/lib/notificationService";

type NotificationsPanelProps = {
  open: boolean;
  onClose: () => void;
};

const typeMeta: Record<
  NotificationType,
  {
    icon: typeof BellRing;
    tone: string;
  }
> = {
  habit_reminder: {
    icon: BellRing,
    tone: "bg-primary/10 text-primary",
  },
  missed_habit: {
    icon: AlertTriangle,
    tone: "bg-coral/12 text-coral",
  },
  streak: {
    icon: Award,
    tone: "bg-gold/20 text-[#8a6100]",
  },
  coach_tip: {
    icon: Bot,
    tone: "bg-sky/12 text-sky",
  },
  progress_update: {
    icon: CheckCircle2,
    tone: "bg-mint/15 text-emerald-600",
  },
  goal_risk: {
    icon: AlertTriangle,
    tone: "bg-gold/20 text-[#8a6100]",
  },
};

function relativeTime(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    async function loadNotifications() {
      try {
        setLoading(true);
        setError(null);
        const data = await notificationService.list();
        if (!cancelled) setNotifications(data);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read_at).length,
    [notifications],
  );

  async function markAllRead() {
    try {
      setSaving(true);
      setError(null);
      await notificationService.markAllRead();
      const now = new Date().toISOString();
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read_at: notification.read_at ?? now,
        })),
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="absolute right-0 top-14 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[20px] border border-border bg-surface shadow-soft">
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Notifications</p>
          <h2 className="mt-1 text-lg font-extrabold text-foreground">Today&apos;s updates</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className="rounded-full p-2 text-foreground/60 transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[26rem] overflow-y-auto p-3">
        {loading ? (
          <div className="flex items-center gap-2 rounded-[16px] border border-border bg-background/70 p-4 text-sm font-semibold text-foreground/60">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Loading notifications...
          </div>
        ) : error ? (
          <div className="rounded-[16px] border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => {
            const meta = typeMeta[notification.type] ?? typeMeta.coach_tip;
            const Icon = meta.icon;
            const unread = !notification.read_at;

            return (
              <article
                key={notification.id}
                className={cn(
                  "flex gap-3 rounded-[16px] border p-3 transition hover:bg-muted/70",
                  unread ? "border-primary/20 bg-primary/5" : "border-transparent",
                )}
              >
                <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]", meta.tone)}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-extrabold text-foreground">{notification.title}</h3>
                    <span className="shrink-0 text-[11px] font-bold text-foreground/50">{relativeTime(notification.created_at)}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-foreground/60">{notification.message}</p>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[16px] border border-dashed border-border bg-background/70 p-4">
            <p className="text-sm font-extrabold text-foreground">No notifications yet.</p>
            <p className="mt-1 text-sm leading-6 text-foreground/60">GoalPath will show habit reminders, missed-habit warnings, and progress updates here.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground/60">
          <Clock className="h-4 w-4 text-primary" />
          {unreadCount} unread
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={saving || unreadCount === 0}
          className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary transition hover:text-primary/80 disabled:cursor-not-allowed disabled:text-foreground/35"
        >
          {saving ? "Saving..." : "Mark all read"}
        </button>
      </div>
    </div>
  );
}
