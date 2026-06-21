"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OuterPerimeterMap } from "@/components/game/OuterPerimeterMap";
import { PerimeterAtmosphere } from "@/components/game/PerimeterAtmosphere";
import { PerimeterMovementControls } from "@/components/game/PerimeterMovementControls";
import { PerimeterObjectives } from "@/components/game/PerimeterObjectives";
import { AreaBreadcrumb } from "@/components/chapter/AreaBreadcrumb";
import { FeedbackToast } from "@/components/ui/FeedbackToast";
import { Button } from "@/components/ui/Button";
import { usePerimeterMovement } from "@/hooks/usePerimeterMovement";
import { getDroneAnimationIntervalMs } from "@/lib/performance-mode";
import {
  isInnerGateMove,
  movePerimeter,
  PERIMETER_ROOMS,
  PERIMETER_START_ROOM,
} from "@/lib/movement/outer-perimeter";
import {
  canSneakPerimeterLane,
  getPerimeterDetectionComment,
  isPerimeterDroneDanger,
  PERIMETER_DECOY_DURATION_MS,
  PERIMETER_DRONE_SPEED,
  PERIMETER_LURE_POSITION,
  shouldDetectOnEntry,
  type PerimeterDroneStatus,
} from "@/lib/perimeter-drone";
import {
  playDetectionSound,
  playDoorSound,
  playInteractSound,
  playSuccessSound,
} from "@/lib/sounds";
import type { PerimeterDirection, PerimeterRoomId } from "@/types/perimeter";
import { cn } from "@/lib/utils";

type OuterPerimeterSectionProps = {
  onEnterSecurityHub: () => void;
  onDetection: () => void;
  onDetectionShake: () => void;
  onGroknetWhisper: (line: string) => void;
  disoriented?: boolean;
  invertMovement?: boolean;
  controlsDisabled?: boolean;
};

