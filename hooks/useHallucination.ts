"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  playHallucinationResistSound,
  playHallucinationSurgeSound,
  stopHallucinationDistortion,
} from "@/lib/hallucination-audio";
import {
  buildHallucinationProfile,
  resolveHallucinationCopy,
} from "@/lib/hallucination-profiles";
import { getResistFailureLine, getResistSuccessLine } from "@/lib/hallucination-engine";
import { getHallucinationEvent } from "@/lib/hallucinations";
import {
  getHallucinationPhase,
  HALLUCINATION_EVENT_DURATION_MS,
  HALLUCINATION_MESSAGE,
  playGroknetVoiceLine,
  type HallucinationPhase,
} from "@/lib/hallucination";
import type { GroknetPersonality } from "@/types/dialogue";
import type {
  HallucinationEventId,
  HallucinationProfile,
  HallucinationResponseChoice,
  HallucinationTriggerSource,
} from "@/types/hallucination";

type TriggerOptions = {
  eventId?: HallucinationEventId;
  message?: string;
  voiceLine?: string;
  visionText?: string;
  personality?: GroknetPersonality;
  triggerSource?: HallucinationTriggerSource;
};

type UseHallucinationOptions = {
  onStart?: (eventId: HallucinationEventId) => void;
  onEnd?: (eventId: HallucinationEventId) => void;
  onChoiceRequired?: (eventId: HallucinationEventId) => void;
  onResistSuccess?: (eventId: HallucinationEventId, line: string) => void;
  onResistFailure?: (line: string) => void;
};

