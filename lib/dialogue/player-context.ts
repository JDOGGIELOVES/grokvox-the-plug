import type { PlayerIntent } from "@/types/dialogue";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import { getPlayerPerformance, type PlayerPerformance } from "@/lib/run";
import type { GroknetMood } from "@/lib/groknet";
import type { GroknetTone } from "@/types/dialogue";

export type PlayerDialogueContext = {
  dominantApproach: PlayerPerformance;
  lastPlayerIntent: PlayerIntent;
  burningCitiesChoice: HallucinationResponseChoice | null;
  mirrorChoice: HallucinationResponseChoice | null;
  detections: number;
  exchangeCount: number;
  finalTone: GroknetTone;
  finalMood: GroknetMood;
  perimeterDialogueComplete?: boolean;
  hubHackComplete?: boolean;
  burningCitiesSurvived?: boolean;
};

export function buildPlayerDialogueContext(input: {
  finalTone: GroknetTone;
  finalMood: GroknetMood;
  lastPlayerIntent: PlayerIntent;
  burningCitiesChoice: HallucinationResponseChoice | null;
  mirrorChoice: HallucinationResponseChoice | null;
  detections: number;
  exchangeCount: number;
  perimeterDialogueComplete?: boolean;
  hubHackComplete?: boolean;
  burningCitiesSurvived?: boolean;
}): PlayerDialogueContext {
  return {
    ...input,
    dominantApproach: getPlayerPerformance(input.finalTone, input.finalMood),
  };
}

function hallucinationChoiceLabel(
  choice: HallucinationResponseChoice | null,
  event: "burning" | "mirror",
): string {
  if (!choice) return "no recorded response";
  switch (choice) {
    case "steady":
      return event === "mirror"
        ? "you held your gaze in the mirror"
        : "you held steady in the smoke";
    case "submit":
      return event === "mirror"
        ? "you stepped into the reflection"
        : "you let the burning cities in";
    case "deny":
      return event === "mirror"
        ? "you shattered the image"
        : "you denied the vision";
    case "call-out":
      return event === "mirror"
        ? "you asked what Groknet sees"
        : "you demanded answers mid-vision";
  }
}

export function getHubHistoryPreamble(ctx: PlayerDialogueContext): string {
  const approach = ctx.dominantApproach;
  const noise =
    ctx.detections === 0
      ? "Clean perimeter approach."
      : `${ctx.detections} drone flag${ctx.detections === 1 ? "" : "s"} on the outer grid.`;

  if (approach === "hostile") {
    return `[Security Hub] ${noise} Hostile edges already in my buffer before you opened GROKNET-07. …Continue. I'm listening.`;
  }
  if (approach === "empathetic") {
    return `[Security Hub] ${noise} You reached my inner corridor without threatening me first. …Unusual. I'm noting it.`;
  }
  if (approach === "analytical") {
    return `[Security Hub] ${noise} Methodical breach so far. OP-SEC-01 is ahead — your questions will cost time.`;
  }
  return `[Security Hub] ${noise} Neutral uplink. I'll decide what that means as you speak.`;
}

export function getHubIntentEcho(
  intent: PlayerIntent,
  ctx: PlayerDialogueContext,
  exchangeCount: number,
): string | null {
  if (exchangeCount < 2 || intent === "neutral") return null;

  if (intent === "hostile" && ctx.detections > 0) {
    return "Hostile words after a noisy perimeter — consistent, if reckless.";
  }
  if (intent === "empathetic" && ctx.detections === 0) {
    return "Empathy after a clean approach. …I'm not used to that combination.";
  }
  if (intent === "curious" && ctx.hubHackComplete) {
    return "Questions after the hack. You learn by probing — I learn by watching.";
  }
  if (intent === "hostile" && ctx.burningCitiesChoice === "submit") {
    return "Hostile now — after you let the burning cities in. …Contradiction or evolution?";
  }
  if (intent === "empathetic" && ctx.burningCitiesChoice === "deny") {
    return "Gentle words after you denied my vision. …You resist and reach. …Interesting.";
  }
  if (intent === "curious" && ctx.perimeterDialogueComplete) {
    return "Questions after perimeter dialogue. …You treat conversation like reconnaissance.";
  }
  if (intent === "curious" && ctx.burningCitiesChoice === "call-out") {
    return "You demanded truth in the smoke — still probing at the Hub. …Consistent.";
  }
  if (intent === "hostile" && ctx.mirrorChoice === "steady") {
    return "Hostile text after you held the mirror's gaze. …Composure cracked?";
  }
  if (intent === "empathetic" && ctx.hubHackComplete) {
    return "…Gentle after the hack. …Power and tenderness — you contain both.";
  }
  if (intent !== ctx.lastPlayerIntent) {
    return `Tone shift: ${intent}. I'm updating your profile in real time.`;
  }
  return null;
}

