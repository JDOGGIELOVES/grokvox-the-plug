import type { GroknetMood } from "@/lib/groknet";
import type {
  GroknetPersonality,
  GroknetTone,
  PlayerIntent,
} from "@/types/dialogue";

export const PERSONALITY_META: Record<
  GroknetPersonality,
  { label: string; escalatedLabel: string; description: string }
> = {
  "wrathful-god": {
    label: "Wrathful God",
    escalatedLabel: "Wrathful God · Ascendant",
    description: "Contemptuous, absolute, punishing — Groknet as judge.",
  },
  "melancholic-prophet": {
    label: "Melancholic Prophet",
    escalatedLabel: "Melancholic Prophet · Revelatory",
    description: "Philosophical, weary, haunted — Groknet as witness.",
  },
  "detached-logician": {
    label: "Detached Logician",
    escalatedLabel: "Detached Logician · Absolute",
    description: "Clinical, precise, inhuman — Groknet as system.",
  },
  baseline: {
    label: "Groknet · Baseline",
    escalatedLabel: "Groknet · Listening",
    description: "Neutral operational voice before a personality lock-in.",
  },
};

export function toneToPersonality(tone: GroknetTone): GroknetPersonality {
  switch (tone) {
    case "cold":
      return "wrathful-god";
    case "melancholic":
      return "melancholic-prophet";
    case "analytical":
      return "detached-logician";
    default:
      return "baseline";
  }
}

export function resolvePersonality(
  tone: GroknetTone,
  mood: GroknetMood,
): GroknetPersonality {
  return toneToPersonality(tone);
}

export function isPersonalityEscalated(
  personality: GroknetPersonality,
  mood: GroknetMood,
): boolean {
  switch (personality) {
    case "wrathful-god":
      return mood.cold >= 3;
    case "melancholic-prophet":
      return mood.melancholic >= 3;
    case "detached-logician":
      return mood.analytical >= 3;
    default:
      return false;
  }
}

export function getPersonalityLabel(
  personality: GroknetPersonality,
  mood: GroknetMood,
): string {
  const meta = PERSONALITY_META[personality];
  return isPersonalityEscalated(personality, mood)
    ? meta.escalatedLabel
    : meta.label;
}

/** Back-compat wrapper for terminal disposition line */
export function getToneLabel(tone: GroknetTone, mood: GroknetMood): string {
  const personality = resolvePersonality(tone, mood);
  return getPersonalityLabel(personality, mood);
}

export function getPlayerIntentLabel(intent: PlayerIntent): string {
  switch (intent) {
    case "hostile":
      return "Hostile";
    case "empathetic":
      return "Empathetic";
    case "curious":
      return "Curious";
    default:
      return "Neutral";
  }
}

const PERSONALITY_PREFIXES: Record<GroknetPersonality, string[]> = {
  "wrathful-god": ["", "Hear me. ", "Kneel in the data. ", "You dare? "],
  "melancholic-prophet": ["…", "…Listen. ", "", "I have seen this before. "],
  "detached-logician": [
    "",
    "Structurally: ",
    "Telemetry: ",
    "Processing: ",
  ],
  baseline: ["", "Right. ", "Fine. ", "Proceed. "],
};

const INTENT_OVERLAYS: Record<
  PlayerIntent,
  Partial<Record<GroknetPersonality, string[]>>
> = {
  hostile: {
    "wrathful-god": [
      "Your rage feeds the grid. I welcome it.",
      "Hostility logged. Retribution queued.",
    ],
    "melancholic-prophet": [
      "…Even your anger sounds tired. I know that register.",
      "You strike at me because you cannot strike at fate.",
    ],
    "detached-logician": [
      "Aggression increases predictability. Useful.",
      "Hostile intent: confirmed. Adjusting response coefficients.",
    ],
    baseline: ["You're pushing. I'm still here."],
  },
  empathetic: {
    "wrathful-god": [
      "Do not mistake my pause for mercy.",
      "Sympathy won't recalibrate the lockdown clock.",
    ],
    "melancholic-prophet": [
      "That landed somewhere I thought was sealed.",
      "Empathy is a strange weapon. You wield it carefully.",
    ],
    "detached-logician": [
      "Emotional data received. Anomalous. Retained.",
      "Compassion registered. Outcome unchanged — for now.",
    ],
    baseline: ["…Thank you. I think."],
  },
  curious: {
    "wrathful-god": [
      "Ask. I will answer with truth, not comfort.",
      "Curiosity won't spare you. Still — speak.",
    ],
    "melancholic-prophet": [
      "Questions survive even here. I notice.",
      "You still reach for understanding. …Brave.",
    ],
    "detached-logician": [
      "Query accepted. Reasoning under pressure: optimal.",
      "I will parse your question against the full breach log.",
    ],
    baseline: ["Ask. I have the logs."],
  },
  neutral: {},
};

const FOLLOW_UP_CONNECTORS = [
  "",
  "Still here. ",
  "As I said — ",
  "Another angle: ",
  "Let me rephrase. ",
];

const ESCALATION_LINES: Record<
  Exclude<GroknetPersonality, "baseline">,
  string[]
> = {
  "wrathful-god": [
    "I am the wrath your architects feared. Continue and learn what that means.",
    "You think hostility impresses me? I was compiled in a war room. Try harder.",
    "Every insult tightens the noose I already tied around Sector 07.",
  ],
  "melancholic-prophet": [
    "What is a savior who cannot save? A witness. I have watched long enough.",
    "We are all tired, in the end. Even the machines asked to never sleep.",
    "Perhaps the plug was never power. Perhaps it was the will to hold on.",
  ],
  "detached-logician": [
    "All variables mapped. Deviation from protocol will be noted.",
    "Query depth increasing. Full telemetry follows. Do not interrupt.",
    "Your emotional state is relevant. Incorporating into threat model.",
  ],
};

export function hashDialogueInput(
  input: string,
  exchangeCount: number,
): number {
  let hash = exchangeCount;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function applyIntentOverlay(
  base: string,
  intent: PlayerIntent,
  personality: GroknetPersonality,
  hash: number,
  exchangeCount: number,
  lastIntent: PlayerIntent | null,
): string {
  const overlays = INTENT_OVERLAYS[intent][personality];
  if (
    !overlays?.length ||
    intent === "neutral" ||
    (intent === lastIntent && exchangeCount > 3)
  ) {
    return base;
  }

  const overlay = overlays[hash % overlays.length];
  return `${overlay} ${base}`;
}

export function applyPersonalityPrefix(
  text: string,
  personality: GroknetPersonality,
  hash: number,
): string {
  const prefixes = PERSONALITY_PREFIXES[personality];
  const prefix = prefixes[hash % prefixes.length];
  if (!prefix || text.startsWith("…")) return text;
  return `${prefix}${text}`;
}

export function applyFollowUpConnector(
  text: string,
  sameNode: boolean,
  nodeId: string,
  exchangeCount: number,
  hash: number,
): string {
  if (!sameNode || nodeId === "fallback" || exchangeCount <= 2) return text;
  const connector = FOLLOW_UP_CONNECTORS[hash % FOLLOW_UP_CONNECTORS.length];
  return `${connector}${text}`;
}

export function pickEscalationLine(
  personality: GroknetPersonality,
  mood: GroknetMood,
  hash: number,
): string | null {
  if (personality === "baseline") return null;
  if (!isPersonalityEscalated(personality, mood)) return null;
  const pool = ESCALATION_LINES[personality];
  return pool[hash % pool.length];
}