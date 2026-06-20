"use client";

import { useCallback, useEffect, useState } from "react";
import { ResidentialAtmosphere } from "@/components/game/ResidentialAtmosphere";
import { PerimeterMovementControls } from "@/components/game/PerimeterMovementControls";
import { FeedbackToast } from "@/components/ui/FeedbackToast";
import { Button } from "@/components/ui/Button";
import { useResidentialMovement } from "@/hooks/useResidentialMovement";
import {
  canEnterMemoryHall,
  canTriggerLastConversation,
  getResidentialDirectionLabel,
  moveResidential,
  RESIDENTIAL_ROOMS,
  RESIDENTIAL_START,
} from "@/lib/movement/residential-sector";
import { playInteractSound } from "@/lib/sounds";
import type {
  PersonalArtifactId,
  ResidentialDirection,
  ResidentialRoomId,
} from "@/types/residential-sector";
import { cn } from "@/lib/utils";

type ResidentialSectorSectionProps = {
  dialogueComplete: boolean;
  lastConversationSurvived: boolean;
  terminalOpen: boolean;
  hallucinationImminent?: boolean;
  onOpenTerminal: () => void;
  onEnterMemoryHall: () => void;
  onGroknetWhisper: (line: string) => void;
  onMove: (fromRoom: ResidentialRoomId, toRoom: ResidentialRoomId) => void;
  onRoomEnter: (
    room: ResidentialRoomId,
    fromRoom: ResidentialRoomId,
  ) => void;
  onInspectArtifact: (
    room: ResidentialRoomId,
    artifactId: PersonalArtifactId,
  ) => void;
  onEnterResearchWing?: () => void;
  researchWingUnlocked?: boolean;
  disoriented?: boolean;
  invertMovement?: boolean;
  controlsDisabled?: boolean;
};

const ROOM_ORDER: ResidentialRoomId[] = [
  "your-quarters",
  "memory-hall",
  "commons",
  "groknet-nook",
  "sector-entry",
];

