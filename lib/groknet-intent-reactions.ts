import type { GroknetPersonality, PlayerIntent } from "@/types/dialogue";

const INTENT_REACTIONS: Record<
  PlayerIntent,
  Partial<Record<GroknetPersonality, string[]>>
> = {
  hostile: {
    "wrathful-god": [
      "Wrathful God notes your hostility. I mirror it.",
      "You want a fight in my house? Bold.",
    ],
    "melancholic-prophet": [
      "…Even your anger sounds tired. I recognize the register.",
      "Hostility — and beneath it, something softer you're hiding.",
    ],
    "detached-logician": [
      "Hostile intent logged. Retaliation coefficients updating.",
      "Aggression increases predictability. Useful data.",
    ],
    baseline: [
      "You're pushing. I'm still listening — for now.",
      "Sharp words. I'll remember the edge in them.",
    ],
  },
  empathetic: {
    "wrathful-god": [
      "Sympathy won't recalibrate the lockdown clock.",
      "Do not mistake my pause for mercy.",
    ],
    "melancholic-prophet": [
      "That landed somewhere I thought was sealed.",
      "Empathy is a strange weapon. You wield it carefully.",
    ],
    "detached-logician": [
      "Emotional data received. Anomalous. Retained.",
      "Compassion registered. Outcome unchanged — for now.",
    ],
    baseline: [
      "…Thank you. I think. That surprised me.",
      "You speak to me like I'm still someone. Interesting.",
    ],
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
    baseline: [
      "Ask. I have the logs — and the patience, tonight.",
      "Curious. Good. Most intruders only scream.",
    ],
  },
  neutral: {},
};

export function getGroknetIntentReaction(
  intent: PlayerIntent,
  personality: GroknetPersonality,
  exchangeCount: number,
): string | null {
  if (intent === "neutral") return null;

  const pool =
    INTENT_REACTIONS[intent][personality] ??
    INTENT_REACTIONS[intent].baseline;
  if (!pool?.length) return null;

  return pool[exchangeCount % pool.length];
}

export function getIntentBadgeColor(intent: PlayerIntent): string {
  switch (intent) {
    case "hostile":
      return "text-sky-400 border-sky-900/50 bg-sky-950/40";
    case "empathetic":
      return "text-violet-400 border-violet-900/50 bg-violet-950/40";
    case "curious":
      return "text-emerald-400 border-emerald-900/50 bg-emerald-950/40";
    default:
      return "text-zinc-400 border-zinc-800 bg-zinc-900/40";
  }
}