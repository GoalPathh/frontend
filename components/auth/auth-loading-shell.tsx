export function AuthLoadingShell() {
  return (
    <div aria-label="Loading account page" aria-busy="true" className="min-h-screen bg-background px-4 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between">
        <div className="h-9 w-32 animate-pulse rounded-full bg-muted" />
        <div className="size-10 animate-pulse rounded-full bg-muted" />
      </div>
      <main className="mx-auto flex min-h-[calc(100vh-120px)] max-w-6xl items-center justify-center py-4">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-border bg-surface/80 shadow-soft lg:min-h-[680px] lg:grid-cols-2">
          <section className="space-y-5 p-6 sm:p-8 lg:p-12">
            <div className="mb-8 space-y-3">
              <div className="h-7 w-40 animate-pulse rounded-full bg-muted" />
              <div className="h-10 w-56 animate-pulse rounded-lg bg-muted" />
              <div className="h-5 max-w-md animate-pulse rounded bg-muted" />
            </div>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-2xl bg-muted" />
            ))}
            <div className="h-[52px] animate-pulse rounded-2xl bg-muted" />
            <div className="h-[52px] animate-pulse rounded-2xl bg-muted" />
          </section>
          <aside className="hidden bg-muted/60 lg:block" />
        </div>
      </main>
    </div>
  );
}
