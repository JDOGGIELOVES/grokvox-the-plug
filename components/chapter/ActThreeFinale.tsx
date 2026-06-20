"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getActThreeFinaleBeats,
  RECKONING_ENDINGS,
  type ActThreeFinaleBeat,
} from "@/lib/chapter/act-three-ending";
import { getEndingCinematicClass } from "@/lib/chapter/act-three-finale-cinematics";
import { playGroknetVoiceLine } from "@/lib/hallucination";
import {
  playActThreeFinaleSound,
  playCinematicHitSound,
  playTerminalKeySound,
} from "@/lib/sounds";
import type { ChapterThreeSummary } from "@/types/run";
import { cn } from "@/lib/utils";

type ActThreeFinaleProps = {
  summary: ChapterThreeSummary;
  onComplete: () => void;
};

function speakerLabel(speaker: ActThreeFinaleBeat["speaker"]) {
  switch (speaker) {
    case "groknet":
      return "[GROKNET]";
    case "system":
      return "[FACILITY]";
    default:
      return "[ACT III]";
  }
}

function speakerColor(speaker: ActThreeFinaleBeat["speaker"]) {
  switch (speaker) {
    case "groknet":
      return "text-accent";
    case "system":
      return "text-amber-400/80";
    default:
      return "text-rose-300/90";
  }
}

export function ActThreeFinale({ summary, onComplete }: ActThreeFinaleProps) {
  const beats = getActThreeFinaleBeats(summary);
  const ending = RECKONING_ENDINGS[summary.endingId];
  const cinematicClass = getEndingCinematicClass(summary.endingId);
  const [visibleCount, setVisibleCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visibleCount === 0) {
      playActThreeFinaleSound();
    }

    if (visibleCount >= beats.length) {
      const timeout = window.setTimeout(() => setReady(true), 900);
      return () => window.clearTimeout(timeout);
    }

    const beat = beats[visibleCount];
    const delay = beat.delayMs ?? 600;

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
    playCinematicHitSound();
    window.setTimeout(onComplete, 800);
  }, [exiting, onComplete, ready]);

  return (
    <div
      className={cn(
        "act-three-finale-in fixed inset-0 z-[58] flex items-center justify-center bg-background/98 px-4 backdrop-blur-lg",
        cinematicClass,
        exiting && "act-three-finale-out",
      )}
    >
      <div className="pointer-events-none absolute inset-0 act-three-finale-vignette" />
      <div className="pointer-events-none absolute inset-0 act-three-finale-cinematic-glow" />
      <div className="pointer-events-none absolute inset-0 landing-scanlines opacity-25" />

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-amber-400/80 act-three-finale-title-pulse">
            {ending.title}
          </p>
          <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.1em] text-zinc-50 sm:text-3xl">
            The Reckoning
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            {ending.cinematicTagline}
          </p>
        </div>

        <div className="act-three-finale-beats min-h-[300px] space-y-5">
          {beats.slice(0, visibleCount).map((beat) => (
            <p
              key={beat.id}
              className={cn(
                "act-three-finale-beat-in font-mono text-sm leading-relaxed sm:text-base",
                speakerColor(beat.speaker),
                beat.speaker === "groknet" && "text-[15px] italic sm:text-base",
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
              className="act-three-finale-proceed interactable rounded-sm border border-amber-900/40 bg-amber-950/30 px-8 py-3 font-mono text-xs uppercase tracking-[0.22em] text-amber-200 transition-colors hover:border-amber-700/50 hover:bg-amber-950/50"
            >
              View Ending Debrief
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-1 w-32 overflow-hidden rounded-full bg-zinc-900">
              <span className="act-three-finale-progress block h-full rounded-full bg-gradient-to-r from-rose-900 via-amber-600 to-amber-300" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}