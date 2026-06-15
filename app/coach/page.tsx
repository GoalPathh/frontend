"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Cpu,
  Flame,
  Menu,
  Mic,
  MoreHorizontal,
  Paperclip,
  Send,
  Sparkles,
  Target,
  X,
  Loader2,
  MessageSquarePlus
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { ApiError, apiRequest, hasAuthSession } from "@/lib/api";
import {
  DurationBubble,
  HabitBubble,
  ScheduleBubble,
  ReviewBubble,
  MilestoneSuggestionBubble,
  WizardIntentBubble,
  type WizardPrefill,
} from "./wizard-bubbles";
import {
  buildWizardMessageContent,
  useGoalWizard,
} from "./use-goal-wizard";
import type { SuggestedMilestone } from "@/lib/milestoneService";
import { milestoneService } from "@/lib/milestoneService";
import { MilestoneFlow } from "./milestone-flow";

const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB2w4bl-LhdQY2a24NLuM-SKFio6jOZlAkPV4x2D654Th6P_tKpcS_zKUNhcVMJuqEuEbBovvJqkqijZBXF8idVU7g9_22yyjGk0NokMNfm2gMjCWFotmgA9uG4y69LevHyu-WK7YFRqyizIrKIPpfr-B5tis939-TUQ-ZaLEnUrzRUvTeQ6Kk_l9wnzFUBaC5jmf5iwnjT_JRHEgP_vj0Rxn_olwLhLPrNnWmNI1TxUJmiEehIl8uuWRvg5GwBrgZ4skhtuKuo7jvS6p0beDH";

const insightItems = [
  { title: "Today's Goal", Icon: Target },
  { title: "Streak", Icon: Flame },
  { title: "Suggested Micro Habit", Icon: Sparkles },
] as const;

function CoachMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-[92%] items-start gap-3 sm:max-w-[85%]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 sm:size-10">
        <Cpu className="h-5 w-5" />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3.5 text-sm font-medium leading-6 shadow-sm sm:px-5 sm:py-4 sm:text-[15px] sm:leading-7 whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}

function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-end justify-end gap-3">
      <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-primary px-4 py-3.5 text-sm font-semibold leading-6 text-white shadow-md shadow-primary/20 sm:px-5 sm:py-4 sm:text-[15px] whitespace-pre-wrap">
        {children}
      </div>
      <img src={profileImage} alt="User" className="size-9 rounded-full border border-border object-cover sm:size-10" />
    </div>
  );
}

