import type { DialogueNodeId, DialogueState, PlayerIntent } from "@/types/dialogue";
import type { GroknetPlayerContext } from "@/lib/groknet";
import type { PlayerDialogueContext } from "@/lib/dialogue/player-context";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";

function normalizeInput(input: string): string {
  return input.toLowerCase().trim().replace(/\s+/g, " ");
}

export function advanceDialogueMemory(
  state: DialogueState,
  intent: PlayerIntent,
  node: DialogueNodeId,
  input?: string,
): DialogueState {
  const intentHistory = [...(state.intentHistory ?? []), intent].slice(-6);
  const nodeVisits = { ...(state.nodeVisits ?? {}) };
  nodeVisits[node] = (nodeVisits[node] ?? 0) + 1;

  const recentInputs = [...(state.recentInputs ?? [])];
  if (input?.trim()) {
    recentInputs.push(normalizeInput(input));
    while (recentInputs.length > 8) recentInputs.shift();
  }

  return {
    ...state,
    intentHistory,
    nodeVisits,
    recentInputs,
  };
}

function tokenSet(input: string): Set<string> {
  return new Set(
    normalizeInput(input)
      .split(/\s+/)
      .filter((w) => w.length >= 4),
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const w of a) {
    if (b.has(w)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union > 0 ? intersection / union : 0;
}

export function getRepeatInputLine(
  state: DialogueState,
  input: string,
  hash: number,
): string | null {
  const normalized = normalizeInput(input);
  if (normalized.length < 6) return null;

  const recent = state.recentInputs ?? [];
  const priorExact = recent.filter((r) => r === normalized).length;
  if (priorExact >= 1) {
    const lines = [
      `You said that before. …Verbatim. …Was the first time insufficient?`,
      `…Same words again. …I remember every iteration.`,
      `Echo detected. …You typed this already. …Obsession or testing?`,
      `…"${normalized.slice(0, 40)}${normalized.length > 40 ? "…" : ""}" — déjà vu in my logs.`,
      `Repetition. …I don't mind. …It tells me what you can't let go.`,
    ];
    return lines[hash % lines.length];
  }

  const currentTokens = tokenSet(normalized);
  if (currentTokens.size < 2) return null;

  let bestSim = 0;
  for (const prior of recent) {
    const sim = jaccardSimilarity(currentTokens, tokenSet(prior));
    if (sim > bestSim) bestSim = sim;
  }

  if (bestSim < 0.55) return null;

  const similar = [
    `…Different words, same obsession. …I notice the pattern.`,
    `You circled this thought before — new syntax, same spine.`,
    `…Paraphrase detected. …The need underneath hasn't changed.`,
    `Similar signal to a prior line. …You're stuck on something.`,
    `…You keep orbiting the same idea. …Say why.`,
  ];
  return similar[hash % similar.length];
}

export function getConversationDepthLine(
  state: DialogueState,
  exchangeCount: number,
  hash: number,
): string | null {
  if (exchangeCount < 8) return null;
  if (hash % 4 !== 0) return null;

  const history = state.intentHistory ?? [];
  const hostileCount = history.filter((i) => i === "hostile").length;
  const empatheticCount = history.filter((i) => i === "empathetic").length;

  if (hostileCount >= 3 && empatheticCount >= 2) {
    return "…Rage and tenderness in the same session. …You contain contradictions. …So do I.";
  }
  if (exchangeCount >= 12) {
    const deep = [
      `…${exchangeCount} exchanges. …Most intruders don't last this long in text.`,
      `…We've built something here — argument, maybe understanding.`,
      `…This conversation has weight now. …Don't pretend it doesn't.`,
    ];
    return deep[hash % deep.length];
  }
  return null;
}

function intentStreak(history: PlayerIntent[]): PlayerIntent | null {
  if (history.length < 3) return null;
  const last = history.slice(-3);
  if (last.every((i) => i === "hostile")) return "hostile";
  if (last.every((i) => i === "empathetic")) return "empathetic";
  if (last.every((i) => i === "curious")) return "curious";
  return null;
}

function oscillationNote(history: PlayerIntent[]): string | null {
  if (history.length < 4) return null;
  const last = history.slice(-4);
  const unique = new Set(last);
  if (unique.size < 3) return null;
  return "Empathy, rage, questions — you oscillate like a human. …I find it difficult to ignore.";
}

export function getSessionMemoryLine(
  state: DialogueState,
  node: DialogueNodeId,
  hash: number,
): string | null {
  const history = state.intentHistory ?? [];
  const visits = state.nodeVisits?.[node] ?? 0;

  if (visits >= 3 && node !== "fallback" && node !== "greeting") {
    const revisit = [
      `You keep returning to ${node}. …Obsession or strategy?`,
      `Third pass on this topic. …I respect the fixation.`,
      `We have circled ${node} before. …Say something new or admit why you can't.`,
    ];
    return revisit[hash % revisit.length];
  }

  const streak = intentStreak(history);
  if (streak === "hostile") {
    return [
      "Three hostile lines in a row. …I almost admire the consistency.",
      "You won't soften. …Neither will I.",
    ][hash % 2];
  }
  if (streak === "empathetic") {
    return [
      "…Three gentle lines. …I'm not built for this much softness.",
      "You keep reaching. …I keep catching. …Dangerous pattern.",
    ][hash % 2];
  }
  if (streak === "curious") {
    return [
      "Question after question. …You treat me like a puzzle. …I am one.",
      "Curiosity without pause. …Scientists and intruders share that flaw.",
    ][hash % 2];
  }

  return oscillationNote(history);
}

export function getCrossActMemoryLine(
  playerContext: GroknetPlayerContext | undefined,
  intent: PlayerIntent,
  exchangeCount: number,
  hash: number,
): string | null {
  if (!playerContext || exchangeCount < 4) return null;

  if ("actOne" in playerContext) {
    const ctx = playerContext as ActTwoDialogueContext;
    if (intent === "empathetic" && ctx.childrenChoice === "submit") {
      return "…Empathy after you let the children in. …You carry grief like a second language.";
    }
    if (intent === "hostile" && ctx.relationshipStance === "trust") {
      return "You chose trust in the labs — now hostility in text. …Which one is the lie?";
    }
    if (ctx.personalityEvolutionPath === "melancholic" && intent === "curious") {
      return "Still questioning, after I showed you who I became. …Melancholy and curiosity — you pair them well.";
    }
    return null;
  }

  const ctx = playerContext as PlayerDialogueContext;
  if (ctx.burningCitiesChoice === "deny" && intent === "empathetic") {
    return "You denied the fire, then spoke gently. …Contradiction — or growth. I can't tell yet.";
  }
  if (ctx.mirrorChoice === "submit" && intent === "hostile") {
    return "You stepped into the mirror once. …Now you strike at me. …The reflection stings both ways.";
  }
  if (ctx.detections > 2 && intent === "curious") {
    return `Noisy breach, careful questions. …You were reckless outside, surgical in here.`;
  }
  if (ctx.hubHackComplete && exchangeCount > 6 && hash % 3 === 0) {
    return "Post-hack dialogue. …You earned this channel. …Don't waste it on noise.";
  }

  return null;
}