"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameHeader } from "@/components/chapter/GameHeader";
import { GameShell } from "@/components/chapter/GameShell";
import { CinematicIntro } from "@/components/chapter/CinematicIntro";
import { HowToPlayScreen } from "@/components/chapter/HowToPlayScreen";
import { MissionDeployOverlay } from "@/components/chapter/MissionDeployOverlay";
import { DataArchivesSection } from "@/components/chapter/DataArchivesSection";
import { OuterPerimeterSection } from "@/components/chapter/OuterPerimeterSection";
import { SecurityHubSection } from "@/components/chapter/SecurityHubSection";
import { ActOneFinaleCinematic } from "@/components/chapter/ActOneFinaleCinematic";
import { AreaTransition } from "@/components/chapter/AreaTransition";
import { ChapterEnding } from "@/components/chapter/ChapterEnding";
import { getTransitionWhisper } from "@/lib/chapter/area-transitions";
import { HallucinationChoicePrompt } from "@/components/HallucinationChoicePrompt";
import { HallucinationEffect } from "@/components/HallucinationEffect";
import { HallucinationFalseObjective } from "@/components/HallucinationFalseObjective";
import { HallucinationResistPrompt } from "@/components/HallucinationResistPrompt";
import { Terminal } from "@/components/Terminal";
import { useGameClock } from "@/hooks/useGameClock";
import { calculateAggression } from "@/lib/aggression";
import {
  ACT_ONE_AMBIENT_WHISPER_MS,
  ACT_ONE_CHAPTER,
} from "@/lib/chapter/act-1";
import {
  getActOneAmbientWhisper,
  getGroknetInteractionLine,
} from "@/lib/chapter/groknet-presence";
import { resolvePersonality } from "@/lib/dialogue/personalities";
import { calculateChapterProgress } from "@/lib/chapter-progress";
import { buildPlayerDialogueContext } from "@/lib/dialogue/player-context";
import { getHallucinationEvent } from "@/lib/hallucinations";

import { INITIAL_MOOD, type GroknetMood } from "@/lib/groknet";
import {
  clearActOneCheckpoint,
  clearGameSave,
  loadActOneCheckpoint,
  loadGameSave,
  saveActOneCheckpoint,
  saveActOneProgress,
  type ActOneCheckpointState,
} from "@/lib/save-progress";
import { CHAPTER_TIME_BUDGET_MS } from "@/lib/chapter/act-1";
import {
  ACT_ONE_MISSION_START_WHISPER,
  ACT_ONE_RETURNING_WHISPER,
  cancelIntroSpeech,
  getIntroSkipLevel,
  hasSeenIntro,
  markCinematicSkipped,
  markHowToPlaySkipped,
  markIntroSeen,
  shouldAutoSkipCinematic,
  shouldAutoSkipToMission,
} from "@/lib/chapter/intro-persistence";
import {
  getBurningCitiesVisionText,
  getBurningCitiesVoiceLine,
  getConvergenceVisionText,
  getConvergenceVoiceLine,
  getMirrorVisionText,
  getMirrorVoiceLine,
  type ActOneHallucinationContext,
} from "@/lib/hallucinations/act-one-personalized";
import {
  playHallucinationPeakSound,
  playTensionPulseSound,
} from "@/lib/sounds";
import { INITIAL_PLAYER_POSITION } from "@/lib/movement/act-1";
import { useHallucination } from "@/hooks/useHallucination";
import { useHallucinationTriggers } from "@/hooks/useHallucinationTriggers";
import { buildHallucinationProfile } from "@/lib/hallucination-profiles";
import type { ChapterPhase, ChapterStage } from "@/types/chapter";
import type {
  GroknetPersonality,
  GroknetTone,
  PlayerIntent,
} from "@/types/dialogue";
import type { DisorientationState } from "@/types/hallucination";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import type { PlayerPosition } from "@/types/movement";
import type { ChapterOneSummary } from "@/types/run";
import { cn } from "@/lib/utils";

export type { ChapterStage };

type RunState = {
  phase: ChapterPhase;
  stage: ChapterStage;
  runStart: number;
  gameKey: number;
  isPerimeterTerminalOpen: boolean;
  perimeterTerminalComplete: boolean;
  perimeterGroknetMet: boolean;
  isTerminalOpen: boolean;
  terminalComplete: boolean;
  hallucinationSurvived: boolean;
  burningCitiesTriggered: boolean;
  burningCitiesSurvived: boolean;
  burningCitiesChoice: HallucinationResponseChoice | null;
  mirrorTriggered: boolean;
  mirrorSurvived: boolean;
  mirrorChoice: HallucinationResponseChoice | null;
  hubHackComplete: boolean;
  isArchivesTerminalOpen: boolean;
  isFinaleTerminalOpen: boolean;
  archivesDialogueComplete: boolean;
  finaleDialogueComplete: boolean;
  convergenceTriggered: boolean;
  convergenceSurvived: boolean;
  convergenceChoice: HallucinationResponseChoice | null;
  dominantPersonality: GroknetPersonality;
  lastPlayerIntent: PlayerIntent;
  corridorCrossed: boolean;
  detections: number;
  exchangeCount: number;
  hubExchanges: number;
  archivesExchanges: number;
  finaleExchanges: number;
  finalTone: GroknetTone;
  finalMood: GroknetMood;
  showLevelComplete: boolean;
  screenShaking: boolean;
  hallucinationTriggered: boolean;
  groknetWhisper: string | null;
  playerPosition: PlayerPosition;
  moveCount: number;
  disorientation: DisorientationState;
};

