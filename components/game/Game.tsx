"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Corridor } from "@/components/game/areas/Corridor";
import { UpperLab } from "@/components/game/areas/UpperLab";
import { AreaMap } from "@/components/game/AreaMap";
import { ContinuePrompt } from "@/components/game/ContinuePrompt";
import { MissionObjectives } from "@/components/game/MissionObjectives";
import { FeedbackToast } from "@/components/ui/FeedbackToast";
import {
  BEACON_DURATION_MS,
  canSneakPast,
  DRONE_LURE_POSITION,
  DRONE_PATROL_SPEED,
  getGroknetDetectionComment,
  isDroneInSafeZone,
  type DroneStatus,
} from "@/lib/drone";
import {
  playDetectionSound,
  playCardFlipSound,
  playDoorSound,
  playInteractSound,
  playSuccessSound,
} from "@/lib/sounds";
import {
  AREA_ENTRY_POSITION,
  getPositionMeta,
} from "@/lib/movement/act-1";
import { useMovement } from "@/hooks/useMovement";
import { MovementControls } from "@/components/chapter/MovementControls";
import type { AreaId } from "@/types/areas";
import {
  INITIAL_INVENTORY,
  type PlayerInventory,
} from "@/types/inventory";
import type { MoveDirection, PlayerPosition } from "@/types/movement";

type GameProps = {
  playerPosition: PlayerPosition;
  onPlayerMove: (position: PlayerPosition) => void;
  terminal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    complete: boolean;
  };
  exchangeCount: number;
  terminalComplete: boolean;
  hallucinationSurvived: boolean;
  corridorCrossed: boolean;
  onCorridorCrossed: () => void;
  onDetection: (count: number) => void;
  onDetectionShake: () => void;
  onAreaChange?: (area: AreaId) => void;
  readyToContinue: boolean;
  onContinueToNextArea: () => void;
  onTriggerHallucination: () => void;
  controlsDisabled?: boolean;
};

