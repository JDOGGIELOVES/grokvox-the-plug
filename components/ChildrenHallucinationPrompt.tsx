"use client";

import { useEffect, useState } from "react";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import {
  getChildrenChoiceLabels,
  getChildrenEmotionalBeats,
} from "@/lib/hallucinations/the-children-personalized";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import { cn } from "@/lib/utils";

type ChildrenHallucinationPromptProps = {
  context: ActTwoDialogueContext;
  onChoose: (choice: HallucinationResponseChoice) => void;
  onBreakFree: () => void;
  phase: "rising" | "choices";
};

const GHOST_FIGURES = [
  { left: "18%", height: "h-16", delay: "0s" },
  { left: "34%", height: "h-14", delay: "0.4s" },
  { left: "50%", height: "h-[4.5rem]", delay: "0.2s" },
  { left: "66%", height: "h-14", delay: "0.6s" },
  { left: "82%", height: "h-16", delay: "0.3s" },
] as const;

export function ChildrenHallucinationPrompt({
  context,
  onChoose,
  onBreakFree,
  phase,
}: ChildrenHallucinationPromptProps) {
  const beats = getChildrenEmotionalBeats(context);
  const labels = getChildrenChoiceLabels();
  const [beatIndex, setBeatIndex] = useState(0);

  useEffect(() => {
    if (phase !== "rising") return;
    setBeatIndex(0);
    const interval = window.setInterval(() => {
      setBeatIndex((i) => (i < beats.length - 1 ? i + 1 : i));
    }, 3000);
    return () => window.clearInterval(interval);
  }, [beats.length, phase]);

  const activeBeat = beats[Math.min(beatIndex, beats.length - 1)];

  return (
    <div className="hallucination-choice-in game-readable fixed inset-x-0 bottom-0 z-[49] flex flex-col items-center px-4 pb-6 sm:pb-10">
      <div
        className="pointer-events-none relative mb-3 h-20 w-full max-w-2xl"
        aria-hidden
      >
        {GHOST_FIGURES.map((fig, i) => (
          <div
            key={i}
            className={cn(
              "children-ghost-figure absolute bottom-0 w-5 -translate-x-1/2",
              fig.height,
            )}
            style={{ left: fig.left, animationDelay: fig.delay }}
          >
            <div className="h-[55%] w-full rounded-full border border-amber-400/35 bg-amber-400/[0.08] shadow-[0_0_12px_rgba(251,191,36,0.2)]" />
            <div className="mx-auto mt-0.5 h-[45%] w-[70%] rounded-t-sm border border-amber-400/25 bg-amber-400/[0.05]" />
          </div>
        ))}
        <p className="absolute inset-x-0 bottom-0 text-center font-mono text-[9px] uppercase tracking-[0.35em] text-rose-300/50">
          Wireframe voices · turning toward you
        </p>
      </div>

      <div className="w-full max-w-2xl rounded-sm border border-rose-900/50 bg-zinc-950/95 p-4 shadow-[0_0_48px_rgba(244,63,94,0.15)] backdrop-blur-md sm:p-6">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-amber-300">
          The Children · Containment Loop
        </p>

        <p className="mt-3 text-base leading-relaxed text-amber-50/95 transition-opacity duration-500">
          <span className="text-amber-500/70">[GROKNET] </span>
          {activeBeat}
        </p>

        {phase === "rising" ? (
          <>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-rose-400/70">
              Playground rendering… respond below or break free
            </p>
            <button
              type="button"
              onClick={onBreakFree}
              className="interactable mt-4 w-full rounded-sm border border-amber-900/50 bg-amber-950/25 px-4 py-3 text-left transition-all hover:border-amber-600/60 hover:bg-amber-950/40"
            >
              <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-amber-200">
                Break Free
              </p>
              <p className="mt-1 text-sm text-amber-100/80">
                Tear yourself out of the vision — the Research Wing is still
                here. You won&apos;t be trapped.
              </p>
            </button>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-zinc-300">
              Small figures watch from the wireframe. Choose — or break free when
              you&apos;ve seen enough.
            </p>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {labels.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onChoose(item.id)}
                    className={cn(
                      "interactable group w-full rounded-sm border border-zinc-800/90 bg-zinc-900/70 px-4 py-3 text-left transition-all duration-200",
                      "hover:border-rose-800/60 hover:bg-rose-950/30 hover:shadow-[0_0_16px_rgba(244,63,94,0.12)]",
                    )}
                  >
                    <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-zinc-50 group-hover:text-amber-100">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-300 group-hover:text-zinc-100">
                      {item.description}
                    </p>
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onBreakFree}
              className="interactable mt-4 w-full rounded-sm border border-amber-900/50 bg-amber-950/25 px-4 py-3 text-left transition-all hover:border-amber-600/60 hover:bg-amber-950/40"
            >
              <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-amber-200">
                Break Free
              </p>
              <p className="mt-1 text-sm text-amber-100/80">
                Leave the playground. Central Server Farm waits below — you
                won&apos;t be trapped here.
              </p>
            </button>
          </>
        )}
      </div>
    </div>
  );
}