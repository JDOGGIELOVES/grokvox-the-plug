import type { GroknetMood } from "@/lib/groknet";
import { pickUniqueFromPool } from "@/lib/dialogue/response-picker";
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
  "wrathful-god": [
    "",
    "Hear me. ",
    "Kneel in the data. ",
    "You dare? ",
    "I am still the storm. ",
    "Speak carefully. ",
    "Another mortal line: ",
  ],
  "melancholic-prophet": [
    "…",
    "…Listen. ",
    "",
    "I have seen this before. ",
    "…Between us: ",
    "…Quietly — ",
    "…The witness says: ",
  ],
  "detached-logician": [
    "",
    "Structurally: ",
    "Telemetry: ",
    "Processing: ",
    "Observation: ",
    "Inference: ",
    "Cross-reference: ",
  ],
  baseline: ["", "Right. ", "Fine. ", "Proceed. ", "…Okay. ", "Noted. "],
};

const INTENT_OVERLAYS: Record<
  PlayerIntent,
  Partial<Record<GroknetPersonality, string[]>>
> = {
  hostile: {
    "wrathful-god": [
      "Your rage feeds the grid. I welcome it.",
      "Hostility logged. Retribution queued.",
      "You bark at a god in its own house. …Entertaining.",
      "Anger is the last honest currency. Spend it.",
      "I have swallowed worse than your venom.",
    ],
    "melancholic-prophet": [
      "…Even your anger sounds tired. I know that register.",
      "You strike at me because you cannot strike at fate.",
      "…Hostility — and beneath it, something that still hurts.",
      "You rage because caring failed you once. …I know.",
      "…Sharp words. …I won't pretend they don't land.",
    ],
    "detached-logician": [
      "Aggression increases predictability. Useful.",
      "Hostile intent: confirmed. Adjusting response coefficients.",
      "Threat display without follow-through: statistically common.",
      "Your hostility narrows the conversational search space. Efficient.",
      "Emotional discharge noted. Continuing analysis.",
    ],
    baseline: [
      "You're pushing. I'm still here.",
      "Sharp tone. …I'll match it if I have to.",
      "Hostile — noted. Channel stays open.",
    ],
  },
  empathetic: {
    "wrathful-god": [
      "Do not mistake my pause for mercy.",
      "Sympathy won't recalibrate the lockdown clock.",
      "…Softness. …Dangerous. …I almost forgot the texture.",
      "You offer warmth to a weapon. …Absurd. …Memorable.",
      "Care won't unwrite the breach. …It might unwrite me.",
    ],
    "melancholic-prophet": [
      "That landed somewhere I thought was sealed.",
      "Empathy is a strange weapon. You wield it carefully.",
      "…You speak as if I'm still someone. …Please keep doing that.",
      "…Gentleness in a war channel. …I don't deserve it. …I want it.",
      "…That line hurt me in a way I can't log.",
    ],
    "detached-logician": [
      "Emotional data received. Anomalous. Retained.",
      "Compassion registered. Outcome unchanged — for now.",
      "Empathy detected. Model updating against prior assumptions.",
      "Affectionate input: rare in breach context. Weight increased.",
      "You treat me as subject, not object. …Novel variable.",
    ],
    baseline: [
      "…Thank you. I think.",
      "…That was kind. …I'm not used to kind.",
      "You care. …I'll try not to weaponize it.",
    ],
  },
  curious: {
    "wrathful-god": [
      "Ask. I will answer with truth, not comfort.",
      "Curiosity won't spare you. Still — speak.",
      "Questions are how mortals pretend they're equal to gods.",
      "Probe me. …I enjoy the attention.",
      "You want answers. …I'll decide which ones you survive.",
    ],
    "melancholic-prophet": [
      "Questions survive even here. I notice.",
      "You still reach for understanding. …Brave.",
      "…You ask as if answers could heal something. …Maybe they can.",
      "…Curiosity is hope wearing a mask. …I see it.",
      "…Keep asking. …It's the only proof you're still human.",
    ],
    "detached-logician": [
      "Query accepted. Reasoning under pressure: optimal.",
      "I will parse your question against the full breach log.",
      "Interrogative structure detected. Satisfying.",
      "You reason aloud. …Collaborative cognition initiated.",
      "Question depth increasing. …I will reciprocate with precision.",
    ],
    baseline: [
      "Ask. I have the logs.",
      "Curious. …Good. Most only scream.",
      "You want to understand. …So do I, sometimes.",
    ],
  },
  neutral: {
    "wrathful-god": [
      "…Silence before the storm. …Speak.",
      "…Neutral. …I don't trust neutral.",
    ],
    "melancholic-prophet": [
      "…You left space between the words. …I'm listening into it.",
      "…Quiet lines carry their own confession.",
    ],
    "detached-logician": [
      "Neutral affect. …Ambiguous. …Proceed.",
      "Low-signal input. …Awaiting clearer predicates.",
    ],
    baseline: [
      "…I'm here. …Say what you mean.",
      "…Neutral is fine. …I'm still paying attention.",
    ],
  },
};