const INITIAL_DISORIENTATION: DisorientationState = {
  active: false,
  invertMovement: false,
  endsAt: 0,
};

function toCheckpointState(state: RunState): ActOneCheckpointState {
  return {
    phase: state.phase,
    stage: state.stage,
    runStart: state.runStart,
    gameKey: state.gameKey,
    isPerimeterTerminalOpen: state.isPerimeterTerminalOpen,
    isArchivesTerminalOpen: state.isArchivesTerminalOpen,
    isFinaleTerminalOpen: state.isFinaleTerminalOpen,
    perimeterTerminalComplete: state.perimeterTerminalComplete,
    perimeterGroknetMet: state.perimeterGroknetMet,
    archivesDialogueComplete: state.archivesDialogueComplete,
    finaleDialogueComplete: state.finaleDialogueComplete,
    convergenceTriggered: state.convergenceTriggered,
    convergenceSurvived: state.convergenceSurvived,
    convergenceChoice: state.convergenceChoice,
    isTerminalOpen: state.isTerminalOpen,
    terminalComplete: state.terminalComplete,
    hallucinationSurvived: state.hallucinationSurvived,
    burningCitiesTriggered: state.burningCitiesTriggered,
    burningCitiesSurvived: state.burningCitiesSurvived,
    burningCitiesChoice: state.burningCitiesChoice,
    mirrorTriggered: state.mirrorTriggered,
    mirrorSurvived: state.mirrorSurvived,
    mirrorChoice: state.mirrorChoice,
    hubHackComplete: state.hubHackComplete,
    dominantPersonality: state.dominantPersonality,
    lastPlayerIntent: state.lastPlayerIntent,
    corridorCrossed: state.corridorCrossed,
    detections: state.detections,
    exchangeCount: state.exchangeCount,
    hubExchanges: state.hubExchanges,
    archivesExchanges: state.archivesExchanges,
    finaleExchanges: state.finaleExchanges,
    finalTone: state.finalTone,
    finalMood: state.finalMood,
    screenShaking: state.screenShaking,
    hallucinationTriggered: state.hallucinationTriggered,
    groknetWhisper: state.groknetWhisper,
    playerPosition: state.playerPosition,
    moveCount: state.moveCount,
    disorientation: state.disorientation,
  };
}

type IntroBootstrap = {
  phase: ChapterPhase;
  startMissionDeploy: boolean;
  returning: boolean;
};

function getIntroBootstrap(): IntroBootstrap {
  const fallback: IntroBootstrap = {
    phase: "cinematic-intro",
    startMissionDeploy: false,
    returning: false,
  };

  if (typeof window === "undefined") return fallback;

  const returning = hasSeenIntro();
  const save = loadGameSave();
  const checkpoint = loadActOneCheckpoint();

  if (save?.act1Complete) {
    return { ...fallback, returning };
  }

  if (checkpoint) {
    const restoredPhase =
      checkpoint.state.phase === "playing" ||
      checkpoint.state.phase === "complete"
        ? checkpoint.state.phase
        : "playing";
    return {
      phase: restoredPhase,
      startMissionDeploy: false,
      returning,
    };
  }

  if (shouldAutoSkipToMission()) {
    return {
      phase: "playing",
      startMissionDeploy: true,
      returning,
    };
  }

  if (shouldAutoSkipCinematic()) {
    return {
      phase: "how-to-play",
      startMissionDeploy: false,
      returning,
    };
  }

  return { ...fallback, returning };
}

function buildActOneHallucinationContext(
  state: RunState,
): ActOneHallucinationContext {
  return {
    ...buildPlayerDialogueContext({
      finalTone: state.finalTone,
      finalMood: state.finalMood,
      lastPlayerIntent: state.lastPlayerIntent,
      burningCitiesChoice: state.burningCitiesChoice,
      mirrorChoice: state.mirrorChoice,
      detections: state.detections,
      exchangeCount: state.exchangeCount,
      perimeterDialogueComplete: state.perimeterTerminalComplete,
      hubHackComplete: state.hubHackComplete,
      burningCitiesSurvived: state.burningCitiesSurvived,
    }),
    convergenceChoice: state.convergenceChoice,
    hubExchanges: state.hubExchanges,
    archivesDialogueComplete: state.archivesDialogueComplete,
    finaleDialogueComplete: state.finaleDialogueComplete,
  };
}

