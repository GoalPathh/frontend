import { ChevronRight, MoveLeft } from "lucide-react";
import { IntentLink } from "@/components/intent-link";

export function ProfilePageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-8">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm font-semibold">
        <IntentLink href="/profile" className="text-primary transition hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Profile
        </IntentLink>
        <ChevronRight aria-hidden="true" className="size-4 text-foreground/40" />
        <span aria-current="page" className="text-foreground/65">{title}</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Account settings</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/60">{description}</p>
        </div>
        <IntentLink
          href="/profile"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <MoveLeft aria-hidden="true" className="size-4" />
          Back to Profile
        </IntentLink>
      </div>
    </header>
  );
}
