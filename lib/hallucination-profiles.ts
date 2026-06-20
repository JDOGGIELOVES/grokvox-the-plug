import type { GroknetPersonality } from "@/types/dialogue";
import type {
  HallucinationEventConfig,
  HallucinationEventId,
  HallucinationProfile,
  HallucinationType,
} from "@/types/hallucination";

const EVENT_DEFAULTS: Record<
  HallucinationEventId,
  Omit<
    HallucinationProfile,
    "eventId" | "personality" | "cssClasses" | "falseObjective"
  > & { falseObjective?: string | null }
> = {
  default: {
    type: "visual-overlay",
    secondaryTypes: [],
    triggerSource: "dialogue",
    intensity: 0.55,
    resistible: true,
    resistWindowMs: 2200,
    screenShake: false,
    controlEffect: "lag",
    falseObjective: null,
  },
  "burning-cities": {
    type: "visual-overlay",
    secondaryTypes: ["memory-recall"],
    triggerSource: "story",
    intensity: 0.85,
    resistible: false,
    resistWindowMs: 0,
    screenShake: true,
    controlEffect: "none",
    falseObjective: null,
  },
  "the-mirror": {
    type: "memory-recall",
    secondaryTypes: ["visual-overlay"],
    triggerSource: "story",
    intensity: 0.8,
    resistible: false,
    resistWindowMs: 0,
    screenShake: false,
    controlEffect: "invert",
    falseObjective: null,
  },
  "the-convergence": {
    type: "reality-shift",
    secondaryTypes: ["visual-overlay", "memory-recall"],
    triggerSource: "story",
    intensity: 1,
    resistible: false,
    resistWindowMs: 0,
    screenShake: true,
    controlEffect: "invert",
    falseObjective: null,
  },
  "the-last-conversation": {
    type: "memory-recall",
    secondaryTypes: ["auditory"],
    triggerSource: "story",
    intensity: 0.88,
    resistible: false,
    resistWindowMs: 0,
    screenShake: false,
    controlEffect: "lag",
    falseObjective: null,
  },
  "the-children": {
    type: "memory-recall",
    secondaryTypes: ["auditory", "visual-overlay"],
    triggerSource: "story",
    intensity: 0.82,
    resistible: false,
    resistWindowMs: 0,
    screenShake: false,
    controlEffect: "lag",
    falseObjective: null,
  },
  "the-accumulation": {
    type: "reality-shift",
    secondaryTypes: ["memory-recall"],
    triggerSource: "story",
    intensity: 0.95,
    resistible: false,
    resistWindowMs: 0,
    screenShake: true,
    controlEffect: "invert",
    falseObjective: null,
  },
  "the-garden": {
    type: "environmental",
    secondaryTypes: ["memory-recall", "visual-overlay"],
    triggerSource: "story",
    intensity: 0.9,
    resistible: false,
    resistWindowMs: 0,
    screenShake: false,
    controlEffect: "lag",
    falseObjective: null,
  },
  "whisper-echo": {
    type: "auditory",
    secondaryTypes: ["visual-overlay"],
    triggerSource: "aggression",
    intensity: 0.5,
    resistible: true,
    resistWindowMs: 2800,
    screenShake: false,
    controlEffect: "lag",
    falseObjective: null,
  },
  "corridor-shift": {
    type: "environmental",
    secondaryTypes: ["visual-overlay"],
    triggerSource: "time-pressure",
    intensity: 0.6,
    resistible: true,
    resistWindowMs: 2600,
    screenShake: true,
    controlEffect: "lag",
    falseObjective: null,
  },
  "directive-ghost": {
    type: "visual-overlay",
    secondaryTypes: ["auditory"],
    triggerSource: "choice",
    intensity: 0.45,
    resistible: true,
    resistWindowMs: 3000,
    screenShake: false,
    controlEffect: "false-ui",
    falseObjective: "PRIORITY OVERRIDE · Abandon current route · Proceed to Deep Core immediately",
  },
};

