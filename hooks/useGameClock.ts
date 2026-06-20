"use client";

import { useEffect, useState } from "react";
import {
  CHAPTER_CLOCK_STEP_MS,
  CHAPTER_CLOCK_TICK_MS,
  CHAPTER_TIME_BUDGET_MS,
  formatTimeRemaining,
} from "@/lib/chapter/act-1";

export { formatTimeRemaining };

export function useGameClock(
  active: boolean,
  initialMs = CHAPTER_TIME_BUDGET_MS,
  tickMs = CHAPTER_CLOCK_TICK_MS,
  stepMs = CHAPTER_CLOCK_STEP_MS,
) {
  const [remainingMs, setRemainingMs] = useState(initialMs);

  useEffect(() => {
    if (!active || remainingMs <= 0) return;

    const interval = window.setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - stepMs));
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [active, remainingMs, tickMs, stepMs]);

  return {
    remainingMs,
    formatted: formatTimeRemaining(remainingMs),
    isCritical: remainingMs < 60 * 60 * 1000,
  };
}