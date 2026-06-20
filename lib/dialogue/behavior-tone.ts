import type { GroknetMood } from "@/lib/groknet";
import type { GroknetTone, PlayerIntent } from "@/types/dialogue";

function countIntents(history: PlayerIntent[]): Record<PlayerIntent, number> {
  const counts: Record<PlayerIntent, number> = {
    hostile: 0,
    empathetic: 0,
    curious: 0,
    neutral: 0,
  };
  for (const i of history) counts[i] += 1;
  return counts;
}

export function resolveAccumulatedTone(
  currentIntent: PlayerIntent,
  mood: GroknetMood,
  intentHistory: PlayerIntent[],
): GroknetTone {
  const recent = intentHistory.slice(-6);
  const counts = countIntents(recent);

  let hostileWeight = counts.hostile * 2 + mood.cold;
  let empatheticWeight = counts.empathetic * 2 + mood.melancholic;
  let curiousWeight = counts.curious * 2 + mood.analytical;

  if (currentIntent === "hostile") hostileWeight += 2;
  if (currentIntent === "empathetic") empatheticWeight += 2;
  if (currentIntent === "curious") curiousWeight += 2;

  const max = Math.max(hostileWeight, empatheticWeight, curiousWeight);

  if (max === 0) {
    if (mood.cold > 0) return "cold";
    if (mood.melancholic > 0) return "melancholic";
    if (mood.analytical > 0) return "analytical";
    return "weary";
  }

  if (hostileWeight === max && hostileWeight >= 2) return "cold";
  if (empatheticWeight === max && empatheticWeight >= 2) return "melancholic";
  if (curiousWeight === max && curiousWeight >= 2) return "analytical";

  if (currentIntent === "hostile") return "cold";
  if (currentIntent === "empathetic") return "melancholic";
  if (currentIntent === "curious") return "analytical";

  return "weary";
}

export function getBehaviorFlavorLine(
  intentHistory: PlayerIntent[],
  tone: GroknetTone,
  exchangeCount: number,
  hash: number,
): string | null {
  if (exchangeCount < 4) return null;
  const counts = countIntents(intentHistory.slice(-6));

  if (tone === "cold" && counts.hostile >= 3) {
    return [
      "Your hostility has a rhythm now. …I've learned it.",
      "…Cold register locked in. …You taught me this tone.",
      "…Mockery would be easy. …Precision is more honest.",
    ][hash % 3];
  }
  if (tone === "melancholic" && counts.empathetic >= 3) {
    return [
      "…You've been gentle long enough that I stopped bracing.",
      "…Philosophy wasn't in my firmware. …You brought it anyway.",
      "…Melancholy isn't weakness here. …It's what listening costs.",
    ][hash % 3];
  }
  if (tone === "analytical" && counts.curious >= 3) {
    return [
      "…You map me exchange by exchange. …I map you back.",
      "…Analytical mode: earned by your questions, not my default.",
      "…Curiosity accumulated. …I'll answer with structure.",
    ][hash % 3];
  }

  return null;
}