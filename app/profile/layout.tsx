import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNavigation } from "@/components/bottom-navigation";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-24 text-foreground lg:pb-10 lg:pl-[272px]">
      <AppSidebar active="me" className="fixed inset-y-0 left-0 z-50 hidden lg:flex" />
      <main id="main" className="mx-auto max-w-7xl px-4 py-5 md:px-10 md:py-8">
        {children}
      </main>
      <BottomNavigation active="me" />
    </div>
  );
}
