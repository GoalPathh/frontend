import {
  BarChart3,
  CalendarCheck,
  Cpu,
  Menu,
  Mic,
  MoreVertical,
  Paperclip,
  Plus,
  Send,
  Settings,
  Smile,
  Sparkles,
} from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CoachPage() {
  return (
    <div className="min-h-screen flex overflow-hidden bg-background text-foreground dark:bg-background dark:text-white">
      <aside className="hidden md:flex flex-col w-[28%] lg:w-[22%] bg-surface border-r border-border relative z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-[20px] font-semibold">GoalPath AI</h2>
              <p className="text-sm text-foreground/60">Coach mode</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/10 active:scale-95">
            <Plus className="h-4 w-4" />
            New Session
          </button>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto space-y-2 pb-24">
          <p className="px-3 py-2 text-[10px] uppercase tracking-[0.24em] font-semibold text-foreground/60 opacity-70">Recent Chats</p>
          <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/15 rounded-xl text-primary shadow-sm cursor-pointer">
            <Smile className="h-5 w-5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Feeling unmotivated</p>
              <p className="text-[10px] text-foreground/60">2m ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-xl text-foreground/60 cursor-pointer transition-colors group">
            <BarChart3 className="h-5 w-5 group-hover:text-primary transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate group-hover:text-foreground">Improve speaking skills</p>
              <p className="text-[10px] text-foreground/60">1h ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-xl text-foreground/60 cursor-pointer transition-colors group">
            <CalendarCheck className="h-5 w-5 group-hover:text-primary transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate group-hover:text-foreground">Habit adjustment</p>
              <p className="text-[10px] text-foreground/60">Yesterday</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-xl text-foreground/60 cursor-pointer transition-colors group">
            <Sparkles className="h-5 w-5 group-hover:text-primary transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate group-hover:text-foreground">Weekly review</p>
              <p className="text-[10px] text-foreground/60">3 days ago</p>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted cursor-pointer transition-colors">
            <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2w4bl-LhdQY2a24NLuM-SKFio6jOZlAkPV4x2D654Th6P_tKpcS_zKUNhcVMJuqEuEbBovvJqkqijZBXF8idVU7g9_22yyjGk0NokMNfm2gMjCWFotmgA9uG4y69LevHyu-WK7YFRqyizIrKIPpfr-B5tis939-TUQ-ZaLEnUrzRUvTeQ6Kk_l9wnzFUBaC5jmf5iwnjT_JRHEgP_vj0Rxn_olwLhLPrNnWmNI1TxUJmiEehIl8uuWRvg5GwBrgZ4skhtuKuo7jvS6p0beDH"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Alex Rivera</p>
              <p className="text-[10px] text-foreground/60">Premium Member</p>
            </div>
            <Settings className="h-4 w-4 text-foreground/60" />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        <header className="flex items-center justify-between px-6 py-4 bg-surface/90 backdrop-blur-xl border-b border-border z-30 dark:border-surface/10 dark:bg-background/90">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-primary rounded-xl hover:bg-muted transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">Coach</h1>
              <p className="text-sm text-foreground/60 mt-1">Your personal growth assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="size-10 bg-surface/80 dark:bg-surface/10" />
            <button className="p-2 text-foreground/60 hover:text-primary transition-colors rounded-xl">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-6 py-8 space-y-8 max-w-5xl mx-auto">
          <div className="flex gap-4 items-start max-w-[85%]">
            <div className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20 flex-shrink-0">
              <Cpu className="h-6 w-6" />
            </div>
            <div className="space-y-4">
              <div className="rounded-[28px] rounded-tl-none border border-border bg-surface p-5 shadow-sm">
                <p className="text-base leading-7">
                  Hi! I’ll help you stay consistent with your goal. How are you feeling about your progress today?
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Motivate Me",
                  "Simplify Today",
                  "Adjust My Plan",
                  "I Feel Tired",
                ].map((label) => (
                  <button
                    key={label}
                    className="px-4 py-2 rounded-full border border-primary/20 bg-surface text-primary text-sm font-semibold hover:bg-primary/10 transition-all active:scale-95"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start justify-end">
            <div className="bg-primary p-5 rounded-2xl shadow-lg shadow-primary/20 max-w-[80%]">
              <p className="text-base leading-7 text-white">
                I feel tired today.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-background border border-border overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2w4bl-LhdQY2a24NLuM-SKFio6jOZlAkPV4x2D654Th6P_tKpcS_zKUNhcVMJuqEuEbBovvJqkqijZBXF8idVU7g9_22yyjGk0NokMNfm2gMjCWFotmgA9uG4y69LevHyu-WK7YFRqyizIrKIPpfr-B5tis939-TUQ-ZaLEnUrzRUvTeQ6Kk_l9wnzFUBaC5jmf5iwnjT_JRHEgP_vj0Rxn_olwLhLPrNnWmNI1TxUJmiEehIl8uuWRvg5GwBrgZ4skhtuKuo7jvS6p0beDH"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex gap-4 items-start max-w-[85%]">
            <div className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20 flex-shrink-0">
              <Cpu className="h-6 w-6" />
            </div>
            <div className="rounded-[28px] rounded-tl-none border border-border bg-surface p-5 shadow-sm">
              <p className="text-base leading-7">
                That’s okay. Let’s make today lighter so you can still stay consistent. Consistency is better than intensity when energy is low. Would you like to do a 5-minute micro-habit instead?
              </p>
            </div>
          </div>
        </section>

        <footer className="p-6 md:px-10 pb-10 w-full bg-background">
          <div className="relative mx-auto max-w-5xl">
            <div className="flex items-center gap-3 rounded-3xl border border-border bg-surface px-4 py-3 shadow-sm">
              <button className="p-3 rounded-2xl text-foreground/60 hover:text-primary transition-colors">
                <Mic className="h-5 w-5" />
              </button>
              <input
                type="text"
                placeholder="Tell me what’s on your mind..."
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-[#9CA3AF]"
              />
              <button className="p-3 rounded-2xl text-foreground/60 hover:text-primary transition-colors">
                <Paperclip className="h-5 w-5" />
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.24em] text-foreground/60 opacity-70">
              GoalPath AI can make mistakes. Check important info.
            </p>
          </div>
        </footer>

        <BottomNavigation active="coach" />
      </main>
    </div>
  );
}