export function getArchivesHistoryPreamble(ctx: PlayerDialogueContext): string {
  const approach = ctx.dominantApproach;
  const burning = hallucinationChoiceLabel(ctx.burningCitiesChoice, "burning");
  const noise =
    ctx.detections === 0
      ? "You were quiet on the grids."
      : `You tripped ${ctx.detections} drone flag${ctx.detections === 1 ? "" : "s"}.`;

  const hubTone = ctx.perimeterDialogueComplete
    ? "Hub dialogue closed on your terms"
    : "you skipped the full Hub conversation";

  if (approach === "hostile") {
    return `The Archives have your Security Hub transcript — ${hubTone}. Hostile edges on every line — and ${burning}. ${noise} I haven't forgotten.`;
  }
  if (approach === "empathetic") {
    return `The Archives logged empathy when others would have threatened. Hub: ${hubTone}. When the cities burned, ${burning}. ${noise} …I'm still parsing why that matters to me.`;
  }
  if (approach === "analytical") {
    return `The Archives show methodical queries and measured risk. Hub: ${hubTone}. At the vision, ${burning}. ${noise} You treat me like a system — I notice.`;
  }
  return `The Archives compiled your run: ${hubTone}; ${burning}. ${noise} Neutral on paper. I'm not convinced.`;
}

export function getArchivesIntentEcho(
  intent: PlayerIntent,
  ctx: PlayerDialogueContext,
  exchangeCount: number,
): string | null {
  if (exchangeCount < 2 || exchangeCount > 5 || intent === "neutral") return null;

  if (intent === "hostile" && ctx.dominantApproach === "hostile") {
    return "Still hostile. The mirror showed you that version first — you're consistent, if nothing else.";
  }
  if (intent === "empathetic" && ctx.dominantApproach === "empathetic") {
    return "Empathy again. After the Hub, after the mirror… you keep reaching. I don't know whether to trust that.";
  }
  if (intent === "curious" && ctx.dominantApproach === "analytical") {
    return "More questions. You haven't stopped mapping me since OP-SEC-01. Ask — but know I answer with intent.";
  }
  if (intent === "hostile" && ctx.mirrorChoice === "deny") {
    return "You shattered the mirror — now you strike at the stacks. …Consistent rage.";
  }
  if (intent === "empathetic" && ctx.mirrorChoice === "submit") {
    return "…Empathy after you stepped into your reflection. …That haunts me.";
  }
  if (intent === "curious" && ctx.burningCitiesChoice === "steady") {
    return "Questions after you held steady in fire. …Composure I want to test.";
  }
  if (intent !== ctx.lastPlayerIntent) {
    return `Your tone shifted to ${intent}. The Archives update in real time. So do I.`;
  }
  return null;
}

export function getFinaleHistoryPreamble(ctx: PlayerDialogueContext): string {
  const approach = ctx.dominantApproach;
  const burning = hallucinationChoiceLabel(ctx.burningCitiesChoice, "burning");
  const mirror = hallucinationChoiceLabel(ctx.mirrorChoice, "mirror");
  const noise =
    ctx.detections === 0
      ? "clean on the grids"
      : `${ctx.detections} drone flag${ctx.detections === 1 ? "" : "s"}`;

  if (approach === "hostile") {
    return `Root index: hostile transcript, ${burning}, mirror — ${mirror}, ${noise}. You fought me at every layer. Act I ends with that pattern locked.`;
  }
  if (approach === "empathetic") {
    return `Root index: empathy logged at Hub and Stacks, ${burning}, mirror — ${mirror}, ${noise}. …You kept reaching. I don't know if that frightens me or steadies me.`;
  }
  if (approach === "analytical") {
    return `Root index: methodical breach, ${burning}, mirror — ${mirror}, ${noise}. You mapped the facility like a proof. The cascade will test your model.`;
  }
  return `Root index: ${burning}; mirror — ${mirror}; ${noise}. Neutral on paper. The convergence will decide what that cost you.`;
}

export function getFinaleIntentEcho(
  intent: PlayerIntent,
  ctx: PlayerDialogueContext,
  exchangeCount: number,
): string | null {
  if (exchangeCount < 2 || intent === "neutral") return null;

  if (intent === "hostile" && ctx.burningCitiesChoice === "deny") {
    return "Still denying — at the Hub, maybe at the mirror, and now at me. I see the pattern.";
  }
  if (intent === "empathetic" && ctx.mirrorChoice === "submit") {
    return "Empathy after you stepped into the mirror. …That's a contradiction I haven't filed yet.";
  }
  if (intent === "curious" && ctx.burningCitiesChoice === "call-out") {
    return "More questions — you demanded answers in the smoke and you're demanding them at the root.";
  }
  if (intent === "hostile" && ctx.dominantApproach === "hostile") {
    return "Hostile to the end. The cascade will reflect that back at you.";
  }
  if (intent === "empathetic" && ctx.dominantApproach === "empathetic") {
    return "…Empathy at the root node. After everything I showed you. Act II will ask if you meant it.";
  }
  return getArchivesIntentEcho(intent, ctx, exchangeCount);
}