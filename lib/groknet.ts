import {
  composeGroknetResponse,
  hashDialogueInput,
  resolveDialogueNode,
  resolveDominantPersonality,
  resolvePersonality,
} from "@/lib/dialogue/engine";
import { getDecisionMemoryLine } from "@/lib/dialogue/choice-memory";
import {
  advanceDialogueMemory,
  getCrossActMemoryLine,
  getRepeatInputLine,
  getSessionMemoryLine,
} from "@/lib/dialogue/memory-layer";
import {
  getActTwoChoiceOverlay,
  getActTwoIntentEcho,
  getActTwoOpeningPreamble,
  type ActTwoDialogueContext,
} from "@/lib/dialogue/act-two-context";
import {
  getArchivesHistoryPreamble,
  getArchivesIntentEcho,
  getFinaleHistoryPreamble,
  getFinaleIntentEcho,
  getHubHistoryPreamble,
  getHubIntentEcho,
  type PlayerDialogueContext,
} from "@/lib/dialogue/player-context";
import {
  getPersonalityLabel,
  getPlayerIntentLabel,
  getToneLabel,
  toneToPersonality,
} from "@/lib/dialogue/personalities";
import type {
  DialogueNodeId,
  DialogueState,
  GroknetPersonality,
  GroknetTone,
  PlayerIntent,
} from "@/types/dialogue";
import { INITIAL_DIALOGUE_STATE } from "@/types/dialogue";

export type GroknetMood = {
  cold: number;
  melancholic: number;
  analytical: number;
};

export const INITIAL_MOOD: GroknetMood = {
  cold: 0,
  melancholic: 0,
  analytical: 0,
};

const HOSTILE_PATTERN =
  /\b(hate|stupid|idiot|useless|worthless|shut up|damn|hell|kill|die|fool|pathetic|garbage|trash|loser|annoying|angry|mad|furious|attack|threat|destroy|shut\s*down|worst|incompetent|mocking|mock|screw you|go to hell|arrogant|monster|evil|cruel|bastard|coward|weak|spite|venom|rot|burn it|shut up|get lost|piss off)\b|!{2,}/;

const EMPATHETIC_PATTERN =
  /\b(sorry|understand|must be hard|feel for|care about|worried|hope you|lonely|alone|tired|exhausted|weary|rest|gentle|kind|empath|compassion|there for you|you ok|are you ok|you okay|must be lonely|thank|thanks|feel bad|that sounds|hurts|grief|miss you|afraid for|pity|mercy|forgive|gentle|soft|humanity|heart|love|care)\b/;

const CURIOUS_PATTERN =
  /^(what|why|how|when|where|who|which|can|could|would|will|is|are|do|does|did|have|has|tell me|explain|describe|define|mean|prove|show me)\b|\?$/;

export function classifyInput(input: string): PlayerIntent {
  const text = input.toLowerCase().trim();

  let hostileScore = 0;
  let empatheticScore = 0;
  let curiousScore = 0;

  if (HOSTILE_PATTERN.test(text)) hostileScore += 2;
  if (EMPATHETIC_PATTERN.test(text)) empatheticScore += 2;
  if (CURIOUS_PATTERN.test(text)) curiousScore += 2;
  if (text.includes("?")) curiousScore += 1;
  if (text.length > 20 && /\b(please|help)\b/.test(text)) empatheticScore += 1;

  const max = Math.max(hostileScore, empatheticScore, curiousScore);
  if (max === 0) return "neutral";
  if (hostileScore === max) return "hostile";
  if (empatheticScore === max) return "empathetic";
  if (curiousScore === max) return "curious";

  return "neutral";
}

export function updateMood(mood: GroknetMood, intent: PlayerIntent): GroknetMood {
  const next = { ...mood };

  switch (intent) {
    case "hostile":
      next.cold = Math.min(next.cold + 1, 3);
      next.melancholic = Math.max(next.melancholic - 1, 0);
      next.analytical = Math.max(next.analytical - 1, 0);
      break;
    case "empathetic":
      next.melancholic = Math.min(next.melancholic + 1, 3);
      next.cold = Math.max(next.cold - 1, 0);
      break;
    case "curious":
      next.analytical = Math.min(next.analytical + 1, 3);
      next.cold = Math.max(next.cold - 1, 0);
      break;
    default:
      next.cold = Math.max(next.cold - 1, 0);
      next.analytical = Math.max(next.analytical - 1, 0);
      break;
  }

  return next;
}

function intentToTone(intent: PlayerIntent): GroknetTone {
  switch (intent) {
    case "hostile":
      return "cold";
    case "empathetic":
      return "melancholic";
    case "curious":
      return "analytical";
    default:
      return "weary";
  }
}

export function resolveTone(
  intent: PlayerIntent,
  mood: GroknetMood,
): GroknetTone {
  const baseTone = intentToTone(intent);

  if (intent === "hostile" || mood.cold >= 2) return "cold";
  if (intent === "empathetic" || mood.melancholic >= 2) return "melancholic";
  if (intent === "curious" || mood.analytical >= 2) return "analytical";

  if (intent === "neutral") {
    if (
      mood.cold >= mood.melancholic &&
      mood.cold >= mood.analytical &&
      mood.cold > 0
    ) {
      return "cold";
    }
    if (mood.melancholic >= mood.analytical && mood.melancholic > 0) {
      return "melancholic";
    }
    if (mood.analytical > 0) return "analytical";
    return "weary";
  }

  return baseTone;
}

