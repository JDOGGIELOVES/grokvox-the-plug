"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getActTwoFinaleBeats,
  type ActTwoFinaleBeat,
} from "@/lib/chapter/act-two-ending";
import { playGroknetVoiceLine } from "@/lib/hallucination";
import {
  playActTwoFinaleSound,
  playCinematicHitSound,
  playTerminalKeySound,
} from "@/lib/sounds";
import type { ChapterTwoSummary } from "@/types/run";
import { cn } from "@/lib/utils";

type ActTwoFinaleProps = {
  summary: ChapterTwoSummary;
  onComplete: () => void;
};

function speakerLabel(speaker: ActTwoFinaleBeat["speaker"]) {
  switch (speaker) {
    case "groknet":
      return "[GROKNET]";
    case "system":
      return "[FACILITY]";
    default:
      return "[ACT II]";
  }
}

function speakerColor(speaker: ActTwoFinaleBeat["speaker"]) {
  switch (speaker) {
    case "groknet":
      return "text-accent";
    case "system":
      return "text-cyan-400/80";
    default:
      return "text-violet-300/90";
  }
}

export function ActTwoFinale({ summary, onComplete }: ActTwoFinaleProps) {
  const beats = getActTwoFinaleBeats(summary);
  const [visibleCount, setVisibleCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visibleCount === 0) {
      playActTwoFinaleSound();
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
        "act-two-finale-in fixed inset-0 z-[58] flex items-center justify-center bg-background/98 px-4 backdrop-blur-lg",
        exiting && "act-two-finale-out",
      )}
    >
      <div className="pointer-events-none absolute inset-0 act-two-finale-vignette" />
      <div className="pointer-events-none absolute inset-0 landing-scanlines opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_40%,rgba(34,211,238,0.12),transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_60%,rgba(139,92,246,0.1),transparent_70%)]" />

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-cyan-400/80 act-two-finale-title-pulse">
            End of Act II
          </p>
          <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.1em] text-zinc-50 sm:text-3xl">
            The Conversation
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            Residential · Research Wing · Central Server Farm
          </p>
        </div>

        <div className="act-two-finale-beats min-h-[260px] space-y-5">
          {beats.slice(0, visibleCount).map((beat) => (
            <p
              key={beat.id}
              className={cn(
                "act-two-finale-beat-in font-mono text-sm leading-relaxed sm:text-base",
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
              className="act-two-finale-proceed interactable rounded-sm border border-cyan-900/40 bg-cyan-950/30 px-8 py-3 font-mono text-xs uppercase tracking-[0.22em] text-cyan-200 transition-colors hover:border-cyan-700/50 hover:bg-cyan-950/50"
            >
              View Debrief
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-1 w-32 overflow-hidden rounded-full bg-zinc-900">
              <span className="act-two-finale-progress block h-full rounded-full bg-gradient-to-r from-violet-900 via-cyan-600 to-cyan-300" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}