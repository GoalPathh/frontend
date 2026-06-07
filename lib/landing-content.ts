import {
  BadgeCheck,
  BellOff,
  Bot,
  CalendarCheck,
  ChartNoAxesCombined,
  CheckCircle2,
  Flame,
  Flag,
  Goal,
  Medal,
  MessageCircle,
  Repeat2,
  Settings2,
  Sparkles,
  Star,
  TrendingDown,
  Trophy,
} from "lucide-react";

export const navigation = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Progress", href: "#progress" },
];

export const problems = [
  {
    title: "Lack of Consistency",
    description:
      "Missing one day often turns into quitting. GoalPath helps users recover and continue.",
    icon: Repeat2,
    accent: "text-coral",
    border: "border-coral",
  },
  {
    title: "Digital Distractions",
    description:
      "Gen Z users need habits that fit real life, not reminders that create more pressure.",
    icon: BellOff,
    accent: "text-sky",
    border: "border-sky",
  },
  {
    title: "Loss of Motivation",
    description:
      "XP, streaks, and badges make small progress feel visible and rewarding.",
    icon: TrendingDown,
    accent: "text-gold",
    border: "border-gold",
  },
  {
    title: "Goals Too Big",
    description:
      "AI breaks ambitious goals into daily habits that feel realistic and manageable.",
    icon: Goal,
    accent: "text-primary",
    border: "border-primary",
  },
];

export const workflow = [
  { title: "Set Goal", icon: Flag, tone: "border-primarySoft text-primary" },
  { title: "AI Breakdown", icon: Bot, tone: "border-primary bg-primary text-white" },
  { title: "Daily Habits", icon: CalendarCheck, tone: "border-sky text-sky" },
  { title: "Consistency", icon: Repeat2, tone: "border-coral text-coral" },
  { title: "Achievement", icon: Star, tone: "border-gold bg-gold text-[#4b3500]" },
];

export const features = [
  {
    title: "AI Habit Breakdown",
    description:
      "Type a big goal and GoalPath turns it into a practical habit plan with small daily actions.",
    icon: Sparkles,
    variant: "large",
  },
  {
    title: "24/7 AI Coach",
    description:
      "Quick guidance for motivation, tired days, simpler plans, and habit adjustments.",
    icon: MessageCircle,
    variant: "primary",
  },
  {
    title: "Adaptive Habit System",
    description:
      "When users struggle, GoalPath suggests easier habits without changing the goal.",
    icon: Settings2,
    variant: "gold",
  },
  {
    title: "Progress Analytics",
    description:
      "Track completion rate, XP, streaks, completed habits, and growth over time.",
    icon: ChartNoAxesCombined,
    variant: "analytics",
  },
];

export const stats = [
  { label: "Current Streak", value: "7 Day", icon: Flame, tone: "border-coral" },
  { label: "Weekly Goal", value: "+250 XP", icon: Trophy, tone: "border-gold" },
  { label: "Completion Rate", value: "85%", icon: CheckCircle2, tone: "border-sky" },
  { label: "AI Coach", value: "Active", icon: Bot, tone: "border-primary" },
];

export const habits = [
  { title: "Learn 5 new words", completed: true },
  { title: "Practice speaking 10 min", completed: false },
  { title: "Listen to a short podcast", completed: false },
];

export const achievements = [
  { title: "First Habit", icon: BadgeCheck },
  { title: "7-Day Streak", icon: Flame },
  { title: "Goal Starter", icon: Medal },
];

