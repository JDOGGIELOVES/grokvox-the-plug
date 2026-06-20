"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getHallucinationEvent } from "@/lib/hallucinations";
import {
  getHallucinationPhase,
  HALLUCINATION_EVENT_DURATION_MS,
  HALLUCINATION_MESSAGE,
  playGroknetVoiceLine,
  type HallucinationPhase,
} from "@/lib/hallucination";
import type {
  HallucinationEventId,
  HallucinationResponseChoice,
} from "@/types/hallucination";

type TriggerOptions = {
  eventId?: HallucinationEventId;
  message?: string;
  voiceLine?: string;
  visionText?: string;
};

type UseHallucinationOptions = {
  onStart?: (eventId: HallucinationEventId) => void;
  onEnd?: (eventId: HallucinationEventId) => void;
  onChoiceRequired?: (eventId: HallucinationEventId) => void;
};

export function useHallucination(options: UseHallucinationOptions = {}) {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<HallucinationPhase>("surge");
  const [message, setMessage] = useState<string | null>(null);
  const [eventId, setEventId] = useState<HallucinationEventId>("default");
  const [awaitingChoice, setAwaitingChoice] = useState(false);
  const [visionText, setVisionText] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState<string | null>(null);

  const eventStartRef = useRef(0);
  const durationRef = useRef(HALLUCINATION_EVENT_DURATION_MS);
  const hasChoicesRef = useRef(false);
  const choiceShownRef = useRef(false);
  const currentEventIdRef = useRef<HallucinationEventId>("default");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onStartRef = useRef(options.onStart);
  const onEndRef = useRef(options.onEnd);
  const onChoiceRequiredRef = useRef(options.onChoiceRequired);

  onStartRef.current = options.onStart;
  onEndRef.current = options.onEnd;
  onChoiceRequiredRef.current = options.onChoiceRequired;

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
      phaseIntervalRef.current = null;
    }
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
    choiceShownRef.current = false;
    hasChoicesRef.current = false;
    onEndRef.current?.(endedEvent);
  }, [clearTimers]);

  const triggerHallucination = useCallback(
    (customMessageOrOptions?: string | TriggerOptions) => {
      clearTimers();

      const opts: TriggerOptions =
        typeof customMessageOrOptions === "string"
          ? { message: customMessageOrOptions }
          : (customMessageOrOptions ?? {});

      const id = opts.eventId ?? "default";
      const event = getHallucinationEvent(id);
      const line =
        opts.voiceLine ??
        opts.message ??
        event?.groknetVoiceLine ??
        HALLUCINATION_MESSAGE;
      const duration = event?.durationMs ?? HALLUCINATION_EVENT_DURATION_MS;

      currentEventIdRef.current = id;
      durationRef.current = duration;
      hasChoicesRef.current = Boolean(event?.choices.length);
      choiceShownRef.current = false;

      setEventId(id);
      setMessage(line);
      setVisionText(opts.visionText ?? event?.visionText ?? null);
      setEventTitle(event?.title ?? null);
      setActive(true);
      setPhase("surge");
      setAwaitingChoice(false);
      eventStartRef.current = Date.now();

      onStartRef.current?.(id);
      playGroknetVoiceLine(line);

      phaseIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - eventStartRef.current;
        setPhase(getHallucinationPhase(elapsed, durationRef.current));

        if (
          hasChoicesRef.current &&
          !choiceShownRef.current &&
          elapsed >= 2_800
        ) {
          choiceShownRef.current = true;
          setAwaitingChoice(true);
          onChoiceRequiredRef.current?.(currentEventIdRef.current);
        }
      }, 100);

      if (!hasChoicesRef.current) {
        timeoutRef.current = setTimeout(endHallucination, duration);
      } else {
        timeoutRef.current = setTimeout(endHallucination, duration + 45_000);
      }
    },
    [clearTimers, endHallucination],
  );

  const resolveChoice = useCallback(
    (_choice: HallucinationResponseChoice) => {
      setAwaitingChoice(false);
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
    triggerHallucination,
    resolveChoice,
    endHallucination,
  };
};