"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Cpu,
  Flame,
  Menu,
  MoreHorizontal,
  Send,
  Sparkles,
  Target,
  X,
  Loader2,
  Zap,
  AlertCircle
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { UserAvatar } from "@/components/user-avatar";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { ApiError, apiRequest, hasAuthSession } from "@/lib/api";
import { isSubscriptionGateError } from "@/lib/subscriptionService";
import { userService } from "@/lib/userService";
import {
  DurationBubble,
  HabitBubble,
  ScheduleBubble,
  ReviewBubble,
  WizardIntentBubble,
  type WizardPrefill,
} from "./wizard-bubbles";
import { useGoalWizard } from "./use-goal-wizard";
import { milestoneService } from "@/lib/milestoneService";
import { coachSessionService } from "@/lib/coachSessionService";
import { MilestoneFlow } from "./milestone-flow";
import {
  GOAL_WIZARD_TAG,
  type GoalCategory,
  type GoalPeriod,
  type UserProfile,
} from "@/lib/types";

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
      <div className="rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3.5 text-sm font-medium leading-6 shadow-sm sm:px-5 sm:py-4 sm:text-[15px] sm:leading-7">
        {children}
      </div>
    </div>
  );
}

function UserMessage({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: UserProfile | null;
}) {
  return (
    <div className="flex items-end justify-end gap-3">
      <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-primary px-4 py-3.5 text-sm font-semibold leading-6 text-white shadow-md shadow-primary/20 sm:px-5 sm:py-4 sm:text-[15px] whitespace-pre-wrap">
        {children}
      </div>
      <UserAvatar
        avatarUrl={profile?.avatarUrl}
        name={profile?.name ?? "User"}
        className="size-9 sm:size-10"
        imageSizes="40px"
      />
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

interface CoachSessionSummary {
  id: string;
  title?: string;
}

interface CoachSessionDetail {
  title?: string;
  data?: {
    title?: string;
  };
}

interface CoachMessageResponse {
  id?: string;
  role?: Message["role"];
  content?: string;
}

interface WizardMeta {
  title: string;
  category: GoalCategory;
  habitTitle: string;
}

interface GoalFinalizationPayload {
  title: string;
  category: GoalCategory;
  duration?: GoalPeriod;
  habits: Array<{
    title: string;
    difficulty: "easy" | "medium" | "hard";
    duration_minutes: number;
  }>;
  schedule: {
    activeDays: string[];
    reminderTime?: string;
  };
  notifications: "all" | "important" | "none";
  milestones: Array<{ title: string; target_date?: string }>;
}

const THINK_BLOCK_PATTERN = /<think>[\s\S]*?<\/think>/gi;
const WIZARD_STARTED_PATTERN = /^\[wizard_started\]\s*([\s\S]*?)(?:\n\n|$)/;
const UI_DATA_PATTERN = /\[UI_DATA:[^\]]*\]/g;

const DEFAULT_WIZARD_META: WizardMeta = {
  title: "",
  category: "other",
  habitTitle: "",
};
const GOAL_CATEGORY_VALUES: readonly GoalCategory[] = [
  "language",
  "fitness",
  "skills",
  "creativity",
  "learning",
  "other",
];

function createMessageId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function sanitizeAssistantContent(content?: string, fallback = "I've updated your goals based on your request!"): string {
  return (content || fallback).replace(THINK_BLOCK_PATTERN, "").trim();
}

function getSessionTitle(
  sessionDetail: CoachSessionDetail | null,
  fallbackTitle: string,
): string {
  return sessionDetail?.data?.title ?? sessionDetail?.title ?? fallbackTitle;
}

function formatWizardUserContent(content: string): string {
  if (!content.startsWith(GOAL_WIZARD_TAG)) return content;

  try {
    const payload = JSON.parse(content.slice(GOAL_WIZARD_TAG.length).trim()) as Partial<GoalFinalizationPayload>;
    const title = typeof payload.title === "string" && payload.title.trim()
      ? payload.title.trim()
      : "goal baru";
    return `Saya konfirmasi goal: ${title}`;
  } catch {
    return "Saya konfirmasi goal baru";
  }
}

function mapCoachMessage(message: CoachMessageResponse): Message {
  const role = message.role ?? "assistant";
  const content = message.content ?? "";

  return {
    id: message.id ?? createMessageId("message"),
    role,
    content: role === "user" ? formatWizardUserContent(content) : content,
  };
}

function isGoalCategory(value: string | null): value is GoalCategory {
  return value !== null && GOAL_CATEGORY_VALUES.includes(value as GoalCategory);
}

function stripAssistantTags(raw: string): { displayText: string; wizardPrefill: WizardPrefill | null } {
  if (!raw) return { displayText: "", wizardPrefill: null };
  const m = raw.match(WIZARD_STARTED_PATTERN);
  if (!m) return { displayText: raw.trim(), wizardPrefill: null };
  let prefill: WizardPrefill | null = null;
  try {
    prefill = JSON.parse(m[1]!.trim()) as WizardPrefill;
  } catch {
    prefill = null;
  }
  const displayText = raw.replace(WIZARD_STARTED_PATTERN, "").trim();
  const cleaned = displayText.replace(UI_DATA_PATTERN, "").trim();
  return { displayText: cleaned, wizardPrefill: prefill };
}

interface RichListItem {
  text: string;
  checked: boolean;
}

type RichBlock =
  | { type: "heading"; depth: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: RichListItem[] }
  | { type: "quote"; text: string }
  | { type: "code"; language: string; code: string };

interface RichSection {
  title: string;
  depth: number;
  blocks: RichBlock[];
}

function isRichBlockStart(line: string): boolean {
  const trimmed = line.trim();
  return (
    /^#{1,4}\s+/.test(trimmed) ||
    /^```/.test(trimmed) ||
    /^>\s?/.test(trimmed) ||
    /^((?:[-*•])|\d+[.)])\s+/.test(trimmed)
  );
}

function parseRichBlocks(content: string): RichBlock[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: RichBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const codeStart = trimmed.match(/^```(\w+)?/);
    if (codeStart) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? "").trim().startsWith("```")) {
        codeLines.push(lines[index] ?? "");
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({
        type: "code",
        language: codeStart[1] ?? "",
        code: codeLines.join("\n").trimEnd(),
      });
      continue;
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      blocks.push({
        type: "heading",
        depth: heading[1]!.length,
        text: heading[2]!.trim(),
      });
      index += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (index < lines.length && (lines[index] ?? "").trim().startsWith(">")) {
        quoteLines.push((lines[index] ?? "").trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "quote", text: quoteLines.join(" ").trim() });
      continue;
    }

    const listMatch = trimmed.match(/^((?:[-*•])|\d+[.)])\s+(?:\[( |x|X)\]\s+)?(.+)$/);
    if (listMatch) {
      const ordered = /^\d/.test(listMatch[1]!);
      const items: RichListItem[] = [];
      while (index < lines.length) {
        const current = (lines[index] ?? "").trim();
        const currentMatch = current.match(/^((?:[-*•])|\d+[.)])\s+(?:\[( |x|X)\]\s+)?(.+)$/);
        if (!currentMatch || /^\d/.test(currentMatch[1]!) !== ordered) break;
        items.push({
          text: currentMatch[3]!.trim(),
          checked: (currentMatch[2] ?? "").toLowerCase() === "x",
        });
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length) {
      const current = lines[index] ?? "";
      if (!current.trim()) break;
      if (paragraphLines.length > 0 && isRichBlockStart(current)) break;
      paragraphLines.push(current.trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ").trim() });
  }

  return blocks.filter((block) => block.type !== "paragraph" || block.text.length > 0);
}

