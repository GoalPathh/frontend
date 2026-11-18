import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-2 font-extrabold">
        <BrandLogo size={40} priority />
        <span className="text-lg tracking-tight">GoalPath</span>
      </Link>

      <ThemeToggle />
    </header>
  );
}
