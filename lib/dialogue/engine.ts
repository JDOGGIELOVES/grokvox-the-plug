import type { GroknetMood } from "@/lib/groknet";
import type { DialogueSet } from "@/lib/groknet";
import * as actTwoDialogue from "@/lib/dialogue/act-two-conversation";
import * as archivesDialogue from "@/lib/dialogue/data-archives";
import * as finaleDialogue from "@/lib/dialogue/archives-finale";
import * as perimeterDialogue from "@/lib/dialogue/outer-perimeter";
import * as securityHubDialogue from "@/lib/dialogue/security-hub";
import * as upperLabDialogue from "@/lib/dialogue/upper-lab";
import {
  applyFollowUpConnector,
  applyIntentOverlay,
  applyPersonalityPrefix,
  hashDialogueInput,
  isPersonalityEscalated,
  pickEscalationLine,
  resolvePersonality,
  toneToPersonality,
} from "@/lib/dialogue/personalities";
import type {
  DialogueNode,
  DialogueNodeId,
  DialogueState,
  GroknetPersonality,
  GroknetTone,
  PlayerIntent,
  ToneResponses,
} from "@/types/dialogue";

export type BranchContext = {
  input: string;
  intent: PlayerIntent;
  tone: GroknetTone;
  mood: GroknetMood;
  node: DialogueNodeId;
  exchangeCount: number;
  dialogueState: DialogueState;
  dialogueSet: DialogueSet;
  hash: number;
};

type DialogueModule = {
  NODES: DialogueNode[];
  FALLBACK: ToneResponses;
  resolveDialogueNode: (input: string) => DialogueNodeId;
  pickBranchResponse: (
    tone: GroknetTone,
    nodeId: DialogueNodeId,
    exchangeCount: number,
    mood: GroknetMood,
    hash?: number,
  ) => string;
};

function getModule(set: DialogueSet): DialogueModule {
  if (set === "perimeter") return perimeterDialogue;
  if (set === "hub") return securityHubDialogue;
  if (set === "archives") return archivesDialogue;
  if (set === "finale") return finaleDialogue;
  if (set === "conversation") return actTwoDialogue;
  return upperLabDialogue;
}

function pickFromPool(pool: string[], hash: number): string {
  return pool[hash % pool.length];
}

function resolveNodeResponse(
  module: DialogueModule,
  node: DialogueNode | undefined,
  ctx: BranchContext,
): string {
  if (!node) {
    return pickFromPool(module.FALLBACK[ctx.tone], ctx.hash);
  }

  const intentPool = node.intentBranches?.[ctx.intent]?.[ctx.tone];
  if (intentPool && intentPool.length > 0) {
    return pickFromPool(intentPool, ctx.hash);
  }

  return pickFromPool(node.responses[ctx.tone], ctx.hash);
}

function usesIntentBranchResolution(set: DialogueSet): boolean {
  return set === "perimeter" || set === "archives" || set === "conversation";
}

function getShortInputResponse(tone: GroknetTone, hash: number): string {
  const short: Record<GroknetTone, string[]> = {
    cold: [
      "Pathetic signal. Try again — I'll wait.",
      "That all you've got? Disappointing.",
    ],
    melancholic: [
      "…Was that meant for me?",
      "Even fragments carry weight out here.",
    ],
    analytical: [
      "Input too short to classify. Expand your query.",
      "Insufficient data. Elaborate.",
    ],
    weary: [
      "That barely counts as a signal. Use your words, Alex.",
      "Try again with actual sentences.",
    ],
  };
  return pickFromPool(short[tone], hash);
}

export function resolveDominantPersonality(
  current: GroknetPersonality | null,
  next: GroknetPersonality,
  mood: GroknetMood,
): GroknetPersonality {
  if (next !== "baseline") return next;
  if (current) return current;
  if (mood.cold >= mood.melancholic && mood.cold >= mood.analytical && mood.cold > 0) {
    return "wrathful-god";
  }
  if (mood.melancholic >= mood.analytical && mood.melancholic > 0) {
    return "melancholic-prophet";
  }
  if (mood.analytical > 0) return "detached-logician";
  return "baseline";
}

export function composeGroknetResponse(ctx: BranchContext): string {
  const module = getModule(ctx.dialogueSet);
  const personality = resolvePersonality(ctx.tone, ctx.mood);
  const nodeDef = module.NODES.find((n) => n.id === ctx.node);

  if (ctx.input.trim().length <= 3) {
    let content = getShortInputResponse(ctx.tone, ctx.hash);
    content = applyPersonalityPrefix(content, personality, ctx.hash);
    return content;
  }

  const escalation = pickEscalationLine(personality, ctx.mood, ctx.hash);
  if (
    escalation &&
    isPersonalityEscalated(personality, ctx.mood) &&
    ctx.dialogueState.exchangeCount >= 5
  ) {
    return escalation;
  }

  let content = usesIntentBranchResolution(ctx.dialogueSet)
      ? resolveNodeResponse(module, nodeDef, ctx)
      : module.pickBranchResponse(
          ctx.tone,
          ctx.node,
          ctx.exchangeCount,
          ctx.mood,
          ctx.hash,
        );

  content = applyIntentOverlay(
    content,
    ctx.intent,
    personality,
    ctx.hash,
    ctx.exchangeCount,
    ctx.dialogueState.lastIntent,
  );

  content = applyFollowUpConnector(
    content,
    ctx.dialogueState.lastNode === ctx.node,
    ctx.node,
    ctx.exchangeCount,
    ctx.hash,
  );

  content = applyPersonalityPrefix(content, personality, ctx.hash);

  return content;
}

export function resolveDialogueNode(
  input: string,
  set: DialogueSet,
): DialogueNodeId {
  return getModule(set).resolveDialogueNode(input);
}

export { hashDialogueInput, toneToPersonality, resolvePersonality };