export function useHallucination(options: UseHallucinationOptions = {}) {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<HallucinationPhase>("surge");
  const [message, setMessage] = useState<string | null>(null);
  const [eventId, setEventId] = useState<HallucinationEventId>("default");
  const [awaitingChoice, setAwaitingChoice] = useState(false);
  const [visionText, setVisionText] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState<string | null>(null);
  const [profile, setProfile] = useState<HallucinationProfile | null>(null);
  const [falseObjective, setFalseObjective] = useState<string | null>(null);
  const [resistWindowOpen, setResistWindowOpen] = useState(false);
  const [resistProgress, setResistProgress] = useState(1);
  const [triggerSource, setTriggerSource] =
    useState<HallucinationTriggerSource>("story");

  const eventStartRef = useRef(0);
  const durationRef = useRef(HALLUCINATION_EVENT_DURATION_MS);
  const hasChoicesRef = useRef(false);
  const choiceShownRef = useRef(false);
  const resistClosedRef = useRef(false);
  const currentEventIdRef = useRef<HallucinationEventId>("default");
  const currentPersonalityRef = useRef<GroknetPersonality>("baseline");
  const resistDeadlineRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resistIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onStartRef = useRef(options.onStart);
  const onEndRef = useRef(options.onEnd);
  const onChoiceRequiredRef = useRef(options.onChoiceRequired);
  const onResistSuccessRef = useRef(options.onResistSuccess);
  const onResistFailureRef = useRef(options.onResistFailure);

  onStartRef.current = options.onStart;
  onEndRef.current = options.onEnd;
  onChoiceRequiredRef.current = options.onChoiceRequired;
  onResistSuccessRef.current = options.onResistSuccess;
  onResistFailureRef.current = options.onResistFailure;

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
      phaseIntervalRef.current = null;
    }
    if (resistIntervalRef.current) {
      clearInterval(resistIntervalRef.current);
      resistIntervalRef.current = null;
    }
    stopHallucinationDistortion();
  }, []);

  const endHallucination = useCallback(() => {
    clearTimers();
    const endedEvent = currentEventIdRef.current;
    setActive(false);
    setPhase("surge");
    setMessage(null);
    setAwaitingChoice(false);
    setVisionText(null);
    setEventTitle(null);
    setEventId("default");
    setProfile(null);
    setFalseObjective(null);
    setResistWindowOpen(false);
    setResistProgress(1);
    choiceShownRef.current = false;
    resistClosedRef.current = false;
    hasChoicesRef.current = false;
    onEndRef.current?.(endedEvent);
  }, [clearTimers]);

  const startResistWindow = useCallback((windowMs: number) => {
    if (windowMs <= 0) return;
    resistClosedRef.current = false;
    resistDeadlineRef.current = Date.now() + windowMs;
    setResistWindowOpen(true);
    setResistProgress(1);

    if (resistIntervalRef.current) clearInterval(resistIntervalRef.current);
    resistIntervalRef.current = setInterval(() => {
      const remaining = resistDeadlineRef.current - Date.now();
      const progress = Math.max(0, remaining / windowMs);
      setResistProgress(progress);

      if (remaining <= 0 && !resistClosedRef.current) {
        resistClosedRef.current = true;
        setResistWindowOpen(false);
        onResistFailureRef.current?.(
          getResistFailureLine(currentPersonalityRef.current),
        );
        if (resistIntervalRef.current) {
          clearInterval(resistIntervalRef.current);
          resistIntervalRef.current = null;
        }
      }
    }, 50);
  }, []);

  const triggerHallucination = useCallback(
    (customMessageOrOptions?: string | TriggerOptions) => {
      clearTimers();

      const opts: TriggerOptions =
        typeof customMessageOrOptions === "string"
          ? { message: customMessageOrOptions }
          : (customMessageOrOptions ?? {});

      const id = opts.eventId ?? "default";
      const event = getHallucinationEvent(id);
      const personality = opts.personality ?? "baseline";
      const builtProfile = buildHallucinationProfile(event, id, personality);
      const copy = resolveHallucinationCopy(event, id, personality, {
        voiceLine: opts.voiceLine ?? opts.message,
        visionText: opts.visionText,
      });
      const duration = event?.durationMs ?? HALLUCINATION_EVENT_DURATION_MS;
      const choiceRevealMs = event?.choiceRevealMs ?? 2_800;
      const choiceTimeoutMs = event?.choiceTimeoutMs ?? 45_000;
      const objective =
        builtProfile.falseObjective ??
        (builtProfile.controlEffect === "false-ui" ? copy.visionText : null);

      currentEventIdRef.current = id;
      currentPersonalityRef.current = personality;
      durationRef.current = duration;
      hasChoicesRef.current = Boolean(event?.choices.length);
      choiceShownRef.current = false;
      resistClosedRef.current = false;

      setEventId(id);
      setMessage(copy.voiceLine);
      setVisionText(copy.visionText);
      setEventTitle(event?.title ?? null);
      setProfile(builtProfile);
      setFalseObjective(objective);
      setTriggerSource(opts.triggerSource ?? builtProfile.triggerSource);
      setActive(true);
      setPhase("surge");
      setAwaitingChoice(false);
      eventStartRef.current = Date.now();

      onStartRef.current?.(id);
      playGroknetVoiceLine(copy.voiceLine);
      playHallucinationSurgeSound(builtProfile.type, personality);

      if (builtProfile.resistible) {
        startResistWindow(builtProfile.resistWindowMs);
      }

      phaseIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - eventStartRef.current;
        setPhase(getHallucinationPhase(elapsed, durationRef.current));

        if (
          hasChoicesRef.current &&
          !choiceShownRef.current &&
          elapsed >= choiceRevealMs
        ) {
          choiceShownRef.current = true;
          setAwaitingChoice(true);
          setResistWindowOpen(false);
          onChoiceRequiredRef.current?.(currentEventIdRef.current);
        }
      }, 100);

      if (!hasChoicesRef.current) {
        timeoutRef.current = setTimeout(endHallucination, duration);
      } else {
        timeoutRef.current = setTimeout(endHallucination, duration + choiceTimeoutMs);
      }
    },
    [clearTimers, endHallucination, startResistWindow],
  );

  const resistHallucination = useCallback(() => {
    if (!active || !profile?.resistible || resistClosedRef.current) return false;

    resistClosedRef.current = true;
    setResistWindowOpen(false);
    if (resistIntervalRef.current) {
      clearInterval(resistIntervalRef.current);
      resistIntervalRef.current = null;
    }

    const line = getResistSuccessLine(
      currentPersonalityRef.current,
      currentEventIdRef.current,
    );
    playHallucinationResistSound(true);
    onResistSuccessRef.current?.(currentEventIdRef.current, line);
    setPhase("fade");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(endHallucination, 1400);
    return true;
  }, [active, endHallucination, profile]);

  const resolveChoice = useCallback(
    (_choice: HallucinationResponseChoice) => {
      setAwaitingChoice(false);
      setResistWindowOpen(false);
      setPhase("fade");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(endHallucination, 2_200);
    },
    [endHallucination],
  );

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    active,
    phase,
    message,
    eventId,
    awaitingChoice,
    visionText,
    eventTitle,
    profile,
    falseObjective,
    resistWindowOpen,
    resistProgress,
    triggerSource,
    triggerHallucination,
    resolveChoice,
    resistHallucination,
    endHallucination,
  };
};