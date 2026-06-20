import type { ActThreeStage } from "@/types/deep-core";

export type ActThreeProgressSnapshot = {
  percent: number;
  label: string;
  detail: string;
};

export type ActThreeProgressInput = {
  phase: "transition" | "playing" | "complete";
  actThreeStage: ActThreeStage;
  fortificationHackComplete: boolean;
  thresholdDialogueComplete: boolean;
  gardenSurvived: boolean;
  plugChamberEntered: boolean;
  confrontationComplete: boolean;
  plugChoiceMade: boolean;
  showChapterComplete: boolean;
};

export function calculateActThreeProgress(
  input: ActThreeProgressInput,
): ActThreeProgressSnapshot {
  if (input.showChapterComplete) {
    return {
      percent: 100,
      label: "Reckoning",
      detail: "Campaign complete",
    };
  }

  if (input.phase === "transition") {
    return { percent: 0, label: "Reckoning", detail: "Handoff from Act II" };
  }

  let percent = 6;

  if (input.fortificationHackComplete) percent = Math.max(percent, 22);
  if (input.thresholdDialogueComplete) percent = Math.max(percent, 32);
  if (input.gardenSurvived) percent = Math.max(percent, 52);

  if (input.actThreeStage === "plug-chamber") {
    percent = Math.max(percent, 58);
    if (input.confrontationComplete) percent = Math.max(percent, 78);
    if (input.plugChoiceMade) percent = Math.max(percent, 94);
  }

  const detail = input.plugChoiceMade
    ? "Reckoning resolved at the plug"
    : input.confrontationComplete
      ? "The Physical Plug reachable"
      : input.actThreeStage === "plug-chamber"
        ? "Final confrontation underway"
        : input.gardenSurvived
          ? "Descent Shaft unlocked"
          : input.thresholdDialogueComplete
            ? "Neural Garden accessible"
            : input.fortificationHackComplete
              ? "Garden Threshold unlocked"
              : "DC-FORT-01 contested";

  return {
    percent,
    label: "Reckoning",
    detail,
  };
}