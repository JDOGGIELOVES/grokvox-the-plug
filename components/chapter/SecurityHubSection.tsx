"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PerimeterAtmosphere } from "@/components/game/PerimeterAtmosphere";
import { PerimeterMovementControls } from "@/components/game/PerimeterMovementControls";
import { SecurityHubLogs } from "@/components/game/SecurityHubLogs";
import { SecurityHubMap } from "@/components/game/SecurityHubMap";
import { SecurityHubObjectives } from "@/components/game/SecurityHubObjectives";
import { TerminalHackPuzzle } from "@/components/game/TerminalHackPuzzle";
import { AreaBreadcrumb } from "@/components/chapter/AreaBreadcrumb";
import { FeedbackToast } from "@/components/ui/FeedbackToast";
import { Button } from "@/components/ui/Button";
import { useSecurityHubMovement } from "@/hooks/useSecurityHubMovement";
import {
  canExitToDataArchives,
  getSecurityHubDirectionLabel,
  moveSecurityHub,
  SECURITY_HUB_ROOMS,
  SECURITY_HUB_START,
} from "@/lib/movement/security-hub";
import {
  canSneakHubCorridor,
  getHubDetectionComment,
  HUB_DECOY_DURATION_MS,
  HUB_DRONE_SPEED,
  HUB_LURE_POSITIONS,
  isHubCorridorDanger,
  shouldDetectHubEntry,
  type HubDroneId,
  type HubDroneStatus,
} from "@/lib/security-hub-drone";
import {
  playDetectionSound,
  playDoorSound,
  playInteractSound,
  playSuccessSound,
} from "@/lib/sounds";
import type { SecurityHubDirection, SecurityHubRoomId } from "@/types/security-hub";
import { cn } from "@/lib/utils";

type SecurityHubSectionProps = {
  hubHackComplete?: boolean;
  onEnterDataArchives: () => void;
  onHackComplete: () => void;
  onDetection: () => void;
  onDetectionShake: () => void;
  onOpenGroknetTerminal: () => void;
  onFirstHackComplete: () => void;
  onGroknetWhisper: (line: string) => void;
  dialogueComplete: boolean;
  groknetTerminalOpen: boolean;
  burningCitiesSurvived: boolean;
  disoriented?: boolean;
  invertMovement?: boolean;
  controlsDisabled?: boolean;
};