function InsightsPanel() {
  return (
    <aside className="hidden w-64 shrink-0 2xl:block">
      <div className="sticky top-24 rounded-3xl border border-border bg-surface/80 p-4 shadow-card backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2 px-1">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">Coach insights</h2>
        </div>
        <div className="space-y-2">
          {insightItems.map(({ title, Icon }) => (
            <div key={title} className="rounded-2xl border border-border bg-background/70 p-3">
              <div className="flex items-center gap-2 text-foreground/60">
                <Icon className="h-4 w-4 text-primary" />
                <p className="text-xs font-bold">{title}</p>
              </div>
              <p className="mt-2 text-[11px] font-medium leading-5 text-foreground/40">Syncing with AI...</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

interface BaseMessage { id: string; content: string; }
interface Message extends BaseMessage {
  role: "user" | "assistant";
}
interface IntentMessage extends BaseMessage {
  role: "wizard_intent";
  prefill: WizardPrefill;
}
type AnyMessage = Message | IntentMessage;

/**
 * Parse assistant reply for [wizard_started]<json> tag emitted when LLM calls
 * start_goal_wizard tool. Strip the tag from display text but expose the
 * structured prefill payload so the frontend can render WizardIntentBubble inline.
 */
function stripAssistantTags(raw: string): { displayText: string; wizardPrefill: WizardPrefill | null } {
  if (!raw) return { displayText: "", wizardPrefill: null };
  const tagRe = /^\[wizard_started\]\s*([\s\S]*?)(?:\n\n|$)/;
  const m = raw.match(tagRe);
  if (!m) return { displayText: raw.trim(), wizardPrefill: null };
  let prefill: WizardPrefill | null = null;
  try {
    prefill = JSON.parse(m[1]!.trim()) as WizardPrefill;
  } catch {
    console.warn("[stripAssistantTags] Failed to parse wizard prefill");
  }
  const displayText = raw.replace(tagRe, "").trim();
  // If LLM also sent [UI_DATA: ...] followed by conversational text after our tag, keep both minus tags
  const cleaned = displayText.replace(/\[UI_DATA:[^\]]*\]/g, "").trim();
  return { displayText: cleaned, wizardPrefill: prefill };
}

function CoachPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState<AnyMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [wizardMeta, setWizardMeta] = useState<{ title: string; category: string; habitTitle: string }>({ title: "", category: "other", habitTitle: "" });
  const wizard = useGoalWizard();
  const cancelWizardCallback = () => {
    wizard.cancelWizard();
    setWizardMeta({ title: "", category: "other", habitTitle: "" });
  };
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, wizard.draft.step]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function loadOrCreateSession() {
      if (!hasAuthSession()) {
        router.replace("/login?next=/coach");
        return;
      }

      try {
        let sid: string | null = null;
        
        // Fetch sessions
        const sessions = await apiRequest<any[]>("/coach/sessions");
        if (sessions && sessions.length > 0) {
          sid = sessions[0].id;
        } else {
          // Create new session
          const newSession = await apiRequest<any>("/coach/sessions", {
            method: "POST",
            body: JSON.stringify({ title: "Goal Planning" })
          });
          sid = newSession.id;
        }
        setSessionId(sid);

        if (sid) {
          const hist = await apiRequest<any[]>(`/coach/sessions/${sid}/messages`);
          setMessages(hist.map((m) => ({ id: m.id, role: m.role, content: m.content })));

          // Handle intent query parameter
          const intent = searchParams.get("intent");
          if (intent === "create_goal" && hist.length === 0) {
            handleSendMessage("I want to create a new goal. Can you help me brainstorm some habits?", sid);
          }
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/login?next=/coach");
          return;
        }
        console.error("Failed to load coach session", err);
      }
    }

    loadOrCreateSession();
  }, [router, searchParams]);

  async function handleSendMessage(overrideInput?: string, overrideSessionId?: string) {
    const textToSend = overrideInput ?? input;
    if (!textToSend.trim()) return;

    const currentSessionId = overrideSessionId ?? sessionId;
    if (!currentSessionId) return;

    // ── Cancel wizard via chat (button + chat work; same hook) ──
    if (wizard.draft.step !== "idle" && wizard.isCancelMessage(textToSend)) {
      wizard.cancelWizard();
      setWizardMeta({ title: "", category: "other", habitTitle: "" });
      const cancelMsg: Message = { id: `cancel-${Date.now()}`, role: "user", content: textToSend };
      setMessages((prev) => [...prev, cancelMsg, {
        id: `cancel-resp-${Date.now()}`,
        role: "assistant",
        content: "Siap, wizard saya tutup. Mau mulai baru dengan cara lain?",
      }]);
      if (!overrideInput) setInput("");
      return;
    }

    const newMsg: Message = { id: Date.now().toString(), role: "user", content: textToSend };
    // Optimistic UI update
    setMessages((prev) => [...prev, newMsg]);
    if (!overrideInput) setInput("");
    setIsLoading(true);

    try {
      const responseMsg = await apiRequest<any>(`/coach/sessions/${currentSessionId}/messages`, {
        method: "POST",
        body: JSON.stringify({ role: "user", content: textToSend })
      });
      
      setMessages((prev) => [
        ...prev, 
        { 
          id: responseMsg.id || Date.now().toString(), 
          role: responseMsg.role || "assistant", 
          // Strip out <think> blocks in case any leaked through the backend
          content: (responseMsg.content || "I've updated your goals based on your request!").replace(/<think>[\s\S]*?<\/think>/gi, "").trim()
        }
      ]);
    } catch (err) {
      console.error("Failed to send message", err);
      // Revert optimistic update on failure to prevent UI/DB desync
      setMessages((prev) => prev.filter(m => m.id !== newMsg.id));
    } finally {
      setIsLoading(false);
    }
  }

  // ── Goal Wizard submit (called from each wizard step's confirm button) ──
  async function submitGoal() {
    if (!sessionId) return;
    const finalTitle = wizardMeta.title.trim();
    if (!finalTitle) return;

    const payload = {
      title: finalTitle,
      category: wizardMeta.category,
      duration: wizard.draft.duration,
      habits: wizard.draft.habits.map((h) => ({
        title: h.title,
        difficulty: h.difficulty,
        duration_minutes: h.duration,
      })),
      schedule: {
        activeDays: wizard.draft.schedule.activeDays,
        reminderTime: wizard.draft.schedule.reminderTime,
      },
      notifications: wizard.draft.notifications,
      milestones: wizard.draft.milestones,
    };

    const enrichedContent = `[goal_finalized] ${JSON.stringify(payload)}`;
    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: "Saya konfirmasi goal: " + finalTitle,
    };
    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);
    try {
      const responseMsg = await apiRequest<any>(
        `/coach/sessions/${sessionId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ role: "user", content: enrichedContent }),
        }
      );
      setMessages((prev) => [
        ...prev,
        {
          id: responseMsg.id || `${Date.now()}-assistant`,
          role: responseMsg.role || "assistant",
          content: (responseMsg.content || "Goal berhasil dibuat! 🎉")
            .replace(/<think>[\s\S]*?<\/think>/gi, "")
            .trim(),
        },
      ]);
      wizard.resetWizard();
      setWizardMeta({ title: "", category: "other", habitTitle: "" });
    } catch (err) {
      console.error("Wizard submit failed", err);
      setMessages((prev) => prev.filter((m) => m.id !== newMsg.id));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-dvh max-w-full overflow-hidden bg-background text-foreground dark:bg-background dark:text-white">
      <AppSidebar active="coach" coachSessions className="hidden lg:flex" />

      {showHistory && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
            aria-label="Close chat history"
          />
          <div className="relative h-full w-[min(86vw,320px)] shadow-2xl">
            <button
              onClick={() => setShowHistory(false)}
              className="absolute right-4 top-5 z-10 rounded-xl p-2 text-foreground/50 transition hover:bg-muted hover:text-primary"
              aria-label="Close chat history"
            >
              <X className="h-5 w-5" />
            </button>
            <AppSidebar
              active="coach"
              coachSessions
              className="w-full"
              onNavigate={() => setShowHistory(false)}
            />
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 border-b border-border bg-surface/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setShowHistory(true)}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-primary transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30 lg:hidden"
                aria-label="Open chat history"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">Coach</h1>
                  <span className="hidden rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-primary sm:inline">
                    AI assistant
                  </span>
                </div>
                <p className="truncate text-[11px] font-medium text-foreground/45 sm:text-xs">
                  Your personal growth assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <ThemeToggle className="size-10 bg-background dark:bg-surface/10" />
              <button
                className="flex size-10 items-center justify-center rounded-xl text-foreground/45 transition hover:bg-muted hover:text-primary"
                aria-label="Coach options"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 justify-center gap-6 overflow-hidden px-0 2xl:px-6">
          <div className="flex min-w-0 max-w-[860px] flex-1 flex-col">
            <section className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 scroll-smooth" aria-label="Coach conversation">
              <div className="space-y-7">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/35">AI Coaching Session</span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                {messages.length === 0 && !isLoading && (
                  <CoachMessage>
                    Hi! I'm your AI Coach. I can help you set up new goals, track your progress, or suggest habits based on your historical data. What's on your mind today?
                  </CoachMessage>
                )}

                {messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.role === "assistant" ? (
                      <>
                        <CoachMessage>
                          {stripAssistantTags(msg.content).displayText}
                        </CoachMessage>
                        {stripAssistantTags(msg.content).wizardPrefill && (
                          <WizardIntentBubble
                            prefill={stripAssistantTags(msg.content).wizardPrefill!}
                            onAccept={(...args: unknown[]) => {
                              const p = stripAssistantTags(msg.content).wizardPrefill!;
                              if (p.category) {
                                setWizardMeta((m) => ({ ...m, category: p.category! }));
                              }
                              if (p.title) {
                                setWizardMeta((m) => ({ ...m, title: p.title! }));
                              }
                              wizard.startWizard(p);
                            }}
                            onCancel={() => {
                              wizard.cancelWizard();
                              setWizardMeta({ title: "", category: "other", habitTitle: "" });
                            }}
                          />
                        )}
                      </>
                    ) : msg.role === "wizard_intent" ? (
                      <WizardIntentBubble
                        prefill={msg.prefill}
                        onAccept={() => {
                          if (msg.prefill.category) {
                            setWizardMeta((m) => ({ ...m, category: msg.prefill.category! }));
                          }
                          if (msg.prefill.title) {
                            setWizardMeta((m) => ({ ...m, title: msg.prefill.title! }));
                          }
                          wizard.startWizard(msg.prefill);
                        }}
                        onCancel={() => wizard.cancelWizard()}
                      />
                    ) : (
                      <UserMessage>{msg.content}</UserMessage>
                    )}
                  </div>
                ))}

                {wizard.draft.step !== "idle" && (
                  <div role="region" aria-label="Wizard goal" className="mx-auto w-full max-w-xl py-1">
                    {wizard.draft.step === "duration" && (
                      <DurationBubble onPick={wizard.setDuration} onCancel={cancelWizardCallback} />
                    )}
                    {wizard.draft.step === "habits" && (
                      <HabitBubble
                        habits={wizard.draft.habits}
                        onAdd={wizard.addHabit}
                        onUpdate={wizard.updateHabit}
                        onRemove={wizard.removeHabit}
                        onNext={wizard.goToSchedule}
                        onCancel={cancelWizardCallback}
                      />
                    )}
                    {wizard.draft.step === "schedule" && (
                      <ScheduleBubble
                        activeDays={wizard.draft.schedule.activeDays}
                        reminderTime={wizard.draft.schedule.reminderTime}
                        onToggleDay={wizard.toggleDay}
                        onSetReminderTime={wizard.setReminderTime}
                        onNext={wizard.goToMilestones}
                        onCancel={cancelWizardCallback}
                      />
                    )}
                    {wizard.draft.step === "milestones" && (
                      <MilestoneFlow
                        goalTitle={wizardMeta.title || wizard.draft.habits[0]?.title || "Goal"}
                        category={wizardMeta.category}
                        duration={wizard.draft.duration}
                        habits={wizard.draft.habits}
                        initial={wizard.draft.milestones}
                        loader={async (input) => {
                          const result = await milestoneService.suggest(input);
                          return result.milestones;
                        }}
                        onAccept={(list) => {
                          wizard.setMilestones(list);
                          wizard.goToReview();
                        }}
                        onSkip={() => {
                          wizard.setMilestones([]);
                          wizard.goToReview();
                        }}
                        onCancel={cancelWizardCallback}
                        onUpdateTitle={(idx, patch) => wizard.updateMilestone(idx, patch)}
                        onRemove={(idx) => wizard.removeMilestone(idx)}
                      />
                    )}
                    {wizard.draft.step === "review" && (
                      <ReviewBubble
                        goalTitle={wizardMeta.title}
                        category={wizardMeta.category}
                        draft={wizard.draft}
                        onTitleChange={(title) => setWizardMeta((m) => ({ ...m, title }))}
                        onCategoryChange={(category) => setWizardMeta((m) => ({ ...m, category }))}
                        onBack={() => wizard.setStep("schedule")}
                        onCancel={cancelWizardCallback}
                        onConfirm={submitGoal}
                      />
                    )}
                  </div>
                )}

                {/* Trigger button when wizard idle */}
                {wizard.draft.step === "idle" && messages.length > 0 && !isLoading && (
                  <div className="flex max-w-[92%] items-start gap-3 sm:max-w-[85%]">
                    <button
                      onClick={() => {
                        setWizardMeta({ title: "", category: "other", habitTitle: "" });
                        wizard.startWizard();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary/10 active:scale-95"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Setup goal baru dengan wizard
                    </button>
                  </div>
                )}

                {isLoading && (
                  <CoachMessage>
                    <div className="flex items-center gap-2 text-foreground/60">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </CoachMessage>
                )}

                <div ref={bottomRef} />
              </div>
            </section>

            <footer className="shrink-0 border-t border-border bg-background/95 px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:px-6 lg:pb-5">
              <div className="rounded-2xl border border-border bg-surface p-2 shadow-card focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
                <div className="flex items-center gap-1">
                  <button
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl text-foreground/45 transition hover:bg-muted hover:text-primary"
                    aria-label="Use microphone"
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Tell me what's on your mind..."
                    className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm font-medium text-foreground outline-none placeholder:text-foreground/35"
                    disabled={isLoading}
                  />
                  <button
                    className="hidden size-10 shrink-0 items-center justify-center rounded-xl text-foreground/45 transition hover:bg-muted hover:text-primary sm:flex"
                    aria-label="Attach a file"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95 disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-center text-[9px] font-semibold tracking-wide text-foreground/35">
                GoalPath AI can make mistakes. Check important info.
              </p>
            </footer>
          </div>

          <InsightsPanel />
        </div>

        <div className="lg:hidden">
          <BottomNavigation active="coach" />
        </div>

        {/* ── Goal Wizard bubbles (re-rendered inline per step) ── */}
        {false && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/15 px-3 pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-20 backdrop-blur-[2px] sm:px-5 lg:left-[272px] lg:items-center lg:p-8">
            <button
              type="button"
              className="absolute inset-0 cursor-default"
              onClick={cancelWizardCallback}
              aria-label="Tutup wizard goal"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Wizard goal"
              className="relative z-10 w-full max-w-xl overflow-y-auto overscroll-contain rounded-[24px] bg-transparent shadow-2xl [max-height:min(76dvh,720px)] lg:[max-height:min(86dvh,760px)]"
            >
            {wizard.draft.step === "duration" && (
              <DurationBubble
                onPick={wizard.setDuration}
                onCancel={cancelWizardCallback}
              />
            )}
            {wizard.draft.step === "habits" && (
              <HabitBubble
                habits={wizard.draft.habits}
                onAdd={wizard.addHabit}
                onUpdate={wizard.updateHabit}
                onRemove={wizard.removeHabit}
                onNext={wizard.goToSchedule}
                onCancel={cancelWizardCallback}
              />
            )}
            {wizard.draft.step === "schedule" && (
              <ScheduleBubble
                activeDays={wizard.draft.schedule.activeDays}
                reminderTime={wizard.draft.schedule.reminderTime}
                onToggleDay={wizard.toggleDay}
                onSetReminderTime={wizard.setReminderTime}
                onNext={wizard.goToMilestones}
                onCancel={cancelWizardCallback}
              />
            )}
            {wizard.draft.step === "milestones" && (
              <MilestoneFlow
                goalTitle={wizardMeta.title || wizard.draft.habits[0]?.title || "Goal"}
                category={wizardMeta.category}
                duration={wizard.draft.duration}
                habits={wizard.draft.habits}
                initial={wizard.draft.milestones}
                loader={async (input) => {
                  const result = await milestoneService.suggest(input);
                  return result.milestones;
                }}
                onAccept={(list) => {
                  wizard.setMilestones(list);
                  wizard.goToReview();
                }}
                onSkip={() => {
                  wizard.setMilestones([]);
                  wizard.goToReview();
                }}
                onCancel={() => cancelWizardCallback()}
                onUpdateTitle={(idx, patch) => wizard.updateMilestone(idx, patch)}
                onRemove={(idx) => wizard.removeMilestone(idx)}
              />
            )}
            {wizard.draft.step === "review" && (
              <ReviewBubble
                goalTitle={wizardMeta.title}
                category={wizardMeta.category}
                draft={wizard.draft}
                onTitleChange={(title) => setWizardMeta((m) => ({ ...m, title }))}
                onCategoryChange={(category) => setWizardMeta((m) => ({ ...m, category }))}
                onBack={() => wizard.setStep("schedule")}
                onCancel={() => cancelWizardCallback()}
                onConfirm={() => {
                  if (!sessionId) return;
                  const finalTitle = wizardMeta.title.trim();
                  if (!finalTitle) return;
                  const payload: any = {
                    title: finalTitle,
                    category: wizardMeta.category,
                    duration: wizard.draft.duration,
                    habits: wizard.draft.habits.map((h) => ({
                      title: h.title,
                      difficulty: h.difficulty,
                      duration_minutes: h.duration,
                    })),
                    schedule: {
                      activeDays: wizard.draft.schedule.activeDays,
                      reminderTime: wizard.draft.schedule.reminderTime,
                    },
                    notifications: wizard.draft.notifications,
                    milestones: wizard.draft.milestones,
                  };
                  const enrichedContent = `[goal_finalized] ${JSON.stringify(payload)}`;
                  const newMsg: Message = {
                    id: Date.now().toString(),
                    role: "user",
                    content: "Saya konfirmasi goal: " + finalTitle,
                  };
                  setMessages((prev) => [...prev, newMsg]);
                  setIsLoading(true);
                  apiRequest<any>(
                    `/coach/sessions/${sessionId}/messages`,
                    {
                      method: "POST",
                      body: JSON.stringify({ role: "user", content: enrichedContent }),
                    }
                  )
                    .then((responseMsg) => {
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: responseMsg.id || `${Date.now()}-assistant`,
                          role: responseMsg.role || "assistant",
                          content: (responseMsg.content || "Goal berhasil dibuat! 🎉")
                            .replace(/<think>[\s\S]*?<\/think>/gi, "")
                            .trim(),
                        },
                      ]);
                      wizard.resetWizard();
                      setWizardMeta({ title: "", category: "other", habitTitle: "" });
                    })
                    .catch((err) => {
                      console.error("Wizard submit failed", err);
                      setMessages((prev) => prev.filter((m) => m.id !== newMsg.id));
                    })
                    .finally(() => setIsLoading(false));
                }}
              />
            )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CoachPage() {
  return (
    <Suspense fallback={
      <div className="flex h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CoachPageContent />
    </Suspense>
  );
}
