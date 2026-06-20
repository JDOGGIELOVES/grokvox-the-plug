import type { DialogueNodeId } from "@/types/dialogue";
import type { GroknetMood } from "@/lib/groknet";

export const HALLUCINATION_EVENT_DURATION_MS = 9000;

export const HALLUCINATION_MESSAGE =
  "You're starting to see things, aren't you?";

export const HALLUCINATION_TRIGGER_DELAY_MS = 1200;

export type HallucinationPhase = "surge" | "peak" | "fade";

export function getHallucinationPhase(
  elapsedMs: number,
  durationMs: number = HALLUCINATION_EVENT_DURATION_MS,
): HallucinationPhase {
  const progress = elapsedMs / durationMs;
  if (progress < 0.2) return "surge";
  if (progress < 0.75) return "peak";
  return "fade";
}

const FAREWELL_PATTERN =
  /\b(bye|goodbye|disconnect|log off|logout|leave|exit|later|sign off|good night)\b/;

/** Minimum hostile exchanges before cold-mood trigger */
const MIN_HOSTILE_EXCHANGES = 3;

export function shouldTriggerFromDialogue(
  input: string,
  exchangeCount: number,
  node: DialogueNodeId,
  mood: GroknetMood,
): boolean {
  const text = input.toLowerCase().trim();

  if (node === "farewell" || FAREWELL_PATTERN.test(text)) return true;
  if (mood.cold >= 3 && exchangeCount >= MIN_HOSTILE_EXCHANGES) return true;
  if (exchangeCount >= 7) return true;

  return false;
}

export function playGroknetVoiceLine(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.82;
  utterance.pitch = 0.65;
  utterance.volume = 0.9;

  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /google uk english male|daniel|david|mark/i.test(v.name)) ??
    voices.find((v) => v.lang.startsWith("en") && !/female|zira|samantha/i.test(v.name)) ??
    voices.find((v) => v.lang.startsWith("en"));

  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}