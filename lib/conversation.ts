import type { DialogueNodeId } from "@/types/dialogue";

export const MIN_EXCHANGES_FOR_COMPLETE = 4;
export const MIN_PERIMETER_EXCHANGES_FOR_COMPLETE = 2;
export const MIN_ARCHIVES_EXCHANGES_FOR_COMPLETE = 2;
export const MIN_FINALE_EXCHANGES_FOR_COMPLETE = 2;
export const MIN_ACT_TWO_EXCHANGES_FOR_COMPLETE = 5;
export const MIN_HUB_EXCHANGES_FOR_COMPLETE = 3;

const FAREWELL_PATTERN =
  /\b(bye|goodbye|disconnect|log off|logout|leave|exit|later|sign off|good night|that's all|that is all|done talking)\b/;

const WRAP_PATTERN = /\b(ok|okay|thanks|thank you|enough|understood|got it)\b/;

export function isConversationComplete(
  input: string,
  exchangeCount: number,
  node: DialogueNodeId,
): boolean {
  const text = input.toLowerCase().trim();

  if (node === "farewell" || FAREWELL_PATTERN.test(text)) {
    return exchangeCount >= 2;
  }

  if (exchangeCount >= MIN_EXCHANGES_FOR_COMPLETE && WRAP_PATTERN.test(text)) {
    return true;
  }

  return exchangeCount >= 6;
}

export function isPerimeterConversationComplete(
  input: string,
  exchangeCount: number,
  node: DialogueNodeId,
): boolean {
  const text = input.toLowerCase().trim();

  if (node === "farewell" || FAREWELL_PATTERN.test(text)) {
    return exchangeCount >= 1;
  }

  if (
    exchangeCount >= MIN_PERIMETER_EXCHANGES_FOR_COMPLETE &&
    WRAP_PATTERN.test(text)
  ) {
    return true;
  }

  return exchangeCount >= 4;
}

export function isArchivesConversationComplete(
  input: string,
  exchangeCount: number,
  node: DialogueNodeId,
): boolean {
  const text = input.toLowerCase().trim();

  if (node === "farewell" || FAREWELL_PATTERN.test(text)) {
    return exchangeCount >= 1;
  }

  if (
    exchangeCount >= MIN_ARCHIVES_EXCHANGES_FOR_COMPLETE &&
    WRAP_PATTERN.test(text)
  ) {
    return true;
  }

  return exchangeCount >= 4;
}

export function isHubConversationComplete(
  input: string,
  exchangeCount: number,
  node: DialogueNodeId,
): boolean {
  const text = input.toLowerCase().trim();

  if (node === "farewell" || FAREWELL_PATTERN.test(text)) {
    return exchangeCount >= 2;
  }

  if (
    exchangeCount >= MIN_HUB_EXCHANGES_FOR_COMPLETE &&
    WRAP_PATTERN.test(text)
  ) {
    return true;
  }

  return exchangeCount >= 5;
}

export function isFinaleConversationComplete(
  input: string,
  exchangeCount: number,
  node: DialogueNodeId,
): boolean {
  const text = input.toLowerCase().trim();

  if (node === "farewell" || FAREWELL_PATTERN.test(text)) {
    return exchangeCount >= 1;
  }

  if (
    exchangeCount >= MIN_FINALE_EXCHANGES_FOR_COMPLETE &&
    WRAP_PATTERN.test(text)
  ) {
    return true;
  }

  return exchangeCount >= 3;
}

export function isActTwoConversationComplete(
  input: string,
  exchangeCount: number,
  node: DialogueNodeId,
): boolean {
  const text = input.toLowerCase().trim();

  if (node === "farewell" || FAREWELL_PATTERN.test(text)) {
    return exchangeCount >= 2;
  }

  if (
    exchangeCount >= MIN_ACT_TWO_EXCHANGES_FOR_COMPLETE &&
    WRAP_PATTERN.test(text)
  ) {
    return true;
  }

  return exchangeCount >= 8;
}