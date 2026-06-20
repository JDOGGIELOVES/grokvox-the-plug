"use client";

import { cn } from "@/lib/utils";

type HallucinationFalseObjectiveProps = {
  text: string;
  personalityClass?: string;
  visible: boolean;
};

export function HallucinationFalseObjective({
  text,
  personalityClass,
  visible,
}: HallucinationFalseObjectiveProps) {
  if (!visible || !text) return null;

  return (
    <div className="hallucination-false-objective pointer-events-none fixed inset-x-0 top-28 z-[44] flex justify-center px-4 sm:top-32">
      <div
        className={cn(
          "hallucination-false-objective-panel max-w-xl rounded-sm border px-4 py-3 text-center",
          personalityClass?.includes("wrathful") &&
            "border-red-500/40 bg-red-950/40 text-red-100",
          personalityClass?.includes("melancholic") &&
            "border-rose-500/35 bg-rose-950/35 text-rose-50",
          personalityClass?.includes("logician") &&
            "border-cyan-500/35 bg-cyan-950/35 text-cyan-50",
          !personalityClass?.includes("wrathful") &&
            !personalityClass?.includes("melancholic") &&
            !personalityClass?.includes("logician") &&
            "border-orange-500/35 bg-orange-950/35 text-orange-50",
        )}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.32em] opacity-70">
          Groknet Directive · Unverified
        </p>
        <p className="mt-1 font-display text-sm font-bold uppercase tracking-[0.1em] sm:text-base">
          {text}
        </p>
      </div>
    </div>
  );
}