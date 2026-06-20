"use client";

import type { PersonalityEvolutionBeat } from "@/lib/dialogue/act-two-personality-evolution";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import type { PersonalityEvolutionPath } from "@/types/server-farm";
import { playInteractSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type PersonalityEvolutionPromptProps = {
  beat: PersonalityEvolutionBeat;
  beatIndex: number;
  totalBeats: number;
  currentPath: PersonalityEvolutionPath | null;
  onChoose: (
    path: PersonalityEvolutionPath,
    response: string,
  ) => void;
};

const PATH_STYLES: Record<PersonalityEvolutionPath, string> = {
  melancholic:
    "border-violet-900/40 bg-violet-950/15 hover:border-violet-600/50",
  wrathful: "border-sky-900/40 bg-sky-950/15 hover:border-sky-600/50",
  detached:
    "border-emerald-900/40 bg-emerald-950/15 hover:border-emerald-600/50",
};

const PATH_ACCENT: Record<PersonalityEvolutionPath, string> = {
  melancholic: "text-violet-300",
  wrathful: "text-sky-300",
  detached: "text-emerald-300",
};

export function PersonalityEvolutionPrompt({
  beat,
  beatIndex,
  totalBeats,
  currentPath,
  onChoose,
}: PersonalityEvolutionPromptProps) {
  return (
    <div className="personality-evolution-in fixed inset-0 z-[48] flex items-end justify-center bg-background/90 p-4 backdrop-blur-md sm:items-center">
      <div className="my-auto w-full max-w-lg rounded-sm border border-cyan-900/35 bg-zinc-950/95 p-5 shadow-2xl shadow-black/80 sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-400/80">
          Personality Evolution · Beat {beatIndex + 1} / {totalBeats}
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.08em] text-zinc-100">
          {beat.prompt}
        </h3>

        {currentPath ? (
          <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            Current path · {getEvolutionPathLabel(currentPath)}
          </p>
        ) : null}

        <div className="mt-4 rounded-sm border border-cyan-900/25 bg-cyan-950/12 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/60">
            Groknet
          </p>
          <p className="mt-2 text-sm italic leading-relaxed text-zinc-300">
            {beat.groknetPreamble}
          </p>
        </div>

        <div className="mt-5 space-y-2">
          {beat.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                playInteractSound();
                onChoose(option.id, option.groknetResponse);
              }}
              className={cn(
                "interactable w-full rounded-sm border px-4 py-3 text-left transition-colors",
                PATH_STYLES[option.id],
              )}
            >
              <span
                className={cn(
                  "block font-mono text-[10px] uppercase tracking-widest",
                  PATH_ACCENT[option.id],
                )}
              >
                {option.label}
              </span>
              <span className="mt-1 block text-[11px] leading-relaxed text-zinc-500">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}