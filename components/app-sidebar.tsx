"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BarChart3,
  CheckCircle2,
  Loader2,
  MessageSquare,
  MessageSquarePlus,
  Pencil,
  Plus,
  Target,
  Trash2,
  UserCog,
} from "lucide-react";
import {
  coachSessionService,
  formatRelativeTime,
  type CoachSession,
} from "@/lib/coachSessionService";
import { UserAvatar } from "@/components/user-avatar";
import { BrandLogo } from "@/components/brand-logo";
import { IntentLink } from "@/components/intent-link";
import { USER_PROFILE_EVENT, userService } from "@/lib/userService";
import type { UserProfile } from "@/lib/types";

export type AppSection = "today" | "goals" | "progress" | "coach" | "me" | "pricing";

type AppSidebarProps = {
  active: AppSection;
  coachSessions?: boolean;
  className?: string;
  onNavigate?: () => void;
  prefetchTodayGoals?: boolean;
};

const mainMenu = [
  { key: "today", label: "Today", href: "/today", Icon: CheckCircle2 },
  { key: "goals", label: "Goals", href: "/goals", Icon: Target },
  { key: "progress", label: "Progress", href: "/progress", Icon: BarChart3 },
  { key: "coach", label: "Coach", href: "/coach", Icon: UserCog },
] as const;

