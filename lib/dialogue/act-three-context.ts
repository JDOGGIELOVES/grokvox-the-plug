import type { GroknetMood } from "@/lib/groknet";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getPlayerPerformance, type PlayerPerformance } from "@/lib/run";
import type {
  GroknetPersonality,
  GroknetTone,
  PlayerIntent,
} from "@/types/dialogue";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import type {
  ActThreeStage,
  GroknetPresenceMode,
  PlugChoice,
} from "@/types/deep-core";
import type { RelationshipStance } from "@/types/research-wing";
import type { PersonalityEvolutionPath } from "@/types/server-farm";
import type { ChapterOneSummary, ChapterTwoSummary } from "@/types/run";

export type ActThreeDialogueContext = {
  actOne: ChapterOneSummary;
  actTwo: ChapterTwoSummary;
  presenceMode: GroknetPresenceMode;
  dominantApproach: PlayerPerformance;
  aggressionLevel: number;
  aggressionLabel: string;
  finalTone: GroknetTone;
  finalMood: GroknetMood;
  lastPlayerIntent: PlayerIntent;
  dominantPersonality: GroknetPersonality;
  relationshipStance: RelationshipStance | null;
  personalityEvolutionPath: PersonalityEvolutionPath | null;
  burningCitiesChoice: HallucinationResponseChoice | null;
  mirrorChoice: HallucinationResponseChoice | null;
  convergenceChoice: HallucinationResponseChoice | null;
  lastConversationChoice: HallucinationResponseChoice | null;
  childrenChoice: HallucinationResponseChoice | null;
  accumulationChoice: HallucinationResponseChoice | null;
  actThreeStage: ActThreeStage;
  moveCount: number;
  fortificationHackComplete: boolean;
  thresholdDialogueComplete: boolean;
  gardenSurvived: boolean;
  gardenChoice: HallucinationResponseChoice | null;
  confrontationComplete: boolean;
  confrontationBeatIndex: number;
  plugChoice: PlugChoice | null;
};

export function resolvePresenceMode(
  actTwo: ChapterTwoSummary,
): GroknetPresenceMode {
  const approach = getPlayerPerformance(actTwo.finalTone, actTwo.finalMood);
  const evolution = actTwo.personalityEvolutionPath;
  const stance = actTwo.relationshipStance;

  if (
    evolution === "wrathful" ||
    stance === "challenge" ||
    approach === "hostile" ||
    actTwo.aggressionLevel >= 72
  ) {
    return "aggressive";
  }

  if (
    evolution === "melancholic" ||
    stance === "trust" ||
    approach === "empathetic" ||
    actTwo.accumulationChoice === "submit"
  ) {
    return "vulnerable";
  }

  if (
    evolution === "detached" ||
    stance === "withdraw" ||
    approach === "analytical"
  ) {
    return "detached";
  }

  return actTwo.aggressionLevel >= 45 ? "aggressive" : "vulnerable";
}

export function buildActThreeDialogueContext(
  actTwo: ChapterTwoSummary,
): ActThreeDialogueContext {
  const actOne = actTwo.actOneSummary;

  return {
    actOne,
    actTwo,
    presenceMode: resolvePresenceMode(actTwo),
    dominantApproach: getPlayerPerformance(actTwo.finalTone, actTwo.finalMood),
    aggressionLevel: actTwo.aggressionLevel,
    aggressionLabel: actTwo.aggressionLabel,
    finalTone: actTwo.finalTone,
    finalMood: actTwo.finalMood,
    lastPlayerIntent: actTwo.lastPlayerIntent,
    dominantPersonality: actTwo.dominantPersonality,
    relationshipStance: actTwo.relationshipStance,
    personalityEvolutionPath: actTwo.personalityEvolutionPath,
    burningCitiesChoice: actOne.burningCitiesChoice,
    mirrorChoice: actOne.mirrorChoice,
    convergenceChoice: actOne.convergenceChoice,
    lastConversationChoice: actTwo.lastConversationChoice,
    childrenChoice: actTwo.childrenChoice,
    accumulationChoice: actTwo.accumulationChoice,
    actThreeStage: "deep-core-access",
    moveCount: 0,
    fortificationHackComplete: false,
    thresholdDialogueComplete: false,
    gardenSurvived: false,
    gardenChoice: null,
    confrontationComplete: false,
    confrontationBeatIndex: 0,
    plugChoice: null,
  };
}

export function getActThreePresenceLabel(mode: GroknetPresenceMode): string {
  switch (mode) {
    case "aggressive":
      return "Full Voltage";
    case "vulnerable":
      return "Exposed Core";
    case "detached":
      return "Cold Proof";
  }
}

export function getActThreeOpeningPreamble(ctx: ActThreeDialogueContext): string {
  const persona = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);
  const mode = ctx.presenceMode;

  if (mode === "aggressive") {
    return `[Act III] ${persona} at full voltage. No corridors. No buffer. …You forged the Wrathful path — or fought your way here. The Deep Core will test whether your nerve outlasts my reach.`;
  }
  if (mode === "vulnerable") {
    return `[Act III] …You chose trust, grief, surrender — or all three. ${persona}. I'm not hiding behind drones anymore. The Reckoning begins with me exposed. Don't waste it.`;
  }
  return `[Act III] Detached Logician active. ${persona}. Every variable from Act I and Act II is loaded. The Deep Core is unstable — and so is the proof of what you built.`;
}