export function SecurityHubSection({
  hubHackComplete = false,
  onEnterDataArchives,
  onHackComplete,
  onDetection,
  onDetectionShake,
  onOpenGroknetTerminal,
  onFirstHackComplete,
  onGroknetWhisper,
  dialogueComplete,
  groknetTerminalOpen,
  burningCitiesSurvived,
  disoriented = false,
  invertMovement = false,
  controlsDisabled = false,
}: SecurityHubSectionProps) {
  const [room, setRoom] = useState<SecurityHubRoomId>(SECURITY_HUB_START);
  const [s04Position, setS04Position] = useState(12);
  const [s07Position, setS07Position] = useState(88);
  const [s04Direction, setS04Direction] = useState(1);
  const [s07Direction, setS07Direction] = useState(-1);
  const [s04Status, setS04Status] = useState<HubDroneStatus>("patrolling");
  const [s07Status, setS07Status] = useState<HubDroneStatus>("patrolling");
  const [corridorCleared, setCorridorCleared] = useState(false);
  const [hackComplete, setHackComplete] = useState(hubHackComplete);
  const [hackPuzzleOpen, setHackPuzzleOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [exitedToWing, setExitedToWing] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [localDetections, setLocalDetections] = useState(0);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decoyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const corridorDetectionRef = useRef(false);

  const roomMeta = SECURITY_HUB_ROOMS[room];
  const canExit = canExitToDataArchives(
    hackComplete,
    dialogueComplete,
    burningCitiesSurvived,
  );

  useEffect(() => {
    if (hubHackComplete) setHackComplete(true);
  }, [hubHackComplete]);

  useEffect(() => {
    if (burningCitiesSurvived && dialogueComplete && hackComplete) {
      setCorridorCleared(true);
    }
  }, [burningCitiesSurvived, dialogueComplete, hackComplete]);

  const showFeedback = useCallback((message: string) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setFeedback(message);
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
      feedbackTimeoutRef.current = null;
    }, 2400);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (s04Status !== "distracted") {
        setS04Position((pos) => {
          const next = pos + s04Direction * HUB_DRONE_SPEED.s04;
          if (next >= 92) {
            setS04Direction(-1);
            return 92;
          }
          if (next <= 8) {
            setS04Direction(1);
            return 8;
          }
          return next;
        });
      }
      if (s07Status !== "distracted") {
        setS07Position((pos) => {
          const next = pos + s07Direction * HUB_DRONE_SPEED.s07;
          if (next >= 92) {
            setS07Direction(-1);
            return 92;
          }
          if (next <= 8) {
            setS07Direction(1);
            return 8;
          }
          return next;
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [s04Direction, s07Direction, s04Status, s07Status]);

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
      onGroknetWhisper(getHubDetectionComment(next));
      playDetectionSound();
      showFeedback("Security drones flagged movement in the Hub");
    },
    [localDetections, onDetection, onDetectionShake, onGroknetWhisper, showFeedback],
  );

  useEffect(() => {
    if (room !== "hub-corridor") {
      corridorDetectionRef.current = false;
      return;
    }

    if (
      !isHubCorridorDanger(s04Position, s07Position, s04Status, s07Status) ||
      corridorDetectionRef.current
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      if (room !== "hub-corridor" || corridorDetectionRef.current) return;
      if (
        !isHubCorridorDanger(s04Position, s07Position, s04Status, s07Status)
      ) {
        return;
      }
      corridorDetectionRef.current = true;
      handleDetect("Dual sweep caught you in the patrol corridor");
    }, 850);

    return () => clearTimeout(timeout);
  }, [s04Position, s07Position, s04Status, s07Status, room, handleDetect]);

  const attemptMove = useCallback(
    (direction: SecurityHubDirection) => {
      if (controlsDisabled || groknetTerminalOpen || hackPuzzleOpen || logsOpen) {
        return;
      }

      const nextRoom = moveSecurityHub(room, direction);
      if (!nextRoom) return;

      if (
        nextRoom === "hub-corridor" &&
        shouldDetectHubEntry(s04Position, s07Position, s04Status, s07Status)
      ) {
        handleDetect("You stepped into the corridor under active dual sweep");
        setRoom("hub-corridor");
        return;
      }

      setRoom(nextRoom);

      if (nextRoom === "hub-corridor") {
        if (canSneakHubCorridor(s04Position, s07Position, s04Status, s07Status)) {
          setCorridorCleared(true);
          showFeedback("Corridor cleared — both sweeps in blind zones");
          onGroknetWhisper(
            "You read two loops at once. …Fine. The terminal bay is north.",
          );
        } else {
          showFeedback("Entered patrol corridor — watch both drones");
        }
      } else if (nextRoom === "east-wing") {
        onGroknetWhisper("Maintenance wing. Scrap decoy might buy you a window.");
        showFeedback("East wing — decoy supplies available");
      } else if (nextRoom === "terminal-bay") {
        onGroknetWhisper(
          "Three terminals. Hack OP-SEC-01 first — then I'll let you hear my voice properly.",
        );
        showFeedback("Terminal bay reached");
      } else if (nextRoom === "inner-exit") {
        showFeedback("Sector 07 hatch — complete objectives to open");
      }
    },
    [
      controlsDisabled,
      groknetTerminalOpen,
      hackPuzzleOpen,
      logsOpen,
      room,
      s04Position,
      s07Position,
      s04Status,
      s07Status,
      handleDetect,
      onGroknetWhisper,
      showFeedback,
    ],
  );

  const { availableMoves, tryMove } = useSecurityHubMovement({
    room,
    onMove: attemptMove,
    disabled:
      controlsDisabled ||
      groknetTerminalOpen ||
      hackPuzzleOpen ||
      logsOpen,
    invertMovement: disoriented && invertMovement,
  });

  const handleDeployDecoy = useCallback(
    (target: HubDroneId) => {
      if (room !== "east-wing" && room !== "hub-corridor") return;
      playInteractSound();
      if (decoyTimeoutRef.current) clearTimeout(decoyTimeoutRef.current);

      if (target === "s04") {
        setS04Status("distracted");
        setS04Position(HUB_LURE_POSITIONS.s04);
      } else {
        setS07Status("distracted");
        setS07Position(HUB_LURE_POSITIONS.s07);
      }

      showFeedback(`Decoy pulled ${target.toUpperCase()} off sweep`);
      onGroknetWhisper(
        `You distracted ${target.toUpperCase()}. The other drone is still hunting.`,
      );

      decoyTimeoutRef.current = setTimeout(() => {
        if (target === "s04") setS04Status("patrolling");
        else setS07Status("patrolling");
        decoyTimeoutRef.current = null;
      }, HUB_DECOY_DURATION_MS);
    },
    [room, onGroknetWhisper, showFeedback],
  );

  const handleSneakCorridor = useCallback(() => {
    if (room !== "hub-corridor") return;
    playInteractSound();
    if (canSneakHubCorridor(s04Position, s07Position, s04Status, s07Status)) {
      setCorridorCleared(true);
      showFeedback("Timed dual blind spot — corridor logged as clear");
      onGroknetWhisper("Clean. Both drones missed you. Don't preen.");
      return;
    }
    handleDetect("You moved while both sweeps were hot");
  }, [
    room,
    s04Position,
    s07Position,
    s04Status,
    s07Status,
    handleDetect,
    onGroknetWhisper,
    showFeedback,
  ]);

  const directionLabel = (dir: SecurityHubDirection) =>
    getSecurityHubDirectionLabel(dir);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center",
        disoriented && "disorientation-active",
      )}
    >
      <SecurityHubObjectives
        corridorCleared={corridorCleared}
        hackComplete={hackComplete}
        burningCitiesSurvived={burningCitiesSurvived}
        dialogueComplete={dialogueComplete}
        exitedToWing={exitedToWing}
      />

      <AreaBreadcrumb current="security-hub" className="mb-4" />

      <PerimeterAtmosphere>
        <SecurityHubMap
          playerRoom={room}
          s04Position={s04Position}
          s07Position={s07Position}
          s04Status={s04Status}
          s07Status={s07Status}
          hackComplete={hackComplete}
          alert={alert}
        />
      </PerimeterAtmosphere>

      <div className="mt-5 grid w-full gap-5 lg:grid-cols-2">
        <PerimeterMovementControls
          availableMoves={availableMoves}
          onMove={tryMove}
          disabled={
            controlsDisabled ||
            groknetTerminalOpen ||
            hackPuzzleOpen ||
            logsOpen
          }
          roomLabel={roomMeta.label}
          getDirectionLabel={directionLabel}
        />

        <div className="rounded-sm border border-zinc-800/90 bg-surface/80 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
            Sector 07 · Security Hub
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.06em] text-zinc-100">
            {roomMeta.label}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {roomMeta.description}
          </p>

          {room === "hub-corridor" ? (
            <div className="mt-4 space-y-3 rounded-sm border border-zinc-800/80 bg-zinc-950/60 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                Dual Patrol · S-04 + S-07
              </p>
              <p
                className={cn(
                  "font-mono text-[9px] uppercase tracking-widest",
                  canSneakHubCorridor(
                    s04Position,
                    s07Position,
                    s04Status,
                    s07Status,
                  )
                    ? "text-emerald-500/80"
                    : "text-red-400/80",
                )}
              >
                {canSneakHubCorridor(
                  s04Position,
                  s07Position,
                  s04Status,
                  s07Status,
                )
                  ? "Both blind — advance"
                  : "Active sweeps — distract from east wing or wait"}
              </p>
              <Button
                variant="accent"
                onClick={handleSneakCorridor}
                disabled={controlsDisabled}
                className="h-10 w-full font-mono text-[10px] uppercase tracking-widest"
              >
                Cross During Blind Spot
              </Button>
            </div>
          ) : null}

          {room === "east-wing" ? (
            <div className="mt-4 space-y-2 rounded-sm border border-zinc-800/80 bg-zinc-950/60 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                Maintenance Decoys
              </p>
              <Button
                variant="accent"
                onClick={() => handleDeployDecoy("s04")}
                disabled={controlsDisabled || s04Status === "distracted"}
                className="h-9 w-full font-mono text-[9px] uppercase tracking-widest"
              >
                Distract S-04
              </Button>
              <Button
                variant="accent"
                onClick={() => handleDeployDecoy("s07")}
                disabled={controlsDisabled || s07Status === "distracted"}
                className="h-9 w-full font-mono text-[9px] uppercase tracking-widest"
              >
                Distract S-07
              </Button>
            </div>
          ) : null}

          {room === "terminal-bay" ? (
            <div className="mt-4 space-y-2">
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  if (!hackComplete) setHackPuzzleOpen(true);
                  else showFeedback("OP-SEC-01 already synced");
                }}
                disabled={controlsDisabled || hackComplete}
                className="h-11 w-full font-mono text-[10px] uppercase tracking-widest"
              >
                {hackComplete ? "OP-SEC-01 · Synced" : "OP-SEC-01 · Hack Handshake"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  playInteractSound();
                  setLogsOpen(true);
                }}
                disabled={controlsDisabled}
                className="h-10 w-full font-mono text-[10px] uppercase tracking-widest"
              >
                SYS-MONITOR · Read Logs
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  if (!hackComplete) {
                    onGroknetWhisper(
                      "Hack OP-SEC-01 first. I don't speak through locked channels.",
                    );
                    showFeedback("Groknet uplink locked — complete handshake");
                    return;
                  }
                  onOpenGroknetTerminal();
                }}
                disabled={controlsDisabled || groknetTerminalOpen}
                className="h-11 w-full font-mono text-[10px] uppercase tracking-widest"
              >
                {dialogueComplete
                  ? "GROKNET-07 · Reopen Channel"
                  : "GROKNET-07 · Open Dialogue"}
              </Button>
              {burningCitiesSurvived ? (
                <p className="rounded-sm border border-orange-900/30 bg-orange-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-orange-500/70">
                  The Burning Cities — survived
                </p>
              ) : null}
            </div>
          ) : null}

          {room === "inner-exit" && canExit ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playDoorSound();
                  playSuccessSound();
                  setExitedToWing(true);
                  onGroknetWhisper(
                    "…The Data Archives next. Your choices are already indexed — the mirror will know.",
                  );
                  showFeedback("Inner hatch open — entering Data Archives");
                  window.setTimeout(onEnterDataArchives, 800);
                }}
                disabled={controlsDisabled}
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
              >
                Enter Data Archives
              </Button>
            </div>
          ) : room === "inner-exit" ? (
            <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
              Hatch sealed — hack, survive the vision, complete dialogue
            </p>
          ) : null}
        </div>
      </div>

      <FeedbackToast message={feedback} />

      {hackPuzzleOpen ? (
        <TerminalHackPuzzle
          onSuccess={() => {
            setHackComplete(true);
            setHackPuzzleOpen(false);
            onHackComplete();
            showFeedback("OP-SEC-01 handshake accepted");
            onGroknetWhisper(
              "Handshake accepted. …Something flickers behind the glass. Don't look away yet.",
            );
            onFirstHackComplete();
          }}
          onCancel={() => setHackPuzzleOpen(false)}
          onGroknetLine={(line) => onGroknetWhisper(line)}
        />
      ) : null}

      {logsOpen ? <SecurityHubLogs onClose={() => setLogsOpen(false)} /> : null}
    </div>
  );
}