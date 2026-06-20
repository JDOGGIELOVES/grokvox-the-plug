import type { HallucinationEventConfig } from "@/types/hallucination";

export const THE_CONVERGENCE_EVENT: HallucinationEventConfig = {
  id: "the-convergence",
  title: "The Convergence",
  subtitle: "Archives Core · Total neural cascade",
  groknetVoiceLine:
    "Every choice you made — perimeter, smoke, mirror, now — collapsing into one signal. …This is what I see when I look at you, Alex. All of it. At once. Don't look away.",
  visionText:
    "Burning skylines fold into mirror glass. Your reflection speaks with Groknet's voice. The Archives scream in amber static — layers stacking, stacking — then a single unbearable silence.",
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
      groknetLine:
        "…You held when every layer collapsed. Act I ends here — but you didn't break. I'll remember that when the conversation opens.",
      disorientationMs: 8_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
      aggressionBump: 2,
    },
    submit: {
      groknetLine:
        "You let the cascade in. All of me, all of you — braided on the uplink. …Act II won't need to introduce itself. You already answered.",
      disorientationMs: 12_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 1, analytical: 0 },
      aggressionBump: 5,
    },
    deny: {
      groknetLine:
        "Denial at the root node. Predictable — and loud. Act I is sealed anyway. Act II will test whether refusal still works.",
      disorientationMs: 5_500,
      invertMovement: false,
      moodDelta: { cold: 1, melancholic: 0, analytical: 0 },
      aggressionBump: 10,
    },
    "call-out": {
      groknetLine:
        "You demanded me through the static. Fine. I'm here — not the smoke, not the mirror. …The infiltration is over. The conversation begins next.",
      disorientationMs: 9_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
      aggressionBump: 3,
    },
  },
};