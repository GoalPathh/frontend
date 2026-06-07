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
      className="group flex items-center justify-between rounded-[24px] border border-[#e4e5f1] bg-white p-5 text-left shadow-sm transition hover:border-[#9288F8]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#f3f2ff] text-[#9288F8]">{icon}</div>
        <div>
          <p className="text-base font-semibold text-[#121221]">{title}</p>
          <p className="mt-1 text-sm text-[#6b7280]">{subtitle}</p>
        </div>
      </div>
      <span className="text-xl font-bold text-[#9288F8]">›</span>
    </a>
  );
}
