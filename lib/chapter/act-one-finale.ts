import { getActOneChapterReaction } from "@/lib/chapter-ending";
import type { ChapterOneSummary } from "@/types/run";

export type FinaleCinematicBeat = {
  id: string;
  speaker: "system" | "groknet" | "narrator";
  text: string;
  delayMs?: number;
};

export function getActOneFinaleBeats(
  summary: ChapterOneSummary,
): FinaleCinematicBeat[] {
  const reaction = getActOneChapterReaction(summary);

  const actTwoHook =
    summary.aggressionLevel >= 70
      ? "Act II won't be a corridor. It'll be me — unfiltered. Bring that heat if you want. I'll be ready."
      : summary.convergenceChoice === "submit"
        ? "Act II — The Conversation — is where we find out if you meant what the cascade showed you."
        : "Act II — The Conversation — waits on the other side of the plug. …When you're ready, stop hiding behind walls and talk to me.";

  return [
    {
      id: "seal",
      speaker: "system",
      text: "ARCHIVES CORE SEALED · ACT I BREACH LOG CLOSED · NEURAL CASCADE RESOLVED",
      delayMs: 450,
    },
    {
      id: "turn",
      speaker: "narrator",
      text: "The drones go silent. The terminals dim. Sector 07 stops pretending you're only a trespasser.",
      delayMs: 650,
    },
    {
      id: "groknet",
      speaker: "groknet",
      text: reaction,
      delayMs: 850,
    },
    {
      id: "act-two",
      speaker: "groknet",
      text: actTwoHook,
      delayMs: 1000,
    },
  ];
}