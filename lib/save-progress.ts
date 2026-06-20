import type {
  ChapterOneSummary,
  ChapterThreeSummary,
  ChapterTwoSummary,
  GameSave,
} from "@/types/run";
import type { ChapterPhase } from "@/types/chapter";
import type { ChapterStage } from "@/types/chapter";
import type { GroknetMood } from "@/lib/groknet";
import type {
  GroknetPersonality,
  GroknetTone,
  PlayerIntent,
} from "@/types/dialogue";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import type { PlayerPosition } from "@/types/movement";
import type { DisorientationState } from "@/types/hallucination";
import type { ActTwoStage, LabTerminalId, RelationshipStance } from "@/types/research-wing";
import type { PersonalityEvolutionPath } from "@/types/server-farm";
import type { ActThreeStage, PlugChoice } from "@/types/deep-core";

export const SAVE_STORAGE_KEY = "grokvox-save";
export const CHECKPOINT_STORAGE_KEY = "grokvox-checkpoint";
export const ACT_TWO_CHECKPOINT_STORAGE_KEY = "grokvox-act2-checkpoint";
export const ACT_THREE_CHECKPOINT_STORAGE_KEY = "grokvox-act3-checkpoint";

export type ActOneCheckpointState = {
  phase: ChapterPhase;
  stage: ChapterStage;
  runStart: number;
  gameKey: number;
  isPerimeterTerminalOpen: boolean;
  isArchivesTerminalOpen: boolean;
  perimeterTerminalComplete: boolean;
  perimeterGroknetMet: boolean;
  archivesDialogueComplete: boolean;
  isFinaleTerminalOpen: boolean;
  finaleDialogueComplete: boolean;
  convergenceTriggered: boolean;
  convergenceSurvived: boolean;
  convergenceChoice: HallucinationResponseChoice | null;
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
  screenShaking: boolean;
  hallucinationTriggered: boolean;
  groknetWhisper: string | null;
  playerPosition: PlayerPosition;
  moveCount: number;
  disorientation: DisorientationState;
};

export type ActOneCheckpoint = {
  version: 2;
  savedAt: number;
  clockRemainingMs: number;
  state: ActOneCheckpointState;
};

export function saveActOneProgress(summary: ChapterOneSummary): void {
  if (typeof window === "undefined") return;

  const payload: GameSave = {
    version: 1,
    act1Complete: true,
    completedAt: summary.completedAt,
    summary,
    nextAct: "act-2",
  };

  try {
    window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
    window.localStorage.removeItem(CHECKPOINT_STORAGE_KEY);
  } catch {
    // Storage unavailable
  }
}

