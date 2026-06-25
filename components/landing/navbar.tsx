"use client";

import { useState, useEffect } from "react";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import { navigation } from "@/lib/landing-content";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500 pt-4 px-4 sm:px-6 lg:px-10",
          mobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <nav
          className={cn(
            "flex w-full max-w-7xl items-center justify-between transition-all duration-500",
            isScrolled
              ? "h-14 rounded-full border border-border/50 bg-background/60 px-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] backdrop-blur-2xl md:px-6"
              : "h-16 rounded-[2rem] border border-transparent bg-transparent px-2"
          )}
        >
          {/* Logo */}
          <a
            href="#"
            className="group flex items-center gap-2.5 outline-none"
            aria-label="GoalPath home"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <span className="display text-[19px] font-semibold tracking-tight text-foreground">
              GoalPath
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative rounded-full px-4 py-2 text-[13px] font-semibold tracking-wide text-muted-foreground transition-all duration-200 hover:bg-surface/50 hover:text-foreground outline-none"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            <ThemeToggle className="size-9 bg-transparent border-transparent hover:bg-surface-2" />
            <a
              href="/login"
              className="px-4 py-2 text-[14px] font-semibold text-muted-foreground transition-colors hover:text-foreground outline-none"
            >
              Log in
            </a>
            <a
              href="/register"
              className="group flex h-10 items-center justify-between gap-3 overflow-hidden rounded-full bg-foreground px-1.5 pr-4 text-[14px] font-semibold text-background transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] outline-none"
            >
              {/* Animated nested arrow */}
              <span className="flex size-7 items-center justify-center rounded-full bg-background/20 transition-colors duration-300 group-hover:bg-primary">
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
              </span>
              <span>Start goal</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
        </nav>
      </motion.header>

      {/* Full Screen Mobile Modal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-3xl"
          >
            <div className="flex items-center justify-between p-6 sm:px-8">
              <span className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white">
                  <Sparkles className="size-4" />
                </span>
                <span className="display text-xl font-semibold text-foreground">
                  GoalPath
                </span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center px-8 pb-20">
              <nav className="flex flex-col gap-6">
                {navigation.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
                    className="display text-4xl font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </motion.a>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="mt-8 flex flex-col gap-4 border-t border-border/50 pt-8"
                >
                   <div className="flex items-center justify-between w-full">
                     <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Theme</span>
                     <ThemeToggle className="size-12 border-border/50" />
                   </div>
                  <a
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-14 items-center justify-center rounded-full border border-border bg-surface text-lg font-semibold text-foreground"
                  >
                    Log in
                  </a>
                  <a
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white"
                  >
                    Start your goal
                  </a>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}