"use client";

import { getHallucinationEvent } from "@/lib/hallucinations";
import type {
  HallucinationEventId,
  HallucinationResponseChoice,
} from "@/types/hallucination";
import { cn } from "@/lib/utils";

type HallucinationChoicePromptProps = {
  eventId: HallucinationEventId;
  onChoose: (choice: HallucinationResponseChoice) => void;
};

export function HallucinationChoicePrompt({
  eventId,
  onChoose,
}: HallucinationChoicePromptProps) {
  const event = getHallucinationEvent(eventId);
  if (!event) return null;

  const isMirror = eventId === "the-mirror";

  return (
    <div className="hallucination-choice-in fixed inset-x-0 bottom-0 z-[48] flex justify-center px-4 pb-6 sm:pb-10">
      <div
        className={cn(
          "w-full max-w-2xl rounded-sm border bg-zinc-950/95 p-4 backdrop-blur-md sm:p-6",
          isMirror
            ? "border-violet-900/50 shadow-[0_0_40px_rgba(139,92,246,0.2)]"
            : "border-red-900/50 shadow-[0_0_40px_rgba(220,38,38,0.2)]",
        )}
      >
        <p
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.35em]",
            isMirror ? "text-violet-400/80" : "text-red-400/80",
          )}
        >
          {event.title} · Respond
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          The vision won't hold forever. How do you answer what you're seeing?
        </p>

        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {event.choices.map((choice) => (
            <li key={choice.id}>
              <button
                type="button"
                onClick={() => onChoose(choice.id)}
                className={cn(
                  "interactable group w-full rounded-sm border border-zinc-800/90 bg-zinc-900/70 px-4 py-3 text-left transition-all duration-200",
                  isMirror
                    ? "hover:border-violet-800/60 hover:bg-violet-950/30 hover:shadow-[0_0_16px_rgba(139,92,246,0.12)]"
                    : "hover:border-red-800/60 hover:bg-red-950/30 hover:shadow-[0_0_16px_rgba(220,38,38,0.12)]",
                )}
              >
                <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-zinc-200 group-hover:text-red-200/90">
                  {choice.label}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 group-hover:text-zinc-400">
                  {choice.description}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}