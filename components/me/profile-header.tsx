import { Edit3, Flame, Sparkles, Trophy } from "lucide-react";
import type { UserProfile } from "@/lib/types";

interface ProfileHeaderProps {
  profile: UserProfile;
  onEdit: () => void;
}

export function ProfileHeader({ profile, onEdit }: ProfileHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-border bg-surface p-6 shadow-sm">
      <div className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[0.9fr_0.5fr] items-center">
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-[28px] border border-border bg-primary/10 shadow-sm">
            <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Profile</p>
            <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
            <p className="mt-1 text-sm text-foreground/60">{profile.username}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] font-semibold text-foreground">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-primary shadow-sm">
                <Trophy className="h-4 w-4" /> Level {profile.level}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] px-3 py-2 text-[#2563eb] shadow-sm">
                <Sparkles className="h-4 w-4" /> {profile.xp.toLocaleString()} XP
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#dcfce7] px-3 py-2 text-[#15803d] shadow-sm">
                <Flame className="h-4 w-4" /> {profile.streakDays} Days
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
        >
          <Edit3 className="h-4 w-4" />
          Edit Profile
        </button>
      </div>
    </section>
  );
}
