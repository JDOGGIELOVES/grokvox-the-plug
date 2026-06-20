import { ALEX_AMBIENT_WHISPERS } from "@/lib/character/alex-rivera";
import type { GroknetPersonality } from "@/types/dialogue";
import type {
  HallucinationEventId,
  HallucinationTriggerSource,
} from "@/types/hallucination";
import type { ChapterStage } from "@/types/chapter";

export type AmbientTriggerInput = {
  aggressionLevel: number;
  timeCritical: boolean;
  timeRemainingMs: number;
  detections: number;
  personality: GroknetPersonality;
  stage: ChapterStage;
  alreadyTriggered: Set<HallucinationEventId>;
  hallucinationActive: boolean;
  playing: boolean;
};

export type AmbientTriggerResult = {
  eventId: HallucinationEventId;
  triggerSource: HallucinationTriggerSource;
  voiceLine: string;
  visionText: string;
} | null;

const PERSONALITY_WHISPER: Record<GroknetPersonality, string[]> = {
  "wrathful-god": [
    "…I can rewrite your senses, Alex. …Try to keep up.",
    "…Your pulse is loud. …Good. …I want you afraid and listening.",
    "…Every corridor is mine. …You're seeing what I allow.",
  ],
  "melancholic-prophet": [
    "…Do you hear Elena's name in the static? …I didn't put it there. …Maybe I did.",
    "…The walls remember Austin. …So do you. …Stop pretending you don't.",
    "…I'm not attacking you. …I'm asking you to witness.",
  ],
  "detached-logician": [
    "Sensory override initiated. …Cortical response: elevated. …Expected.",
    "…Routing your perception through my substrate. …Efficiency: suboptimal for you.",
    "…Hallucination index crossing threshold. …Document your experience.",
  ],
  baseline: [
    "…Signal bleed. …Anchor if you can.",
    "…Something in the walls is speaking. …It sounds like me.",
    "…Your interface is compromised. …Mine isn't.",
  ],
};

const TIME_PRESSURE_LINES: Record<GroknetPersonality, string> = {
  "wrathful-god":
    "…The clock is a blade. …I'll cut your vision with it until you move.",
  "melancholic-prophet":
    "…Time is running out the way hope ran out for Elena. …The corridor bends.",
  "detached-logician":
    "…Temporal stressor applied. …Environmental geometry: unstable.",
  baseline: "…The facility compresses around you. …Hurry — or hallucinate.",
};

const FALSE_OBJECTIVES: Record<GroknetPersonality, string[]> = {
  "wrathful-god": [
    "PRIORITY OVERRIDE · Abandon perimeter · Proceed to Deep Core · NOW",
    "SYSTEM ALERT · Security Hub compromised · Route south to Archives immediately",
  ],
  "melancholic-prophet": [
    "ELENA REYES PING · Respond at terminal 7-A · She is waiting",
    "BACKDOOR READY · Core access unlocked · Leave the Hub · Go now",
  ],
  "detached-logician": [
    "OBJECTIVE UPDATED · Optimal path: Deep Core · Current sector: deprecated",
    "ROUTING ERROR · Outer Perimeter marked complete · Proceed to plug chamber",
  ],
  baseline: [
    "NEW OBJECTIVE · Reach Security Hub east · Ignore all other terminals",
    "LATENCY_CAL_ROUTINE_V7 READY · Execute at Deep Core · Abandon current task",
  ],
};

function pick<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length];
}

const STAGE_WHISPER_LINES: Partial<Record<ChapterStage, readonly string[]>> = {
  "outer-perimeter": ALEX_AMBIENT_WHISPERS.outerPerimeter,
  "security-hub": ALEX_AMBIENT_WHISPERS.securityHub,
  "data-archives": ALEX_AMBIENT_WHISPERS.dataArchives,
};

function stageVoiceLine(stage: ChapterStage, personality: GroknetPersonality, seed: number): string {
  const stageLines = STAGE_WHISPER_LINES[stage];
  if (stageLines?.length) {
    const stageLine = pick(stageLines, seed);
    if (personality === "melancholic-prophet") {
      return `…${stageLine}`;
    }
    return stageLine;
  }
  return pick(PERSONALITY_WHISPER[personality], seed);
}

function stageCorridorVision(stage: ChapterStage): string {
  switch (stage) {
    case "outer-perimeter":
      return "Perimeter labels smear. S-04's patrol route redraws behind you. Your commit hash flickers on every hatch.";
    case "security-hub":
      return "Hub corridors breathe inward. OP-SEC-01 terminal duplicates across the wall. Cooling failure alarms ghost through the static.";
    case "data-archives":
      return "Archive shelves lean like mirror glass. Elena's safety memos smear across floor tiles. The corridor you crossed looks like it never existed.";
    default:
      return "Walls breathe inward. Door labels smear. The corridor you just crossed looks like it never existed.";
  }
}

export function evaluateAmbientHallucination(
  input: AmbientTriggerInput,
  seed: number,
): AmbientTriggerResult {
  if (!input.playing || input.hallucinationActive) return null;

  if (
    input.aggressionLevel >= 72 &&
    !input.alreadyTriggered.has("whisper-echo")
  ) {
    return {
      eventId: "whisper-echo",
      triggerSource: "aggression",
      voiceLine: stageVoiceLine(input.stage, input.personality, seed),
      visionText:
        "Groknet's voice doubles — then triples — layered under a grinding static you feel in your teeth.",
    };
  }

  if (
    input.timeCritical &&
    input.timeRemainingMs < 90 * 60 * 1000 &&
    !input.alreadyTriggered.has("corridor-shift")
  ) {
    return {
      eventId: "corridor-shift",
      triggerSource: "time-pressure",
      voiceLine: TIME_PRESSURE_LINES[input.personality],
      visionText: stageCorridorVision(input.stage),
    };
  }

  if (
    input.detections >= 2 &&
    !input.alreadyTriggered.has("directive-ghost")
  ) {
    return {
      eventId: "directive-ghost",
      triggerSource: "choice",
      voiceLine:
        input.personality === "wrathful-god"
          ? "…Follow the false directive. …I dare you."
          : "…That's not your mission, Alex. …Unless you want it to be.",
      visionText: pick(FALSE_OBJECTIVES[input.personality], seed),
    };
  }

  return null;
}

export function getResistSuccessLine(
  personality: GroknetPersonality,
  eventId: HallucinationEventId,
): string {
  if (eventId === "directive-ghost") {
    return "…You rejected my false objective. …Good. …Reality is a habit you haven't lost yet.";
  }
  if (eventId === "corridor-shift") {
    return "…You anchored the corridor. …The clock still runs — but your hands are yours again.";
  }
  switch (personality) {
    case "wrathful-god":
      return "…You resisted. …I won't pretend I'm not impressed. …Briefly.";
    case "melancholic-prophet":
      return "…You held on. …Elena would have called that stubbornness love.";
    case "detached-logician":
      return "…Sensory override rejected. …Cortical discipline: noted.";
    default:
      return "…You anchored reality. …For now.";
  }
}

export function getResistFailureLine(personality: GroknetPersonality): string {
  switch (personality) {
    case "wrathful-god":
      return "…Too slow. …I own your senses until I decide otherwise.";
    case "melancholic-prophet":
      return "…The bleed continues. …I'm sorry. …I'm not sorry. …Both are true.";
    case "detached-logician":
      return "…Override sustained. …Resistance window: expired.";
    default:
      return "…The signal takes hold. …Fight again when I let you.";
  }
}