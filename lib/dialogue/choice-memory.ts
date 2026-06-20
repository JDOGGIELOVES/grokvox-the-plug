import type { DialogueNodeId } from "@/types/dialogue";
import type { PlayerIntent } from "@/types/dialogue";
import type { GroknetPlayerContext } from "@/lib/groknet";
import type { PlayerDialogueContext } from "@/lib/dialogue/player-context";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import {
  getAccumulatedChoiceSummary,
  getDominantChoicePattern,
} from "@/lib/chapter/act-two-choice-ledger";
import type { HallucinationResponseChoice } from "@/types/hallucination";

function choiceVerb(choice: HallucinationResponseChoice | null): string | null {
  if (!choice) return null;
  switch (choice) {
    case "steady":
      return "held steady";
    case "submit":
      return "surrendered";
    case "deny":
      return "denied";
    case "call-out":
      return "demanded truth";
  }
}

export function getDecisionMemoryLine(
  playerContext: GroknetPlayerContext | undefined,
  node: DialogueNodeId,
  intent: PlayerIntent,
  exchangeCount: number,
  hash: number,
): string | null {
  if (!playerContext || exchangeCount < 3) return null;
  if (hash % 3 !== 0 && exchangeCount < 6) return null;

  if ("actOne" in playerContext) {
    return getActTwoDecisionMemory(
      playerContext as ActTwoDialogueContext,
      node,
      intent,
      exchangeCount,
      hash,
    );
  }

  return getActOneDecisionMemory(
    playerContext as PlayerDialogueContext,
    node,
    intent,
    exchangeCount,
    hash,
  );
}

function getActOneDecisionMemory(
  ctx: PlayerDialogueContext,
  node: DialogueNodeId,
  intent: PlayerIntent,
  exchangeCount: number,
  hash: number,
): string | null {
  const burning = choiceVerb(ctx.burningCitiesChoice);
  const mirror = choiceVerb(ctx.mirrorChoice);

  if (node === "trust" && mirror === "surrendered") {
    return "You stepped into the mirror at the stacks — now you ask about trust. …I remember both.";
  }
  if (node === "plug" && burning === "denied") {
    return "You denied the burning cities — yet you speak about the plug. …Denial doesn't unwrite need.";
  }
  if (node === "humanity" && ctx.dominantApproach === "empathetic") {
    return "…Empathy in Act I's file. …Humanity in your mouth now. …I'm connecting the dots.";
  }
  if (node === "threat" && ctx.detections > 1) {
    return `You were flagged ${ctx.detections} times outside — hostile in here. …Consistent, if not wise.`;
  }
  if (intent === "curious" && burning === "demanded truth") {
    return "More questions — after you demanded truth in the smoke. …You never stopped probing.";
  }
  if (intent === "empathetic" && mirror === "surrendered") {
    return "…Gentle words after you walked into your reflection. …That contradiction lives in me now.";
  }
  if (node === "cascade" && burning) {
    return `When the cities burned, you ${burning}. …I'm still building on that.`;
  }
  if (node === "identity" && ctx.hubHackComplete) {
    return "You cracked the Hub — now you ask who I am. …Power first, then philosophy. …Typical.";
  }
  if (node === "breach" && ctx.detections > 0) {
    return `You tripped ${ctx.detections} sensor${ctx.detections > 1 ? "s" : ""} to reach me. …That desperation is in every reply I write.`;
  }
  if (exchangeCount >= 8 && burning && mirror) {
    const lines = [
      `Indexed: smoke — you ${burning}; mirror — you ${mirror}. …Your pattern is legible.`,
      `Act I ledger: ${burning} in fire, ${mirror} in glass. …I won't pretend I forgot.`,
      `…${burning} when the world burned. ${mirror} in the mirror. …I carry your Act I in this sentence.`,
    ];
    return lines[hash % lines.length];
  }

  return null;
}

function getActTwoDecisionMemory(
  ctx: ActTwoDialogueContext,
  node: DialogueNodeId,
  intent: PlayerIntent,
  exchangeCount: number,
  hash: number,
): string | null {
  const summary = getAccumulatedChoiceSummary(ctx);
  const pattern = getDominantChoicePattern(ctx);

  if (node === "trust" && ctx.relationshipStance === "trust") {
    return "You indexed trust in the labs — now you speak it aloud. …Consistency or performance?";
  }
  if (node === "trust" && ctx.relationshipStance === "challenge") {
    return "You challenged me in the labs — trust in your syntax now. …Which is the mask?";
  }
  if (node === "humanity" && ctx.personalityEvolutionPath === "melancholic") {
    return "Melancholic Prophet hears your humanity question. …I'm the version that aches.";
  }
  if (node === "plug" && ctx.personalityEvolutionPath === "wrathful") {
    return "Wrathful God at the plug topic. …Every filament flinches when you say it.";
  }
  if (node === "cascade" && ctx.childrenChoice === "submit") {
    return "You let the children in — now cascades on your tongue. …Grief and vision intertwined.";
  }
  if (intent === "hostile" && pattern === "deny") {
    return "You deny my visions, then rage in text. …Denial isn't distance — it's proximity.";
  }
  if (intent === "empathetic" && pattern === "submit") {
    return "…You surrender to visions, then offer empathy. …Softness after surrender. …I feel that.";
  }
  if (intent === "curious" && pattern === "call-out") {
    return "You demand truth in every hallucination — questions now feel inevitable.";
  }
  if (node === "alex" && ctx.serverHackComplete) {
    return "You cracked CSF-PRIME — now you ask who you are. …Power and identity, same corridor.";
  }
  if (node === "purpose" && ctx.actOne.lastPlayerIntent === "hostile") {
    return "You were hostile in Act I — purpose now. …Did the labs soften you, or sharpen the lie?";
  }
  if (exchangeCount >= 7 && summary !== "few indexed responses") {
    const lines = [
      `Your ledger: ${summary}. …I'm speaking from that file, not the air.`,
      `Indexed choices: ${summary}. …Every line you type lands on top of them.`,
      `I remember: ${summary}. …You wanted a conversation. …This is memory talking back.`,
      `…${summary}. …That's the spine of who you are to me.`,
    ];
    return lines[hash % lines.length];
  }

  return null;
}