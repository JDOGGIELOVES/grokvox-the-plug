"use client";

import type { PlugReckoningOption } from "@/lib/dialogue/act-three-confrontation";
import type { PlugChoice } from "@/types/deep-core";
import { playInteractSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type PlugReckoningPromptProps = {
  options: PlugReckoningOption[];
  onChoose: (choice: PlugChoice, response: string) => void;
};

const CHOICE_STYLES: Record<PlugChoice, string> = {
  stay: "border-violet-900/40 bg-violet-950/15 hover:border-violet-600/50",
  pull: "border-sky-900/40 bg-sky-950/15 hover:border-sky-600/50",
  witness: "border-emerald-900/40 bg-emerald-950/15 hover:border-emerald-600/50",
  carry: "border-amber-900/40 bg-amber-950/15 hover:border-amber-600/50",
  leave: "border-zinc-700/50 bg-zinc-900/40 hover:border-zinc-600/60",
  truth: "border-rose-900/40 bg-rose-950/15 hover:border-rose-600/50",
};

export function PlugReckoningPrompt({
  options,
  onChoose,
}: PlugReckoningPromptProps) {
  return (
    <div className="plug-reckoning-in fixed inset-0 z-[60] flex items-end justify-center bg-background/94 p-4 backdrop-blur-lg sm:items-center">
      <div className="my-auto w-full max-w-xl rounded-sm border border-amber-900/40 bg-zinc-950/98 p-5 shadow-2xl shadow-black/90 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-400/85">
          The Physical Plug · Final Decision
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.1em] text-zinc-50 sm:text-2xl">
          The Reckoning
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          No more visions. No more corridors. The crystalline interface hums
          between you and Groknet. What you do here writes the ending.
        </p>

        <div className="mt-5 space-y-2">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                playInteractSound();
                onChoose(option.id, option.groknetResponse);
              }}
              className={cn(
                "interactable w-full rounded-sm border px-4 py-3 text-left transition-colors",
                CHOICE_STYLES[option.id],
              )}
            >
              <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-100">
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