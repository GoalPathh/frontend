"use client";

import { Award, BellRing, Bot, CheckCircle2, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationsPanelProps = {
  open: boolean;
  onClose: () => void;
};

const notifications = [
  {
    title: "Drink 500ml Water",
    message: "Your morning habit is waiting. Keep it light and finish one small action.",
    time: "Now",
    icon: BellRing,
    tone: "bg-primary/10 text-primary",
    unread: true,
  },
  {
    title: "7 Day Streak",
    message: "You protected your streak this week. Claim the momentum badge.",
    time: "12m",
    icon: Award,
    tone: "bg-gold/20 text-[#8a6100]",
    unread: true,
  },
  {
    title: "AI Coach Tip",
    message: "Energy low? Switch speaking practice to one sentence today.",
    time: "1h",
    icon: Bot,
    tone: "bg-sky/12 text-sky",
    unread: false,
  },
  {
    title: "Progress Update",
    message: "English Fluency moved to 75%. You are ahead of this week's pace.",
    time: "3h",
    icon: CheckCircle2,
    tone: "bg-coral/12 text-coral",
    unread: false,
  },
];

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
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
        {notifications.map((notification) => (
          <article
            key={notification.title}
            className={cn(
              "flex gap-3 rounded-[16px] border p-3 transition hover:bg-muted/70",
              notification.unread ? "border-primary/20 bg-primary/5" : "border-transparent",
            )}
          >
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]", notification.tone)}>
              <notification.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-extrabold text-foreground">{notification.title}</h3>
                <span className="shrink-0 text-[11px] font-bold text-foreground/50">{notification.time}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-foreground/60">{notification.message}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground/60">
          <Clock className="h-4 w-4 text-primary" />
          2 unread
        </div>
        <button type="button" className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
          Mark all read
        </button>
      </div>
    </div>
  );
}
