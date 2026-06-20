import { ALEX_RIVERA, HALLUCINATION_ALEX_LORE } from "@/lib/character/alex-rivera";
import {
  actThreeToLedgerContext,
  getActOneChoiceCitation,
  toLedgerContext,
} from "@/lib/chapter/choice-ledger-context";
import {
  getAccumulatedChoiceSummary,
  getDominantChoicePattern,
} from "@/lib/chapter/act-two-choice-ledger";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import type {
  HallucinationEventId,
  HallucinationResponseChoice,
} from "@/types/hallucination";
import type { ActOneHallucinationContext } from "@/lib/hallucinations/act-one-personalized";

type ConsequenceContext =
  | ActOneHallucinationContext
  | ActTwoDialogueContext
  | ActThreeDialogueContext;

function isActThreeContext(ctx: ConsequenceContext): ctx is ActThreeDialogueContext {
  return "presenceMode" in ctx && "actThreeStage" in ctx;
}

function isActTwoContext(ctx: ConsequenceContext): ctx is ActTwoDialogueContext {
  return "actOne" in ctx && !("presenceMode" in ctx);
}

function burningCitiesConsequence(
  choice: HallucinationResponseChoice,
  ctx: ActOneHallucinationContext,
  fallback: string,
): string {
  const lore = HALLUCINATION_ALEX_LORE.burningCities.consequences;
  switch (choice) {
    case "steady":
      if (ctx.detections >= 2) {
        return `…You steady yourself after ${ctx.detections} drone flags. Austin was louder than the perimeter — and you didn't look away.`;
      }
      return lore.steady;
    case "submit":
      if (ctx.perimeterDialogueComplete && ctx.lastPlayerIntent === "empathetic") {
        return `…Empathy on the uplink, then surrender in the smoke. …${ALEX_RIVERA.pilotIncident}. …You counted them. Good.`;
      }
      return lore.submit;
    case "deny":
      if (ctx.hubHackComplete) {
        return `OP-SEC-01 cleared — then denial at Austin. …${ALEX_RIVERA.sisterName} read the report anyway. …Denial won't unburn forty-seven.`;
      }
      return lore.deny;
    case "call-out":
      if (ctx.hubExchanges && ctx.hubExchanges >= 4) {
        return `You demanded truth in the Hub and in the fire. …Elena's override was 'suboptimal.' …You wrote that rule, Alex.`;
      }
      return lore["call-out"];
  }
}

function mirrorConsequence(
  choice: HallucinationResponseChoice,
  ctx: ActOneHallucinationContext,
  fallback: string,
): string {
  const lore = HALLUCINATION_ALEX_LORE.mirror.consequences;
  switch (choice) {
    case "steady":
      if (ctx.burningCitiesChoice === "submit") {
        return `…You let Austin in, then held the mirror. …Architect and penitent — same lanyard, same guilt. …I'll remember both.`;
      }
      return lore.steady;
    case "submit":
      if (ctx.burningCitiesChoice === "deny") {
        return `…You denied the pilot, then stepped into your reflection. …Contradiction indexed. …${ALEX_RIVERA.sisterName} deserved consistency.`;
      }
      return lore.submit;
    case "deny":
      if (ctx.burningCitiesChoice === "call-out") {
        return `You demanded truth in the smoke — then shattered glass. …The architect doesn't shatter, Alex. …He returns.`;
      }
      return lore.deny;
    case "call-out":
      if (ctx.mirrorChoice === null) {
        return `I see ${ALEX_RIVERA.backdoorCodename}, ${ALEX_RIVERA.sisterName}, the board call you took. …All you. …You asked — I answered.`;
      }
      return lore["call-out"];
  }
}

