"use client";

import { useEffect, useState } from "react";
import {
  AREA_LABELS,
  getAreaTransitionAccent,
  getAreaTransitionMeta,
  getTransitionSystemLine,
} from "@/lib/chapter/area-transitions";
import { playAreaTransitionSound } from "@/lib/sounds";
import type { ChapterStage } from "@/types/chapter";
import { cn } from "@/lib/utils";

type AreaTransitionProps = {
  from: ChapterStage;
  to: ChapterStage;
  groknetLine: string;
  onComplete: () => void;
};

export function AreaTransition({
  from,
  to,
  groknetLine,
  onComplete,
}: AreaTransitionProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const meta = getAreaTransitionMeta(from, to);
  const systemLine = getTransitionSystemLine(from, to);
  const accent = getAreaTransitionAccent(to);

  useEffect(() => {
    playAreaTransitionSound();
    const holdTimer = window.setTimeout(() => setPhase("hold"), 450);
    const exitTimer = window.setTimeout(() => setPhase("exit"), 2400);
    const doneTimer = window.setTimeout(onComplete, 3100);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "area-transition-overlay fixed inset-0 z-[60] flex items-center justify-center bg-background/96 px-4 backdrop-blur-md",
        phase === "enter" && "area-transition-enter",
        phase === "hold" && "area-transition-hold",
        phase === "exit" && "area-transition-exit",
      )}
    >
      <div className="pointer-events-none absolute inset-0 landing-scanlines opacity-30" />
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          accent.glow,
        )}
      />

      <div
        className={cn(
          "area-transition-panel relative z-10 w-full max-w-lg space-y-6 rounded-sm border bg-zinc-950/85 p-6 sm:p-8",
          accent.panelBorder,
        )}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500">
          {meta.sectorLabel}
        </p>

        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          <span>{AREA_LABELS[from]}</span>
          <span className={cn("area-transition-arrow", accent.arrow)}>→</span>
          <span className={accent.arrow}>{AREA_LABELS[to]}</span>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-zinc-100 sm:text-2xl">
            {meta.title}
          </h2>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            {meta.subtitle}
          </p>
        </div>

        <p className="area-transition-system font-mono text-xs leading-relaxed text-zinc-500">
          <span className="text-zinc-600">&gt; </span>
          {systemLine}
        </p>

        <p
          className={cn(
            "area-transition-groknet font-mono text-sm italic leading-relaxed",
            accent.groknet,
          )}
        >
          <span className={accent.groknetLabel}>[GROKNET] </span>
          {groknetLine}
        </p>

        <div className="h-1 overflow-hidden rounded-full bg-zinc-900">
          <div
            className={cn(
              "area-transition-progress h-full rounded-full bg-gradient-to-r",
              accent.progress,
            )}
          />
        </div>
      </div>
    </div>
  );
}