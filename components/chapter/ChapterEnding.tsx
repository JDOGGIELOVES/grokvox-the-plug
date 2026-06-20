"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ActTwoTeaserPanel } from "@/components/chapter/ActTwoTeaserPanel";
import { Button } from "@/components/ui/Button";
import {
  formatChapterTimeStats,
  getActOneChapterReaction,
  getActOneChoiceSummary,
  getActTwoTeaser,
  getAggressionDisplayColor,
} from "@/lib/chapter-ending";
import {
  calculateRunScore,
  getPerformanceLabel,
  getPlayerPerformance,
} from "@/lib/run";
import { playInteractSound, playSuccessSound } from "@/lib/sounds";
import type { ChapterOneSummary } from "@/types/run";
import { cn } from "@/lib/utils";

type ChapterEndingProps = {
  summary: ChapterOneSummary;
  onRestart: () => void;
  saved?: boolean;
};

export function ChapterEnding({
  summary,
  onRestart,
  saved = true,
}: ChapterEndingProps) {
  const [showActTwoTeaser, setShowActTwoTeaser] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    playSuccessSound();
    const timeout = window.setTimeout(() => setRevealed(true), 120);
    return () => window.clearTimeout(timeout);
  }, []);

  const score = calculateRunScore(summary);
  const performance = getPlayerPerformance(summary.finalTone, summary.finalMood);
  const reaction = getActOneChapterReaction(summary);
  const choices = getActOneChoiceSummary(summary);
  const timeStats = formatChapterTimeStats(summary);
  const actTwo = getActTwoTeaser();
  const aggressionColor = getAggressionDisplayColor(summary.aggressionLabel);

  const performanceColor =
    performance === "hostile"
      ? "text-sky-400 border-sky-900/40 bg-sky-950/30"
      : performance === "empathetic"
        ? "text-violet-400 border-violet-900/40 bg-violet-950/30"
        : performance === "analytical"
          ? "text-emerald-400 border-emerald-900/40 bg-emerald-950/30"
          : "text-zinc-400 border-zinc-800 bg-zinc-900/40";

  return (
    <>
      <div className="level-complete-in fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-background/95 p-4 backdrop-blur-md sm:items-center sm:p-6">
        <div
          className={cn(
            "chapter-ending-panel my-auto w-full max-w-xl rounded-sm border border-accent/20 bg-zinc-900/95 p-5 shadow-2xl shadow-black/70 sm:p-8",
            revealed && "chapter-ending-revealed",
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
            Chapter Complete
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.06em] text-zinc-50 sm:text-3xl">
            Act I — The Infiltration
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            You slipped past the outer grid, weathered Groknet&apos;s escalating
            dialogue, survived three neural cascades, and sealed the Archives Core.
            The infiltration is over. The conversation hasn&apos;t begun — yet.
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
            <div
              className={cn(
                "inline-flex rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest",
                aggressionColor,
              )}
            >
              Aggression · {summary.aggressionLabel} ({summary.aggressionLevel})
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-sm border border-accent/25 bg-gradient-to-br from-accent/[0.07] via-zinc-950/80 to-violet-950/20 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/70">
              Groknet · Final word
            </p>
            <p className="mt-3 text-[15px] italic leading-relaxed text-zinc-100">
              &ldquo;{reaction}&rdquo;
            </p>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              Aggression at seal · {summary.aggressionLabel} ({summary.aggressionLevel})
            </p>
          </div>

          <div className="mt-5 rounded-sm border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
              Your Choices
            </p>
            <ul className="mt-4 space-y-3">
              {choices.map((item, index) => (
                <li
                  key={item.label}
                  className={cn(
                    "border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0 chapter-choice-in",
                  )}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex justify-between gap-4 text-xs">
                    <span className="text-zinc-500">{item.label}</span>
                    <span className="shrink-0 text-right font-mono text-zinc-300">
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

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-sm border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                Time taken
              </p>
              <p className="mt-2 font-mono text-2xl tabular-nums text-zinc-50">
                {timeStats.elapsed}
              </p>
              <p className="mt-1 text-[11px] text-zinc-600">
                {summary.exchangeCount} terminal exchange
                {summary.exchangeCount === 1 ? "" : "s"}
              </p>
            </div>
            <div className="rounded-sm border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                Clock remaining
              </p>
              <p className="mt-2 font-mono text-2xl tabular-nums text-accent">
                {timeStats.remaining}
              </p>
              <p className="mt-1 text-[11px] text-zinc-600">
                Score · {score.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-sm border border-violet-900/25 bg-violet-950/15 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400/80">
              {actTwo.subtitle}
            </p>
            <p className="mt-2 font-display text-sm font-medium uppercase tracking-[0.12em] text-zinc-100">
              {actTwo.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {actTwo.body}
            </p>
          </div>

          {saved ? (
            <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-widest text-emerald-600/80">
              Progress saved locally
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-2">
            <Button
              variant="accent"
              onClick={() => {
                playInteractSound();
                setShowActTwoTeaser(true);
              }}
              className="h-12 w-full font-mono text-xs uppercase tracking-[0.18em] shadow-[0_0_24px_rgba(249,115,22,0.18)]"
            >
              Continue to Act 2 — The Conversation
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="ghost"
                onClick={onRestart}
                className="h-11 flex-1 font-mono text-xs uppercase tracking-[0.18em]"
              >
                Replay Act I
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

      {showActTwoTeaser ? (
        <ActTwoTeaserPanel
          summary={summary}
          onClose={() => setShowActTwoTeaser(false)}
        />
      ) : null}
    </>
  );
}