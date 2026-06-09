import type { Achievement } from "@/lib/types";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div className={`rounded-[18px] border ${achievement.unlocked ? "border-border bg-background" : "border-border bg-muted/80 backdrop-blur-xl"} p-4 shadow-card ${achievement.unlocked ? "" : "opacity-60"}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-surface text-2xl">
          {achievement.emoji}
        </div>
        <div>
          <p className="text-sm font-extrabold text-foreground">{achievement.title}</p>
          <p className="text-sm text-foreground/60">{achievement.subtitle}</p>
        </div>
      </div>
      {!achievement.unlocked && (
        <div className="mt-4 rounded-full bg-primary/10 px-3 py-2 text-xs font-extrabold text-primary">
          Locked
        </div>
      )}
    </div>
  );
}
