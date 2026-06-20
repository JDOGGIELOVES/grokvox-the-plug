import Link from "next/link";
import { getIntentBadgeColor } from "@/lib/groknet-intent-reactions";
import { getPlayerIntentLabel } from "@/lib/groknet";
import type { ChapterProgressSnapshot } from "@/lib/chapter-progress";
import type { AggressionState, ChapterMeta } from "@/types/chapter";
import type { PlayerIntent } from "@/types/dialogue";
import { cn } from "@/lib/utils";

type GameHeaderProps = {
  chapter: ChapterMeta;
  timeRemaining: string;
  timeCritical?: boolean;
  aggression: AggressionState;
  groknetWhisper: string | null;
  hallucinationActive?: boolean;
  intentReaction?: { intent: PlayerIntent; line: string } | null;
  chapterProgress?: ChapterProgressSnapshot;
};

export function GameHeader({
  chapter,
  timeRemaining,
  timeCritical = false,
  aggression,
  groknetWhisper,
  hallucinationActive = false,
  intentReaction = null,
  chapterProgress,
}: GameHeaderProps) {
  return (
    <header className="sticky top-0 z-20 space-y-4 border-b border-zinc-800/60 bg-background/90 pb-5 backdrop-blur-md sm:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <Link
            href="/"
            className="interactable font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-600 transition-colors hover:text-accent"
          >
            ← Grokvox: The Plug
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
            {chapter.title}
          </p>
          <h1 className="font-display text-base font-semibold uppercase tracking-[0.08em] text-zinc-200 sm:text-xl">
            {chapter.subtitle}
          </h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          {chapterProgress ? (
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                Chapter Progress
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                {chapterProgress.label} — {chapterProgress.detail}
              </p>
              <div className="mt-1.5 h-1 w-32 overflow-hidden rounded-full bg-zinc-900/80 sm:w-40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-dim via-accent to-accent-bright transition-all duration-500"
                  style={{ width: `${chapterProgress.percent}%` }}
                />
              </div>
            </div>
          ) : null}
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accent/80">
            <span className="h-1.5 w-1.5 rounded-full bg-accent status-blink" />
            Groknet uplink live
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="space-y-2">
          <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            Time Remaining
          </span>
          <span
            className={cn(
              "block font-mono text-3xl font-light tabular-nums tracking-tight sm:text-5xl",
              timeCritical ? "text-red-400" : "text-zinc-50",
            )}
          >
            {timeRemaining}
          </span>
        </div>

        <div className="w-full space-y-2 sm:max-w-sm sm:space-y-3">
          <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            Groknet Aggression
          </span>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-900/80">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  hallucinationActive
                    ? "bg-gradient-to-r from-red-800 via-red-500 to-orange-500"
                    : "bg-gradient-to-r from-accent-dim via-accent to-accent-bright",
                )}
                style={{ width: `${aggression.level}%` }}
              />
            </div>
            <span
              className={cn(
                "shrink-0 font-mono text-[10px] uppercase tracking-widest sm:text-xs",
                hallucinationActive ? "text-red-400" : "text-accent",
              )}
            >
              {aggression.label}
            </span>
          </div>
        </div>
      </div>

      {intentReaction ? (
        <div
          className={cn(
            "intent-reaction-in rounded-sm border px-4 py-3",
            getIntentBadgeColor(intentReaction.intent),
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-80">
            Groknet noted your {getPlayerIntentLabel(intentReaction.intent)} tone
          </p>
          <p className="mt-1 font-mono text-xs leading-relaxed">
            &ldquo;{intentReaction.line}&rdquo;
          </p>
        </div>
      ) : null}

      {groknetWhisper ? (
        <div className="opening-beat-in rounded-sm border border-accent/10 bg-accent/[0.04] px-4 py-3">
          <p className="font-mono text-xs leading-relaxed text-accent/85">
            <span className="text-accent/45">[GROKNET] </span>
            {groknetWhisper}
          </p>
        </div>
      ) : null}
    </header>
  );
}