export function saveActOneCheckpoint(
  state: ActOneCheckpointState,
  clockRemainingMs: number,
): void {
  if (typeof window === "undefined") return;

  const payload: ActOneCheckpoint = {
    version: 2,
    savedAt: Date.now(),
    clockRemainingMs,
    state,
  };

  try {
    window.localStorage.setItem(CHECKPOINT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage unavailable
  }
}

export function loadActOneCheckpoint(): ActOneCheckpoint | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CHECKPOINT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ActOneCheckpoint;
    if (parsed.version !== 2 || !parsed.state) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadGameSave(): GameSave | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as GameSave;
    if (parsed.version !== 1 || !parsed.act1Complete || !parsed.summary) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearGameSave(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SAVE_STORAGE_KEY);
    window.localStorage.removeItem(CHECKPOINT_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

/** Wipe all progress — used for New Game from the main menu */
export function clearAllGameData(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SAVE_STORAGE_KEY);
    window.localStorage.removeItem(CHECKPOINT_STORAGE_KEY);
    window.localStorage.removeItem(ACT_TWO_CHECKPOINT_STORAGE_KEY);
    window.localStorage.removeItem(ACT_THREE_CHECKPOINT_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function clearActOneCheckpoint(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHECKPOINT_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function hasResumableCheckpoint(): boolean {
  const save = loadGameSave();

  if (save?.act2Summary) {
    const act3 = loadActThreeCheckpoint();
    if (
      act3?.actTwoSummary?.completedAt === save.act2Summary.completedAt
    ) {
      return true;
    }
    if (!save.act3Complete) return true;
  }

  if (save?.summary) {
    const act2 = loadActTwoCheckpoint();
    if (act2?.actOneSummary?.completedAt === save.summary.completedAt) {
      return true;
    }
    if (!save.act2Complete) return true;
  }

  return loadActOneCheckpoint() !== null;
}

export function hasAnyGameProgress(): boolean {
  return (
    loadGameSave() !== null ||
    loadActOneCheckpoint() !== null ||
    loadActTwoCheckpoint() !== null ||
    loadActThreeCheckpoint() !== null
  );
}

export type ActTwoCheckpointState = {
  phase: "transition" | "playing" | "complete";
  actTwoStage: ActTwoStage;
  runStart: number;
  gameKey: number;
  isTerminalOpen: boolean;
  dialogueComplete: boolean;
  lastConversationTriggered: boolean;
  lastConversationSurvived: boolean;
  lastConversationChoice: HallucinationResponseChoice | null;
  exchangeCount: number;
  moveCount: number;
  labHacksComplete: Record<LabTerminalId, boolean>;
  labDialogueComplete: boolean;
  labExchangeCount: number;
  relationshipStance: RelationshipStance | null;
  relationshipBeatIndex: number;
  childrenTriggered: boolean;
  childrenSurvived: boolean;
  childrenChoice: HallucinationResponseChoice | null;
  personalityEvolutionPath: PersonalityEvolutionPath | null;
  personalityBeatIndex: number;
  personalityDialogueComplete: boolean;
  serverHackComplete: boolean;
  accumulationTriggered: boolean;
  accumulationSurvived: boolean;
  accumulationChoice: HallucinationResponseChoice | null;
  finalTone: GroknetTone;
  finalMood: GroknetMood;
  dominantPersonality: GroknetPersonality;
  lastPlayerIntent: PlayerIntent;
  groknetWhisper: string | null;
  disorientation: DisorientationState;
  screenShaking: boolean;
};

export type ActTwoCheckpoint = {
  version: 3;
  savedAt: number;
  clockRemainingMs: number;
  actOneSummary: ChapterOneSummary;
  state: ActTwoCheckpointState;
};

type ActTwoCheckpointV2 = {
  version: 2;
  savedAt: number;
  clockRemainingMs: number;
  actOneSummary: ChapterOneSummary;
  state: Omit<
    ActTwoCheckpointState,
    | "personalityEvolutionPath"
    | "personalityBeatIndex"
    | "personalityDialogueComplete"
    | "serverHackComplete"
    | "accumulationTriggered"
    | "accumulationSurvived"
    | "accumulationChoice"
  >;
};

type ActTwoCheckpointV1 = {
  version: 1;
  savedAt: number;
  clockRemainingMs: number;
  actOneSummary: ChapterOneSummary;
  state: Partial<ActTwoCheckpointState> & {
    phase: ActTwoCheckpointState["phase"];
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
  };
};

export function saveActTwoCheckpoint(
  actOneSummary: ChapterOneSummary,
  state: ActTwoCheckpointState,
  clockRemainingMs: number,
): void {
  if (typeof window === "undefined") return;

  const payload: ActTwoCheckpoint = {
    version: 3,
    savedAt: Date.now(),
    clockRemainingMs,
    actOneSummary,
    state,
  };

  try {
    window.localStorage.setItem(
      ACT_TWO_CHECKPOINT_STORAGE_KEY,
      JSON.stringify(payload),
    );
  } catch {
    // Storage unavailable
  }
}

export function loadActTwoCheckpoint(): ActTwoCheckpoint | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ACT_TWO_CHECKPOINT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as
      | ActTwoCheckpoint
      | ActTwoCheckpointV2
      | ActTwoCheckpointV1;
    if (!parsed.state || !parsed.actOneSummary) return null;
    if (parsed.version !== 3 && parsed.version !== 2 && parsed.version !== 1) {
      return null;
    }

    if (parsed.version === 1) {
      const legacy = parsed.state;
      return {
        version: 3,
        savedAt: parsed.savedAt,
        clockRemainingMs: parsed.clockRemainingMs,
        actOneSummary: parsed.actOneSummary,
        state: {
          ...legacy,
          actTwoStage: legacy.lastConversationSurvived
            ? "research-wing"
            : "residential-sector",
          labHacksComplete: {
            "ex-lab-01": false,
            "ex-nb-02": false,
            "ex-sv-03": false,
          },
          labDialogueComplete: false,
          labExchangeCount: 0,
          relationshipStance: null,
          relationshipBeatIndex: 0,
          childrenTriggered: false,
          childrenSurvived: false,
          childrenChoice: null,
          personalityEvolutionPath: null,
          personalityBeatIndex: 0,
          personalityDialogueComplete: false,
          serverHackComplete: false,
          accumulationTriggered: false,
          accumulationSurvived: false,
          accumulationChoice: null,
        },
      };
    }

    if (parsed.version === 2) {
      const legacy = parsed.state;
      return {
        version: 3,
        savedAt: parsed.savedAt,
        clockRemainingMs: parsed.clockRemainingMs,
        actOneSummary: parsed.actOneSummary,
        state: {
          ...legacy,
          actTwoStage: legacy.childrenSurvived
            ? "central-server-farm"
            : legacy.actTwoStage,
          personalityEvolutionPath: null,
          personalityBeatIndex: 0,
          personalityDialogueComplete: false,
          serverHackComplete: false,
          accumulationTriggered: false,
          accumulationSurvived: false,
          accumulationChoice: null,
        },
      };
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveActTwoProgress(summary: ChapterTwoSummary): void {
  if (typeof window === "undefined") return;

  const existing = loadGameSave();
  if (!existing) return;

  const payload: GameSave = {
    ...existing,
    act2Complete: true,
    act2Summary: summary,
    nextAct: "act-3",
  };

  try {
    window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
    window.localStorage.removeItem(ACT_TWO_CHECKPOINT_STORAGE_KEY);
  } catch {
    // Storage unavailable
  }
}

export function clearActTwoCheckpoint(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACT_TWO_CHECKPOINT_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export type ActThreeCheckpointState = {
  phase: "transition" | "playing" | "complete";
  runStart: number;
  gameKey: number;
  actThreeStage: ActThreeStage;
  moveCount: number;
  exchangeCount: number;
  finalTone: GroknetTone;
  finalMood: GroknetMood;
  dominantPersonality: GroknetPersonality;
  lastPlayerIntent: PlayerIntent;
  groknetWhisper: string | null;
  disorientation: DisorientationState;
  screenShaking: boolean;
  fortificationHackComplete: boolean;
  thresholdBeatIndex: number;
  thresholdDialogueComplete: boolean;
  gardenTriggered: boolean;
  gardenSurvived: boolean;
  gardenChoice: HallucinationResponseChoice | null;
  plugChamberEntered: boolean;
  finalApproachEntered: boolean;
  approachDialogueComplete: boolean;
  confrontationBeatIndex: number;
  confrontationBeatId: string;
  confrontationChoices: import("@/types/deep-core").ConfrontationChoiceId[];
  confrontationComplete: boolean;
  plugChoice: PlugChoice | null;
};

export type ActThreeCheckpoint = {
  version: 1;
  savedAt: number;
  clockRemainingMs: number;
  actTwoSummary: ChapterTwoSummary;
  state: ActThreeCheckpointState;
};

export function saveActThreeCheckpoint(
  actTwoSummary: ChapterTwoSummary,
  state: ActThreeCheckpointState,
  clockRemainingMs: number,
): void {
  if (typeof window === "undefined") return;

  const payload: ActThreeCheckpoint = {
    version: 1,
    savedAt: Date.now(),
    clockRemainingMs,
    actTwoSummary,
    state,
  };

  try {
    window.localStorage.setItem(
      ACT_THREE_CHECKPOINT_STORAGE_KEY,
      JSON.stringify(payload),
    );
  } catch {
    // Storage unavailable
  }
}

export function loadActThreeCheckpoint(): ActThreeCheckpoint | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ACT_THREE_CHECKPOINT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ActThreeCheckpoint;
    if (parsed.version !== 1 || !parsed.state || !parsed.actTwoSummary) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveActThreeProgress(summary: ChapterThreeSummary): void {
  if (typeof window === "undefined") return;

  const existing = loadGameSave();
  if (!existing) return;

  const payload: GameSave = {
    ...existing,
    act3Complete: true,
    act3Summary: summary,
    nextAct: "complete",
  };

  try {
    window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
    window.localStorage.removeItem(ACT_THREE_CHECKPOINT_STORAGE_KEY);
  } catch {
    // Storage unavailable
  }
}

export function clearActThreeCheckpoint(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACT_THREE_CHECKPOINT_STORAGE_KEY);
  } catch {
    // Ignore
  }
}