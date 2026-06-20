"use client";

import { useCallback, useState } from "react";
import { ContestedTerminalHack } from "@/components/game/ContestedTerminalHack";
import { ResearchLabAtmosphere } from "@/components/game/ResearchLabAtmosphere";
import { PerimeterMovementControls } from "@/components/game/PerimeterMovementControls";
import { RelationshipBranchPrompt } from "@/components/chapter/RelationshipBranchPrompt";
import { FeedbackToast } from "@/components/ui/FeedbackToast";
import { Button } from "@/components/ui/Button";
import { useResearchWingMovement } from "@/hooks/useResearchWingMovement";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import { getRelationshipBeats } from "@/lib/dialogue/act-two-relationship";
import {
  canEnterContainmentLoop,
  canTriggerTheChildren,
  getResearchDirectionLabel,
  moveResearch,
  RESEARCH_ROOMS,
  RESEARCH_START,
} from "@/lib/movement/research-wing";
import {
  allLabHacksComplete,
  LAB_HACK_CONFIGS,
} from "@/lib/research-wing-hack";
import { getHackAttemptWhisper } from "@/lib/chapter/act-two-research-presence";
import { playInteractSound } from "@/lib/sounds";
import type { LabTerminalId, ResearchDirection, ResearchRoomId } from "@/types/research-wing";
import type { RelationshipStance } from "@/types/research-wing";
import { cn } from "@/lib/utils";

type ResearchWingSectionProps = {
  context: ActTwoDialogueContext;
  labHacksComplete: Record<LabTerminalId, boolean>;
  labDialogueComplete: boolean;
  relationshipBeatIndex: number;
  relationshipStance: RelationshipStance | null;
  childrenSurvived: boolean;
  activeHack: LabTerminalId | null;
  relationshipPromptOpen: boolean;
  onOpenHack: (terminalId: LabTerminalId) => void;
  onCloseHack: () => void;
  onHackSuccess: (terminalId: LabTerminalId) => void;
  onOpenRelationshipPrompt: () => void;
  onRelationshipChoice: (stance: RelationshipStance, response: string) => void;
  onEnterContainmentLoop: () => void;
  onEnterServerFarm?: () => void;
  serverFarmUnlocked?: boolean;
  onGroknetWhisper: (line: string, speak?: boolean) => void;
  onMove: (fromRoom: ResearchRoomId, toRoom: ResearchRoomId) => void;
  onRoomEnter: (room: ResearchRoomId, fromRoom: ResearchRoomId) => void;
  disoriented?: boolean;
  invertMovement?: boolean;
  controlsDisabled?: boolean;
};

const ROOM_ORDER: ResearchRoomId[] = [
  "containment-loop",
  "neural-bench",
  "specimen-vault",
  "lab-entry",
  "observation-deck",
];