function splitRichSections(blocks: RichBlock[]): { intro: RichBlock[]; sections: RichSection[] } {
  const intro: RichBlock[] = [];
  const sections: RichSection[] = [];
  let current: RichSection | null = null;

  for (const block of blocks) {
    if (block.type === "heading") {
      if (current) sections.push(current);
      current = { title: block.text, depth: block.depth, blocks: [] };
      continue;
    }

    if (current) {
      current.blocks.push(block);
    } else {
      intro.push(block);
    }
  }

  if (current) sections.push(current);
  return { intro, sections };
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-extrabold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded-md bg-muted px-1.5 py-0.5 text-[0.92em] font-bold text-primary">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function RichBlockView({
  block,
  blockKey,
  checkedItems,
  copiedCodeKey,
  onToggleItem,
  onCopyCode,
}: {
  block: RichBlock;
  blockKey: string;
  checkedItems: Record<string, boolean>;
  copiedCodeKey: string | null;
  onToggleItem: (key: string, fallback: boolean) => void;
  onCopyCode: (key: string, code: string) => void;
}) {
  if (block.type === "paragraph") {
    return <p className="text-foreground/82">{renderInlineMarkdown(block.text)}</p>;
  }

  if (block.type === "quote") {
    return (
      <div className="border-l-2 border-primary/40 bg-primary/5 px-3 py-2 text-sm font-semibold text-foreground/70">
        {renderInlineMarkdown(block.text)}
      </div>
    );
  }

  if (block.type === "code") {
    const copied = copiedCodeKey === blockKey;
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-background/80">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/45">
            {block.language || "snippet"}
          </span>
          <button
            type="button"
            onClick={() => onCopyCode(blockKey, block.code)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/50 transition hover:bg-muted hover:text-primary"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="max-h-72 overflow-auto p-3 text-xs leading-5 text-foreground/80">
          <code>{block.code}</code>
        </pre>
      </div>
    );
  }

  if (block.type === "list") {
    const ListTag = block.ordered ? "ol" : "ul";
    return (
      <ListTag className={block.ordered ? "space-y-2 pl-1" : "space-y-2"}>
        {block.items.map((item, index) => {
          const key = `${blockKey}-${index}`;
          const checked = checkedItems[key] ?? item.checked;
          return (
            <li key={key} className={block.ordered ? "flex gap-2" : "flex gap-2"}>
              <button
                type="button"
                onClick={() => onToggleItem(key, item.checked)}
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition ${
                  checked
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-background text-foreground/35 hover:border-primary/50 hover:text-primary"
                }`}
                aria-label={checked ? "Mark item as open" : "Mark item as done"}
              >
                {block.ordered ? (
                  <span className="text-[10px] font-extrabold">{index + 1}</span>
                ) : checked ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span className="size-1.5 rounded-full bg-current" />
                )}
              </button>
              <span className={checked ? "text-foreground/45 line-through decoration-primary/50" : "text-foreground/78"}>
                {renderInlineMarkdown(item.text)}
              </span>
            </li>
          );
        })}
      </ListTag>
    );
  }

  return null;
}

function RichSectionBlock({
  section,
  sectionKey,
  defaultOpen,
  checkedItems,
  copiedCodeKey,
  onToggleItem,
  onCopyCode,
}: {
  section: RichSection;
  sectionKey: string;
  defaultOpen: boolean;
  checkedItems: Record<string, boolean>;
  copiedCodeKey: string | null;
  onToggleItem: (key: string, fallback: boolean) => void;
  onCopyCode: (key: string, code: string) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-muted/60"
      >
        <span className="flex min-w-0 items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate text-sm font-extrabold text-foreground">
            {renderInlineMarkdown(section.title)}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-foreground/45 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-border px-3 py-3">
              {section.blocks.length > 0 ? (
                section.blocks.map((block, index) => (
                  <RichBlockView
                    key={`${sectionKey}-block-${index}`}
                    block={block}
                    blockKey={`${sectionKey}-block-${index}`}
                    checkedItems={checkedItems}
                    copiedCodeKey={copiedCodeKey}
                    onToggleItem={onToggleItem}
                    onCopyCode={onCopyCode}
                  />
                ))
              ) : (
                <p className="text-foreground/60">Tidak ada detail tambahan.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RichAssistantContent({ content }: { content: string }) {
  const blocks = useMemo(() => parseRichBlocks(content), [content]);
  const { intro, sections } = useMemo(() => splitRichSections(blocks), [blocks]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  const toggleItem = useCallback((key: string, fallback: boolean) => {
    setCheckedItems((current) => ({ ...current, [key]: !(current[key] ?? fallback) }));
  }, []);

  const copyCode = useCallback((key: string, code: string) => {
    if (!navigator.clipboard) return;
    void navigator.clipboard.writeText(code).then(() => {
      setCopiedCodeKey(key);
      window.setTimeout(() => setCopiedCodeKey(null), 1400);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="space-y-3 whitespace-normal"
    >
      {intro.map((block, index) => (
        <RichBlockView
          key={`intro-${index}`}
          block={block}
          blockKey={`intro-${index}`}
          checkedItems={checkedItems}
          copiedCodeKey={copiedCodeKey}
          onToggleItem={toggleItem}
          onCopyCode={copyCode}
        />
      ))}
      {sections.map((section, index) => (
        <RichSectionBlock
          key={`section-${index}`}
          section={section}
          sectionKey={`section-${index}`}
          defaultOpen={index === 0}
          checkedItems={checkedItems}
          copiedCodeKey={copiedCodeKey}
          onToggleItem={toggleItem}
          onCopyCode={copyCode}
        />
      ))}
    </motion.div>
  );
}

function buildGoalFinalizationPayload(
  wizardMeta: WizardMeta,
  draft: ReturnType<typeof useGoalWizard>["draft"],
): GoalFinalizationPayload {
  return {
    title: wizardMeta.title.trim(),
    category: wizardMeta.category,
    duration: draft.duration,
    habits: draft.habits.map((habit) => ({
      title: habit.title,
      difficulty: habit.difficulty,
      duration_minutes: habit.duration,
    })),
    schedule: {
      activeDays: draft.schedule.activeDays,
      reminderTime: draft.schedule.reminderTime,
    },
    notifications: draft.notifications,
    milestones: draft.milestones,
  };
}

function AssistantMessageBlock({
  content,
  onWizardAccept,
  onWizardCancel,
}: {
  content: string;
  onWizardAccept: (prefill: WizardPrefill) => void;
  onWizardCancel: () => void;
}) {
  const { displayText, wizardPrefill } = stripAssistantTags(content);

  return (
    <>
      {displayText && (
        <CoachMessage>
          <RichAssistantContent content={displayText} />
        </CoachMessage>
      )}
      {wizardPrefill && (
        <WizardIntentBubble
          prefill={wizardPrefill}
          onAccept={() => onWizardAccept(wizardPrefill)}
          onCancel={onWizardCancel}
        />
      )}
    </>
  );
}

function CoachPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get("session");
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState<AnyMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(sessionParam);
  const [sessionTitle, setSessionTitle] = useState<string>("Coach");
  const [quota, setQuota] = useState<
    | { remaining: number; max_messages: number; resetAt: string | null; accessPercentage: number }
    | null
  >(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [wizardMeta, setWizardMeta] = useState<WizardMeta>(DEFAULT_WIZARD_META);
  const wizard = useGoalWizard();
  const cancelWizardCallback = () => {
    wizard.cancelWizard();
    setWizardMeta(DEFAULT_WIZARD_META);
  };
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, wizard.draft.step]);

  const loadUserProfile = useCallback(async () => {
    if (!hasAuthSession()) return;

    try {
      const overview = await userService.getOverview();
      setUserProfile(overview.profile);
    } catch {
      setUserProfile(null);
    }
  }, []);

  useEffect(() => {
    void loadUserProfile();

    if (typeof window === "undefined") return;
    window.addEventListener("focus", loadUserProfile);

    return () => {
      window.removeEventListener("focus", loadUserProfile);
    };
  }, [loadUserProfile]);

  useEffect(() => {
    // Re-sync sessionId from URL ?session= if it changed
    if (sessionParam !== sessionId) {
      setSessionId(sessionParam);
      setMessages([]); // wipe stale messages from previous session
    }
  }, [sessionParam, sessionId]);

  useEffect(() => {
    const cached = sessionStorage.getItem("coach_quota_cache");
    if (cached) {
      try {
        setQuota(JSON.parse(cached));
      } catch {
        sessionStorage.removeItem("coach_quota_cache");
      }
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    
    // Auth redirect is handled globally via API 401 interceptor
    // or by backend redirecting unauthenticated requests
    if (sessionParam !== null && messages.length > 0) return; // already loaded a target
    initialized.current = true;

    // FETCH QUOTA INDEPENDENTLY ON MOUNT
    coachSessionService.getQuota()
      .then(q => {
        if (q) {
          const quotaData = {
            remaining: q.remaining_messages,
            max_messages: q.max_messages,
            resetAt: q.reset_at,
            accessPercentage: q.access_percentage,
          };
          setQuota(quotaData);
          sessionStorage.setItem("coach_quota_cache", JSON.stringify(quotaData));
        }
      })
      .catch(err => console.error("Failed to fetch quota:", err));

    async function loadOrCreateSession() {
      try {
        let sid: string | null = sessionParam;
        if (!sid) {
          const sessions = await apiRequest<CoachSessionSummary[]>("/coach/sessions");
          if (sessions && sessions.length > 0) {
            sid = sessions[0].id;
          } else {
            const newSession = await apiRequest<CoachSessionSummary>("/coach/sessions", {
              method: "POST",
              body: JSON.stringify({ title: "Goal Planning" })
            });
            sid = newSession.id;
          }
        }

        if (sid) {
          const sessionDetail = await apiRequest<CoachSessionDetail>(
            `/coach/sessions/${sid}`,
            { method: "GET" }
          ).catch(() => null);
          setSessionTitle(
            getSessionTitle(
              sessionDetail,
              sid === sessionParam ? "Coach" : "Goal Planning",
            ),
          );
        }

        setSessionId(sid);

        if (sid) {
          if (!sessionParam && typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("session", sid);
            window.history.replaceState(null, "", url.toString());
          }
          const history = await apiRequest<CoachMessageResponse[]>(`/coach/sessions/${sid}/messages`);
          setMessages(history.map(mapCoachMessage));

          const intent = searchParams.get("intent");
          if (intent === "create_goal" && history.length === 0) {
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
      setWizardMeta(DEFAULT_WIZARD_META);
      const cancelMsg: Message = { id: createMessageId("cancel"), role: "user", content: textToSend };
      setMessages((prev) => [...prev, cancelMsg, {
        id: createMessageId("cancel-response"),
        role: "assistant",
        content: "Siap, wizard saya tutup. Mau mulai baru dengan cara lain?",
      }]);
      if (!overrideInput) setInput("");
      return;
    }

    const newMsg: Message = { id: createMessageId("user"), role: "user", content: textToSend };
    setMessages((prev) => [...prev, newMsg]);
    if (!overrideInput) setInput("");
    setIsLoading(true);

    try {
      const responseMsg = await apiRequest<CoachMessageResponse>(`/coach/sessions/${currentSessionId}/messages`, {
        method: "POST",
        body: JSON.stringify({ role: "user", content: textToSend })
      });
      
      setMessages((prev) => [
        ...prev, 
        { 
          id: responseMsg.id ?? createMessageId("assistant"),
          role: responseMsg.role ?? "assistant",
          content: sanitizeAssistantContent(responseMsg.content),
        }
      ]);

      // Refresh quota if it was a successful message
      const q = await coachSessionService.getQuota();
      if (q) {
        const quotaData = {
          remaining: q.remaining_messages,
          max_messages: q.max_messages,
          resetAt: q.reset_at,
          accessPercentage: q.access_percentage,
        };
        setQuota(quotaData);
        sessionStorage.setItem("coach_quota_cache", JSON.stringify(quotaData));
      }

    } catch (err) {
      setMessages((prev) => prev.filter(m => m.id !== newMsg.id));
      if (isSubscriptionGateError(err)) {
        setMessages((prev) => [
          ...prev,
          {
            id: createMessageId("subscription-gate"),
            role: "assistant",
            content: `${err instanceof Error ? err.message : "Batas plan Free tercapai."}\n\nBuka halaman Pricing untuk upgrade ke Premium, atau hapus goal yang sudah tidak aktif.`,
          },
        ]);
      } else {
        console.error("Failed to send message", err);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function submitGoal() {
    if (!sessionId) return;
    const finalTitle = wizardMeta.title.trim();
    if (!finalTitle) return;

    const payload = buildGoalFinalizationPayload(wizardMeta, wizard.draft);
    const enrichedContent = `${GOAL_WIZARD_TAG} ${JSON.stringify(payload)}`;
    const newMsg: Message = {
      id: createMessageId("user"),
      role: "user",
      content: "Saya konfirmasi goal: " + finalTitle,
    };
    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);
    try {
      const responseMsg = await apiRequest<CoachMessageResponse>(
        `/coach/sessions/${sessionId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ role: "user", content: enrichedContent }),
        }
      );
      setMessages((prev) => [
        ...prev,
        {
          id: responseMsg.id ?? createMessageId("assistant"),
          role: responseMsg.role ?? "assistant",
          content: sanitizeAssistantContent(responseMsg.content, "Goal berhasil dibuat!"),
        },
      ]);
      wizard.resetWizard();
      setWizardMeta(DEFAULT_WIZARD_META);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== newMsg.id));
      if (isSubscriptionGateError(err)) {
        setMessages((prev) => [
          ...prev,
          {
            id: createMessageId("subscription-gate"),
            role: "assistant",
            content: `${err instanceof Error ? err.message : "Batas plan Free tercapai."}\n\nBuka halaman Pricing untuk upgrade ke Premium, atau hapus goal yang sudah tidak aktif.`,
          },
        ]);
      } else {
        console.error("Wizard submit failed", err);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const startWizardFromPrefill = (prefill: WizardPrefill) => {
    setWizardMeta((currentMeta) => ({
      ...currentMeta,
      category: isGoalCategory(prefill.category)
        ? prefill.category
        : currentMeta.category,
      title: prefill.title ?? currentMeta.title,
    }));
    wizard.startWizard(prefill);
  };

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
              <div className="min-w-0 flex-1">
                <SessionTitleEditor
                  sessionId={sessionId}
                  title={sessionTitle}
                  onTitleChange={setSessionTitle}
                />
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
                      <AssistantMessageBlock
                        content={msg.content}
                        onWizardAccept={startWizardFromPrefill}
                        onWizardCancel={cancelWizardCallback}
                      />
                    ) : msg.role === "wizard_intent" ? (
                      <WizardIntentBubble
                        prefill={msg.prefill}
                        onAccept={() => startWizardFromPrefill(msg.prefill)}
                        onCancel={cancelWizardCallback}
                      />
                    ) : (
                      <UserMessage profile={userProfile}>{msg.content}</UserMessage>
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
                        setWizardMeta(DEFAULT_WIZARD_META);
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
              
              {/* Quota Badge Indicator */}
              <div className="mb-2 flex justify-center">
                {quota ? (
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${quota.remaining <= 10 ? 'bg-coral/10 text-coral' : 'bg-primary/10 text-primary'}`}>
                    {quota.remaining <= 10 ? <AlertCircle className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
                    <span>
                      Sisa {quota.remaining}/{quota.max_messages} pesan
                      <span className="ml-1.5 opacity-80">· Akses {quota.accessPercentage}%</span>
                    </span>
                    {quota.resetAt && (
                      <span className="ml-1 opacity-80">· Reset UTC {new Date(quota.resetAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Memuat kuota...
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-surface p-2 shadow-card focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder={quota && quota.remaining <= 0 ? "Batas chat tercapai. Tunggu waktu reset..." : "Tell me what's on your mind..."}
                    className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm font-medium text-foreground outline-none placeholder:text-foreground/35 disabled:opacity-50"
                    disabled={isLoading || (quota !== null && quota.remaining <= 0)}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !input.trim() || (quota !== null && quota.remaining <= 0)}
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

/**
 * Inline-editable session title in the chat header. Click to edit, Enter/blur to
 * PATCH, Esc to revert. Optimistic with revert on backend failure.
 */
function SessionTitleEditor({
  sessionId,
  title,
  onTitleChange,
}: {
  sessionId: string | null;
  title: string;
  onTitleChange: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setValue(title);
  }, [title, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = async () => {
    const v = value.trim();
    setEditing(false);
    if (!sessionId || v.length === 0 || v === title) {
      setValue(title);
      return;
    }
    const previous = title;
    onTitleChange(v);
    const { coachSessionService } = await import("@/lib/coachSessionService");
    const updated = await coachSessionService.rename(sessionId, v);
    if (!updated) onTitleChange(previous);
  };

  return (
    <div className="flex items-center gap-2">
      {editing ? (
        <input
          ref={inputRef}
          value={value}
          maxLength={120}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void commit();
            if (e.key === "Escape") {
              setValue(title);
              setEditing(false);
            }
          }}
          onBlur={() => void commit()}
          className="min-w-0 max-w-xs rounded-md border border-primary/40 bg-background px-2 py-0.5 text-lg font-bold tracking-tight text-foreground outline-none focus:ring-2 focus:ring-primary/30"
        />
      ) : (
        <button
          type="button"
          onClick={() => sessionId && setEditing(true)}
          disabled={!sessionId}
          className="truncate rounded-md px-1 text-left text-lg font-bold tracking-tight text-foreground transition hover:bg-muted hover:text-primary disabled:cursor-not-allowed sm:text-xl"
          title={sessionId ? "Click to rename session" : "Loading session..."}
        >
          {title || "Coach"}
        </button>
      )}
      <span className="hidden rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-primary sm:inline">
        AI assistant
      </span>
    </div>
  );
}
