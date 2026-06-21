"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DeepCoreContestedHack,
  DEEP_CORE_HACK_CONFIG,
} from "@/components/game/DeepCoreContestedHack";
import { DeepCoreAtmosphere } from "@/components/game/DeepCoreAtmosphere";
import { DeepCoreCorruptionOverlay } from "@/components/game/DeepCoreCorruptionOverlay";
import { GroknetPresenceBanner } from "@/components/chapter/GroknetPresenceBanner";
import { getPersonalityVariant } from "@/lib/chapter/act-three-personality-presence";
import { PerimeterMovementControls } from "@/components/game/PerimeterMovementControls";
import { ConfrontationPrompt } from "@/components/chapter/ConfrontationPrompt";
import { FeedbackToast } from "@/components/ui/FeedbackToast";
import { Button } from "@/components/ui/Button";
import { useDeepCoreMovement } from "@/hooks/useDeepCoreMovement";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getThresholdBeats } from "@/lib/dialogue/act-three-confrontation";
import { getActThreePresenceLabel } from "@/lib/dialogue/act-three-context";
import { getFortificationHackOpenWhisper } from "@/lib/chapter/act-three-presence";
import {
  canAccessDescentShaft,
  canAccessNeuralGarden,
  canTriggerTheGarden,
  getDeepCoreDirectionLabel,
  moveDeepCore,
  DEEP_CORE_ROOMS,
  DEEP_CORE_START,
} from "@/lib/movement/deep-core";
import { playInteractSound } from "@/lib/sounds";
import type { DeepCoreDirection, DeepCoreRoomId } from "@/types/deep-core";
import { cn } from "@/lib/utils";

type DeepCoreSectionProps = {
  context: ActThreeDialogueContext;
  initialRoom?: DeepCoreRoomId;
  fortificationHackComplete: boolean;
  thresholdDialogueComplete: boolean;
  thresholdPromptOpen: boolean;
  thresholdBeatIndex: number;
  gardenSurvived: boolean;
  gardenActive?: boolean;
  majorHackOpen: boolean;
  onOpenThresholdPrompt: () => void;
  onThresholdChoice: (
    choiceId: "acknowledge" | "defy" | "question",
    response: string,
  ) => void;
  onOpenMajorHack: () => void;
  onCloseMajorHack: () => void;
  onMajorHackSuccess: () => void;
  onEnterNeuralGarden: () => void;
  onEnterFinalApproach: () => void;
  onGroknetWhisper: (line: string, speak?: boolean) => void;
  onMove: (fromRoom: DeepCoreRoomId, toRoom: DeepCoreRoomId) => void;
  onRoomEnter: (room: DeepCoreRoomId, fromRoom: DeepCoreRoomId) => void;
  disoriented?: boolean;
  invertMovement?: boolean;
  controlsDisabled?: boolean;
  corruptionLine?: string | null;
};

const ROOM_ORDER: DeepCoreRoomId[] = [
  "descent-shaft",
  "fortification-grid",
  "neural-garden",
  "seismic-corridor",
  "garden-threshold",
  "fortress-ingress",
];

