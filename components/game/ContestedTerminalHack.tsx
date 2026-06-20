"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  cycleHackSlot,
  getHackSlotLabel,
  type HackSlotState,
} from "@/lib/perimeter-hack";
import {
  getPersonalizedHackWrongLine,
  getPersonalizedInterferenceLine,
  type LabHackConfig,
} from "@/lib/research-wing-hack";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import {
  playGroknetInterferenceSound,
  playInteractSound,
  playSuccessSound,
} from "@/lib/sounds";
import { cn } from "@/lib/utils";

type ContestedTerminalHackProps = {
  config: LabHackConfig;
  context: ActTwoDialogueContext;
  onSuccess: () => void;
  onCancel: () => void;
  onGroknetLine: (line: string, speak?: boolean) => void;
};

function randomSlotIndex(length: number, exclude?: number): number {
  if (length <= 1) return 0;
  let index = Math.floor(Math.random() * length);
  if (exclude !== undefined && index === exclude && length > 1) {
    index = (index + 1) % length;
  }
  return index;
}

export function ContestedTerminalHack({
  config,
  context,
  onSuccess,
  onCancel,
  onGroknetLine,
}: ContestedTerminalHackProps) {
  const [slots, setSlots] = useState<HackSlotState[]>(
    () => Array(config.target.length).fill("low") as HackSlotState[],
  );
  const [attempts, setAttempts] = useState(0);
  const [interferenceBursts, setInterferenceBursts] = useState(0);
  const [status, setStatus] = useState<"idle" | "error" | "success" | "jam">(
    "idle",
  );
  const [hintIndex, setHintIndex] = useState(0);
  const [jammedSlot, setJammedSlot] = useState<number | null>(null);

  useEffect(() => {
    setSlots(Array(config.target.length).fill("low") as HackSlotState[]);
    setAttempts(0);
    setInterferenceBursts(0);
    setStatus("idle");
    setHintIndex(0);
    setJammedSlot(null);
  }, [config.id, config.target.length]);

  const toggleSlot = useCallback(
    (index: number) => {
      if (status === "success" || status === "jam") return;
      playInteractSound();
      setSlots((prev) =>
        prev.map((slot, i) => (i === index ? cycleHackSlot(slot) : slot)),
      );
      setStatus("idle");
      setJammedSlot(null);
    },
    [status],
  );

  const applyInterference = useCallback(() => {
    const slotA = randomSlotIndex(slots.length);
    const slotB = randomSlotIndex(slots.length, slotA);

    setSlots((prev) =>
      prev.map((slot, i) => {
        if (i === slotA || i === slotB) return cycleHackSlot(cycleHackSlot(slot));
        return slot;
      }),
    );
    setInterferenceBursts((n) => n + 1);
    setStatus("jam");
    setJammedSlot(slotA);
    playGroknetInterferenceSound();
    onGroknetLine(
      getPersonalizedInterferenceLine(config, context, interferenceBursts + 1),
      true,
    );

    window.setTimeout(() => setStatus("idle"), 1200);
  }, [config, context, interferenceBursts, onGroknetLine, slots.length]);

  const isCorrect = useCallback(() => {
    return slots.every((slot, i) => slot === config.target[i]);
  }, [config.target, slots]);

  const handleSubmit = useCallback(() => {
    playInteractSound();
    if (isCorrect()) {
      setStatus("success");
      playSuccessSound();
      onGroknetLine(config.successLine, true);
      window.setTimeout(onSuccess, 900);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setStatus("error");
    onGroknetLine(
      getPersonalizedHackWrongLine(config, context, nextAttempts),
      nextAttempts >= 2,
    );

    if (Math.random() < config.interferenceChance) {
      window.setTimeout(applyInterference, 500);
    }
  }, [
    applyInterference,
    attempts,
    config,
    context,
    isCorrect,
    onGroknetLine,
    onSuccess,
  ]);

  const showHint = useCallback(() => {
    playInteractSound();
    onGroknetLine(config.hintLines[hintIndex % config.hintLines.length]);
    setHintIndex((i) => i + 1);
  }, [config.hintLines, hintIndex, onGroknetLine]);

  return (
    <div className="terminal-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-md">
      <div className="terminal-panel-in contested-terminal-panel w-full max-w-lg rounded-sm border border-amber-900/35 bg-zinc-950 p-5 shadow-2xl shadow-black/70 sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-amber-400/80">
          Research Wing · {config.label}
        </p>
        <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.08em] text-zinc-100">
          {config.title}
        </h2>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-amber-500/60">
          {config.subtitle}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Groknet is contesting this uplink in real time. Wrong patterns trigger
          interference — he may scramble your slots and comment on every miss.
        </p>

        <div className="mt-5 rounded-sm border border-amber-900/25 bg-amber-950/10 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-widest text-amber-400/70">
            Interference risk · {(config.interferenceChance * 100).toFixed(0)}%
          </p>
        </div>

        <div className="mt-5">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
            Signal sequence
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {slots.map((slot, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleSlot(index)}
                disabled={status === "success"}
                className={cn(
                  "hack-slot flex h-16 w-16 flex-col items-center justify-center rounded-sm border font-mono text-[10px] uppercase tracking-widest transition-all",
                  slot === "high"
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : slot === "lock"
                      ? "border-amber-700/50 bg-amber-950/30 text-amber-400"
                      : "border-zinc-700 bg-zinc-900/80 text-zinc-400",
                  status === "error" && "border-red-800/60",
                  status === "success" && "border-emerald-700/60",
                  status === "jam" &&
                    jammedSlot === index &&
                    "contested-slot-jam border-rose-500/70 bg-rose-950/30",
                )}
              >
                <span className="text-[8px] text-zinc-600">{index + 1}</span>
                {getHackSlotLabel(slot)}
              </button>
            ))}
          </div>
        </div>

        {status === "error" ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-red-400/80">
            Handshake rejected — Groknet noted the miss
          </p>
        ) : null}
        {status === "jam" ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-rose-400/80">
            Groknet interference — slots scrambled
          </p>
        ) : null}
        {status === "success" ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-emerald-500/80">
            Contested uplink established
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="accent"
            onClick={handleSubmit}
            disabled={status === "success"}
            className="h-11 flex-1 font-mono text-xs uppercase tracking-[0.18em]"
          >
            Transmit Override
          </Button>
          <Button
            variant="ghost"
            onClick={showHint}
            className="h-11 font-mono text-[10px] uppercase tracking-widest"
          >
            Request Hint
          </Button>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="mt-4 w-full font-mono text-[10px] uppercase tracking-widest text-zinc-600 transition-colors hover:text-zinc-400"
        >
          Abort · Return to lab
        </button>
      </div>
    </div>
  );
}