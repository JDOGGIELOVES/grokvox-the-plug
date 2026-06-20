"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ActThreeChapterEnding } from "@/components/chapter/ActThreeChapterEnding";
import { ActThreeFinale } from "@/components/chapter/ActThreeFinale";
import { ActThreeTransition } from "@/components/chapter/ActThreeTransition";
import { DeepCoreSection } from "@/components/chapter/DeepCoreSection";
import { PlugChamberSection } from "@/components/chapter/PlugChamberSection";
import { GameHeader } from "@/components/chapter/GameHeader";
import { GameShell } from "@/components/chapter/GameShell";
import { AreaTransition } from "@/components/chapter/AreaTransition";
import { HallucinationChoicePrompt } from "@/components/HallucinationChoicePrompt";
import { HallucinationEffect } from "@/components/HallucinationEffect";
import { useGameClock } from "@/hooks/useGameClock";
import { useHallucination } from "@/hooks/useHallucination";
import { calculateAggression } from "@/lib/aggression";
import {
  ACT_THREE_CHAPTER,
  ACT_THREE_CLOCK_STEP_MS,
  ACT_THREE_CLOCK_TICK_MS,
  ACT_THREE_IDLE_WHISPER_MS,
  ACT_THREE_PLUG_CLOCK_TICK_MS,
  ACT_THREE_PLUG_IDLE_WHISPER_MS,
  ACT_THREE_TIME_BUDGET_MS,
} from "@/lib/chapter/act-3";
import { calculateActThreeProgress } from "@/lib/chapter/act-three-progress";
import {
  getDeepCoreAmbientWhisper,
  getDeepCoreMoveWhisper,
  getDeepCoreRoomWhisper,
  getPlugChamberMoveWhisper,
  getPlugChamberRoomWhisper,
} from "@/lib/chapter/act-three-presence";
import { getReactiveGardenPreface } from "@/lib/chapter/act-three-reactive";
import { resolveReckoningEnding } from "@/lib/chapter/act-three-ending";
import { getTransitionWhisper } from "@/lib/chapter/area-transitions";
import {
  buildActThreeDialogueContext,
  type ActThreeDialogueContext,
} from "@/lib/dialogue/act-three-context";
import { getHallucinationEvent } from "@/lib/hallucinations";
import {
  getGardenVisionText,
  getGardenVoiceLine,
} from "@/lib/hallucinations/the-garden";
import { playGroknetVoiceLine } from "@/lib/hallucination";
import {
  clearActThreeCheckpoint,
  loadActThreeCheckpoint,
  loadGameSave,
  saveActThreeCheckpoint,
  saveActThreeProgress,
  type ActThreeCheckpointState,
} from "@/lib/save-progress";
import {
  playHallucinationPeakSound,
  playTheGardenSound,
  playTensionPulseSound,
} from "@/lib/sounds";
import type {
  GroknetPersonality,
  GroknetTone,
  PlayerIntent,
} from "@/types/dialogue";
import type {
  DisorientationState,
  HallucinationResponseChoice,
} from "@/types/hallucination";
import type { ChapterStage } from "@/types/chapter";
import type { ActThreeStage, PlugChoice } from "@/types/deep-core";

import type { ChapterThreeSummary, ChapterTwoSummary } from "@/types/run";
import { cn } from "@/lib/utils";

type ActThreePhase = "transition" | "playing" | "complete";

type RunState = {
  phase: ActThreePhase;
  runStart: number;
  gameKey: number;
  actThreeStage: ActThreeStage;
  moveCount: number;
  exchangeCount: number;
  finalTone: GroknetTone;
  finalMood: import("@/lib/groknet").GroknetMood;
  dominantPersonality: GroknetPersonality;
  lastPlayerIntent: PlayerIntent;
  groknetWhisper: string | null;
  disorientation: DisorientationState;
  screenShaking: boolean;
  showChapterComplete: boolean;
  ambientTick: number;
  lastActionAt: number;
  areaTransition: {
    from: ChapterStage;
    to: ChapterStage;
    groknetLine: string;
  } | null;
  fortificationHackComplete: boolean;
  majorHackOpen: boolean;
  thresholdPromptOpen: boolean;
  thresholdBeatIndex: number;
  thresholdDialogueComplete: boolean;
  gardenTriggered: boolean;
  gardenSurvived: boolean;
  gardenChoice: HallucinationResponseChoice | null;
  plugChamberEntered: boolean;
  confrontationPromptOpen: boolean;
  confrontationBeatIndex: number;
  confrontationComplete: boolean;
  reckoningChoiceOpen: boolean;
  plugChoice: PlugChoice | null;
};

