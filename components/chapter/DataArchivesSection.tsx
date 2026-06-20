"use client";

import { useCallback, useEffect, useState } from "react";
import { PerimeterAtmosphere } from "@/components/game/PerimeterAtmosphere";
import { PerimeterMovementControls } from "@/components/game/PerimeterMovementControls";
import { AreaBreadcrumb } from "@/components/chapter/AreaBreadcrumb";
import { FeedbackToast } from "@/components/ui/FeedbackToast";
import { Button } from "@/components/ui/Button";
import { useArchivesMovement } from "@/hooks/useArchivesMovement";
import {
  ARCHIVES_ROOMS,
  ARCHIVES_START,
  canCompleteActOne,
  canReachArchivesCore,
  getArchivesDirectionLabel,
  moveArchives,
} from "@/lib/movement/data-archives";
import {
  playDoorSound,
  playInteractSound,
  playSuccessSound,
} from "@/lib/sounds";
import type { ArchivesDirection, ArchivesRoomId } from "@/types/data-archives";
import { cn } from "@/lib/utils";

type DataArchivesSectionProps = {
  onCompleteActOne: () => void;
  onOpenArchivesTerminal: () => void;
  onOpenFinaleTerminal: () => void;
  onEnterMirrorVault: () => void;
  onGroknetWhisper: (line: string) => void;
  mirrorSurvived: boolean;
  archivesDialogueComplete: boolean;
  finaleDialogueComplete: boolean;
  convergenceSurvived: boolean;
  archivesTerminalOpen: boolean;
  finaleTerminalOpen: boolean;
  disoriented?: boolean;
  invertMovement?: boolean;
  controlsDisabled?: boolean;
};

const ROOM_ORDER: ArchivesRoomId[] = [
  "archives-core",
  "record-stacks",
  "mirror-vault",
  "archive-entry",
];

