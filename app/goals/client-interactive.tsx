"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function GoalsInteractiveHeader() {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push("/goals/add")}
      className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-white transition-all hover:bg-primary/90 active:scale-95"
    >
      <Plus className="h-5 w-5" />
      <span className="hidden sm:inline">Add Goal</span>
    </button>
  );
}

export function AddGoalButton() {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push("/goals/add")}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0"
    >
      Add New Goal
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
      </svg>
    </button>
  );
}

export function CreateFirstGoalButton() {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push("/goals/add")}
      className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
    >
      Create Your First Goal
    </button>
  );
}
