"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Loader2,
  Plus,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";
import type {
  GoalPeriod,
  GoalWizardDraft,
  WizardDay,
  WizardHabit,
  WizardStep,
} from "@/lib/types";

/* ───────────────────────────── DurationBubble ───────────────────────────── */

const DURATION_OPTIONS: Array<{ value: GoalPeriod; label: string; sub: string }> = [
  { value: "1month", label: "1 Bulan", sub: "Boost cepat" },
  { value: "3months", label: "3 Bulan", sub: "Default" },
  { value: "6months", label: "6 Bulan", sub: "Transformasi" },
  { value: "1year", label: "1 Tahun", sub: "Jangka panjang" },
];

export const WIZARD_STEPS: Array<{ id: string; label: string }> = [
  { id: "duration", label: "Durasi" },
  { id: "habits", label: "Kebiasaan" },
  { id: "schedule", label: "Jadwal" },
  { id: "milestones", label: "Milestone" },
  { id: "review", label: "Review" },
];

export function getStepIndex(step: WizardStep): number {
  if (step === "idle") return -1;
  return WIZARD_STEPS.findIndex((s) => s.id === step) + 1;
}

const BubbleShell = ({
  step,
  Icon,
  onCancel,
  children,
}: {
  step: WizardStep;
  Icon: any;
  onCancel?: () => void;
  children: React.ReactNode;
}) => {
  const idx = getStepIndex(step);
  const total = WIZARD_STEPS.length;
  return (
    <div className="flex max-w-[92%] items-start gap-2.5 animate-in fade-in slide-in-from-bottom-2 sm:max-w-md">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/20 sm:size-9">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-border bg-surface shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-primary/5 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-primary">
              Wizard Goal ✓
            </span>
            <span className="text-[10px] font-medium text-foreground/45">
              Step {idx} / {total}
            </span>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              aria-label="Tutup wizard"
              className="flex size-6 items-center justify-center rounded-md text-foreground/35 transition hover:bg-coral/10 hover:text-coral active:scale-95"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="px-3.5 py-3.5">{children}</div>
      </div>
    </div>
  );
};

export function DurationBubble({
  onPick,
  onCancel,
}: {
  onPick: (duration: GoalPeriod) => void;
  onCancel?: () => void;
}) {
  return (
    <BubbleShell step="duration" Icon={Clock} onCancel={onCancel}>
      <p className="mb-2.5 text-[13px] font-semibold leading-5 text-foreground">
        Berapa lama goal ini ingin kamu capai?
      </p>
      <div className="grid grid-cols-2 gap-2">
        {DURATION_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onPick(opt.value)}
            className="group flex flex-col items-start rounded-xl border border-border bg-background px-3 py-2 text-left transition hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
          >
            <span className="text-[13px] font-bold text-foreground">{opt.label}</span>
            <span className="text-[9px] font-medium uppercase tracking-wide text-foreground/50 group-hover:text-primary">
              {opt.sub}
            </span>
          </button>
        ))}
      </div>
    </BubbleShell>
  );
}

/* ───────────────────────────── HabitBubble ───────────────────────────── */

