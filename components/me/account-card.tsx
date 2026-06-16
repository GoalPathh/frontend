import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface AccountCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  href: string;
}

export function AccountCard({ icon, title, subtitle, href }: AccountCardProps) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between rounded-[24px] border border-border bg-surface p-5 text-left shadow-sm transition hover:border-primary"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-foreground/60">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-primary" />
    </a>
  );
}
