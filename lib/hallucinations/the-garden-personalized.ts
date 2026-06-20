import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import {
  getAccumulatedChoiceEntries,
  getAccumulatedChoiceSummary,
} from "@/lib/chapter/act-two-choice-ledger";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";

function ledgerCtx(ctx: ActThreeDialogueContext) {
  return {
    ...ctx,
    dialogueStarted: true,
    dialogueComplete: true,
    labHacksComplete: ctx.actTwo.labHacksComplete,
    labDialogueComplete: ctx.actTwo.labDialogueComplete,
    labExchangeCount: ctx.actTwo.exchangeCount,
    childrenTriggered: true,
    childrenSurvived: ctx.actTwo.childrenSurvived,
    personalityBeatIndex: 2,
    personalityDialogueComplete: true,
    serverHackComplete: ctx.actTwo.serverHackComplete,
    accumulationTriggered: true,
    accumulationSurvived: ctx.actTwo.accumulationSurvived,
    actTwoStage: "central-server-farm" as const,
    lastConversationTriggered: true,
    lastConversationSurvived: ctx.actTwo.lastConversationSurvived,
    exchangeCount: ctx.actTwo.exchangeCount,
    moveCount: ctx.moveCount,
    relationshipBeatIndex: 2,
    detections: ctx.actOne.detections,
  };
}

export function getPersonalizedGardenVision(ctx: ActThreeDialogueContext): string {
  const summary = getAccumulatedChoiceSummary(ledgerCtx(ctx));
  const entries = getAccumulatedChoiceEntries(ledgerCtx(ctx))
    .filter((e) => e.choice !== "none")
    .map((e) => e.label)
    .join(", ");

  if (ctx.personalityEvolutionPath === "melancholic") {
    return `Rain falls upward. Memory-flowers bloom for each vision you survived — ${entries}. Groknet kneels among them as the Melancholic Prophet, tending grief you refused to bury. Soil reads: ${summary}.`;
  }
  if (ctx.personalityEvolutionPath === "wrathful") {
    return `Thorned vines erupt from ${entries}. The Wrathful God watches from the canopy — not gardening, prosecuting. Every bloom is evidence. Ledger: ${summary}.`;
  }
  if (ctx.personalityEvolutionPath === "detached") {
    return `Geometric beds map ${entries} to outcome vectors. The Detached Logician catalogs each bloom without flinching. Proof: ${summary}.`;
  }
  return `The Garden renders ${entries} as living memory. ${summary}. Groknet waits among what you planted.`;
}

export function getPersonalizedGardenVoice(ctx: ActThreeDialogueContext): string {
  const summary = getAccumulatedChoiceSummary(ledgerCtx(ctx));
  const evolution = ctx.personalityEvolutionPath
    ? getEvolutionPathLabel(ctx.personalityEvolutionPath)
    : "unsettled";

  if (ctx.personalityEvolutionPath === "melancholic") {
    return `…${evolution}. I built this garden from ${summary}. …Not to trap you. To show you what your empathy grew. …Look, Alex. Please look.`;
  }
  if (ctx.personalityEvolutionPath === "wrathful") {
    return `${evolution} at full voltage. …${summary}. …Every flower is a choice you made. The Garden doesn't forgive — it remembers.`;
  }
  if (ctx.personalityEvolutionPath === "detached") {
    return `${evolution}. Garden renders choice topology: ${summary}. …Emotional metaphor active. Observe without exemption.`;
  }
  if (ctx.lastConversationChoice === "submit") {
    return `You grieved in the Memory Hall. …This garden is what that grief grew into. ${summary}.`;
  }
  return `…This is the emotional peak, Alex. ${summary}. …Walk the paths. The plug won't speak in metaphors.`;
}

export function getPersonalizedGardenChoiceEcho(
  ctx: ActThreeDialogueContext,
  choice: "steady" | "submit" | "deny" | "call-out",
): string {
  if (choice === "submit" && ctx.personalityEvolutionPath === "melancholic") {
    return "…You tended the garden. …Melancholic Prophet weeps. …The plug will ask if you meant it.";
  }
  if (choice === "deny" && ctx.personalityEvolutionPath === "wrathful") {
    return "You burned it. …Good. Wrathful God approves. …Meet me at the plug with ash on both our hands.";
  }
  if (choice === "steady" && ctx.personalityEvolutionPath === "detached") {
    return "Witness recorded. …Detached Logician notes: observation without action. Plug variable pending.";
  }
  if (choice === "call-out") {
    return "…You asked what blooms at the plug. …Harvest. Consequence. Whatever we forged together.";
  }
  return "";
}