export function HabitBubble({
  habits,
  onAdd,
  onUpdate,
  onRemove,
  onNext,
  onCancel,
}: {
  habits: WizardHabit[];
  onAdd: () => void;
  onUpdate: (idx: number, patch: Partial<WizardHabit>) => void;
  onRemove: (idx: number) => void;
  onNext: () => void;
  onCancel?: () => void;
}) {
  const canContinue = habits.length > 0 && habits.every((h) => h.title.trim());

  return (
    <BubbleShell step="habits" Icon={Sparkles} onCancel={onCancel}>
      <p className="mb-2.5 text-[13px] font-semibold leading-5 text-foreground">
        Kebiasaan apa yang ingin kamu lakukan?
      </p>

      <div className="space-y-2.5">
        {habits.map((h, idx) => (
          <HabitEditor
            key={idx}
            habit={h}
            onChange={(patch) => onUpdate(idx, patch)}
            onRemove={() => onRemove(idx)}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={onAdd}
          disabled={habits.length >= 3}
          className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-bold text-primary transition hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah ({habits.length}/3)
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          Lanjut
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </BubbleShell>
  );
}

/* ───────────────────────────── HabitEditor ───────────────────────────── */

function HabitEditor({
  habit,
  onChange,
  onRemove,
}: {
  habit: WizardHabit;
  onChange: (patch: Partial<WizardHabit>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-start gap-2">
        <input
          type="text"
          placeholder='Misal: "Latihan 30 menit"'
          value={habit.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-foreground/35"
        />
        <button
          onClick={onRemove}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-foreground/40 transition hover:bg-coral/10 hover:text-coral"
          aria-label="Hapus kebiasaan"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-foreground/55">
        <span>{habit.duration} menit</span>
        <span>{habit.difficulty.toUpperCase()}</span>
      </div>
      <input
        type="range"
        min={5}
        max={60}
        step={5}
        value={habit.duration}
        onChange={(e) => onChange({ duration: Number(e.target.value) })}
        className="mt-1 w-full accent-primary"
      />

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {(["easy", "medium", "hard"] as const).map((d) => (
          <button
            key={d}
            onClick={() => onChange({ difficulty: d })}
            className={`rounded-lg px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
              habit.difficulty === d
                ? "bg-primary text-white"
                : "border border-border bg-background text-foreground/60 hover:border-primary/40"
            }`}
          >
            {d === "easy" ? "Mudah" : d === "medium" ? "Sedang" : "Sulit"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────── ScheduleBubble ───────────────────────────── */

const DAY_LABELS: Array<{ value: WizardDay; short: string }> = [
  { value: "mon", short: "Sen" },
  { value: "tue", short: "Sel" },
  { value: "wed", short: "Rab" },
  { value: "thu", short: "Kam" },
  { value: "fri", short: "Jum" },
  { value: "sat", short: "Sab" },
  { value: "sun", short: "Min" },
];

export function ScheduleBubble({
  activeDays,
  reminderTime,
  onToggleDay,
  onSetReminderTime,
  onNext,
  onCancel,
}: {
  activeDays: WizardDay[];
  reminderTime?: string;
  onToggleDay: (day: WizardDay) => void;
  onSetReminderTime: (t: string | undefined) => void;
  onNext: () => void;
  onCancel?: () => void;
}) {
  const [time, setTime] = useState(reminderTime ?? "08:00");
  const hasDays = activeDays.length > 0;

  return (
    <BubbleShell step="schedule" Icon={Target} onCancel={onCancel}>
      <p className="mb-2.5 text-[13px] font-semibold leading-5 text-foreground">
        Hari apa saja kamu ingin praktik?
      </p>

      <div className="grid grid-cols-7 gap-1.5">
        {DAY_LABELS.map(({ value, short }) => {
          const active = activeDays.includes(value);
          return (
            <button
              key={value}
              onClick={() => onToggleDay(value)}
              className={`flex h-10 items-center justify-center rounded-xl text-[10px] font-bold uppercase transition active:scale-95 ${
                active
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "border border-border bg-background text-foreground/55 hover:border-primary/40"
              }`}
            >
              {short}
            </button>
          );
        })}
      </div>

      {!hasDays && (
        <p className="mt-2 text-[10px] font-semibold text-coral">
          Pilih minimal 1 hari
        </p>
      )}

      <div className="mt-3">
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-foreground/55">
          Jam Pengingat (opsional)
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-[12px] font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={() => onSetReminderTime(time || undefined)}
            className="inline-flex items-center gap-1 rounded-xl border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-[11px] font-bold text-primary transition hover:bg-primary/10 active:scale-95"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Set
          </button>
          {reminderTime && (
            <button
              onClick={() => {
                onSetReminderTime(undefined);
                setTime("08:00");
              }}
              className="flex size-7 items-center justify-center rounded-xl text-foreground/40 hover:bg-coral/10 hover:text-coral"
              aria-label="Hapus jam"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {reminderTime && (
          <p className="mt-1 text-[10px] font-semibold text-foreground/55">
            Aktif: {reminderTime}
          </p>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={onNext}
          disabled={!hasDays}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          Review
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </BubbleShell>
  );
}

/* ───────────────────────────── ReviewBubble ───────────────────────────── */

const CATEGORY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "language", label: "Bahasa" },
  { value: "fitness", label: "Kebugaran" },
  { value: "skills", label: "Keterampilan" },
  { value: "creativity", label: "Kreativitas" },
  { value: "learning", label: "Pembelajaran" },
  { value: "other", label: "Lainnya" },
];

export function ReviewBubble({
  goalTitle,
  category,
  draft,
  onTitleChange,
  onCategoryChange,
  onConfirm,
  onBack,
  onCancel,
}: {
  goalTitle: string;
  category: string;
  draft: GoalWizardDraft;
  onTitleChange: (title: string) => void;
  onCategoryChange: (category: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="flex max-w-[92%] items-start gap-3 animate-in fade-in slide-in-from-bottom-2 sm:max-w-[85%]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 sm:size-10">
        <CheckCircle2 className="h-5 w-5" />
      </div>
      <div className="flex-1 rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-4 shadow-card">
        <p className="mb-3 text-sm font-semibold leading-6 text-foreground">
          Konfirmasi goal kamu
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-foreground/55">
              Judul Goal
            </label>
            <input
              type="text"
              placeholder='Misal: "Speak English 30 days"'
              value={goalTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="min-w-0 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground outline-none placeholder:text-foreground/35 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-foreground/55">
              Kategori
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORY_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => onCategoryChange(c.value)}
                  className={`rounded-lg px-2 py-1.5 text-[11px] font-bold transition ${
                    category === c.value
                      ? "bg-primary text-white"
                      : "border border-border bg-background text-foreground/60 hover:border-primary/40"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Row
            label="Durasi"
            value={draft.duration ? DURATION_OPTIONS.find((o) => o.value === draft.duration)?.label ?? draft.duration : "-"}
          />
          <div>
            <p className="text-foreground/55">Kebiasaan</p>
            <ul className="mt-1 space-y-1">
              {draft.habits.map((h, idx) => (
                <li key={idx} className="flex items-start gap-1.5 rounded-lg bg-background px-2 py-1.5">
                  <Flame className="mt-0.5 h-3 w-3 shrink-0 text-coral" />
                  <span className="font-semibold text-foreground">
                    {h.title} · {h.duration}m · {h.difficulty}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Row
            label="Hari"
            value={
              draft.schedule.activeDays.length === 0
                ? "-"
                : draft.schedule.activeDays
                    .map((d) => DAY_LABELS.find((x) => x.value === d)?.short)
                    .join(", ")
            }
          />
          {draft.schedule.reminderTime && (
            <Row label="Pengingat" value={draft.schedule.reminderTime} />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-xs font-bold text-foreground/55 hover:text-foreground"
            >
              ← Ubah jadwal
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-xs font-bold text-coral/80 hover:text-coral"
              >
                ✕ Batalkan
              </button>
            )}
          </div>
          <button
            onClick={onConfirm}
            disabled={!goalTitle.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="h-4 w-4" />
            Konfirmasi & Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── MilestoneSuggestionBubble ───────────────────────────── */

export function MilestoneSuggestionBubble({
  suggestions,
  loading,
  onAcceptAll,
  onUpdateMilestone,
  onRemoveMilestone,
  onSkip,
}: {
  suggestions: { title: string; target_date?: string }[];
  loading: boolean;
  onAcceptAll: (
    list: { title: string; target_date?: string }[],
  ) => void;
  onUpdateMilestone: (idx: number, patch: { title?: string }) => void;
  onRemoveMilestone: (idx: number) => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex max-w-[92%] items-start gap-3 animate-in fade-in slide-in-from-bottom-2 sm:max-w-[85%]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 sm:size-10">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="flex-1 rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-4 shadow-card">
        <p className="mb-1 text-sm font-semibold leading-6 text-foreground">
          Rekomendasi milestone Progress kamu
        </p>
        <p className="mb-3 text-[11px] font-medium leading-5 text-foreground/55">
          AI menyusun tonggak kecil yang bisa kamu tandai selesai secara bertahap. Selesaikan untuk menambah progress goal.
        </p>

        {loading && (
          <div className="flex items-center gap-2 py-2 text-foreground/60">
            <Loader2 className="h-4 w-4 animate-spin" />{" "}
            <span className="text-xs">Menyusun milestone…</span>
          </div>
        )}

        <div className="space-y-2">
          {suggestions.map((m, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary/70" />
              <input
                type="text"
                value={m.title}
                onChange={(e) => onUpdateMilestone(idx, { title: e.target.value })}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-foreground/35"
                placeholder="Milestone title"
              />
              <button
                onClick={() => onRemoveMilestone(idx)}
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-foreground/40 transition hover:bg-coral/10 hover:text-coral"
                aria-label="Hapus milestone"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {suggestions.length === 0 && !loading && (
          <p className="rounded-lg bg-background/70 px-3 py-2 text-[11px] text-foreground/55">
            Tidak ada milestone yang disarankan. Klik Lewati untuk lanjut.
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            onClick={onSkip}
            className="text-xs font-bold text-foreground/55 hover:text-foreground"
          >
            Lewati
          </button>
          <button
            onClick={() => onAcceptAll(suggestions)}
            disabled={suggestions.length === 0 || loading}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="h-4 w-4" />
            Simpan {suggestions.length > 0 ? `(${suggestions.length})` : ""} milestone
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-foreground/55">{label}</span>
      <span className="text-right font-bold text-foreground">{value || "-"}</span>
    </div>
  );
}

/* ───────────────────────────── WizardIntentBubble ───────────────────────────── */
// Shows up when LLM has called start_goal_wizard tool and provided prefill.
// User can click "Mulai Wizard" (proceeds with prefill) or "Batal" (closes wizard).

export interface WizardPrefill {
  hint: string | null;
  duration: "1month" | "3months" | "6months" | "1year" | null;
  category: string | null;
  title: string | null;
  habits: Array<{ title: string; difficulty?: string }>;
}

export function WizardIntentBubble({
  prefill,
  onAccept,
  onCancel,
}: {
  prefill: WizardPrefill;
  onAccept: () => void;
  onCancel: () => void;
}) {
  const chips: string[] = [];
  if (prefill.title) chips.push(prefill.title);
  if (prefill.category) chips.push(prefill.category);
  if (prefill.duration) chips.push(prefill.duration);
  if (prefill.habits?.length) chips.push(`${prefill.habits.length} kebiasaan`);

  return (
    <div className="flex max-w-[92%] items-start gap-3 animate-in fade-in slide-in-from-bottom-2 sm:max-w-[85%]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 sm:size-10">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="flex-1 rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-4 shadow-card">
        <p className="mb-1 text-sm font-semibold leading-6 text-foreground">
          Saya akan buka wizard goal untuk kamu
        </p>
        {prefill.hint && (
          <p className="mb-2 text-[12px] italic leading-5 text-foreground/70">
            “{prefill.hint}”
          </p>
        )}
        {chips.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {chips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
        <p className="mb-3 text-[11px] font-medium leading-5 text-foreground/55">
          Isi detail yang kurang di tiap langkahnya. Bisa dibatalkan dengan ketik "batal" atau klik tombol di bawah.
        </p>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onCancel()}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-foreground/65 transition hover:border-coral/40 hover:text-coral active:scale-95"
          >
            <X className="h-3.5 w-3.5" />
            Batalkan wizard
          </button>
          <button
            onClick={() => onAccept()}
            className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-[11px] font-extrabold text-white shadow-md shadow-primary/30 transition hover:bg-primary/90 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Mulai wizard
          </button>
        </div>
      </div>
    </div>
  );
}
