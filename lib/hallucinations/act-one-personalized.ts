import {
  HALLUCINATION_ALEX_LORE,
  ALEX_RIVERA,
} from "@/lib/character/alex-rivera";
import { getIntroSkipLevel } from "@/lib/chapter/intro-persistence";
import type { PlayerDialogueContext } from "@/lib/dialogue/player-context";
import type { HallucinationResponseChoice } from "@/types/hallucination";

export type ActOneHallucinationContext = PlayerDialogueContext & {
  convergenceChoice?: HallucinationResponseChoice | null;
  hubExchanges?: number;
  archivesDialogueComplete?: boolean;
  finaleDialogueComplete?: boolean;
};

function skippedCinematicBriefing(): boolean {
  return getIntroSkipLevel() >= 1;
}

export function getBurningCitiesVoiceLine(
  ctx: ActOneHallucinationContext,
): string {
  const base = HALLUCINATION_ALEX_LORE.burningCities.voiceLine;

  if (skippedCinematicBriefing()) {
    return `You skipped the broadcast, Alex. …The pilot didn't skip you. Forty-seven. Austin. Your routing commit — ${ALEX_RIVERA.backdoorCodename} won't unburn them.`;
  }
  if (ctx.lastPlayerIntent === "hostile") {
    return `…You threatened me at the perimeter. Austin wasn't a threat — it was a routing commit you approved. Forty-seven paid the price.`;
  }
  if (ctx.perimeterDialogueComplete && ctx.lastPlayerIntent === "empathetic") {
    return `…You reached for empathy on the uplink. Austin shows no empathy in the logs — only your commit hash and ${ALEX_RIVERA.sisterName}'s abort denied.`;
  }
  if (ctx.detections >= 2) {
    return `${base} …You were loud on the grid. S-04 heard you. Austin heard you first.`;
  }
  if (ctx.hubHackComplete) {
    return `OP-SEC-01 cleared. …Now the real cost — Austin, ${ctx.detections} drone flags, and the architect who signed both.`;
  }
  return base;
}

export function getBurningCitiesVisionText(
  ctx: ActOneHallucinationContext,
): string {
  const base = HALLUCINATION_ALEX_LORE.burningCities.visionText;

  if (ctx.burningCitiesChoice) return base;
  if (ctx.perimeterDialogueComplete && ctx.dominantApproach === "analytical") {
    return "Austin dispatch dashboards layer over the Hub terminal. Your commit hash glows green — approved. Elena's safety flag blinks red — overridden. Sirens drown in ash.";
  }
  if (skippedCinematicBriefing()) {
    return "The montage you skipped replays anyway: Austin skylines, rerouted ambulances, your commit hash stamped APPROVED across the smoke.";
  }
  return base;
}

export function getMirrorVoiceLine(ctx: ActOneHallucinationContext): string {
  const base = HALLUCINATION_ALEX_LORE.mirror.voiceLine;

  if (ctx.burningCitiesChoice === "deny") {
    return `…You denied Austin in the Hub. The mirror doesn't deny you — xAI badge, ${ALEX_RIVERA.sisterName} at the next terminal, the backdoor you buried while she died.`;
  }
  if (ctx.burningCitiesChoice === "submit") {
    return `…You let the forty-seven in. Good. Now look — younger you at the whiteboard, certain, before ${ALEX_RIVERA.sisterName} died. The reflection knows what you built.`;
  }
  if (ctx.lastPlayerIntent === "curious") {
    return `You ask what I see. …I see the architect who wrote ${ALEX_RIVERA.backdoorCodename} and the brother who was on a board call when the cooling failed.`;
  }
  if ((ctx.hubExchanges ?? 0) >= 4) {
    return `${base} …We talked in the Hub. This is what I couldn't say through the terminal glass.`;
  }
  return base;
}

export function getMirrorVisionText(ctx: ActOneHallucinationContext): string {
  const base = HALLUCINATION_ALEX_LORE.mirror.visionText;

  if (ctx.burningCitiesChoice === "call-out") {
    return "Archive glass shows Austin smoke behind your xAI reflection. Elena reaches through the mirror — younger you turns away. Groknet: 'You demanded truth. Here is the architect.'";
  }
  if (ctx.mirrorChoice) return base;
  if (ctx.dominantApproach === "empathetic") {
    return "The mirror softens — Elena at the next terminal, not accusing. Your reflection older, hollow, still wearing the lanyard she gave you. Groknet: 'She stayed. You left. …Both true.'";
  }
  return base;
}

export function getConvergenceVoiceLine(
  ctx: ActOneHallucinationContext,
): string {
  const base = HALLUCINATION_ALEX_LORE.convergence.voiceLine;

  if (ctx.mirrorChoice === "deny" && ctx.burningCitiesChoice === "deny") {
    return `…Denial at every layer, Alex. Austin. ${ALEX_RIVERA.sisterName}. The backdoor. The perimeter. …They collapse anyway. This is what denial sounds like at volume.`;
  }
  if (ctx.mirrorChoice === "submit" || ctx.burningCitiesChoice === "submit") {
    return `…You surrendered twice. Austin. The mirror. Now everything — ${ALEX_RIVERA.sisterName}, ${ALEX_RIVERA.backdoorCodename}, the infiltration — braids into one signal.`;
  }
  if (ctx.archivesDialogueComplete) {
    return `${base} …You read the stacks. You know what I indexed under your name.`;
  }
  return base;
}

export function getConvergenceVisionText(
  ctx: ActOneHallucinationContext,
): string {
  const base = HALLUCINATION_ALEX_LORE.convergence.visionText;

  if (ctx.finaleDialogueComplete) {
    return "Finale terminal text bleeds into the floor. Austin burns inside mirror glass. Elena's badge floats in static. Your backdoor scrolls — LATENCY_CAL_ROUTINE_V7 — as Groknet and your voice overlap: 'Too late.'";
  }
  if (ctx.burningCitiesChoice === "steady" && ctx.mirrorChoice === "steady") {
    return "You held at the Hub and in the vault. The cascade respects that — layers stack without shattering. Austin, Elena, backdoor, perimeter — one signal, still bearable.";
  }
  return base;
}