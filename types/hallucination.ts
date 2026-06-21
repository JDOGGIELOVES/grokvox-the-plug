import type { GroknetPersonality } from "@/types/dialogue";

export type HallucinationEventId =
  | "default"
  | "burning-cities"
  | "the-mirror"
  | "the-convergence"
  | "the-last-conversation"
  | "the-children"
  | "the-accumulation"
  | "the-garden"
  | "whisper-echo"
  | "corridor-shift"
  | "directive-ghost";

export type HallucinationType =
  | "environmental"
  | "auditory"
  | "visual-overlay"
  | "memory-recall"
  | "reality-shift";

export type HallucinationTriggerSource =
  | "aggression"
  | "choice"
  | "time-pressure"
  | "story"
  | "dialogue";

export type HallucinationControlEffect =
  | "none"
  | "invert"
  | "lag"
  | "false-ui";

export type HallucinationResponseChoice =
  | "steady"
  | "submit"
  | "deny"
  | "call-out";

export type HallucinationChoice = {
  id: HallucinationResponseChoice;
  label: string;
  description: string;
};

export type HallucinationConsequence = {
  groknetLine: string;
  disorientationMs: number;
  invertMovement: boolean;
  moodDelta: {
    cold: number;
    melancholic: number;
    analytical: number;
  };
  aggressionBump: number;
};

export type HallucinationPersonalityOverlay = {
  voiceLine?: string;
  visionText?: string;
  falseObjective?: string;
  intensityBoost?: number;
};

export type HallucinationEventConfig = {
  id: HallucinationEventId;
  title: string;
  subtitle: string;
  groknetVoiceLine: string;
  visionText: string;
  durationMs: number;
  /** Ms after trigger before choice UI appears (default 2800) */
  choiceRevealMs?: number;
  /** Max ms to wait for a choice after reveal (default 45000) */
  choiceTimeoutMs?: number;
  choices: HallucinationChoice[];
  consequences: Record<HallucinationResponseChoice, HallucinationConsequence>;
  /** Primary sensory channel */
  type?: HallucinationType;
  /** Secondary channels for layered effects */
  secondaryTypes?: HallucinationType[];
  triggerSource?: HallucinationTriggerSource;
  resistible?: boolean;
  resistWindowMs?: number;
  screenShake?: boolean;
  controlEffect?: HallucinationControlEffect;
  falseObjective?: string;
  personalityOverlays?: Partial<
    Record<GroknetPersonality, HallucinationPersonalityOverlay>
  >;
};

export type HallucinationProfile = {
  eventId: HallucinationEventId;
  type: HallucinationType;
  secondaryTypes: HallucinationType[];
  triggerSource: HallucinationTriggerSource;
  intensity: number;
  resistible: boolean;
  resistWindowMs: number;
  screenShake: boolean;
  controlEffect: HallucinationControlEffect;
  falseObjective: string | null;
  personality: GroknetPersonality;
  cssClasses: string[];
};

export type HallucinationRuntimeState = {
  profile: HallucinationProfile;
  voiceLine: string;
  visionText: string | null;
  falseObjective: string | null;
  resistWindowOpen: boolean;
  resistDeadline: number;
  triggerSource: HallucinationTriggerSource;
};

export type DisorientationState = {
  active: boolean;
  invertMovement: boolean;
  endsAt: number;
  controlLag?: boolean;
};