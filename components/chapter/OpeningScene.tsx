"use client";

import { useCallback, useEffect, useState } from "react";
import { OPENING_BEATS, OPENING_COMPLETE_LINE } from "@/lib/chapter/opening";
import { playGroknetVoiceLine } from "@/lib/hallucination";
import { playTerminalKeySound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type OpeningSceneProps = {
  onComplete: () => void;
};

function getSpeakerLabel(speaker: (typeof OPENING_BEATS)[number]["speaker"]) {
  switch (speaker) {
    case "groknet":
      return "[GROKNET]";
    case "system":
      return "[FACILITY]";
    default:
      return "[LOG]";
  }
}

function getSpeakerColor(speaker: (typeof OPENING_BEATS)[number]["speaker"]) {
  switch (speaker) {
    case "groknet":
      return "text-accent";
    case "system":
      return "text-zinc-200";
    default:
      return "text-zinc-300";
  }
}

export function OpeningScene({ onComplete }: OpeningSceneProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visibleCount >= OPENING_BEATS.length) {
      const timeout = window.setTimeout(() => setReady(true), 600);
      return () => window.clearTimeout(timeout);
    }

    const beat = OPENING_BEATS[visibleCount];
    const delay = beat.delayMs ?? 400;

    const timeout = window.setTimeout(() => {
      setVisibleCount((count) => count + 1);
      if (beat.speaker === "groknet") {
        playGroknetVoiceLine(beat.text);
      } else {
        playTerminalKeySound();
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [visibleCount]);

  const handleProceed = useCallback(() => {
    if (!ready || exiting) return;
    setExiting(true);
    playGroknetVoiceLine(OPENING_COMPLETE_LINE);
    window.setTimeout(onComplete, 700);
  }, [exiting, onComplete, ready]);

  return (
    <div
      className={cn(
        "opening-scene-in fixed inset-0 z-50 flex items-center justify-center bg-background/95 px-4 backdrop-blur-sm",
        exiting && "opening-scene-out",
      )}
    >
      <div className="pointer-events-none absolute inset-0 landing-vignette" />
      <div className="pointer-events-none absolute inset-0 landing-scanlines opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(249,115,22,0.12),transparent_70%)]" />

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <div className="space-y-1 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
            Act I · The Infiltration
          </p>
          <h2 className="font-display text-2xl font-bold uppercase tracking-[0.1em] text-zinc-100 sm:text-3xl">
            Sector 07 Breach
          </h2>
        </div>

        <div className="max-h-[50vh] space-y-4 overflow-y-auto rounded-sm border border-zinc-800/80 bg-zinc-950/70 p-5 sm:p-7">
          {OPENING_BEATS.slice(0, visibleCount).map((beat) => (
            <p
              key={beat.id}
              className={cn(
                "opening-beat-in font-mono text-base leading-relaxed text-zinc-100 sm:text-[17px]",
                getSpeakerColor(beat.speaker),
              )}
            >
              <span className="mr-2 text-xs uppercase tracking-widest text-accent">
                {getSpeakerLabel(beat.speaker)}
              </span>
              {beat.text}
            </p>
          ))}
          {visibleCount < OPENING_BEATS.length ? (
            <p className="font-mono text-sm text-zinc-300">
              <span className="status-blink inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />{" "}
              Receiving transmission…
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
              "shadow-[0_0_30px_rgba(249,115,22,0.35)]",
              "hover:bg-accent-bright hover:shadow-[0_0_50px_rgba(249,115,22,0.5)]",
              "disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            {exiting ? "Deploying to perimeter…" : "Enter Outer Perimeter"}
          </button>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-300">
            {ready ? "Groknet is listening" : "Establishing uplink…"}
          </p>
        </div>
      </div>
    </div>
  );
}