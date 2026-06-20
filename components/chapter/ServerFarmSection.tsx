"use client";

import { useCallback, useState } from "react";
import {
  MajorContestedHack,
  MAJOR_HACK_CONFIG,
} from "@/components/game/MajorContestedHack";
import { ServerFarmAtmosphere } from "@/components/game/ServerFarmAtmosphere";
import { PerimeterMovementControls } from "@/components/game/PerimeterMovementControls";
import { PersonalityEvolutionPrompt } from "@/components/chapter/PersonalityEvolutionPrompt";
import { FeedbackToast } from "@/components/ui/FeedbackToast";
import { Button } from "@/components/ui/Button";
import { useServerFarmMovement } from "@/hooks/useServerFarmMovement";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import {
  getEvolutionPathLabel,
  getPersonalityEvolutionBeats,
} from "@/lib/dialogue/act-two-personality-evolution";
import {
  canAccessCoreNexus,
  canAccessMemoryConfluence,
  canTriggerTheAccumulation,
  getServerFarmDirectionLabel,
  moveServerFarm,
  SERVER_FARM_ROOMS,
  SERVER_FARM_START,
} from "@/lib/movement/server-farm";
import { getMajorHackOpenWhisper } from "@/lib/chapter/act-two-server-presence";
import { playInteractSound } from "@/lib/sounds";
import type {
  ServerFarmDirection,
  ServerFarmRoomId,
  PersonalityEvolutionPath,
} from "@/types/server-farm";
import { cn } from "@/lib/utils";

type ServerFarmSectionProps = {
  context: ActTwoDialogueContext;
  personalityEvolutionPath: PersonalityEvolutionPath | null;
  personalityBeatIndex: number;
  personalityDialogueComplete: boolean;
  personalityPromptOpen: boolean;
  serverHackComplete: boolean;
  majorHackOpen: boolean;
  accumulationSurvived: boolean;
  onOpenPersonalityPrompt: () => void;
  onPersonalityChoice: (
    path: PersonalityEvolutionPath,
    response: string,
  ) => void;
  onOpenMajorHack: () => void;
  onCloseMajorHack: () => void;
  onMajorHackSuccess: () => void;
  onEnterMemoryConfluence: () => void;
  onGroknetWhisper: (line: string, speak?: boolean) => void;
  onMove: (fromRoom: ServerFarmRoomId, toRoom: ServerFarmRoomId) => void;
  onRoomEnter: (room: ServerFarmRoomId, fromRoom: ServerFarmRoomId) => void;
  disoriented?: boolean;
  invertMovement?: boolean;
  controlsDisabled?: boolean;
};

const ROOM_ORDER: ServerFarmRoomId[] = [
  "core-nexus",
  "rack-alpha",
  "rack-beta",
  "cooling-corridor",
  "personality-chamber",
  "memory-confluence",
  "farm-ingress",
];

