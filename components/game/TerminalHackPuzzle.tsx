"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  cycleHackSlot,
  getHackSlotLabel,
  HACK_GROKNET_SUCCESS,
  HACK_GROKNET_WRONG,
  HACK_HINT_LINES,
  HACK_TARGET,
  isHackSequenceCorrect,
  type HackSlotState,
} from "@/lib/perimeter-hack";
import { playInteractSound, playSuccessSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type TerminalHackPuzzleProps = {
  onSuccess: () => void;
  onCancel: () => void;
  onGroknetLine: (line: string) => void;
};

const INITIAL_SLOTS: HackSlotState[] = ["low", "low", "low", "low"];

export function TerminalHackPuzzle({
  onSuccess,
  onCancel,
  onGroknetLine,
}: TerminalHackPuzzleProps) {
  const [slots, setSlots] = useState<HackSlotState[]>(INITIAL_SLOTS);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [hintIndex, setHintIndex] = useState(0);

  const toggleSlot = useCallback((index: number) => {
    playInteractSound();
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? cycleHackSlot(slot) : slot)),
    );
    setStatus("idle");
  }, []);

  const handleSubmit = useCallback(() => {
    playInteractSound();
    if (isHackSequenceCorrect(slots)) {
      setStatus("success");
      playSuccessSound();
      onGroknetLine(HACK_GROKNET_SUCCESS);
      window.setTimeout(onSuccess, 900);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setStatus("error");
    onGroknetLine(
      HACK_GROKNET_WRONG[(nextAttempts - 1) % HACK_GROKNET_WRONG.length],
    );
  }, [attempts, onGroknetLine, onSuccess, slots]);

  const showHint = useCallback(() => {
    playInteractSound();
    onGroknetLine(HACK_HINT_LINES[hintIndex % HACK_HINT_LINES.length]);
    setHintIndex((i) => i + 1);
  }, [hintIndex, onGroknetLine]);

  return (
    <div className="terminal-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-md">
      <div className="terminal-panel-in w-full max-w-lg rounded-sm border border-zinc-800/90 bg-zinc-950 p-5 shadow-2xl shadow-black/70 sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
          Security Hub · Handshake Override
        </p>
        <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.08em] text-zinc-100">
          Sync Perimeter Pulse
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Groknet encrypted the kiosk uplink. Align four signal slots to mirror
          drone S-04&apos;s sweep pattern before the dialogue channel opens.
        </p>

        <div className="mt-5 rounded-sm border border-zinc-800/80 bg-zinc-900/50 p-4">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
            Target pattern (partial telemetry)
          </p>
          <div className="flex justify-center gap-2">
            {HACK_TARGET.map((target, i) => (
              <div
                key={`ghost-${i}`}
                className="flex h-14 w-14 flex-col items-center justify-center rounded-sm border border-dashed border-zinc-700/60 bg-zinc-950/40"
              >
                <span className="font-mono text-[8px] uppercase text-zinc-600">
                  {i + 1}
                </span>
                <span className="font-mono text-[9px] uppercase text-zinc-500">
                  {getHackSlotLabel(target)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
            Your sequence
          </p>
          <div className="flex justify-center gap-2">
            {slots.map((slot, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleSlot(index)}
                className={cn(
                  "hack-slot flex h-16 w-16 flex-col items-center justify-center rounded-sm border font-mono text-[10px] uppercase tracking-widest transition-all",
                  slot === "high"
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : slot === "lock"
                      ? "border-amber-700/50 bg-amber-950/30 text-amber-400"
                      : "border-zinc-700 bg-zinc-900/80 text-zinc-400",
                  status === "error" && "border-red-800/60",
                  status === "success" && "border-emerald-700/60",
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
            Handshake rejected — pattern mismatch
          </p>
        ) : null}
        {status === "success" ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-emerald-500/80">
            Uplink established — opening channel
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="accent"
            onClick={handleSubmit}
            disabled={status === "success"}
            className="h-11 flex-1 font-mono text-xs uppercase tracking-[0.18em]"
          >
            Transmit Handshake
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
          Abort · Return to kiosk
        </button>
      </div>
    </div>
  );
}