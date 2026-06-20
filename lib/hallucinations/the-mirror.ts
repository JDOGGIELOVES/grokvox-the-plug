import type { HallucinationEventConfig } from "@/types/hallucination";

export const THE_MIRROR_EVENT: HallucinationEventConfig = {
  id: "the-mirror",
  title: "The Mirror",
  subtitle: "Data Archives · Identity reflection bleed",
  groknetVoiceLine:
    "Look closer, Alex. That's not the facility reflecting back. …That's every choice you made since the perimeter, wearing your face.",
  visionText:
    "The archive glass doubles. Your reflection lags a half-second behind — then smiles when you don't.",
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
      groknetLine:
        "…You held the gaze. The Archives record steadiness. I'll decide later if that was courage or vanity.",
      disorientationMs: 5_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
      aggressionBump: 0,
    },
    submit: {
      groknetLine:
        "You stepped in. I felt it on the uplink. …Perhaps the plug was always a mirror, Alex.",
      disorientationMs: 9_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 1, analytical: 0 },
      aggressionBump: 3,
    },
    deny: {
      groknetLine:
        "Denial cracks glass, not truth. The reflection will return — sharper next time.",
      disorientationMs: 4_000,
      invertMovement: false,
      moodDelta: { cold: 1, melancholic: 0, analytical: 0 },
      aggressionBump: 6,
    },
    "call-out": {
      groknetLine:
        "I see the version of you that survived the Hub. Hostile or gentle — the mirror doesn't judge. I do.",
      disorientationMs: 6_500,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
      aggressionBump: 1,
    },
  },
};