const INITIAL_DISORIENTATION: DisorientationState = {
  active: false,
  invertMovement: false,
  endsAt: 0,
};

function createInitialRunState(actTwo: ChapterTwoSummary): RunState {
  return {
    phase: "transition",
    runStart: Date.now(),
    gameKey: 0,
    actThreeStage: "deep-core-access",
    moveCount: 0,
    exchangeCount: 0,
    finalTone: actTwo.finalTone,
    finalMood: actTwo.finalMood,
    dominantPersonality: actTwo.dominantPersonality,
    lastPlayerIntent: actTwo.lastPlayerIntent,
    groknetWhisper: null,
    disorientation: INITIAL_DISORIENTATION,
    screenShaking: false,
    showChapterComplete: false,
    ambientTick: 0,
    lastActionAt: Date.now(),
    areaTransition: null,
    fortificationHackComplete: false,
    majorHackOpen: false,
    thresholdPromptOpen: false,
    thresholdBeatIndex: 0,
    thresholdDialogueComplete: false,
    gardenTriggered: false,
    gardenSurvived: false,
    gardenChoice: null,
    plugChamberEntered: false,
    confrontationPromptOpen: false,
    confrontationBeatIndex: 0,
    confrontationComplete: false,
    reckoningChoiceOpen: false,
    plugChoice: null,
  };
}

function toCheckpointState(state: RunState): ActThreeCheckpointState {
  return {
    phase: state.phase,
    runStart: state.runStart,
    gameKey: state.gameKey,
    actThreeStage: state.actThreeStage,
    moveCount: state.moveCount,
    exchangeCount: state.exchangeCount,
    finalTone: state.finalTone,
    finalMood: state.finalMood,
    dominantPersonality: state.dominantPersonality,
    lastPlayerIntent: state.lastPlayerIntent,
    groknetWhisper: state.groknetWhisper,
    disorientation: state.disorientation,
    screenShaking: state.screenShaking,
    fortificationHackComplete: state.fortificationHackComplete,
    thresholdBeatIndex: state.thresholdBeatIndex,
    thresholdDialogueComplete: state.thresholdDialogueComplete,
    gardenTriggered: state.gardenTriggered,
    gardenSurvived: state.gardenSurvived,
    gardenChoice: state.gardenChoice,
    plugChamberEntered: state.plugChamberEntered,
    confrontationBeatIndex: state.confrontationBeatIndex,
    confrontationComplete: state.confrontationComplete,
    plugChoice: state.plugChoice,
  };
}

