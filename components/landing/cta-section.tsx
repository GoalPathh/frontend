import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#9288f8,#7e73eb_46%,#fbbf24)] p-8 text-center text-white shadow-soft sm:p-12 lg:p-16">
        <h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
          Start building better habits today
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/86 sm:text-lg">
          Create your first goal, let AI break it down, and turn tomorrow&apos;s ambition
          into today&apos;s action.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="secondary" className="w-full text-primary sm:w-auto">
            Get Started Free
          </Button>
          <Button className="w-full border border-white/25 bg-white/15 text-white shadow-none hover:bg-white/20 sm:w-auto">
            View Demo Flow
          </Button>
        </div>
      </div>
    </section>
  );
}

