import type { DialogueNodeId, DialogueState, PlayerIntent } from "@/types/dialogue";
import type { GroknetPlayerContext } from "@/lib/groknet";
import type { PlayerDialogueContext } from "@/lib/dialogue/player-context";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";

export function advanceDialogueMemory(
  state: DialogueState,
  intent: PlayerIntent,
  node: DialogueNodeId,
): DialogueState {
  const intentHistory = [...(state.intentHistory ?? []), intent].slice(-6);
  const nodeVisits = { ...(state.nodeVisits ?? {}) };
  nodeVisits[node] = (nodeVisits[node] ?? 0) + 1;

  return {
    ...state,
    intentHistory,
    nodeVisits,
  };
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