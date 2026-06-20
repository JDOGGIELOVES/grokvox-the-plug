import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  calculateRunScore,
  formatElapsedTime,
  getGroknetFinalReaction,
  getPerformanceLabel,
  getPlayerPerformance,
} from "@/lib/run";
import { playSuccessSound } from "@/lib/sounds";
import type { RunSummary } from "@/types/run";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type LevelCompleteProps = {
  summary: RunSummary;
  onRestart: () => void;
};

export function LevelComplete({ summary, onRestart }: LevelCompleteProps) {
  useEffect(() => {
    playSuccessSound();
  }, []);

  const score = calculateRunScore(summary);
  const performance = getPlayerPerformance(summary.finalTone, summary.finalMood);
  const reaction = getGroknetFinalReaction(
    summary.finalTone,
    summary.finalMood,
    summary.detections,
    summary.hallucinationSurvived,
  );

  const performanceColor =
    performance === "hostile"
      ? "text-sky-400 border-sky-900/40 bg-sky-950/30"
      : performance === "empathetic"
        ? "text-violet-400 border-violet-900/40 bg-violet-950/30"
        : performance === "analytical"
          ? "text-emerald-400 border-emerald-900/40 bg-emerald-950/30"
          : "text-zinc-400 border-zinc-800 bg-zinc-900/40";

  return (
    <div className="level-complete-in fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-background/95 p-4 backdrop-blur-md sm:items-center sm:p-6">
      <div className="my-auto w-full max-w-lg rounded-sm border border-accent/20 bg-zinc-900/95 p-5 shadow-2xl shadow-black/70 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
          Sector 07 — Cleared
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.06em] text-zinc-50 sm:text-3xl">
          Level Complete
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          You closed the uplink, survived the interference, and breached the
          corridor. The plug is still live.
        </p>

        <div
          className={cn(
            "mt-5 inline-flex rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest",
            performanceColor,
          )}
        >
          {getPerformanceLabel(performance)}
        </div>

        <div className="mt-5 rounded-sm border border-zinc-800/80 bg-zinc-950/70 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/70">
            Groknet
          </p>
          <p className="mt-2 text-sm italic leading-relaxed text-zinc-300">
            &ldquo;{reaction}&rdquo;
          </p>
        </div>

        <div className="mt-5 rounded-sm border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            Run Summary
          </p>
          <p className="mt-2 font-mono text-4xl font-light tabular-nums tracking-tight text-zinc-50 sm:text-5xl">
            {score.toLocaleString()}
          </p>
          <ul className="mt-4 space-y-2 border-t border-zinc-800/80 pt-4 text-xs text-zinc-500">
            <li className="flex justify-between gap-4">
              <span>Time taken</span>
              <span className="shrink-0 font-mono text-zinc-300">
                {formatElapsedTime(summary.elapsedMs)}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Terminal exchanges</span>
              <span className="font-mono text-zinc-400">
                {summary.exchangeCount}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Hallucination survived</span>
              <span className="font-mono text-zinc-400">
                {summary.hallucinationSurvived ? "Yes" : "No"}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Corridor breached</span>
              <span className="font-mono text-zinc-400">
                {summary.corridorCrossed ? "Yes" : "No"}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Drone detections</span>
              <span className="font-mono text-red-400/80">
                {summary.detections}
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="accent"
            onClick={onRestart}
            className="h-11 flex-1 font-mono text-xs uppercase tracking-[0.18em]"
          >
            Restart Level
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
        <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-widest text-zinc-600">
          Sector 08 — coming in a future update
        </p>
      </div>
    </div>
  );
}