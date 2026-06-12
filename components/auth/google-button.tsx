export function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      title="Google sign-in is not configured yet"
      className="flex h-[52px] w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-extrabold text-foreground/50 shadow-card"
    >
      <span className="grid size-5 place-items-center rounded-full bg-white text-sm font-black text-primary shadow-sm">
        G
      </span>
      {label}
    </button>
  );
}
