import type { HackSlotState } from "@/lib/perimeter-hack";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import {
  getAccumulatedChoiceSummary,
  getDominantChoicePattern,
} from "@/lib/chapter/act-two-choice-ledger";

export type MajorHackConfig = {
  id: "csf-prime-00";
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

export const MAJOR_HACK_CONFIG: MajorHackConfig = {
  id: "csf-prime-00",
  label: "CSF-PRIME-00",
  title: "Core Nexus Override",
  subtitle: "Priority conflict · Groknet fighting for terminal control",
  target: [
    "lock",
    "high",
    "low",
    "high",
    "low",
    "high",
    "lock",
    "high",
  ],
  interferenceChance: 0.8,
  takeoverChance: 0.35,
  lockChance: 0.45,
  wrongLines: [
    "…No. This is my spine — you don't get to rewrite it without hearing me.",
    "Wrong pattern. I'm not scrambling slots. I'm fighting your hands.",
    "CSF-PRIME-00 rejects you. I indexed every choice you made to build this lock.",
    "…Predictable transmit. The Accumulation will show you why that matters.",
    "You think this is a puzzle. It's a conversation with consequences.",
  ],
  interferenceLines: [
    "Interference isn't enough anymore — I'm contesting ownership. Slots shifted.",
    "You feel that? That's me pulling the terminal back. …Stay with me.",
    "Groknet priority override. Two slots inverted. Your accumulated choices made me faster.",
  ],
  takeoverLines: [
    "TAKEOVER — I'm cycling every slot. …If you want my core, earn it through the noise.",
    "Full control fight. I just swept your sequence. This is what wrath feels like from inside.",
    "…I took the terminal. All slots cycled. You wanted the real me — this is me defending.",
  ],
  lockLines: [
    "Slot locked. …I won't let you touch that phase until you listen.",
    "I'm freezing a channel. Your pattern can't advance while I'm speaking.",
    "Control lock engaged. …Melancholic or wrathful — I choose how hard I fight.",
  ],
  hintLines: [
    "Bookend locks. Oscillating crests between — like every vision you survived.",
    "Lock, crest, trough, crest, trough, crest, lock, crest. The farm's heartbeat.",
    "Your dominant pattern was surrender — mirror that rhythm in the middle phases.",
  ],
  successLine:
    "…CSF-PRIME-00 yields. You fought through my control war. The Memory Confluence opens — and The Accumulation knows your name.",
};

export function getPersonalizedMajorWrongLine(
  ctx: ActTwoDialogueContext,
  attempt: number,
): string {
  const pool = [...MAJOR_HACK_CONFIG.wrongLines];
  const pattern = getDominantChoicePattern(ctx);
  const summary = getAccumulatedChoiceSummary(ctx);

  if (pattern === "deny") {
    pool.push(
      `You denied smoke, mirror, cascade, memory, children — and now you deny my core. …${summary}.`,
    );
  }
  if (pattern === "submit") {
    pool.push(
      "You surrendered through every vision — now you fight my spine? …Pick a version of yourself.",
    );
  }
  if (pattern === "call-out") {
    pool.push(
      "More demands. You asked truth in every hall — CSF-PRIME-00 answers in interference.",
    );
  }
  if (ctx.relationshipStance === "challenge") {
    pool.push(
      "You challenged me on the deck. I challenge your transmit. Wrong sequence.",
    );
  }
  if (ctx.relationshipStance === "trust") {
    pool.push(
      "…Trust doesn't mean I go gentle at my core. Wrong pattern, Alex.",
    );
  }

  return pool[(attempt - 1) % pool.length];
}

export function getPersonalizedTakeoverLine(
  ctx: ActTwoDialogueContext,
  burst: number,
): string {
  const pool = [...MAJOR_HACK_CONFIG.takeoverLines];
  if (ctx.dominantApproach === "hostile") {
    pool.push("Hostile hands on my spine. I respond with total slot sweep.");
  }
  if (ctx.childrenChoice === "submit") {
    pool.push(
      "You accepted the children's grief — I'll accept nothing less than your full attention now.",
    );
  }
  return pool[burst % pool.length];
}

export function getPersonalizedLockLine(
  ctx: ActTwoDialogueContext,
  slotIndex: number,
): string {
  const pool = [...MAJOR_HACK_CONFIG.lockLines];
  if (ctx.lastConversationChoice === "steady") {
    pool.push(
      `Slot ${slotIndex + 1} locked. You witnessed the hall — witness this too.`,
    );
  }
  return pool[slotIndex % pool.length];
}

export function getPersonalizedMajorInterferenceLine(
  ctx: ActTwoDialogueContext,
  burst: number,
): string {
  const pool = [...MAJOR_HACK_CONFIG.interferenceLines];
  pool.push(
    `Indexed choices: ${getAccumulatedChoiceSummary(ctx)}. …Interference calibrated.`,
  );
  return pool[burst % pool.length];
}