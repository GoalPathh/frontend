import type { Achievement } from "@/lib/types";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div
      className={`rounded-[24px] border border-border bg-surface p-5 shadow-sm transition ${
        achievement.unlocked ? "" : "opacity-60"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-background text-2xl">
          {achievement.emoji}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{achievement.title}</p>
          <p className="mt-1 text-[13px] text-foreground/60">{achievement.subtitle}</p>
        </div>
      </div>
      {!achievement.unlocked && (
        <div className="mt-4 rounded-2xl bg-background px-4 py-3 text-sm text-foreground/60">
          Locked badge
        </div>
      )}
    </div>
  );
}
