import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const themeBootScript = `
  try {
    const preferenceKey = "goalpathAppearanceV2";
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const raw = window.localStorage.getItem(preferenceKey);
      const stored = raw ? JSON.parse(raw) : "light";
      const preference = stored === "dark" || stored === "system" ? stored : "light";
      const dark = preference === "dark" || (preference === "system" && media.matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    applyTheme();
    media.addEventListener("change", applyTheme);
  } catch {
    document.documentElement.classList.remove("dark");
  }
`;

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "GoalPath - Small steps, real changes",
  description:
    "An AI habit coach that turns ambitious goals into small daily actions. Built for students, creators, and anyone who is tired of starting over.",
  openGraph: {
    title: "GoalPath - Small steps, real changes",
    description:
      "An AI habit coach that turns ambitious goals into small daily actions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="font-sans antialiased">
        <a href="#main" className="skip-link">Skip to content</a>
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
