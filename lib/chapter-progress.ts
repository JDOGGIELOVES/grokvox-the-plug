import type { ChapterPhase, ChapterStage } from "@/types/chapter";

export type ChapterProgressSnapshot = {
  percent: number;
  label: string;
  detail: string;
};

export type ProgressInput = {
  phase: ChapterPhase;
  stage: ChapterStage;
  hubHackComplete: boolean;
  burningCitiesSurvived: boolean;
  perimeterDialogueComplete: boolean;
  mirrorSurvived: boolean;
  archivesDialogueComplete: boolean;
  finaleDialogueComplete: boolean;
  convergenceSurvived: boolean;
  showLevelComplete: boolean;
};

export function calculateChapterProgress(
  input: ProgressInput,
): ChapterProgressSnapshot {
  if (input.showLevelComplete) {
    return {
      percent: 100,
      label: "Infiltration",
      detail: "Complete",
    };
  }

  if (input.phase === "opening") {
    return { percent: 0, label: "Infiltration", detail: "Briefing" };
  }

  let percent = 5;

  if (input.stage !== "outer-perimeter") percent = 15;
  if (
    input.stage === "security-hub" ||
    input.stage === "data-archives"
  ) {
    percent = Math.max(percent, 18);
  }
  if (input.hubHackComplete) percent = Math.max(percent, 28);
  if (input.burningCitiesSurvived) percent = Math.max(percent, 38);
  if (input.perimeterDialogueComplete) percent = Math.max(percent, 48);

  if (input.stage === "data-archives") {
    percent = Math.max(percent, 52);
  }
  if (input.mirrorSurvived) percent = Math.max(percent, 62);
  if (input.archivesDialogueComplete) percent = Math.max(percent, 70);
  if (input.finaleDialogueComplete) percent = Math.max(percent, 82);
  if (input.convergenceSurvived) percent = Math.max(percent, 95);

  return {
    percent,
    label: "Infiltration",
    detail: `${percent}% Complete`,
  };
}