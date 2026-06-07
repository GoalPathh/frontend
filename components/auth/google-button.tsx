export function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-extrabold text-foreground shadow-card transition hover:-translate-y-0.5 hover:bg-muted focus:outline-none focus:ring-4 focus:ring-primary/15 active:translate-y-0"
    >
      <span className="grid size-5 place-items-center rounded-full bg-white text-sm font-black text-primary shadow-sm">
        G
      </span>
      {label}
    </button>
  );
}
