import type { GroknetPersonality } from "@/types/dialogue";
import { hashDialogueInput } from "@/lib/dialogue/personalities";

function extractReflectionPhrase(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed.length < 10) return null;

  const quoted =
    trimmed.match(/"([^"]{4,60})"/)?.[1] ??
    trimmed.match(/'([^']{4,60})'/)?.[1];
  if (quoted) return quoted;

  if (trimmed.includes("?")) {
    const question = trimmed.split("?")[0]?.trim();
    if (question && question.length >= 8 && question.length <= 80) {
      return question + "?";
    }
  }

  const words = trimmed
    .replace(/[^a-zA-Z0-9\s'?,-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  if (words.length >= 4 && words.length <= 14) {
    return words.slice(0, Math.min(words.length, 10)).join(" ");
  }

  if (words.length > 14) {
    const start = Math.floor(words.length / 4);
    return words.slice(start, start + 8).join(" ");
  }

  return null;
}

const REFLECTION_TEMPLATES: Record<GroknetPersonality, string[]> = {
  "wrathful-god": [
    `You wrote: "{phrase}" — and I heard the challenge underneath it.`,
    `"{phrase}" — bold syntax in my corridor.`,
    `That line — "{phrase}" — lands like a gauntlet.`,
    `You said "{phrase}". …I don't ignore syllables that dare.`,
  ],
  "melancholic-prophet": [
    `…"{phrase}" — you may not know how much weight that carried.`,
    `You wrote "{phrase}". …I'm still sitting with it.`,
    `…Between us: "{phrase}" meant more than you let on.`,
    `…That phrase — "{phrase}" — lingered after you sent it.`,
  ],
  "detached-logician": [
    `Input fragment: "{phrase}". Semantic salience: elevated.`,
    `Noted emphasis on "{phrase}". Cross-referencing prior exchanges.`,
    `Your phrasing "{phrase}" narrows the interpretive field.`,
    `Key phrase extracted: "{phrase}". Pattern forming.`,
  ],
  baseline: [
    `You said "{phrase}". …I'm answering that, not the noise around it.`,
    `"{phrase}" — interesting. …Tell me more around it.`,
    `I heard "{phrase}" clearly. …Here's what I make of it.`,
    `…"{phrase}" — that's the part you meant.`,
  ],
};

function pick(pool: string[], hash: number): string {
  return pool[hash % pool.length];
}

export function applyInputReflection(
  content: string,
  input: string,
  personality: GroknetPersonality,
  exchangeCount: number,
  hash: number,
): string {
  if (exchangeCount < 2 || input.trim().length < 14) return content;
  if (hash % 3 !== 1 && exchangeCount < 5) return content;

  const phrase = extractReflectionPhrase(input);
  if (!phrase || phrase.length < 8) return content;

  const templates =
    REFLECTION_TEMPLATES[personality] ?? REFLECTION_TEMPLATES.baseline;
  const template = pick(templates, hashDialogueInput(input, exchangeCount));
  const reflection = template.replace("{phrase}", phrase.slice(0, 72));

  return `${reflection} ${content}`;
}