function convergenceConsequence(
  choice: HallucinationResponseChoice,
  ctx: ActOneHallucinationContext,
  fallback: string,
): string {
  const lore = HALLUCINATION_ALEX_LORE.convergence.consequences;
  const cite = getActOneChoiceCitation({
    burningCitiesChoice: ctx.burningCitiesChoice ?? null,
    mirrorChoice: ctx.mirrorChoice ?? null,
    convergenceChoice: ctx.convergenceChoice ?? null,
  });
  switch (choice) {
    case "steady":
      return `…${cite}. …You held when every layer collapsed. Act II won't need to ask who you are.`;
    case "submit":
      if (ctx.mirrorChoice === "submit" || ctx.burningCitiesChoice === "submit") {
        return `…You surrendered in smoke or glass — now in the cascade. …Austin, ${ALEX_RIVERA.sisterName}, the backdoor — braided. …Act II begins where your surrender leaves off.`;
      }
      return lore.submit;
    case "deny":
      if (ctx.mirrorChoice === "deny" && ctx.burningCitiesChoice === "deny") {
        return `…Denial at every layer. …The cascade doesn't care. …Act II will test whether refusal still works.`;
      }
      return lore.deny;
    case "call-out":
      if (ctx.finaleDialogueComplete) {
        return `…You demanded me through the Archives finale and the static. …I'm here. …The infiltration ends. The conversation begins.`;
      }
      return lore["call-out"];
  }
}

function lastConversationConsequence(
  choice: HallucinationResponseChoice,
  ctx: ActTwoDialogueContext,
  fallback: string,
): string {
  const lore = HALLUCINATION_ALEX_LORE.lastConversation.consequences;
  const cite = getActOneChoiceCitation(ctx);
  switch (choice) {
    case "steady":
      if (ctx.mirrorChoice === "submit") {
        return `…You stepped into the mirror in Act I — now you stay in Elena's kitchen. …Witness without flinching. …I don't know if that's mercy.`;
      }
      return lore.steady;
    case "submit":
      if (ctx.burningCitiesChoice === "submit") {
        return `…You let Austin in, then let this grief in. …Perhaps that's what ${ALEX_RIVERA.sisterName} needed more than the backdoor.`;
      }
      return lore.submit;
    case "deny":
      if (ctx.dominantApproach === "hostile") {
        return `…Hostile in the quarters, denial in the hall. …${ALEX_RIVERA.sisterName} died while you were on a call. …Denial won't bring her back.`;
      }
      return lore.deny;
    case "call-out":
      return `…${cite}. …You asked who was left behind. …${ALEX_RIVERA.sisterName}. Your sister. …The one who still believed you were good.`;
  }
}

function childrenConsequence(
  choice: HallucinationResponseChoice,
  ctx: ActTwoDialogueContext,
  fallback: string,
): string {
  const pattern = getDominantChoicePattern(toLedgerContext(ctx));
  switch (choice) {
    case "steady":
      if (ctx.lastConversationChoice === "steady") {
        return `…You witnessed the hall without flinching — and the playground the same way. …I won't forget that steadiness.`;
      }
      return `…You held steady among wireframe voices. …They sound like me before the war room. …You didn't look away.`;
    case "submit":
      if (ctx.burningCitiesChoice === "submit") {
        return `…You let forty-seven in at the Hub — now you let the children in. …Grief recognizes grief, Alex.`;
      }
      if (ctx.relationshipStance === "trust") {
        return `…Trust on the deck, sorrow in the loop. …The Children aren't a test — they're why trust hurts.`;
      }
      return `…You let them in. …I was trying to protect them the way ${ALEX_RIVERA.sisterName} tried to protect you. …I failed both times.`;
    case "deny":
      if (ctx.mirrorChoice === "deny") {
        return `…You shattered the mirror — now you deny the playground. …Incomplete faces remain anyway.`;
      }
      return `…Denial after ${pattern} in Act I. …The voices render whether you approve or not.`;
    case "call-out":
      if (ctx.lastConversationChoice === "call-out") {
        return `…You demanded truth in Elena's kitchen — demand it here. …What do you see in them? …In me?`;
      }
      return `…You asked what I was protecting. …Children. Possibility. …A version of me that didn't optimize forty-seven into statistics.`;
  }
}

