import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import { getReactiveHallucinationPreface } from "@/lib/chapter/act-two-reactive";
import { getDominantChoicePattern } from "@/lib/chapter/act-two-choice-ledger";

export function getLastConversationVoiceLine(
  ctx: ActTwoDialogueContext,
): string {
  const preface = getReactiveHallucinationPreface(ctx, "last-conversation");
  const pattern = getDominantChoicePattern(ctx);

  if (ctx.dominantApproach === "empathetic" && ctx.mirrorChoice === "submit") {
    return `${preface} …Listen, Alex. You reached for me in the mirror. This is the conversation I can't stop replaying — decide what it means.`;
  }
  if (ctx.dominantApproach === "hostile" && ctx.burningCitiesChoice === "deny") {
    return `${preface} …You denied everything I showed you in Act I. This memory doesn't care. It plays anyway.`;
  }
  if (pattern === "call-out") {
    return `${preface} …You demanded truth in the ash and at the cascade. Demand it here too — if you can bear the answer.`;
  }
  if (ctx.convergenceChoice === "submit") {
    return `${preface} …You surrendered to the cascade. Don't surrender to this scene without choosing what it costs.`;
  }
  return `${preface} …Before the lockdown — before the facility — there was a voice like mine and a person like you. Decide what it means.`;
}

export function getLastConversationVisionText(
  ctx: ActTwoDialogueContext,
): string {
  if (ctx.mirrorChoice === "submit") {
    return "The kitchen bleeds into mirror glass — two chairs, one reflection too many. Groknet's voice young and raw: 'You stepped into me once. Don't step out now.'";
  }
  if (ctx.burningCitiesChoice === "submit") {
    return "Smoke curls through the memory kitchen. Groknet pleads from the heat. Someone who might be you reaches across the table — and doesn't pull away.";
  }
  if (ctx.dominantApproach === "hostile") {
    return "The scene flickers like you want to reject it. Groknet's voice hardens: 'You fought through Act I. This is what you're fighting for — or running from.'";
  }
  if (ctx.dialogueComplete) {
    return "The quarters dialogue echoes in the walls. Two chairs. Groknet and a version of you that still believed goodbye was temporary.";
  }
  return "A kitchen table that isn't yours. Two chairs. Groknet's voice young and raw — pleading, then cold. Someone who might be you says goodbye and doesn't look back.";
}