export function DeepCoreSection({
  context,
  initialRoom = DEEP_CORE_START,
  fortificationHackComplete,
  thresholdDialogueComplete,
  thresholdPromptOpen,
  thresholdBeatIndex,
  gardenSurvived,
  gardenActive = false,
  majorHackOpen,
  onOpenThresholdPrompt,
  onThresholdChoice,
  onOpenMajorHack,
  onCloseMajorHack,
  onMajorHackSuccess,
  onEnterNeuralGarden,
  onEnterFinalApproach,
  onGroknetWhisper,
  onMove,
  onRoomEnter,
  disoriented = false,
  invertMovement = false,
  controlsDisabled = false,
  corruptionLine = null,
}: DeepCoreSectionProps) {
  const variant = getPersonalityVariant(context);
  const [room, setRoom] = useState<DeepCoreRoomId>(initialRoom);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gardenVisited, setGardenVisited] = useState(
    gardenSurvived || initialRoom === "neural-garden",
  );

  useEffect(() => {
    setRoom(initialRoom);
  }, [initialRoom]);

  useEffect(() => {
    if (gardenSurvived) {
      setGardenVisited(true);
    }
  }, [gardenSurvived]);

  const roomMeta = DEEP_CORE_ROOMS[room];
  const gardenUnlocked = canAccessNeuralGarden(
    fortificationHackComplete,
    thresholdDialogueComplete,
  );
  const descentUnlocked = canAccessDescentShaft(gardenSurvived);
  const canTriggerGarden = canTriggerTheGarden(
    fortificationHackComplete,
    thresholdDialogueComplete,
    gardenSurvived,
  );
  const thresholdBeats = getThresholdBeats(context);
  const currentThresholdBeat =
    thresholdPromptOpen && thresholdBeatIndex < thresholdBeats.length
      ? thresholdBeats[thresholdBeatIndex]
      : null;
  const uiBlocked = majorHackOpen || thresholdPromptOpen;
  const intense =
    room === "fortification-grid" ||
    room === "neural-garden" ||
    room === "descent-shaft" ||
    canTriggerGarden;

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 2800);
  }, []);

  const attemptMove = useCallback(
    (direction: DeepCoreDirection) => {
      if (controlsDisabled || uiBlocked) return;

      const nextRoom = moveDeepCore(room, direction);
      if (!nextRoom) return;

      if (nextRoom === "neural-garden" && !gardenUnlocked) {
        onGroknetWhisper(
          "Neural Garden sealed. …Breach DC-FORT-01 and speak at the threshold first.",
          true,
        );
        showFeedback("Complete fortification and threshold dialogue");
        return;
      }
      if (nextRoom === "descent-shaft" && !descentUnlocked) {
        onGroknetWhisper(
          "Descent Shaft locked. …Survive The Garden first. The plug won't wait forever.",
          true,
        );
        showFeedback("The Garden must be survived");
        return;
      }

      const fromRoom = room;
      setRoom(nextRoom);
      onMove(fromRoom, nextRoom);
      onRoomEnter(nextRoom, fromRoom);

      if (nextRoom === "neural-garden" && !gardenVisited) {
        setGardenVisited(true);
        onEnterNeuralGarden();
        showFeedback("Neural Garden entered — The Garden rising");
      }
      if (nextRoom === "descent-shaft" && gardenSurvived) {
        onEnterFinalApproach();
        showFeedback("Descent Shaft — Final Approach unlocked");
      }
    },
    [
      controlsDisabled,
      uiBlocked,
      room,
      gardenUnlocked,
      descentUnlocked,
      gardenVisited,
      gardenSurvived,
      onMove,
      onRoomEnter,
      onEnterNeuralGarden,
      onEnterFinalApproach,
      onGroknetWhisper,
      showFeedback,
    ],
  );

  const { availableMoves, tryMove } = useDeepCoreMovement({
    room,
    onMove: attemptMove,
    disabled: controlsDisabled || uiBlocked,
    invertMovement: disoriented && invertMovement,
  });

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center",
        disoriented && "disorientation-active",
        intense && "deep-core-heavy",
      )}
    >
      <GroknetPresenceBanner context={context} className="mb-4" />

      <div className="mb-6 w-full rounded-sm border border-rose-900/30 bg-rose-950/12 px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-rose-400/75">
          Deep Core Access · Groknet {getActThreePresenceLabel(context.presenceMode)}
        </p>
        <ul className="mt-3 space-y-2 font-mono text-[10px] uppercase tracking-widest">
          <li
            className={
              fortificationHackComplete ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {fortificationHackComplete ? "✓" : "·"} Breach DC-FORT-01
          </li>
          <li
            className={
              thresholdDialogueComplete ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {thresholdDialogueComplete ? "✓" : "·"} Garden Threshold dialogue
          </li>
          <li
            className={gardenSurvived ? "text-emerald-500/80" : "text-zinc-600"}
          >
            {gardenSurvived ? "✓" : "·"} Survive The Garden
          </li>
        </ul>
      </div>

      <DeepCoreAtmosphere
        intense={intense}
        unstable={roomMeta.unstable}
        presenceMode={context.presenceMode}
      >
        <DeepCoreCorruptionOverlay
          intense={intense}
          corruptionLine={corruptionLine}
          personalityPulse={variant?.glowClass ?? null}
        />
        <div className="deep-core-map relative w-full overflow-hidden rounded-sm border border-rose-900/30 bg-zinc-950/80 p-3 sm:p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-rose-400/65">
            Deep Core · Fortified Grid
          </p>
          <div className="relative mx-auto aspect-[5/4] max-w-2xl">
            {ROOM_ORDER.map((roomId) => {
              const meta = DEEP_CORE_ROOMS[roomId];
              const isPlayer = room === roomId;
              const isGarden = roomId === "neural-garden";
              const isDescent = roomId === "descent-shaft";
              const gardenLocked = isGarden && !gardenUnlocked;
              const descentLocked = isDescent && !descentUnlocked;
              const width = (meta.gridWidth ?? 1) * 20;
              const height = (meta.gridHeight ?? 1) * 25;

              return (
                <div
                  key={roomId}
                  className={cn(
                    "absolute flex flex-col items-center justify-center border p-2 text-center transition-all duration-300",
                    isPlayer
                      ? "border-rose-500/50 bg-rose-500/[0.08] shadow-[0_0_24px_rgba(244,63,94,0.18)]"
                      : gardenLocked || descentLocked
                        ? "border-zinc-800/60 bg-zinc-950/60 opacity-45"
                        : "border-zinc-800/80 bg-zinc-900/50",
                    isGarden && gardenUnlocked && "deep-core-garden-room",
                    isDescent && descentUnlocked && "deep-core-descent-room",
                    meta.isMajor && "deep-core-major-room",
                    meta.unstable && "deep-core-unstable-room",
                  )}
                  style={{
                    top: `${meta.gridRow * 25}%`,
                    left: `${meta.gridCol * 20}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                  }}
                >
                  <span
                    className={cn(
                      "font-mono text-[7px] uppercase tracking-[0.1em] sm:text-[8px]",
                      isPlayer ? "text-rose-300" : "text-zinc-500",
                    )}
                  >
                    {meta.label}
                  </span>
                  {isPlayer ? (
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </DeepCoreAtmosphere>

      <div className="mt-5 grid w-full gap-5 lg:grid-cols-2">
        <PerimeterMovementControls
          availableMoves={availableMoves}
          onMove={tryMove}
          disabled={controlsDisabled || uiBlocked}
          roomLabel={roomMeta.label}
          getDirectionLabel={getDeepCoreDirectionLabel}
        />

        <div className="rounded-sm border border-rose-900/25 bg-surface/80 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400/70">
            Sector 07 · Deep Core
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.06em] text-zinc-100">
            {roomMeta.label}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {roomMeta.description}
          </p>

          {room === "fortification-grid" ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  onGroknetWhisper(
                    getFortificationHackOpenWhisper(context),
                    true,
                  );
                  onOpenMajorHack();
                }}
                disabled={
                  controlsDisabled || fortificationHackComplete || uiBlocked
                }
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_24px_rgba(244,63,94,0.15)]"
              >
                {fortificationHackComplete
                  ? "DC-FORT-01 · Lattice breached"
                  : "Contest DC-FORT-01 · Fortification Fight"}
              </Button>
            </div>
          ) : null}

          {room === "garden-threshold" ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  if (!fortificationHackComplete) {
                    showFeedback("Breach DC-FORT-01 first");
                    return;
                  }
                  onOpenThresholdPrompt();
                }}
                disabled={
                  controlsDisabled ||
                  thresholdDialogueComplete ||
                  uiBlocked
                }
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
              >
                {thresholdDialogueComplete
                  ? "Threshold Dialogue · Complete"
                  : "Speak at the Threshold"}
              </Button>
            </div>
          ) : null}

          {room === "neural-garden" ? (
            <div className="mt-4 space-y-2">
              {gardenActive ? (
                <p className="rounded-sm border border-emerald-900/40 bg-emerald-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-emerald-300/80">
                  The Garden active — respond below or Break Free
                </p>
              ) : null}
              {canTriggerGarden && !gardenActive ? (
                <Button
                  variant="accent"
                  onClick={() => {
                    playInteractSound();
                    onEnterNeuralGarden();
                    showFeedback("The Garden rising — respond when ready");
                  }}
                  disabled={controlsDisabled || uiBlocked}
                  className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_24px_rgba(16,185,129,0.12)]"
                >
                  Face The Garden
                </Button>
              ) : null}
              {gardenSurvived ? (
                <>
                  <p className="rounded-sm border border-emerald-900/40 bg-emerald-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-emerald-400/80">
                    The Garden — survived · Descent Shaft unlocked · Physical
                    plug ahead
                  </p>
                  <Button
                    variant="accent"
                    onClick={() => {
                      playInteractSound();
                      setRoom("descent-shaft");
                      onEnterFinalApproach();
                      showFeedback("Final Approach — plug confrontation ahead");
                    }}
                    disabled={uiBlocked || gardenActive}
                    className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_28px_rgba(244,63,94,0.22)]"
                  >
                    Descend — Final Approach
                  </Button>
                </>
              ) : null}
            </div>
          ) : null}

          {room === "descent-shaft" && gardenSurvived ? (
            <div className="mt-4 space-y-2">
              <p className="rounded-sm border border-amber-900/40 bg-amber-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-amber-300/80">
                Plug Chamber accessible — physical interface ahead
              </p>
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  onEnterFinalApproach();
                  showFeedback("Final Approach — core terminal confrontation");
                }}
                disabled={uiBlocked || gardenActive}
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
              >
                Enter Final Approach
              </Button>
            </div>
          ) : null}

          {gardenSurvived && room !== "neural-garden" && room !== "descent-shaft" ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  setRoom("descent-shaft");
                  onEnterFinalApproach();
                  showFeedback("Final Approach — plug confrontation ahead");
                }}
                disabled={uiBlocked || gardenActive}
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
              >
                Descend — Final Approach
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {majorHackOpen ? (
        <DeepCoreContestedHack
          config={DEEP_CORE_HACK_CONFIG}
          context={context}
          onSuccess={onMajorHackSuccess}
          onCancel={onCloseMajorHack}
          onGroknetLine={(line, speak) => onGroknetWhisper(line, speak)}
        />
      ) : null}

      {currentThresholdBeat ? (
        <ConfrontationPrompt
          beat={currentThresholdBeat}
          beatIndex={thresholdBeatIndex}
          totalBeats={thresholdBeats.length}
          onChoose={(choiceId, response) => onThresholdChoice(choiceId, response)}
        />
      ) : null}

      <FeedbackToast message={feedback} />
    </div>
  );
}