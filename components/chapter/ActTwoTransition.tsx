"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getActTwoTransitionBeats,
  type ActTwoTransitionBeat,
} from "@/lib/chapter/act-two-opening";
import { playGroknetVoiceLine } from "@/lib/hallucination";
import {
  playCinematicHitSound,
  playSuccessSound,
  playTerminalKeySound,
} from "@/lib/sounds";
import type { ChapterOneSummary } from "@/types/run";
import { cn } from "@/lib/utils";

type ActTwoTransitionProps = {
  actOne: ChapterOneSummary;
  onComplete: () => void;
};

function speakerLabel(speaker: ActTwoTransitionBeat["speaker"]) {
  switch (speaker) {
    case "groknet":
      return "[GROKNET]";
    case "system":
      return "[FACILITY]";
    default:
      return "[ACT II]";
  }
}

function speakerColor(speaker: ActTwoTransitionBeat["speaker"]) {
  switch (speaker) {
    case "groknet":
      return "text-accent";
    case "system":
      return "text-zinc-400";
    default:
      return "text-violet-300/90";
  }
}

export function ActTwoTransition({ actOne, onComplete }: ActTwoTransitionProps) {
  const beats = getActTwoTransitionBeats(actOne);
  const [visibleCount, setVisibleCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visibleCount === 0) {
      playCinematicHitSound();
    }

    if (visibleCount >= beats.length) {
      const timeout = window.setTimeout(() => setReady(true), 700);
      return () => window.clearTimeout(timeout);
    }

    const beat = beats[visibleCount];
    const delay = beat.delayMs ?? 550;

    const timeout = window.setTimeout(() => {
      setVisibleCount((count) => count + 1);
      if (beat.speaker === "groknet") {
        playGroknetVoiceLine(beat.text);
      } else if (beat.speaker === "system") {
        playTerminalKeySound();
      } else {
        playCinematicHitSound();
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [visibleCount, beats]);

  const handleProceed = useCallback(() => {
    if (!ready || exiting) return;
    setExiting(true);
    playSuccessSound();
    window.setTimeout(onComplete, 700);
  }, [exiting, onComplete, ready]);

  return (
    <div
      className={cn(
        "act-two-transition-in fixed inset-0 z-[55] flex items-center justify-center bg-background/97 px-4 backdrop-blur-md",
        exiting && "act-two-transition-out",
      )}
    >
      <div className="pointer-events-none absolute inset-0 landing-vignette" />
      <div className="pointer-events-none absolute inset-0 landing-scanlines opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_38%,rgba(139,92,246,0.14),transparent_70%)]" />

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-violet-400/80 act-two-title-pulse">
            Act II
          </p>
          <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.1em] text-zinc-50 sm:text-3xl">
            The Conversation
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            Residential Sector · Living Quarters
          </p>
        </div>

        <div className="min-h-[220px] space-y-5">
          {beats.slice(0, visibleCount).map((beat) => (
            <p
              key={beat.id}
              className={cn(
                "opening-beat-in font-mono text-sm leading-relaxed sm:text-base",
                speakerColor(beat.speaker),
              )}
            >
              <span className="opacity-50">{speakerLabel(beat.speaker)} </span>
              {beat.text}
            </p>
          ))}
        </div>

        {ready ? (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleProceed}
              className="act-two-proceed interactable rounded-sm border border-violet-900/40 bg-violet-950/30 px-8 py-3 font-mono text-xs uppercase tracking-[0.22em] text-violet-200 transition-colors hover:border-violet-700/50 hover:bg-violet-950/50"
            >
              Enter Residential Sector
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-1 w-24 overflow-hidden rounded-full bg-zinc-900">
              <span className="act-two-transition-progress block h-full rounded-full bg-gradient-to-r from-violet-900 via-violet-500 to-violet-300" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}