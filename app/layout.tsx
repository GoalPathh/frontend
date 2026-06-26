import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const themeBootScript = `
  try {
    const raw = window.localStorage.getItem("goalpathAppearance");
    const appearance = raw ? JSON.parse(raw) : "light";
    document.documentElement.classList.toggle("dark", appearance === "dark");
  } catch {
    document.documentElement.classList.remove("dark");
  }
`;

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoalPath | Small Steps, Big Changes",
  description:
    "AI-powered habit tracking that turns ambitious goals into small daily actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        {children}
      </body>
    </html>
  );
}

