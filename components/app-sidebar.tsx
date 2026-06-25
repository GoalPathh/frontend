"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BarChart3,
  CheckCircle2,
  Cpu,
  Loader2,
  MessageSquarePlus,
  Pencil,
  Plus,
  Settings,
  Sparkles,
  Target,
  Trash2,
  UserCog,
} from "lucide-react";
import {
  coachSessionService,
  formatRelativeTime,
  type CoachSession,
} from "@/lib/coachSessionService";
import { userService } from "@/lib/userService";
import type { UserProfile } from "@/lib/types";

export type AppSection = "today" | "goals" | "progress" | "coach" | "me";

type AppSidebarProps = {
  active: AppSection;
  coachSessions?: boolean;
  className?: string;
  onNavigate?: () => void;
};

const mainMenu = [
  { key: "today", label: "Today", href: "/today", Icon: CheckCircle2 },
  { key: "goals", label: "Goals", href: "/goals", Icon: Target },
  { key: "progress", label: "Progress", href: "/progress", Icon: BarChart3 },
  { key: "coach", label: "Coach", href: "/coach", Icon: UserCog },
] as const;

function getProfileInitials(profile: UserProfile | null) {
  const source = profile?.name?.trim() || profile?.username?.trim() || "GoalPath User";
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppSidebar({
  active,
  coachSessions = false,
  className = "",
  onNavigate,
}: AppSidebarProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarBroken, setAvatarBroken] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void userService
      .getOverview()
      .then((overview) => {
        if (cancelled) return;
        setProfile(overview.profile);
        setAvatarBroken(false);
      })
      .catch(() => {
        if (cancelled) return;
        setProfile(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = profile?.name?.trim() || "GoalPath User";
  const profileSubtitle = profile?.username?.trim()
    ? `@${profile.username.trim()}`
    : profile
      ? `Level ${profile.level} • ${profile.xp.toLocaleString("id-ID")} XP`
      : "Account settings";
  const initials = getProfileInitials(profile);

  return (
    <aside
      className={`flex h-dvh w-[272px] shrink-0 flex-col border-r border-border bg-surface ${className}`}
    >
      <div className="px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold tracking-tight">GoalPath AI</h2>
            <p className="mt-0.5 text-xs font-semibold text-primary">
              {active === "coach" ? "Coach mode" : "Growth workspace"}
            </p>
          </div>
        </div>
      </div>

      <div className="border-y border-border px-4 py-5">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
          Main menu
        </p>
        <nav className="space-y-1" aria-label="Main navigation">
          {mainMenu.map(({ key, label, href, Icon }) => {
            const isActive = active === key;
            return (
              <a
                key={key}
                href={href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "text-foreground/60 hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{label}</span>
                {isActive && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
              </a>
            );
          })}
        </nav>
      </div>

      {coachSessions ? (
        <CoachSessionsPanel onNavigate={onNavigate} />
      ) : (
        <div className="flex-1 px-4 py-5">
          <div className="rounded-2xl border border-primary/15 bg-primary/8 p-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-bold">Keep moving forward</p>
            <p className="mt-1 text-xs font-medium leading-5 text-foreground/45">
              Small consistent actions build meaningful progress.
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-border p-4">
        <a
          href="/me"
          onClick={onNavigate}
          aria-current={active === "me" ? "page" : undefined}
          className={`flex items-center gap-3 rounded-2xl p-2 transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
            active === "me" ? "bg-primary/10" : "hover:bg-muted"
          }`}
        >
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 text-xs font-bold text-primary">
            {profile?.avatarUrl && !avatarBroken ? (
              <Image
                src={profile.avatarUrl}
                alt={displayName}
                fill
                sizes="40px"
                className="object-cover"
                onError={() => setAvatarBroken(true)}
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">{displayName}</span>
            <span className="block truncate text-[10px] font-medium text-foreground/45">
              {profileSubtitle}
            </span>
          </span>
          <Settings
            className={`h-4 w-4 ${active === "me" ? "text-primary" : "text-foreground/40"}`}
          />
        </a>
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
          onClick={handleNewSession}
          disabled={creating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface active:scale-[0.98] disabled:opacity-60"
        >
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {creating ? "Membuat..." : "New Session"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <div className="mb-2 flex items-center justify-between px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
            Recent chats
          </p>
          <span className="text-[10px] font-medium text-foreground/40">
            {sessions.length}
          </span>
        </div>

        {loading && sessions.length === 0 ? (
          <div className="flex items-center gap-2 px-3 py-4 text-[11px] text-foreground/55">
            <Loader2 className="h-3 w-3 animate-spin" /> Memuat...
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background/70 px-4 py-6 text-center">
            <MessageSquarePlus className="mx-auto mb-2 h-5 w-5 text-foreground/40" />
            <p className="text-[11px] font-medium leading-5 text-foreground/55">
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
                  className={`group relative flex items-center gap-3 rounded-xl border px-3 py-3 transition ${
                    isActive
                      ? "border-primary/15 bg-primary/10"
                      : "border-transparent hover:border-border hover:bg-muted"
                  }`}
                >
                  <a
                    href={`/coach?session=${s.id}`}
                    onClick={onNavigate}
                    className="flex min-w-0 flex-1 items-center gap-3"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                        isActive
                          ? "bg-surface text-primary shadow-sm"
                          : "bg-muted text-foreground/45 group-hover:text-primary"
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
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
                      <span className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-foreground/40">
                        <span>{formatRelativeTime(s.updated_at)}</span>
                        {typeof s.message_count === "number" && (
                          <>
                            <span className="size-1 rounded-full bg-foreground/20" />
                            <span>{s.message_count} pesan</span>
                          </>
                        )}
                      </span>
                    </span>
                  </a>
                  {!isEditing && (
                    <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleStartRename(s);
                        }}
                        className="flex size-6 items-center justify-center rounded-md text-foreground/45 transition hover:bg-primary/10 hover:text-primary"
                        aria-label="Rename session"
                        title="Rename"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setConfirmDelete(s);
                        }}
                        className="flex size-6 items-center justify-center rounded-md text-foreground/45 transition hover:bg-coral/10 hover:text-coral"
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
            onClick={onCancel}
            className="rounded-full border border-border bg-background px-4 py-2 text-xs font-bold text-foreground/65 hover:bg-muted hover:text-foreground"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 rounded-full bg-coral px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-coral/30 hover:bg-coral/90 active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
