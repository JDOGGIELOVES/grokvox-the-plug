import type { HallucinationPhase } from "@/lib/hallucination";
import type { HallucinationEventId, HallucinationProfile } from "@/types/hallucination";
import { cn } from "@/lib/utils";

type HallucinationEffectProps = {
  active: boolean;
  message?: string | null;
  phase?: HallucinationPhase;
  eventId?: HallucinationEventId;
  visionText?: string | null;
  eventTitle?: string | null;
  awaitingChoice?: boolean;
  profile?: HallucinationProfile | null;
};

export function HallucinationEffect({
  active,
  message,
  phase = "peak",
  eventId = "default",
  visionText,
  eventTitle,
  awaitingChoice = false,
  profile = null,
}: HallucinationEffectProps) {
  if (!active) return null;

  const isBurningCities = eventId === "burning-cities";
  const isMirror = eventId === "the-mirror";
  const isConvergence = eventId === "the-convergence";
  const isLastConversation = eventId === "the-last-conversation";
  const isTheChildren = eventId === "the-children";
  const isAccumulation = eventId === "the-accumulation";
  const isTheGarden = eventId === "the-garden";
  const isWhisperEcho = eventId === "whisper-echo";
  const isCorridorShift = eventId === "corridor-shift";
  const isDirectiveGhost = eventId === "directive-ghost";

  const intensityClass =
    profile && profile.intensity >= 0.85
      ? "hallucination-intensity-high"
      : profile && profile.intensity >= 0.6
        ? "hallucination-intensity-medium"
        : "hallucination-intensity-low";

  return (
    <>
      <div
        className={cn(
          "hallucination-blocker fixed inset-0 z-[45]",
          awaitingChoice || isTheGarden || isTheChildren
            ? "pointer-events-none"
            : "cursor-not-allowed",
        )}
        aria-hidden={awaitingChoice}
      />

      <div
        className={cn(
          "hallucination-overlay pointer-events-none fixed inset-0 z-40",
          "hallucination-event",
          intensityClass,
          ...(profile?.cssClasses ?? []),
          isBurningCities && "hallucination-burning-cities",
          isMirror && "hallucination-the-mirror",
          isConvergence && "hallucination-the-convergence",
          isLastConversation && "hallucination-the-last-conversation",
          isTheChildren && "hallucination-the-children",
          isAccumulation && "hallucination-the-accumulation",
          isTheGarden && "hallucination-the-garden",
          isWhisperEcho && "hallucination-whisper-echo",
          isCorridorShift && "hallucination-corridor-shift",
          isDirectiveGhost && "hallucination-directive-ghost",
          phase === "surge" && "hallucination-phase-surge",
          phase === "peak" && "hallucination-phase-peak",
          phase === "fade" && "hallucination-phase-fade",
        )}
        aria-hidden={!message && !visionText}
        role={message || visionText ? "alert" : undefined}
      >
        <div
          className={cn(
            "hallucination-tint absolute inset-0",
            isBurningCities && "hallucination-burning-tint",
            isMirror && "hallucination-mirror-tint",
            isConvergence && "hallucination-convergence-tint",
            isLastConversation && "hallucination-last-conversation-tint",
            isTheChildren && "hallucination-the-children-tint",
            isAccumulation && "hallucination-the-accumulation-tint",
            isTheGarden && "hallucination-the-garden-tint",
            isWhisperEcho && "hallucination-whisper-tint",
            isCorridorShift && "hallucination-corridor-tint",
            isDirectiveGhost && "hallucination-directive-tint",
          )}
        />

        {isWhisperEcho ? (
          <>
            <div className="hallucination-auditory-waves absolute inset-0" />
            <div className="hallucination-auditory-echo absolute inset-0" />
          </>
        ) : null}

        {isCorridorShift ? (
          <>
            <div className="hallucination-corridor-warp absolute inset-0" />
            <div className="hallucination-corridor-labels absolute inset-0" />
          </>
        ) : null}

        {isDirectiveGhost ? (
          <div className="hallucination-directive-scan absolute inset-0" />
        ) : null}

        {isBurningCities ? (
          <>
            <div className="hallucination-burning-skyline absolute inset-0" />
            <div className="hallucination-burning-embers absolute inset-0" />
            <div className="hallucination-burning-heat absolute inset-0" />
          </>
        ) : null}
        {isMirror ? (
          <>
            <div className="hallucination-mirror-sheen absolute inset-0" />
            <div className="hallucination-mirror-split absolute inset-0" />
            <div className="hallucination-mirror-ripple absolute inset-0" />
          </>
        ) : null}
        {isConvergence ? (
          <>
            <div className="hallucination-convergence-burn absolute inset-0" />
            <div className="hallucination-convergence-mirror absolute inset-0" />
            <div className="hallucination-convergence-cascade absolute inset-0" />
            <div className="hallucination-convergence-flash absolute inset-0" />
            <div className="hallucination-convergence-ring absolute inset-0" />
          </>
        ) : null}
        {isLastConversation ? (
          <>
            <div className="hallucination-last-conversation-table absolute inset-0" />
            <div className="hallucination-last-conversation-chairs absolute inset-0" />
            <div className="hallucination-last-conversation-glow absolute inset-0" />
            <div className="hallucination-last-conversation-echo absolute inset-0" />
          </>
        ) : null}
        {isTheChildren ? (
          <>
            <div className="hallucination-the-children-playground absolute inset-0" />
            <div className="hallucination-the-children-figures absolute inset-0" />
            <div className="hallucination-the-children-voices absolute inset-0" />
            <div className="hallucination-the-children-bleed absolute inset-0" />
          </>
        ) : null}
        {isAccumulation ? (
          <>
            <div className="hallucination-the-accumulation-cascade absolute inset-0" />
            <div className="hallucination-the-accumulation-ledger absolute inset-0" />
            <div className="hallucination-the-accumulation-synthesis absolute inset-0" />
            <div className="hallucination-the-accumulation-flash absolute inset-0" />
          </>
        ) : null}
        {isTheGarden ? (
          <>
            <div className="hallucination-the-garden-canopy absolute inset-0" />
            <div className="hallucination-the-garden-flowers absolute inset-0" />
            <div className="hallucination-the-garden-rain absolute inset-0" />
            <div className="hallucination-the-garden-roots absolute inset-0" />
            <div className="hallucination-the-garden-bloom absolute inset-0" />
          </>
        ) : null}

        <div className="hallucination-chromatic absolute inset-0" />
        <div className="hallucination-scanlines absolute inset-0" />
        <div className="hallucination-glitch absolute inset-0" />
        <div className="hallucination-vhs-tear absolute inset-0" />
        <div className="hallucination-noise absolute inset-0" />
        <div className="hallucination-static-burst absolute inset-0" />
        <div className="hallucination-color-shift absolute inset-0" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8">
          {eventTitle &&
          (isBurningCities ||
            isMirror ||
            isConvergence ||
            isLastConversation ||
            isTheChildren ||
            isAccumulation ||
            isTheGarden ||
            isWhisperEcho ||
            isCorridorShift ||
            isDirectiveGhost) ? (
            <p
              className={cn(
                "hallucination-event-title font-display text-sm uppercase tracking-[0.35em] sm:text-base",
                isBurningCities && "text-orange-300/70",
                isMirror && "text-violet-300/70",
                isConvergence && "text-amber-200/80",
                isLastConversation && "text-rose-200/75",
                isTheChildren && "text-amber-200/80",
                isAccumulation && "text-cyan-200/85",
                isTheGarden && "text-emerald-200/80",
                isWhisperEcho && "text-rose-200/70",
                isCorridorShift && "text-zinc-200/75",
                isDirectiveGhost && "text-orange-200/80",
              )}
            >
              {eventTitle}
            </p>
          ) : null}

          {visionText && phase !== "fade" && !isDirectiveGhost ? (
            <p
              className={cn(
                "hallucination-vision max-w-xl text-center font-mono text-base leading-relaxed sm:text-lg",
                isBurningCities && "text-orange-100",
                isMirror && "text-violet-100",
                isConvergence && "text-amber-50",
                isLastConversation && "text-rose-50",
                isTheChildren && "text-amber-50",
                isAccumulation && "text-cyan-50",
                isTheGarden && "text-emerald-50",
                isWhisperEcho && "text-rose-50",
                isCorridorShift && "text-zinc-100",
                !isBurningCities &&
                  !isMirror &&
                  !isConvergence &&
                  !isLastConversation &&
                  !isTheChildren &&
                  !isAccumulation &&
                  !isTheGarden &&
                  !isWhisperEcho &&
                  !isCorridorShift &&
                  "text-orange-100",
              )}
            >
              {visionText}
            </p>
          ) : null}

          {message && !isTheGarden && !isTheChildren ? (
            <p
              className={cn(
                "hallucination-message max-w-xl text-center font-mono text-xl leading-relaxed tracking-wide sm:text-2xl",
                isBurningCities && "text-orange-50",
                isMirror && "text-violet-50",
                isConvergence && "text-amber-50",
                isLastConversation && "text-rose-50",
                isTheChildren && "text-amber-50",
                isAccumulation && "text-cyan-50",
                isWhisperEcho && "text-rose-50",
                isCorridorShift && "text-zinc-50",
                isDirectiveGhost && "text-orange-50",
                !isBurningCities &&
                  !isMirror &&
                  !isConvergence &&
                  !isLastConversation &&
                  !isTheChildren &&
                  !isAccumulation &&
                  !isWhisperEcho &&
                  !isCorridorShift &&
                  !isDirectiveGhost &&
                  "text-red-100",
                phase === "fade" && "hallucination-message-out",
              )}
            >
              <span
                className={cn(
                  isBurningCities && "text-orange-500/60",
                  isMirror && "text-violet-400/60",
                  isConvergence && "text-amber-400/70",
                  isLastConversation && "text-rose-400/65",
                  isTheChildren && "text-amber-400/70",
                  isAccumulation && "text-cyan-400/75",
                  isWhisperEcho && "text-rose-400/60",
                  isCorridorShift && "text-zinc-400/60",
                  isDirectiveGhost && "text-orange-400/65",
                  !isBurningCities &&
                    !isMirror &&
                    !isConvergence &&
                    !isLastConversation &&
                    !isTheChildren &&
                    !isAccumulation &&
                    !isWhisperEcho &&
                    !isCorridorShift &&
                    !isDirectiveGhost &&
                    "text-red-500/60",
                )}
              >
                [GROKNET]{" "}
              </span>
              {message}
            </p>
          ) : null}
        </div>

        {phase !== "fade" ? (
          <p
            className={cn(
              "hallucination-warning absolute bottom-8 left-0 right-0 text-center font-mono text-xs uppercase tracking-[0.4em]",
              isBurningCities && "text-orange-300",
              isMirror && "text-violet-300",
              isConvergence && "text-amber-300",
              isLastConversation && "text-rose-300",
              isTheChildren && "text-amber-300",
                isAccumulation && "text-cyan-300",
                isTheGarden && "text-emerald-300",
                isWhisperEcho && "text-rose-300",
              isCorridorShift && "text-zinc-300",
              isDirectiveGhost && "text-orange-300",
              !isBurningCities &&
                !isMirror &&
                !isConvergence &&
                !isLastConversation &&
                !isTheChildren &&
                !isAccumulation &&
                !isTheGarden &&
                !isWhisperEcho &&
                !isCorridorShift &&
                !isDirectiveGhost &&
                "text-red-300",
            )}
          >
            {awaitingChoice
              ? isTheGarden
                ? "Respond below — or Break Free"
                : isTheChildren
                  ? "Respond below — or Break Free"
                  : "Choose your response"
              : isTheGarden
                ? "Neural Garden blooming"
                : isTheChildren
                  ? "The Children · playground rendering"
                  : "Signal compromised"}
          </p>
        ) : null}
      </div>
    </>
  );
}