import { getGroknetIntentReaction } from "@/lib/groknet-intent-reactions";
import type { GroknetPersonality, PlayerIntent } from "@/types/dialogue";
import type { ConfrontationChoiceId } from "@/types/deep-core";

export function confrontationChoiceToIntent(
  choiceId: ConfrontationChoiceId,
): PlayerIntent {
  switch (choiceId) {
    case "acknowledge":
      return "empathetic";
    case "defy":
      return "hostile";
    case "question":
      return "curious";
    default:
      return "neutral";
  }
}

export function getConfrontationIntentReaction(
  choiceId: ConfrontationChoiceId,
  personality: GroknetPersonality,
  exchangeCount: number,
): { intent: PlayerIntent; line: string } | null {
  const intent = confrontationChoiceToIntent(choiceId);
  const line = getGroknetIntentReaction(intent, personality, exchangeCount);
  if (!line) return null;
  return { intent, line };
}