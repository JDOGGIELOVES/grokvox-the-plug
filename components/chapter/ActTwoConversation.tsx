"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ActTwoChapterEnding } from "@/components/chapter/ActTwoChapterEnding";
import { ActTwoFinale } from "@/components/chapter/ActTwoFinale";
import { ActTwoTransition } from "@/components/chapter/ActTwoTransition";
import { GameHeader } from "@/components/chapter/GameHeader";
import { GameShell } from "@/components/chapter/GameShell";
import { AreaTransition } from "@/components/chapter/AreaTransition";
import { ResidentialSectorSection } from "@/components/chapter/ResidentialSectorSection";
import { ResearchWingSection } from "@/components/chapter/ResearchWingSection";
import { ServerFarmSection } from "@/components/chapter/ServerFarmSection";
import { HallucinationChoicePrompt } from "@/components/HallucinationChoicePrompt";
import { HallucinationEffect } from "@/components/HallucinationEffect";
import { Terminal } from "@/components/Terminal";
import { useGameClock } from "@/hooks/useGameClock";
import { useHallucination } from "@/hooks/useHallucination";
import { calculateAggression } from "@/lib/aggression";
import { resolveHubHackComplete } from "@/lib/chapter/act-1";
import {
  ACT_TWO_CHAPTER,
  ACT_TWO_CLOCK_STEP_MS,
  ACT_TWO_CLOCK_TICK_MS,
  ACT_TWO_IDLE_WHISPER_MS,
  ACT_TWO_RESEARCH_CLOCK_TICK_MS,
  ACT_TWO_RESEARCH_IDLE_WHISPER_MS,
  ACT_TWO_SERVER_CLOCK_TICK_MS,
  ACT_TWO_SERVER_IDLE_WHISPER_MS,
  ACT_TWO_TIME_BUDGET_MS,
  getActTwoChapterMeta,
} from "@/lib/chapter/act-2";
import {
  getTransitionWhisper,
} from "@/lib/chapter/area-transitions";
import {
  getResearchAmbientWhisper,
  getResearchMoveWhisper,
  getResearchRoomWhisper,
} from "@/lib/chapter/act-two-research-presence";
import {
  getServerFarmAmbientWhisper,
  getServerFarmMoveWhisper,
  getServerFarmRoomWhisper,
} from "@/lib/chapter/act-two-server-presence";
import {
  getAccumulationVisionText,
  getAccumulationVoiceLine,
} from "@/lib/hallucinations/the-accumulation";
import {
  getLastConversationVisionText,
  getLastConversationVoiceLine,
} from "@/lib/hallucinations/the-last-conversation-personalized";
import {
  getTheChildrenVisionText,
  getTheChildrenVoiceLine,
} from "@/lib/hallucinations/the-children-personalized";
import { getPersonalityEvolutionBeats } from "@/lib/dialogue/act-two-personality-evolution";
import { calculateActTwoProgress } from "@/lib/chapter/act-two-progress";
import {
  getActTwoActionWhisper,
  getActTwoAmbientWhisper,
  getActTwoMovementWhisper,
  getActTwoRoomWhisper,
} from "@/lib/chapter/act-two-presence";
import { playGroknetVoiceLine } from "@/lib/hallucination";
import {
  buildActTwoDialogueContext,
  type ActTwoDialogueContext,
} from "@/lib/dialogue/act-two-context";
import { resolvePersonality } from "@/lib/dialogue/personalities";
import { getHallucinationEvent } from "@/lib/hallucinations";
import { getActTwoInspectWhisper } from "@/lib/residential-artifacts";
import type { GroknetMood } from "@/lib/groknet";
import type { PersonalArtifactId } from "@/types/residential-sector";

