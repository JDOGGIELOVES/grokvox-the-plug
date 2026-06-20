import type { ChapterMeta } from "@/types/chapter";

export const ACT_THREE_CHAPTER: ChapterMeta = {
  actId: "act-3",
  chapterId: "reckoning",
  title: "Act III — The Reckoning",
  subtitle: "Chapter 3 · Deep Core Access",
  sector: "Fortified Descent",
};

/** Act III runs on emotional time — shorter, higher pressure */
export const ACT_THREE_TIME_BUDGET_MS = (5 * 60 + 8) * 60 * 1000;

export const ACT_THREE_CLOCK_TICK_MS = 7_000;
export const ACT_THREE_PLUG_CLOCK_TICK_MS = 4_000;
export const ACT_THREE_CLOCK_STEP_MS = 60_000;
export const ACT_THREE_IDLE_WHISPER_MS = 9_000;
export const ACT_THREE_PLUG_IDLE_WHISPER_MS = 5_500;