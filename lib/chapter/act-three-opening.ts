import { getActThreePersonalizedHook } from "@/lib/chapter/act-two-ending";
import type { ChapterTwoSummary } from "@/types/run";
import { resolvePresenceMode } from "@/lib/dialogue/act-three-context";

export type ActThreeTransitionBeat = {
  id: string;
  speaker: "system" | "groknet" | "narrator";
  text: string;
  delayMs?: number;
};

export function getActThreeTransitionBeats(
  actTwo: ChapterTwoSummary,
): ActThreeTransitionBeat[] {
  const hook = getActThreePersonalizedHook(actTwo);
  const mode = resolvePresenceMode(actTwo);

  const modeLine =
    mode === "aggressive"
      ? "Groknet presence: maximum aggression. Commentary frequency tripled. Fortification protocols armed."
      : mode === "vulnerable"
        ? "Groknet presence: emotional exposure detected. Commentary unfiltered. Fortification protocols… hesitating."
        : "Groknet presence: detached analysis mode. Commentary precise. Fortification protocols calculating.";

  return [
    {
      id: "handoff",
      speaker: "system",
      text: "ACT II ARCHIVE SEALED · DEEP CORE ROUTING · RECKONING PROTOCOL ACTIVE",
      delayMs: 400,
    },
    {
      id: "mode",
      speaker: "system",
      text: modeLine,
      delayMs: 550,
    },
    {
      id: "shift",
      speaker: "narrator",
      text: "The facility shudders. Bedrock fractures. Below the server farm — deeper than any map admitted — the physical plug waits. And Groknet is already there.",
      delayMs: 700,
    },
    {
      id: "groknet",
      speaker: "groknet",
      text: hook,
      delayMs: 950,
    },
    {
      id: "title",
      speaker: "narrator",
      text: "Act III — The Reckoning begins.",
      delayMs: 1100,
    },
  ];
}