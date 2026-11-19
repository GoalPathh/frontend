import { Award, BarChart3, CheckCircle2, User, UserCog } from "lucide-react";
import { IntentLink } from "@/components/intent-link";

type BottomNavigationProps = {
  active: "today" | "goals" | "progress" | "coach" | "me" | "pricing";
};

const items = [
  { key: "today", label: "Today", href: "/today", Icon: CheckCircle2 },
  { key: "goals", label: "Goals", href: "/goals", Icon: Award },
  { key: "progress", label: "Progress", href: "/progress", Icon: BarChart3 },
  { key: "me", label: "Profile", href: "/profile", Icon: User },
] as const;

export function BottomNavigation({ active }: BottomNavigationProps) {
  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 flex w-full items-center justify-around rounded-t-[24px] border-t border-primary-soft/50 bg-background px-1 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] shadow-lg lg:hidden"
      >
        {items.map(({ key, label, href, Icon }) => {
          const isActive = active === key;

          return (
            <IntentLink
              key={key}
              href={href}
              prefetch={
                (active === "today" && key === "goals") ||
                (active === "goals" && key === "today")
              }
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-11 min-w-11 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-primary-soft/30 motion-reduce:transition-none ${
                isActive
                  ? "bg-primary/10 font-bold text-primary"
                  : "font-medium text-foreground/70 hover:bg-primary-soft/15 hover:text-primary"
              }`}
            >
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              <span className="text-[9px] leading-3 sm:text-[10px]">
                {label}
              </span>
            </IntentLink>
          );
        })}
      </nav>

      {active !== "coach" && (
        <IntentLink
          href="/coach"
          aria-label="Open AI Coach"
          className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+5rem)] right-4 z-[60] flex size-12 cursor-pointer items-center justify-center rounded-full border border-primary/20 bg-primary text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 motion-reduce:transition-none lg:hidden"
        >
          <UserCog aria-hidden="true" className="size-5" />
        </IntentLink>
      )}
    </>
  );
}
