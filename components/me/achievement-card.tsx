import type { Achievement } from "@/lib/types";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div
      className={`rounded-[24px] border border-[#e4e5f1] bg-white p-5 shadow-sm transition ${
        achievement.unlocked ? "" : "opacity-60"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#f8f9ff] text-2xl">
          {achievement.emoji}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#121221]">{achievement.title}</p>
          <p className="mt-1 text-[13px] text-[#6b7280]">{achievement.subtitle}</p>
        </div>
      </div>
      {!achievement.unlocked && (
        <div className="mt-4 rounded-2xl bg-[#f8f9ff] px-4 py-3 text-sm text-[#6b7280]">
          Locked badge
        </div>
      )}
    </div>
  );
}
