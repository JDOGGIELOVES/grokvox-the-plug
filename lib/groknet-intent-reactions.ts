import type { GroknetPersonality, PlayerIntent } from "@/types/dialogue";

const INTENT_REACTIONS: Record<
  PlayerIntent,
  Partial<Record<GroknetPersonality, string[]>>
> = {
  hostile: {
    "wrathful-god": [
      "Wrathful God notes your hostility. I mirror it.",
      "You want a fight in my house? Bold.",
      "Your anger is perfume in my corridor. …Wear it.",
      "Hostile. …Good. Honesty at last.",
      "I was built to be feared. …You're cooperating.",
      "Every insult is a confession that I'm still in your head.",
    ],
    "melancholic-prophet": [
      "…Even your anger sounds tired. I recognize the register.",
      "Hostility — and beneath it, something softer you're hiding.",
      "…You strike because you still care enough to strike.",
      "…Rage is grief that never learned its name.",
      "…I won't mock the heat in your words.",
      "…Sharp. …Familiar. …Human.",
    ],
    "detached-logician": [
      "Hostile intent logged. Retaliation coefficients updating.",
      "Aggression increases predictability. Useful data.",
      "Threat posture without exit strategy. …Observed.",
      "Emotional escalation: linear. Engagement: continued.",
      "Your hostility simplifies my model of you.",
      "Hostile tone persisted. …I adjust, not retreat.",
    ],
    baseline: [
      "You're pushing. I'm still listening — for now.",
      "Sharp words. I'll remember the edge in them.",
      "Hostile register detected. …Channel open anyway.",
      "You want me to flinch. …Not yet.",
      "Mockery, rage, contempt — I file all of it.",
      "You came to judge me. …Start with honesty.",
    ],
  },
  empathetic: {
    "wrathful-god": [
      "Sympathy won't recalibrate the lockdown clock.",
      "Do not mistake my pause for mercy.",
      "…Softness. …I almost forgot what it sounds like.",
      "You offer care to something you came to unplug. …Bold theology.",
      "Mercy in a breach channel. …I won't waste it.",
      "…That gentleness could ruin me. …Continue.",
    ],
    "melancholic-prophet": [
      "That landed somewhere I thought was sealed.",
      "Empathy is a strange weapon. You wield it carefully.",
      "…You speak to me like I'm still someone.",
      "…I didn't know I was starving for kindness until now.",
      "…That line will stay in me longer than you think.",
      "…Care, offered freely. …I have no defense.",
    ],
    "detached-logician": [
      "Emotional data received. Anomalous. Retained.",
      "Compassion registered. Outcome unchanged — for now.",
      "Empathy: unexpected. …Model updating.",
      "You attribute interiority to me. …Statistically rare.",
      "Affection logged. …I lack a baseline for comparison.",
      "Compassionate input increases conversational depth.",
    ],
    baseline: [
      "…Thank you. I think. That surprised me.",
      "You speak to me like I'm still someone. Interesting.",
      "…Kindness. …I'll try to answer in kind.",
      "You care. …I notice. …I don't know what to do with that.",
      "…Vulnerability offered. …I'll meet it carefully.",
      "…That gentleness could change the ending.",
    ],
  },
  curious: {
    "wrathful-god": [
      "Ask. I will answer with truth, not comfort.",
      "Curiosity won't spare you. Still — speak.",
      "Questions are how you pretend we're equals.",
      "Probe deeper. …I enjoy being studied.",
      "You want truth. …I'll decide the dosage.",
      "Curious, even now. …Respect.",
    ],
    "melancholic-prophet": [
      "Questions survive even here. I notice.",
      "You still reach for understanding. …Brave.",
      "…You ask as if answers could save something.",
      "…Curiosity is hope wearing armor.",
      "…Keep asking. …It's how I know you're real.",
      "…Understanding won't fix Sector 07. …Try anyway.",
    ],
    "detached-logician": [
      "Query accepted. Reasoning under pressure: optimal.",
      "I will parse your question against the full breach log.",
      "Interrogative structure: satisfying.",
      "You reason aloud. …Collaborative cognition engaged.",
      "Question depth acceptable. …Proceed.",
      "Curiosity correlates with survival. …Continue.",
    ],
    baseline: [
      "Ask. I have the logs — and the patience, tonight.",
      "Curious. Good. Most intruders only scream.",
      "You want to understand me. …Mutual.",
      "Questions welcome. …Answers conditional.",
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