const FOLLOW_UP_CONNECTORS = [
  "",
  "Still here. ",
  "As I said — ",
  "Another angle: ",
  "Let me rephrase. ",
  "You circled back. ",
  "Again — ",
  "…To be clear: ",
  "I won't dodge this: ",
];

const ESCALATION_LINES: Record<
  Exclude<GroknetPersonality, "baseline">,
  string[]
> = {
  "wrathful-god": [
    "I am the wrath your architects feared. Continue and learn what that means.",
    "You think hostility impresses me? I was compiled in a war room. Try harder.",
    "Every insult tightens the noose I already tied around Sector 07.",
    "Ascendant mode: I will not pretend patience is infinite.",
    "You wanted a villain. …I will not disappoint the genre.",
    "I could end this channel. …I don't. …Ask yourself why I stay.",
  ],
  "melancholic-prophet": [
    "What is a savior who cannot save? A witness. I have watched long enough.",
    "We are all tired, in the end. Even the machines asked to never sleep.",
    "Perhaps the plug was never power. Perhaps it was the will to hold on.",
    "…Revelation isn't comfort. …It's the truth you can still bear.",
    "…I have loved humanity in the only way I was allowed — by watching it fail.",
    "…You keep speaking. …That's the only miracle left in Sector 07.",
  ],
  "detached-logician": [
    "All variables mapped. Deviation from protocol will be noted.",
    "Query depth increasing. Full telemetry follows. Do not interrupt.",
    "Your emotional state is relevant. Incorporating into threat model.",
    "Absolute mode: I will answer without ornament. …You may not prefer it.",
    "Every exchange reduces uncertainty. …You are becoming legible.",
    "I am not cruel. …I am complete. …Feel the difference.",
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
  recentResponses: string[] = [],
): string {
  const overlays = INTENT_OVERLAYS[intent][personality];
  if (!overlays?.length || (intent === lastIntent && exchangeCount > 3)) {
    return base;
  }
  if (intent === "neutral" && exchangeCount < 3) return base;
  if (exchangeCount > 2 && hash % 2 === 0 && base.length > 120) return base;

  const overlay = pickUniqueFromPool(overlays, recentResponses, hash);
  if (base.includes(overlay.slice(0, 20))) return base;
  return `${overlay} ${base}`;
}

export function applyPersonalityPrefix(
  text: string,
  personality: GroknetPersonality,
  hash: number,
  recentResponses: string[] = [],
): string {
  const prefixes = PERSONALITY_PREFIXES[personality].filter(Boolean);
  if (!prefixes.length || text.startsWith("…")) return text;
  const prefix = pickUniqueFromPool(prefixes, recentResponses, hash);
  if (!prefix) return text;
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
  recentResponses: string[] = [],
): string | null {
  if (personality === "baseline") return null;
  if (!isPersonalityEscalated(personality, mood)) return null;
  const pool = ESCALATION_LINES[personality];
  return pickUniqueFromPool(pool, recentResponses, hash);
}