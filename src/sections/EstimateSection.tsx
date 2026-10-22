import { lazy, Suspense, useState } from "react";
import { ArrowRight, Calculator, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ConstructionEstimator = lazy(() => import("@/components/ConstructionEstimator"));

export default function EstimateSection() {
  const [open, setOpen] = useState(false);

  return (
    <section id="estimate" className="py-12 md:py-20 bg-[var(--rc-white)]">
      <div className="container-rc">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--rc-dark)] p-6 sm:p-10 lg:p-12 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
          <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border border-white/10 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <p className="text-xs uppercase font-bold tracking-[0.18em] text-orange-300 mb-3">Plan your budget</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">What could your home cost?</h2>
            <p className="text-sm sm:text-base text-white/75 leading-relaxed">Explore your construction budget in a few steps. Add your project details, compare packages and adjust materials to suit your plans.</p>
            <p className="text-xs text-white/55 mt-3">An indicative estimate to help you plan. Your final quote depends on the agreed scope and site conditions.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="relative inline-flex items-center justify-center gap-3 rounded-full bg-[var(--rc-orange)] px-6 py-4 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                <Calculator className="w-5 h-5" aria-hidden="true" />Calculate your estimate<ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] sm:max-w-6xl max-h-[92dvh] gap-0 p-0 rounded-2xl bg-white overflow-hidden z-[100]">
              <DialogHeader className="px-5 py-4 pr-12 border-b border-[var(--rc-border)] text-left">
                <DialogTitle className="text-[var(--rc-dark)]">Construction cost calculator</DialogTitle>
                <DialogDescription>Set up your project and explore an indicative construction estimate.</DialogDescription>
              </DialogHeader>
              <div data-lenis-prevent className="max-h-[calc(92dvh-6rem)] overflow-y-auto overscroll-contain p-2 sm:p-4">
                {open && <Suspense fallback={<div role="status" className="flex items-center justify-center gap-3 py-16 text-[var(--rc-muted)]"><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />Loading calculator…</div>}>
                  <ConstructionEstimator />
                </Suspense>}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
