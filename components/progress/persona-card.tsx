"use client";

import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PersonaResponse } from "@/lib/types";

interface Props {
  persona: PersonaResponse | null;
  loading: boolean;
  onRefresh: () => void;
  windowDays: number;
  onWindowDaysChange: (n: number) => void;
}

const ARCHETYPE_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  "Steady Builder":     { bg: "bg-emerald-500/12", text: "text-emerald-600", ring: "ring-emerald-500/25" },
  "Comeback Captain":   { bg: "bg-rose-500/12",    text: "text-rose-600",    ring: "ring-rose-500/25" },
  "Momentum Maker":     { bg: "bg-amber-500/12",   text: "text-amber-600",   ring: "ring-amber-500/25" },
  "Streak Hunter":      { bg: "bg-primary/12",     text: "text-primary",     ring: "ring-primary/20" },
  "Marathon Runner":    { bg: "bg-sky-500/12",      text: "text-sky-600",      ring: "ring-sky-500/25" },
  "GoalPath Apprentice":{ bg: "bg-foreground/8",   text: "text-foreground/70", ring: "ring-foreground/15" },
};

const DIFFICULTY_BADGE: Record<string, { bg: string; text: string }> = {
  easier:  { bg: "bg-emerald-500/15", text: "text-emerald-700" },
  maintain: { bg: "bg-sky-500/15",     text: "text-sky-700" },
  harder:  { bg: "bg-amber-500/15",   text: "text-amber-700" },
};

const FEATURE_LABEL: Record<string, string> = {
  consistency: "Konsistensi",
  recovery: "Pemulihan streak",
  completionist: "Penyelesaian milestone",
  streak_hunter: "Streak hunter",
  momentum: "Momentum mingguan",
};

const FEATURE_DESC: Record<string, string> = {
  consistency: "Menyelesaikan kebiasaan harian secara konsisten",
  recovery: "Bangkit setelah streak patah",
  completionist: "Menutup milestone tepat waktu",
  streak_hunter: "Mempertahankan streak multi-hari",
  momentum: "Completion naik minggu ke minggu",
};

export function PersonaCard({ persona, loading, onRefresh, windowDays, onWindowDaysChange }: Props) {
  const router = useRouter();

  if (loading && !persona) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <div className="flex items-center gap-2 text-foreground/55">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wide">Menganalisis pola kamu...</span>
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-6">
        <Sparkles className="h-5 w-5 text-primary/60" />
        <h3 className="mt-3 text-sm font-bold text-foreground">Profil AI belum siap</h3>
        <p className="mt-1 text-xs leading-5 text-foreground/55">
          Mulai rutinitas pertamamu — sistem akan menganalisis pola kebiasaanmu dan membuka profil persona.
        </p>
        <button
          onClick={onRefresh}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-foreground/70 transition hover:border-primary/40 hover:text-primary active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Coba hitung sekarang
        </button>
      </div>
    );
  }

  const colors = ARCHETYPE_COLORS[persona.archetype] || ARCHETYPE_COLORS["GoalPath Apprentice"];
  const sortedTraits = (Object.entries(persona.traits) as Array<[string, number]>)
    .sort((a, b) => b[1] - a[1]);
  const topThree = sortedTraits.slice(0, 3);

  const handleDiscussCoach = () => {
    router.push("/coach?session=latest");
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-surface p-1 shadow-card ${colors.ring} ring-1`}>
      <div className="rounded-xl bg-gradient-to-br from-background/40 via-surface to-surface/90 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 items-start gap-3">
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}>
              <Sparkles className={`h-5 w-5 ${colors.text}`} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${colors.bg} ${colors.text}`}>
                  {persona.archetype}
                </span>
                <span className="text-[10px] font-medium text-foreground/40">
                  Profil AI · {persona.windowDays}d window
                </span>
              </div>
              <p className="mt-2 text-[13px] font-medium leading-6 text-foreground/85">
                {persona.headline}
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Hitung ulang"
            aria-label="Hitung ulang"
            className="flex size-8 items-center justify-center rounded-lg text-foreground/40 transition hover:bg-muted hover:text-primary disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {topThree.map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-medium">
                <span className="text-foreground/75">{FEATURE_LABEL[key] ?? key}</span>
                <span className="font-bold text-foreground/55">{Math.round(value)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-foreground/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                  style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
                />
              </div>
              <p className="text-[10px] leading-4 text-foreground/45">{FEATURE_DESC[key]}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-border bg-background/60 p-4">
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
            Rekomendasi Coach
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="font-bold text-foreground/65">Difficulty:</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-extrabold uppercase ${DIFFICULTY_BADGE[persona.advice.difficulty].bg} ${DIFFICULTY_BADGE[persona.advice.difficulty].text}`}>
              {persona.advice.difficulty}
            </span>
          </div>
          {persona.advice.habit.length > 0 && (
            <ul className="mt-2 space-y-1">
              {persona.advice.habit.map((tip, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] leading-5 text-foreground/75">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {tip}
                </li>
              ))}
            </ul>
          )}
          {persona.advice.suggestedMilestone && (
            <div className="mt-3 rounded-lg border border-primary/20 bg-primary/8 p-3">
              <p className="text-[10px] font-extrabold uppercase tracking-wide text-primary">
                Milestone berikutnya yang disarankan
              </p>
              <p className="mt-1 text-[13px] font-bold text-foreground">
                {persona.advice.suggestedMilestone.title}
              </p>
              <p className="mt-0.5 text-[11px] leading-5 text-foreground/55">
                {persona.advice.suggestedMilestone.reason}
              </p>
              <button
                onClick={handleDiscussCoach}
                className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-extrabold text-white shadow-md shadow-primary/30 transition hover:bg-primary/90 active:scale-95"
              >
                Diskusikan dengan Coach
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background/50 p-0.5">
            {[7, 14, 30].map((n) => (
              <button
                key={n}
                onClick={() => onWindowDaysChange(n)}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                  windowDays === n ? "bg-primary text-white" : "text-foreground/55 hover:text-foreground"
                }`}
              >
                {n}d
              </button>
            ))}
          </div>
          <p className="text-[10px] text-foreground/40">
            Generated {new Date(persona.generatedAt).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    </div>
  );
}
