"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getActOneFinaleBeats,
  type FinaleCinematicBeat,
} from "@/lib/chapter/act-one-finale";
import { playGroknetVoiceLine } from "@/lib/hallucination";
import {
  playCinematicHitSound,
  playSuccessSound,
  playTerminalKeySound,
} from "@/lib/sounds";
import type { ChapterOneSummary } from "@/types/run";
import { cn } from "@/lib/utils";

type ActOneFinaleCinematicProps = {
  summary: ChapterOneSummary;
  onComplete: () => void;
};

function speakerLabel(speaker: FinaleCinematicBeat["speaker"]) {
  switch (speaker) {
    case "groknet":
      return "[GROKNET]";
    case "system":
      return "[FACILITY]";
    default:
      return "[ACT I]";
  }
}

function speakerColor(speaker: FinaleCinematicBeat["speaker"]) {
  switch (speaker) {
    case "groknet":
      return "text-accent";
    case "system":
      return "text-zinc-400";
    default:
      return "text-zinc-300";
  }
}

export function ActOneFinaleCinematic({
  summary,
  onComplete,
}: ActOneFinaleCinematicProps) {
  const beats = getActOneFinaleBeats(summary);
  const [visibleCount, setVisibleCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visibleCount === 0) {
      playCinematicHitSound();
    }

    if (visibleCount >= beats.length) {
      const timeout = window.setTimeout(() => setReady(true), 800);
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
    playSuccessSound();
    window.setTimeout(onComplete, 750);
  }, [exiting, onComplete, ready]);

  return (
    <div
      className={cn(
        "act-finale-cinematic fixed inset-0 z-[55] flex items-center justify-center bg-background/97 px-4 backdrop-blur-md",
        exiting && "act-finale-cinematic-out",
      )}
    >
      <div className="pointer-events-none absolute inset-0 landing-vignette" />
      <div className="pointer-events-none absolute inset-0 landing-scanlines opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_38%,rgba(249,115,22,0.16),transparent_70%)]" />

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-accent act-finale-title-pulse">
            End of Act I
          </p>
          <h2 className="font-display text-2xl font-bold uppercase tracking-[0.12em] text-zinc-50 sm:text-4xl">
            The Infiltration
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            Sector 07 · Archives Core · Breach sealed
          </p>
        </div>

        <div className="max-h-[52vh] space-y-5 overflow-y-auto rounded-sm border border-accent/15 bg-zinc-950/75 p-5 sm:p-8">
          {beats.slice(0, visibleCount).map((beat) => (
            <p
              key={beat.id}
              className={cn(
                "finale-beat-in font-mono text-sm leading-relaxed sm:text-[15px]",
                speakerColor(beat.speaker),
                beat.speaker === "groknet" && "text-[15px] italic sm:text-base",
              )}
            >
              <span className="mr-2 text-[10px] uppercase tracking-widest opacity-60 not-italic">
                {speakerLabel(beat.speaker)}
              </span>
              {beat.text}
            </p>
          ))}
          {visibleCount < beats.length ? (
            <p className="font-mono text-xs text-zinc-600">
              <span className="status-blink inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />{" "}
              Groknet transmitting…
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleProceed}
            disabled={!ready || exiting}
            className={cn(
              "enter-facility-btn min-h-12 px-10 font-display text-sm font-bold uppercase tracking-[0.2em]",
              "rounded-sm bg-accent text-zinc-950 transition-all duration-300",
              "shadow-[0_0_36px_rgba(249,115,22,0.4)]",
              "hover:bg-accent-bright hover:shadow-[0_0_56px_rgba(249,115,22,0.55)]",
              "disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            {exiting ? "Opening debrief…" : "View Chapter Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}