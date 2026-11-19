import type { Achievement } from "@/lib/types";
import { Award, Flame, Star, Target } from "lucide-react";

const achievementIcons = {
  "first-habit": Award,
  "streak-7": Flame,
  "consistency-30": Star,
  "goal-achiever": Target,
} as const;

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const Icon = achievementIcons[achievement.id as keyof typeof achievementIcons] ?? Award;

  return (
    <div className={`rounded-[18px] border ${achievement.unlocked ? "border-border bg-background" : "border-border bg-muted/80 backdrop-blur-xl"} p-4 shadow-card ${achievement.unlocked ? "" : "opacity-60"}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="h-5 w-5" />
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
