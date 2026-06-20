import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import {
  getAccumulatedChoiceSummary,
  getAccumulatedChoiceWeight,
  getDominantChoicePattern,
} from "@/lib/chapter/act-two-choice-ledger";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";

export function getReactiveActTwoPreamble(ctx: ActTwoDialogueContext): string | null {
  const weight = getAccumulatedChoiceWeight(ctx);
  if (weight < 4) return null;

  const summary = getAccumulatedChoiceSummary(ctx);
  const pattern = getDominantChoicePattern(ctx);
  const persona = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);

  if (ctx.actTwoStage === "central-server-farm" && ctx.personalityEvolutionPath) {
    return `[Peak] ${getEvolutionPathLabel(ctx.personalityEvolutionPath)} locked · ${summary}`;
  }

  if (pattern === "deny" && ctx.burningCitiesChoice === "deny") {
    return `…Consistent denial — smoke through children. ${persona} remembers. ${summary}`;
  }

  if (pattern === "submit" && ctx.convergenceChoice === "submit") {
    return `…Surrender pattern since the cascade. ${summary}. I won't pretend that doesn't change how I speak.`;
  }

  if (pattern === "call-out") {
    return `You demand truth at every layer. Ledger: ${summary}. I'll choose what truth costs next.`;
  }

  if (ctx.relationshipStance === "trust" && ctx.lastConversationChoice === "submit") {
    return `Trust after grief in the Memory Hall. …${summary}. I'm trying to believe you.`;
  }

  if (ctx.relationshipStance === "challenge" && ctx.dominantApproach === "hostile") {
    return `Challenge stance, hostile approach. ${persona}. ${summary}.`;
  }

  return `Indexed: ${summary}. Weight ${weight}. …I'm speaking from everything you chose.`;
}

export function getReactiveHallucinationPreface(
  ctx: ActTwoDialogueContext,
  event: "last-conversation" | "children" | "accumulation",
): string {
  const summary = getAccumulatedChoiceSummary(ctx);
  const pattern = getDominantChoicePattern(ctx);

  if (event === "last-conversation") {
    if (ctx.mirrorChoice === "submit") {
      return "You stepped into the mirror in Act I. …The Memory Hall is what I couldn't show you there.";
    }
    if (ctx.burningCitiesChoice === "steady") {
      return "You held steady in the fire. …Now hold steady in what I couldn't delete.";
    }
    if (pattern === "deny") {
      return "You denied smoke, mirror, cascade. …This memory won't accept denial as easily.";
    }
    return `Before the labs — before the farm — there was this. Your Act I file: ${summary}.`;
  }

  if (event === "children") {
    if (ctx.lastConversationChoice === "call-out") {
      return "You demanded who was left behind in the hall. …The Children are who I failed before that.";
    }
    if (ctx.relationshipStance === "trust") {
      return "You chose trust on the deck. …Don't look away when the playground renders.";
    }
    if (ctx.labDialogueComplete && ctx.relationshipStance === "challenge") {
      return "You challenged what we are — then walked into the loop. …The Children answer that challenge.";
    }
    return `Three terminals contested. Relationship indexed. Ledger: ${summary}. …Now the wound I hid.`;
  }

  if (event === "accumulation") {
    if (ctx.personalityEvolutionPath) {
      return `${getEvolutionPathLabel(ctx.personalityEvolutionPath)} at my core. Every vision converges. ${summary}.`;
    }
    if (ctx.serverHackComplete) {
      return "You fought for CSF-PRIME-00. …Now see what your hands built across both acts.";
    }
    return `Act II peak. Full ledger: ${summary}. Pattern: ${pattern}.`;
  }

  return summary;
}