export function GoogleButton({ label, onClick, loading = false }: { label: string; onClick: () => void; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-extrabold text-foreground shadow-card transition hover:-translate-y-0.5 hover:bg-muted focus:outline-none focus:ring-4 focus:ring-primary/15 active:translate-y-0 disabled:cursor-wait disabled:opacity-60"
    >
      <span className="grid size-5 place-items-center rounded-full bg-white text-sm font-black text-primary shadow-sm">
        G
      </span>
      {loading ? "Connecting to Google..." : label}
    </button>
  );
}