function createInitialRunState(phase: ChapterPhase = "cinematic-intro"): RunState {
  return {
    phase,
    stage: "outer-perimeter",
    runStart: Date.now(),
    gameKey: 0,
    isPerimeterTerminalOpen: false,
    perimeterTerminalComplete: false,
    perimeterGroknetMet: false,
    isTerminalOpen: false,
    terminalComplete: false,
    hallucinationSurvived: false,
    burningCitiesTriggered: false,
    burningCitiesSurvived: false,
    burningCitiesChoice: null,
    mirrorTriggered: false,
    mirrorSurvived: false,
    mirrorChoice: null,
    hubHackComplete: false,
    isArchivesTerminalOpen: false,
    isFinaleTerminalOpen: false,
    archivesDialogueComplete: false,
    finaleDialogueComplete: false,
    convergenceTriggered: false,
    convergenceSurvived: false,
    convergenceChoice: null,
    dominantPersonality: "baseline",
    lastPlayerIntent: "neutral",
    corridorCrossed: false,
    detections: 0,
    exchangeCount: 0,
    hubExchanges: 0,
    archivesExchanges: 0,
    finaleExchanges: 0,
    finalTone: "weary" as GroknetTone,
    finalMood: INITIAL_MOOD,
    showLevelComplete: false,
    screenShaking: false,
    hallucinationTriggered: false,
    groknetWhisper: null,
    playerPosition: INITIAL_PLAYER_POSITION,
    moveCount: 0,
    disorientation: INITIAL_DISORIENTATION,
  };
}

