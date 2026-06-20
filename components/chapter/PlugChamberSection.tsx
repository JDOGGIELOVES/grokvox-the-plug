"use client";

import { useCallback, useState } from "react";
import { PlugChamberAtmosphere } from "@/components/game/PlugChamberAtmosphere";
import { GroknetPresenceBanner } from "@/components/chapter/GroknetPresenceBanner";
import { PlugTerminalPanel } from "@/components/chapter/PlugTerminalPanel";
import { PerimeterMovementControls } from "@/components/game/PerimeterMovementControls";
import { ConfrontationPrompt } from "@/components/chapter/ConfrontationPrompt";
import { PlugReckoningPrompt } from "@/components/chapter/PlugReckoningPrompt";
import { FeedbackToast } from "@/components/ui/FeedbackToast";
import { Button } from "@/components/ui/Button";
import { usePlugChamberMovement } from "@/hooks/useDeepCoreMovement";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import {
  getPlugConfrontationBeats,
  getPlugReckoningOptions,
} from "@/lib/dialogue/act-three-confrontation";
import {
  canAccessThePlug,
  getDeepCoreDirectionLabel,
  movePlugChamber,
  PLUG_CHAMBER_ROOMS,
  PLUG_CHAMBER_START,
} from "@/lib/movement/deep-core";
import { playInteractSound } from "@/lib/sounds";
import type { DeepCoreDirection, PlugChamberRoomId, PlugChoice } from "@/types/deep-core";
import { cn } from "@/lib/utils";

type PlugChamberSectionProps = {
  context: ActThreeDialogueContext;
  confrontationPromptOpen: boolean;
  confrontationBeatIndex: number;
  confrontationComplete: boolean;
  reckoningChoiceOpen: boolean;
  plugChoiceMade: boolean;
  onOpenConfrontationPrompt: () => void;
  onConfrontationChoice: (response: string) => void;
  onOpenReckoningChoice: () => void;
  onReckoningChoice: (choice: PlugChoice, response: string) => void;
  onGroknetWhisper: (line: string, speak?: boolean) => void;
  onMove: (fromRoom: PlugChamberRoomId, toRoom: PlugChamberRoomId) => void;
  onRoomEnter: (room: PlugChamberRoomId, fromRoom: PlugChamberRoomId) => void;
  disoriented?: boolean;
  invertMovement?: boolean;
  controlsDisabled?: boolean;
};

