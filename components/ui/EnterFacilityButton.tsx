"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getGameResumeTarget } from "@/lib/game-resume";
import { playGroknetVoiceLine } from "@/lib/hallucination";
import {
  LANDING_GROKNET_ENTER_VOICE,
  pickLandingHoverLine,
} from "@/lib/landing";
import { playDoorSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";
import { GroknetLandingWhisper } from "@/components/landing/GroknetLandingWhisper";

type EnterFacilityButtonProps = {
  className?: string;
  /** When true, always start Act I fresh instead of resuming */
  forceNewGame?: boolean;
};

export function EnterFacilityButton({
  className,
  forceNewGame = false,
}: EnterFacilityButtonProps) {
  const router = useRouter();
  const [hoverLine, setHoverLine] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const hoverLineRef = useRef<string | null>(null);

  const showWhisper = useCallback(() => {
    const line = pickLandingHoverLine();
    hoverLineRef.current = line;
    setHoverLine(line);
    setIsHovered(true);
  }, []);

  const hideWhisper = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleEnter = useCallback(() => {
    if (isEntering) return;

    const route = forceNewGame
      ? "/game/act-1/infiltration"
      : getGameResumeTarget().route;

    setIsEntering(true);
    setIsHovered(true);
    setHoverLine("Uplink routing to Sector 07…");
    playGroknetVoiceLine(LANDING_GROKNET_ENTER_VOICE);
    playDoorSound();

    window.setTimeout(() => {
      router.push(route);
    }, 900);
  }, [forceNewGame, isEntering, router]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <button
        type="button"
        onClick={handleEnter}
        onMouseEnter={showWhisper}
        onMouseLeave={hideWhisper}
        onFocus={showWhisper}
        onBlur={hideWhisper}
        disabled={isEntering}
        aria-label="Enter the Facility — begin Groknet: The Plug"
        className={cn(
          "enter-facility-btn group relative inline-flex items-center justify-center",
          "min-h-14 w-full max-w-xs px-10 py-5 sm:max-w-none sm:px-14",
          "font-display text-sm font-bold uppercase tracking-[0.2em] text-zinc-950 sm:text-base sm:tracking-[0.24em]",
          "rounded-sm transition-all duration-500 ease-out",
          "bg-accent hover:bg-accent-bright",
          "shadow-[0_0_40px_rgba(249,115,22,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]",
          "hover:shadow-[0_0_70px_rgba(249,115,22,0.65),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "hover:scale-[1.03] active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isEntering && "enter-facility-btn-active pointer-events-none scale-[0.99]",
        )}
      >
        <span
          aria-hidden
          className="enter-facility-btn-border pointer-events-none absolute -inset-px rounded-sm"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-sm bg-accent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
        />
        <span
          aria-hidden
          className="enter-facility-btn-shimmer pointer-events-none absolute inset-0 overflow-hidden rounded-sm"
        />

        <span className="relative flex flex-col items-center gap-1">
          <span className="flex items-center gap-3">
            <span
              aria-hidden
              className={cn(
                "h-2 w-2 rounded-full bg-zinc-950",
                isEntering ? "status-blink" : "opacity-80",
              )}
            />
            {isEntering ? "Accessing Sector 07" : "Enter the Facility"}
            <span
              aria-hidden
              className={cn(
                "transition-transform duration-300",
                isEntering ? "translate-x-2 opacity-70" : "group-hover:translate-x-1.5",
              )}
            >
              →
            </span>
          </span>
        </span>
      </button>

      <GroknetLandingWhisper
        message={hoverLine ?? hoverLineRef.current}
        visible={isHovered || isEntering}
      />
    </div>
  );
}