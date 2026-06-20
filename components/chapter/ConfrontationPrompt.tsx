"use client";

import type { ConfrontationBeat } from "@/lib/dialogue/act-three-confrontation";
import { playInteractSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type ConfrontationPromptProps = {
  beat: ConfrontationBeat;
  beatIndex: number;
  totalBeats: number;
  accent?: "rose" | "amber";
  onChoose: (
    responseId: "acknowledge" | "defy" | "question",
    response: string,
  ) => void;
};

export function ConfrontationPrompt({
  beat,
  beatIndex,
  totalBeats,
  accent = "rose",
  onChoose,
}: ConfrontationPromptProps) {
  const border =
    accent === "amber" ? "border-amber-900/35" : "border-rose-900/35";
  const label =
    accent === "amber" ? "text-amber-400/80" : "text-rose-400/80";
  const panel =
    accent === "amber" ? "border-amber-900/25 bg-amber-950/15" : "border-rose-900/25 bg-rose-950/15";

  return (
    <div className="confrontation-prompt-in fixed inset-0 z-[48] flex items-end justify-center bg-background/88 p-4 backdrop-blur-md sm:items-center">
      <div
        className={cn(
          "my-auto w-full max-w-lg rounded-sm border bg-zinc-950/95 p-5 shadow-2xl shadow-black/80 sm:p-7",
          border,
        )}
      >
        <p className={cn("font-mono text-[10px] uppercase tracking-[0.35em]", label)}>
          Reckoning Dialogue · Beat {beatIndex + 1} / {totalBeats}
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.08em] text-zinc-100">
          {beat.prompt}
        </h3>

        <div className={cn("mt-4 rounded-sm border p-4", panel)}>
          <p className={cn("font-mono text-[10px] uppercase tracking-widest", label)}>
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
                option.id === "acknowledge" &&
                  "border-emerald-900/35 bg-emerald-950/10 hover:border-emerald-700/45",
                option.id === "defy" &&
                  "border-sky-900/35 bg-sky-950/10 hover:border-sky-700/45",
                option.id === "question" &&
                  "border-violet-900/35 bg-violet-950/10 hover:border-violet-700/45",
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