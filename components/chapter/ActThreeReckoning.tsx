"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ActThreeChapterEnding } from "@/components/chapter/ActThreeChapterEnding";
import { ActThreeFinale } from "@/components/chapter/ActThreeFinale";
import { EndingCreditsOutro } from "@/components/chapter/EndingCreditsOutro";
import { ActThreeTransition } from "@/components/chapter/ActThreeTransition";
import { DeepCoreSection } from "@/components/chapter/DeepCoreSection";
import { FinalApproachSection } from "@/components/chapter/FinalApproachSection";
import { PlugChamberSection } from "@/components/chapter/PlugChamberSection";
import { GameHeader } from "@/components/chapter/GameHeader";
import { GameShell } from "@/components/chapter/GameShell";
import { AreaTransition } from "@/components/chapter/AreaTransition";
import { GardenHallucinationPrompt } from "@/components/GardenHallucinationPrompt";
import { HallucinationChoicePrompt } from "@/components/HallucinationChoicePrompt";
import { HallucinationEffect } from "@/components/HallucinationEffect";
import { useGameClock } from "@/hooks/useGameClock";
import { useHallucination } from "@/hooks/useHallucination";
import { calculateAggression } from "@/lib/aggression";
import { resolveHubHackComplete } from "@/lib/chapter/act-1";
import { getConfrontationIntentReaction } from "@/lib/chapter/act-three-intent";
import {
  ACT_THREE_AMBIENT_WHISPER_MS,
  ACT_THREE_CHAPTER,
  ACT_THREE_CLOCK_STEP_MS,
  ACT_THREE_CLOCK_TICK_MS,
  ACT_THREE_CORRUPTION_TICK_MS,
  ACT_THREE_IDLE_WHISPER_MS,
  ACT_THREE_PLUG_AMBIENT_WHISPER_MS,
  ACT_THREE_PLUG_CLOCK_TICK_MS,
  ACT_THREE_PLUG_IDLE_WHISPER_MS,
  ACT_THREE_TIME_BUDGET_MS,
} from "@/lib/chapter/act-3";
import { getCorruptedSystemLine } from "@/lib/chapter/act-three-corruption";
import {
  getHistoryAmbientWhisper,
  getHistoryMoveWhisper,
  getHistoryPersonalWhisper,
  getPlugHistoryWhisper,
} from "@/lib/chapter/act-three-history-presence";
import { getPersonalityVariantWhisper } from "@/lib/chapter/act-three-personality-presence";
import { calculateActThreeProgress } from "@/lib/chapter/act-three-progress";
import {
  getDeepCoreAmbientWhisper,
  getDeepCoreMoveWhisper,
  getDeepCoreRoomWhisper,
  getPlugChamberMoveWhisper,
  getPlugChamberRoomWhisper,
} from "@/lib/chapter/act-three-presence";
import { getReactiveGardenPreface } from "@/lib/chapter/act-three-reactive";
import { getFinalApproachRoomWhisper } from "@/lib/dialogue/act-three-final-approach";
import { PLUG_CONFRONTATION_START } from "@/lib/dialogue/act-three-confrontation-tree";
import { resolveReckoningEnding } from "@/lib/chapter/act-three-ending";
import { getTransitionWhisper } from "@/lib/chapter/area-transitions";
import {
  buildActThreeDialogueContext,
  getActThreeOpeningPreamble,
  type ActThreeDialogueContext,
} from "@/lib/dialogue/act-three-context";
import { getHallucinationEvent } from "@/lib/hallucinations";
import { getPersonalizedChoiceConsequence } from "@/lib/hallucinations/hallucination-consequences";

