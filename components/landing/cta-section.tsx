"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function CtaSection() {
  return (
    <section className="section py-32" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="relative isolate overflow-hidden rounded-[3rem] bg-[#0a0a0e] text-[#f8f5ff] border-[8px] border-surface-2 p-1.5 shadow-2xl ring-1 ring-inset ring-border/50"
        >
          {/* Inner Content Core (Double Bezel Effect) */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#12121a] h-full w-full">
            {/* Ambient Background Gradient (Deep Space to Violet) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3c288c]/40 via-[#12121a] to-[#7350ff]/20 pointer-events-none" />
            
            {/* Glowing Orbs */}
            <div className="absolute -left-32 -top-32 h-[300px] w-[300px] rounded-full bg-[#7350ff]/20 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#dcc8ff]/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10 grid gap-12 p-10 sm:p-14 lg:grid-cols-[7fr_5fr] lg:p-20">
              <div className="flex flex-col justify-center gap-6">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#7350ff]/30 bg-[#7350ff]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#dcc8ff]">
                  Start tonight
                </span>
                
                <h2
                  id="cta-heading"
                  className="display text-[clamp(2.5rem,1.8rem+3vw,4rem)] font-semibold leading-[1.05]"
                >
                  Tomorrow&apos;s ambition,
                  <br />
                  <span className="text-[#f8f5ff]/60">
                    tonight&apos;s one habit.
                  </span>
                </h2>
                
                <p className="max-w-xl text-base leading-relaxed text-[#f8f5ff]/80 sm:text-lg">
                  One ambition in. Five-minute starter out. The rest is a habit
                  engine that gets out of your way and adapts to your actual energy levels.
                </p>

                <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-[13px] font-semibold tracking-wide text-[#f8f5ff]/70">
                  {["No credit card", "Set up in 90 seconds", "Cancel any time"].map(
                    (b) => (
                      <li key={b} className="flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className="flex size-4 items-center justify-center rounded-full bg-[#dcc8ff]/10 text-[#dcc8ff]"
                        >
                          <svg className="size-2.5" viewBox="0 0 14 14" fill="none">
                            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        {b}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="flex flex-col justify-end gap-4 lg:pl-10">
                <a
                  href="/register"
                  className="group relative inline-flex min-h-14 w-full items-center justify-between overflow-hidden rounded-full bg-[#f8f5ff] px-8 text-[15px] font-bold text-[#141224] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {/* Button hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] transition-transform duration-700 group-hover:translate-x-[100%]" />
                  
                  <span className="relative z-10">Start your first goal</span>
                  
                  {/* Button-in-button architecture */}
                  <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-[#141224]/10 transition-transform duration-300 group-hover:bg-[#7350ff] group-hover:text-white">
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </a>

                <a
                  href="/login"
                  className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-[15px] font-bold text-[#f8f5ff] backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                >
                  I already have an account
                </a>

                <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#f8f5ff]/40">
                  Free during beta
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}