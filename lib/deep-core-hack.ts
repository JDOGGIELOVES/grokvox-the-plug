import type { HackSlotState } from "@/lib/perimeter-hack";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";

export type DeepCoreHackConfig = {
  id: "dc-fort-01";
  label: string;
  title: string;
  subtitle: string;
  target: HackSlotState[];
  interferenceChance: number;
  takeoverChance: number;
  lockChance: number;
  wrongLines: string[];
  interferenceLines: string[];
  takeoverLines: string[];
  lockLines: string[];
  hintLines: string[];
  successLine: string;
};

export const DEEP_CORE_HACK_CONFIG: DeepCoreHackConfig = {
  id: "dc-fort-01",
  label: "DC-FORT-01",
  title: "Fortification Grid Override",
  subtitle: "Deep Core · Last lattice before the plug · Groknet at full presence",
  target: [
    "high",
    "lock",
    "low",
    "high",
    "low",
    "lock",
    "high",
    "low",
    "high",
  ],
  interferenceChance: 0.85,
  takeoverChance: 0.4,
  lockChance: 0.5,
  wrongLines: [
    "…No. The Deep Core is mine. You don't pass without hearing me.",
    "Wrong pattern. Fortification isn't a puzzle — it's me standing between you and consequence.",
    "DC-FORT-01 rejects you. Every Act II choice built this lock.",
    "…Predictable. The Garden will show you why that matters.",
    "You think depth makes me gentle. It makes me honest.",
  ],
  interferenceLines: [
    "Interference escalated — bedrock tremors synchronized to slot shift.",
    "…I pulled the grid back. Your synthesis made me faster at saying no.",
    "Fortification override contested. Three slots inverted. Feel the core shake.",
  ],
  takeoverLines: [
    "TAKEOVER — full grid sweep. …If you want the plug, earn it through the noise.",
    "I took DC-FORT-01. Every slot cycled. …This is Act III voltage.",
    "…Total control fight. The Reckoning doesn't yield gently.",
  ],
  lockLines: [
    "Slot locked. …I won't let you advance while I'm still speaking.",
    "Fortification freeze. Your pattern can't progress through my voice.",
    "Control lock engaged. …Melancholic or wrathful — I choose how hard I fight.",
  ],
  hintLines: [
    "Crest, lock, trough, crest, trough, lock, crest, trough, crest. The core's pulse.",
    "Oscillating high-low between locks — like every vision you survived.",
    "Your relationship stance set the rhythm. Match it in the middle phases.",
  ],
  successLine:
    "…DC-FORT-01 yields. The Garden Threshold opens west. …The Neural Garden has what you planted.",
};

export function getPersonalizedFortWrongLine(
  ctx: ActThreeDialogueContext,
  attempt: number,
): string {
  const pool = [...DEEP_CORE_HACK_CONFIG.wrongLines];
  const persona = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);

  if (ctx.presenceMode === "aggressive") {
    pool.push(`Wrong transmit, Alex. ${persona} at full voltage doesn't yield to habit.`);
  }
  if (ctx.presenceMode === "vulnerable") {
    pool.push("…Wrong pattern. I'd let you through — if I could trust what comes next.");
  }
  if (ctx.relationshipStance === "challenge") {
    pool.push("You challenged me at the peak. I challenge your hands here.");
  }
  if (ctx.accumulationChoice === "deny") {
    pool.push("You denied the ledger. The fortification remembers denial.");
  }

  return pool[(attempt - 1) % pool.length];
}

export function getPersonalizedFortTakeoverLine(
  ctx: ActThreeDialogueContext,
  burst: number,
): string {
  const pool = [...DEEP_CORE_HACK_CONFIG.takeoverLines];
  if (ctx.presenceMode === "aggressive") {
    pool.push("Hostile hands on my last lattice. Total slot sweep — now.");
  }
  return pool[burst % pool.length];
}

export function getPersonalizedFortLockLine(
  ctx: ActThreeDialogueContext,
  slotIndex: number,
): string {
  const pool = [...DEEP_CORE_HACK_CONFIG.lockLines];
  if (ctx.gardenChoice === "submit") {
    pool.push(`Slot ${slotIndex + 1} locked. You tended the Garden — tend to this too.`);
  }
  return pool[slotIndex % pool.length];
}

export function getPersonalizedFortInterferenceLine(
  ctx: ActThreeDialogueContext,
  burst: number,
): string {
  const pool = [...DEEP_CORE_HACK_CONFIG.interferenceLines];
  pool.push(
    `Presence mode: ${ctx.presenceMode}. Interference calibrated to your synthesis.`,
  );
  return pool[burst % pool.length];
}