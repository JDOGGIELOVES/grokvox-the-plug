"use client";

import type { RelationshipBeat } from "@/lib/dialogue/act-two-relationship";
import type { RelationshipStance } from "@/types/research-wing";
import { playInteractSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type RelationshipBranchPromptProps = {
  beat: RelationshipBeat;
  beatIndex: number;
  totalBeats: number;
  onChoose: (stance: RelationshipStance, response: string) => void;
};

export function RelationshipBranchPrompt({
  beat,
  beatIndex,
  totalBeats,
  onChoose,
}: RelationshipBranchPromptProps) {
  return (
    <div className="relationship-branch-in fixed inset-0 z-[48] flex items-end justify-center bg-background/88 p-4 backdrop-blur-md sm:items-center">
      <div className="my-auto w-full max-w-lg rounded-sm border border-violet-900/35 bg-zinc-950/95 p-5 shadow-2xl shadow-black/80 sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-violet-400/80">
          Relationship Index · Beat {beatIndex + 1} / {totalBeats}
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.08em] text-zinc-100">
          {beat.prompt}
        </h3>

        <div className="mt-4 rounded-sm border border-violet-900/25 bg-violet-950/15 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-violet-400/60">
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
                option.id === "trust" &&
                  "border-emerald-900/35 bg-emerald-950/10 hover:border-emerald-700/45",
                option.id === "challenge" &&
                  "border-sky-900/35 bg-sky-950/10 hover:border-sky-700/45",
                option.id === "withdraw" &&
                  "border-zinc-700/50 bg-zinc-900/40 hover:border-zinc-600/60",
              )}
            >
              <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-200">
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