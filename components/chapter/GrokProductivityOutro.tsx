"use client";

import { useCallback, useEffect, useState } from "react";
import { playCinematicHitSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type GrokProductivityOutroProps = {
  onComplete: () => void;
};

const GROK_SEARCHER_URL = "https://www.groksearcher.com";

export function GrokProductivityOutro({ onComplete }: GrokProductivityOutroProps) {
  const [lineOneVisible, setLineOneVisible] = useState(false);
  const [lineTwoVisible, setLineTwoVisible] = useState(false);
  const [linkVisible, setLinkVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const lineOne = window.setTimeout(() => setLineOneVisible(true), 600);
    const lineTwo = window.setTimeout(() => setLineTwoVisible(true), 1600);
    const link = window.setTimeout(() => setLinkVisible(true), 2600);
    const proceed = window.setTimeout(() => setReady(true), 3400);

    return () => {
      window.clearTimeout(lineOne);
      window.clearTimeout(lineTwo);
      window.clearTimeout(link);
      window.clearTimeout(proceed);
    };
  }, []);

  const handleProceed = useCallback(() => {
    if (!ready || exiting) return;
    setExiting(true);
    playCinematicHitSound();
    window.setTimeout(onComplete, 750);
  }, [exiting, onComplete, ready]);

  return (
    <div
      className={cn(
        "grok-outro-in fixed inset-0 z-[59] flex items-center justify-center bg-background/98 px-6 backdrop-blur-lg",
        exiting && "grok-outro-out",
      )}
    >
      <div className="pointer-events-none absolute inset-0 grok-outro-vignette" />
      <div className="pointer-events-none absolute inset-0 landing-scanlines opacity-15" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <p
          className={cn(
            "grok-outro-line font-display text-base font-light leading-relaxed tracking-[0.04em] text-zinc-300 sm:text-lg",
            lineOneVisible && "grok-outro-line-visible",
          )}
        >
          Now that you&apos;ve experienced Groknet: The Plug,
        </p>

        <p
          className={cn(
            "grok-outro-line mt-3 font-display text-base font-light leading-relaxed tracking-[0.04em] text-zinc-400 sm:text-lg",
            lineTwoVisible && "grok-outro-line-visible",
          )}
        >
          increase your productivity with Grok
        </p>

        <div
          className={cn(
            "grok-outro-line mt-10",
            linkVisible && "grok-outro-line-visible",
          )}
        >
          <a
            href={GROK_SEARCHER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500 transition-colors hover:text-accent"
            onClick={() => playCinematicHitSound()}
          >
            <span className="text-zinc-600 transition-colors group-hover:text-accent/70">
              →
            </span>
            <span className="border-b border-transparent transition-colors group-hover:border-accent/40">
              www.groksearcher.com
            </span>
          </a>
        </div>

        {ready ? (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={handleProceed}
              className="grok-outro-proceed interactable rounded-sm border border-zinc-800/80 bg-zinc-950/40 px-8 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-300"
            >
              Continue
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}