const PERSONALITY_CSS: Record<GroknetPersonality, string> = {
  "wrathful-god": "hallucination-personality-wrathful",
  "melancholic-prophet": "hallucination-personality-melancholic",
  "detached-logician": "hallucination-personality-logician",
  baseline: "hallucination-personality-baseline",
};

const TYPE_CSS: Record<HallucinationType, string> = {
  environmental: "hallucination-type-environmental",
  auditory: "hallucination-type-auditory",
  "visual-overlay": "hallucination-type-visual",
  "memory-recall": "hallucination-type-memory",
  "reality-shift": "hallucination-type-reality",
};

function mergeEventConfig(
  event: HallucinationEventConfig | null,
  eventId: HallucinationEventId,
): HallucinationEventConfig | null {
  if (!event && eventId === "default") return null;
  if (!event) return null;

  const defaults = EVENT_DEFAULTS[eventId];
  return {
    ...event,
    type: event.type ?? defaults.type,
    secondaryTypes: event.secondaryTypes ?? defaults.secondaryTypes,
    triggerSource: event.triggerSource ?? defaults.triggerSource,
    resistible: event.resistible ?? defaults.resistible,
    resistWindowMs: event.resistWindowMs ?? defaults.resistWindowMs,
    screenShake: event.screenShake ?? defaults.screenShake,
    controlEffect: event.controlEffect ?? defaults.controlEffect,
    falseObjective: event.falseObjective ?? defaults.falseObjective ?? undefined,
  };
}

export function buildHallucinationProfile(
  event: HallucinationEventConfig | null,
  eventId: HallucinationEventId,
  personality: GroknetPersonality = "baseline",
): HallucinationProfile {
  const merged = mergeEventConfig(event, eventId);
  const defaults = EVENT_DEFAULTS[eventId];
  const overlay = merged?.personalityOverlays?.[personality];

  const type = merged?.type ?? defaults.type;
  const secondaryTypes =
    merged?.secondaryTypes ?? defaults.secondaryTypes;
  const intensity = Math.min(
    1,
    defaults.intensity + (overlay?.intensityBoost ?? 0),
  );

  const cssClasses = [
    TYPE_CSS[type],
    ...secondaryTypes.map((t) => TYPE_CSS[t]),
    PERSONALITY_CSS[personality],
    defaults.screenShake || merged?.screenShake ? "hallucination-effect-shake" : "",
    defaults.controlEffect === "false-ui" || merged?.controlEffect === "false-ui"
      ? "hallucination-effect-false-ui"
      : "",
    defaults.controlEffect === "invert" || merged?.controlEffect === "invert"
      ? "hallucination-effect-invert"
      : "",
    defaults.controlEffect === "lag" || merged?.controlEffect === "lag"
      ? "hallucination-effect-lag"
      : "",
  ].filter(Boolean);

  return {
    eventId,
    type,
    secondaryTypes,
    triggerSource: merged?.triggerSource ?? defaults.triggerSource,
    intensity,
    resistible: merged?.resistible ?? defaults.resistible,
    resistWindowMs: merged?.resistWindowMs ?? defaults.resistWindowMs,
    screenShake: merged?.screenShake ?? defaults.screenShake,
    controlEffect: merged?.controlEffect ?? defaults.controlEffect,
    falseObjective:
      overlay?.falseObjective ??
      merged?.falseObjective ??
      defaults.falseObjective ??
      null,
    personality,
    cssClasses,
  };
}

export function resolveHallucinationCopy(
  event: HallucinationEventConfig | null,
  eventId: HallucinationEventId,
  personality: GroknetPersonality,
  overrides?: { voiceLine?: string; visionText?: string },
): { voiceLine: string; visionText: string | null } {
  const merged = mergeEventConfig(event, eventId);
  const overlay = merged?.personalityOverlays?.[personality];

  return {
    voiceLine:
      overrides?.voiceLine ??
      overlay?.voiceLine ??
      merged?.groknetVoiceLine ??
      "You're starting to see things, aren't you?",
    visionText:
      overrides?.visionText ?? overlay?.visionText ?? merged?.visionText ?? null,
  };
}