export function Game({
  playerPosition,
  onPlayerMove,
  terminal,
  exchangeCount,
  terminalComplete,
  hallucinationSurvived,
  corridorCrossed,
  onCorridorCrossed,
  onDetection,
  onDetectionShake,
  onAreaChange,
  readyToContinue,
  onContinueToNextArea,
  onTriggerHallucination,
  controlsDisabled = false,
}: GameProps) {
  const [currentArea, setCurrentArea] = useState<AreaId>(playerPosition.area);
  const [inventory, setInventory] =
    useState<PlayerInventory>(INITIAL_INVENTORY);
  const [dronePosition, setDronePosition] = useState(12);
  const [droneDirection, setDroneDirection] = useState(1);
  const [droneStatus, setDroneStatus] = useState<DroneStatus>("patrolling");
  const [isHiding, setIsHiding] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [groknetComment, setGroknetComment] = useState<string | null>(null);
  const [detectionCount, setDetectionCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDroneSafe =
    droneStatus !== "patrolling" || isDroneInSafeZone(dronePosition);
  const canSneak = canSneakPast(dronePosition, droneStatus);

  const { availableMoves, tryMove } = useMovement({
    position: playerPosition,
    onMove: (next) => onPlayerMove(next),
    disabled: controlsDisabled || playerPosition.area !== currentArea,
  });

  const positionMeta = getPositionMeta(playerPosition);

  const showFeedback = useCallback((message: string) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setFeedback(message);
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
      feedbackTimeoutRef.current = null;
    }, 2400);
  }, []);

  const clearStatusTimeout = useCallback(() => {
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (currentArea !== "corridor" || droneStatus !== "patrolling") return;

    const interval = setInterval(() => {
      setDronePosition((pos) => {
        const next = pos + droneDirection * DRONE_PATROL_SPEED;
        if (next >= 92) {
          setDroneDirection(-1);
          return 92;
        }
        if (next <= 8) {
          setDroneDirection(1);
          return 8;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentArea, droneDirection, droneStatus]);

  useEffect(() => {
    return () => {
      clearStatusTimeout();
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, [clearStatusTimeout]);

  useEffect(() => {
    if (!alert) return;
    const timeout = setTimeout(() => setAlert(null), 3500);
    return () => clearTimeout(timeout);
  }, [alert]);

  const markCorridorBreached = useCallback(() => {
    if (corridorCrossed) return;
    onCorridorCrossed();
    playSuccessSound();
    showFeedback("Corridor breached — deep sector airlock reached");
  }, [corridorCrossed, onCorridorCrossed, showFeedback]);

  const handleDetect = useCallback(() => {
    const nextCount = detectionCount + 1;
    setDetectionCount(nextCount);
    onDetection(nextCount);
    onDetectionShake();
    setAlert("Motion detected — drone acquired your position");
    setGroknetComment(getGroknetDetectionComment(nextCount));
    playDetectionSound();
    showFeedback("Drone detected your movement");
  }, [detectionCount, onDetection, onDetectionShake, showFeedback]);

  const handleSneakPast = useCallback(() => {
    playInteractSound();
    if (canSneak) {
      markCorridorBreached();
      showFeedback("Sneaked past patrol drone");
      return;
    }
    handleDetect();
  }, [canSneak, markCorridorBreached, handleDetect, showFeedback]);

  const handleDeployBeacon = useCallback(() => {
    if (inventory.beaconCount <= 0 || droneStatus !== "patrolling") return;

    clearStatusTimeout();
    playCardFlipSound();
    setInventory((inv) => ({ ...inv, beaconCount: inv.beaconCount - 1 }));
    setDroneStatus("distracted");
    setDronePosition(DRONE_LURE_POSITION);
    setGroknetComment(null);
    showFeedback("Beacon deployed — drone diverted");

    statusTimeoutRef.current = setTimeout(() => {
      setDroneStatus("patrolling");
      setDroneDirection(1);
      statusTimeoutRef.current = null;
    }, BEACON_DURATION_MS);
  }, [inventory.beaconCount, droneStatus, clearStatusTimeout, showFeedback]);

  const handleNavigate = useCallback(
    (target: AreaId, requiresStealth = false) => {
      if (controlsDisabled) return;

      if (currentArea === "corridor" && requiresStealth) {
        const canCross = canSneak || droneStatus === "distracted";
        if (!canCross) {
          handleDetect();
          return;
        }
        if (!terminalComplete) {
          showFeedback("Finish the terminal conversation first");
          return;
        }
        markCorridorBreached();
        return;
      }

      playDoorSound();
      setCurrentArea(target);
      onAreaChange?.(target);
      onPlayerMove({
        area: target,
        node: AREA_ENTRY_POSITION[target],
      } as PlayerPosition);
      setAlert(null);
      setGroknetComment(null);
      setIsHiding(false);
      showFeedback(
        `Entered ${target === "corridor" ? "maintenance corridor" : "upper lab"}`,
      );
    },
    [
      controlsDisabled,
      currentArea,
      canSneak,
      droneStatus,
      terminalComplete,
      handleDetect,
      markCorridorBreached,
      onAreaChange,
      onPlayerMove,
      showFeedback,
    ],
  );

  return (
    <div className="flex w-full flex-col items-center">
      <MissionObjectives
        terminalComplete={terminalComplete}
        hallucinationSurvived={hallucinationSurvived}
        corridorCrossed={corridorCrossed}
      />

      <AreaMap currentArea={currentArea} />

      <MovementControls
        availableMoves={availableMoves}
        onMove={tryMove}
        disabled={controlsDisabled || playerPosition.area !== currentArea}
        positionLabel={positionMeta.label}
      />

      <div key={currentArea} className="area-transition w-full">
        {currentArea === "upper-lab" && (
          <UpperLab
            position={playerPosition.area === "upper-lab" ? playerPosition.node : "breach-point"}
            positionDescription={positionMeta.description}
            onOpenTerminal={() => {
              playInteractSound();
              terminal.onOpen();
            }}
            onTriggerHallucination={onTriggerHallucination}
            onTakeBeacon={() => {
              if (inventory.beaconCount > 0) return;
              playCardFlipSound();
              setInventory((inv) => ({ ...inv, beaconCount: 1 }));
              showFeedback("Distraction beacon acquired");
            }}
            onNavigate={() => handleNavigate("corridor")}
            exchangeCount={exchangeCount}
            terminalComplete={terminalComplete}
            hasBeacon={inventory.beaconCount > 0}
            controlsDisabled={controlsDisabled}
          />
        )}

        {currentArea === "corridor" && (
          <Corridor
            position={playerPosition.area === "corridor" ? playerPosition.node : "west-hatch"}
            positionDescription={positionMeta.description}
            dronePosition={dronePosition}
            droneStatus={droneStatus}
            isDroneSafe={isDroneSafe}
            isHiding={isHiding}
            canSneak={canSneak}
            inventory={inventory}
            alert={alert}
            groknetComment={groknetComment}
            terminalComplete={terminalComplete}
            corridorCrossed={corridorCrossed}
            onToggleHide={() => {
              playInteractSound();
              setIsHiding((h) => !h);
              showFeedback(isHiding ? "Left cover" : "Taking cover");
            }}
            onSneakPast={handleSneakPast}
            onDeployBeacon={handleDeployBeacon}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {readyToContinue ? (
        <div className="mt-8 w-full">
          <ContinuePrompt onContinue={onContinueToNextArea} />
        </div>
      ) : null}

      <FeedbackToast message={feedback} />
    </div>
  );
}