export function PlugChamberSection({
  context,
  confrontationPromptOpen,
  confrontationBeatIndex,
  confrontationComplete,
  reckoningChoiceOpen,
  plugChoiceMade,
  onOpenConfrontationPrompt,
  onConfrontationChoice,
  onOpenReckoningChoice,
  onReckoningChoice,
  onGroknetWhisper,
  onMove,
  onRoomEnter,
  disoriented = false,
  invertMovement = false,
  controlsDisabled = false,
}: PlugChamberSectionProps) {
  const [room, setRoom] = useState<PlugChamberRoomId>(PLUG_CHAMBER_START);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [plugTerminalSeen, setPlugTerminalSeen] = useState(false);
  const [plugTerminalOpen, setPlugTerminalOpen] = useState(false);

  const roomMeta = PLUG_CHAMBER_ROOMS[room];
  const plugUnlocked = canAccessThePlug(confrontationComplete);
  const confrontationBeats = getPlugConfrontationBeats(context);
  const currentBeat =
    confrontationPromptOpen &&
    confrontationBeatIndex < confrontationBeats.length
      ? confrontationBeats[confrontationBeatIndex]
      : null;
  const reckoningOptions = getPlugReckoningOptions(context);
  const uiBlocked = confrontationPromptOpen || reckoningChoiceOpen;
  const atPlug = room === "the-plug";

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 2800);
  }, []);

  const attemptMove = useCallback(
    (direction: DeepCoreDirection) => {
      if (controlsDisabled || uiBlocked) return;

      const nextRoom = movePlugChamber(room, direction);
      if (!nextRoom) return;

      if (nextRoom === "the-plug" && !plugUnlocked) {
        onGroknetWhisper(
          "The plug is sealed. …Finish the confrontation in the ante-chamber first.",
          true,
        );
        showFeedback("Complete final confrontation dialogue");
        return;
      }

      const fromRoom = room;
      setRoom(nextRoom);
      onMove(fromRoom, nextRoom);
      onRoomEnter(nextRoom, fromRoom);

      if (
        nextRoom === "the-plug" &&
        confrontationComplete &&
        !plugChoiceMade &&
        !plugTerminalSeen
      ) {
        setPlugTerminalSeen(true);
        setPlugTerminalOpen(true);
      }
    },
    [
      controlsDisabled,
      uiBlocked,
      room,
      plugUnlocked,
      onMove,
      onRoomEnter,
      onGroknetWhisper,
      showFeedback,
      confrontationComplete,
      plugChoiceMade,
      plugTerminalSeen,
    ],
  );

  const { availableMoves, tryMove } = usePlugChamberMovement({
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
        atPlug && "plug-chamber-heavy",
      )}
    >
      <GroknetPresenceBanner
        context={context}
        stage="plug-chamber"
        className="mb-4"
      />

      <div className="mb-6 w-full rounded-sm border border-amber-900/30 bg-amber-950/12 px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-400/75">
          Plug Chamber · Final Confrontation
        </p>
        <ul className="mt-3 space-y-2 font-mono text-[10px] uppercase tracking-widest">
          <li
            className={
              confrontationComplete ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {confrontationComplete ? "✓" : "·"} Final confrontation dialogue
          </li>
          <li className={plugChoiceMade ? "text-emerald-500/80" : "text-zinc-600"}>
            {plugChoiceMade ? "✓" : "·"} Resolve the Reckoning at the plug
          </li>
        </ul>
      </div>

      <PlugChamberAtmosphere atPlug={atPlug}>
        <div className="plug-chamber-map relative w-full overflow-hidden rounded-sm border border-amber-900/30 bg-zinc-950/80 p-3 sm:p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-amber-400/65">
            Plug Chamber · Physical Interface
          </p>
          <div className="relative mx-auto aspect-[4/3] max-w-xl">
            {(["plug-ante", "the-plug"] as PlugChamberRoomId[]).map((roomId) => {
              const meta = PLUG_CHAMBER_ROOMS[roomId];
              const isPlayer = room === roomId;
              const plugLocked = roomId === "the-plug" && !plugUnlocked;
              const width = (meta.gridWidth ?? 1) * 25;
              const height = (meta.gridHeight ?? 1) * 30;

              return (
                <div
                  key={roomId}
                  className={cn(
                    "absolute flex flex-col items-center justify-center border p-2 text-center transition-all duration-300",
                    isPlayer
                      ? "border-amber-500/50 bg-amber-500/[0.08] shadow-[0_0_28px_rgba(251,191,36,0.2)]"
                      : plugLocked
                        ? "border-zinc-800/60 bg-zinc-950/60 opacity-45"
                        : "border-zinc-800/80 bg-zinc-900/50",
                    roomId === "the-plug" && plugUnlocked && "plug-interface-room",
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
                      isPlayer ? "text-amber-300" : "text-zinc-500",
                    )}
                  >
                    {meta.label}
                  </span>
                  {isPlayer ? (
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.85)]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </PlugChamberAtmosphere>

      <div className="mt-5 grid w-full gap-5 lg:grid-cols-2">
        <PerimeterMovementControls
          availableMoves={availableMoves}
          onMove={tryMove}
          disabled={controlsDisabled || uiBlocked}
          roomLabel={roomMeta.label}
          getDirectionLabel={getDeepCoreDirectionLabel}
        />

        <div className="rounded-sm border border-amber-900/25 bg-surface/80 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/70">
            Sector 07 · Plug Chamber
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.06em] text-zinc-100">
            {roomMeta.label}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {roomMeta.description}
          </p>

          {room === "plug-ante" ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  onOpenConfrontationPrompt();
                }}
                disabled={
                  controlsDisabled ||
                  confrontationComplete ||
                  uiBlocked
                }
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
              >
                {confrontationComplete
                  ? "Confrontation · Complete"
                  : `Begin Confrontation (${confrontationBeatIndex}/${confrontationBeats.length})`}
              </Button>
            </div>
          ) : null}

          {room === "the-plug" && plugUnlocked && !plugChoiceMade ? (
            <div className="mt-4 space-y-2">
              <p className="plug-interface-hum rounded-sm border border-amber-900/35 bg-amber-950/15 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-amber-300/80">
                Physical plug · interface live · Groknet fully present
              </p>
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  if (!plugTerminalSeen) {
                    setPlugTerminalSeen(true);
                    setPlugTerminalOpen(true);
                  } else {
                    onOpenReckoningChoice();
                  }
                }}
                disabled={controlsDisabled || uiBlocked}
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_32px_rgba(251,191,36,0.2)]"
              >
                {plugTerminalSeen
                  ? "Face the Reckoning"
                  : "Interface with the Plug"}
              </Button>
            </div>
          ) : null}

          {plugChoiceMade ? (
            <p className="mt-4 rounded-sm border border-emerald-900/40 bg-emerald-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-emerald-400/80">
              Reckoning resolved — campaign ending sealed
            </p>
          ) : null}
        </div>
      </div>

      {currentBeat ? (
        <ConfrontationPrompt
          beat={currentBeat}
          beatIndex={confrontationBeatIndex}
          totalBeats={confrontationBeats.length}
          accent="amber"
          onChoose={(_id, response) => onConfrontationChoice(response)}
        />
      ) : null}

      {plugTerminalOpen ? (
        <PlugTerminalPanel
          context={context}
          onProceed={() => {
            setPlugTerminalOpen(false);
            onOpenReckoningChoice();
          }}
        />
      ) : null}

      {reckoningChoiceOpen ? (
        <PlugReckoningPrompt
          options={reckoningOptions}
          onChoose={onReckoningChoice}
        />
      ) : null}

      <FeedbackToast message={feedback} />
    </div>
  );
}