export function AppSidebar({
  active,
  coachSessions = false,
  className = "",
  onNavigate,
  prefetchTodayGoals = true,
}: AppSidebarProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    const updateProfile = (event: Event) => {
      setProfile((event as CustomEvent<UserProfile | null>).detail);
    };
    window.addEventListener(USER_PROFILE_EVENT, updateProfile);
    void userService.getProfile().then((value) => {
      if (!cancelled) setProfile(value);
    }).catch(() => {
      if (!cancelled) setProfile(null);
    });
    return () => {
      cancelled = true;
      window.removeEventListener(USER_PROFILE_EVENT, updateProfile);
    };
  }, []);

  const displayName = profile?.name?.trim() || "GoalPath User";
  const profileSubtitle = profile?.username?.trim()
    ? `@${profile.username.trim()}`
    : profile
      ? `Level ${profile.level} • ${profile.xp.toLocaleString("id-ID")} XP`
      : "Account settings";

  return (
    <aside
      className={`flex h-dvh w-[272px] shrink-0 flex-col border-r border-primary-soft/40 bg-background ${className}`}
    >
      <div className="px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <BrandLogo size={40} priority />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold tracking-tight">GoalPath AI</h2>
            <p className="mt-0.5 text-xs font-semibold text-primary">
              {active === "coach" ? "Coach mode" : "Growth workspace"}
            </p>
          </div>
        </div>
      </div>

      <div className="border-y border-primary-soft/40 px-4 py-5">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/70">
          Main menu
        </p>
        <nav className="space-y-1" aria-label="Main navigation">
          {mainMenu.map(({ key, label, href, Icon }) => {
            const isActive = active === key;
            return (
              <IntentLink
                key={key}
                href={href}
                prefetch={prefetchTodayGoals && (
                  (active === "today" && key === "goals") ||
                  (active === "goals" && key === "today")
                )}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-primary-soft/20 motion-reduce:transition-none ${
                  isActive
                  ? "bg-primary/10 font-bold text-primary"
                  : "text-foreground/70 hover:bg-primary-soft/15 hover:text-foreground"
                }`}
              >
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                <span>{label}</span>
                {isActive && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
              </IntentLink>
            );
          })}
        </nav>
      </div>

      {coachSessions ? (
        <CoachSessionsPanel onNavigate={onNavigate} />
      ) : (
        <div className="flex-1 px-4 py-5">
          <div className="rounded-2xl border border-primary-soft/40 bg-primary-soft/10 p-4">
            <Target aria-hidden="true" className="size-5 text-primary" />
            <p className="mt-3 text-sm font-bold">Keep moving forward</p>
            <p className="mt-1 text-xs font-medium leading-5 text-foreground/70">
              Small consistent actions build meaningful progress.
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-primary-soft/40 p-4">
        <IntentLink
          href="/profile"
          onClick={onNavigate}
          aria-current={active === "me" ? "page" : undefined}
          className={`flex min-h-14 items-center gap-3 rounded-2xl p-2 transition hover:bg-primary-soft/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${active === "me" ? "bg-primary/10" : ""}`}
        >
          <UserAvatar
            avatarUrl={profile?.avatarUrl}
            name={displayName}
            className="size-10"
            imageSizes="40px"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">{displayName}</span>
            <span className="block truncate text-[10px] font-medium text-foreground/70">
              {profileSubtitle}
            </span>
          </span>
        </IntentLink>
      </div>
    </aside>
  );
}

/* ───────────────────────────── Coach Sessions Panel ───────────────────────────── */

function CoachSessionsPanel({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSessionId = searchParams.get("session");

  const [sessions, setSessions] = useState<CoachSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<CoachSession | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(
    () =>
      coachSessionService.list().then((rows) => {
        setSessions(rows);
        setLoading(false);
      }),
    [],
  );

  useEffect(() => {
    void refresh();
    const onFocus = () => void refresh();
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
      return () => window.removeEventListener("focus", onFocus);
    }
  }, [refresh]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleNewSession = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const session = await coachSessionService.create();
      if (session) {
        setSessions((prev) => [session, ...prev]);
        router.push(`/coach?session=${session.id}`);
        onNavigate?.();
      }
    } finally {
      setCreating(false);
    }
  };

  const handleStartRename = (s: CoachSession) => {
    setEditingId(s.id);
    setEditValue(s.title);
  };

  const handleCommitRename = async () => {
    if (!editingId) return;
    const target = editingId;
    const newTitle = editValue.trim();
    // Cancel if empty / unchanged
    const original = sessions.find((s) => s.id === target);
    if (!original || newTitle === original.title || newTitle.length < 1) {
      setEditingId(null);
      return;
    }
    // Optimistic
    setSessions((prev) => prev.map((s) => (s.id === target ? { ...s, title: newTitle } : s)));
    const updated = await coachSessionService.rename(target, newTitle);
    if (!updated) {
      // Revert
      setSessions((prev) => prev.map((s) => (s.id === target ? original : s)));
    }
    setEditingId(null);
  };

  const handleDelete = async (s: CoachSession) => {
    const original = sessions;
    setSessions((prev) => prev.filter((x) => x.id !== s.id));
    const ok = await coachSessionService.remove(s.id);
    if (!ok) {
      // Revert
      setSessions(original);
    }
    setConfirmDelete(null);
    // If deleting the active session, navigate user back to /coach (auto-picks latest)
    if (activeSessionId === s.id) {
      router.push("/coach");
    }
  };

  const sortedSessions = useMemo(() => sessions, [sessions]);

  return (
    <>
      <div className="px-4 py-5">
        <button
          type="button"
          onClick={handleNewSession}
          disabled={creating}
          className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
        >
          {creating ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 motion-safe:animate-spin" />
          ) : (
            <Plus aria-hidden="true" className="h-4 w-4" />
          )}
          {creating ? "Membuat..." : "New Session"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <div className="mb-2 flex items-center justify-between px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/70">
            Recent chats
          </p>
          <span className="text-[10px] font-medium text-foreground/70">
            {sessions.length}
          </span>
        </div>

        {loading && sessions.length === 0 ? (
          <div className="flex items-center gap-2 px-3 py-4 text-[11px] text-foreground/70">
            <Loader2 aria-hidden="true" className="h-3 w-3 motion-safe:animate-spin" /> Memuat...
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-primary-soft/40 bg-background px-4 py-6 text-center">
            <MessageSquarePlus aria-hidden="true" className="mx-auto mb-2 h-5 w-5 text-foreground/70" />
            <p className="text-[11px] font-medium leading-5 text-foreground/70">
              Belum ada sesi. Klik &quot;New Session&quot; untuk mulai chat baru.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {sortedSessions.map((s) => {
              const isActive = activeSessionId === s.id;
              const isEditing = editingId === s.id;
              return (
                <div
                  key={s.id}
                  className={`group relative flex items-center gap-3 rounded-xl border px-3 py-3 transition active:bg-primary-soft/20 motion-reduce:transition-none ${
                    isActive
                      ? "border-primary-soft/40 bg-primary-soft/10"
                      : "border-transparent hover:border-primary-soft/40 hover:bg-primary-soft/10"
                  }`}
                >
                  <Link
                    href={`/coach?session=${s.id}`}
                    onClick={onNavigate}
                    className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                        isActive
                          ? "bg-background text-primary shadow-sm"
                          : "bg-primary-soft/15 text-foreground/70 group-hover:text-primary"
                      }`}
                    >
                      <MessageSquare aria-hidden="true" className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      {isEditing ? (
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editValue}
                          maxLength={120}
                          onChange={(e) => setEditValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") void handleCommitRename();
                            if (e.key === "Escape") setEditingId(null);
                            e.stopPropagation();
                          }}
                          onBlur={() => void handleCommitRename()}
                          className="w-full rounded-md border border-primary/40 bg-background px-1.5 py-0.5 text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      ) : (
                        <span className="block truncate text-xs font-bold text-foreground">
                          {s.title || "Untitled"}
                        </span>
                      )}
                      <span className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-foreground/70">
                        <span>{formatRelativeTime(s.updated_at)}</span>
                        {typeof s.message_count === "number" && (
                          <>
                            <span className="size-1 rounded-full bg-foreground/20" />
                            <span>{s.message_count} pesan</span>
                          </>
                        )}
                      </span>
                    </span>
                  </Link>
                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-100 transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none sm:opacity-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleStartRename(s);
                        }}
                        className="flex size-11 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition hover:bg-primary-soft/15 hover:text-primary active:bg-primary-soft/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                        aria-label="Rename session"
                        title="Rename"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setConfirmDelete(s);
                        }}
                        className="flex size-11 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition hover:bg-coral/10 hover:text-coral active:bg-coral/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                        aria-label="Delete session"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirmDelete && (
        <DeleteConfirmDialog
          session={confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete)}
        />
      )}
    </>
  );
}

function DeleteConfirmDialog({
  session,
  onCancel,
  onConfirm,
}: {
  session: CoachSession;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-coral/10 text-coral">
            <Trash2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-foreground">Hapus sesi chat?</h3>
            <p className="mt-1 text-sm leading-6 text-foreground/65">
              Sesi{" "}
              <strong className="text-foreground">
                &quot;{session.title || "Untitled"}&quot;
              </strong>{" "}
              akan dihapus permanen. Pesan dan histori tidak dapat dipulihkan.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 cursor-pointer rounded-full border border-primary-soft/40 bg-background px-4 py-2 text-xs font-bold text-foreground/80 transition hover:bg-primary-soft/15 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full bg-coral px-4 py-2 text-xs font-extrabold text-white shadow-md transition hover:bg-coral/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
