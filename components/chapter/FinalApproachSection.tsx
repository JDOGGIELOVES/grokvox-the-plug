"use client";

import { useCallback, useState } from "react";
import { GroknetPresenceBanner } from "@/components/chapter/GroknetPresenceBanner";
import { PerimeterMovementControls } from "@/components/game/PerimeterMovementControls";
import { FeedbackToast } from "@/components/ui/FeedbackToast";
import { Button } from "@/components/ui/Button";
import {
  getCoreTerminalDialogue,
  getFinalApproachMoveWhisper,
  getFinalApproachRoomWhisper,
} from "@/lib/dialogue/act-three-final-approach";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getDeepCoreDirectionLabel } from "@/lib/movement/deep-core";
import {
  FINAL_APPROACH_ROOMS,
  FINAL_APPROACH_START,
  moveFinalApproach,
} from "@/lib/movement/final-approach";
import { useFinalApproachMovement } from "@/hooks/useDeepCoreMovement";
import { playInteractSound } from "@/lib/sounds";
import type { DeepCoreDirection, FinalApproachRoomId } from "@/types/deep-core";
import { cn } from "@/lib/utils";

type FinalApproachSectionProps = {
  context: ActThreeDialogueContext;
  approachDialogueComplete: boolean;
  approachPromptOpen: boolean;
  onOpenApproachPrompt: () => void;
  onApproachDialogueComplete: (response: string) => void;
  onEnterPlugChamber: () => void;
  onGroknetWhisper: (line: string, speak?: boolean) => void;
  onMove: (fromRoom: FinalApproachRoomId, toRoom: FinalApproachRoomId) => void;
  onRoomEnter: (room: FinalApproachRoomId, fromRoom: FinalApproachRoomId) => void;
  disoriented?: boolean;
  invertMovement?: boolean;
  controlsDisabled?: boolean;
};

const ROOM_ORDER: FinalApproachRoomId[] = [
  "core-terminal",
  "interface-corridor",
  "approach-landing",
];

