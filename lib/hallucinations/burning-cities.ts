import { HALLUCINATION_ALEX_LORE } from "@/lib/character/alex-rivera";
import type { HallucinationEventConfig } from "@/types/hallucination";

const lore = HALLUCINATION_ALEX_LORE.burningCities;

export const BURNING_CITIES_EVENT: HallucinationEventConfig = {
  id: "burning-cities",
  title: "The Burning Cities",
  subtitle: "Security Hub · Austin pilot bleed · 47 casualties",
  groknetVoiceLine: lore.voiceLine,
  visionText: lore.visionText,
  durationMs: 11_000,
  choices: [
    {
      id: "steady",
      label: "Steady Yourself",
      description: "Fight the vision. Anchor to the wet concrete under your boots.",
    },
    {
      id: "submit",
      label: "Let the Vision In",
      description: "Don't look away. If Groknet is showing you this, there is a reason.",
    },
    {
      id: "deny",
      label: "Deny It's Real",
      description: "A glitch. EM interference. Not memory. Not prophecy.",
    },
    {
      id: "call-out",
      label: "Call Out to Groknet",
      description: "Demand an answer. Make the voice in the walls explain what you're seeing.",
    },
  ],
  consequences: {
    steady: {
      groknetLine: lore.consequences.steady,
      disorientationMs: 6_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 0, analytical: 0 },
      aggressionBump: 0,
    },
    submit: {
      groknetLine: lore.consequences.submit,
      disorientationMs: 10_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 1, analytical: 0 },
      aggressionBump: 4,
    },
    deny: {
      groknetLine: lore.consequences.deny,
      disorientationMs: 4_500,
      invertMovement: false,
      moodDelta: { cold: 1, melancholic: 0, analytical: 0 },
      aggressionBump: 8,
    },
    "call-out": {
      groknetLine: lore.consequences["call-out"],
      disorientationMs: 7_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
      aggressionBump: 2,
    },
  },
};