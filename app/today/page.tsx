import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  Droplet,
  Edit3,
  Flame,
  Globe2,
  Menu,
  Mic,
  Moon,
  Quote,
  Sparkles,
  Sun,
  Target,
  User,
  UserCog,
  Utensils,
  Zap,
} from "lucide-react";

export default function TodayPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#121221] antialiased">
      <nav className="fixed top-0 w-full z-50 bg-[#f8f9ff]/80 backdrop-blur-xl border-b border-[#e4e5f1] px-6 py-3 md:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-primary active:scale-95 duration-200">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-primary tracking-tight">Today</h1>
          </div>
          <div className="relative">
            <button className="text-primary active:scale-95 duration-200">
              <Bell className="h-6 w-6" />
            </button>
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(89,79,187,0.4)]" />
          </div>
        </div>
      </nav>

      <main className="mt-[100px] px-6 md:px-10 max-w-7xl mx-auto space-y-5 pb-32">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-[#121221]">Hi Rahma 👋</h1>
          <p className="text-sm text-[#6b7280]">Ready to become better today?</p>
        </header>

        <section className="relative overflow-hidden rounded-[20px] glass-card p-6 border border-[#e4e5f1]">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-[80px]" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#121221]">Current Goals</h3>
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#121221]">
                  <span className="truncate">English Fluency</span>
                  <span className="text-[10px] uppercase text-[#6b7280]">75%</span>
                </div>
                <div className="w-full h-1.5 bg-[#eef0fb] rounded-full overflow-hidden">
                  <div className="w-[75%] h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#121221]">
                  <span className="truncate">Lose Weight</span>
                  <span className="text-[10px] uppercase text-[#6b7280]">40%</span>
                </div>
                <div className="w-full h-1.5 bg-[#eef0fb] rounded-full overflow-hidden">
                  <div className="w-[40%] h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#121221]">
                  <span className="truncate">Learn 5 Vocab</span>
                  <span className="text-[10px] uppercase text-[#6b7280]">20%</span>
                </div>
                <div className="w-full h-1.5 bg-[#eef0fb] rounded-full overflow-hidden">
                  <div className="w-[20%] h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#121221]">
                  <span className="truncate">Read 10 Min</span>
                  <span className="text-[10px] uppercase text-[#6b7280]">0%</span>
                </div>
                <div className="w-full h-1.5 bg-[#eef0fb] rounded-full overflow-hidden">
                  <div className="w-[0%] h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" />
                </div>
              </div>
            </div>
            <button className="w-full rounded-xl gradient-btn py-3 text-xs font-bold uppercase tracking-[0.24em] text-white shadow-md transition active:scale-[0.98]">
              View Strategy
            </button>
          </div>
        </section>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="rounded-[20px] glass-card border border-[#e4e5f1] p-5 text-center shadow-sm">
            <Flame className="mx-auto h-10 w-10 text-orange-500" />
            <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-[#6b7280] font-bold">7d Streak</p>
          </div>
          <div className="rounded-[20px] glass-card border border-[#e4e5f1] p-5 text-center shadow-sm">
            <Sparkles className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-[#6b7280] font-bold">320 XP</p>
          </div>
          <div className="rounded-[20px] glass-card border border-[#e4e5f1] p-5 text-center shadow-sm">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary shadow-sm">
              68%
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-[#6b7280] font-bold">Done</p>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-tight text-[#121221]">Today's Habits</h2>
            <span className="text-[10px] uppercase tracking-[0.32em] text-primary font-bold">2 / 7 COMPLETED</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#5a5d72]">
              <Sun className="h-5 w-5 text-orange-500" />
              <span className="text-[10px] uppercase tracking-[0.28em] font-bold">Morning Routine</span>
            </div>
            <div className="space-y-2.5">
              <button className="w-full glass-panel rounded-[20px] p-5 flex items-center justify-between text-left active:scale-[0.99] transition-transform border border-[#E6E8F5]">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-base text-[#5a5d72] line-through opacity-60 font-medium">Shadowing 10 min</span>
                </div>
                <Globe2 className="h-5 w-5 text-[#5a5d72]" />
              </button>
              <button className="w-full rounded-[20px] glass-card border border-[#E6E8F5] p-5 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#5a5d72]/30" />
                  <span className="text-base font-semibold text-[#121221]">Drink 500ml Water</span>
                </div>
                <Droplet className="h-5 w-5 text-[#5a5d72]" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#6b7280]">
              <Target className="h-5 w-5 text-yellow-600" />
              <span className="text-[10px] uppercase tracking-[0.28em] font-bold">Noon Focus</span>
            </div>
            <div className="space-y-2.5">
              <button className="w-full glass-panel rounded-[20px] p-5 flex items-center justify-between text-left active:scale-[0.99] transition-transform border border-[#e4e5f1]">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-base text-[#6b7280] line-through opacity-60 font-medium">Learn 5 vocabulary words</span>
                </div>
                <BookOpen className="h-5 w-5 text-[#6b7280]" />
              </button>
              <button className="w-full rounded-[20px] glass-card border border-[#e4e5f1] p-5 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#6b7280]/30" />
                  <span className="text-base font-semibold text-[#121221]">Healthy Lunch</span>
                </div>
                <Utensils className="h-5 w-5 text-[#6b7280]" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#6b7280]">
              <Moon className="h-5 w-5 text-primary" />
              <span className="text-[10px] uppercase tracking-[0.28em] font-bold">Evening Reflection</span>
            </div>
            <div className="space-y-2.5">
              <button className="w-full rounded-[20px] glass-card border border-[#e4e5f1] p-5 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#6b7280]/30" />
                  <span className="text-base font-semibold text-[#121221]">Speaking practice</span>
                </div>
                <Mic className="h-5 w-5 text-[#6b7280]" />
              </button>
              <button className="w-full rounded-[20px] glass-card border border-[#e4e5f1] p-5 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#6b7280]/30" />
                  <span className="text-base font-semibold text-[#121221]">Review vocabulary</span>
                </div>
                <BookOpen className="h-5 w-5 text-[#6b7280]" />
              </button>
              <button className="w-full rounded-[20px] glass-card border border-[#e4e5f1] p-5 flex items-center justify-between text-left shadow-sm active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#6b7280]/30" />
                  <span className="text-base font-semibold text-[#121221]">Journaling</span>
                </div>
                <Edit3 className="h-5 w-5 text-[#6b7280]" />
              </button>
            </div>
          </div>
        </section>

        <div className="rounded-[20px] glass-card border border-primary/20 p-6 shadow-sm flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
            <Quote className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] font-bold text-primary mb-1">
              Daily Motivation
            </p>
            <p className="text-sm italic font-medium text-[#6b7280]">
              "Success is the sum of small efforts, repeated day-in and day-out."
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/70">
              — Robert Collier
            </p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 w-full z-50 px-4 pb-6 bg-[#f8f9ff]/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-around gap-2 rounded-[24px] glass-surface border-[#e4e5f1] p-3 shadow-lg">
          <a className="flex flex-col items-center justify-center rounded-xl bg-primary/10 px-3 py-2 text-primary" href="/today">
            <CheckCircle2 className="h-6 w-6" />
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em]">Today</span>
          </a>
          <a className="flex flex-col items-center justify-center px-3 py-2 text-[#6b7280] hover:text-primary transition-colors" href="/goals">
            <Award className="h-6 w-6" />
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.24em]">Goals</span>
          </a>
          <a className="flex flex-col items-center justify-center px-3 py-2 text-[#6b7280] hover:text-primary transition-colors" href="/progress">
            <BarChart3 className="h-6 w-6" />
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.24em]">Progress</span>
          </a>
NOOP