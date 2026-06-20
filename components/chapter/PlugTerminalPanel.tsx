"use client";

import { useEffect, useState } from "react";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import {
  getAccumulatedChoiceEntries,
  getAccumulatedChoiceSummary,
} from "@/lib/chapter/act-two-choice-ledger";
import { getPlugHistoryWhisper } from "@/lib/chapter/act-three-history-presence";
import {
  getPersonalityVariant,
} from "@/lib/chapter/act-three-personality-presence";
import { playCinematicHitSound, playInteractSound } from "@/lib/sounds";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type PlugTerminalPanelProps = {
  context: ActThreeDialogueContext;
  onProceed: () => void;
};

function ledgerCtx(ctx: ActThreeDialogueContext) {
  return {
    ...ctx,
    dialogueStarted: true,
    dialogueComplete: true,
    labHacksComplete: ctx.actTwo.labHacksComplete,
    labDialogueComplete: ctx.actTwo.labDialogueComplete,
    labExchangeCount: ctx.actTwo.exchangeCount,
    childrenTriggered: true,
    childrenSurvived: ctx.actTwo.childrenSurvived,
    personalityBeatIndex: 2,
    personalityDialogueComplete: true,
    serverHackComplete: ctx.actTwo.serverHackComplete,
    accumulationTriggered: true,
    accumulationSurvived: ctx.actTwo.accumulationSurvived,
    actTwoStage: "central-server-farm" as const,
    lastConversationTriggered: true,
    lastConversationSurvived: ctx.actTwo.lastConversationSurvived,
    exchangeCount: ctx.actTwo.exchangeCount,
    moveCount: ctx.moveCount,
    relationshipBeatIndex: 2,
    detections: ctx.actOne.detections,
  };
}

export function PlugTerminalPanel({
  context,
  onProceed,
}: PlugTerminalPanelProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [ready, setReady] = useState(false);
  const variant = getPersonalityVariant(context);
  const entries = getAccumulatedChoiceEntries(ledgerCtx(context)).filter(
    (e) => e.choice !== "none",
  );
  const summary = getAccumulatedChoiceSummary(ledgerCtx(context));
  const historyWhisper = getPlugHistoryWhisper(context);

  const terminalLines = [
    "PHYSICAL_PLUG_INTERFACE · GROKNET-07 · FULL PRESENCE",
    `PERSONALITY_LOCK · ${variant?.label ?? "UNSETTLED"}`,
    `CHOICE_SYNTHESIS · ${summary}`,
    ...entries.map((e) => `INDEX · ${e.label} → ${e.choice}`),
    "RECKONING_PROTOCOL · ARMED",
    "…Awaiting human action at the crystalline interface.",
  ];

  useEffect(() => {
    playCinematicHitSound();
    if (visibleLines >= terminalLines.length) {
      const timeout = window.setTimeout(() => setReady(true), 800);
      return () => window.clearTimeout(timeout);
    }
    const timeout = window.setTimeout(() => {
      setVisibleLines((n) => n + 1);
    }, 420);
    return () => window.clearTimeout(timeout);
  }, [visibleLines, terminalLines.length]);

  return (
    <div className="plug-terminal-in fixed inset-0 z-[52] flex items-center justify-center bg-background/94 p-4 backdrop-blur-lg">
      <div
        className={cn(
          "plug-terminal-panel w-full max-w-2xl rounded-sm border bg-zinc-950/98 p-5 shadow-2xl shadow-black/90 sm:p-8",
          variant?.borderClass ?? "border-amber-900/40",
          variant?.pulseClass,
        )}
      >
        <div className="plug-terminal-spine mx-auto mb-6 h-24 w-3 rounded-full bg-gradient-to-b from-amber-200/80 via-amber-400/50 to-transparent shadow-[0_0_40px_rgba(251,191,36,0.35)]" />

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.4em] text-amber-400/80">
          The Physical Plug
        </p>
        <h3
          className={cn(
            "mt-2 text-center font-display text-xl font-semibold uppercase tracking-[0.1em] sm:text-2xl",
            variant?.accentClass ?? "text-zinc-100",
          )}
        >
          Terminal Interface
        </h3>

        <div className="mt-5 min-h-[200px] rounded-sm border border-zinc-800/80 bg-black/50 p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
          {terminalLines.slice(0, visibleLines).map((line, i) => (
            <p
              key={line}
              className={cn(
                "plug-terminal-line-in mb-1.5",
                i === 0 ? "text-amber-400/80" : "text-zinc-400",
                line.startsWith("INDEX") && "text-zinc-500",
                line.startsWith("…") && "text-zinc-200 italic",
              )}
            >
              <span className="text-zinc-600">&gt; </span>
              {line}
            </p>
          ))}
        </div>

        {ready ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-sm border border-zinc-800/80 bg-zinc-900/50 p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                Groknet · Through the plug
              </p>
              <p className="mt-2 text-sm italic leading-relaxed text-zinc-200">
                &ldquo;{historyWhisper}&rdquo;
              </p>
            </div>
            <Button
              variant="accent"
              onClick={() => {
                playInteractSound();
                onProceed();
              }}
              className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_32px_rgba(251,191,36,0.2)]"
            >
              Face the Reckoning
            </Button>
          </div>
        ) : (
          <div className="mt-5 flex justify-center">
            <span className="h-1 w-32 overflow-hidden rounded-full bg-zinc-900">
              <span className="plug-terminal-progress block h-full rounded-full bg-gradient-to-r from-amber-950 via-amber-500 to-amber-200" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}