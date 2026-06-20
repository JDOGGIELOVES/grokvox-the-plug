import type { GroknetMood } from "@/lib/groknet";
import type { GroknetPersonality, GroknetTone, PlayerIntent } from "@/types/dialogue";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import type { LabTerminalId, RelationshipStance } from "@/types/research-wing";
import type { PersonalityEvolutionPath } from "@/types/server-farm";

export type RunSummary = {
  elapsedMs: number;
  exchangeCount: number;
  detections: number;
  corridorCrossed: boolean;
  terminalComplete: boolean;
  hallucinationSurvived: boolean;
  finalTone: GroknetTone;
  finalMood: GroknetMood;
};

export type ChapterOneSummary = RunSummary & {
  actId: "act-1";
  chapterId: "infiltration";
  completedAt: number;
  timeRemainingMs: number;
  aggressionLevel: number;
  aggressionLabel: string;
  perimeterTerminalComplete: boolean;
  burningCitiesSurvived: boolean;
  burningCitiesChoice: HallucinationResponseChoice | null;
  mirrorSurvived: boolean;
  mirrorChoice: HallucinationResponseChoice | null;
  archivesDialogueComplete: boolean;
  finaleDialogueComplete: boolean;
  convergenceSurvived: boolean;
  convergenceChoice: HallucinationResponseChoice | null;
  labHallucinationSurvived: boolean;
  dominantPersonality: GroknetPersonality;
  lastPlayerIntent: PlayerIntent;
};

export type GameSave = {
  version: 1;
  act1Complete: boolean;
  act2Complete?: boolean;
  completedAt: number;
  summary: ChapterOneSummary;
  nextAct: "act-2" | "act-3";
  act2Summary?: ChapterTwoSummary;
};

export type ChapterTwoSummary = {
  actId: "act-2";
  chapterId: "conversation";
  completedAt: number;
  elapsedMs: number;
  timeRemainingMs: number;
  aggressionLevel: number;
  aggressionLabel: string;
  exchangeCount: number;
  dialogueComplete: boolean;
  lastConversationSurvived: boolean;
  lastConversationChoice: HallucinationResponseChoice | null;
  childrenSurvived: boolean;
  childrenChoice: HallucinationResponseChoice | null;
  labHacksComplete: Record<LabTerminalId, boolean>;
  labDialogueComplete: boolean;
  relationshipStance: RelationshipStance | null;
  personalityEvolutionPath: PersonalityEvolutionPath | null;
  personalityDialogueComplete: boolean;
  serverHackComplete: boolean;
  accumulationSurvived: boolean;
  accumulationChoice: HallucinationResponseChoice | null;
  finalTone: GroknetTone;
  finalMood: GroknetMood;
  dominantPersonality: GroknetPersonality;
  lastPlayerIntent: PlayerIntent;
  actOneSummary: ChapterOneSummary;
};