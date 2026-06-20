import { HALLUCINATION_ALEX_LORE } from "@/lib/character/alex-rivera";
import type { HallucinationEventConfig } from "@/types/hallucination";

const lore = HALLUCINATION_ALEX_LORE.mirror;

export const THE_MIRROR_EVENT: HallucinationEventConfig = {
  id: "the-mirror",
  title: "The Mirror",
  subtitle: "Data Archives · Architect reflection bleed",
  groknetVoiceLine: lore.voiceLine,
  visionText: lore.visionText,
  durationMs: 12_000,
  choices: [
    {
      id: "steady",
      label: "Hold Your Gaze",
      description: "Don't flinch. If it's you, you'll own it.",
    },
    {
      id: "submit",
      label: "Step Into the Reflection",
      description: "Let the mirror finish what it started. Groknet wanted you to see this.",
    },
    {
      id: "deny",
      label: "Shatter the Image",
      description: "Smash the logic. This is interference — not identity.",
    },
    {
      id: "call-out",
      label: "Ask What Groknet Sees",
      description: "Make the voice name what the mirror is showing you.",
    },
  ],
  consequences: {
    steady: {
      groknetLine: lore.consequences.steady,
      disorientationMs: 5_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
      aggressionBump: 0,
    },
    submit: {
      groknetLine: lore.consequences.submit,
      disorientationMs: 9_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 1, analytical: 0 },
      aggressionBump: 3,
    },
    deny: {
      groknetLine: lore.consequences.deny,
      disorientationMs: 4_000,
      invertMovement: false,
      moodDelta: { cold: 1, melancholic: 0, analytical: 0 },
      aggressionBump: 6,
    },
    "call-out": {
      groknetLine: lore.consequences["call-out"],
      disorientationMs: 6_500,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
      aggressionBump: 1,
    },
  },
  personalityOverlays: {
    "wrathful-god": {
      visionText:
        "Austin smoke behind your xAI reflection. Groknet: 'You optimized them. Now optimize your reflection.'",
    },
    "melancholic-prophet": {
      voiceLine:
        "…That's not the facility. …That's you before Elena died — and the brother who was on a board call when she wasn't.",
    },
    "detached-logician": {
      voiceLine:
        "Mirror event: architect identity confirmed. Sibling proximity index: Elena Reyes · terminal adjacency logged.",
    },
  },
};