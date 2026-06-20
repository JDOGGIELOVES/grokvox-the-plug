"use client";

import { useEffect, useRef } from "react";
import { evaluateAmbientHallucination } from "@/lib/hallucination-engine";
import type { GroknetPersonality } from "@/types/dialogue";
import type { ChapterStage } from "@/types/chapter";
import type {
  HallucinationEventId,
  HallucinationTriggerSource,
} from "@/types/hallucination";

type TriggerHallucinationFn = (options: {
  eventId: HallucinationEventId;
  voiceLine: string;
  visionText: string;
  personality: GroknetPersonality;
  triggerSource: HallucinationTriggerSource;
}) => void;

type UseHallucinationTriggersOptions = {
  enabled: boolean;
  playing: boolean;
  hallucinationActive: boolean;
  aggressionLevel: number;
  timeCritical: boolean;
  timeRemainingMs: number;
  detections: number;
  personality: GroknetPersonality;
  stage: ChapterStage;
  triggerHallucination: TriggerHallucinationFn;
  onAmbientTriggered?: (eventId: HallucinationEventId) => void;
  pollMs?: number;
};

export function useHallucinationTriggers({
  enabled,
  playing,
  hallucinationActive,
  aggressionLevel,
  timeCritical,
  timeRemainingMs,
  detections,
  personality,
  stage,
  triggerHallucination,
  onAmbientTriggered,
  pollMs = 12_000,
}: UseHallucinationTriggersOptions) {
  const triggeredRef = useRef(new Set<HallucinationEventId>());
  const tickRef = useRef(0);

  useEffect(() => {
    if (!enabled || !playing) return;

    const interval = window.setInterval(() => {
      if (hallucinationActive) return;

      const result = evaluateAmbientHallucination(
        {
          aggressionLevel,
          timeCritical,
          timeRemainingMs,
          detections,
          personality,
          stage,
          alreadyTriggered: triggeredRef.current,
          hallucinationActive,
          playing,
        },
        tickRef.current++,
      );

      if (!result) return;

      triggeredRef.current.add(result.eventId);
      onAmbientTriggered?.(result.eventId);
      triggerHallucination({
        eventId: result.eventId,
        voiceLine: result.voiceLine,
        visionText: result.visionText,
        personality,
        triggerSource: result.triggerSource,
      });
    }, pollMs);

    return () => window.clearInterval(interval);
  }, [
    aggressionLevel,
    detections,
    enabled,
    hallucinationActive,
    onAmbientTriggered,
    personality,
    playing,
    pollMs,
    stage,
    timeCritical,
    timeRemainingMs,
    triggerHallucination,
  ]);

  return triggeredRef;
}