export function FinalApproachSection({
  context,
  approachDialogueComplete,
  approachPromptOpen,
  onOpenApproachPrompt,
  onApproachDialogueComplete,
  onEnterPlugChamber,
  onGroknetWhisper,
  onMove,
  onRoomEnter,
  disoriented = false,
  invertMovement = false,
  controlsDisabled = false,
}: FinalApproachSectionProps) {
  const [room, setRoom] = useState<FinalApproachRoomId>(FINAL_APPROACH_START);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [terminalTriggered, setTerminalTriggered] = useState(
    approachDialogueComplete,
  );

  const roomMeta = FINAL_APPROACH_ROOMS[room];
  const terminalDialogue = getCoreTerminalDialogue(context);
  const uiBlocked = approachPromptOpen;

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 2800);
  }, []);

  const attemptMove = useCallback(
    (direction: DeepCoreDirection) => {
      if (controlsDisabled || uiBlocked) return;

      const nextRoom = moveFinalApproach(room, direction);
      if (!nextRoom) return;

      const fromRoom = room;
      setRoom(nextRoom);
      onMove(fromRoom, nextRoom);
      onRoomEnter(nextRoom, fromRoom);
      onGroknetWhisper(
        getFinalApproachMoveWhisper(context, nextRoom),
        nextRoom === "core-terminal",
      );

      if (nextRoom === "core-terminal" && !terminalTriggered) {
        setTerminalTriggered(true);
        showFeedback("Physical Core Terminal — speak before the hatch");
      }
    },
    [
      controlsDisabled,
      uiBlocked,
      room,
      onMove,
      onRoomEnter,
      onGroknetWhisper,
      context,
      terminalTriggered,
      showFeedback,
    ],
  );

  const { availableMoves, tryMove } = useFinalApproachMovement({
    room,
    onMove: attemptMove,
    disabled: controlsDisabled || uiBlocked,
    invertMovement: disoriented && invertMovement,
  });

  return (
    <div
      className={cn(
        "final-approach-heavy flex w-full flex-col items-center",
        disoriented && "disorientation-active",
      )}
    >
      <GroknetPresenceBanner
        context={context}
        stage="deep-core"
        className="mb-4"
      />

      <div className="mb-6 w-full rounded-sm border border-violet-900/30 bg-violet-950/12 px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-violet-400/75">
          Final Approach · Physical Core Terminal
        </p>
        <ul className="mt-3 space-y-2 font-mono text-[10px] uppercase tracking-widest">
          <li
            className={
              room === "core-terminal" || approachDialogueComplete
                ? "text-emerald-500/80"
                : "text-zinc-600"
            }
          >
            {room === "core-terminal" || approachDialogueComplete ? "✓" : "·"}{" "}
            Reach the Core Terminal
          </li>
          <li
            className={
              approachDialogueComplete ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {approachDialogueComplete ? "✓" : "·"} Speak at the terminal
          </li>
        </ul>
      </div>

      <div className="final-approach-map relative w-full overflow-hidden rounded-sm border border-violet-900/30 bg-zinc-950/80 p-3 sm:p-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-violet-400/65">
          Final Approach · Descent Complete
        </p>
        <div className="relative mx-auto aspect-[4/3] max-w-xl">
          {ROOM_ORDER.map((roomId) => {
            const meta = FINAL_APPROACH_ROOMS[roomId];
            const isPlayer = room === roomId;
            const width = (meta.gridWidth ?? 1) * 25;
            const height = (meta.gridHeight ?? 1) * 30;

            return (
              <div
                key={roomId}
                className={cn(
                  "absolute flex flex-col items-center justify-center border p-2 text-center transition-all duration-300",
                  isPlayer
                    ? "border-violet-500/50 bg-violet-500/[0.08] shadow-[0_0_28px_rgba(139,92,246,0.2)]"
                    : "border-zinc-800/80 bg-zinc-900/50",
                  roomId === "core-terminal" && "final-approach-terminal-room",
                  meta.unstable && "deep-core-unstable-room",
                )}
                style={{
                  top: `${meta.gridRow * 30}%`,
                  left: `${meta.gridCol * 25}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                }}
              >
                <span
                  className={cn(
                    "font-mono text-[8px] uppercase tracking-[0.1em] sm:text-[9px]",
                    isPlayer ? "text-violet-300" : "text-zinc-500",
                  )}
                >
                  {meta.label}
                </span>
                {isPlayer ? (
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_14px_rgba(139,92,246,0.85)]" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid w-full gap-5 lg:grid-cols-2">
        <PerimeterMovementControls
          availableMoves={availableMoves}
          onMove={tryMove}
          disabled={controlsDisabled || uiBlocked}
          roomLabel={roomMeta.label}
          getDirectionLabel={getDeepCoreDirectionLabel}
        />

        <div className="rounded-sm border border-violet-900/25 bg-surface/80 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400/70">
            Sector 07 · Final Approach
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.06em] text-zinc-100">
            {roomMeta.label}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {roomMeta.description}
          </p>

          {room === "core-terminal" ? (
            <div className="mt-4 space-y-2">
              <p className="final-approach-terminal-hum rounded-sm border border-violet-900/35 bg-violet-950/15 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-violet-300/80">
                Physical core terminal · plug proximity critical
              </p>
              {!approachDialogueComplete ? (
                <Button
                  variant="accent"
                  onClick={() => {
                    playInteractSound();
                    onGroknetWhisper(
                      getFinalApproachRoomWhisper("core-terminal", context),
                      true,
                    );
                    onOpenApproachPrompt();
                  }}
                  disabled={controlsDisabled || uiBlocked}
                  className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
                >
                  Speak at the Terminal
                </Button>
              ) : (
                <Button
                  variant="accent"
                  onClick={() => {
                    playInteractSound();
                    onEnterPlugChamber();
                    showFeedback("Plug Chamber — final confrontation");
                  }}
                  disabled={controlsDisabled || uiBlocked}
                  className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_32px_rgba(139,92,246,0.2)]"
                >
                  Open the Hatch · Plug Chamber
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {approachPromptOpen ? (
        <div className="confrontation-prompt-in fixed inset-0 z-[48] flex items-end justify-center bg-background/88 p-4 backdrop-blur-md sm:items-center">
          <div className="my-auto w-full max-w-lg rounded-sm border border-violet-900/35 bg-zinc-950/95 p-5 shadow-2xl shadow-black/80 sm:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-violet-400/80">
              Final Approach · Core Terminal
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.08em] text-zinc-100">
              {terminalDialogue.prompt}
            </h3>
            <div className="mt-4 rounded-sm border border-violet-900/25 bg-violet-950/15 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-violet-400/80">
                Groknet
              </p>
              <p className="mt-2 text-sm italic leading-relaxed text-zinc-300">
                {terminalDialogue.groknetPreamble}
              </p>
            </div>
            <Button
              variant="accent"
              onClick={() => {
                playInteractSound();
                onApproachDialogueComplete(terminalDialogue.groknetResponse);
              }}
              className="mt-5 h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
            >
              Open the Hatch
            </Button>
          </div>
        </div>
      ) : null}

      <FeedbackToast message={feedback} />
    </div>
  );
}