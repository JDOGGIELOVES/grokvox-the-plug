import type { GroknetMood } from "@/lib/groknet";
import type { GroknetTone } from "@/types/dialogue";
import type { RunSummary } from "@/types/run";

export type ChapterPhase = "opening" | "playing" | "complete";

export type ChapterStage =
  | "outer-perimeter"
  | "security-hub"
  | "data-archives"
  | "research-wing"
  | "residential-sector"
  | "central-server-farm"
  | "deep-core-access"
  | "final-approach"
  | "plug-chamber";

export type ActId = "act-1" | "act-2" | "act-3";

export type ChapterId = "infiltration" | "conversation" | "reckoning";

export type ChapterMeta = {
  actId: ActId;
  chapterId: ChapterId;
  title: string;
  subtitle: string;
  sector: string;
};

export type AggressionState = {
  level: number;
  label: string;
};

export type ChapterRunState = {
  phase: ChapterPhase;
  runStart: number;
  gameKey: number;
  isTerminalOpen: boolean;
  terminalComplete: boolean;
  hallucinationSurvived: boolean;
  corridorCrossed: boolean;
  detections: number;
  exchangeCount: number;
  finalTone: GroknetTone;
  finalMood: GroknetMood;
  showLevelComplete: boolean;
  screenShaking: boolean;
  hallucinationTriggered: boolean;
  groknetWhisper: string | null;
};

export type ChapterRunSummary = RunSummary;