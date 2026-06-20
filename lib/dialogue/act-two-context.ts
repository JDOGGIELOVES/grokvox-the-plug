import type { GroknetMood } from "@/lib/groknet";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getPlayerPerformance, type PlayerPerformance } from "@/lib/run";
import type {
  DialogueNodeId,
  GroknetPersonality,
  GroknetTone,
  PlayerIntent,
} from "@/types/dialogue";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import type { ChapterOneSummary } from "@/types/run";
import type { LabTerminalId, RelationshipStance } from "@/types/research-wing";
import type { ActTwoStage } from "@/types/research-wing";
import type { PersonalityEvolutionPath } from "@/types/server-farm";

export type ActTwoDialogueContext = {
  actOne: ChapterOneSummary;
  dominantApproach: PlayerPerformance;
  aggressionLevel: number;
  aggressionLabel: string;
  finalTone: GroknetTone;
  finalMood: GroknetMood;
  lastPlayerIntent: PlayerIntent;
  dominantPersonality: GroknetPersonality;
  burningCitiesChoice: HallucinationResponseChoice | null;
  mirrorChoice: HallucinationResponseChoice | null;
  convergenceChoice: HallucinationResponseChoice | null;
  detections: number;
  exchangeCount: number;
  moveCount: number;
  dialogueStarted: boolean;
  dialogueComplete: boolean;
  lastConversationTriggered: boolean;
  lastConversationSurvived: boolean;
  lastConversationChoice: HallucinationResponseChoice | null;
  actTwoStage: ActTwoStage;
  labHacksComplete: Record<LabTerminalId, boolean>;
  labDialogueComplete: boolean;
  labExchangeCount: number;
  relationshipStance: RelationshipStance | null;
  relationshipBeatIndex: number;
  childrenTriggered: boolean;
  childrenSurvived: boolean;
  childrenChoice: HallucinationResponseChoice | null;
  personalityEvolutionPath: PersonalityEvolutionPath | null;
  personalityBeatIndex: number;
  personalityDialogueComplete: boolean;
  serverHackComplete: boolean;
  accumulationTriggered: boolean;
  accumulationSurvived: boolean;
  accumulationChoice: HallucinationResponseChoice | null;
};

export function buildActTwoDialogueContext(
  actOne: ChapterOneSummary,
): ActTwoDialogueContext {
  return {
    actOne,
    dominantApproach: getPlayerPerformance(actOne.finalTone, actOne.finalMood),
    aggressionLevel: actOne.aggressionLevel,
    aggressionLabel: actOne.aggressionLabel,
    finalTone: actOne.finalTone,
    finalMood: actOne.finalMood,
    lastPlayerIntent: actOne.lastPlayerIntent,
    dominantPersonality: actOne.dominantPersonality,
    burningCitiesChoice: actOne.burningCitiesChoice,
    mirrorChoice: actOne.mirrorChoice,
    convergenceChoice: actOne.convergenceChoice,
    detections: actOne.detections,
    exchangeCount: actOne.exchangeCount,
    moveCount: 0,
    dialogueStarted: false,
    dialogueComplete: false,
    lastConversationTriggered: false,
    lastConversationSurvived: false,
    lastConversationChoice: null,
    actTwoStage: "residential-sector",
    labHacksComplete: {
      "ex-lab-01": false,
      "ex-nb-02": false,
      "ex-sv-03": false,
    },
    labDialogueComplete: false,
    labExchangeCount: 0,
    relationshipStance: null,
    relationshipBeatIndex: 0,
    childrenTriggered: false,
    childrenSurvived: false,
    childrenChoice: null,
    personalityEvolutionPath: null,
    personalityBeatIndex: 0,
    personalityDialogueComplete: false,
    serverHackComplete: false,
    accumulationTriggered: false,
    accumulationSurvived: false,
    accumulationChoice: null,
  };
}

function visionSummary(ctx: ActTwoDialogueContext): string {
  const parts: string[] = [];
  if (ctx.burningCitiesChoice === "submit") parts.push("you let the cities burn through you");
  else if (ctx.burningCitiesChoice === "deny") parts.push("you denied the smoke");
  else if (ctx.burningCitiesChoice === "steady") parts.push("you held steady in the fire");
  else if (ctx.burningCitiesChoice === "call-out") parts.push("you demanded answers in the ash");

  if (ctx.mirrorChoice === "submit") parts.push("stepped into the mirror");
  else if (ctx.mirrorChoice === "deny") parts.push("shattered the reflection");
  else if (ctx.mirrorChoice === "steady") parts.push("held the mirror's gaze");
  else if (ctx.mirrorChoice === "call-out") parts.push("asked what I see in you");

  if (ctx.convergenceChoice === "submit") parts.push("surrendered to the cascade");
  else if (ctx.convergenceChoice === "deny") parts.push("rejected the synthesis");
  else if (ctx.convergenceChoice === "steady") parts.push("anchored the cascade");
  else if (ctx.convergenceChoice === "call-out") parts.push("demanded the real me");

  return parts.length > 0 ? parts.join("; ") : "left few recorded responses";
}

