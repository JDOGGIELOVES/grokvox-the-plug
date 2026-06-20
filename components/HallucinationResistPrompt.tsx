"use client";

import { useCallback } from "react";
import { playInteractSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type HallucinationResistPromptProps = {
  progress: number;
  onResist: () => void;
  personalityClass?: string;
};

export function HallucinationResistPrompt({
  progress,
  onResist,
  personalityClass,
}: HallucinationResistPromptProps) {
  const handleResist = useCallback(() => {
    playInteractSound();
    onResist();
  }, [onResist]);

  return (
    <div className="hallucination-resist-in fixed inset-x-0 top-20 z-[47] flex justify-center px-4 sm:top-24">
      <div
        className={cn(
          "w-full max-w-md rounded-sm border bg-zinc-950/90 p-4 backdrop-blur-md",
          personalityClass?.includes("wrathful")
            ? "border-red-900/50 shadow-[0_0_30px_rgba(220,38,38,0.2)]"
            : personalityClass?.includes("melancholic")
              ? "border-rose-900/45 shadow-[0_0_30px_rgba(244,63,94,0.15)]"
              : personalityClass?.includes("logician")
                ? "border-cyan-900/45 shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                : "border-orange-900/45 shadow-[0_0_30px_rgba(249,115,22,0.15)]",
        )}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
          Sensory Override · Resist Window
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-200">
          Groknet is rewriting your senses. Anchor to reality before the bleed
          deepens.
        </p>

        <button
          type="button"
          onClick={handleResist}
          className="enter-facility-btn mt-4 min-h-11 w-full font-display text-xs font-bold uppercase tracking-[0.2em] rounded-sm bg-accent text-zinc-950 shadow-[0_0_24px_rgba(249,115,22,0.3)] transition-all hover:bg-accent-bright"
        >
          Anchor Reality
        </button>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="hallucination-resist-bar h-full rounded-full bg-accent transition-[width] duration-75 ease-linear"
            style={{ width: `${Math.max(0, progress * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-500">
          Window closing
        </p>
      </div>
    </div>
  );
}