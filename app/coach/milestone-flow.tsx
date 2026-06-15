"use client";

import { useEffect, useState } from "react";
import { MilestoneSuggestionBubble } from "./wizard-bubbles";
import type { SuggestedMilestone } from "@/lib/milestoneService";

interface Props {
  goalTitle: string;
  category?: string;
  duration?: string;
  habits: { title: string; difficulty?: string }[];
  initial: { title: string; target_date?: string }[];
  loader: (input: {
    goalTitle: string;
    category?: string;
    duration?: string;
    habits?: { title: string; difficulty?: string }[];
  }) => Promise<SuggestedMilestone[]>;
  onAccept: (list: { title: string; target_date?: string }[]) => void;
  onSkip: () => void;
  onCancel: () => void;
  onUpdateTitle: (idx: number, patch: { title?: string }) => void;
  onRemove: (idx: number) => void;
}

export function MilestoneFlow({
  goalTitle, category, duration, habits, initial, loader,
  onAccept, onSkip, onCancel, onUpdateTitle, onRemove,
}: Props) {
  const [loading, setLoading] = useState(initial.length === 0);
  const [list, setList] = useState<SuggestedMilestone[]>(initial);

  useEffect(() => {
    if (initial.length > 0) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await loader({
          goalTitle, category, duration,
          habits: habits.map((h) => ({ title: h.title, difficulty: h.difficulty })),
        });
        if (!cancelled) setList(result.slice(0, 5));
      } catch (e) {
        console.error("[MilestoneFlow] load failed:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <MilestoneSuggestionBubble
        suggestions={list}
        loading={loading}
        onAcceptAll={(final) => onAccept(final.map((m) => ({ ...m })))}
        onUpdateMilestone={(idx, patch) => {
          const next = [...list];
          next[idx] = { ...next[idx]!, ...patch };
          setList(next);
          onUpdateTitle(idx, patch);
        }}
        onRemoveMilestone={(idx) => {
          const next = list.filter((_, i) => i !== idx);
          setList(next);
          onRemove(idx);
        }}
        onSkip={() => onSkip()}
      />
      <div className="pl-14 max-w-[92%] sm:max-w-[85%]">
        <button
          onClick={() => onCancel()}
          className="text-[11px] font-bold text-foreground/55 hover:text-foreground"
        >
          ← Kembali ke jadwal
        </button>
      </div>
    </>
  );
}