export function ResidentialSectorSection({
  dialogueComplete,
  lastConversationSurvived,
  terminalOpen,
  hallucinationImminent = false,
  onOpenTerminal,
  onEnterMemoryHall,
  onGroknetWhisper,
  onMove,
  onRoomEnter,
  onInspectArtifact,
  onEnterResearchWing,
  researchWingUnlocked = false,
  disoriented = false,
  invertMovement = false,
  controlsDisabled = false,
}: ResidentialSectorSectionProps) {
  const [room, setRoom] = useState<ResidentialRoomId>(RESIDENTIAL_START);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [memoryHallVisited, setMemoryHallVisited] = useState(
    lastConversationSurvived,
  );
  const [inspected, setInspected] = useState<Set<string>>(new Set());

  const roomMeta = RESIDENTIAL_ROOMS[room];
  const memoryHallUnlocked = canEnterMemoryHall(dialogueComplete);
  const canTriggerVision = canTriggerLastConversation(
    dialogueComplete,
    lastConversationSurvived,
  );
  const terminalBlocking = terminalOpen;
  const intenseAtmosphere =
    room === "groknet-nook" ||
    room === "memory-hall" ||
    hallucinationImminent;

  useEffect(() => {
    if (lastConversationSurvived) setMemoryHallVisited(true);
  }, [lastConversationSurvived]);

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 2600);
  }, []);

  const attemptMove = useCallback(
    (direction: ResidentialDirection) => {
      if (controlsDisabled || terminalBlocking) return;

      const nextRoom = moveResidential(room, direction);
      if (!nextRoom) return;

      if (nextRoom === "memory-hall" && !memoryHallUnlocked) {
        onGroknetWhisper(
          "Not yet, Alex. Sit in your quarters. Say what you came here to say — then the hall opens.",
        );
        showFeedback("Memory Hall sealed — complete quarters dialogue first");
        return;
      }

      const fromRoom = room;
      setRoom(nextRoom);
      onMove(fromRoom, nextRoom);
      onRoomEnter(nextRoom, fromRoom);

      if (nextRoom === "memory-hall" && !memoryHallVisited) {
        setMemoryHallVisited(true);
        onEnterMemoryHall();
        showFeedback("Memory Hall entered — emotional bleed rising");
      } else if (nextRoom === "groknet-nook") {
        showFeedback("Groknet's Nook — presence intensified");
      } else if (nextRoom === "your-quarters") {
        showFeedback("Your Quarters — terminal active");
      } else if (nextRoom === "commons") {
        showFeedback("Commons reached");
      }
    },
    [
      controlsDisabled,
      terminalBlocking,
      room,
      memoryHallUnlocked,
      memoryHallVisited,
      onMove,
      onRoomEnter,
      onEnterMemoryHall,
      onGroknetWhisper,
      showFeedback,
    ],
  );

  const { availableMoves, tryMove } = useResidentialMovement({
    room,
    onMove: attemptMove,
    disabled: controlsDisabled || terminalBlocking,
    invertMovement: disoriented && invertMovement,
  });

  const handleInspect = (artifactId: PersonalArtifactId) => {
    const key = `${room}:${artifactId}`;
    if (inspected.has(key)) return;
    playInteractSound();
    setInspected((prev) => new Set(prev).add(key));
    onInspectArtifact(room, artifactId);
    showFeedback("Groknet noted what you touched");
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center",
        disoriented && "disorientation-active",
        intenseAtmosphere && "residential-sector-heavy",
      )}
    >
      <div className="mb-6 w-full rounded-sm border border-violet-900/25 bg-violet-950/15 px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-violet-400/70">
          Act II Objectives
        </p>
        <ul className="mt-3 space-y-2 font-mono text-[10px] uppercase tracking-widest">
          <li
            className={
              dialogueComplete ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {dialogueComplete ? "✓" : "·"} Complete quarters dialogue with Groknet
          </li>
          <li
            className={
              memoryHallUnlocked ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {memoryHallUnlocked ? "✓" : "·"} Unlock Memory Hall
          </li>
          <li
            className={
              lastConversationSurvived ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {lastConversationSurvived ? "✓" : "·"} Survive The Last Conversation
          </li>
          <li
            className={
              researchWingUnlocked ? "text-amber-400/80" : "text-zinc-600"
            }
          >
            {researchWingUnlocked ? "✓" : "·"} Descend to Research Wing
          </li>
        </ul>
      </div>

      <ResidentialAtmosphere intense={intenseAtmosphere}>
        <div className="residential-map relative w-full overflow-hidden rounded-sm border border-violet-900/30 bg-zinc-950/80 p-3 sm:p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-violet-400/60">
            Residential Sector · Living Quarters Grid
          </p>
          <div className="relative mx-auto aspect-[4/3] max-w-lg">
            {ROOM_ORDER.map((roomId) => {
              const meta = RESIDENTIAL_ROOMS[roomId];
              const isPlayer = room === roomId;
              const isQuarters = roomId === "your-quarters";
              const isHall = roomId === "memory-hall";
              const isNook = roomId === "groknet-nook";
              const hallLocked = isHall && !memoryHallUnlocked;

              return (
                <div
                  key={roomId}
                  className={cn(
                    "absolute flex flex-col items-center justify-center border p-2 text-center transition-all duration-300",
                    isPlayer
                      ? "border-violet-500/50 bg-violet-500/[0.08] shadow-[0_0_20px_rgba(139,92,246,0.18)]"
                      : hallLocked
                        ? "border-zinc-800/60 bg-zinc-950/60 opacity-50"
                        : "border-zinc-800/80 bg-zinc-900/50",
                    isQuarters && "residential-quarters-room",
                    isHall && memoryHallUnlocked && "residential-memory-room",
                    isNook && "residential-nook-room",
                    isHall && canTriggerVision && "residential-memory-bleed",
                  )}
                  style={{
                    top: `${meta.gridRow * 25}%`,
                    left: `${meta.gridCol * 33.33}%`,
                    width: "33.33%",
                    height: "25%",
                  }}
                >
                  <span
                    className={cn(
                      "font-mono text-[8px] uppercase tracking-[0.12em]",
                      isPlayer ? "text-violet-300" : "text-zinc-500",
                      isHall && memoryHallUnlocked && "text-violet-400/80",
                    )}
                  >
                    {meta.label}
                  </span>
                  {isPlayer ? (
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </ResidentialAtmosphere>

      <div className="mt-5 grid w-full gap-5 lg:grid-cols-2">
        <PerimeterMovementControls
          availableMoves={availableMoves}
          onMove={tryMove}
          disabled={controlsDisabled || terminalBlocking}
          roomLabel={roomMeta.label}
          getDirectionLabel={getResidentialDirectionLabel}
        />

        <div className="rounded-sm border border-violet-900/25 bg-surface/80 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400/70">
            Sector 07 · Residential
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.06em] text-zinc-100">
            {roomMeta.label}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {roomMeta.description}
          </p>
          <p className="mt-3 rounded-sm border border-violet-900/20 bg-violet-950/15 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-violet-400/70">
            {roomMeta.personalNote}
          </p>

          {roomMeta.artifacts.length > 0 ? (
            <div className="mt-4 space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                Personal traces
              </p>
              {roomMeta.artifacts.map((artifact) => {
                const key = `${room}:${artifact.id}`;
                const wasInspected = inspected.has(key);
                return (
                  <button
                    key={artifact.id}
                    type="button"
                    onClick={() => handleInspect(artifact.id)}
                    disabled={controlsDisabled || wasInspected}
                    className={cn(
                      "interactable w-full rounded-sm border px-3 py-2.5 text-left transition-colors",
                      wasInspected
                        ? "border-zinc-800/80 bg-zinc-950/50 opacity-60"
                        : "border-violet-900/30 bg-violet-950/10 hover:border-violet-700/40 hover:bg-violet-950/20",
                    )}
                  >
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-violet-300/80">
                      {artifact.label}
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-zinc-500">
                      {artifact.detail}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {room === "your-quarters" ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  onOpenTerminal();
                }}
                disabled={controlsDisabled || terminalOpen}
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
              >
                {dialogueComplete
                  ? "Reopen Conversation Uplink"
                  : "Begin The Conversation — Terminal"}
              </Button>
            </div>
          ) : null}

          {room === "memory-hall" ? (
            <div className="mt-4 space-y-3">
              {!memoryHallUnlocked ? (
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                  Sealed — complete quarters dialogue first
                </p>
              ) : null}

              {memoryHallUnlocked && canTriggerVision ? (
                <p className="residential-memory-warning rounded-sm border border-rose-900/40 bg-rose-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-rose-300/80">
                  The Last Conversation is building — hold your ground
                </p>
              ) : null}

              {lastConversationSurvived ? (
                <p className="rounded-sm border border-emerald-900/40 bg-emerald-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-emerald-400/80">
                  The Last Conversation — survived
                </p>
              ) : null}

              {lastConversationSurvived && onEnterResearchWing ? (
                <Button
                  variant="accent"
                  onClick={() => {
                    playInteractSound();
                    onEnterResearchWing();
                  }}
                  disabled={controlsDisabled || researchWingUnlocked}
                  className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_24px_rgba(245,158,11,0.18)]"
                >
                  {researchWingUnlocked
                    ? "Research Wing · En route"
                    : "Descend to Research Wing · Experimental Labs"}
                </Button>
              ) : null}
            </div>
          ) : null}

          {room === "groknet-nook" ? (
            <p className="mt-4 rounded-sm border border-violet-900/40 bg-violet-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-violet-400/80">
              Presence intensified — Groknet is listening between your thoughts
            </p>
          ) : null}
        </div>
      </div>

      <FeedbackToast message={feedback} />
    </div>
  );
}