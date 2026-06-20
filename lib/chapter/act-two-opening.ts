import type { ChapterOneSummary } from "@/types/run";
import { getActTwoPersonalizedHook } from "@/lib/chapter-ending";

export type ActTwoTransitionBeat = {
  id: string;
  speaker: "system" | "groknet" | "narrator";
  text: string;
  delayMs?: number;
};

export function getActTwoTransitionBeats(
  actOne: ChapterOneSummary,
): ActTwoTransitionBeat[] {
  const hook = getActTwoPersonalizedHook(actOne);

  return [
    {
      id: "handoff",
      speaker: "system",
      text: "ACT I BREACH LOG SEALED · RESIDENTIAL SECTOR ROUTING · CONVERSATION PROTOCOL ACTIVE",
      delayMs: 400,
    },
    {
      id: "shift",
      speaker: "narrator",
      text: "No drones. No hatches. The facility exhales — and Groknet speaks without filters.",
      delayMs: 650,
    },
    {
      id: "groknet",
      speaker: "groknet",
      text: hook,
      delayMs: 900,
    },
    {
      id: "title",
      speaker: "narrator",
      text: "Act II — The Conversation has begun.",
      delayMs: 1100,
    },
  ];
}