export function ActThreeReckoning() {
  const router = useRouter();
  const [actTwo, setActTwo] = useState<ChapterTwoSummary | null>(null);
  const [state, setState] = useState<RunState | null>(null);
  const [clockInitialMs, setClockInitialMs] = useState(ACT_THREE_TIME_BUDGET_MS);
  const [chapterSummary, setChapterSummary] = useState<ChapterThreeSummary | null>(
    null,
  );
  const [showFinale, setShowFinale] = useState(false);

  const whisperTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gardenDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ambientIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [areaTransition, setAreaTransition] = useState<{
    from: ChapterStage;
    to: ChapterStage;
    groknetLine: string;
  } | null>(null);

  const {
    active,
    phase,
    message,
    eventId,
    awaitingChoice,
    visionText,
    eventTitle,
    triggerHallucination,
    endHallucination,
  } = useHallucination({
    onEnd: (endedEvent) => {
      if (endedEvent === "the-garden") {
        setState((s) =>
          s
            ? {
                ...s,
                gardenSurvived: true,
                screenShaking: false,
              }
            : s,
        );
      }
    },
  });

  useEffect(() => {
    const save = loadGameSave();
    if (!save?.act2Summary) {
      router.replace("/game/act-2/conversation");
      return;
    }

    const checkpoint = loadActThreeCheckpoint();
    if (checkpoint && checkpoint.actTwoSummary) {
      setActTwo(checkpoint.actTwoSummary);
      setClockInitialMs(checkpoint.clockRemainingMs);
      setState({
        ...createInitialRunState(checkpoint.actTwoSummary),
        ...checkpoint.state,
        thresholdPromptOpen: false,
        majorHackOpen: false,
        confrontationPromptOpen: false,
        reckoningChoiceOpen: false,
        areaTransition: null,
        showChapterComplete: checkpoint.state.phase === "complete",
        ambientTick: 0,
        lastActionAt: Date.now(),
      });
      return;
    }

    setActTwo(save.act2Summary);
    setState(createInitialRunState(save.act2Summary));
  }, [router]);

  const dialogueContext = useMemo<ActThreeDialogueContext | null>(() => {
    if (!actTwo || !state) return null;
    const ctx = buildActThreeDialogueContext(actTwo);
    return {
      ...ctx,
      actThreeStage: state.actThreeStage,
      moveCount: state.moveCount,
      fortificationHackComplete: state.fortificationHackComplete,
      thresholdDialogueComplete: state.thresholdDialogueComplete,
      gardenSurvived: state.gardenSurvived,
      gardenChoice: state.gardenChoice,
      confrontationComplete: state.confrontationComplete,
      confrontationBeatIndex: state.confrontationBeatIndex,
      plugChoice: state.plugChoice,
      finalTone: state.finalTone,
      finalMood: state.finalMood,
      dominantPersonality: state.dominantPersonality,
      lastPlayerIntent: state.lastPlayerIntent,
    };
  }, [actTwo, state]);

  const clockTickMs =
    state?.actThreeStage === "plug-chamber"
      ? ACT_THREE_PLUG_CLOCK_TICK_MS
      : ACT_THREE_CLOCK_TICK_MS;

  const clock = useGameClock(
    state?.phase === "playing" && !state.showChapterComplete,
    clockInitialMs,
    clockTickMs,
    ACT_THREE_CLOCK_STEP_MS,
  );

  const aggression = useMemo(() => {
    if (!state) return { level: 0, label: "Dormant" };
    return calculateAggression({
      mood: state.finalMood,
      detections: actTwo?.actOneSummary.detections ?? 0,
      exchangeCount: state.exchangeCount,
      hallucinationActive: active,
    });
  }, [actTwo, active, state]);

  const chapterProgress = useMemo(() => {
    if (!state) return undefined;
    return calculateActThreeProgress({
      phase: state.phase,
      actThreeStage: state.actThreeStage,
      fortificationHackComplete: state.fortificationHackComplete,
      thresholdDialogueComplete: state.thresholdDialogueComplete,
      gardenSurvived: state.gardenSurvived,
      plugChamberEntered: state.plugChamberEntered,
      confrontationComplete: state.confrontationComplete,
      plugChoiceMade: state.plugChoice !== null,
      showChapterComplete: state.showChapterComplete,
    });
  }, [state]);

  const setGroknetWhisper = useCallback(
    (line: string, durationMs = 5000, speak = false) => {
      if (whisperTimeoutRef.current) clearTimeout(whisperTimeoutRef.current);
      setState((s) => (s ? { ...s, groknetWhisper: line } : s));
      if (speak) playGroknetVoiceLine(line);
      whisperTimeoutRef.current = setTimeout(() => {
        setState((s) => (s ? { ...s, groknetWhisper: null } : s));
        whisperTimeoutRef.current = null;
      }, durationMs);
    },
    [],
  );

  const handleHallucinationChoice = useCallback(
    (choice: HallucinationResponseChoice) => {
      const event = getHallucinationEvent(eventId);
      const consequence = event?.consequences[choice];
      if (!consequence) return;

      setState((s) => {
        if (!s) return s;
        return {
          ...s,
          ...(eventId === "the-garden" ? { gardenChoice: choice } : {}),
          finalMood: {
            cold: Math.min(
              3,
              Math.max(0, s.finalMood.cold + consequence.moodDelta.cold),
            ),
            melancholic: Math.min(
              3,
              Math.max(0, s.finalMood.melancholic + consequence.moodDelta.melancholic),
            ),
            analytical: Math.min(
              3,
              Math.max(0, s.finalMood.analytical + consequence.moodDelta.analytical),
            ),
          },
          disorientation: {
            active: true,
            invertMovement: consequence.invertMovement,
            endsAt: Date.now() + consequence.disorientationMs,
          },
        };
      });

      endHallucination();
      setGroknetWhisper(consequence.groknetLine, 8000, true);

      if (eventId === "the-garden") {
        window.setTimeout(() => {
          setGroknetWhisper(
            "The Garden fades. …Descent Shaft north — the Plug Chamber waits below.",
            7500,
            true,
          );
        }, 8600);
      }
    },
    [endHallucination, eventId, setGroknetWhisper],
  );

  const scheduleTheGarden = useCallback(() => {
    if (!dialogueContext || state?.gardenTriggered) return;

    setState((s) =>
      s ? { ...s, gardenTriggered: true, screenShaking: true } : s,
    );
    playTheGardenSound();
    playTensionPulseSound();

    const preface = getReactiveGardenPreface(dialogueContext);
    setGroknetWhisper(preface, 6000, true);

    if (gardenDelayRef.current) clearTimeout(gardenDelayRef.current);
    gardenDelayRef.current = setTimeout(() => {
      playHallucinationPeakSound();
      triggerHallucination({
        eventId: "the-garden",
        visionText: getGardenVisionText(dialogueContext),
        voiceLine: getGardenVoiceLine(dialogueContext),
      });
      gardenDelayRef.current = null;
    }, 3200);
  }, [dialogueContext, setGroknetWhisper, state?.gardenTriggered, triggerHallucination]);

  const completeAreaTransition = useCallback(() => {
    setAreaTransition(null);
    setState((s) =>
      s
        ? {
            ...s,
            areaTransition: null,
            lastActionAt: Date.now(),
          }
        : s,
    );
  }, []);

  const handleEnterPlugChamber = useCallback(() => {
    if (!actTwo || !dialogueContext) return;

    const groknetLine = getTransitionWhisper(
      "deep-core-access",
      "plug-chamber",
      {
        detections: actTwo.actOneSummary.detections,
        finalTone: actTwo.finalTone,
        finalMood: actTwo.finalMood,
        lastPlayerIntent: actTwo.lastPlayerIntent,
        hubHackComplete: actTwo.actOneSummary.perimeterTerminalComplete,
        burningCitiesSurvived: actTwo.actOneSummary.burningCitiesSurvived,
        burningCitiesChoice: actTwo.actOneSummary.burningCitiesChoice,
        perimeterDialogueComplete: true,
        lastConversationChoice: actTwo.lastConversationChoice,
        childrenChoice: actTwo.childrenChoice,
        relationshipStance: actTwo.relationshipStance,
        accumulationChoice: actTwo.accumulationChoice,
        gardenChoice: state?.gardenChoice ?? null,
        personalityEvolutionPath: actTwo.personalityEvolutionPath,
      },
    );

    setAreaTransition({
      from: "deep-core-access",
      to: "plug-chamber",
      groknetLine,
    });
    setState((s) =>
      s
        ? {
            ...s,
            actThreeStage: "plug-chamber",
            plugChamberEntered: true,
            areaTransition: {
              from: "deep-core-access",
              to: "plug-chamber",
              groknetLine,
            },
            lastActionAt: Date.now(),
          }
        : s,
    );
  }, [actTwo, dialogueContext, state?.gardenChoice]);

  const buildChapterSummary = useCallback(
    (plugChoice: PlugChoice): ChapterThreeSummary | null => {
      if (!actTwo || !state) return null;

      const base: ChapterThreeSummary = {
        actId: "act-3",
        chapterId: "reckoning",
        completedAt: Date.now(),
        elapsedMs: Date.now() - state.runStart,
        timeRemainingMs: clock.remainingMs,
        aggressionLevel: aggression.level,
        aggressionLabel: aggression.label,
        exchangeCount: state.exchangeCount,
        presenceMode: dialogueContext?.presenceMode ?? "aggressive",
        fortificationHackComplete: state.fortificationHackComplete,
        thresholdDialogueComplete: state.thresholdDialogueComplete,
        gardenSurvived: state.gardenSurvived,
        gardenChoice: state.gardenChoice,
        confrontationComplete: state.confrontationComplete,
        plugChoice,
        endingId: "the-reckoning",
        finalTone: state.finalTone,
        finalMood: state.finalMood,
        dominantPersonality: state.dominantPersonality,
        lastPlayerIntent: state.lastPlayerIntent,
        relationshipStance: actTwo.relationshipStance,
        personalityEvolutionPath: actTwo.personalityEvolutionPath,
        actOneSummary: actTwo.actOneSummary,
        actTwoSummary: actTwo,
      };

      return {
        ...base,
        endingId: resolveReckoningEnding(
          plugChoice,
          state.gardenChoice,
          base,
        ),
      };
    },
    [actTwo, aggression, clock.remainingMs, dialogueContext, state],
  );

  const handleReckoningChoice = useCallback(
    (choice: PlugChoice, response: string) => {
      setGroknetWhisper(response, 8000, true);
      setState((s) =>
        s
          ? {
              ...s,
              plugChoice: choice,
              reckoningChoiceOpen: false,
              lastActionAt: Date.now(),
            }
          : s,
      );

      window.setTimeout(() => {
        const finalSummary = buildChapterSummary(choice);
        if (finalSummary) {
          setChapterSummary(finalSummary);
          saveActThreeProgress(finalSummary);
          setShowFinale(true);
          setState((s) =>
            s
              ? {
                  ...s,
                  showChapterComplete: true,
                  phase: "complete",
                }
              : s,
          );
        }
      }, 1400);
    },
    [buildChapterSummary, setGroknetWhisper],
  );

  useEffect(() => {
    if (!actTwo || !state || state.phase !== "playing") return;

    saveActThreeCheckpoint(actTwo, toCheckpointState(state), clock.remainingMs);
  }, [actTwo, clock.remainingMs, state]);

  useEffect(() => {
    if (!dialogueContext || !state || state.phase !== "playing") return;

    const idleMs =
      state.actThreeStage === "plug-chamber"
        ? ACT_THREE_PLUG_IDLE_WHISPER_MS
        : ACT_THREE_IDLE_WHISPER_MS;

    idleIntervalRef.current = setInterval(() => {
      if (Date.now() - state.lastActionAt < idleMs) return;
      const line = getDeepCoreAmbientWhisper(dialogueContext);
      setGroknetWhisper(line, 4500, true);
      setState((s) => (s ? { ...s, lastActionAt: Date.now() } : s));
    }, idleMs);

    return () => {
      if (idleIntervalRef.current) clearInterval(idleIntervalRef.current);
    };
  }, [dialogueContext, setGroknetWhisper, state]);

  useEffect(() => {
    return () => {
      if (whisperTimeoutRef.current) clearTimeout(whisperTimeoutRef.current);
      if (gardenDelayRef.current) clearTimeout(gardenDelayRef.current);
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      if (ambientIntervalRef.current) clearInterval(ambientIntervalRef.current);
      if (idleIntervalRef.current) clearInterval(idleIntervalRef.current);
    };
  }, []);

  const restartActThree = useCallback(() => {
    if (!actTwo) return;
    clearActThreeCheckpoint();
    setChapterSummary(null);
    setShowFinale(false);
    setClockInitialMs(ACT_THREE_TIME_BUDGET_MS);
    setState(createInitialRunState(actTwo));
  }, [actTwo]);

  if (!actTwo || !state) {
    return (
      <GameShell>
        <div className="flex flex-1 items-center justify-center">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Loading Act III…
          </p>
        </div>
      </GameShell>
    );
  }

  const playing = state.phase === "playing";
  const controlsLocked = active && phase === "peak" && !awaitingChoice;

  return (
    <GameShell>
      {state.phase === "transition" ? (
        <ActThreeTransition
          actTwo={actTwo}
          onComplete={() =>
            setState((s) =>
              s ? { ...s, phase: "playing", lastActionAt: Date.now() } : s,
            )
          }
        />
      ) : null}

      <div
        className={cn(
          "animate-page-in flex flex-1 flex-col",
          active && "hallucination-active",
          active && "hallucination-loss-of-control",
          active && phase === "peak" && "hallucination-peak",
          state.disorientation.active && "disorientation-active",
          state.screenShaking && "screen-shake",
        )}
      >
        <GameHeader
          chapter={
            state.actThreeStage === "plug-chamber"
              ? {
                  ...ACT_THREE_CHAPTER,
                  subtitle: "Chapter 3 · Plug Chamber",
                  sector: "Physical Interface",
                }
              : ACT_THREE_CHAPTER
          }
          timeRemaining={clock.formatted}
          timeCritical={clock.isCritical}
          aggression={aggression}
          groknetWhisper={state.groknetWhisper}
          hallucinationActive={active}
          chapterProgress={chapterProgress}
        />

        <main
          className={cn(
            "flex flex-1 flex-col items-center justify-center pb-8 sm:pb-10 transition-opacity duration-500",
            state.phase === "transition" && "opacity-0 pointer-events-none",
            playing && "stage-content-in",
            active && "hallucination-content-distort",
            active && phase === "peak" && !awaitingChoice && "hallucination-controls-off",
            state.disorientation.active && "disorientation-blur",
          )}
        >
          {playing &&
          state.actThreeStage === "deep-core-access" &&
          dialogueContext ? (
            <DeepCoreSection
              context={dialogueContext}
              fortificationHackComplete={state.fortificationHackComplete}
              thresholdDialogueComplete={state.thresholdDialogueComplete}
              thresholdPromptOpen={state.thresholdPromptOpen}
              thresholdBeatIndex={state.thresholdBeatIndex}
              gardenSurvived={state.gardenSurvived}
              majorHackOpen={state.majorHackOpen}
              onOpenThresholdPrompt={() =>
                setState((s) =>
                  s
                    ? {
                        ...s,
                        thresholdPromptOpen: true,
                        lastActionAt: Date.now(),
                      }
                    : s,
                )
              }
              onThresholdChoice={(response) => {
                setGroknetWhisper(response, 6000, true);
                setState((s) =>
                  s
                    ? {
                        ...s,
                        thresholdPromptOpen: false,
                        thresholdDialogueComplete: true,
                        thresholdBeatIndex: 1,
                        lastActionAt: Date.now(),
                      }
                    : s,
                );
              }}
              onOpenMajorHack={() =>
                setState((s) =>
                  s
                    ? { ...s, majorHackOpen: true, lastActionAt: Date.now() }
                    : s,
                )
              }
              onCloseMajorHack={() =>
                setState((s) =>
                  s
                    ? { ...s, majorHackOpen: false, lastActionAt: Date.now() }
                    : s,
                )
              }
              onMajorHackSuccess={() => {
                setState((s) =>
                  s
                    ? {
                        ...s,
                        majorHackOpen: false,
                        fortificationHackComplete: true,
                        lastActionAt: Date.now(),
                      }
                    : s,
                );
                setGroknetWhisper(
                  "DC-FORT-01 falls. Garden Threshold west. …The Neural Garden has what you planted.",
                  7000,
                  true,
                );
              }}
              onEnterNeuralGarden={scheduleTheGarden}
              onEnterDescentShaft={handleEnterPlugChamber}
              onGroknetWhisper={(line, speak) =>
                setGroknetWhisper(line, 5500, speak)
              }
              onMove={(_from, _to) =>
                setState((s) =>
                  s
                    ? {
                        ...s,
                        moveCount: s.moveCount + 1,
                        lastActionAt: Date.now(),
                      }
                    : s,
                )
              }
              onRoomEnter={(room, _from) => {
                if (!dialogueContext) return;
                setGroknetWhisper(
                  getDeepCoreRoomWhisper(room, dialogueContext),
                  5000,
                );
              }}
              disoriented={state.disorientation.active}
              invertMovement={state.disorientation.invertMovement}
              controlsDisabled={controlsLocked}
            />
          ) : null}

          {playing &&
          state.actThreeStage === "plug-chamber" &&
          dialogueContext ? (
            <PlugChamberSection
              context={dialogueContext}
              confrontationPromptOpen={state.confrontationPromptOpen}
              confrontationBeatIndex={state.confrontationBeatIndex}
              confrontationComplete={state.confrontationComplete}
              reckoningChoiceOpen={state.reckoningChoiceOpen}
              plugChoiceMade={state.plugChoice !== null}
              onOpenConfrontationPrompt={() =>
                setState((s) =>
                  s
                    ? {
                        ...s,
                        confrontationPromptOpen: true,
                        lastActionAt: Date.now(),
                      }
                    : s,
                )
              }
              onConfrontationChoice={(response) => {
                setGroknetWhisper(response, 6000, true);
                setState((s) => {
                  if (!s) return s;
                  const nextBeat = s.confrontationBeatIndex + 1;
                  const beats = 2;
                  if (nextBeat >= beats) {
                    return {
                      ...s,
                      confrontationPromptOpen: false,
                      confrontationComplete: true,
                      confrontationBeatIndex: nextBeat,
                      lastActionAt: Date.now(),
                    };
                  }
                  return {
                    ...s,
                    confrontationBeatIndex: nextBeat,
                    lastActionAt: Date.now(),
                  };
                });
              }}
              onOpenReckoningChoice={() =>
                setState((s) =>
                  s
                    ? {
                        ...s,
                        reckoningChoiceOpen: true,
                        lastActionAt: Date.now(),
                      }
                    : s,
                )
              }
              onReckoningChoice={handleReckoningChoice}
              onGroknetWhisper={(line, speak) =>
                setGroknetWhisper(line, 5500, speak)
              }
              onMove={() =>
                setState((s) =>
                  s
                    ? {
                        ...s,
                        moveCount: s.moveCount + 1,
                        lastActionAt: Date.now(),
                      }
                    : s,
                )
              }
              onRoomEnter={(room) => {
                if (!dialogueContext) return;
                const line =
                  room === "the-plug"
                    ? getPlugChamberMoveWhisper(dialogueContext)
                    : getPlugChamberRoomWhisper(room, dialogueContext);
                setGroknetWhisper(line, 5000, room === "the-plug");
              }}
              disoriented={state.disorientation.active}
              invertMovement={state.disorientation.invertMovement}
              controlsDisabled={controlsLocked}
            />
          ) : null}
        </main>
      </div>

      <HallucinationEffect
        active={active}
        message={message}
        phase={phase}
        eventId={eventId}
        visionText={visionText}
        eventTitle={eventTitle}
        awaitingChoice={awaitingChoice}
      />

      {awaitingChoice ? (
        <HallucinationChoicePrompt
          eventId={eventId}
          onChoose={handleHallucinationChoice}
        />
      ) : null}

      {areaTransition ? (
        <AreaTransition
          from={areaTransition.from}
          to={areaTransition.to}
          groknetLine={areaTransition.groknetLine}
          onComplete={completeAreaTransition}
        />
      ) : null}

      {showFinale && chapterSummary ? (
        <ActThreeFinale
          summary={chapterSummary}
          onComplete={() => setShowFinale(false)}
        />
      ) : null}

      {state.showChapterComplete && chapterSummary && !showFinale ? (
        <ActThreeChapterEnding
          summary={chapterSummary}
          onRestart={restartActThree}
        />
      ) : null}
    </GameShell>
  );
}