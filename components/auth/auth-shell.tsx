import { ReactNode } from "react";
import { AuthHeader } from "@/components/auth/auth-header";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: ReactNode;
  aside: ReactNode;
  reverse?: boolean;
};

export function AuthShell({ children, aside, reverse = false }: AuthShellProps) {
  return (
    <div className="page-band flex min-h-screen flex-col bg-background text-foreground">
      <AuthHeader />
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/70 bg-surface/80 shadow-soft backdrop-blur-xl lg:min-h-[680px] lg:grid-cols-2",
            reverse && "lg:[&>*:first-child]:order-2",
          )}
        >
          <section className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">{children}</section>
          <section className="hidden overflow-hidden bg-muted/80 lg:flex">{aside}</section>
        </div>
      </main>

      <footer className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 pb-8 text-xs font-bold text-[#6b7280] sm:px-6 md:flex-row lg:px-8">
        <span>© 2026 GoalPath. All rights reserved.</span>
        <div className="flex gap-5">
          <a href="#" className="transition hover:text-primary">
            Privacy Policy
          </a>
          <a href="#" className="transition hover:text-primary">
            Terms
          </a>
          <a href="#" className="transition hover:text-primary">
            Help Center
          </a>
        </div>
      </footer>
    </div>
  );
}

