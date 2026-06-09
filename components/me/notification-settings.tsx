import type { NotificationPreference } from "@/lib/types";

interface NotificationSettingsProps {
  preferences: NotificationPreference[];
  onToggle: (id: string) => void;
}

export function NotificationSettings({ preferences, onToggle }: NotificationSettingsProps) {
  return (
    <div className="rounded-[28px] border border-border bg-surface p-6 shadow-sm">
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
                className={`relative inline-flex h-9 w-16 items-center rounded-full transition ${item.enabled ? "bg-[#60a5fa]" : "bg-[#d1d5db]"}`}
              >
                <span
                  className={`inline-block h-7 w-7 rounded-full bg-surface shadow-sm transition ${item.enabled ? "translate-x-7" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