export function OuterPerimeterSection({
  onEnterSecurityHub,
  onDetection,
  onDetectionShake,
  onGroknetWhisper,
  disoriented = false,
  invertMovement = false,
  controlsDisabled = false,
}: OuterPerimeterSectionProps) {
  const [room, setRoom] = useState<PerimeterRoomId>(PERIMETER_START_ROOM);
  const [dronePosition, setDronePosition] = useState(10);
  const [droneDirection, setDroneDirection] = useState(1);
  const [droneStatus, setDroneStatus] =
    useState<PerimeterDroneStatus>("patrolling");
  const [droneBypassed, setDroneBypassed] = useState(false);
  const [hubEntered, setHubEntered] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [localDetections, setLocalDetections] = useState(0);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decoyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const laneDetectionRef = useRef(false);

  const roomMeta = PERIMETER_ROOMS[room];
  const droneActive =
    room === "patrol-lane" ||
    room === "drop-zone" ||
    room === "scrap-alcove" ||
    room === "security-kiosk";

  const showFeedback = useCallback((message: string) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setFeedback(message);
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
      feedbackTimeoutRef.current = null;
    }, 2400);
  }, []);

  useEffect(() => {
    if (droneStatus === "distracted") return;

    const interval = setInterval(() => {
      setDronePosition((pos) => {
        const next = pos + droneDirection * PERIMETER_DRONE_SPEED;
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
    }, getDroneAnimationIntervalMs());
    return () => clearInterval(interval);
  }, [droneDirection, droneStatus]);

  useEffect(() => {
    if (!alert) return;
    const timeout = setTimeout(() => setAlert(null), 3500);
    return () => clearTimeout(timeout);
  }, [alert]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      if (decoyTimeoutRef.current) clearTimeout(decoyTimeoutRef.current);
    };
  }, []);

  const handleDetect = useCallback(
    (reason: string) => {
      const next = localDetections + 1;
      setLocalDetections(next);
      onDetection();
      onDetectionShake();
      setAlert(reason);
      onGroknetWhisper(getPerimeterDetectionComment(next));
      playDetectionSound();
      showFeedback("Security drone S-04 detected movement");
    },
    [
      localDetections,
      onDetection,
      onDetectionShake,
      onGroknetWhisper,
      showFeedback,
    ],
  );

  useEffect(() => {
    if (room !== "patrol-lane") {
      laneDetectionRef.current = false;
      return;
    }

    if (
      droneStatus === "distracted" ||
      !isPerimeterDroneDanger(dronePosition) ||
      laneDetectionRef.current
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      if (room !== "patrol-lane" || laneDetectionRef.current) return;
      if (!isPerimeterDroneDanger(dronePosition)) return;
      laneDetectionRef.current = true;
      handleDetect("Drone sweep caught you in the open lane");
    }, 900);

    return () => clearTimeout(timeout);
  }, [dronePosition, droneStatus, room, handleDetect]);

  const attemptMove = useCallback(
    (direction: PerimeterDirection) => {
      if (controlsDisabled) return;

      if (isInnerGateMove(room, direction)) {
        showFeedback("Inner hatch sealed — use Security Hub interior access");
        onGroknetWhisper(
          "That hatch is cosmetic from out here. Enter through the kiosk — east of the lane.",
        );
        return;
      }

      const nextRoom = movePerimeter(room, direction);
      if (!nextRoom) return;

      if (
        nextRoom === "patrol-lane" &&
        shouldDetectOnEntry(dronePosition, true)
      ) {
        handleDetect("You entered the patrol lane under active sweep");
        setRoom("patrol-lane");
        return;
      }

      setRoom(nextRoom);
      const nextMeta = PERIMETER_ROOMS[nextRoom];

      if (nextRoom === "scrap-alcove") {
        showFeedback("Taking cover in scrap alcove");
        onGroknetWhisper("Smart. S-04 can't resolve you in the shadow pocket.");
      } else if (nextRoom === "security-kiosk") {
        onGroknetWhisper(
          "The Hub doors are mine. Step inside when you're ready — I'll be watching.",
        );
        showFeedback("Security Hub entrance reached");
      } else if (
        nextRoom === "patrol-lane" &&
        canSneakPerimeterLane(dronePosition, droneStatus)
      ) {
        setDroneBypassed(true);
        showFeedback("Crossed patrol lane during drone blind spot");
        onGroknetWhisper("Clean transit. S-04 didn't flag you. …Impressive.");
      } else {
        showFeedback(`Entered ${nextMeta.label}`);
      }
    },
    [
      controlsDisabled,
      room,
      dronePosition,
      droneStatus,
      handleDetect,
      onGroknetWhisper,
      showFeedback,
    ],
  );

  const handleDeployDecoy = useCallback(() => {
    if (room !== "scrap-alcove" && room !== "patrol-lane") return;
    playInteractSound();
    if (decoyTimeoutRef.current) clearTimeout(decoyTimeoutRef.current);

    setDroneStatus("distracted");
    setDronePosition(PERIMETER_LURE_POSITION);
    showFeedback("Scrap decoy deployed — S-04 investigating west");
    onGroknetWhisper(
      "Clever. You threw scrap and it took the bait. Cross now — the window is short.",
    );

    decoyTimeoutRef.current = setTimeout(() => {
      setDroneStatus("patrolling");
      decoyTimeoutRef.current = null;
      onGroknetWhisper("Decoy spent. S-04 is back on loop.");
    }, PERIMETER_DECOY_DURATION_MS);
  }, [room, onGroknetWhisper, showFeedback]);

  const { availableMoves, tryMove } = usePerimeterMovement({
    room,
    onMove: attemptMove,
    disabled: controlsDisabled,
    invertMovement: disoriented && invertMovement,
  });

  const handleSneakLane = useCallback(() => {
    if (room !== "patrol-lane") return;
    playInteractSound();
    if (canSneakPerimeterLane(dronePosition, droneStatus)) {
      setDroneBypassed(true);
      showFeedback("Sneaked through during drone blind spot");
      onGroknetWhisper("You read S-04's loop. Don't get cocky.");
      return;
    }
    handleDetect("You tried to cross while S-04 was scanning");
  }, [room, dronePosition, droneStatus, handleDetect, onGroknetWhisper, showFeedback]);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center",
        disoriented && "disorientation-active",
      )}
    >
      <PerimeterObjectives
        droneBypassed={droneBypassed}
        securityHubEntered={hubEntered}
      />

      {disoriented ? (
        <p className="mb-4 w-full rounded-sm border border-orange-900/40 bg-orange-950/25 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-orange-400/80">
          Neural disorientation — movement and balance compromised
        </p>
      ) : null}

      <AreaBreadcrumb current="outer-perimeter" className="mb-4" />

      <PerimeterAtmosphere>
        <OuterPerimeterMap
          playerRoom={room}
          dronePosition={dronePosition}
          droneActive={droneActive}
          innerGateOpen={false}
          alert={alert}
        />
      </PerimeterAtmosphere>

      <div className="mt-5 grid w-full gap-5 lg:grid-cols-2">
        <PerimeterMovementControls
          availableMoves={availableMoves}
          onMove={tryMove}
          disabled={controlsDisabled}
          roomLabel={roomMeta.label}
        />

        <div className="rounded-sm border border-zinc-800/90 bg-surface/80 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
            Sector 07 · Outer Grid
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.06em] text-zinc-100">
            {roomMeta.label}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {roomMeta.description}
          </p>

          {room === "patrol-lane" ? (
            <div className="mt-4 space-y-3 rounded-sm border border-zinc-800/80 bg-zinc-950/60 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                Security Drone S-04
              </p>
              <p
                className={cn(
                  "font-mono text-[9px] uppercase tracking-widest",
                  droneStatus === "distracted" ||
                  canSneakPerimeterLane(dronePosition, droneStatus)
                    ? "text-emerald-500/80"
                    : "text-red-400/80",
                )}
              >
                {droneStatus === "distracted"
                  ? "Decoy active — cross now"
                  : canSneakPerimeterLane(dronePosition, droneStatus)
                    ? "Blind spot — sneak now"
                    : "Active sweep — wait, distract, or take cover west"}
              </p>
              <Button
                variant="accent"
                onClick={handleSneakLane}
                disabled={controlsDisabled}
                className="h-10 w-full font-mono text-[10px] uppercase tracking-widest"
              >
                Sneak Through Lane
              </Button>
            </div>
          ) : null}

          {room === "scrap-alcove" ? (
            <div className="mt-4 space-y-3 rounded-sm border border-zinc-800/80 bg-zinc-950/60 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                Scrap Decoy
              </p>
              <Button
                variant="accent"
                onClick={handleDeployDecoy}
                disabled={controlsDisabled || droneStatus === "distracted"}
                className="h-10 w-full font-mono text-[10px] uppercase tracking-widest"
              >
                {droneStatus === "distracted"
                  ? "Decoy Active"
                  : "Deploy Scrap Decoy"}
              </Button>
            </div>
          ) : null}

          {room === "security-kiosk" ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playDoorSound();
                  playSuccessSound();
                  setHubEntered(true);
                  onGroknetWhisper(
                    "…Welcome to my house, Alex. Two drones inside. Three terminals. Try not to bore me.",
                  );
                  showFeedback("Entering Security Hub");
                  window.setTimeout(onEnterSecurityHub, 700);
                }}
                disabled={controlsDisabled}
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
              >
                Enter Security Hub
              </Button>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                Interior · OP-SEC-01 · GROKNET-07 · SYS-MONITOR
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <FeedbackToast message={feedback} />
    </div>
  );
}