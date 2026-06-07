import { Target } from "lucide-react";

const footerLinks = [
  { title: "Product", links: ["Features", "AI Coach", "Progress", "Gamification"] },
  { title: "Resources", links: ["Blog", "Community", "Help Center", "Privacy"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2 font-extrabold">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white">
              <Target className="size-5" aria-hidden="true" />
            </span>
            <span>GoalPath</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6b7280]">
            AI-powered habit tracking for small steps, big changes, and sustainable
            personal growth.
          </p>
        </div>

        {footerLinks.map((group) => (
          <div key={group.title}>
            <h3 className="font-extrabold">{group.title}</h3>
            <ul className="mt-4 space-y-3 text-sm font-bold text-[#6b7280]">
              {group.links.map((link) => (
                <li key={link}>
                  <a href="#" className="transition hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-extrabold">Stay Updated</h3>
          <p className="mt-4 text-sm leading-6 text-[#6b7280]">Get growth tips in your inbox.</p>
          <form className="mt-4 flex overflow-hidden rounded-full border border-border bg-muted p-1">
            <input
              className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
              placeholder="Email"
              type="email"
              aria-label="Email address"
            />
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-white">
              Join
            </button>
          </form>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl text-sm font-bold text-[#6b7280]">
        © 2026 GoalPath. Built for consistent growth.
      </p>
    </footer>
  );
}

