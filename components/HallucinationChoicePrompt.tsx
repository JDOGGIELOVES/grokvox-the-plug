"use client";

import { getHallucinationEvent } from "@/lib/hallucinations";
import type {
  HallucinationEventId,
  HallucinationProfile,
  HallucinationResponseChoice,
} from "@/types/hallucination";
import { cn } from "@/lib/utils";

type HallucinationChoicePromptProps = {
  eventId: HallucinationEventId;
  onChoose: (choice: HallucinationResponseChoice) => void;
  profile?: HallucinationProfile | null;
};

export function HallucinationChoicePrompt({
  eventId,
  onChoose,
  profile = null,
}: HallucinationChoicePromptProps) {
  const event = getHallucinationEvent(eventId);
  if (!event) return null;

  const isMirror = eventId === "the-mirror";
  const isWrathful = profile?.personality === "wrathful-god";
  const isMelancholic = profile?.personality === "melancholic-prophet";
  const isLogician = profile?.personality === "detached-logician";

  return (
    <div className="hallucination-choice-in game-readable fixed inset-x-0 bottom-0 z-[48] flex justify-center px-4 pb-6 sm:pb-10">
      <div
        className={cn(
          "w-full max-w-2xl rounded-sm border bg-zinc-950/95 p-4 backdrop-blur-md sm:p-6",
          isMirror && "border-violet-900/50 shadow-[0_0_40px_rgba(139,92,246,0.2)]",
          isWrathful &&
            !isMirror &&
            "border-red-900/50 shadow-[0_0_40px_rgba(220,38,38,0.2)]",
          isMelancholic &&
            !isMirror &&
            "border-rose-900/45 shadow-[0_0_40px_rgba(244,63,94,0.18)]",
          isLogician &&
            !isMirror &&
            "border-cyan-900/45 shadow-[0_0_40px_rgba(34,211,238,0.15)]",
          !isMirror &&
            !isWrathful &&
            !isMelancholic &&
            !isLogician &&
            "border-red-900/50 shadow-[0_0_40px_rgba(220,38,38,0.2)]",
        )}
      >
        <p
          className={cn(
            "font-mono text-xs uppercase tracking-[0.35em]",
            isMirror && "text-violet-300",
            isWrathful && !isMirror && "text-red-300",
            isMelancholic && !isMirror && "text-rose-300",
            isLogician && !isMirror && "text-cyan-300",
            !isMirror &&
              !isWrathful &&
              !isMelancholic &&
              !isLogician &&
              "text-red-300",
          )}
        >
          {event.title} · Respond
        </p>
        <p className="mt-2 text-base leading-relaxed text-zinc-100">
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
                <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-zinc-50 group-hover:text-orange-100">
                  {choice.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-300 group-hover:text-zinc-100">
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