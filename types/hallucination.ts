export type HallucinationEventId =
  | "default"
  | "burning-cities"
  | "the-mirror"
  | "the-convergence"
  | "the-last-conversation"
  | "the-children"
  | "the-accumulation"
  | "the-garden";

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

export type HallucinationEventConfig = {
  id: HallucinationEventId;
  title: string;
  subtitle: string;
  groknetVoiceLine: string;
  visionText: string;
  durationMs: number;
  choices: HallucinationChoice[];
  consequences: Record<HallucinationResponseChoice, HallucinationConsequence>;
};

export type DisorientationState = {
  active: boolean;
  invertMovement: boolean;
  endsAt: number;
};