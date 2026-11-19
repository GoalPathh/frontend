"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { GoalDetailDialog, type GoalPreview } from "./goal-detail-dialog";
import type { Goal } from "@/lib/types";

type GoalDetailTriggerProps = {
  goalId: string;
  initialGoal?: Goal;
  preview?: GoalPreview;
  children: ReactNode;
  className?: string;
  onChanged?: () => void;
};

export function GoalDetailTrigger({ goalId, initialGoal, preview, children, className, onChanged }: GoalDetailTriggerProps) {
  const router = useRouter();
  const triggerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const handleChanged = useCallback(() => {
    if (onChanged) onChanged();
    else router.refresh();
  }, [onChanged, router]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setOpen(true);
  }

  return (
    <>
      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={`cursor-pointer rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className ?? ""}`}
      >
        {children}
      </div>
      {open && <GoalDetailDialog goalId={goalId} initialGoal={initialGoal} preview={preview} onClose={close} onChanged={handleChanged} />}
    </>
  );
}
