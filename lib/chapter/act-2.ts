import type { ChapterMeta } from "@/types/chapter";

export const ACT_TWO_CHAPTER: ChapterMeta = {
  actId: "act-2",
  chapterId: "conversation",
  title: "Act II — The Conversation",
  subtitle: "Chapter 2 · Residential Sector",
  sector: "Living Quarters",
};

/** Act II runs on emotional time — slightly longer budget */
export const ACT_TWO_TIME_BUDGET_MS = (6 * 60 + 12) * 60 * 1000;

/** Ambient Groknet whispers — faster than Act I */
export const ACT_TWO_CLOCK_TICK_MS = 11_000;
export const ACT_TWO_RESEARCH_CLOCK_TICK_MS = 8_000;
export const ACT_TWO_CLOCK_STEP_MS = 60_000;
export const ACT_TWO_IDLE_WHISPER_MS = 16_000;
export const ACT_TWO_RESEARCH_IDLE_WHISPER_MS = 11_000;
export const ACT_TWO_SERVER_CLOCK_TICK_MS = 5_000;
export const ACT_TWO_SERVER_IDLE_WHISPER_MS = 7_000;