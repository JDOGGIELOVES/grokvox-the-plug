"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  cycleHackSlot,
  getHackSlotLabel,
  type HackSlotState,
} from "@/lib/perimeter-hack";
import {
  getPersonalizedLockLine,
  getPersonalizedMajorInterferenceLine,
  getPersonalizedMajorWrongLine,
  getPersonalizedTakeoverLine,
  MAJOR_HACK_CONFIG,
  type MajorHackConfig,
} from "@/lib/server-farm-hack";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import {
  playGroknetInterferenceSound,
  playInteractSound,
  playMajorHackTakeoverSound,
  playSuccessSound,
} from "@/lib/sounds";
import { cn } from "@/lib/utils";

type MajorContestedHackProps = {
  config: MajorHackConfig;
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

export function MajorContestedHack({
  config,
  context,
  onSuccess,
  onCancel,
  onGroknetLine,
}: MajorContestedHackProps) {
  const [slots, setSlots] = useState<HackSlotState[]>(
    () => Array(config.target.length).fill("low") as HackSlotState[],
  );
  const [attempts, setAttempts] = useState(0);
  const [interferenceBursts, setInterferenceBursts] = useState(0);
  const [takeoverBursts, setTakeoverBursts] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "error" | "success" | "jam" | "takeover" | "lock"
  >("idle");
  const [hintIndex, setHintIndex] = useState(0);
  const [jammedSlots, setJammedSlots] = useState<number[]>([]);
  const [lockedSlots, setLockedSlots] = useState<Set<number>>(new Set());
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSlots(Array(config.target.length).fill("low") as HackSlotState[]);
    setAttempts(0);
    setInterferenceBursts(0);
    setTakeoverBursts(0);
    setStatus("idle");
    setHintIndex(0);
    setJammedSlots([]);
    setLockedSlots(new Set());
  }, [config.id, config.target.length]);

  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
  }, []);

  const toggleSlot = useCallback(
    (index: number) => {
      if (status === "success" || status === "takeover") return;
      if (lockedSlots.has(index)) {
        onGroknetLine(
          `Slot ${index + 1} locked — I'm holding control. …Wait.`,
          true,
        );
        return;
      }
      playInteractSound();
      setSlots((prev) =>
        prev.map((slot, i) => (i === index ? cycleHackSlot(slot) : slot)),
      );
      setStatus("idle");
    },
    [lockedSlots, onGroknetLine, status],
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
    setJammedSlots([slotA, slotB]);
    playGroknetInterferenceSound();
    onGroknetLine(
      getPersonalizedMajorInterferenceLine(context, interferenceBursts + 1),
      true,
    );
    window.setTimeout(() => {
      setStatus("idle");
      setJammedSlots([]);
    }, 1400);
  }, [config, context, interferenceBursts, onGroknetLine, slots.length]);

  const applyTakeover = useCallback(() => {
    setSlots((prev) => prev.map((slot) => cycleHackSlot(cycleHackSlot(slot))));
    setTakeoverBursts((n) => n + 1);
    setStatus("takeover");
    playMajorHackTakeoverSound();
    onGroknetLine(
      getPersonalizedTakeoverLine(context, takeoverBursts + 1),
      true,
    );
    window.setTimeout(() => setStatus("idle"), 1800);
  }, [context, onGroknetLine, takeoverBursts]);

  const applyLock = useCallback(() => {
    const slot = randomSlotIndex(slots.length);
    setLockedSlots((prev) => new Set([...prev, slot]));
    setStatus("lock");
    onGroknetLine(getPersonalizedLockLine(context, slot), true);
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    lockTimeoutRef.current = setTimeout(() => {
      setLockedSlots(new Set());
      setStatus("idle");
      lockTimeoutRef.current = null;
    }, 2200);
  }, [context, onGroknetLine, slots.length]);

  const isCorrect = useCallback(() => {
    return slots.every((slot, i) => slot === config.target[i]);
  }, [config.target, slots]);

  const handleSubmit = useCallback(() => {
    playInteractSound();
    if (isCorrect()) {
      setStatus("success");
      playSuccessSound();
      onGroknetLine(config.successLine, true);
      window.setTimeout(onSuccess, 1100);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setStatus("error");
    onGroknetLine(
      getPersonalizedMajorWrongLine(context, nextAttempts),
      true,
    );

    const roll = Math.random();
    if (roll < config.takeoverChance) {
      window.setTimeout(applyTakeover, 400);
    } else if (roll < config.takeoverChance + config.lockChance) {
      window.setTimeout(applyLock, 400);
    } else if (roll < config.takeoverChance + config.lockChance + config.interferenceChance) {
      window.setTimeout(applyInterference, 400);
    }
  }, [
    applyInterference,
    applyLock,
    applyTakeover,
    attempts,
    config,
    context,
    isCorrect,
    onGroknetLine,
    onSuccess,
  ]);

  const showHint = useCallback(() => {
    playInteractSound();
    onGroknetLine(config.hintLines[hintIndex % config.hintLines.length], true);
    setHintIndex((i) => i + 1);
  }, [config.hintLines, hintIndex, onGroknetLine]);

  const controlFightLevel = Math.min(
    100,
    40 + interferenceBursts * 8 + takeoverBursts * 15 + attempts * 4,
  );

  return (
    <div className="terminal-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-background/96 p-4 backdrop-blur-md">
      <div className="terminal-panel-in major-contested-panel w-full max-w-xl rounded-sm border border-cyan-900/40 bg-zinc-950 p-5 shadow-2xl shadow-black/80 sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-400/80">
          Central Server Farm · {config.label}
        </p>
        <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.08em] text-zinc-100">
          {config.title}
        </h2>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-cyan-500/60">
          {config.subtitle}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Groknet is fighting for terminal control — not just scrambling slots.
          Wrong transmits trigger interference, slot locks, or full takeover sweeps.
        </p>

        <div className="mt-4 rounded-sm border border-rose-900/30 bg-rose-950/12 px-3 py-2">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-rose-300/75">
            <span>Control fight intensity</span>
            <span>{controlFightLevel}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-zinc-900">
            <div
              className="major-control-bar h-full bg-gradient-to-r from-cyan-600/70 to-rose-500/80 transition-all duration-500"
              style={{ width: `${controlFightLevel}%` }}
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
            PRIME sequence · {config.target.length} channels
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {slots.map((slot, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleSlot(index)}
                disabled={status === "success" || status === "takeover"}
                className={cn(
                  "hack-slot flex h-14 w-14 flex-col items-center justify-center rounded-sm border font-mono text-[9px] uppercase tracking-widest transition-all sm:h-16 sm:w-16",
                  slot === "high"
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : slot === "lock"
                      ? "border-cyan-700/50 bg-cyan-950/30 text-cyan-400"
                      : "border-zinc-700 bg-zinc-900/80 text-zinc-400",
                  status === "error" && "border-red-800/60",
                  status === "success" && "border-emerald-700/60",
                  (status === "jam" && jammedSlots.includes(index)) ||
                    (status === "lock" && lockedSlots.has(index))
                    ? "major-slot-fight border-rose-500/70 bg-rose-950/30"
                    : null,
                )}
              >
                <span className="text-[7px] text-zinc-600">{index + 1}</span>
                {getHackSlotLabel(slot)}
              </button>
            ))}
          </div>
        </div>

        {status === "error" ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-red-400/80">
            PRIME rejected — Groknet escalates control fight
          </p>
        ) : null}
        {status === "jam" ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-rose-400/80">
            Interference — channels scrambled
          </p>
        ) : null}
        {status === "lock" ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-amber-400/80">
            Groknet lock — slot frozen
          </p>
        ) : null}
        {status === "takeover" ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-rose-300/90">
            TAKEOVER — Groknet cycling all channels
          </p>
        ) : null}
        {status === "success" ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-emerald-500/80">
            CSF-PRIME-00 · Control yielded
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="accent"
            onClick={handleSubmit}
            disabled={status === "success" || status === "takeover"}
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
          Abort · Return to farm
        </button>
      </div>
    </div>
  );
}

export { MAJOR_HACK_CONFIG } from "@/lib/server-farm-hack";