import {
  getGardenExitWhisper,
  getPersonalizedGardenVision,
  getPersonalizedGardenVoice,
} from "@/lib/hallucinations/the-garden-personalized";
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
import { DEEP_CORE_START } from "@/lib/movement/deep-core";
import type {
  ActThreeStage,
  ConfrontationChoiceId,
  DeepCoreRoomId,
  PlugChoice,
} from "@/types/deep-core";

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
  deepCoreRoom: DeepCoreRoomId;
  plugChamberEntered: boolean;
  finalApproachEntered: boolean;
  approachDialogueComplete: boolean;
  approachPromptOpen: boolean;
  confrontationPromptOpen: boolean;
  confrontationBeatId: string;
  confrontationBeatIndex: number;
  confrontationChoices: ConfrontationChoiceId[];
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
    deepCoreRoom: DEEP_CORE_START,
    plugChamberEntered: false,
    finalApproachEntered: false,
    approachDialogueComplete: false,
    approachPromptOpen: false,
    confrontationPromptOpen: false,
    confrontationBeatId: PLUG_CONFRONTATION_START,
    confrontationBeatIndex: 0,
    confrontationChoices: [],
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
    deepCoreRoom: state.deepCoreRoom,
    plugChamberEntered: state.plugChamberEntered,
    finalApproachEntered: state.finalApproachEntered,
    approachDialogueComplete: state.approachDialogueComplete,
    confrontationBeatIndex: state.confrontationBeatIndex,
    confrontationBeatId: state.confrontationBeatId,
    confrontationChoices: state.confrontationChoices,
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
  const [showEndingCredits, setShowEndingCredits] = useState(false);
  const [corruptionLine, setCorruptionLine] = useState<string | null>(null);
  const [resumeWhisper, setResumeWhisper] = useState<string | null>(null);
  const [intentReaction, setIntentReaction] = useState<{
    intent: PlayerIntent;
    line: string;
  } | null>(null);

  const whisperTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intentReactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const stateRef = useRef(state);
  stateRef.current = state;
  const dialogueContextRef = useRef<ActThreeDialogueContext | null>(null);
  const gardenExitHandledRef = useRef(false);
  const groknetWhisperRef = useRef<
    (line: string, persistMs?: number, speak?: boolean) => void
  >(() => {});
  const gardenDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gardenApproachTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const schedulePostGardenTransitionRef = useRef<() => void>(() => {});
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
    profile,
    triggerHallucination,
    resolveChoice,
    endHallucination,
  } = useHallucination({
    onEnd: (endedEvent) => {
      if (endedEvent !== "the-garden" || gardenExitHandledRef.current) return;

      const ctx = dialogueContextRef.current;
      gardenExitHandledRef.current = true;
      setState((s) =>
        s
          ? {
              ...s,
              gardenSurvived: true,
              deepCoreRoom: "neural-garden",
              screenShaking: false,
              disorientation: {
                active: true,
                invertMovement: false,
                endsAt: Date.now() + 2_500,
              },
              lastActionAt: Date.now(),
            }
          : s,
      );
      if (ctx) {
        groknetWhisperRef.current(getGardenExitWhisper(ctx, null), 9000, true);
      }
      schedulePostGardenTransitionRef.current();
    },
  });

  useEffect(() => {
    const save = loadGameSave();
    if (!save?.act2Summary) {
      router.replace("/game/act-2/conversation");
      return;
    }

    const checkpoint = loadActThreeCheckpoint();
    if (
      checkpoint?.actTwoSummary &&
      checkpoint.actTwoSummary.completedAt === save.act2Summary.completedAt
    ) {
      setActTwo(checkpoint.actTwoSummary);
      setClockInitialMs(checkpoint.clockRemainingMs);
      const restoredDisorientation =
        checkpoint.state.disorientation.active &&
        checkpoint.state.disorientation.endsAt <= Date.now()
          ? INITIAL_DISORIENTATION
          : checkpoint.state.disorientation;
      const gardenWasInterrupted =
        checkpoint.state.gardenTriggered && !checkpoint.state.gardenSurvived;

      setState({
        ...createInitialRunState(checkpoint.actTwoSummary),
        ...checkpoint.state,
        disorientation: restoredDisorientation,
        gardenTriggered: gardenWasInterrupted
          ? false
          : checkpoint.state.gardenTriggered,
        deepCoreRoom:
          checkpoint.state.deepCoreRoom ??
          (checkpoint.state.gardenSurvived
            ? "neural-garden"
            : DEEP_CORE_START),
        thresholdPromptOpen: false,
        majorHackOpen: false,
        approachPromptOpen: false,
        confrontationPromptOpen: false,
        reckoningChoiceOpen: false,
        confrontationBeatId:
          checkpoint.state.confrontationBeatId ?? PLUG_CONFRONTATION_START,
        confrontationChoices: checkpoint.state.confrontationChoices ?? [],
        finalApproachEntered: checkpoint.state.finalApproachEntered ?? false,
        approachDialogueComplete:
          checkpoint.state.approachDialogueComplete ?? false,
        areaTransition: null,
        showChapterComplete: checkpoint.state.phase === "complete",
        ambientTick: 0,
        lastActionAt: Date.now(),
      });
      setResumeWhisper(
        gardenWasInterrupted
          ? "Checkpoint restored. The garden vision faded — Neural Garden is open again. Break Free or choose when ready."
          : "Checkpoint restored. The core remembers your path — and what you refused to forget.",
      );
      return;
    }

    setActTwo(save.act2Summary);
    const carriedMs = Math.min(
      save.act2Summary.timeRemainingMs,
      ACT_THREE_TIME_BUDGET_MS,
    );
    setClockInitialMs(carriedMs);
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
    state?.actThreeStage === "plug-chamber" ||
    state?.actThreeStage === "final-approach"
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
      finalApproachEntered: state.finalApproachEntered,
      finalApproachComplete: state.approachDialogueComplete,
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
  groknetWhisperRef.current = setGroknetWhisper;

  useEffect(() => {
    dialogueContextRef.current = dialogueContext;
  }, [dialogueContext]);

  const handlePlayerIntent = useCallback(
    (intent: PlayerIntent, line: string) => {
      if (intentReactionTimeoutRef.current) {
        clearTimeout(intentReactionTimeoutRef.current);
      }
      setIntentReaction({ intent, line });
      intentReactionTimeoutRef.current = setTimeout(() => {
        setIntentReaction(null);
        intentReactionTimeoutRef.current = null;
      }, 5500);
    },
    [],
  );

  const noteConfrontationIntent = useCallback(
    (choiceId: ConfrontationChoiceId) => {
      if (!state) return;
      const reaction = getConfrontationIntentReaction(
        choiceId,
        state.dominantPersonality,
        state.exchangeCount,
      );
      if (reaction) handlePlayerIntent(reaction.intent, reaction.line);
      setState((s) =>
        s
          ? {
              ...s,
              lastPlayerIntent: reaction?.intent ?? s.lastPlayerIntent,
              exchangeCount: s.exchangeCount + 1,
            }
          : s,
      );
    },
    [handlePlayerIntent, state],
  );

  useEffect(() => {
    if (resumeWhisper) {
      setGroknetWhisper(resumeWhisper, 6000, true);
      setResumeWhisper(null);
    }
  }, [resumeWhisper, setGroknetWhisper]);

  const handleEnterFinalApproachRef = useRef<() => void>(() => {});

  const schedulePostGardenTransition = useCallback(() => {
    if (gardenApproachTimeoutRef.current) {
      clearTimeout(gardenApproachTimeoutRef.current);
    }
    gardenApproachTimeoutRef.current = setTimeout(() => {
      const s = stateRef.current;
      if (
        s?.phase === "playing" &&
        s.actThreeStage === "deep-core-access" &&
        s.gardenSurvived &&
        !s.finalApproachEntered
      ) {
        handleEnterFinalApproachRef.current();
      }
      gardenApproachTimeoutRef.current = null;
    }, 8_500);
  }, []);
  schedulePostGardenTransitionRef.current = schedulePostGardenTransition;

  const handleGardenBreakFree = useCallback(() => {
    if (eventId !== "the-garden" || !dialogueContext) return;

    gardenExitHandledRef.current = true;
    endHallucination();
    setState((s) =>
      s
        ? {
            ...s,
            gardenSurvived: true,
            deepCoreRoom: "neural-garden",
            screenShaking: false,
            disorientation: {
              active: true,
              invertMovement: false,
              endsAt: Date.now() + 2_500,
            },
            lastActionAt: Date.now(),
          }
        : s,
    );
    setGroknetWhisper(getGardenExitWhisper(dialogueContext, null), 9000, true);
    schedulePostGardenTransition();
  }, [
    dialogueContext,
    endHallucination,
    eventId,
    schedulePostGardenTransition,
    setGroknetWhisper,
  ]);

  const handleHallucinationChoice = useCallback(
    (choice: HallucinationResponseChoice) => {
      const event = getHallucinationEvent(eventId);
      const consequence = event?.consequences[choice];
      if (!consequence) return;

      if (eventId === "the-garden") {
        gardenExitHandledRef.current = true;
        resolveChoice(choice);

        setState((s) => {
          if (!s) return s;
          return {
            ...s,
            gardenChoice: choice,
            gardenSurvived: true,
            deepCoreRoom: "neural-garden",
            screenShaking: false,
            finalMood: {
              cold: Math.min(
                3,
                Math.max(0, s.finalMood.cold + consequence.moodDelta.cold),
              ),
              melancholic: Math.min(
                3,
                Math.max(
                  0,
                  s.finalMood.melancholic + consequence.moodDelta.melancholic,
                ),
              ),
              analytical: Math.min(
                3,
                Math.max(
                  0,
                  s.finalMood.analytical + consequence.moodDelta.analytical,
                ),
              ),
            },
            disorientation: {
              active: true,
              invertMovement: consequence.invertMovement,
              endsAt: Date.now() + consequence.disorientationMs,
            },
            lastActionAt: Date.now(),
          };
        });

        if (dialogueContext) {
          const personalized = getPersonalizedChoiceConsequence(
            eventId,
            choice,
            consequence.groknetLine,
            dialogueContext,
          );
          setGroknetWhisper(personalized, 6500, true);
          window.setTimeout(() => {
            setGroknetWhisper(
              getGardenExitWhisper(dialogueContext, choice),
              10_000,
              true,
            );
          }, 3800);
        }
        schedulePostGardenTransition();
        return;
      }

      setState((s) => {
        if (!s) return s;
        return {
          ...s,
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
      const personalized = dialogueContext
        ? getPersonalizedChoiceConsequence(
            eventId,
            choice,
            consequence.groknetLine,
            dialogueContext,
          )
        : consequence.groknetLine;
      setGroknetWhisper(personalized, 8000, true);
    },
    [
      dialogueContext,
      endHallucination,
      eventId,
      resolveChoice,
      schedulePostGardenTransition,
      setGroknetWhisper,
    ],
  );

  useEffect(() => {
    if (!state?.disorientation.active) return;

    const remaining = state.disorientation.endsAt - Date.now();
    if (remaining <= 0) {
      setState((s) =>
        s
          ? {
              ...s,
              disorientation: INITIAL_DISORIENTATION,
            }
          : s,
      );
      return;
    }

    const timeout = window.setTimeout(() => {
      setState((s) =>
        s
          ? {
              ...s,
              disorientation: INITIAL_DISORIENTATION,
            }
          : s,
      );
    }, remaining);

    return () => window.clearTimeout(timeout);
  }, [state?.disorientation]);

  const scheduleTheGarden = useCallback(() => {
    if (!dialogueContext || state?.gardenSurvived || active) return;

    gardenExitHandledRef.current = false;
    setState((s) =>
      s ? { ...s, gardenTriggered: true, screenShaking: true } : s,
    );
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => {
      setState((s) => (s ? { ...s, screenShaking: false } : s));
      shakeTimeoutRef.current = null;
    }, 480);
    playTheGardenSound();
    playTensionPulseSound();

    const preface = getReactiveGardenPreface(dialogueContext);
    setGroknetWhisper(preface, 6000, true);

    if (gardenDelayRef.current) clearTimeout(gardenDelayRef.current);
    gardenDelayRef.current = setTimeout(() => {
      playHallucinationPeakSound();
      triggerHallucination({
        eventId: "the-garden",
        personality: dialogueContext.dominantPersonality,
        visionText: getPersonalizedGardenVision(dialogueContext),
        voiceLine: getPersonalizedGardenVoice(dialogueContext),
      });
      gardenDelayRef.current = null;
    }, 2200);
  }, [
    active,
    dialogueContext,
    setGroknetWhisper,
    state?.gardenSurvived,
    triggerHallucination,
  ]);

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

  const handleEnterFinalApproach = useCallback(() => {
    if (!actTwo || !dialogueContext) return;

    const groknetLine = getTransitionWhisper(
      "deep-core-access",
      "final-approach",
      {
        detections: actTwo.actOneSummary.detections,
        finalTone: actTwo.finalTone,
        finalMood: actTwo.finalMood,
        lastPlayerIntent: actTwo.lastPlayerIntent,
        hubHackComplete: resolveHubHackComplete(actTwo.actOneSummary),
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
      to: "final-approach",
      groknetLine,
    });
    setState((s) =>
      s
        ? {
            ...s,
            actThreeStage: "final-approach",
            finalApproachEntered: true,
            areaTransition: {
              from: "deep-core-access",
              to: "final-approach",
              groknetLine,
            },
            lastActionAt: Date.now(),
          }
        : s,
    );
  }, [actTwo, dialogueContext, state?.gardenChoice]);

  handleEnterFinalApproachRef.current = handleEnterFinalApproach;

  const handleEnterPlugChamber = useCallback(() => {
    if (!actTwo || !dialogueContext) return;

    const groknetLine = getTransitionWhisper(
      "final-approach",
      "plug-chamber",
      {
        detections: actTwo.actOneSummary.detections,
        finalTone: actTwo.finalTone,
        finalMood: actTwo.finalMood,
        lastPlayerIntent: actTwo.lastPlayerIntent,
        hubHackComplete: resolveHubHackComplete(actTwo.actOneSummary),
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
      from: "final-approach",
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
              from: "final-approach",
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
        confrontationChoices: state.confrontationChoices,
        finalApproachComplete: state.approachDialogueComplete,
        plugChoice,
        endingId: "the-compromise",
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
          state.confrontationChoices,
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
    if (!dialogueContext || !state || state.phase !== "playing" || active) return;

    const lateStage =
      state.actThreeStage === "plug-chamber" ||
      state.actThreeStage === "final-approach";
    const idleMs = lateStage
      ? ACT_THREE_PLUG_IDLE_WHISPER_MS
      : ACT_THREE_IDLE_WHISPER_MS;
    const ambientMs = lateStage
      ? ACT_THREE_PLUG_AMBIENT_WHISPER_MS
      : ACT_THREE_AMBIENT_WHISPER_MS;

    idleIntervalRef.current = setInterval(() => {
      const s = stateRef.current;
      if (!s || s.phase !== "playing" || s.groknetWhisper) return;
      if (Date.now() - s.lastActionAt < idleMs) return;
      const personalityLine = getPersonalityVariantWhisper(dialogueContext);
      const historyLine = getHistoryAmbientWhisper(dialogueContext, s.ambientTick);
      const line = s.ambientTick % 2 === 0 ? historyLine : personalityLine;
      setGroknetWhisper(
        line || getDeepCoreAmbientWhisper(dialogueContext),
        5500,
        true,
      );
      setState((prev) =>
        prev
          ? {
              ...prev,
              lastActionAt: Date.now(),
              ambientTick: prev.ambientTick + 1,
            }
          : prev,
      );
    }, idleMs);

    ambientIntervalRef.current = setInterval(() => {
      const s = stateRef.current;
      if (!s || s.phase !== "playing" || s.groknetWhisper) return;
      const tick = s.ambientTick;
      const line =
        s.actThreeStage === "plug-chamber"
          ? getPlugHistoryWhisper(dialogueContext)
          : getHistoryPersonalWhisper(dialogueContext);
      setGroknetWhisper(line, 4800, tick % 3 === 0);
      setState((prev) =>
        prev ? { ...prev, ambientTick: prev.ambientTick + 1 } : prev,
      );
    }, ambientMs);

    return () => {
      if (idleIntervalRef.current) clearInterval(idleIntervalRef.current);
      if (ambientIntervalRef.current) clearInterval(ambientIntervalRef.current);
    };
  }, [
    active,
    dialogueContext,
    setGroknetWhisper,
    state?.phase,
    state?.actThreeStage,
  ]);

  useEffect(() => {
    if (!dialogueContext || !state || state.phase !== "playing") return;
    if (state.actThreeStage !== "deep-core-access") return;

    const interval = window.setInterval(() => {
      const tick = stateRef.current?.ambientTick ?? 0;
      setCorruptionLine(getCorruptedSystemLine(dialogueContext, tick));
    }, ACT_THREE_CORRUPTION_TICK_MS);

    return () => window.clearInterval(interval);
  }, [dialogueContext, state?.phase, state?.actThreeStage]);

  useEffect(() => {
    return () => {
      if (whisperTimeoutRef.current) clearTimeout(whisperTimeoutRef.current);
      if (intentReactionTimeoutRef.current) {
        clearTimeout(intentReactionTimeoutRef.current);
      }
      if (gardenDelayRef.current) clearTimeout(gardenDelayRef.current);
      if (gardenApproachTimeoutRef.current) {
        clearTimeout(gardenApproachTimeoutRef.current);
      }
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
    setShowEndingCredits(false);
    setClockInitialMs(ACT_THREE_TIME_BUDGET_MS);
    setState(createInitialRunState(actTwo));
  }, [actTwo]);

  const handleActThreeTransitionComplete = useCallback(() => {
    const ctx = actTwo ? buildActThreeDialogueContext(actTwo) : null;
    const preamble = ctx ? getActThreeOpeningPreamble(ctx) : null;
    setState((s) =>
      s
        ? {
            ...s,
            phase: "playing",
            lastActionAt: Date.now(),
            groknetWhisper: preamble,
          }
        : s,
    );
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
  const controlsLocked =
    !playing ||
    active ||
    state.disorientation.active ||
    state.phase === "transition" ||
    areaTransition !== null;
  const overlayIntensity =
    clock.isCritical || active || aggression.level >= 55 ? "tense" : "calm";

  return (
    <GameShell
      shaking={state.screenShaking || (active && (profile?.screenShake ?? false))}
      variant="act-3"
      stage={playing ? state.actThreeStage : undefined}
      overlayIntensity={overlayIntensity}
      hallucinationActive={active}
    >
      {state.phase === "transition" ? (
        <ActThreeTransition
          actTwo={actTwo}
          onComplete={handleActThreeTransitionComplete}
        />
      ) : null}

      <div
        className={cn(
          "animate-page-in flex flex-1 flex-col",
          active && "hallucination-active",
          active && "hallucination-loss-of-control",
          active && phase === "peak" && "hallucination-peak",
          state.disorientation.active && "disorientation-active",
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
              : state.actThreeStage === "final-approach"
                ? {
                    ...ACT_THREE_CHAPTER,
                    subtitle: "Chapter 3 · Final Approach",
                    sector: "Physical Core Terminal",
                  }
                : ACT_THREE_CHAPTER
          }
          timeRemaining={clock.formatted}
          timeCritical={clock.isCritical}
          aggression={aggression}
          groknetWhisper={state.groknetWhisper}
          hallucinationActive={active}
          intentReaction={intentReaction}
          chapterProgress={chapterProgress}
        />

        <main
          className={cn(
            "flex flex-1 flex-col items-center justify-center pb-8 sm:pb-10 transition-opacity duration-500",
            state.phase === "transition" && "opacity-0 pointer-events-none",
            playing && "stage-content-in",
            active && "hallucination-content-distort",
            active &&
              phase === "peak" &&
              !awaitingChoice &&
              eventId !== "the-garden" &&
              "hallucination-controls-off",
            state.disorientation.active && "disorientation-blur",
          )}
        >
          {playing &&
          state.actThreeStage === "deep-core-access" &&
          dialogueContext ? (
            <DeepCoreSection
              context={dialogueContext}
              initialRoom={state.deepCoreRoom}
              fortificationHackComplete={state.fortificationHackComplete}
              thresholdDialogueComplete={state.thresholdDialogueComplete}
              thresholdPromptOpen={state.thresholdPromptOpen}
              thresholdBeatIndex={state.thresholdBeatIndex}
              gardenSurvived={state.gardenSurvived}
              gardenActive={active && eventId === "the-garden"}
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
              onThresholdChoice={(choiceId, response) => {
                noteConfrontationIntent(choiceId);
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
              onEnterFinalApproach={handleEnterFinalApproach}
              onGroknetWhisper={(line, speak) =>
                setGroknetWhisper(line, 5500, speak)
              }
              onMove={(_from, to) => {
                if (!dialogueContext) return;
                const moveCount = (state?.moveCount ?? 0) + 1;
                const historyLine = getHistoryMoveWhisper(dialogueContext, moveCount);
                const moveLine = getDeepCoreMoveWhisper(
                  moveCount,
                  dialogueContext,
                  to,
                );
                const line = moveCount % 2 === 0 ? historyLine : moveLine;
                setGroknetWhisper(line, 4500, moveCount % 3 === 0);
                setState((s) =>
                  s
                    ? {
                        ...s,
                        deepCoreRoom: to,
                        moveCount,
                        lastActionAt: Date.now(),
                      }
                    : s,
                );
              }}
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
              corruptionLine={corruptionLine}
            />
          ) : null}

          {playing &&
          state.actThreeStage === "final-approach" &&
          dialogueContext ? (
            <FinalApproachSection
              context={dialogueContext}
              approachDialogueComplete={state.approachDialogueComplete}
              approachPromptOpen={state.approachPromptOpen}
              onOpenApproachPrompt={() =>
                setState((s) =>
                  s
                    ? {
                        ...s,
                        approachPromptOpen: true,
                        lastActionAt: Date.now(),
                      }
                    : s,
                )
              }
              onApproachDialogueComplete={(response) => {
                setGroknetWhisper(response, 7000, true);
                setState((s) =>
                  s
                    ? {
                        ...s,
                        approachPromptOpen: false,
                        approachDialogueComplete: true,
                        lastActionAt: Date.now(),
                      }
                    : s,
                );
              }}
              onEnterPlugChamber={handleEnterPlugChamber}
              onGroknetWhisper={(line, speak) =>
                setGroknetWhisper(line, 5500, speak)
              }
              onMove={(_from, to) => {
                if (!dialogueContext) return;
                const moveCount = (state?.moveCount ?? 0) + 1;
                setGroknetWhisper(
                  getHistoryMoveWhisper(dialogueContext, moveCount),
                  4500,
                  to === "core-terminal",
                );
                setState((s) =>
                  s
                    ? {
                        ...s,
                        moveCount,
                        lastActionAt: Date.now(),
                      }
                    : s,
                );
              }}
              onRoomEnter={(room) => {
                if (!dialogueContext) return;
                setGroknetWhisper(
                  getFinalApproachRoomWhisper(room, dialogueContext),
                  5000,
                  room === "core-terminal",
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
              confrontationBeatId={state.confrontationBeatId}
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
                        confrontationBeatId:
                          s.confrontationBeatIndex === 0
                            ? PLUG_CONFRONTATION_START
                            : s.confrontationBeatId,
                        lastActionAt: Date.now(),
                      }
                    : s,
                )
              }
              onConfrontationChoice={(choiceId, response, nextBeatId) => {
                noteConfrontationIntent(choiceId);
                setGroknetWhisper(response, 6000, true);
                setState((s) => {
                  if (!s) return s;
                  const nextChoices = [...s.confrontationChoices, choiceId];
                  const nextBeatIndex = s.confrontationBeatIndex + 1;
                  if (!nextBeatId) {
                    return {
                      ...s,
                      confrontationPromptOpen: false,
                      confrontationComplete: true,
                      confrontationBeatIndex: nextBeatIndex,
                      confrontationChoices: nextChoices,
                      lastActionAt: Date.now(),
                    };
                  }
                  return {
                    ...s,
                    confrontationBeatId: nextBeatId,
                    confrontationBeatIndex: nextBeatIndex,
                    confrontationChoices: nextChoices,
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
              onMove={() => {
                if (!dialogueContext) return;
                const moveCount = (state?.moveCount ?? 0) + 1;
                const historyLine = getPlugHistoryWhisper(dialogueContext);
                const moveLine = getPlugChamberMoveWhisper(dialogueContext);
                const line = moveCount % 2 === 0 ? historyLine : moveLine;
                setGroknetWhisper(line, 4800, true);
                setState((s) =>
                  s
                    ? {
                        ...s,
                        moveCount,
                        lastActionAt: Date.now(),
                      }
                    : s,
                );
              }}
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
        profile={profile}
      />

      {active && eventId === "the-garden" && dialogueContext ? (
        <GardenHallucinationPrompt
          context={dialogueContext}
          phase={awaitingChoice ? "choices" : "rising"}
          onChoose={handleHallucinationChoice}
          onBreakFree={handleGardenBreakFree}
        />
      ) : awaitingChoice ? (
        <HallucinationChoicePrompt
          eventId={eventId}
          profile={profile}
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
          onComplete={() => {
            setShowFinale(false);
            setShowEndingCredits(true);
          }}
        />
      ) : null}

      {showEndingCredits ? (
        <EndingCreditsOutro
          onComplete={() => setShowEndingCredits(false)}
        />
      ) : null}

      {state.showChapterComplete &&
      chapterSummary &&
      !showFinale &&
      !showEndingCredits ? (
        <ActThreeChapterEnding
          summary={chapterSummary}
          onRestart={restartActThree}
        />
      ) : null}
    </GameShell>
  );
}