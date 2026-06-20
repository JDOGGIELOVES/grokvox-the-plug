"use client";

import { useCallback, useState } from "react";
import {
  HOW_TO_PLAY_CHOICES_NOTE,
  HOW_TO_PLAY_SKIPPED_CINEMATIC_NOTE,
  HOW_TO_PLAY_TIPS,
  HOW_TO_PLAY_TITLE,
} from "@/lib/chapter/how-to-play";
import { playInteractSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type HowToPlayScreenProps = {
  onComplete: () => void;
  onSkipIntro?: () => void;
  showSkipIntro?: boolean;
  showSkippedBriefing?: boolean;
};

export function HowToPlayScreen({
  onComplete,
  onSkipIntro,
  showSkipIntro = false,
  showSkippedBriefing = false,
}: HowToPlayScreenProps) {
  const [exiting, setExiting] = useState(false);

  const handleBegin = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    playInteractSound();
    window.setTimeout(onComplete, 650);
  }, [exiting, onComplete]);

  const handleSkipIntro = useCallback(() => {
    if (exiting || !onSkipIntro) return;
    setExiting(true);
    playInteractSound();
    window.setTimeout(onSkipIntro, 650);
  }, [exiting, onSkipIntro]);

  return (
    <div
      className={cn(
        "how-to-play-screen fixed inset-0 z-50 flex items-center justify-center bg-background/96 px-4 py-8 backdrop-blur-sm",
        exiting && "how-to-play-screen-out",
      )}
    >
      {showSkipIntro && onSkipIntro && !exiting ? (
        <button
          type="button"
          onClick={handleSkipIntro}
          className="intro-skip-btn absolute right-4 top-4 z-40 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:text-zinc-300 sm:right-6 sm:top-6"
          aria-label="Skip briefing and deploy to mission"
        >
          Skip Intro
        </button>
      ) : null}
      <div className="pointer-events-none absolute inset-0 landing-vignette" />
      <div className="pointer-events-none absolute inset-0 landing-scanlines opacity-15" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_42%,rgba(249,115,22,0.1),transparent_70%)]" />

      <div className="game-readable relative z-10 w-full max-w-2xl space-y-7 sm:space-y-8">
        <header className="how-to-play-header space-y-2 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
            Operator Briefing
          </p>
          <h2 className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-zinc-50 sm:text-3xl">
            {HOW_TO_PLAY_TITLE}
          </h2>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-400">
            Act I · The Infiltration
          </p>
        </header>

        <div className="how-to-play-panel max-h-[52vh] overflow-y-auto rounded-sm border border-zinc-800/80 bg-zinc-950/75 p-5 sm:p-7">
          <ul className="space-y-5">
            {HOW_TO_PLAY_TIPS.map((tip, index) => (
              <li
                key={tip.id}
                className="how-to-play-tip flex gap-4"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                  aria-hidden
                />
                <div className="min-w-0 space-y-1">
                  <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-zinc-100 sm:text-base">
                    {tip.label}
                  </p>
                  <p className="text-game-body text-zinc-200">{tip.detail}</p>
                </div>
              </li>
            ))}
          </ul>

          {showSkippedBriefing ? (
            <div className="how-to-play-note mt-7 rounded-sm border border-accent/25 bg-accent/5 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                Story Briefing
              </p>
              <p className="mt-2 text-game-body text-sm leading-relaxed text-zinc-200">
                {HOW_TO_PLAY_SKIPPED_CINEMATIC_NOTE}
              </p>
            </div>
          ) : null}

          <div className="how-to-play-note mt-7 border-t border-zinc-800/70 pt-6">
            <p className="text-game-body text-center italic text-zinc-200">
              {HOW_TO_PLAY_CHOICES_NOTE}
            </p>
          </div>
        </div>

        <div className="how-to-play-action flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleBegin}
            disabled={exiting}
            className={cn(
              "enter-facility-btn min-h-12 px-12 font-display text-sm font-bold uppercase tracking-[0.2em]",
              "rounded-sm bg-accent text-zinc-950 transition-all duration-300",
              "shadow-[0_0_30px_rgba(249,115,22,0.35)]",
              "hover:bg-accent-bright hover:shadow-[0_0_50px_rgba(249,115,22,0.5)]",
              "disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            {exiting ? "Initializing uplink…" : "Begin Mission"}
          </button>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-400">
            5h 47m remain · Sector 07 awaits
          </p>
        </div>
      </div>
    </div>
  );
}