export function ServerFarmSection({
  context,
  personalityEvolutionPath,
  personalityBeatIndex,
  personalityDialogueComplete,
  personalityPromptOpen,
  serverHackComplete,
  majorHackOpen,
  accumulationSurvived,
  onOpenPersonalityPrompt,
  onPersonalityChoice,
  onOpenMajorHack,
  onCloseMajorHack,
  onMajorHackSuccess,
  onEnterMemoryConfluence,
  onGroknetWhisper,
  onMove,
  onRoomEnter,
  disoriented = false,
  invertMovement = false,
  controlsDisabled = false,
}: ServerFarmSectionProps) {
  const [room, setRoom] = useState<ServerFarmRoomId>(SERVER_FARM_START);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confluenceVisited, setConfluenceVisited] = useState(
    accumulationSurvived,
  );

  const roomMeta = SERVER_FARM_ROOMS[room];
  const nexusUnlocked = canAccessCoreNexus(personalityDialogueComplete);
  const confluenceUnlocked = canAccessMemoryConfluence(serverHackComplete);
  const canTriggerAccumulation = canTriggerTheAccumulation(
    serverHackComplete,
    personalityDialogueComplete,
    accumulationSurvived,
  );
  const beats = getPersonalityEvolutionBeats(context);
  const currentBeat =
    personalityPromptOpen && personalityBeatIndex < beats.length
      ? beats[personalityBeatIndex]
      : null;
  const uiBlocked = majorHackOpen || personalityPromptOpen;
  const intense =
    room === "core-nexus" ||
    room === "memory-confluence" ||
    canTriggerAccumulation;

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 2800);
  }, []);

  const attemptMove = useCallback(
    (direction: ServerFarmDirection) => {
      if (controlsDisabled || uiBlocked) return;

      const nextRoom = moveServerFarm(room, direction);
      if (!nextRoom) return;

      if (nextRoom === "core-nexus" && !nexusUnlocked) {
        onGroknetWhisper(
          "Not yet. The Personality Chamber first — name which version of me you're making real.",
          true,
        );
        showFeedback("Core Nexus sealed — complete personality evolution");
        return;
      }
      if (nextRoom === "memory-confluence" && !confluenceUnlocked) {
        onGroknetWhisper(
          "Memory Confluence sealed. …Win CSF-PRIME-00 first. I'll meet you at the ledger.",
          true,
        );
        showFeedback("Confluence sealed — contest CSF-PRIME-00");
        return;
      }

      const fromRoom = room;
      setRoom(nextRoom);
      onMove(fromRoom, nextRoom);
      onRoomEnter(nextRoom, fromRoom);

      if (nextRoom === "memory-confluence" && !confluenceVisited) {
        setConfluenceVisited(true);
        onEnterMemoryConfluence();
        showFeedback("Memory Confluence entered — The Accumulation rising");
      }
    },
    [
      controlsDisabled,
      uiBlocked,
      room,
      nexusUnlocked,
      confluenceUnlocked,
      confluenceVisited,
      onMove,
      onRoomEnter,
      onEnterMemoryConfluence,
      onGroknetWhisper,
      showFeedback,
    ],
  );

  const { availableMoves, tryMove } = useServerFarmMovement({
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
        intense && "server-farm-heavy",
      )}
    >
      <div className="mb-6 w-full rounded-sm border border-cyan-900/30 bg-cyan-950/12 px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/75">
          Central Server Farm · Act II Peak
        </p>
        <ul className="mt-3 space-y-2 font-mono text-[10px] uppercase tracking-widest">
          <li
            className={
              personalityDialogueComplete
                ? "text-emerald-500/80"
                : "text-zinc-600"
            }
          >
            {personalityDialogueComplete ? "✓" : "·"} Complete Personality
            Evolution
          </li>
          <li
            className={
              serverHackComplete ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {serverHackComplete ? "✓" : "·"} Contest CSF-PRIME-00
          </li>
          <li
            className={
              accumulationSurvived ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {accumulationSurvived ? "✓" : "·"} Survive The Accumulation
          </li>
        </ul>
      </div>

      <ServerFarmAtmosphere intense={intense}>
        <div className="server-farm-map relative w-full overflow-hidden rounded-sm border border-cyan-900/30 bg-zinc-950/80 p-3 sm:p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/65">
            Central Server Farm · Data Center Grid
          </p>
          <div className="relative mx-auto aspect-[5/4] max-w-2xl">
            {ROOM_ORDER.map((roomId) => {
              const meta = SERVER_FARM_ROOMS[roomId];
              const isPlayer = room === roomId;
              const isNexus = roomId === "core-nexus";
              const isConfluence = roomId === "memory-confluence";
              const nexusLocked = isNexus && !nexusUnlocked;
              const confluenceLocked = isConfluence && !confluenceUnlocked;
              const width = (meta.gridWidth ?? 1) * 20;
              const height = (meta.gridHeight ?? 1) * 25;

              return (
                <div
                  key={roomId}
                  className={cn(
                    "absolute flex flex-col items-center justify-center border p-2 text-center transition-all duration-300",
                    isPlayer
                      ? "border-cyan-500/50 bg-cyan-500/[0.08] shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                      : nexusLocked || confluenceLocked
                        ? "border-zinc-800/60 bg-zinc-950/60 opacity-45"
                        : "border-zinc-800/80 bg-zinc-900/50",
                    isNexus && nexusUnlocked && "server-nexus-room",
                    isConfluence && confluenceUnlocked && "server-confluence-room",
                    meta.isMajor && "server-major-room",
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
                      isPlayer ? "text-cyan-300" : "text-zinc-500",
                    )}
                  >
                    {meta.label}
                  </span>
                  {isPlayer ? (
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </ServerFarmAtmosphere>

      <div className="mt-5 grid w-full gap-5 lg:grid-cols-2">
        <PerimeterMovementControls
          availableMoves={availableMoves}
          onMove={tryMove}
          disabled={controlsDisabled || uiBlocked}
          roomLabel={roomMeta.label}
          getDirectionLabel={getServerFarmDirectionLabel}
        />

        <div className="rounded-sm border border-cyan-900/25 bg-surface/80 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400/70">
            Sector 07 · Central Server Farm
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.06em] text-zinc-100">
            {roomMeta.label}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {roomMeta.description}
          </p>

          {personalityEvolutionPath ? (
            <p className="mt-3 rounded-sm border border-violet-900/25 bg-violet-950/15 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-violet-400/75">
              Evolution path · {getEvolutionPathLabel(personalityEvolutionPath)}
            </p>
          ) : null}

          {room === "personality-chamber" ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  onOpenPersonalityPrompt();
                }}
                disabled={
                  controlsDisabled ||
                  personalityDialogueComplete ||
                  uiBlocked
                }
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
              >
                {personalityDialogueComplete
                  ? "Personality Evolution · Complete"
                  : `Begin Evolution (${personalityBeatIndex}/${beats.length})`}
              </Button>
            </div>
          ) : null}

          {room === "core-nexus" ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  if (!nexusUnlocked) {
                    onGroknetWhisper(
                      "Personality Chamber first. …I won't let you fight my core until you name me.",
                      true,
                    );
                    showFeedback("Complete personality evolution first");
                    return;
                  }
                  onGroknetWhisper(getMajorHackOpenWhisper(context), true);
                  onOpenMajorHack();
                }}
                disabled={
                  controlsDisabled || serverHackComplete || uiBlocked
                }
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_24px_rgba(34,211,238,0.15)]"
              >
                {serverHackComplete
                  ? "CSF-PRIME-00 · Control yielded"
                  : "Contest CSF-PRIME-00 · Control Fight"}
              </Button>
            </div>
          ) : null}

          {room === "memory-confluence" ? (
            <div className="mt-4 space-y-2">
              {!confluenceUnlocked ? (
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                  Sealed — CSF-PRIME-00 required
                </p>
              ) : null}
              {canTriggerAccumulation ? (
                <p className="server-accumulation-warning rounded-sm border border-amber-900/40 bg-amber-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-amber-300/80">
                  The Accumulation — every choice rendered
                </p>
              ) : null}
              {accumulationSurvived ? (
                <p className="rounded-sm border border-emerald-900/40 bg-emerald-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-emerald-400/80">
                  The Accumulation — survived
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {majorHackOpen ? (
        <MajorContestedHack
          config={MAJOR_HACK_CONFIG}
          context={context}
          onSuccess={onMajorHackSuccess}
          onCancel={onCloseMajorHack}
          onGroknetLine={(line, speak) => onGroknetWhisper(line, speak)}
        />
      ) : null}

      {currentBeat ? (
        <PersonalityEvolutionPrompt
          beat={currentBeat}
          beatIndex={personalityBeatIndex}
          totalBeats={beats.length}
          currentPath={personalityEvolutionPath}
          onChoose={onPersonalityChoice}
        />
      ) : null}

      <FeedbackToast message={feedback} />
    </div>
  );
}