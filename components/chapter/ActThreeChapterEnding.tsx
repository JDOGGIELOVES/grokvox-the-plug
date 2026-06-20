"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  getActThreeChoiceSummary,
  getActThreePersonalizedFinale,
  RECKONING_ENDINGS,
} from "@/lib/chapter/act-three-ending";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import { getPerformanceLabel, getPlayerPerformance } from "@/lib/run";
import { playInteractSound, playSuccessSound } from "@/lib/sounds";
import type { ChapterThreeSummary } from "@/types/run";
import { cn } from "@/lib/utils";

type ActThreeChapterEndingProps = {
  summary: ChapterThreeSummary;
  onRestart: () => void;
};

export function ActThreeChapterEnding({
  summary,
  onRestart,
}: ActThreeChapterEndingProps) {
  const [revealed, setRevealed] = useState(false);
  const performance = getPlayerPerformance(summary.finalTone, summary.finalMood);
  const choices = getActThreeChoiceSummary(summary);
  const finale = getActThreePersonalizedFinale(summary);
  const ending = RECKONING_ENDINGS[summary.endingId];

  useEffect(() => {
    playSuccessSound();
    const timeout = window.setTimeout(() => setRevealed(true), 120);
    return () => window.clearTimeout(timeout);
  }, []);

  const endingColor =
    summary.endingId === "the-merge"
      ? "text-violet-400 border-violet-900/40 bg-violet-950/30"
      : summary.endingId === "the-plug"
        ? "text-sky-400 border-sky-900/40 bg-sky-950/30"
        : summary.endingId === "the-compromise"
          ? "text-emerald-400 border-emerald-900/40 bg-emerald-950/30"
          : "text-amber-400 border-amber-900/40 bg-amber-950/30";

  return (
    <div className="level-complete-in fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-background/95 p-4 backdrop-blur-md sm:items-center sm:p-6">
      <div
        className={cn(
          "chapter-ending-panel my-auto w-full max-w-xl rounded-sm border border-amber-900/25 bg-zinc-900/95 p-5 shadow-2xl shadow-black/70 sm:p-8",
          revealed && "chapter-ending-revealed",
        )}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-400/80">
          Campaign Complete
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.08em] text-zinc-50">
          Act III — The Reckoning
        </h2>

        <div
          className={cn(
            "mt-4 rounded-sm border px-4 py-3 text-center",
            endingColor,
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em]">
            Ending unlocked
          </p>
          <p className="mt-1 font-display text-lg font-semibold uppercase tracking-[0.06em]">
            {ending.title}
          </p>
          <p className="mt-1 text-xs text-zinc-400">{ending.subtitle}</p>
        </div>

        <div className="mt-5 rounded-sm border border-rose-900/25 bg-rose-950/15 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-rose-400/65">
            Groknet · Final words
          </p>
          <p className="mt-2 text-sm italic leading-relaxed text-zinc-200">
            &ldquo;{finale}&rdquo;
          </p>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <div className="rounded-sm border border-zinc-800 bg-zinc-950/50 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              Approach
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              {getPerformanceLabel(performance)}
            </p>
          </div>
          <div className="rounded-sm border border-zinc-800 bg-zinc-950/50 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              Persona
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              {getPersonalityLabel(
                summary.dominantPersonality,
                summary.finalMood,
              )}
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-3">
          {choices.map((item) => (
            <li
              key={item.label}
              className="chapter-choice-in rounded-sm border border-zinc-800/80 bg-zinc-950/40 px-3 py-2.5"
            >
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                {item.label}
              </p>
              <p className="mt-1 text-sm text-zinc-200">{item.value}</p>
              {item.detail ? (
                <p className="mt-0.5 text-[11px] text-zinc-500">{item.detail}</p>
              ) : null}
            </li>
          ))}
        </ul>

        {summary.personalityEvolutionPath ? (
          <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
            Evolution path ·{" "}
            {getEvolutionPathLabel(summary.personalityEvolutionPath)}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="accent"
            onClick={() => {
              playInteractSound();
              onRestart();
            }}
            className="h-12 flex-1 font-mono text-xs uppercase tracking-[0.18em]"
          >
            Replay Act III
          </Button>
          <Link href="/" className="flex-1">
            <Button
              variant="ghost"
              onClick={() => playInteractSound()}
              className="h-11 w-full font-mono text-xs uppercase tracking-[0.18em]"
            >
              Main Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}