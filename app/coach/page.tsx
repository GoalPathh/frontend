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
    <div className="min-h-screen flex overflow-hidden bg-[#F8F9FF] text-[#121221] dark:bg-[#121221] dark:text-white">
      <aside className="hidden md:flex flex-col w-[28%] lg:w-[22%] bg-white border-r border-[#E5E7EB] relative z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#9288F8] flex items-center justify-center shadow-lg shadow-[#9288F8]/20">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-[20px] font-semibold">GoalPath AI</h2>
              <p className="text-sm text-[#6B7280]">Coach mode</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#9288F8] text-white rounded-xl text-sm font-semibold hover:bg-[#7a6de4] transition-all shadow-md shadow-[#9288F8]/10 active:scale-95">
            <Plus className="h-4 w-4" />
            New Session
          </button>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto space-y-2 pb-24">
          <p className="px-3 py-2 text-[10px] uppercase tracking-[0.24em] font-semibold text-[#6B7280] opacity-70">Recent Chats</p>
          <div className="flex items-center gap-3 px-4 py-3 bg-[#9288F8]/10 border border-[#9288F8]/15 rounded-xl text-[#9288F8] shadow-sm cursor-pointer">
            <Smile className="h-5 w-5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Feeling unmotivated</p>
              <p className="text-[10px] text-[#6B7280]">2m ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#F1F2F9] rounded-xl text-[#6B7280] cursor-pointer transition-colors group">
            <BarChart3 className="h-5 w-5 group-hover:text-[#9288F8] transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate group-hover:text-[#121221]">Improve speaking skills</p>
              <p className="text-[10px] text-[#6B7280]/80">1h ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#F1F2F9] rounded-xl text-[#6B7280] cursor-pointer transition-colors group">
            <CalendarCheck className="h-5 w-5 group-hover:text-[#9288F8] transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate group-hover:text-[#121221]">Habit adjustment</p>
              <p className="text-[10px] text-[#6B7280]/80">Yesterday</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#F1F2F9] rounded-xl text-[#6B7280] cursor-pointer transition-colors group">
            <Sparkles className="h-5 w-5 group-hover:text-[#9288F8] transition-colors" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate group-hover:text-[#121221]">Weekly review</p>
              <p className="text-[10px] text-[#6B7280]/80">3 days ago</p>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F2F9] cursor-pointer transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#F8F9FF] border border-[#E5E7EB] flex items-center justify-center overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2w4bl-LhdQY2a24NLuM-SKFio6jOZlAkPV4x2D654Th6P_tKpcS_zKUNhcVMJuqEuEbBovvJqkqijZBXF8idVU7g9_22yyjGk0NokMNfm2gMjCWFotmgA9uG4y69LevHyu-WK7YFRqyizIrKIPpfr-B5tis939-TUQ-ZaLEnUrzRUvTeQ6Kk_l9wnzFUBaC5jmf5iwnjT_JRHEgP_vj0Rxn_olwLhLPrNnWmNI1TxUJmiEehIl8uuWRvg5GwBrgZ4skhtuKuo7jvS6p0beDH"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Alex Rivera</p>
              <p className="text-[10px] text-[#6B7280]">Premium Member</p>
            </div>
            <Settings className="h-4 w-4 text-[#6B7280]" />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#F8F9FF]">
        <header className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-xl border-b border-[#E5E7EB] z-30 dark:border-white/10 dark:bg-[#121221]/90">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-[#9288F8] rounded-xl hover:bg-[#F1F2F9] transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">Coach</h1>
              <p className="text-sm text-[#6B7280] mt-1">Your personal growth assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="size-10 bg-white/80 dark:bg-white/10" />
            <button className="p-2 text-[#6B7280] hover:text-[#9288F8] transition-colors rounded-xl">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-6 py-8 space-y-8 max-w-5xl mx-auto">
          <div className="flex gap-4 items-start max-w-[85%]">
            <div className="bg-[#9288F8] text-white p-3 rounded-2xl shadow-lg shadow-[#9288F8]/20 flex-shrink-0">
              <Cpu className="h-6 w-6" />
            </div>
            <div className="space-y-4">
              <div className="rounded-[28px] rounded-tl-none border border-[#E5E7EB] bg-white p-5 shadow-sm">
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
                    className="px-4 py-2 rounded-full border border-[#9288F8]/20 bg-white text-[#9288F8] text-sm font-semibold hover:bg-[#F8F6FF] transition-all active:scale-95"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start justify-end">
            <div className="bg-[#9288F8] p-5 rounded-2xl shadow-lg shadow-[#9288F8]/20 max-w-[80%]">
              <p className="text-base leading-7 text-white">
                I feel tired today.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F8F9FF] border border-[#E5E7EB] overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2w4bl-LhdQY2a24NLuM-SKFio6jOZlAkPV4x2D654Th6P_tKpcS_zKUNhcVMJuqEuEbBovvJqkqijZBXF8idVU7g9_22yyjGk0NokMNfm2gMjCWFotmgA9uG4y69LevHyu-WK7YFRqyizIrKIPpfr-B5tis939-TUQ-ZaLEnUrzRUvTeQ6Kk_l9wnzFUBaC5jmf5iwnjT_JRHEgP_vj0Rxn_olwLhLPrNnWmNI1TxUJmiEehIl8uuWRvg5GwBrgZ4skhtuKuo7jvS6p0beDH"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex gap-4 items-start max-w-[85%]">
            <div className="bg-[#9288F8] text-white p-3 rounded-2xl shadow-lg shadow-[#9288F8]/20 flex-shrink-0">
              <Cpu className="h-6 w-6" />
            </div>
            <div className="rounded-[28px] rounded-tl-none border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <p className="text-base leading-7">
                That’s okay. Let’s make today lighter so you can still stay consistent. Consistency is better than intensity when energy is low. Would you like to do a 5-minute micro-habit instead?
              </p>
            </div>
          </div>
        </section>

        <footer className="p-6 md:px-10 pb-10 w-full bg-[#F8F9FF]">
          <div className="relative mx-auto max-w-5xl">
            <div className="flex items-center gap-3 rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-sm">
              <button className="p-3 rounded-2xl text-[#6B7280] hover:text-[#9288F8] transition-colors">
                <Mic className="h-5 w-5" />
              </button>
              <input
                type="text"
                placeholder="Tell me what’s on your mind..."
                className="flex-1 bg-transparent outline-none text-sm text-[#121221] placeholder:text-[#9CA3AF]"
              />
              <button className="p-3 rounded-2xl text-[#6B7280] hover:text-[#9288F8] transition-colors">
                <Paperclip className="h-5 w-5" />
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#9288F8] text-white shadow-lg shadow-[#9288F8]/20 hover:bg-[#7a6de4] transition-all">
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.24em] text-[#6B7280] opacity-70">
              GoalPath AI can make mistakes. Check important info.
            </p>
          </div>
        </footer>

        <BottomNavigation active="coach" />
      </main>
    </div>
  );
}
