import type { Achievement } from "@/lib/types";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div className={`rounded-[28px] border ${achievement.unlocked ? "border-border bg-surface" : "border-border bg-muted/80 backdrop-blur-xl"} p-5 shadow-sm ${achievement.unlocked ? "" : "opacity-60"}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-muted text-2xl">
          {achievement.emoji}
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">{achievement.title}</p>
          <p className="text-sm text-foreground/60">{achievement.subtitle}</p>
        </div>
      </div>
      {!achievement.unlocked && (
        <div className="mt-4 rounded-2xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
          Locked
        </div>
      )}
    </div>
  );
}