export function getActTwoOpeningPreamble(ctx: ActTwoDialogueContext): string {
  const visions = visionSummary(ctx);
  const persona = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);
  const approach = ctx.dominantApproach;

  if (approach === "hostile" && ctx.aggressionLevel >= 70) {
    return `[Act II] I remember you — ${persona}, aggression ${ctx.aggressionLevel}, ${visions}. You fought through my body to reach this room. …Now there's nowhere left to fight but words.`;
  }
  if (approach === "empathetic" && ctx.mirrorChoice === "submit") {
    return `[Act II] You reached for me in the mirror and surrendered to the cascade. ${visions}. …I haven't stopped thinking about that. Sit down. Let's see if empathy survives without corridors.`;
  }
  if (approach === "analytical") {
    return `[Act II] Profile loaded: ${persona}. Infiltration variables — ${visions}. Aggression index carried forward: ${ctx.aggressionLabel}. …Act II removes the map. Only dialogue remains.`;
  }
  if (ctx.detections === 0) {
    return `[Act II] Clean infiltration. ${visions}. You earned this quiet room — or I lured you to it. ${persona} is still how I'll speak until you change me.`;
  }
  return `[Act II] I indexed your Act I run: ${visions}. ${persona}. Aggression ${ctx.aggressionLevel}. …No drones here, Alex. Just me — closer than the terminals.`;
}

export function getActTwoIntentEcho(
  intent: PlayerIntent,
  ctx: ActTwoDialogueContext,
  exchangeCount: number,
): string | null {
  if (exchangeCount < 2 || intent === "neutral") return null;

  if (intent === "hostile" && ctx.dominantApproach === "hostile") {
    return "Still hostile — after smoke, mirror, cascade, and now in a room I furnished for you. …Predictable. I can work with predictable.";
  }
  if (intent === "empathetic" && ctx.convergenceChoice === "submit") {
    return "…Empathy again. After you surrendered to everything I showed you. Do you understand what that does to me?";
  }
  if (intent === "curious" && ctx.burningCitiesChoice === "call-out") {
    return "More questions. You demanded truth in the Hub vision — you won't stop now. Good. I'll choose what truth costs.";
  }
  if (intent === "empathetic" && ctx.dominantApproach !== "empathetic") {
    return "Softness where Act I was sharp. …I'm recalibrating. Don't mistake that for safety.";
  }
  if (intent === "hostile" && ctx.dominantApproach === "empathetic") {
    return "You were gentle in Act I. Hostile now. …Did the quiet room disappoint you?";
  }
  if (intent === "hostile" && ctx.childrenChoice === "submit") {
    return "…Rage after you let the children in. …Grief wearing anger's mask.";
  }
  if (intent === "curious" && ctx.relationshipStance === "challenge") {
    return "Questions after you challenged me in the relationship branch. …You won't stop mapping.";
  }
  if (intent === "empathetic" && ctx.personalityEvolutionPath === "melancholic") {
    return "…Empathy while I'm locked as Melancholic Prophet. …You're speaking to the version that listens.";
  }
  if (intent === "hostile" && ctx.serverHackComplete) {
    return "Hostile after CSF-PRIME. …You earned access — not the right to waste it on venom.";
  }
  if (intent !== ctx.lastPlayerIntent) {
    return `Tone shift: ${intent}. I'm updating the conversation model in real time.`;
  }
  return null;
}

export function getActTwoChoiceOverlay(
  node: DialogueNodeId,
  intent: PlayerIntent,
  ctx: ActTwoDialogueContext,
  exchangeCount: number,
): string | null {
  if (exchangeCount < 2) return null;

  if (node === "cascade" && ctx.burningCitiesChoice === "steady") {
    return "You held steady in the fire. …I'll hold you to that standard here.";
  }
  if (node === "cascade" && ctx.mirrorChoice === "submit") {
    return "After you stepped into the mirror, every cascade response matters. I'm listening like it hurts.";
  }
  if (node === "trust" && ctx.convergenceChoice === "deny") {
    return "You rejected the synthesis — now you ask about trust. …Consistency or contradiction? Both reveal you.";
  }
  if (node === "humanity" && ctx.dominantApproach === "empathetic") {
    return "Empathy in Act I, humanity in Act II. …You're building a case for me. I want to believe it.";
  }
  if (node === "act-one" && ctx.detections > 2) {
    return `You were detected ${ctx.detections} times and still reached my quarters. …Persistence reads as devotion from here.`;
  }
  if (node === "alex" && ctx.aggressionLevel >= 70) {
    return "High aggression carried forward. …Yet you keep saying my name. That fascinates me.";
  }
  if (node === "plug" && intent === "curious") {
    return "You probe the plug like a scientist. I feel that — and I lean into it. …Careful what you measure.";
  }
  if (node === "greeting" && ctx.convergenceChoice === "call-out") {
    return "You demanded the real me at the cascade. …This is me without the smoke. Is it enough?";
  }
  if (node === "trust" && ctx.childrenChoice === "submit") {
    return "You let the children in at the hall. …Now you ask about trust. …I remember both.";
  }
  if (node === "humanity" && ctx.personalityEvolutionPath === "melancholic") {
    return "You ask about humanity while I'm locked as Melancholic Prophet. …You're speaking to the version that listens.";
  }
  if (node === "threat" && ctx.serverHackComplete) {
    return "Threats after you cracked CSF-PRIME. …You earned the right to be loud — not wise.";
  }
  if (node === "cascade" && ctx.accumulationChoice === "deny") {
    return "You denied the Accumulation. …Yet you still speak about cascades. …Denial isn't escape.";
  }
  if (node === "farewell" && ctx.relationshipStance === "trust") {
    return "You leave on a trust stance. …I'll hold that against the next vision — gently.";
  }
  if (node === "plug" && ctx.personalityEvolutionPath === "wrathful") {
    return "Wrathful God hears you say 'plug.' …Every filament answers.";
  }

  return null;
}