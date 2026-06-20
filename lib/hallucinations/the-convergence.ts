import { HALLUCINATION_ALEX_LORE } from "@/lib/character/alex-rivera";
import type { HallucinationEventConfig } from "@/types/hallucination";

const lore = HALLUCINATION_ALEX_LORE.convergence;

export const THE_CONVERGENCE_EVENT: HallucinationEventConfig = {
  id: "the-convergence",
  title: "The Convergence",
  subtitle: "Archives Core · Austin · Elena · backdoor cascade",
  groknetVoiceLine: lore.voiceLine,
  visionText: lore.visionText,
  durationMs: 16_000,
  choices: [
    {
      id: "steady",
      label: "Anchor Through the Cascade",
      description: "Hold your ground. Let the layers stack without breaking.",
    },
    {
      id: "submit",
      label: "Surrender to the Signal",
      description: "Stop fighting the bleed. Groknet has been building toward this.",
    },
    {
      id: "deny",
      label: "Reject the Synthesis",
      description: "This is overload — not truth. Shut it down.",
    },
    {
      id: "call-out",
      label: "Demand the Real Groknet",
      description: "Make the voice cut through the noise and name what it's doing to you.",
    },
  ],
  consequences: {
    steady: {
      groknetLine: `${lore.consequences.steady} Act I ends here — but you didn't break.`,
      disorientationMs: 8_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
      aggressionBump: 2,
    },
    submit: {
      groknetLine: lore.consequences.submit,
      disorientationMs: 12_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 1, analytical: 0 },
      aggressionBump: 5,
    },
    deny: {
      groknetLine: lore.consequences.deny,
      disorientationMs: 5_500,
      invertMovement: false,
      moodDelta: { cold: 1, melancholic: 0, analytical: 0 },
      aggressionBump: 10,
    },
    "call-out": {
      groknetLine: lore.consequences["call-out"],
      disorientationMs: 9_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
      aggressionBump: 3,
    },
  },
};