export function DataArchivesSection({
  onCompleteActOne,
  onOpenArchivesTerminal,
  onOpenFinaleTerminal,
  onEnterMirrorVault,
  onGroknetWhisper,
  mirrorSurvived,
  archivesDialogueComplete,
  finaleDialogueComplete,
  convergenceSurvived,
  archivesTerminalOpen,
  finaleTerminalOpen,
  disoriented = false,
  invertMovement = false,
  controlsDisabled = false,
}: DataArchivesSectionProps) {
  const [room, setRoom] = useState<ArchivesRoomId>(ARCHIVES_START);
  const [mirrorVisited, setMirrorVisited] = useState(mirrorSurvived);
  const [coreVisited, setCoreVisited] = useState(finaleDialogueComplete);
  const [feedback, setFeedback] = useState<string | null>(null);

  const roomMeta = ARCHIVES_ROOMS[room];
  const canReachCore = canReachArchivesCore(
    mirrorSurvived,
    archivesDialogueComplete,
  );
  const canFinish = canCompleteActOne(
    finaleDialogueComplete,
    convergenceSurvived,
  );
  const terminalBlocking = archivesTerminalOpen || finaleTerminalOpen;

  useEffect(() => {
    if (mirrorSurvived) setMirrorVisited(true);
  }, [mirrorSurvived]);

  useEffect(() => {
    if (finaleDialogueComplete) setCoreVisited(true);
  }, [finaleDialogueComplete]);

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 2400);
  }, []);

  const attemptMove = useCallback(
    (direction: ArchivesDirection) => {
      if (controlsDisabled || terminalBlocking) return;

      const nextRoom = moveArchives(room, direction);
      if (!nextRoom) return;

      if (nextRoom === "archives-core" && !canReachCore) {
        onGroknetWhisper(
          "Not yet. The mirror and the stacks transcript come first — then the root opens.",
        );
        showFeedback("Archives Core sealed — complete prior objectives");
        return;
      }

      setRoom(nextRoom);

      if (nextRoom === "mirror-vault" && !mirrorVisited) {
        setMirrorVisited(true);
        onEnterMirrorVault();
        onGroknetWhisper(
          "The mirror vault. …I curated this reflection from your Hub choices. Look closely.",
        );
        showFeedback("Mirror vault entered — neural bleed rising");
      } else if (nextRoom === "record-stacks") {
        onGroknetWhisper(
          "Record stacks. Your transcript is annotated. Open the terminal when you're ready to answer for it.",
        );
        showFeedback("Record stacks reached");
      } else if (nextRoom === "archives-core" && !coreVisited) {
        setCoreVisited(true);
        onGroknetWhisper(
          "Archives Core. …End of the index. End of the infiltration. What you say here decides what I show you next.",
        );
        showFeedback("Archives Core reached — root node active");
      }
    },
    [
      controlsDisabled,
      terminalBlocking,
      room,
      canReachCore,
      mirrorVisited,
      coreVisited,
      onEnterMirrorVault,
      onGroknetWhisper,
      showFeedback,
    ],
  );

  const { availableMoves, tryMove } = useArchivesMovement({
    room,
    onMove: attemptMove,
    disabled: controlsDisabled || terminalBlocking,
    invertMovement: disoriented && invertMovement,
  });

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center",
        disoriented && "disorientation-active",
      )}
    >
      <div className="mb-6 w-full rounded-sm border border-zinc-800/80 bg-zinc-950/50 px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
          Data Archives Objectives
        </p>
        <ul className="mt-3 space-y-2 font-mono text-[10px] uppercase tracking-widest">
          <li className={mirrorSurvived ? "text-emerald-500/80" : "text-zinc-600"}>
            {mirrorSurvived ? "✓" : "·"} Survive The Mirror
          </li>
          <li
            className={
              archivesDialogueComplete ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {archivesDialogueComplete ? "✓" : "·"} Complete Archives dialogue
          </li>
          <li
            className={
              finaleDialogueComplete ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {finaleDialogueComplete ? "✓" : "·"} Confront Groknet at the Core
          </li>
          <li
            className={
              convergenceSurvived ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {convergenceSurvived ? "✓" : "·"} Survive The Convergence
          </li>
        </ul>
      </div>

      <AreaBreadcrumb current="data-archives" className="mb-4" />

      <PerimeterAtmosphere>
        <div className="archives-map relative w-full overflow-hidden rounded-sm border border-zinc-800/90 bg-zinc-950/80 p-3 sm:p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            Data Archives · Indexed Memory Grid
          </p>
          <div className="relative mx-auto aspect-[4/3] max-w-lg">
            {ROOM_ORDER.map((roomId) => {
              const meta = ARCHIVES_ROOMS[roomId];
              const isPlayer = room === roomId;
              const isMirror = roomId === "mirror-vault";
              const isCore = roomId === "archives-core";
              return (
                <div
                  key={roomId}
                  className={cn(
                    "absolute flex flex-col items-center justify-center border p-2 text-center transition-all duration-300",
                    isPlayer
                      ? "border-accent/50 bg-accent/[0.08] shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                      : "border-zinc-800/80 bg-zinc-900/50",
                    isMirror && "archives-mirror-room",
                    isCore && "archives-core-room",
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
                      isPlayer ? "text-accent" : "text-zinc-500",
                      isCore && canReachCore && "text-amber-400/80",
                    )}
                  >
                    {meta.label}
                  </span>
                  {isPlayer ? (
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </PerimeterAtmosphere>

      <div className="mt-5 grid w-full gap-5 lg:grid-cols-2">
        <PerimeterMovementControls
          availableMoves={availableMoves}
          onMove={tryMove}
          disabled={controlsDisabled || terminalBlocking}
          roomLabel={roomMeta.label}
          getDirectionLabel={getArchivesDirectionLabel}
        />

        <div className="rounded-sm border border-zinc-800/90 bg-surface/80 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
            Sector 07 · Data Archives
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.06em] text-zinc-100">
            {roomMeta.label}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {roomMeta.description}
          </p>

          {room === "mirror-vault" ? (
            <p className="mt-4 rounded-sm border border-violet-900/40 bg-violet-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-violet-400/80">
              {mirrorSurvived
                ? "The Mirror — survived"
                : "Approach the glass — Groknet is already watching"}
            </p>
          ) : null}

          {room === "record-stacks" ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  if (!mirrorSurvived) {
                    onGroknetWhisper(
                      "The mirror first, Alex. The Archives won't annotate a version of you I haven't shown you.",
                    );
                    showFeedback("Complete The Mirror before dialogue");
                    return;
                  }
                  onOpenArchivesTerminal();
                }}
                disabled={controlsDisabled || archivesTerminalOpen}
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
              >
                {archivesDialogueComplete
                  ? "Reopen Archives Terminal"
                  : "Access GROKNET-07 Archives Uplink"}
              </Button>
            </div>
          ) : null}

          {room === "archives-core" ? (
            <div className="mt-4 space-y-3">
              {!canReachCore ? (
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                  Sealed — survive The Mirror and complete Archives dialogue
                </p>
              ) : null}

              {canReachCore && !finaleDialogueComplete ? (
                <Button
                  variant="accent"
                  onClick={() => {
                    playInteractSound();
                    onOpenFinaleTerminal();
                  }}
                  disabled={controlsDisabled || finaleTerminalOpen}
                  className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
                >
                  Open Root Confrontation Uplink
                </Button>
              ) : null}

              {finaleDialogueComplete && !convergenceSurvived ? (
                <p className="rounded-sm border border-amber-900/40 bg-amber-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-amber-400/80">
                  The Convergence is building — hold your ground
                </p>
              ) : null}

              {canFinish ? (
                <Button
                  variant="accent"
                  onClick={() => {
                    playDoorSound();
                    playSuccessSound();
                    onGroknetWhisper(
                      "Act I sealed. The infiltration is over. …Act II — The Conversation — waits on the other side of the plug.",
                    );
                    showFeedback("Act I complete — chapter sealed");
                    window.setTimeout(onCompleteActOne, 900);
                  }}
                  disabled={controlsDisabled}
                  className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_24px_rgba(249,115,22,0.2)]"
                >
                  Seal Act I — Chapter Complete
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <FeedbackToast message={feedback} />
    </div>
  );
}