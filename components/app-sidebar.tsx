import {
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Cpu,
  MoreHorizontal,
  Plus,
  Settings,
  Smile,
  Sparkles,
  Target,
  UserCog,
} from "lucide-react";

export type AppSection = "today" | "goals" | "progress" | "coach" | "me";

type AppSidebarProps = {
  active: AppSection;
  coachSessions?: boolean;
  className?: string;
  onNavigate?: () => void;
};

const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB2w4bl-LhdQY2a24NLuM-SKFio6jOZlAkPV4x2D654Th6P_tKpcS_zKUNhcVMJuqEuEbBovvJqkqijZBXF8idVU7g9_22yyjGk0NokMNfm2gMjCWFotmgA9uG4y69LevHyu-WK7YFRqyizIrKIPpfr-B5tis939-TUQ-ZaLEnUrzRUvTeQ6Kk_l9wnzFUBaC5jmf5iwnjT_JRHEgP_vj0Rxn_olwLhLPrNnWmNI1TxUJmiEehIl8uuWRvg5GwBrgZ4skhtuKuo7jvS6p0beDH";

const mainMenu = [
  { key: "today", label: "Today", href: "/today", Icon: CheckCircle2 },
  { key: "goals", label: "Goals", href: "/goals", Icon: Target },
  { key: "progress", label: "Progress", href: "/progress", Icon: BarChart3 },
  { key: "coach", label: "Coach", href: "/coach", Icon: UserCog },
] as const;

const recentChats = [
  { title: "Feeling unmotivated", time: "2m ago", Icon: Smile, active: true },
  { title: "Improve speaking skills", time: "1h ago", Icon: BarChart3, active: false },
  { title: "Habit adjustment", time: "Yesterday", Icon: CalendarCheck, active: false },
  { title: "Weekly review", time: "3 days ago", Icon: Sparkles, active: false },
] as const;

export function AppSidebar({ active, coachSessions = false, className = "", onNavigate }: AppSidebarProps) {
  return (
    <aside className={`flex h-dvh w-[272px] shrink-0 flex-col border-r border-border bg-surface ${className}`}>
      <div className="px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold tracking-tight">GoalPath AI</h2>
            <p className="mt-0.5 text-xs font-semibold text-primary">
              {active === "coach" ? "Coach mode" : "Growth workspace"}
            </p>
          </div>
        </div>
      </div>

      <div className="border-y border-border px-4 py-5">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
          Main menu
        </p>
        <nav className="space-y-1" aria-label="Main navigation">
          {mainMenu.map(({ key, label, href, Icon }) => {
            const isActive = active === key;

            return (
              <a
                key={key}
                href={href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "text-foreground/60 hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{label}</span>
                {isActive && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
              </a>
            );
          })}
        </nav>
      </div>

      {coachSessions ? (
        <>
          <div className="px-4 py-5">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface active:scale-[0.98]">
              <Plus className="h-4 w-4" />
              New Session
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <div className="mb-2 flex items-center justify-between px-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Recent chats</p>
              <button
                className="rounded-lg p-1.5 text-foreground/40 transition hover:bg-muted hover:text-primary"
                aria-label="More recent chat options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              {recentChats.map(({ title, time, Icon, active: chatActive }) => (
                <button
                  key={title}
                  className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                    chatActive
                      ? "border-primary/15 bg-primary/10"
                      : "border-transparent hover:border-border hover:bg-muted"
                  }`}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      chatActive
                        ? "bg-surface text-primary shadow-sm"
                        : "bg-muted text-foreground/45 group-hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-bold text-foreground">{title}</span>
                    <span className="mt-1 block text-[10px] font-medium text-foreground/40">{time}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 px-4 py-5">
          <div className="rounded-2xl border border-primary/15 bg-primary/8 p-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-bold">Keep moving forward</p>
            <p className="mt-1 text-xs font-medium leading-5 text-foreground/45">
              Small consistent actions build meaningful progress.
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-border p-4">
        <a
          href="/me"
          onClick={onNavigate}
          aria-current={active === "me" ? "page" : undefined}
          className={`flex items-center gap-3 rounded-2xl p-2 transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
            active === "me" ? "bg-primary/10" : "hover:bg-muted"
          }`}
        >
          <img src={profileImage} alt="Alex Rivera" className="size-10 rounded-full border border-border object-cover" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">Alex Rivera</span>
            <span className="block truncate text-[10px] font-medium text-foreground/45">Premium Member</span>
          </span>
          <Settings className={`h-4 w-4 ${active === "me" ? "text-primary" : "text-foreground/40"}`} />
        </a>
      </div>
    </aside>
  );
}
