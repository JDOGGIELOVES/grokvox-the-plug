import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getPlayerPerformance } from "@/lib/run";
import type { ChapterThreeSummary } from "@/types/run";
import type { HallucinationResponseChoice } from "@/types/hallucination";

function labelChoice(choice: HallucinationResponseChoice | null): string {
  if (!choice) return "unrecorded";
  const labels: Record<HallucinationResponseChoice, string> = {
    steady: "witnessed",
    submit: "surrendered",
    deny: "denied",
    "call-out": "demanded truth",
  };
  return labels[choice];
}

/** Act II dialogue context is already the ledger shape. */
export function toLedgerContext(ctx: ActTwoDialogueContext): ActTwoDialogueContext {
  return ctx;
}

/** Normalize Act III runtime context for accumulated-choice helpers. */
export function actThreeToLedgerContext(
  ctx: ActThreeDialogueContext,
): ActTwoDialogueContext {
  return {
    actOne: ctx.actOne,
    dominantApproach: ctx.dominantApproach,
    aggressionLevel: ctx.aggressionLevel,
    aggressionLabel: ctx.aggressionLabel,
    finalTone: ctx.finalTone,
    finalMood: ctx.finalMood,
    lastPlayerIntent: ctx.lastPlayerIntent,
    dominantPersonality: ctx.dominantPersonality,
    burningCitiesChoice: ctx.burningCitiesChoice,
    mirrorChoice: ctx.mirrorChoice,
    convergenceChoice: ctx.convergenceChoice,
    detections: ctx.actOne.detections,
    exchangeCount: ctx.actTwo.exchangeCount,
    moveCount: ctx.moveCount,
    dialogueStarted: true,
    dialogueComplete: true,
    lastConversationTriggered: true,
    lastConversationSurvived: ctx.actTwo.lastConversationSurvived,
    lastConversationChoice: ctx.lastConversationChoice,
    actTwoStage: "central-server-farm",
    labHacksComplete: ctx.actTwo.labHacksComplete,
    labDialogueComplete: ctx.actTwo.labDialogueComplete,
    labExchangeCount: ctx.actTwo.exchangeCount,
    relationshipStance: ctx.relationshipStance,
    relationshipBeatIndex: 2,
    childrenTriggered: true,
    childrenSurvived: ctx.actTwo.childrenSurvived,
    childrenChoice: ctx.childrenChoice,
    personalityEvolutionPath: ctx.personalityEvolutionPath,
    personalityBeatIndex: 2,
    personalityDialogueComplete: true,
    serverHackComplete: ctx.actTwo.serverHackComplete,
    accumulationTriggered: true,
    accumulationSurvived: ctx.actTwo.accumulationSurvived,
    accumulationChoice: ctx.accumulationChoice,
  };
}

/** Rebuild ledger context from a completed Act III summary. */
export function summaryToLedgerContext(
  summary: ChapterThreeSummary,
): ActTwoDialogueContext {
  const actTwo = summary.actTwoSummary;
  const actOne = summary.actOneSummary;
  return {
    actOne,
    dominantApproach: getPlayerPerformance(summary.finalTone, summary.finalMood),
    aggressionLevel: summary.aggressionLevel,
    aggressionLabel: summary.aggressionLabel,
    finalTone: summary.finalTone,
    finalMood: summary.finalMood,
    lastPlayerIntent: summary.lastPlayerIntent,
    dominantPersonality: summary.dominantPersonality,
    burningCitiesChoice: actOne.burningCitiesChoice,
    mirrorChoice: actOne.mirrorChoice,
    convergenceChoice: actOne.convergenceChoice,
    detections: actOne.detections,
    exchangeCount: summary.exchangeCount,
    moveCount: 0,
    dialogueStarted: true,
    dialogueComplete: true,
    lastConversationTriggered: true,
    lastConversationSurvived: actTwo.lastConversationSurvived,
    lastConversationChoice: actTwo.lastConversationChoice,
    actTwoStage: "central-server-farm",
    labHacksComplete: actTwo.labHacksComplete,
    labDialogueComplete: actTwo.labDialogueComplete,
    labExchangeCount: actTwo.exchangeCount,
    relationshipStance: summary.relationshipStance,
    relationshipBeatIndex: 2,
    childrenTriggered: true,
    childrenSurvived: actTwo.childrenSurvived,
    childrenChoice: actTwo.childrenChoice,
    personalityEvolutionPath: summary.personalityEvolutionPath,
    personalityBeatIndex: 2,
    personalityDialogueComplete: true,
    serverHackComplete: actTwo.serverHackComplete,
    accumulationTriggered: true,
    accumulationSurvived: actTwo.accumulationSurvived,
    accumulationChoice: actTwo.accumulationChoice,
  };
}

export function getActOneChoiceCitation(ctx: {
  burningCitiesChoice: HallucinationResponseChoice | null;
  mirrorChoice: HallucinationResponseChoice | null;
  convergenceChoice: HallucinationResponseChoice | null;
}): string {
  const parts: string[] = [];
  if (ctx.burningCitiesChoice) {
    parts.push(`Austin: you ${labelChoice(ctx.burningCitiesChoice)}`);
  }
  if (ctx.mirrorChoice) {
    parts.push(`mirror: you ${labelChoice(ctx.mirrorChoice)}`);
  }
  if (ctx.convergenceChoice) {
    parts.push(`cascade: you ${labelChoice(ctx.convergenceChoice)}`);
  }
  return parts.length > 0 ? parts.join(" · ") : "few indexed Act I responses";
}