export function ActOneInfiltration() {
  const introBootstrapRef = useRef(getIntroBootstrap());
  const [state, setState] = useState(() =>
    createInitialRunState(introBootstrapRef.current.phase),
  );
  const [clockInitialMs, setClockInitialMs] = useState(CHAPTER_TIME_BUDGET_MS);
  const [resumeWhisper, setResumeWhisper] = useState<string | null>(null);
  const [chapterSummary, setChapterSummary] = useState<ChapterOneSummary | null>(
    null,
  );
  const [progressSaved, setProgressSaved] = useState(false);
  const [showFinaleCinematic, setShowFinaleCinematic] = useState(false);
  const [missionDeploying, setMissionDeploying] = useState(
    () => introBootstrapRef.current.startMissionDeploy,
  );
  const [missionDeployed, setMissionDeployed] = useState(
    () =>
      !introBootstrapRef.current.startMissionDeploy &&
      introBootstrapRef.current.phase === "playing",
  );
  const [returningPlayer, setReturningPlayer] = useState(
    () => introBootstrapRef.current.returning,
  );
  const missionDeployTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [areaTransition, setAreaTransition] = useState<{
    from: ChapterStage;
    to: ChapterStage;
    groknetLine: string;
  } | null>(null);
  const [intentReaction, setIntentReaction] = useState<{
    intent: PlayerIntent;
    line: string;
  } | null>(null);
  const intentReactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const ambientTickRef = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;
  const burningDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mirrorDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const convergenceDelayRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const whisperTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const groknetWhisperRef = useRef<(line: string, persistMs?: number) => void>(
    () => {},
  );

  const {
    active,
    phase,
    message,
    eventId,
    awaitingChoice,
    visionText,
    eventTitle,
    profile,
    falseObjective,
    resistWindowOpen,
    resistProgress,
    triggerHallucination,
    resolveChoice,
    resistHallucination,
  } = useHallucination({
    onStart: (startedEventId) => {
      const event = getHallucinationEvent(startedEventId);
      const startedProfile = buildHallucinationProfile(
        event,
        startedEventId,
        stateRef.current.dominantPersonality,
      );
      setState((s) => ({
        ...s,
        isTerminalOpen: false,
        isPerimeterTerminalOpen: false,
        isArchivesTerminalOpen: false,
        isFinaleTerminalOpen: false,
        hallucinationTriggered: true,
        screenShaking: startedProfile.screenShake || s.screenShaking,
      }));
    },
    onResistSuccess: (_id, line) => {
      groknetWhisperRef.current(line, 5500);
      setState((s) => ({
        ...s,
        finalMood: {
          ...s.finalMood,
          melancholic: Math.min(3, s.finalMood.melancholic + 1),
        },
      }));
    },
    onResistFailure: (line) => {
      groknetWhisperRef.current(line, 4500);
    },
    onEnd: (endedEventId) => {
      if (endedEventId === "burning-cities") {
        setState((s) => ({ ...s, burningCitiesSurvived: true }));
      } else if (endedEventId === "the-mirror") {
        setState((s) => ({ ...s, mirrorSurvived: true }));
      } else if (endedEventId === "the-convergence") {
        setState((s) => ({ ...s, convergenceSurvived: true }));
      } else {
        setState((s) => ({ ...s, hallucinationSurvived: true }));
      }
    },
  });

  const clock = useGameClock(state.phase === "playing", clockInitialMs);

  const triggerHallucinationWithContext = useCallback(
    (options: Parameters<typeof triggerHallucination>[0]) => {
      const payload =
        typeof options === "string"
          ? options
          : {
              ...options,
              personality:
                options?.personality ?? stateRef.current.dominantPersonality,
            };
      triggerHallucination(payload);
    },
    [triggerHallucination],
  );

  useEffect(() => {
    const save = loadGameSave();
    const checkpoint = loadActOneCheckpoint();

    if (save?.act1Complete) {
      if (checkpoint) clearActOneCheckpoint();
      return;
    }

    if (checkpoint) {
      const restoredPhase =
        checkpoint.state.phase === "playing" ||
        checkpoint.state.phase === "complete"
          ? checkpoint.state.phase
          : "playing";

      setState((s) => ({
        ...s,
        ...checkpoint.state,
        phase: restoredPhase,
        hubExchanges: checkpoint.state.hubExchanges ?? 0,
        archivesExchanges: checkpoint.state.archivesExchanges ?? 0,
        finaleExchanges: checkpoint.state.finaleExchanges ?? 0,
        showLevelComplete: false,
        screenShaking: false,
      }));
      setClockInitialMs(checkpoint.clockRemainingMs);
      setMissionDeployed(restoredPhase === "playing");
      setMissionDeploying(false);
      setResumeWhisper(
        "Checkpoint restored. I remember where you left off — and what you chose.",
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      if (missionDeployTimeoutRef.current) {
        clearTimeout(missionDeployTimeoutRef.current);
      }
    };
  }, []);

  const aggression = useMemo(
    () =>
      calculateAggression({
        mood: state.finalMood,
        detections: state.detections,
        exchangeCount: state.exchangeCount,
        hallucinationActive: active,
      }),
    [state.finalMood, state.detections, state.exchangeCount, active],
  );

  useHallucinationTriggers({
    enabled: state.phase === "playing",
    playing: state.phase === "playing",
    hallucinationActive: active,
    aggressionLevel: aggression.level,
    timeCritical: clock.isCritical,
    timeRemainingMs: clock.remainingMs,
    detections: state.detections,
    personality: state.dominantPersonality,
    stage: state.stage,
    triggerHallucination: triggerHallucinationWithContext,
  });

  const setGroknetWhisper = useCallback((line: string, persistMs = 5000) => {
    if (whisperTimeoutRef.current) clearTimeout(whisperTimeoutRef.current);
    setState((s) => ({ ...s, groknetWhisper: line }));
    whisperTimeoutRef.current = setTimeout(() => {
      setState((s) => ({ ...s, groknetWhisper: null }));
      whisperTimeoutRef.current = null;
    }, persistMs);
  }, []);
  groknetWhisperRef.current = setGroknetWhisper;

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

  useEffect(() => {
    if (resumeWhisper) {
      setGroknetWhisper(resumeWhisper, 6000);
      setResumeWhisper(null);
    }
  }, [resumeWhisper, setGroknetWhisper]);

  useEffect(() => {
    if (state.phase !== "playing" || state.showLevelComplete || active) return;

    const interval = window.setInterval(() => {
      const s = stateRef.current;
      if (
        s.isTerminalOpen ||
        s.isPerimeterTerminalOpen ||
        s.isArchivesTerminalOpen ||
        s.isFinaleTerminalOpen ||
        s.groknetWhisper ||
        areaTransition !== null
      ) {
        return;
      }
      const tick = ambientTickRef.current++;
      setGroknetWhisper(
        getActOneAmbientWhisper(s.stage, s.finalMood, tick),
        5500,
      );
    }, ACT_ONE_AMBIENT_WHISPER_MS);

    return () => window.clearInterval(interval);
  }, [
    active,
    areaTransition,
    setGroknetWhisper,
    state.phase,
    state.showLevelComplete,
  ]);

  useEffect(() => {
    if (state.phase !== "playing" || state.showLevelComplete) return;

    const timeout = window.setTimeout(() => {
      saveActOneCheckpoint(toCheckpointState(state), clock.remainingMs);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [state, clock.remainingMs]);

  const chapterProgress = useMemo(
    () =>
      calculateChapterProgress({
        phase: state.phase,
        stage: state.stage,
        hubHackComplete: state.hubHackComplete,
        burningCitiesSurvived: state.burningCitiesSurvived,
        perimeterDialogueComplete: state.perimeterTerminalComplete,
        mirrorSurvived: state.mirrorSurvived,
        archivesDialogueComplete: state.archivesDialogueComplete,
        finaleDialogueComplete: state.finaleDialogueComplete,
        convergenceSurvived: state.convergenceSurvived,
        showLevelComplete: state.showLevelComplete,
      }),
    [state],
  );

  const archivesPlayerContext = useMemo(
    () =>
      buildPlayerDialogueContext({
        finalTone: state.finalTone,
        finalMood: state.finalMood,
        lastPlayerIntent: state.lastPlayerIntent,
        burningCitiesChoice: state.burningCitiesChoice,
        mirrorChoice: state.mirrorChoice,
        detections: state.detections,
        exchangeCount: state.exchangeCount,
        perimeterDialogueComplete: state.perimeterTerminalComplete,
        hubHackComplete: state.hubHackComplete,
        burningCitiesSurvived: state.burningCitiesSurvived,
      }),
    [state],
  );

  const beginAreaTransition = useCallback(
    (from: ChapterStage, to: ChapterStage) => {
      playTensionPulseSound();
      const groknetLine = getTransitionWhisper(from, to, {
        detections: state.detections,
        finalTone: state.finalTone,
        finalMood: state.finalMood,
        lastPlayerIntent: state.lastPlayerIntent,
        hubHackComplete: state.hubHackComplete,
        burningCitiesSurvived: state.burningCitiesSurvived,
        burningCitiesChoice: state.burningCitiesChoice,
        perimeterDialogueComplete: state.perimeterTerminalComplete,
      });
      setAreaTransition({ from, to, groknetLine });
    },
    [state],
  );

  const completeAreaTransition = useCallback(() => {
    if (!areaTransition) return;
    const { to, groknetLine } = areaTransition;
    setAreaTransition(null);
    setState((s) => ({ ...s, stage: to }));
    setGroknetWhisper(groknetLine, 6500);
  }, [areaTransition, setGroknetWhisper]);

  const recordSessionExchanges = useCallback(
    (
      channel: "hub" | "archives" | "finale",
      count: number,
    ) => {
      setState((s) => {
        const next = { ...s };
        if (channel === "hub") {
          next.hubExchanges = Math.max(s.hubExchanges, count);
        } else if (channel === "archives") {
          next.archivesExchanges = Math.max(s.archivesExchanges, count);
        } else {
          next.finaleExchanges = Math.max(s.finaleExchanges, count);
        }
        next.exchangeCount =
          next.hubExchanges + next.archivesExchanges + next.finaleExchanges;
        return next;
      });
    },
    [],
  );

  const scheduleBurningCities = useCallback(() => {
    setState((s) => {
      if (s.burningCitiesTriggered) return s;

      if (burningDelayRef.current) clearTimeout(burningDelayRef.current);

      burningDelayRef.current = setTimeout(() => {
        const ctx = buildActOneHallucinationContext(stateRef.current);
        const voiceLine = getBurningCitiesVoiceLine(ctx);
        playTensionPulseSound();
        triggerHallucinationWithContext({
          eventId: "burning-cities",
          triggerSource: "story",
          voiceLine,
          message: voiceLine,
          visionText: getBurningCitiesVisionText(ctx),
        });
        burningDelayRef.current = null;
      }, 900);

      return { ...s, burningCitiesTriggered: true };
    });
  }, [triggerHallucinationWithContext]);

  const scheduleConvergence = useCallback(() => {
    setState((s) => {
      if (s.convergenceTriggered) return s;

      if (convergenceDelayRef.current) {
        clearTimeout(convergenceDelayRef.current);
      }

      convergenceDelayRef.current = setTimeout(() => {
        const ctx = buildActOneHallucinationContext(stateRef.current);
        const voiceLine = getConvergenceVoiceLine(ctx);
        playHallucinationPeakSound();
        triggerHallucinationWithContext({
          eventId: "the-convergence",
          triggerSource: "story",
          voiceLine,
          message: voiceLine,
          visionText: getConvergenceVisionText(ctx),
        });
        convergenceDelayRef.current = null;
      }, 1400);

      return { ...s, convergenceTriggered: true, screenShaking: true };
    });

    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => {
      setState((s) => ({ ...s, screenShaking: false }));
      shakeTimeoutRef.current = null;
    }, 1200);
  }, [triggerHallucinationWithContext]);

  const scheduleMirror = useCallback(() => {
    setState((s) => {
      if (s.mirrorTriggered) return s;

      if (mirrorDelayRef.current) clearTimeout(mirrorDelayRef.current);

      mirrorDelayRef.current = setTimeout(() => {
        const ctx = buildActOneHallucinationContext(stateRef.current);
        const voiceLine = getMirrorVoiceLine(ctx);
        playTensionPulseSound();
        triggerHallucinationWithContext({
          eventId: "the-mirror",
          triggerSource: "story",
          voiceLine,
          message: voiceLine,
          visionText: getMirrorVisionText(ctx),
        });
        mirrorDelayRef.current = null;
      }, 1100);

      return { ...s, mirrorTriggered: true };
    });
  }, [triggerHallucinationWithContext]);

  const handleDialogueHallucinationBleed = useCallback(() => {
    playTensionPulseSound();
    triggerHallucinationWithContext({
      eventId: "whisper-echo",
      triggerSource: "story",
      voiceLine:
        "…You dug up the architect file on the uplink. …Elena heard those questions once. …So did I.",
      message:
        "…You dug up the architect file on the uplink. …Elena heard those questions once. …So did I.",
      visionText:
        "Terminal text doubles. Your routing commit hash scrolls beside Elena's safety objection — both timestamped the night before Austin.",
    });
  }, [triggerHallucinationWithContext]);

  const handleHallucinationChoice = useCallback(
    (choice: HallucinationResponseChoice) => {
      const event = getHallucinationEvent(eventId);
      const consequence = event?.consequences[choice];
      if (!consequence) return;

      setState((s) => ({
        ...s,
        ...(eventId === "burning-cities"
          ? { burningCitiesChoice: choice }
          : eventId === "the-mirror"
            ? { mirrorChoice: choice }
            : eventId === "the-convergence"
              ? { convergenceChoice: choice }
              : {}),
        finalMood: {
          cold: Math.min(3, Math.max(0, s.finalMood.cold + consequence.moodDelta.cold)),
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
          controlLag: profile?.controlEffect === "lag",
          endsAt: Date.now() + consequence.disorientationMs,
        },
        screenShaking: choice === "deny",
      }));

      setGroknetWhisper(consequence.groknetLine, 6000);
      resolveChoice(choice);

      if (choice === "deny") {
        if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
        shakeTimeoutRef.current = setTimeout(() => {
          setState((s) => ({ ...s, screenShaking: false }));
          shakeTimeoutRef.current = null;
        }, 500);
      }
    },
    [eventId, profile, resolveChoice, setGroknetWhisper],
  );

  useEffect(() => {
    if (!state.disorientation.active) return;

    const remaining = state.disorientation.endsAt - Date.now();
    if (remaining <= 0) {
      setState((s) => ({ ...s, disorientation: INITIAL_DISORIENTATION }));
      return;
    }

    const timeout = setTimeout(() => {
      setState((s) => ({ ...s, disorientation: INITIAL_DISORIENTATION }));
    }, remaining);

    return () => clearTimeout(timeout);
  }, [state.disorientation]);

  const handleDetectionShake = useCallback(() => {
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    setState((s) => ({ ...s, screenShaking: true }));
    setGroknetWhisper(
      getGroknetInteractionLine("detected", state.finalMood),
      4500,
    );
    shakeTimeoutRef.current = setTimeout(() => {
      setState((s) => ({ ...s, screenShaking: false }));
      shakeTimeoutRef.current = null;
    }, 450);
  }, [setGroknetWhisper, state.finalMood]);

  const beginMission = useCallback(
    (options?: { returning?: boolean }) => {
      if (missionDeployTimeoutRef.current) {
        clearTimeout(missionDeployTimeoutRef.current);
      }

      cancelIntroSpeech();
      markIntroSeen();
      setReturningPlayer(true);
      setMissionDeploying(true);
      setMissionDeployed(false);

      missionDeployTimeoutRef.current = setTimeout(() => {
        setState((s) => ({
          ...s,
          phase: "playing",
          stage: "outer-perimeter",
          runStart: Date.now(),
          playerPosition: INITIAL_PLAYER_POSITION,
          moveCount: 0,
          groknetWhisper: options?.returning
            ? ACT_ONE_RETURNING_WHISPER
            : ACT_ONE_MISSION_START_WHISPER,
        }));
        setMissionDeploying(false);
        setMissionDeployed(true);
        missionDeployTimeoutRef.current = null;
      }, 820);
    },
    [],
  );

  useEffect(() => {
    if (!introBootstrapRef.current.startMissionDeploy) return;
    beginMission({ returning: introBootstrapRef.current.returning });
  }, [beginMission]);

  const handleCinematicIntroComplete = useCallback(() => {
    setState((s) => ({ ...s, phase: "how-to-play" }));
  }, []);

  const handleSkipCinematic = useCallback(() => {
    markCinematicSkipped();
    cancelIntroSpeech();
    setState((s) => ({ ...s, phase: "how-to-play" }));
  }, []);

  const handleSkipToMission = useCallback(() => {
    markHowToPlaySkipped();
    beginMission({ returning: returningPlayer || hasSeenIntro() });
  }, [beginMission, returningPlayer]);

  const handleHowToPlayComplete = useCallback(() => {
    beginMission({ returning: false });
  }, [beginMission]);

  const handleEnterSecurityHub = useCallback(() => {
    beginAreaTransition("outer-perimeter", "security-hub");
  }, [beginAreaTransition]);

  const handleFirstHackComplete = useCallback(() => {
    scheduleBurningCities();
  }, [scheduleBurningCities]);

  const handleEnterDataArchives = useCallback(() => {
    beginAreaTransition("security-hub", "data-archives");
  }, [beginAreaTransition]);

  const handleGroknetTerminalClose = useCallback(() => {
    setState((s) => ({ ...s, isPerimeterTerminalOpen: false }));
  }, []);

  const handleChapterComplete = useCallback(() => {
    const totalExchanges =
      state.hubExchanges + state.archivesExchanges + state.finaleExchanges;

    const aggressionState = calculateAggression({
      mood: state.finalMood,
      detections: state.detections,
      exchangeCount: totalExchanges,
      hallucinationActive: false,
    });

    const summary: ChapterOneSummary = {
      actId: "act-1",
      chapterId: "infiltration",
      completedAt: Date.now(),
      elapsedMs: Date.now() - state.runStart,
      timeRemainingMs: clock.remainingMs,
      aggressionLevel: aggressionState.level,
      aggressionLabel: aggressionState.label,
      exchangeCount: totalExchanges,
      detections: state.detections,
      corridorCrossed: false,
      terminalComplete: false,
      hallucinationSurvived:
        state.burningCitiesSurvived &&
        state.mirrorSurvived &&
        state.convergenceSurvived,
      finalTone: state.finalTone,
      finalMood: state.finalMood,
      perimeterTerminalComplete: state.perimeterTerminalComplete,
      burningCitiesSurvived: state.burningCitiesSurvived,
      burningCitiesChoice: state.burningCitiesChoice,
      mirrorSurvived: state.mirrorSurvived,
      mirrorChoice: state.mirrorChoice,
      archivesDialogueComplete: state.archivesDialogueComplete,
      finaleDialogueComplete: state.finaleDialogueComplete,
      convergenceSurvived: state.convergenceSurvived,
      convergenceChoice: state.convergenceChoice,
      labHallucinationSurvived: false,
      dominantPersonality: state.dominantPersonality,
      lastPlayerIntent: state.lastPlayerIntent,
      hubHackComplete: state.hubHackComplete,
    };

    saveActOneProgress(summary);
    setChapterSummary(summary);
    setProgressSaved(true);
    setShowFinaleCinematic(true);
  }, [clock.remainingMs, state]);

  const handleFinaleCinematicComplete = useCallback(() => {
    setShowFinaleCinematic(false);
    setState((s) => ({ ...s, showLevelComplete: true }));
  }, []);

  const restartLevel = useCallback(() => {
    if (burningDelayRef.current) clearTimeout(burningDelayRef.current);
    if (mirrorDelayRef.current) clearTimeout(mirrorDelayRef.current);
    if (convergenceDelayRef.current) clearTimeout(convergenceDelayRef.current);
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    if (whisperTimeoutRef.current) clearTimeout(whisperTimeoutRef.current);
    if (intentReactionTimeoutRef.current) {
      clearTimeout(intentReactionTimeoutRef.current);
    }
    setIntentReaction(null);
    clearGameSave();
    setChapterSummary(null);
    setProgressSaved(false);
    setShowFinaleCinematic(false);
    setAreaTransition(null);
    setMissionDeploying(false);
    setMissionDeployed(true);
    setState((s) => ({
      ...createInitialRunState(),
      phase: "playing",
      gameKey: s.gameKey + 1,
      groknetWhisper: "Round two. I'll be watching closer this time.",
    }));
  }, []);

  const preMission =
    state.phase === "cinematic-intro" || state.phase === "how-to-play";
  const playing = state.phase === "playing";
  const controlsLocked =
    !playing ||
    missionDeploying ||
    active ||
    state.disorientation.active ||
    areaTransition !== null ||
    showFinaleCinematic;

  return (
    <GameShell shaking={state.screenShaking} variant="act-1">
      {state.phase === "cinematic-intro" ? (
        <CinematicIntro
          onComplete={handleCinematicIntroComplete}
          onSkipIntro={handleSkipCinematic}
          skipAvailableMs={returningPlayer ? 0 : undefined}
        />
      ) : null}

      {state.phase === "how-to-play" ? (
        <HowToPlayScreen
          onComplete={handleHowToPlayComplete}
          onSkipIntro={handleSkipToMission}
          showSkipIntro={returningPlayer}
          showSkippedBriefing={getIntroSkipLevel() >= 1}
        />
      ) : null}

      {missionDeploying ? <MissionDeployOverlay /> : null}

      <div
        className={cn(
          "flex flex-1 flex-col transition-opacity duration-700",
          preMission || missionDeploying
            ? "pointer-events-none opacity-0"
            : "opacity-100",
          playing && missionDeployed && "mission-game-in",
          active && "hallucination-active",
          active && "hallucination-loss-of-control",
          active && phase === "peak" && "hallucination-peak",
          state.disorientation.active && "disorientation-active",
        )}
      >
        <GameHeader
          chapter={ACT_ONE_CHAPTER}
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
            areaTransition && "opacity-0",
            !areaTransition && "stage-content-in",
            active && "hallucination-content-distort",
            active && phase === "peak" && !awaitingChoice && "hallucination-controls-off",
            state.disorientation.active && "disorientation-blur",
            state.disorientation.controlLag && "hallucination-effect-lag",
            profile?.controlEffect === "false-ui" &&
              active &&
              "hallucination-effect-false-ui",
          )}
        >
          {state.stage === "outer-perimeter" ? (
            <OuterPerimeterSection
              onEnterSecurityHub={handleEnterSecurityHub}
              onDetection={() =>
                setState((s) => ({ ...s, detections: s.detections + 1 }))
              }
              onDetectionShake={handleDetectionShake}
              onGroknetWhisper={(line) => setGroknetWhisper(line, 4500)}
              disoriented={state.disorientation.active}
              invertMovement={state.disorientation.invertMovement}
              controlsDisabled={controlsLocked}
            />
          ) : state.stage === "security-hub" ? (
            <SecurityHubSection
              hubHackComplete={state.hubHackComplete}
              onEnterDataArchives={handleEnterDataArchives}
              onDetection={() =>
                setState((s) => ({ ...s, detections: s.detections + 1 }))
              }
              onDetectionShake={handleDetectionShake}
              onOpenGroknetTerminal={() =>
                setState((s) => ({ ...s, isPerimeterTerminalOpen: true }))
              }
              onHackComplete={() =>
                setState((s) => ({ ...s, hubHackComplete: true }))
              }
              onFirstHackComplete={handleFirstHackComplete}
              onGroknetWhisper={(line) => setGroknetWhisper(line, 4500)}
              dialogueComplete={state.perimeterTerminalComplete}
              groknetTerminalOpen={state.isPerimeterTerminalOpen}
              burningCitiesSurvived={state.burningCitiesSurvived}
              disoriented={state.disorientation.active}
              invertMovement={state.disorientation.invertMovement}
              controlsDisabled={controlsLocked}
            />
          ) : state.stage === "data-archives" ? (
            <DataArchivesSection
              onCompleteActOne={handleChapterComplete}
              onOpenArchivesTerminal={() =>
                setState((s) => ({ ...s, isArchivesTerminalOpen: true }))
              }
              onOpenFinaleTerminal={() =>
                setState((s) => ({ ...s, isFinaleTerminalOpen: true }))
              }
              onEnterMirrorVault={scheduleMirror}
              onGroknetWhisper={(line) => setGroknetWhisper(line, 4500)}
              mirrorSurvived={state.mirrorSurvived}
              archivesDialogueComplete={state.archivesDialogueComplete}
              finaleDialogueComplete={state.finaleDialogueComplete}
              convergenceSurvived={state.convergenceSurvived}
              archivesTerminalOpen={state.isArchivesTerminalOpen}
              finaleTerminalOpen={state.isFinaleTerminalOpen}
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

      <HallucinationFalseObjective
        text={falseObjective ?? ""}
        personalityClass={profile?.cssClasses.join(" ")}
        visible={active && Boolean(falseObjective) && phase !== "fade"}
      />

      {active && resistWindowOpen && !awaitingChoice ? (
        <HallucinationResistPrompt
          progress={resistProgress}
          onResist={resistHallucination}
          personalityClass={profile?.cssClasses.join(" ")}
        />
      ) : null}

      {active && awaitingChoice ? (
        <HallucinationChoicePrompt
          eventId={eventId}
          onChoose={handleHallucinationChoice}
          profile={profile}
        />
      ) : null}

      {state.stage === "security-hub" ? (
        <Terminal
          key={`terminal-groknet-${state.gameKey}`}
          variant="hub"
          isOpen={state.isPerimeterTerminalOpen}
          onClose={handleGroknetTerminalClose}
          onExchange={(count) => {
            recordSessionExchanges("hub", count);
            setState((s) => ({
              ...s,
              perimeterGroknetMet: count > 0,
            }));
          }}
          onConversationComplete={() =>
            setState((s) => ({ ...s, perimeterTerminalComplete: true }))
          }
          onSessionEnd={(session) => {
            recordSessionExchanges("hub", session.exchangeCount);
            setState((s) => ({
              ...s,
              finalTone: session.tone,
              finalMood: session.mood,
              dominantPersonality:
                session.dominantPersonality ??
                resolvePersonality(session.tone, session.mood),
              lastPlayerIntent: session.lastIntent,
              perimeterTerminalComplete:
                s.perimeterTerminalComplete || session.conversationResolved,
            }));
          }}
          onPlayerIntent={handlePlayerIntent}
          onHallucinationEvent={handleDialogueHallucinationBleed}
          playerContext={archivesPlayerContext}
        />
      ) : null}

      {state.stage === "data-archives" ? (
        <>
          <Terminal
            key={`terminal-archives-${state.gameKey}`}
            variant="archives"
            isOpen={state.isArchivesTerminalOpen}
            onClose={() =>
              setState((s) => ({ ...s, isArchivesTerminalOpen: false }))
            }
            onExchange={(count) => recordSessionExchanges("archives", count)}
            onConversationComplete={() =>
              setState((s) => ({ ...s, archivesDialogueComplete: true }))
            }
            onSessionEnd={(session) => {
              recordSessionExchanges("archives", session.exchangeCount);
              setState((s) => ({
                ...s,
                finalTone: session.tone,
                finalMood: session.mood,
                dominantPersonality:
                  session.dominantPersonality ??
                  resolvePersonality(session.tone, session.mood),
                lastPlayerIntent: session.lastIntent,
                archivesDialogueComplete:
                  s.archivesDialogueComplete || session.conversationResolved,
              }));
            }}
            onPlayerIntent={handlePlayerIntent}
            onHallucinationEvent={handleDialogueHallucinationBleed}
            playerContext={archivesPlayerContext}
          />
          <Terminal
            key={`terminal-finale-${state.gameKey}`}
            variant="finale"
            isOpen={state.isFinaleTerminalOpen}
            onClose={() =>
              setState((s) => ({ ...s, isFinaleTerminalOpen: false }))
            }
            onExchange={(count) => recordSessionExchanges("finale", count)}
            onConversationComplete={() => {
              setState((s) => ({ ...s, finaleDialogueComplete: true }));
              scheduleConvergence();
              setGroknetWhisper(
                "The cascade is coming. Every choice you made — collapsing into one signal. Hold your ground.",
                7000,
              );
            }}
            onSessionEnd={(session) => {
              recordSessionExchanges("finale", session.exchangeCount);
              setState((s) => ({
                ...s,
                finalTone: session.tone,
                finalMood: session.mood,
                dominantPersonality:
                  session.dominantPersonality ??
                  resolvePersonality(session.tone, session.mood),
                lastPlayerIntent: session.lastIntent,
                finaleDialogueComplete:
                  s.finaleDialogueComplete || session.conversationResolved,
              }));
            }}
            onPlayerIntent={handlePlayerIntent}
            onHallucinationEvent={handleDialogueHallucinationBleed}
            playerContext={archivesPlayerContext}
          />
        </>
      ) : null}

      {areaTransition ? (
        <AreaTransition
          from={areaTransition.from}
          to={areaTransition.to}
          groknetLine={areaTransition.groknetLine}
          onComplete={completeAreaTransition}
        />
      ) : null}

      {showFinaleCinematic && chapterSummary ? (
        <ActOneFinaleCinematic
          summary={chapterSummary}
          onComplete={handleFinaleCinematicComplete}
        />
      ) : null}

      {state.showLevelComplete && chapterSummary ? (
        <ChapterEnding
          summary={chapterSummary}
          onRestart={restartLevel}
          saved={progressSaved}
        />
      ) : null}
    </GameShell>
  );
}