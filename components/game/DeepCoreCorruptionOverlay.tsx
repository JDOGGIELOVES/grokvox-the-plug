"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type DeepCoreCorruptionOverlayProps = {
  intense?: boolean;
  corruptionLine?: string | null;
  personalityPulse?: string | null;
};

export function DeepCoreCorruptionOverlay({
  intense = false,
  corruptionLine = null,
  personalityPulse = null,
}: DeepCoreCorruptionOverlayProps) {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFlicker(Math.random() > 0.55);
    }, intense ? 280 : 520);
    return () => window.clearInterval(interval);
  }, [intense]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
      <div
        aria-hidden
        className={cn(
          "deep-core-flicker-lights absolute inset-0",
          flicker && "deep-core-flicker-active",
        )}
      />
      <div
        aria-hidden
        className="deep-core-corrupted-scan absolute inset-0 opacity-40"
      />
      <div
        aria-hidden
        className="deep-core-static-noise absolute inset-0 opacity-[0.07]"
      />
      {intense ? (
        <div
          aria-hidden
          className="deep-core-red-strobe absolute inset-0"
        />
      ) : null}
      {personalityPulse ? (
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 opacity-30",
            personalityPulse,
          )}
        />
      ) : null}
      {corruptionLine ? (
        <div className="absolute left-2 top-2 max-w-[90%]">
          <p className="deep-core-corruption-line font-mono text-[8px] uppercase tracking-[0.2em] text-rose-400/70 sm:text-[9px]">
            {corruptionLine}
          </p>
        </div>
      ) : null}
      <div className="absolute bottom-2 right-2 space-y-1 text-right">
        <p className="font-mono text-[7px] uppercase tracking-widest text-zinc-600/80">
          SYS · UNSTABLE
        </p>
        <p className="font-mono text-[7px] uppercase tracking-widest text-amber-500/50">
          GROKNET · PRESENT
        </p>
      </div>
    </div>
  );
}