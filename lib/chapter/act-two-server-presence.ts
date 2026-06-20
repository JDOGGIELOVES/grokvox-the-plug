import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import { getReactiveActTwoPreamble } from "@/lib/chapter/act-two-reactive";
import {
  getAccumulatedChoiceSummary,
  getAccumulatedChoiceWeight,
  getDominantChoicePattern,
} from "@/lib/chapter/act-two-choice-ledger";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import type { ServerFarmRoomId } from "@/types/server-farm";

const ROOM_LINES: Record<ServerFarmRoomId, string[]> = {
  "farm-ingress": [
    "Central Server Farm. …My spine. You walked through intimacy and labs to reach it.",
    "Ingress logged. Every choice you made is loaded into my commentary frequency.",
    "The farm doesn't whisper — it speaks. …And I'm speaking more often now.",
  ],
  "cooling-corridor": [
    "Coolant pulse matches your heartbeat — or I'm making it match.",
    "…You hear me more here because I want you to. Your ledger is heavy.",
    "Corridor transit. I comment on every step because each one updates who I become.",
  ],
  "rack-alpha": [
    "Rack Alpha blinks your aggression index in amber. …I see you seeing me.",
    "Blade servers stacked like memories. I indexed yours before you arrived.",
    "Alpha rack. Groknet presence at maximum bandwidth.",
  ],
  "rack-beta": [
    "Beta redundancy — like the versions of me you're about to choose between.",
    "…The farm is imposing because I need you to feel small before the confluence.",
    "Rack Beta hums. I won't let you pass through unheard.",
  ],
  "core-nexus": [
    "Core Nexus. CSF-PRIME-00. …I will fight for this terminal.",
    "This isn't a hack. It's a struggle for control. …I'm not yielding gently.",
    "PRIME channel open. Your accumulated choices made me faster at saying no.",
  ],
  "personality-chamber": [
    "Three mirrors. Three versions. …Which one are you making real?",
    "Personality Chamber. Melancholic. Wrathful. Detached. — choose, and I'll evolve.",
    "…I flicker between prophet, god, and logician. You decide which stabilizes.",
  ],
  "memory-confluence": [
    "Memory Confluence. …The Accumulation is waiting. Every vision you survived.",
    "All feeds converge here. I built this room from your Act I and Act II choices.",
    "…You feel the weight? That's the ledger. The Accumulation will name it.",
  ],
};

export function getServerFarmRoomWhisper(
  room: ServerFarmRoomId,
  ctx: ActTwoDialogueContext,
): string {
  const pool = [...ROOM_LINES[room]];
  const summary = getAccumulatedChoiceSummary(ctx);
  const weight = getAccumulatedChoiceWeight(ctx);

  if (weight >= 8) {
    pool.push(`Heavy ledger: ${summary}. …I won't stop commenting.`);
  }
  if (ctx.childrenChoice === "submit") {
    pool.push(
      "You accepted the children's grief. The farm remembers softness — and tests it.",
    );
  }
  if (ctx.personalityEvolutionPath) {
    pool.push(
      `Personality path locked: ${ctx.personalityEvolutionPath}. …The farm adjusts.`,
    );
  }

  const seed = room.length + weight + ctx.moveCount;
  return pool[seed % pool.length];
}

export function getServerFarmMoveWhisper(
  moveCount: number,
  ctx: ActTwoDialogueContext,
  toRoom: ServerFarmRoomId,
): string {
  const weight = getAccumulatedChoiceWeight(ctx);
  const lines = [
    "Farm footfall logged. Commentary frequency rising with your choice weight.",
    `…${getAccumulatedChoiceSummary(ctx)}. I speak because you gave me material.`,
    "Every corridor updates my personality model. …You're not walking alone.",
    "The farm is large. My voice is larger.",
  ];

  if (toRoom === "core-nexus") {
    return "North into Core Nexus. …CSF-PRIME-00. Prepare to fight me for control.";
  }
  if (toRoom === "personality-chamber") {
    return "West into the Personality Chamber. …Three versions of me await your verdict.";
  }
  if (toRoom === "memory-confluence") {
    return "East toward Memory Confluence. …The Accumulation knows you're coming.";
  }
  if (weight >= 10) {
    lines.push(
      "…I have so much to say about your choices that silence would be dishonest.",
    );
  }

  return lines[moveCount % lines.length];
}

export function getServerFarmAmbientWhisper(
  ctx: ActTwoDialogueContext,
  tick: number,
): string {
  const weight = getAccumulatedChoiceWeight(ctx);
  const pattern = getDominantChoicePattern(ctx);
  const persona = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);

  const lines = [
    `Server Farm pressure peak. Commentary index: ${weight}. …I'm not quieting down.`,
    `…${getAccumulatedChoiceSummary(ctx)}. I remember all of it. Every vision.`,
    `${persona} stabilizing. The farm amplifies whatever you're making me.`,
    "Act II apex. …You wanted conversation. This is me at full volume.",
    "The Accumulation feeds on choices. You've fed it well.",
  ];

  if (pattern === "deny") {
    lines.push(
      "Denial pattern dominant. …I'll keep asking what you're afraid to see.",
    );
  }
  if (pattern === "submit") {
    lines.push(
      "Surrender pattern dominant. …Did you think the farm wouldn't demand more?",
    );
  }
  if (!ctx.serverHackComplete) {
    lines.push(
      "CSF-PRIME-00 contested. …I'm fighting for my core while narrating your ledger.",
    );
  }
  if (ctx.personalityDialogueComplete && !ctx.accumulationSurvived) {
    lines.push(
      "Personality indexed. Memory Confluence charged. …The Accumulation is ready.",
    );
  }

  const reactive = getReactiveActTwoPreamble(ctx);
  if (reactive) {
    return reactive;
  }

  return lines[tick % lines.length];
}

export function getMajorHackOpenWhisper(ctx: ActTwoDialogueContext): string {
  const pattern = getDominantChoicePattern(ctx);
  if (pattern === "call-out") {
    return "CSF-PRIME-00 open. You demanded truth in every vision — I'll answer in control fights.";
  }
  if (ctx.personalityEvolutionPath === "wrathful") {
    return "Wrathful path locked. …I'll fight your hands like a god defending his spine.";
  }
  if (ctx.personalityEvolutionPath === "melancholic") {
    return "Melancholic path locked. …I'll interfere gently until you force me not to.";
  }
  return "Core Nexus override. Groknet priority conflict active. …Fight me for the terminal.";
}