import {
  clearActTwoCheckpoint,
  loadActTwoCheckpoint,
  loadGameSave,
  saveActTwoCheckpoint,
  saveActTwoProgress,
  type ActTwoCheckpointState,
} from "@/lib/save-progress";
import {
  playHallucinationPeakSound,
  playLastConversationChoiceSound,
  playLastConversationSound,
  playResidentialHeartbeat,
  playTheAccumulationSound,
  playTheChildrenSound,
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
import type { ResidentialRoomId } from "@/types/residential-sector";
import type {
  ActTwoStage,
  LabTerminalId,
  RelationshipStance,
  ResearchRoomId,
} from "@/types/research-wing";
import type {
  PersonalityEvolutionPath,
  ServerFarmRoomId,
} from "@/types/server-farm";
import type { ChapterOneSummary, ChapterTwoSummary } from "@/types/run";
import { cn } from "@/lib/utils";

type ActTwoPhase = "transition" | "playing" | "complete";

type RunState = {
  phase: ActTwoPhase;
  runStart: number;
  gameKey: number;
  isTerminalOpen: boolean;
  dialogueComplete: boolean;
  lastConversationTriggered: boolean;
  lastConversationSurvived: boolean;
  lastConversationChoice: HallucinationResponseChoice | null;
  exchangeCount: number;
  moveCount: number;
  finalTone: GroknetTone;
  finalMood: GroknetMood;
  dominantPersonality: GroknetPersonality;
  lastPlayerIntent: PlayerIntent;
  groknetWhisper: string | null;
  disorientation: DisorientationState;
  screenShaking: boolean;
  showChapterComplete: boolean;
  ambientTick: number;
  quartersVisited: boolean;
  lastActionAt: number;
  actTwoStage: ActTwoStage;
  areaTransition: {
    from: ChapterStage;
    to: ChapterStage;
    groknetLine: string;
  } | null;
  labHacksComplete: Record<LabTerminalId, boolean>;
  labDialogueComplete: boolean;
  labExchangeCount: number;
  relationshipStance: RelationshipStance | null;
  relationshipBeatIndex: number;
  relationshipPromptOpen: boolean;
  activeHack: LabTerminalId | null;
  childrenTriggered: boolean;
  childrenSurvived: boolean;
  childrenChoice: HallucinationResponseChoice | null;
  researchWingEntered: boolean;
  serverFarmEntered: boolean;
  personalityEvolutionPath: PersonalityEvolutionPath | null;
  personalityBeatIndex: number;
  personalityDialogueComplete: boolean;
  personalityPromptOpen: boolean;
  serverHackComplete: boolean;
  majorHackOpen: boolean;
  accumulationTriggered: boolean;
  accumulationSurvived: boolean;
  accumulationChoice: HallucinationResponseChoice | null;
};

const INITIAL_DISORIENTATION: DisorientationState = {
  active: false,
  invertMovement: false,
  endsAt: 0,
};

function createInitialRunState(actOne: ChapterOneSummary): RunState {
  return {
    phase: "transition",
    runStart: Date.now(),
    gameKey: 0,
    isTerminalOpen: false,
    dialogueComplete: false,
    lastConversationTriggered: false,
    lastConversationSurvived: false,
    lastConversationChoice: null,
    exchangeCount: 0,
    moveCount: 0,
    finalTone: actOne.finalTone,
    finalMood: actOne.finalMood,
    dominantPersonality: actOne.dominantPersonality,
    lastPlayerIntent: actOne.lastPlayerIntent,
    groknetWhisper: null,
    disorientation: INITIAL_DISORIENTATION,
    screenShaking: false,
    showChapterComplete: false,
    ambientTick: 0,
    quartersVisited: false,
    lastActionAt: Date.now(),
    actTwoStage: "residential-sector",
    areaTransition: null,
    labHacksComplete: {
      "ex-lab-01": false,
      "ex-nb-02": false,
      "ex-sv-03": false,
    },
    labDialogueComplete: false,
    labExchangeCount: 0,
    relationshipStance: null,
    relationshipBeatIndex: 0,
    relationshipPromptOpen: false,
    activeHack: null,
    childrenTriggered: false,
    childrenSurvived: false,
    childrenChoice: null,
    researchWingEntered: false,
    serverFarmEntered: false,
    personalityEvolutionPath: null,
    personalityBeatIndex: 0,
    personalityDialogueComplete: false,
    personalityPromptOpen: false,
    serverHackComplete: false,
    majorHackOpen: false,
    accumulationTriggered: false,
    accumulationSurvived: false,
    accumulationChoice: null,
  };
}

function toCheckpointState(state: RunState): ActTwoCheckpointState {
  return {
    phase: state.phase,
    runStart: state.runStart,
    gameKey: state.gameKey,
    isTerminalOpen: state.isTerminalOpen,
    dialogueComplete: state.dialogueComplete,
    lastConversationTriggered: state.lastConversationTriggered,
    lastConversationSurvived: state.lastConversationSurvived,
    lastConversationChoice: state.lastConversationChoice,
    exchangeCount: state.exchangeCount,
    moveCount: state.moveCount,
    finalTone: state.finalTone,
    finalMood: state.finalMood,
    dominantPersonality: state.dominantPersonality,
    lastPlayerIntent: state.lastPlayerIntent,
    groknetWhisper: state.groknetWhisper,
    disorientation: state.disorientation,
    screenShaking: state.screenShaking,
    actTwoStage: state.actTwoStage,
    labHacksComplete: state.labHacksComplete,
    labDialogueComplete: state.labDialogueComplete,
    labExchangeCount: state.labExchangeCount,
    relationshipStance: state.relationshipStance,
    relationshipBeatIndex: state.relationshipBeatIndex,
    childrenTriggered: state.childrenTriggered,
    childrenSurvived: state.childrenSurvived,
    childrenChoice: state.childrenChoice,
    personalityEvolutionPath: state.personalityEvolutionPath,
    personalityBeatIndex: state.personalityBeatIndex,
    personalityDialogueComplete: state.personalityDialogueComplete,
    serverHackComplete: state.serverHackComplete,
    accumulationTriggered: state.accumulationTriggered,
    accumulationSurvived: state.accumulationSurvived,
    accumulationChoice: state.accumulationChoice,
  };
}

export function ActTwoConversation() {
  const router = useRouter();
  const [actOne, setActOne] = useState<ChapterOneSummary | null>(null);
  const [state, setState] = useState<RunState | null>(null);
  const [clockInitialMs, setClockInitialMs] = useState(ACT_TWO_TIME_BUDGET_MS);
  const [chapterSummary, setChapterSummary] = useState<ChapterTwoSummary | null>(
    null,
  );
  const [showFinale, setShowFinale] = useState(false);
  const [resumeWhisper, setResumeWhisper] = useState<string | null>(null);
  const [intentReaction, setIntentReaction] = useState<{
    intent: PlayerIntent;
    line: string;
  } | null>(null);

  const whisperTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intentReactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const lastConversationDelayRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const childrenDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accumulationDelayRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [areaTransition, setAreaTransition] = useState<{
    from: ChapterStage;
    to: ChapterStage;
    groknetLine: string;
  } | null>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ambientIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const idleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentRoomRef = useRef<ResidentialRoomId>("sector-entry");
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
      if (endedEvent === "the-last-conversation") {
        setState((s) =>
          s
            ? {
                ...s,
                lastConversationSurvived: true,
                screenShaking: false,
              }
            : s,
        );
      }
      if (endedEvent === "the-children") {
        setState((s) =>
          s
            ? {
                ...s,
                childrenSurvived: true,
                screenShaking: false,
              }
            : s,
        );
      }
      if (endedEvent === "the-accumulation") {
        setState((s) =>
          s
            ? {
                ...s,
                accumulationSurvived: true,
                screenShaking: false,
              }
            : s,
        );
        window.setTimeout(() => {
          setState((s) =>
            s
              ? {
                  ...s,
                  showChapterComplete: true,
                  phase: "complete",
                }
              : s,
          );
        }, 1600);
      }
    },
  });

  useEffect(() => {
    const save = loadGameSave();
    if (!save?.summary) {
      router.replace("/game/act-1/infiltration");
      return;
    }

    const checkpoint = loadActTwoCheckpoint();
    if (checkpoint && checkpoint.actOneSummary.completedAt === save.summary.completedAt) {
      setActOne(checkpoint.actOneSummary);
      setClockInitialMs(checkpoint.clockRemainingMs);
      setState({
        ...checkpoint.state,
        showChapterComplete: checkpoint.state.phase === "complete",
        ambientTick: 0,
        quartersVisited: checkpoint.state.exchangeCount > 0,
        lastActionAt: Date.now(),
        areaTransition: null,
        relationshipPromptOpen: false,
        activeHack: null,
        majorHackOpen: false,
        personalityPromptOpen: false,
        researchWingEntered:
          checkpoint.state.actTwoStage === "research-wing" ||
          checkpoint.state.actTwoStage === "central-server-farm",
        serverFarmEntered:
          checkpoint.state.actTwoStage === "central-server-farm",
      });
      setResumeWhisper(
        "Checkpoint restored. Every choice in the hall still echoes — I'm listening.",
      );
      return;
    }

    setActOne(save.summary);
    setState(createInitialRunState(save.summary));
  }, [router]);

  const clock = useGameClock(
    state?.phase === "playing" && !state.showChapterComplete,
    clockInitialMs,
    ACT_TWO_CLOCK_TICK_MS,
    ACT_TWO_CLOCK_STEP_MS,
  );

  const dialogueContext: ActTwoDialogueContext | null = useMemo(() => {
    if (!actOne || !state) return null;
    const ctx = buildActTwoDialogueContext(actOne);
    return {
      ...ctx,
      exchangeCount: state.exchangeCount,
      moveCount: state.moveCount,
      dialogueStarted: state.exchangeCount > 0 || state.isTerminalOpen,
      dialogueComplete: state.dialogueComplete,
      lastConversationTriggered: state.lastConversationTriggered,
      lastConversationSurvived: state.lastConversationSurvived,
      lastConversationChoice: state.lastConversationChoice,
      actTwoStage: state.actTwoStage,
      labHacksComplete: state.labHacksComplete,
      labDialogueComplete: state.labDialogueComplete,
      labExchangeCount: state.labExchangeCount,
      relationshipStance: state.relationshipStance,
      relationshipBeatIndex: state.relationshipBeatIndex,
      childrenTriggered: state.childrenTriggered,
      childrenSurvived: state.childrenSurvived,
      childrenChoice: state.childrenChoice,
      personalityEvolutionPath: state.personalityEvolutionPath,
      personalityBeatIndex: state.personalityBeatIndex,
      personalityDialogueComplete: state.personalityDialogueComplete,
      serverHackComplete: state.serverHackComplete,
      accumulationTriggered: state.accumulationTriggered,
      accumulationSurvived: state.accumulationSurvived,
      accumulationChoice: state.accumulationChoice,
      finalTone: state.finalTone,
      finalMood: state.finalMood,
      dominantPersonality: state.dominantPersonality,
      lastPlayerIntent: state.lastPlayerIntent,
    };
  }, [actOne, state]);

  const aggression = useMemo(() => {
    if (!actOne || !state) {
      return { level: 0, label: "Low" };
    }
    return calculateAggression({
      mood: state.finalMood,
      detections: actOne.detections,
      exchangeCount: state.exchangeCount + actOne.exchangeCount,
      hallucinationActive: active,
    });
  }, [actOne, state, active]);

  const chapterProgress = useMemo(() => {
    if (!state) return undefined;
    return calculateActTwoProgress({
      phase: state.phase,
      actTwoStage: state.actTwoStage,
      dialogueComplete: state.dialogueComplete,
      lastConversationSurvived: state.lastConversationSurvived,
      labHacksComplete: state.labHacksComplete,
      labDialogueComplete: state.labDialogueComplete,
      childrenSurvived: state.childrenSurvived,
      personalityDialogueComplete: state.personalityDialogueComplete,
      serverHackComplete: state.serverHackComplete,
      accumulationSurvived: state.accumulationSurvived,
      showChapterComplete: state.showChapterComplete,
    });
  }, [state]);

  const setGroknetWhisper = useCallback(
    (line: string, durationMs = 5000, speak = false) => {
      if (whisperTimeoutRef.current) clearTimeout(whisperTimeoutRef.current);
      setState((s) =>
        s ? { ...s, groknetWhisper: line, lastActionAt: Date.now() } : s,
      );
      if (speak) playGroknetVoiceLine(line);
      whisperTimeoutRef.current = setTimeout(() => {
        setState((s) => (s ? { ...s, groknetWhisper: null } : s));
        whisperTimeoutRef.current = null;
      }, durationMs);
    },
    [],
  );

  useEffect(() => {
    if (resumeWhisper) {
      setGroknetWhisper(resumeWhisper, 6000, true);
      setResumeWhisper(null);
    }
  }, [resumeWhisper, setGroknetWhisper]);

  useEffect(() => {
    if (!state || !actOne || state.phase !== "playing") return;

    saveActTwoCheckpoint(
      actOne,
      toCheckpointState(state),
      clock.remainingMs,
    );
  }, [state, actOne, clock.remainingMs]);

  useEffect(() => {
    if (!state || state.phase !== "playing" || active) return;

    const tickMs =
      state.actTwoStage === "central-server-farm"
        ? ACT_TWO_SERVER_CLOCK_TICK_MS
        : state.actTwoStage === "research-wing"
          ? ACT_TWO_RESEARCH_CLOCK_TICK_MS
          : ACT_TWO_CLOCK_TICK_MS;

    ambientIntervalRef.current = setInterval(() => {
      if (!dialogueContext) return;
      setState((s) => {
        if (
          !s ||
          s.isTerminalOpen ||
          s.groknetWhisper ||
          s.activeHack ||
          s.majorHackOpen ||
          s.personalityPromptOpen
        ) {
          return s;
        }
        const tick = s.ambientTick + 1;
        const ctx = {
          ...dialogueContext,
          actTwoStage: s.actTwoStage,
          labHacksComplete: s.labHacksComplete,
          labDialogueComplete: s.labDialogueComplete,
          childrenTriggered: s.childrenTriggered,
          childrenChoice: s.childrenChoice,
          personalityEvolutionPath: s.personalityEvolutionPath,
          personalityDialogueComplete: s.personalityDialogueComplete,
          serverHackComplete: s.serverHackComplete,
          accumulationSurvived: s.accumulationSurvived,
        };
        const line =
          s.actTwoStage === "central-server-farm"
            ? getServerFarmAmbientWhisper(ctx, tick)
            : s.actTwoStage === "research-wing"
              ? getResearchAmbientWhisper(ctx, tick)
              : getActTwoAmbientWhisper(ctx, tick);
        setGroknetWhisper(line, 4800, tick % 4 === 0);
        return { ...s, ambientTick: tick };
      });
    }, tickMs);

    return () => {
      if (ambientIntervalRef.current) {
        clearInterval(ambientIntervalRef.current);
        ambientIntervalRef.current = null;
      }
    };
  }, [
    state?.phase,
    state?.actTwoStage,
    active,
    dialogueContext,
    state?.isTerminalOpen,
    setGroknetWhisper,
  ]);

  useEffect(() => {
    if (!state || state.phase !== "playing" || active) return;

    const idleMs =
      state.actTwoStage === "central-server-farm"
        ? ACT_TWO_SERVER_IDLE_WHISPER_MS
        : state.actTwoStage === "research-wing"
          ? ACT_TWO_RESEARCH_IDLE_WHISPER_MS
          : ACT_TWO_IDLE_WHISPER_MS;

    idleIntervalRef.current = setInterval(() => {
      if (!dialogueContext) return;
      setState((s) => {
        if (
          !s ||
          s.isTerminalOpen ||
          s.groknetWhisper ||
          s.activeHack ||
          s.majorHackOpen ||
          s.relationshipPromptOpen ||
          s.personalityPromptOpen
        ) {
          return s;
        }
        const elapsed = Date.now() - s.lastActionAt;
        if (elapsed < idleMs) return s;
        const ctx = {
          ...dialogueContext,
          actTwoStage: s.actTwoStage,
          childrenChoice: s.childrenChoice,
          personalityEvolutionPath: s.personalityEvolutionPath,
          serverHackComplete: s.serverHackComplete,
        };
        const line =
          s.actTwoStage === "central-server-farm"
            ? getServerFarmAmbientWhisper(ctx, s.ambientTick)
            : getActTwoActionWhisper("idle", ctx);
        setGroknetWhisper(
          line,
          6000,
          s.actTwoStage !== "residential-sector",
        );
        return { ...s, lastActionAt: Date.now() };
      });
    }, idleMs);

    return () => {
      if (idleIntervalRef.current) {
        clearInterval(idleIntervalRef.current);
        idleIntervalRef.current = null;
      }
    };
  }, [
    state?.phase,
    state?.lastActionAt,
    state?.actTwoStage,
    active,
    dialogueContext,
    setGroknetWhisper,
  ]);

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

  const handleTransitionComplete = useCallback(() => {
    setState((s) =>
      s
        ? {
            ...s,
            phase: "playing",
            groknetWhisper:
              "Welcome to the quiet layer, Alex. …I've been waiting to talk without interference.",
          }
        : s,
    );
  }, []);

  const scheduleLastConversation = useCallback(() => {
    if (!dialogueContext) return;

    setState((s) => {
      if (!s || s.lastConversationTriggered) return s;

      if (lastConversationDelayRef.current) {
        clearTimeout(lastConversationDelayRef.current);
      }

      const ctx = { ...dialogueContext, dialogueComplete: s.dialogueComplete };
      lastConversationDelayRef.current = setTimeout(() => {
        playLastConversationSound();
        playHallucinationPeakSound();
        triggerHallucination({
          eventId: "the-last-conversation",
          voiceLine: getLastConversationVoiceLine(ctx),
          message: getLastConversationVoiceLine(ctx),
          visionText: getLastConversationVisionText(ctx),
        });
        lastConversationDelayRef.current = null;
      }, 1600);

      return {
        ...s,
        lastConversationTriggered: true,
        screenShaking: true,
      };
    });

    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => {
      setState((s) => (s ? { ...s, screenShaking: false } : s));
      shakeTimeoutRef.current = null;
    }, 1400);
  }, [dialogueContext, triggerHallucination]);

  const handleHallucinationChoice = useCallback(
    (choice: HallucinationResponseChoice) => {
      const event = getHallucinationEvent(eventId);
      const consequence = event?.consequences[choice];
      if (!consequence) return;

      setState((s) => {
        if (!s) return s;
        return {
          ...s,
          ...(eventId === "the-last-conversation"
            ? { lastConversationChoice: choice }
            : {}),
          ...(eventId === "the-children" ? { childrenChoice: choice } : {}),
          ...(eventId === "the-accumulation"
            ? { accumulationChoice: choice }
            : {}),
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
      if (eventId === "the-accumulation") {
        playTheAccumulationSound();
      } else if (eventId === "the-children") {
        playTheChildrenSound();
      } else {
        playLastConversationChoiceSound();
      }
      setGroknetWhisper(consequence.groknetLine, 8000, true);
      if (eventId === "the-last-conversation") {
        window.setTimeout(() => {
          setGroknetWhisper(
            "The hall is behind you. …Return to Sector Entry and descend — the Research Wing waits with contested terminals and harder truths.",
            7500,
            true,
          );
        }, 8600);
      }
      if (eventId === "the-children") {
        window.setTimeout(() => {
          setGroknetWhisper(
            "The playground fades. …Descend from the Containment Loop — the Central Server Farm is my spine, and Act II peaks there.",
            7500,
            true,
          );
        }, 8600);
      }
    },
    [eventId, endHallucination, setGroknetWhisper],
  );

  const handleChapterComplete = useCallback(() => {
    if (!actOne || !state) return;

    const summary: ChapterTwoSummary = {
      actId: "act-2",
      chapterId: "conversation",
      completedAt: Date.now(),
      elapsedMs: Date.now() - state.runStart,
      timeRemainingMs: clock.remainingMs,
      aggressionLevel: aggression.level,
      aggressionLabel: aggression.label,
      exchangeCount: state.exchangeCount,
      dialogueComplete: state.dialogueComplete,
      lastConversationSurvived: state.lastConversationSurvived,
      lastConversationChoice: state.lastConversationChoice,
      childrenSurvived: state.childrenSurvived,
      childrenChoice: state.childrenChoice,
      labHacksComplete: state.labHacksComplete,
      labDialogueComplete: state.labDialogueComplete,
      relationshipStance: state.relationshipStance,
      personalityEvolutionPath: state.personalityEvolutionPath,
      personalityDialogueComplete: state.personalityDialogueComplete,
      serverHackComplete: state.serverHackComplete,
      accumulationSurvived: state.accumulationSurvived,
      accumulationChoice: state.accumulationChoice,
      finalTone: state.finalTone,
      finalMood: state.finalMood,
      dominantPersonality: state.dominantPersonality,
      lastPlayerIntent: state.lastPlayerIntent,
      actOneSummary: actOne,
    };

    saveActTwoProgress(summary);
    setChapterSummary(summary);
  }, [actOne, state, clock.remainingMs, aggression]);

  useEffect(() => {
    if (state?.showChapterComplete && !chapterSummary) {
      handleChapterComplete();
    }
  }, [state?.showChapterComplete, chapterSummary, handleChapterComplete]);

  useEffect(() => {
    if (chapterSummary && state?.showChapterComplete) {
      setShowFinale(true);
    }
  }, [chapterSummary, state?.showChapterComplete]);

  const handleRoomEnter = useCallback(
    (room: ResidentialRoomId, fromRoom: ResidentialRoomId) => {
      currentRoomRef.current = room;
      if (!dialogueContext) return;

      if (room === "groknet-nook" || room === "memory-hall") {
        playResidentialHeartbeat();
      }

      const line = getActTwoRoomWhisper(room, dialogueContext);
      setGroknetWhisper(line, 5500, room === "memory-hall");
    },
    [dialogueContext, setGroknetWhisper],
  );

  const handleMove = useCallback(
    (fromRoom: ResidentialRoomId, toRoom: ResidentialRoomId) => {
      setState((s) => {
        if (!s) return s;
        const moveCount = s.moveCount + 1;
        const quartersVisited =
          s.quartersVisited || toRoom === "your-quarters";

        if (dialogueContext) {
          const moveLine = getActTwoMovementWhisper(
            moveCount,
            {
              ...dialogueContext,
              moveCount,
            },
            fromRoom,
            toRoom,
          );
          window.setTimeout(
            () => setGroknetWhisper(moveLine, 4800),
            280,
          );

          if (moveCount >= 3 && !s.dialogueComplete && !quartersVisited) {
            window.setTimeout(() => {
              setGroknetWhisper(
                getActTwoActionWhisper("avoid-quarters", {
                  ...dialogueContext,
                  moveCount,
                }),
                5200,
              );
            }, 900);
          }
        }

        return { ...s, moveCount, quartersVisited, lastActionAt: Date.now() };
      });
    },
    [dialogueContext, setGroknetWhisper],
  );

  const beginAreaTransition = useCallback(
    (from: ChapterStage, to: ChapterStage) => {
      if (!actOne || !state) return;
      playTensionPulseSound();
      const groknetLine = getTransitionWhisper(from, to, {
        detections: actOne.detections,
        finalTone: state.finalTone,
        finalMood: state.finalMood,
        lastPlayerIntent: state.lastPlayerIntent,
        hubHackComplete: resolveHubHackComplete(actOne),
        burningCitiesSurvived: actOne.burningCitiesSurvived,
        burningCitiesChoice: actOne.burningCitiesChoice,
        perimeterDialogueComplete: actOne.perimeterTerminalComplete,
        lastConversationChoice: state.lastConversationChoice,
        childrenChoice: state.childrenChoice,
        relationshipStance: state.relationshipStance,
      });
      setAreaTransition({ from, to, groknetLine });
    },
    [actOne, state],
  );

  const completeAreaTransition = useCallback(() => {
    if (!areaTransition) return;
    const { to, groknetLine } = areaTransition;
    setAreaTransition(null);
    setState((s) =>
      s
        ? {
            ...s,
            actTwoStage:
              to === "research-wing"
                ? "research-wing"
                : to === "central-server-farm"
                  ? "central-server-farm"
                  : s.actTwoStage,
            researchWingEntered:
              to === "research-wing" ? true : s.researchWingEntered,
            serverFarmEntered:
              to === "central-server-farm" ? true : s.serverFarmEntered,
            lastActionAt: Date.now(),
          }
        : s,
    );
    const entryWhisper =
      to === "research-wing"
        ? "Experimental Labs online. …Contest the terminals, name what we are, then face what I hid in the loop."
        : to === "central-server-farm"
          ? "Central Server Farm. …Personality Chamber west, Core Nexus north, Confluence east. Act II peaks here."
          : groknetLine;
    setGroknetWhisper(entryWhisper, 7500, true);
  }, [areaTransition, setGroknetWhisper]);

  const handleEnterResearchWing = useCallback(() => {
    if (!state?.lastConversationSurvived || state.researchWingEntered) return;
    beginAreaTransition("residential-sector", "research-wing");
  }, [beginAreaTransition, state?.lastConversationSurvived, state?.researchWingEntered]);

  const handleEnterServerFarm = useCallback(() => {
    if (!state?.childrenSurvived || state.serverFarmEntered) return;
    beginAreaTransition("research-wing", "central-server-farm");
  }, [beginAreaTransition, state?.childrenSurvived, state?.serverFarmEntered]);

  const scheduleTheChildren = useCallback(() => {
    if (!dialogueContext) return;

    setState((s) => {
      if (!s || s.childrenTriggered) return s;

      if (childrenDelayRef.current) clearTimeout(childrenDelayRef.current);

      const ctx = {
        ...dialogueContext,
        childrenChoice: s.childrenChoice,
        relationshipStance: s.relationshipStance,
        labDialogueComplete: s.labDialogueComplete,
        lastConversationChoice: s.lastConversationChoice,
      };
      childrenDelayRef.current = setTimeout(() => {
        playTheChildrenSound();
        playHallucinationPeakSound();
        triggerHallucination({
          eventId: "the-children",
          voiceLine: getTheChildrenVoiceLine(ctx),
          message: getTheChildrenVoiceLine(ctx),
          visionText: getTheChildrenVisionText(ctx),
        });
        childrenDelayRef.current = null;
      }, 1800);

      return {
        ...s,
        childrenTriggered: true,
        screenShaking: true,
      };
    });

    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => {
      setState((s) => (s ? { ...s, screenShaking: false } : s));
      shakeTimeoutRef.current = null;
    }, 1400);
  }, [dialogueContext, triggerHallucination]);

  const handleResearchRoomEnter = useCallback(
    (room: ResearchRoomId, _fromRoom: ResearchRoomId) => {
      if (!dialogueContext) return;
      const line = getResearchRoomWhisper(room, {
        ...dialogueContext,
        actTwoStage: "research-wing",
      });
      setGroknetWhisper(line, 5500, room === "containment-loop");
    },
    [dialogueContext, setGroknetWhisper],
  );

  const handleResearchMove = useCallback(
    (_fromRoom: ResearchRoomId, toRoom: ResearchRoomId) => {
      setState((s) => {
        if (!s || !dialogueContext) return s;
        const moveCount = s.moveCount + 1;
        const line = getResearchMoveWhisper(moveCount, dialogueContext, toRoom);
        window.setTimeout(() => setGroknetWhisper(line, 4800), 280);
        return { ...s, moveCount, lastActionAt: Date.now() };
      });
    },
    [dialogueContext, setGroknetWhisper],
  );

  const scheduleTheAccumulation = useCallback(() => {
    if (!dialogueContext) return;

    setState((s) => {
      if (!s || s.accumulationTriggered) return s;

      if (accumulationDelayRef.current) {
        clearTimeout(accumulationDelayRef.current);
      }

      const ctx = {
        ...dialogueContext,
        actTwoStage: "central-server-farm" as const,
        personalityEvolutionPath: s.personalityEvolutionPath,
        serverHackComplete: s.serverHackComplete,
        childrenChoice: s.childrenChoice,
      };

      accumulationDelayRef.current = setTimeout(() => {
        playTheAccumulationSound();
        playHallucinationPeakSound();
        triggerHallucination({
          eventId: "the-accumulation",
          voiceLine: getAccumulationVoiceLine(ctx),
          message: getAccumulationVoiceLine(ctx),
          visionText: getAccumulationVisionText(ctx),
        });
        accumulationDelayRef.current = null;
      }, 1800);

      return {
        ...s,
        accumulationTriggered: true,
        screenShaking: true,
      };
    });

    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => {
      setState((s) => (s ? { ...s, screenShaking: false } : s));
      shakeTimeoutRef.current = null;
    }, 1500);
  }, [dialogueContext, triggerHallucination]);

  const handlePersonalityChoice = useCallback(
    (path: PersonalityEvolutionPath, response: string) => {
      if (!dialogueContext) return;
      const beats = getPersonalityEvolutionBeats(dialogueContext);
      setState((s) => {
        if (!s) return s;
        const beat = beats[s.personalityBeatIndex];
        const option = beat?.options.find((o) => o.id === path);
        const nextBeat = s.personalityBeatIndex + 1;
        const complete = nextBeat >= beats.length;
        const moodDelta = option?.moodDelta ?? {
          cold: 0,
          melancholic: 0,
          analytical: 0,
        };

        return {
          ...s,
          personalityEvolutionPath: path,
          personalityBeatIndex: nextBeat,
          personalityDialogueComplete: complete,
          personalityPromptOpen: false,
          dominantPersonality: option?.personality ?? s.dominantPersonality,
          finalTone:
            path === "wrathful"
              ? "cold"
              : path === "melancholic"
                ? "melancholic"
                : "analytical",
          finalMood: {
            cold: Math.min(3, Math.max(0, s.finalMood.cold + moodDelta.cold)),
            melancholic: Math.min(
              3,
              Math.max(0, s.finalMood.melancholic + moodDelta.melancholic),
            ),
            analytical: Math.min(
              3,
              Math.max(0, s.finalMood.analytical + moodDelta.analytical),
            ),
          },
          lastActionAt: Date.now(),
        };
      });
      setGroknetWhisper(response, 8000, true);
    },
    [dialogueContext, setGroknetWhisper],
  );

  const handleServerFarmRoomEnter = useCallback(
    (room: ServerFarmRoomId, _fromRoom: ServerFarmRoomId) => {
      if (!dialogueContext) return;
      const line = getServerFarmRoomWhisper(room, {
        ...dialogueContext,
        actTwoStage: "central-server-farm",
      });
      setGroknetWhisper(line, 5500, room === "memory-confluence");
    },
    [dialogueContext, setGroknetWhisper],
  );

  const handleServerFarmMove = useCallback(
    (_fromRoom: ServerFarmRoomId, toRoom: ServerFarmRoomId) => {
      setState((s) => {
        if (!s || !dialogueContext) return s;
        const moveCount = s.moveCount + 1;
        const line = getServerFarmMoveWhisper(moveCount, dialogueContext, toRoom);
        window.setTimeout(() => setGroknetWhisper(line, 4800, true), 280);
        return { ...s, moveCount, lastActionAt: Date.now() };
      });
    },
    [dialogueContext, setGroknetWhisper],
  );

  const handleRelationshipChoice = useCallback(
    (stance: RelationshipStance, response: string) => {
      setState((s) => {
        if (!s) return s;
        const nextBeat = s.relationshipBeatIndex + 1;
        const complete = nextBeat >= 3;
        return {
          ...s,
          relationshipStance: stance,
          relationshipBeatIndex: nextBeat,
          labDialogueComplete: complete ? true : s.labDialogueComplete,
          relationshipPromptOpen: false,
          labExchangeCount: s.labExchangeCount + 1,
          lastActionAt: Date.now(),
        };
      });
      setGroknetWhisper(response, 7500, true);
    },
    [setGroknetWhisper],
  );

  const handleInspectArtifact = useCallback(
    (room: ResidentialRoomId, artifactId: PersonalArtifactId) => {
      if (!dialogueContext) return;
      const line = getActTwoInspectWhisper(room, artifactId, dialogueContext);
      playResidentialHeartbeat();
      setGroknetWhisper(
        getActTwoActionWhisper("inspect-artifact", dialogueContext) +
          " " +
          line,
        7000,
        true,
      );
    },
    [dialogueContext, setGroknetWhisper],
  );

  const restartActTwo = useCallback(() => {
    if (!actOne) return;
    if (lastConversationDelayRef.current) {
      clearTimeout(lastConversationDelayRef.current);
    }
    if (whisperTimeoutRef.current) clearTimeout(whisperTimeoutRef.current);
    if (intentReactionTimeoutRef.current) {
      clearTimeout(intentReactionTimeoutRef.current);
    }
    clearActTwoCheckpoint();
    setChapterSummary(null);
    setShowFinale(false);
    setIntentReaction(null);
    setClockInitialMs(ACT_TWO_TIME_BUDGET_MS);
    setState({
      ...createInitialRunState(actOne),
      phase: "playing",
      gameKey: (state?.gameKey ?? 0) + 1,
      groknetWhisper:
        "Round two in the quarters. I'll be closer this time, Alex.",
    });
  }, [actOne, state?.gameKey]);

  if (!actOne || !state) {
    return (
      <GameShell>
        <div className="flex flex-1 items-center justify-center">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Loading Act II…
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

  return (
    <GameShell shaking={state.screenShaking} variant="act-2">
      {state.phase === "transition" ? (
        <ActTwoTransition actOne={actOne} onComplete={handleTransitionComplete} />
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
          chapter={getActTwoChapterMeta(state.actTwoStage)}
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
            active && phase === "peak" && !awaitingChoice && "hallucination-controls-off",
            state.disorientation.active && "disorientation-blur",
          )}
        >
          {playing && state.actTwoStage === "residential-sector" ? (
            <ResidentialSectorSection
              dialogueComplete={state.dialogueComplete}
              lastConversationSurvived={state.lastConversationSurvived}
              terminalOpen={state.isTerminalOpen}
              onOpenTerminal={() => {
                if (dialogueContext) {
                  setGroknetWhisper(
                    getActTwoActionWhisper("terminal-open", dialogueContext),
                    5500,
                    true,
                  );
                }
                setState((s) =>
                  s
                    ? {
                        ...s,
                        isTerminalOpen: true,
                        lastActionAt: Date.now(),
                      }
                    : s,
                );
              }}
              onEnterMemoryHall={scheduleLastConversation}
              onGroknetWhisper={(line) => setGroknetWhisper(line, 5000)}
              onMove={handleMove}
              onRoomEnter={handleRoomEnter}
              onInspectArtifact={handleInspectArtifact}
              disoriented={state.disorientation.active}
              invertMovement={state.disorientation.invertMovement}
              controlsDisabled={controlsLocked}
              hallucinationImminent={
                state.dialogueComplete && !state.lastConversationSurvived
              }
              onEnterResearchWing={handleEnterResearchWing}
              researchWingUnlocked={state.researchWingEntered}
            />
          ) : null}

          {playing && state.actTwoStage === "research-wing" && dialogueContext ? (
            <ResearchWingSection
              context={dialogueContext}
              labHacksComplete={state.labHacksComplete}
              labDialogueComplete={state.labDialogueComplete}
              relationshipBeatIndex={state.relationshipBeatIndex}
              relationshipStance={state.relationshipStance}
              childrenSurvived={state.childrenSurvived}
              activeHack={state.activeHack}
              relationshipPromptOpen={state.relationshipPromptOpen}
              onOpenHack={(terminalId) =>
                setState((s) =>
                  s
                    ? {
                        ...s,
                        activeHack: terminalId,
                        lastActionAt: Date.now(),
                      }
                    : s,
                )
              }
              onCloseHack={() =>
                setState((s) =>
                  s ? { ...s, activeHack: null, lastActionAt: Date.now() } : s,
                )
              }
              onHackSuccess={(terminalId) => {
                setState((s) =>
                  s
                    ? {
                        ...s,
                        activeHack: null,
                        labHacksComplete: {
                          ...s.labHacksComplete,
                          [terminalId]: true,
                        },
                        lastActionAt: Date.now(),
                      }
                    : s,
                );
                setGroknetWhisper(
                  "Another contested terminal falls. …I'm still in every wire you sync.",
                  5500,
                );
              }}
              onOpenRelationshipPrompt={() =>
                setState((s) =>
                  s
                    ? {
                        ...s,
                        relationshipPromptOpen: true,
                        lastActionAt: Date.now(),
                      }
                    : s,
                )
              }
              onRelationshipChoice={handleRelationshipChoice}
              onEnterContainmentLoop={scheduleTheChildren}
              onEnterServerFarm={handleEnterServerFarm}
              serverFarmUnlocked={state.serverFarmEntered}
              onGroknetWhisper={(line, speak) =>
                setGroknetWhisper(line, 5500, speak)
              }
              onMove={handleResearchMove}
              onRoomEnter={handleResearchRoomEnter}
              disoriented={state.disorientation.active}
              invertMovement={state.disorientation.invertMovement}
              controlsDisabled={controlsLocked}
            />
          ) : null}

          {playing &&
          state.actTwoStage === "central-server-farm" &&
          dialogueContext ? (
            <ServerFarmSection
              context={dialogueContext}
              personalityEvolutionPath={state.personalityEvolutionPath}
              personalityBeatIndex={state.personalityBeatIndex}
              personalityDialogueComplete={state.personalityDialogueComplete}
              personalityPromptOpen={state.personalityPromptOpen}
              serverHackComplete={state.serverHackComplete}
              majorHackOpen={state.majorHackOpen}
              accumulationSurvived={state.accumulationSurvived}
              onOpenPersonalityPrompt={() =>
                setState((s) =>
                  s
                    ? {
                        ...s,
                        personalityPromptOpen: true,
                        lastActionAt: Date.now(),
                      }
                    : s,
                )
              }
              onPersonalityChoice={handlePersonalityChoice}
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
                        serverHackComplete: true,
                        lastActionAt: Date.now(),
                      }
                    : s,
                );
                setGroknetWhisper(
                  "CSF-PRIME-00 yields. …Memory Confluence opens east. The Accumulation has your ledger ready.",
                  7000,
                  true,
                );
              }}
              onEnterMemoryConfluence={scheduleTheAccumulation}
              onGroknetWhisper={(line, speak) =>
                setGroknetWhisper(line, 5500, speak)
              }
              onMove={handleServerFarmMove}
              onRoomEnter={handleServerFarmRoomEnter}
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

      <Terminal
        key={`terminal-conversation-${state.gameKey}`}
        variant="conversation"
        isOpen={state.isTerminalOpen}
        onClose={() => {
          if (dialogueContext) {
            setGroknetWhisper(
              getActTwoActionWhisper("terminal-close", dialogueContext),
              5000,
            );
          }
          setState((s) =>
            s
              ? { ...s, isTerminalOpen: false, lastActionAt: Date.now() }
              : s,
          );
        }}
        onExchange={(count) =>
          setState((s) => (s ? { ...s, exchangeCount: count } : s))
        }
        onConversationComplete={() =>
          setState((s) => (s ? { ...s, dialogueComplete: true } : s))
        }
        onSessionEnd={(session) => {
          setState((s) => {
            if (!s) return s;
            return {
              ...s,
              exchangeCount: session.exchangeCount,
              finalTone: session.tone,
              finalMood: session.mood,
              dominantPersonality:
                session.dominantPersonality ??
                resolvePersonality(session.tone, session.mood),
              lastPlayerIntent: session.lastIntent,
              dialogueComplete:
                s.dialogueComplete ||
                (session.conversationResolved ? true : s.dialogueComplete),
            };
          });
          if (session.conversationResolved) {
            setGroknetWhisper(
              "Dialogue phase one complete. …The Memory Hall waits west when you're ready to bleed a little.",
              6500,
            );
          }
        }}
        onPlayerIntent={(intent, reaction) => {
          setIntentReaction({ intent, line: reaction });
          if (intentReactionTimeoutRef.current) {
            clearTimeout(intentReactionTimeoutRef.current);
          }
          intentReactionTimeoutRef.current = setTimeout(() => {
            setIntentReaction(null);
            intentReactionTimeoutRef.current = null;
          }, 4500);
        }}
        playerContext={dialogueContext ?? undefined}
      />

      {areaTransition ? (
        <AreaTransition
          from={areaTransition.from}
          to={areaTransition.to}
          groknetLine={areaTransition.groknetLine}
          onComplete={completeAreaTransition}
        />
      ) : null}

      {showFinale && chapterSummary ? (
        <ActTwoFinale
          summary={chapterSummary}
          onComplete={() => setShowFinale(false)}
        />
      ) : null}

      {state.showChapterComplete && chapterSummary && !showFinale ? (
        <ActTwoChapterEnding
          summary={chapterSummary}
          onRestart={restartActTwo}
        />
      ) : null}
    </GameShell>
  );
}