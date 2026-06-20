"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ActThreeTeaserPanel } from "@/components/chapter/ActThreeTeaserPanel";
import { Button } from "@/components/ui/Button";
import {
  getActTwoChoiceSummary,
  getActTwoPersonalizedFinale,
} from "@/lib/chapter/act-two-ending";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import { getPerformanceLabel, getPlayerPerformance } from "@/lib/run";
import { playInteractSound, playSuccessSound } from "@/lib/sounds";
import type { ChapterTwoSummary } from "@/types/run";
import { cn } from "@/lib/utils";

type ActTwoChapterEndingProps = {
  summary: ChapterTwoSummary;
  onRestart: () => void;
};

function relationshipLabel(
  stance: ChapterTwoSummary["relationshipStance"],
): string {
  if (stance === "trust") return "Trust";
  if (stance === "challenge") return "Challenge";
  if (stance === "withdraw") return "Withdrawal";
  return "Unindexed";
}

export function ActTwoChapterEnding({
  summary,
  onRestart,
}: ActTwoChapterEndingProps) {
  const [revealed, setRevealed] = useState(false);
  const [showActThreeTeaser, setShowActThreeTeaser] = useState(false);
  const performance = getPlayerPerformance(summary.finalTone, summary.finalMood);
  const choices = getActTwoChoiceSummary(summary);
  const finale = getActTwoPersonalizedFinale(summary);

  useEffect(() => {
    playSuccessSound();
    const timeout = window.setTimeout(() => setRevealed(true), 120);
    return () => window.clearTimeout(timeout);
  }, []);

  const performanceColor =
    performance === "hostile"
      ? "text-sky-400 border-sky-900/40 bg-sky-950/30"
      : performance === "empathetic"
        ? "text-violet-400 border-violet-900/40 bg-violet-950/30"
        : performance === "analytical"
          ? "text-emerald-400 border-emerald-900/40 bg-emerald-950/30"
          : "text-zinc-400 border-zinc-800 bg-zinc-900/40";

  const stanceColor =
    summary.relationshipStance === "trust"
      ? "text-emerald-400 border-emerald-900/40 bg-emerald-950/30"
      : summary.relationshipStance === "challenge"
        ? "text-sky-400 border-sky-900/40 bg-sky-950/30"
        : summary.relationshipStance === "withdraw"
          ? "text-zinc-400 border-zinc-800 bg-zinc-900/40"
          : "text-amber-400 border-amber-900/40 bg-amber-950/30";

  const evolutionColor =
    summary.personalityEvolutionPath === "melancholic"
      ? "text-violet-400 border-violet-900/40 bg-violet-950/30"
      : summary.personalityEvolutionPath === "wrathful"
        ? "text-sky-400 border-sky-900/40 bg-sky-950/30"
        : summary.personalityEvolutionPath === "detached"
          ? "text-emerald-400 border-emerald-900/40 bg-emerald-950/30"
          : "text-cyan-400 border-cyan-900/40 bg-cyan-950/30";

  return (
    <>
      <div className="level-complete-in fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-background/95 p-4 backdrop-blur-md sm:items-center sm:p-6">
        <div
          className={cn(
            "chapter-ending-panel my-auto w-full max-w-xl rounded-sm border border-cyan-900/25 bg-zinc-900/95 p-5 shadow-2xl shadow-black/70 sm:p-8",
            revealed && "chapter-ending-revealed",
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-400">
            Act II Debrief
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.06em] text-zinc-50 sm:text-3xl">
            The Conversation
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Three layers. One dialogue. You crossed the Residential Sector, contested
            the Research Wing, and reached the peak at the Central Server Farm.
            Groknet spoke from every choice you made — in Act I and Act II.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <div
              className={cn(
                "inline-flex rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest",
                performanceColor,
              )}
            >
              {getPerformanceLabel(performance)}
            </div>
            <div className="inline-flex rounded-sm border border-violet-900/40 bg-violet-950/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-violet-400">
              {getPersonalityLabel(
                summary.dominantPersonality,
                summary.finalMood,
              )}
            </div>
            <div
              className={cn(
                "inline-flex rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest",
                stanceColor,
              )}
            >
              {relationshipLabel(summary.relationshipStance)}
            </div>
            {summary.personalityEvolutionPath ? (
              <div
                className={cn(
                  "inline-flex rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest",
                  evolutionColor,
                )}
              >
                {getEvolutionPathLabel(summary.personalityEvolutionPath)}
              </div>
            ) : null}
          </div>

          <div className="mt-5 overflow-hidden rounded-sm border border-cyan-900/25 bg-gradient-to-br from-cyan-950/15 via-zinc-950/80 to-violet-950/20 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">
              Groknet · Final word
            </p>
            <p className="mt-3 text-[15px] italic leading-relaxed text-zinc-100">
              &ldquo;{finale}&rdquo;
            </p>
          </div>

          <div className="mt-5 rounded-sm border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
              Your Synthesis
            </p>
            <ul className="mt-4 space-y-3">
              {choices.map((item, index) => (
                <li
                  key={item.label}
                  className={cn(
                    "choice-reveal-in border-b border-zinc-800/80 pb-3 last:border-0 last:pb-0",
                  )}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      {item.label}
                    </span>
                    <span className="font-mono text-xs text-zinc-200">
                      {item.value}
                    </span>
                  </div>
                  {item.detail ? (
                    <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
                      {item.detail}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-widest text-emerald-600/80">
            Act II synthesis saved locally
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <Button
              variant="accent"
              onClick={() => {
                playInteractSound();
                setShowActThreeTeaser(true);
              }}
              className="h-12 w-full font-mono text-xs uppercase tracking-[0.18em] shadow-[0_0_28px_rgba(244,63,94,0.2)]"
            >
              Continue to Act III · The Reckoning
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="ghost"
                onClick={onRestart}
                className="h-11 flex-1 font-mono text-xs uppercase tracking-[0.18em]"
              >
                Replay Act II
              </Button>
              <Link href="/" className="flex-1">
                <Button
                  variant="ghost"
                  className="h-11 w-full font-mono text-xs uppercase tracking-[0.18em]"
                >
                  Return to Main Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showActThreeTeaser ? (
        <ActThreeTeaserPanel
          summary={summary}
          onClose={() => setShowActThreeTeaser(false)}
        />
      ) : null}
    </>
  );
}