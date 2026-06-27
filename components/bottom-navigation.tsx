import { Award, BarChart3, CheckCircle2, Crown, User, UserCog } from "lucide-react";

type BottomNavigationProps = {
  active: "today" | "goals" | "progress" | "coach" | "me" | "pricing";
};

const items = [
  { key: "today", label: "Today", href: "/today", Icon: CheckCircle2 },
  { key: "goals", label: "Goals", href: "/goals", Icon: Award },
  { key: "progress", label: "Progress", href: "/progress", Icon: BarChart3 },
  { key: "coach", label: "Coach", href: "/coach", Icon: UserCog },
  { key: "pricing", label: "Pricing", href: "/pricing", Icon: Crown },
  { key: "me", label: "Me", href: "/me", Icon: User },
] as const;

export function BottomNavigation({ active }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 z-50 flex w-full items-center justify-around rounded-t-[24px] border-t border-[#e4e5f1] px-6 pb-8 pt-4 shadow-lg glass-surface lg:hidden">
      {items.map(({ key, label, href, Icon }) => {
        const isActive = active === key;

        return (
          <a
            key={key}
            href={href}
            className={
              isActive
                ? "flex flex-col items-center justify-center text-primary"
                : "flex flex-col items-center justify-center text-[#6b7280] hover:text-primary transition-colors active:scale-90 duration-200"
            }
          >
            <Icon className="h-6 w-6" />
            <span className={`text-[10px] uppercase tracking-widest mt-1 ${isActive ? "font-bold" : "font-medium"}`}>
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
