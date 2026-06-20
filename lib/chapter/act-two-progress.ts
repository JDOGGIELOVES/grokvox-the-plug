import type { ChapterPhase } from "@/types/chapter";
import type { ActTwoStage } from "@/types/research-wing";
import type { LabTerminalId } from "@/types/research-wing";
import { allLabHacksComplete } from "@/lib/research-wing-hack";

export type ActTwoProgressSnapshot = {
  percent: number;
  label: string;
  detail: string;
};

export type ActTwoProgressInput = {
  phase: ChapterPhase | "transition";
  actTwoStage: ActTwoStage;
  dialogueComplete: boolean;
  lastConversationSurvived: boolean;
  labHacksComplete: Record<LabTerminalId, boolean>;
  labDialogueComplete: boolean;
  childrenSurvived: boolean;
  personalityDialogueComplete: boolean;
  serverHackComplete: boolean;
  accumulationSurvived: boolean;
  showChapterComplete: boolean;
};

export function calculateActTwoProgress(
  input: ActTwoProgressInput,
): ActTwoProgressSnapshot {
  if (input.showChapterComplete) {
    return {
      percent: 100,
      label: "Conversation",
      detail: "Act II complete",
    };
  }

  if (input.phase === "transition") {
    return { percent: 0, label: "Conversation", detail: "Handoff from Act I" };
  }

  let percent = 8;

  if (input.dialogueComplete) percent = Math.max(percent, 18);
  if (input.lastConversationSurvived) percent = Math.max(percent, 28);

  if (input.actTwoStage === "research-wing") {
    percent = Math.max(percent, 32);
    if (input.labHacksComplete["ex-lab-01"]) percent = Math.max(percent, 38);
    if (input.labHacksComplete["ex-nb-02"]) percent = Math.max(percent, 44);
    if (input.labHacksComplete["ex-sv-03"]) percent = Math.max(percent, 50);
    if (allLabHacksComplete(input.labHacksComplete)) {
      percent = Math.max(percent, 54);
    }
    if (input.labDialogueComplete) percent = Math.max(percent, 58);
    if (input.childrenSurvived) percent = Math.max(percent, 62);
  }

  if (input.actTwoStage === "central-server-farm") {
    percent = Math.max(percent, 66);
    if (input.personalityDialogueComplete) percent = Math.max(percent, 74);
    if (input.serverHackComplete) percent = Math.max(percent, 84);
    if (input.accumulationSurvived) percent = Math.max(percent, 96);
  }

  const detail = input.accumulationSurvived
    ? "The Accumulation survived"
    : input.serverHackComplete
      ? "Memory Confluence unlocked"
      : input.personalityDialogueComplete
        ? "CSF-PRIME-00 contested"
        : input.actTwoStage === "central-server-farm"
          ? "Personality evolution pending"
          : input.childrenSurvived
            ? "Central Server Farm accessible"
            : input.labDialogueComplete
              ? "Containment Loop unlocked"
              : allLabHacksComplete(input.labHacksComplete)
                ? "Relationship index pending"
                : input.lastConversationSurvived
                  ? input.actTwoStage === "research-wing"
                    ? "Contested terminals active"
                    : "Research Wing accessible"
                  : input.dialogueComplete
                    ? "Memory Hall unlocked"
                    : "Quarters dialogue pending";

  return {
    percent,
    label: "Conversation",
    detail,
  };
}