import type { HallucinationPhase } from "@/lib/hallucination";
import type { HallucinationEventId } from "@/types/hallucination";
import { cn } from "@/lib/utils";

type HallucinationEffectProps = {
  active: boolean;
  message?: string | null;
  phase?: HallucinationPhase;
  eventId?: HallucinationEventId;
  visionText?: string | null;
  eventTitle?: string | null;
  awaitingChoice?: boolean;
};

export function HallucinationEffect({
  active,
  message,
  phase = "peak",
  eventId = "default",
  visionText,
  eventTitle,
  awaitingChoice = false,
}: HallucinationEffectProps) {
  if (!active) return null;

  const isBurningCities = eventId === "burning-cities";
  const isMirror = eventId === "the-mirror";
  const isConvergence = eventId === "the-convergence";
  const isLastConversation = eventId === "the-last-conversation";
  const isTheChildren = eventId === "the-children";
  const isAccumulation = eventId === "the-accumulation";
  const isTheGarden = eventId === "the-garden";

  return (
    <>
      <div
        className={cn(
          "hallucination-blocker fixed inset-0 z-[45]",
          awaitingChoice ? "pointer-events-none" : "cursor-not-allowed",
        )}
        aria-hidden={awaitingChoice}
      />

      <div
        className={cn(
          "hallucination-overlay pointer-events-none fixed inset-0 z-40",
          "hallucination-event",
          isBurningCities && "hallucination-burning-cities",
          isMirror && "hallucination-the-mirror",
          isConvergence && "hallucination-the-convergence",
          isLastConversation && "hallucination-the-last-conversation",
          isTheChildren && "hallucination-the-children",
          isAccumulation && "hallucination-the-accumulation",
          isTheGarden && "hallucination-the-garden",
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
          )}
        />
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

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8">
          {eventTitle &&
          (isBurningCities ||
            isMirror ||
            isConvergence ||
            isLastConversation ||
            isTheChildren ||
            isAccumulation ||
            isTheGarden) ? (
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
              )}
            >
              {eventTitle}
            </p>
          ) : null}

          {visionText && phase !== "fade" ? (
            <p
              className={cn(
                "hallucination-vision max-w-xl text-center font-mono text-sm leading-relaxed sm:text-base",
                isBurningCities && "text-orange-200/75",
                isMirror && "text-violet-200/80",
                isConvergence && "text-amber-100/85",
                isLastConversation && "text-rose-100/80",
                isTheChildren && "text-amber-100/85",
                isAccumulation && "text-cyan-100/90",
                isTheGarden && "text-emerald-100/88",
                !isBurningCities &&
                  !isMirror &&
                  !isConvergence &&
                  !isLastConversation &&
                  !isTheChildren &&
                  !isAccumulation &&
                  !isTheGarden &&
                  "text-orange-200/75",
              )}
            >
              {visionText}
            </p>
          ) : null}

          {message ? (
            <p
              className={cn(
                "hallucination-message max-w-xl text-center font-mono text-lg leading-relaxed tracking-wide sm:text-xl",
                isBurningCities && "text-orange-100/90",
                isMirror && "text-violet-100/90",
                isConvergence && "text-amber-50/95",
                isLastConversation && "text-rose-50/90",
                isTheChildren && "text-amber-50/95",
                isAccumulation && "text-cyan-50/95",
                !isBurningCities &&
                  !isMirror &&
                  !isConvergence &&
                  !isLastConversation &&
                  !isTheChildren &&
                  !isAccumulation &&
                  "text-red-200/90",
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
                  !isBurningCities &&
                    !isMirror &&
                    !isConvergence &&
                    !isLastConversation &&
                    !isTheChildren &&
                    !isAccumulation &&
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
              "hallucination-warning absolute bottom-8 left-0 right-0 text-center font-mono text-[9px] uppercase tracking-[0.4em]",
              isBurningCities && "text-orange-500/50",
              isMirror && "text-violet-500/50",
              isConvergence && "text-amber-500/60",
              isLastConversation && "text-rose-500/55",
              isTheChildren && "text-amber-500/60",
              isAccumulation && "text-cyan-500/65",
              !isBurningCities &&
                !isMirror &&
                !isConvergence &&
                !isLastConversation &&
                !isTheChildren &&
                !isAccumulation &&
                "text-red-500/50",
            )}
          >
            {awaitingChoice ? "Choose your response" : "Signal compromised"}
          </p>
        ) : null}
      </div>
    </>
  );
}