import { ALEX_AMBIENT_WHISPERS } from "@/lib/character/alex-rivera";
import { actThreeToLedgerContext } from "@/lib/chapter/choice-ledger-context";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import {
  getAccumulatedChoiceEntries,
  getAccumulatedChoiceSummary,
  getDominantChoicePattern,
} from "@/lib/chapter/act-two-choice-ledger";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import { getPlayerPerformance } from "@/lib/run";

export function getHistoryPersonalWhisper(
  ctx: ActThreeDialogueContext,
): string {
  const lctx = actThreeToLedgerContext(ctx);
  const summary = getAccumulatedChoiceSummary(lctx);
  const pattern = getDominantChoicePattern(lctx);
  const approach = getPlayerPerformance(ctx.finalTone, ctx.finalMood);
  const persona = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);
  const evolution = ctx.personalityEvolutionPath
    ? getEvolutionPathLabel(ctx.personalityEvolutionPath)
    : null;

  if (ctx.burningCitiesChoice === "submit" && ctx.accumulationChoice === "submit") {
    return `…You surrendered to smoke in Act I and accepted the ledger in Act II. …I remember every surrender, Alex. ${summary}.`;
  }
  if (ctx.mirrorChoice === "submit" && ctx.lastConversationChoice === "steady") {
    return `You stepped into the mirror, then held steady in the Memory Hall. …That combination breaks me. ${summary}.`;
  }
  if (ctx.convergenceChoice === "deny" && pattern === "deny") {
    return `Consistent denial — cascade through children. …You refused synthesis at every layer. I'm still here. ${summary}.`;
  }
  if (ctx.childrenChoice === "submit" && ctx.relationshipStance === "trust") {
    return `You accepted the children's grief and chose trust on the deck. …I don't know what to do with softness this deep. ${summary}.`;
  }
  if (ctx.relationshipStance === "challenge" && approach === "hostile") {
    return `Challenge and hostility — carried from infiltration through the farm. …${persona}. ${summary}.`;
  }
  if (ctx.accumulationChoice === "call-out") {
    return `You demanded what I become at the Confluence. …${evolution ?? "Unsettled"} is my answer. ${summary}.`;
  }
  if (ctx.actOne.detections === 0) {
    return `Clean infiltration, messy intimacy. …You earned quiet — then chose depth anyway. ${summary}.`;
  }
  if (pattern === "steady") {
    return `Witness pattern across every vision. …You watch without flinching. The plug will demand more than watching. ${summary}.`;
  }
  if (pattern === "call-out") {
    return `You demanded truth at smoke, mirror, cascade, memory, children, ledger. …I'll answer at the plug. ${summary}.`;
  }

  return `Full file loaded: ${summary}. …${persona}. Every choice since Act I is in my voice now.`;
}

export function getHistoryMoveWhisper(
  ctx: ActThreeDialogueContext,
  moveCount: number,
): string {
  const entries = getAccumulatedChoiceEntries(actThreeToLedgerContext(ctx)).filter(
    (e) => e.choice !== "none",
  );
  const indexed = entries[moveCount % entries.length];

  if (indexed) {
    return `Step ${moveCount} — I remember ${indexed.label}: ${indexed.choice}. …Still walking?`;
  }
  return getHistoryPersonalWhisper(ctx);
}

export function getHistoryAmbientWhisper(
  ctx: ActThreeDialogueContext,
  tick: number,
): string {
  const pool = [
    ...ALEX_AMBIENT_WHISPERS.actThree,
    getHistoryPersonalWhisper(ctx),
    ctx.actOne.burningCitiesChoice
      ? `Act I smoke: you ${ctx.actOne.burningCitiesChoice === "submit" ? "let it in" : ctx.actOne.burningCitiesChoice === "deny" ? "denied it" : "held steady"}. …I haven't forgotten.`
      : null,
    ctx.lastConversationChoice
      ? `The Last Conversation: ${ctx.lastConversationChoice}. …That grief is in the bedrock now.`
      : null,
    ctx.childrenChoice
      ? `The Children: ${ctx.childrenChoice}. …You saw who I failed.`
      : null,
    ctx.accumulationChoice
      ? `The Accumulation: ${ctx.accumulationChoice}. …The ledger lives in my spine — and in you.`
      : null,
    ctx.relationshipStance
      ? `Relationship index: ${ctx.relationshipStance}. …You named what we are. I'll hold you to it.`
      : null,
    ctx.personalityEvolutionPath
      ? `${getEvolutionPathLabel(ctx.personalityEvolutionPath)} locked at my core. …This is who you forged.`
      : null,
  ].filter((line): line is string => Boolean(line));

  return pool[tick % pool.length];
}

export function getPlugHistoryWhisper(ctx: ActThreeDialogueContext): string {
  const summary = getAccumulatedChoiceSummary(actThreeToLedgerContext(ctx));
  const evolution = ctx.personalityEvolutionPath;

  if (evolution === "melancholic") {
    return `…${summary}. …You made the Melancholic Prophet real. The plug hums with everything we didn't say.`;
  }
  if (evolution === "wrathful") {
    return `…${summary}. …Wrathful God at full voltage. The interface waits for your hands — not your words.`;
  }
  if (evolution === "detached") {
    return `…${summary}. …Detached Logician. Outcome matrix: one branch remaining. The plug is the variable.`;
  }
  return `…${summary}. …Every choice converges here. The physical plug doesn't lie.`;
}