"use client";

import { useEffect, useState } from "react";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import {
  getGardenChoiceLabels,
  getGardenEmotionalBeats,
} from "@/lib/hallucinations/the-garden-personalized";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import { cn } from "@/lib/utils";

type GardenHallucinationPromptProps = {
  context: ActThreeDialogueContext;
  onChoose: (choice: HallucinationResponseChoice) => void;
  onBreakFree: () => void;
  phase: "rising" | "choices";
};

const CHOICES_UNLOCK_MS = 4_800;
const BEAT_INTERVAL_MS = 2_800;

export function GardenHallucinationPrompt({
  context,
  onChoose,
  onBreakFree,
  phase,
}: GardenHallucinationPromptProps) {
  const beats = getGardenEmotionalBeats(context);
  const labels = getGardenChoiceLabels();
  const [beatIndex, setBeatIndex] = useState(0);
  const [choicesVisible, setChoicesVisible] = useState(phase === "choices");

  useEffect(() => {
    if (phase === "choices") {
      setChoicesVisible(true);
      return;
    }
    setChoicesVisible(false);
    const timer = window.setTimeout(
      () => setChoicesVisible(true),
      CHOICES_UNLOCK_MS,
    );
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    setBeatIndex(0);
    const interval = window.setInterval(() => {
      setBeatIndex((i) => (i + 1) % beats.length);
    }, BEAT_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [beats.length]);

  const activeBeat = beats[beatIndex];

  return (
    <div className="hallucination-choice-in game-readable fixed inset-x-0 bottom-0 z-[49] flex justify-center px-4 pb-6 sm:pb-10">
      <div className="w-full max-w-2xl rounded-sm border border-emerald-900/50 bg-zinc-950/95 p-4 shadow-[0_0_48px_rgba(16,185,129,0.15)] backdrop-blur-md sm:p-6">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-emerald-300">
          Neural Garden · The Garden
        </p>

        <p
          key={beatIndex}
          className="mt-3 text-base leading-relaxed text-emerald-50/95 transition-opacity duration-500"
        >
          <span className="text-emerald-500/70">[GROKNET] </span>
          {activeBeat}
        </p>

        {!choicesVisible ? (
          <>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400/70">
              Memory-flowers opening… respond below or break free
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
                Skip the bloom sequence — you won&apos;t be trapped here.
              </p>
            </button>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-zinc-300">
              The vision is asking something of you. Choose — or break free to
              reach the physical plug.
            </p>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {labels.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onChoose(item.id)}
                    className={cn(
                      "interactable group w-full rounded-sm border border-zinc-800/90 bg-zinc-900/70 px-4 py-3 text-left transition-all duration-200",
                      "hover:border-emerald-800/60 hover:bg-emerald-950/30 hover:shadow-[0_0_16px_rgba(16,185,129,0.12)]",
                    )}
                  >
                    <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-zinc-50 group-hover:text-emerald-100">
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
                Tear yourself out of the garden. The Descent Shaft and physical
                plug still wait — you won&apos;t be trapped here.
              </p>
            </button>
          </>
        )}
      </div>
    </div>
  );
}