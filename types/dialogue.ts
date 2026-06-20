export type PlayerIntent = "hostile" | "empathetic" | "curious" | "neutral";

export type GroknetTone = "cold" | "melancholic" | "analytical" | "weary";

/** Canonical Groknet personality variants surfaced to the player */
export type GroknetPersonality =
  | "wrathful-god"
  | "melancholic-prophet"
  | "detached-logician"
  | "baseline";

export type DialogueNodeId =
  | "greeting"
  | "identity"
  | "facility"
  | "plug"
  | "humanity"
  | "trust"
  | "breach"
  | "cascade"
  | "alex"
  | "threat"
  | "purpose"
  | "gate"
  | "farewell"
  | "fallback"
  | "act-one";

export type DialogueState = {
  exchangeCount: number;
  lastNode: DialogueNodeId | null;
  lastIntent: PlayerIntent | null;
  lastTone: GroknetTone | null;
  /** Tracks dominant personality across the session */
  dominantPersonality: GroknetPersonality | null;
  /** Recent intent sequence for streak / oscillation memory */
  intentHistory?: PlayerIntent[];
  /** How many times each topic node was hit this session */
  nodeVisits?: Partial<Record<DialogueNodeId, number>>;
};

export const INITIAL_DIALOGUE_STATE: DialogueState = {
  exchangeCount: 0,
  lastNode: null,
  lastIntent: null,
  lastTone: null,
  dominantPersonality: null,
  intentHistory: [],
  nodeVisits: {},
};

export type ToneResponses = Record<GroknetTone, string[]>;

export type DialogueNode = {
  id: DialogueNodeId;
  match: RegExp;
  priority?: number;
  responses: ToneResponses;
  /** Intent-sharped overrides — used when player tone matches */
  intentBranches?: Partial<
    Record<PlayerIntent, Partial<ToneResponses>>
  >;
};