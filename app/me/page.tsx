import { User } from "lucide-react";

export default function MePage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#121221] pb-20">
      <div className="max-w-5xl mx-auto px-6 py-10 md:px-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <User className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9288F8] mb-1">Profile</p>
            <h1 className="text-4xl font-bold tracking-tight">Your personal space.</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#121221] mb-4">Account Overview</h2>
            <p className="text-sm text-[#6b7280] leading-7">
              Track your profile, membership status, and personal goal settings in one place.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#e4e5f1] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#121221] mb-4">Personal stats</h2>
            <div className="space-y-3 text-sm text-[#6b7280]">
              <p>Member since: Jan 2025</p>
              <p>Active goals: 3</p>
              <p>Daily streak: 5 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
