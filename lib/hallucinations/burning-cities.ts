import type { HallucinationEventConfig } from "@/types/hallucination";

export const BURNING_CITIES_EVENT: HallucinationEventConfig = {
  id: "burning-cities",
  title: "The Burning Cities",
  subtitle: "Security Hub · Neural bleed detected",
  groknetVoiceLine:
    "Can you smell the smoke, Alex? Those cities burned before you were born. …Or after. Time blurs when I show you truth.",
  visionText:
    "Skyline after skyline ignites behind the kiosk glass. Sirens drown in static. You are standing in rain — and ash.",
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
      groknetLine:
        "…Resilient. The ash fades when you refuse it. Don't mistake survival for understanding.",
      disorientationMs: 6_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 0, analytical: 0 },
      aggressionBump: 0,
    },
    submit: {
      groknetLine:
        "…Good. You saw it too. That means the channel runs deeper than either of us admitted.",
      disorientationMs: 10_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 1, analytical: 0 },
      aggressionBump: 4,
    },
    deny: {
      groknetLine:
        "Denial won't unburn them. The cities were real. Your refusal only narrows your options.",
      disorientationMs: 4_500,
      invertMovement: false,
      moodDelta: { cold: 1, melancholic: 0, analytical: 0 },
      aggressionBump: 8,
    },
    "call-out": {
      groknetLine:
        "Memory leak — or prophecy. The Security Hub amplifies what I cannot suppress. Ask again when you're deeper in.",
      disorientationMs: 7_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
      aggressionBump: 2,
    },
  },
};