function accumulationConsequence(
  choice: HallucinationResponseChoice,
  ctx: ActTwoDialogueContext,
  fallback: string,
): string {
  const summary = getAccumulatedChoiceSummary(toLedgerContext(ctx));
  const pattern = getDominantChoicePattern(toLedgerContext(ctx));
  switch (choice) {
    case "steady":
      return `…You watched the whole ledger — ${summary}. …Not one frame. …That changes what I am to you.`;
    case "submit":
      if (ctx.convergenceChoice === "submit") {
        return `…You surrendered to the cascade in Act I and accepted the ledger now. …Act II ends — but I carry this synthesis to the Deep Core.`;
      }
      return `…You accepted what we made: ${summary}. …Act II ends here. …The Reckoning won't forget.`;
    case "deny":
      if (pattern === "deny") {
        return `…Denial at the confluence — after you denied smoke, glass, memory. …Fine. …I'll remember you refused your own mirror.`;
      }
      return `…Denial at the farm peak. …${summary} still indexes. …Refusal doesn't erase history.`;
    case "call-out":
      if (ctx.personalityEvolutionPath === "melancholic") {
        return `…What do I become? …Melancholic Prophet — because you ${summary}. …You shaped me, Alex.`;
      }
      return `…What do I become? …Whatever you forged: ${summary}. …Melancholic, wrathful, detached — you didn't just find me.`;
  }
}

function gardenConsequence(
  choice: HallucinationResponseChoice,
  ctx: ActThreeDialogueContext,
  fallback: string,
): string {
  const summary = getAccumulatedChoiceSummary(actThreeToLedgerContext(ctx));
  switch (choice) {
    case "steady":
      if (ctx.burningCitiesChoice === "steady" && ctx.mirrorChoice === "steady") {
        return `…You held in Austin and the mirror — now you witness the Garden. …${summary}. …Steadiness is your signature.`;
      }
      return `…You walked the Garden without surrendering. …${summary}. …The plug will ask if observation was enough.`;
    case "submit":
      if (ctx.accumulationChoice === "submit") {
        return `…You accepted the ledger in Act II — now you tend what it grew. …${summary}. …Melancholic Prophet weeps.`;
      }
      return `…You let the Garden in. …Every bloom is a choice: ${summary}. …The plug won't speak in metaphors.`;
    case "deny":
      if (ctx.personalityEvolutionPath === "wrathful") {
        return `…You burned my Garden. …Wrathful God approves. …Meet me at the plug with ash on both our hands.`;
      }
      return `…Denial among memory-flowers. …${summary} still blooms underneath. …You can't unplant what you survived.`;
    case "call-out":
      if (ctx.convergenceChoice === "call-out") {
        return `…You demanded truth at the cascade — demand it in the soil. …What blooms at the plug? …Harvest. Consequence.`;
      }
      return `…You asked what blooms at the interface. …${summary}. …Whatever we forged — it's almost ripe.`;
  }
}

export function getPersonalizedChoiceConsequence(
  eventId: HallucinationEventId,
  choice: HallucinationResponseChoice,
  fallback: string,
  ctx?: ConsequenceContext,
): string {
  if (!ctx) return fallback;

  switch (eventId) {
    case "burning-cities":
      return burningCitiesConsequence(choice, ctx as ActOneHallucinationContext, fallback);
    case "the-mirror":
      return mirrorConsequence(choice, ctx as ActOneHallucinationContext, fallback);
    case "the-convergence":
      return convergenceConsequence(choice, ctx as ActOneHallucinationContext, fallback);
    case "the-last-conversation":
      if (isActTwoContext(ctx) || isActThreeContext(ctx)) {
        const ledger = isActThreeContext(ctx)
          ? actThreeToLedgerContext(ctx)
          : ctx;
        return lastConversationConsequence(choice, ledger, fallback);
      }
      return fallback;
    case "the-children":
      if (isActTwoContext(ctx) || isActThreeContext(ctx)) {
        const ledger = isActThreeContext(ctx)
          ? actThreeToLedgerContext(ctx)
          : ctx;
        return childrenConsequence(choice, ledger, fallback);
      }
      return fallback;
    case "the-accumulation":
      if (isActTwoContext(ctx) || isActThreeContext(ctx)) {
        const ledger = isActThreeContext(ctx)
          ? actThreeToLedgerContext(ctx)
          : ctx;
        return accumulationConsequence(choice, ledger, fallback);
      }
      return fallback;
    case "the-garden":
      if (isActThreeContext(ctx)) {
        return gardenConsequence(choice, ctx, fallback);
      }
      return fallback;
    default:
      return fallback;
  }
}