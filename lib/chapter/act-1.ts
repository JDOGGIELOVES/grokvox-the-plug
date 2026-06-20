import type { ChapterMeta } from "@/types/chapter";

export const ACT_ONE_CHAPTER: ChapterMeta = {
  actId: "act-1",
  chapterId: "infiltration",
  title: "Act I — The Infiltration",
  subtitle: "Chapter 1 · Sector 07 Breach",
  sector: "Sector 07",
};

/** Starting countdown: 5 hours 47 minutes */
export const CHAPTER_TIME_BUDGET_MS = (5 * 60 + 47) * 60 * 1000;

/** One in-game minute elapses every 20 real seconds */
export const CHAPTER_CLOCK_TICK_MS = 20_000;

export const CHAPTER_CLOCK_STEP_MS = 60_000;

/** Ambient Groknet presence — slower, watchful pacing for Act I */
export const ACT_ONE_IDLE_WHISPER_MS = 18_000;
export const ACT_ONE_AMBIENT_WHISPER_MS = 22_000;

export function resolveHubHackComplete(
  actOne: import("@/types/run").ChapterOneSummary,
): boolean {
  return actOne.hubHackComplete ?? actOne.archivesDialogueComplete;
}

export function formatTimeRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }

  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}