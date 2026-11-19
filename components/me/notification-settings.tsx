import type { NotificationPreference } from "@/lib/types";

interface NotificationSettingsProps {
  preferences: NotificationPreference[];
  onToggle: (id: string) => void;
}

export function NotificationSettings({ preferences, onToggle }: NotificationSettingsProps) {
  return (
    <div className="rounded-[28px] border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Notification Settings</p>
          <h2 className="text-2xl font-bold text-foreground">Stay informed your way</h2>
        </div>
      </div>
      <div className="grid gap-4">
        {preferences.map((item) => (
          <div key={item.id} className="rounded-[24px] border border-border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-foreground/60">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => onToggle(item.id)}
                role="switch"
                aria-checked={item.enabled}
                aria-label={item.title}
                className={`relative inline-flex min-h-11 w-[72px] shrink-0 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${item.enabled ? "bg-primary" : "bg-foreground/20"}`}
              >
                <span
                  className={`ml-1 inline-block size-8 rounded-full bg-surface shadow-sm transition-transform ${item.enabled ? "translate-x-7" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