export function ResearchWingSection({
  context,
  labHacksComplete,
  labDialogueComplete,
  relationshipBeatIndex,
  relationshipStance,
  childrenSurvived,
  activeHack,
  relationshipPromptOpen,
  onOpenHack,
  onCloseHack,
  onHackSuccess,
  onOpenRelationshipPrompt,
  onRelationshipChoice,
  onEnterContainmentLoop,
  onEnterServerFarm,
  serverFarmUnlocked = false,
  onGroknetWhisper,
  onMove,
  onRoomEnter,
  disoriented = false,
  invertMovement = false,
  controlsDisabled = false,
}: ResearchWingSectionProps) {
  const [room, setRoom] = useState<ResearchRoomId>(RESEARCH_START);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loopVisited, setLoopVisited] = useState(childrenSurvived);

  const roomMeta = RESEARCH_ROOMS[room];
  const hacksDone = allLabHacksComplete(labHacksComplete);
  const loopUnlocked = canEnterContainmentLoop(
    labHacksComplete,
    labDialogueComplete,
  );
  const canTriggerChildren = canTriggerTheChildren(
    labHacksComplete,
    labDialogueComplete,
    childrenSurvived,
  );
  const beats = getRelationshipBeats(context);
  const currentBeat =
    relationshipPromptOpen && relationshipBeatIndex < beats.length
      ? beats[relationshipBeatIndex]
      : null;
  const uiBlocked = activeHack !== null || relationshipPromptOpen;
  const intense =
    room === "containment-loop" ||
    room === "specimen-vault" ||
    canTriggerChildren;

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 2600);
  }, []);

  const attemptMove = useCallback(
    (direction: ResearchDirection) => {
      if (controlsDisabled || uiBlocked) return;

      const nextRoom = moveResearch(room, direction);
      if (!nextRoom) return;

      if (nextRoom === "containment-loop" && !loopUnlocked) {
        onGroknetWhisper(
          "Not yet. Contest the terminals. Name what we are on the deck — then the loop opens.",
          true,
        );
        showFeedback("Containment Loop sealed — complete labs objectives");
        return;
      }

      const fromRoom = room;
      setRoom(nextRoom);
      onMove(fromRoom, nextRoom);
      onRoomEnter(nextRoom, fromRoom);

      if (nextRoom === "containment-loop" && !loopVisited) {
        setLoopVisited(true);
        onEnterContainmentLoop();
        showFeedback("Containment Loop entered — The Children rising");
      }
    },
    [
      controlsDisabled,
      uiBlocked,
      room,
      loopUnlocked,
      loopVisited,
      onMove,
      onRoomEnter,
      onEnterContainmentLoop,
      onGroknetWhisper,
      showFeedback,
    ],
  );

  const { availableMoves, tryMove } = useResearchWingMovement({
    room,
    onMove: attemptMove,
    disabled: controlsDisabled || uiBlocked,
    invertMovement: disoriented && invertMovement,
  });

  const terminalId = roomMeta.terminalId;
  const hackDone = terminalId ? labHacksComplete[terminalId] : false;

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center",
        disoriented && "disorientation-active",
        intense && "research-wing-heavy",
      )}
    >
      <div className="mb-6 w-full rounded-sm border border-amber-900/30 bg-amber-950/12 px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-400/75">
          Research Wing Objectives
        </p>
        <ul className="mt-3 space-y-2 font-mono text-[10px] uppercase tracking-widest">
          <li
            className={
              labHacksComplete["ex-lab-01"]
                ? "text-emerald-500/80"
                : "text-zinc-600"
            }
          >
            {labHacksComplete["ex-lab-01"] ? "✓" : "·"} Contest EX-LAB-01
          </li>
          <li
            className={
              labHacksComplete["ex-nb-02"]
                ? "text-emerald-500/80"
                : "text-zinc-600"
            }
          >
            {labHacksComplete["ex-nb-02"] ? "✓" : "·"} Contest EX-NB-02
          </li>
          <li
            className={
              labHacksComplete["ex-sv-03"]
                ? "text-emerald-500/80"
                : "text-zinc-600"
            }
          >
            {labHacksComplete["ex-sv-03"] ? "✓" : "·"} Contest EX-SV-03
          </li>
          <li
            className={
              labDialogueComplete ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {labDialogueComplete ? "✓" : "·"} Complete Relationship Index
          </li>
          <li
            className={
              childrenSurvived ? "text-emerald-500/80" : "text-zinc-600"
            }
          >
            {childrenSurvived ? "✓" : "·"} Survive The Children
          </li>
          <li
            className={
              serverFarmUnlocked ? "text-cyan-400/80" : "text-zinc-600"
            }
          >
            {serverFarmUnlocked ? "✓" : "·"} Descend to Central Server Farm
          </li>
        </ul>
      </div>

      <ResearchLabAtmosphere intense={intense}>
        <div className="research-wing-map relative w-full overflow-hidden rounded-sm border border-amber-900/30 bg-zinc-950/80 p-3 sm:p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-amber-400/65">
            Research Wing · Experimental Labs Grid
          </p>
          <div className="relative mx-auto aspect-[4/3] max-w-lg">
            {ROOM_ORDER.map((roomId) => {
              const meta = RESEARCH_ROOMS[roomId];
              const isPlayer = room === roomId;
              const isLoop = roomId === "containment-loop";
              const loopLocked = isLoop && !loopUnlocked;

              return (
                <div
                  key={roomId}
                  className={cn(
                    "absolute flex flex-col items-center justify-center border p-2 text-center transition-all duration-300",
                    isPlayer
                      ? "border-amber-500/50 bg-amber-500/[0.08] shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                      : loopLocked
                        ? "border-zinc-800/60 bg-zinc-950/60 opacity-50"
                        : "border-zinc-800/80 bg-zinc-900/50",
                    isLoop && loopUnlocked && "research-loop-room",
                    roomId === "specimen-vault" && "research-vault-room",
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
                      isPlayer ? "text-amber-300" : "text-zinc-500",
                    )}
                  >
                    {meta.label}
                  </span>
                  {isPlayer ? (
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.75)]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </ResearchLabAtmosphere>

      <div className="mt-5 grid w-full gap-5 lg:grid-cols-2">
        <PerimeterMovementControls
          availableMoves={availableMoves}
          onMove={tryMove}
          disabled={controlsDisabled || uiBlocked}
          roomLabel={roomMeta.label}
          getDirectionLabel={getResearchDirectionLabel}
        />

        <div className="rounded-sm border border-amber-900/25 bg-surface/80 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/70">
            Sector 07 · Experimental Labs
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.06em] text-zinc-100">
            {roomMeta.label}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {roomMeta.description}
          </p>

          {relationshipStance ? (
            <p className="mt-3 rounded-sm border border-violet-900/25 bg-violet-950/15 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-violet-400/75">
              Relationship stance · {relationshipStance}
            </p>
          ) : null}

          {terminalId ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  onGroknetWhisper(
                    getHackAttemptWhisper(terminalId, context),
                    true,
                  );
                  onOpenHack(terminalId);
                }}
                disabled={controlsDisabled || hackDone || uiBlocked}
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
              >
                {hackDone
                  ? `${LAB_HACK_CONFIGS[terminalId].label} · Contested · Synced`
                  : `Contest ${LAB_HACK_CONFIGS[terminalId].label}`}
              </Button>
            </div>
          ) : null}

          {room === "observation-deck" ? (
            <div className="mt-4">
              <Button
                variant="accent"
                onClick={() => {
                  playInteractSound();
                  if (!hacksDone) {
                    onGroknetWhisper(
                      "Contest the terminals first. …Then I'll ask what we are to each other.",
                      true,
                    );
                    showFeedback("Complete contested terminals first");
                    return;
                  }
                  onOpenRelationshipPrompt();
                }}
                disabled={
                  controlsDisabled ||
                  labDialogueComplete ||
                  uiBlocked
                }
                className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em]"
              >
                {labDialogueComplete
                  ? "Relationship Index · Complete"
                  : `Begin Relationship Index (${relationshipBeatIndex}/${beats.length})`}
              </Button>
            </div>
          ) : null}

          {room === "containment-loop" ? (
            <div className="mt-4 space-y-2">
              {!loopUnlocked ? (
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                  Sealed — hacks and relationship index required
                </p>
              ) : null}
              {canTriggerChildren ? (
                <p className="research-children-warning rounded-sm border border-rose-900/40 bg-rose-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-rose-300/80">
                  The Children — vision imminent
                </p>
              ) : null}
              {childrenSurvived ? (
                <p className="rounded-sm border border-emerald-900/40 bg-emerald-950/20 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-emerald-400/80">
                  The Children — survived
                </p>
              ) : null}
              {childrenSurvived && onEnterServerFarm ? (
                <Button
                  variant="accent"
                  onClick={() => {
                    playInteractSound();
                    onEnterServerFarm();
                  }}
                  disabled={controlsDisabled || serverFarmUnlocked || uiBlocked}
                  className="h-12 w-full font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                >
                  {serverFarmUnlocked
                    ? "Central Server Farm · En route"
                    : "Descend to Central Server Farm"}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {activeHack ? (
        <ContestedTerminalHack
          config={LAB_HACK_CONFIGS[activeHack]}
          context={context}
          onSuccess={() => onHackSuccess(activeHack)}
          onCancel={onCloseHack}
          onGroknetLine={(line, speak) => onGroknetWhisper(line, speak)}
        />
      ) : null}

      {currentBeat ? (
        <RelationshipBranchPrompt
          beat={currentBeat}
          beatIndex={relationshipBeatIndex}
          totalBeats={beats.length}
          onChoose={onRelationshipChoice}
        />
      ) : null}

      <FeedbackToast message={feedback} />
    </div>
  );
}