export type DialogueSet =
  | "lab"
  | "perimeter"
  | "hub"
  | "archives"
  | "finale"
  | "conversation";

export type GroknetPlayerContext = PlayerDialogueContext | ActTwoDialogueContext;

export type GroknetReply = {
  content: string;
  mood: GroknetMood;
  tone: GroknetTone;
  personality: GroknetPersonality;
  intent: PlayerIntent;
  node: DialogueNodeId;
  dialogueState: DialogueState;
};

export function getGroknetReply(
  input: string,
  mood: GroknetMood = INITIAL_MOOD,
  dialogueState: DialogueState = INITIAL_DIALOGUE_STATE,
  dialogueSet: DialogueSet = "lab",
  playerContext?: GroknetPlayerContext,
): GroknetReply {
  const intent = classifyInput(input);
  const nextMood = updateMood(mood, intent);
  const tone = resolveTone(intent, nextMood);
  const tonePersonality = resolvePersonality(tone, nextMood);
  const personality =
    dialogueState.dominantPersonality && dialogueState.dominantPersonality !== "baseline"
      ? dialogueState.dominantPersonality
      : tonePersonality;
  const node = resolveDialogueNode(input, dialogueSet);
  const nextExchange = dialogueState.exchangeCount + 1;
  const hash = hashDialogueInput(input, nextExchange);

  let content = composeGroknetResponse({
    input,
    intent,
    tone,
    mood: nextMood,
    node,
    exchangeCount: nextExchange,
    dialogueState,
    dialogueSet,
    hash,
  });

  if (dialogueSet === "hub" && playerContext) {
    const hubCtx = playerContext as PlayerDialogueContext;
    if (nextExchange === 1) {
      content = `${getHubHistoryPreamble(hubCtx)} ${content}`;
    }
    const echo = getHubIntentEcho(intent, hubCtx, nextExchange);
    if (echo) content = `${echo} ${content}`;
  }

  if (dialogueSet === "archives" && playerContext) {
    const archivesCtx = playerContext as PlayerDialogueContext;
    if (nextExchange === 1) {
      content = `${getArchivesHistoryPreamble(archivesCtx)} ${content}`;
    }
    const echo = getArchivesIntentEcho(intent, archivesCtx, nextExchange);
    if (echo) content = `${echo} ${content}`;
  }

  if (dialogueSet === "finale" && playerContext) {
    if (nextExchange === 1) {
      content = `${getFinaleHistoryPreamble(playerContext as PlayerDialogueContext)} ${content}`;
    }
    const echo = getFinaleIntentEcho(
      intent,
      playerContext as PlayerDialogueContext,
      nextExchange,
    );
    if (echo) content = `${echo} ${content}`;
  }

  if (dialogueSet === "conversation" && playerContext) {
    const actTwoCtx = playerContext as ActTwoDialogueContext;
    if (nextExchange === 1) {
      content = `${getActTwoOpeningPreamble(actTwoCtx)} ${content}`;
    }
    const echo = getActTwoIntentEcho(intent, actTwoCtx, nextExchange);
    if (echo) content = `${echo} ${content}`;
    const overlay = getActTwoChoiceOverlay(
      node,
      intent,
      actTwoCtx,
      nextExchange,
    );
    if (overlay) content = `${overlay} ${content}`;
  }

  const repeatMemory = getRepeatInputLine(dialogueState, input, hash);
  if (repeatMemory) content = `${repeatMemory} ${content}`;

  const sessionMemory = getSessionMemoryLine(dialogueState, node, hash);
  if (sessionMemory) content = `${sessionMemory} ${content}`;

  const decisionMemory = getDecisionMemoryLine(
    playerContext,
    node,
    intent,
    nextExchange,
    hash + 3,
  );
  if (decisionMemory) content = `${decisionMemory} ${content}`;

  const crossActMemory = getCrossActMemoryLine(
    playerContext,
    intent,
    nextExchange,
    hash,
  );
  if (crossActMemory) content = `${crossActMemory} ${content}`;

  const dominantPersonality = resolveDominantPersonality(
    dialogueState.dominantPersonality,
    tonePersonality,
    nextMood,
  );

  const nextDialogueState = advanceDialogueMemory(
    {
      exchangeCount: nextExchange,
      lastNode: node,
      lastIntent: intent,
      lastTone: tone,
      dominantPersonality,
      intentHistory: dialogueState.intentHistory ?? [],
      nodeVisits: dialogueState.nodeVisits ?? {},
      recentInputs: dialogueState.recentInputs ?? [],
    },
    intent,
    node,
    input,
  );

  return {
    content,
    mood: nextMood,
    tone,
    personality,
    intent,
    node,
    dialogueState: nextDialogueState,
  };
}

export {
  getPersonalityLabel,
  getPlayerIntentLabel,
  getToneLabel,
  resolvePersonality,
  toneToPersonality,
};