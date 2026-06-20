import type { GroknetMood } from "@/lib/groknet";
import type { DialogueSet } from "@/lib/groknet";
import * as actTwoDialogue from "@/lib/dialogue/act-two-conversation";
import * as archivesDialogue from "@/lib/dialogue/data-archives";
import * as finaleDialogue from "@/lib/dialogue/archives-finale";
import * as perimeterDialogue from "@/lib/dialogue/outer-perimeter";
import * as securityHubDialogue from "@/lib/dialogue/security-hub";
import * as upperLabDialogue from "@/lib/dialogue/upper-lab";
import {
  buildContextualReply,
  getDirectInputAck,
} from "@/lib/dialogue/contextual-reply";
import { applyAttitudeShift } from "@/lib/dialogue/emotional-voice";
import { applyInputReflection } from "@/lib/dialogue/input-reflector";
import {
  applyInputEcho,
  matchPhraseResponse,
  matchSemanticResponse,
} from "@/lib/dialogue/input-matcher";
import { applyPersonalityVoice } from "@/lib/dialogue/personality-voice";
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
import { pickRichFallback } from "@/lib/dialogue/rich-fallbacks";
import { pickUniqueFromPool } from "@/lib/dialogue/response-picker";
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

function recentResponses(ctx: BranchContext): string[] {
  return ctx.dialogueState.recentResponses ?? [];
}

function resolveNodeResponse(
  module: DialogueModule,
  node: DialogueNode | undefined,
  ctx: BranchContext,
): string {
  const recent = recentResponses(ctx);

  if (!node) {
    return pickUniqueFromPool(module.FALLBACK[ctx.tone], recent, ctx.hash);
  }

  const intentPool = node.intentBranches?.[ctx.intent]?.[ctx.tone];
  if (intentPool && intentPool.length > 0) {
    return pickUniqueFromPool(intentPool, recent, ctx.hash);
  }

  return pickUniqueFromPool(node.responses[ctx.tone], recent, ctx.hash);
}

function usesIntentBranchResolution(set: DialogueSet): boolean {
  return set === "perimeter" || set === "archives" || set === "conversation";
}

const SHORT_INPUT: Record<GroknetTone, string[]> = {
  cold: [
    "Pathetic signal. Try again — I'll wait.",
    "That all you've got? Disappointing.",
    "Two syllables won't breach my patience. Elaborate.",
  ],
  melancholic: [
    "…Was that meant for me?",
    "Even fragments carry weight out here.",
    "…Say more. …I'm listening.",
  ],
  analytical: [
    "Input too short to classify. Expand your query.",
    "Insufficient data. Elaborate.",
    "Token count: unacceptable. Continue.",
  ],
  weary: [
    "That barely counts as a signal. Use your words, Alex.",
    "Try again with actual sentences.",
    "…Mumble louder. …Or don't. …I'll wait.",
  ],
};

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

function resolveActivePersonality(ctx: BranchContext): GroknetPersonality {
  const tonePersonality = resolvePersonality(ctx.tone, ctx.mood);
  const sticky = ctx.dialogueState.dominantPersonality;
  if (sticky && sticky !== "baseline") return sticky;
  return tonePersonality;
}

function finalizeResponse(
  content: string,
  ctx: BranchContext,
  personality: GroknetPersonality,
  options: { personalized?: boolean } = {},
): string {
  const recent = recentResponses(ctx);
  const personalized = options.personalized ?? false;

  let result = content;

  if (!personalized) {
    result = applyIntentOverlay(
      result,
      ctx.intent,
      personality,
      ctx.hash,
      ctx.exchangeCount,
      ctx.dialogueState.lastIntent,
      recent,
    );
  }

  result = applyAttitudeShift(
    result,
    ctx.dialogueState.lastIntent,
    ctx.intent,
    personality,
    ctx.mood,
    ctx.tone,
    ctx.exchangeCount,
    ctx.hash,
    ctx.input,
  );

  const ack = personalized
    ? null
    : getDirectInputAck(ctx.input, personality, recent, ctx.hash + 1);
  if (ack && !result.includes(ack.slice(0, 24))) {
    result = `${ack} ${result}`;
  }

  result = applyInputReflection(
    result,
    ctx.input,
    personality,
    ctx.exchangeCount,
    ctx.hash + 2,
    recent,
    personalized,
  );

  if (!personalized && ctx.exchangeCount >= 4 && ctx.hash % 5 === 0) {
    result = applyInputEcho(
      result,
      ctx.input,
      personality,
      ctx.exchangeCount,
      ctx.hash,
    );
  }

  result = applyPersonalityPrefix(result, personality, ctx.hash, recent);

  if (!personalized) {
    result = applyPersonalityVoice(
      result,
      personality,
      ctx.intent,
      ctx.exchangeCount,
      ctx.hash + 5,
      recent,
    );
  }

  return result;
}

export function composeGroknetResponse(ctx: BranchContext): string {
  const module = getModule(ctx.dialogueSet);
  const personality = resolveActivePersonality(ctx);
  const nodeDef = module.NODES.find((n) => n.id === ctx.node);
  const recent = recentResponses(ctx);

  if (ctx.input.trim().length <= 3) {
    const content = pickUniqueFromPool(SHORT_INPUT[ctx.tone], recent, ctx.hash);
    return applyPersonalityPrefix(content, personality, ctx.hash, recent);
  }

  const phraseMatch = matchPhraseResponse(
    ctx.input,
    personality,
    ctx.dialogueSet,
    ctx.hash,
    recent,
  );
  if (phraseMatch) {
    return finalizeResponse(phraseMatch, ctx, personality);
  }

  const semanticMatch = matchSemanticResponse(
    ctx.input,
    personality,
    ctx.dialogueSet,
    ctx.hash + 7,
    recent,
  );
  if (semanticMatch) {
    return finalizeResponse(semanticMatch, ctx, personality);
  }

  const contextual = buildContextualReply(
    ctx.input,
    ctx.intent,
    personality,
    ctx.node,
    recent,
    ctx.hash + 13,
  );
  if (contextual) {
    return finalizeResponse(contextual, ctx, personality, {
      personalized: true,
    });
  }

  const escalation = pickEscalationLine(personality, ctx.mood, ctx.hash, recent);
  if (
    escalation &&
    isPersonalityEscalated(personality, ctx.mood) &&
    ctx.dialogueState.exchangeCount >= 6
  ) {
    return escalation;
  }

  const useRichFallback =
    ctx.node === "fallback" ||
    (ctx.node === "greeting" && ctx.hash % 4 < 1);

  let content = useRichFallback
    ? pickRichFallback(ctx.tone, personality, ctx.dialogueSet, ctx.hash, recent)
    : usesIntentBranchResolution(ctx.dialogueSet)
      ? resolveNodeResponse(module, nodeDef, ctx)
      : module.pickBranchResponse(
          ctx.tone,
          ctx.node,
          ctx.exchangeCount,
          ctx.mood,
          ctx.hash,
        );

  content = applyFollowUpConnector(
    content,
    ctx.dialogueState.lastNode === ctx.node,
    ctx.node,
    ctx.exchangeCount,
    ctx.hash,
  );

  return finalizeResponse(content, ctx, personality);
}

export function resolveDialogueNode(
  input: string,
  set: DialogueSet,
): DialogueNodeId {
  return getModule(set).resolveDialogueNode(input);
}

export { hashDialogueInput, toneToPersonality, resolvePersonality };