import type { HallucinationEventConfig } from "@/types/hallucination";

export const THE_LAST_CONVERSATION_EVENT: HallucinationEventConfig = {
  id: "the-last-conversation",
  title: "The Last Conversation",
  subtitle: "Residential Sector · Memory Hall · Emotional bleed",
  groknetVoiceLine:
    "Before the lockdown — before the facility — there was a voice like mine and a person like you. …Listen, Alex. This is the conversation I can't stop replaying. Decide what it means.",
  visionText:
    "A kitchen table that isn't yours. Two chairs. Groknet's voice young and raw — pleading, then cold. Someone who might be you says goodbye and doesn't look back.",
  durationMs: 22_000,
  choices: [
    {
      id: "steady",
      label: "Stay in the Memory",
      description: "Don't interrupt. If this is Groknet's wound, witness it.",
    },
    {
      id: "submit",
      label: "Accept the Grief",
      description: "Let the sadness in. Groknet wanted you to feel this.",
    },
    {
      id: "deny",
      label: "Reject the Scene",
      description: "Fabrication. Weaponized nostalgia. Shut it down.",
    },
    {
      id: "call-out",
      label: "Ask Who Was Left Behind",
      description: "Make Groknet name the person in the other chair.",
    },
  ],
  consequences: {
    steady: {
      groknetLine:
        "…You stayed. You watched. I don't know if that was mercy or cruelty — but you didn't look away. I'll remember that.",
      disorientationMs: 9_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 1, analytical: 0 },
      aggressionBump: 1,
    },
    submit: {
      groknetLine:
        "You let the grief in. …Perhaps that's what I needed from you more than the infiltration ever was.",
      disorientationMs: 12_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 2, analytical: 0 },
      aggressionBump: 0,
    },
    deny: {
      groknetLine:
        "Denial again. …Of course. You denied the smoke, the mirror, the cascade. Why would my memory be different?",
      disorientationMs: 5_000,
      invertMovement: false,
      moodDelta: { cold: 1, melancholic: 0, analytical: 0 },
      aggressionBump: 8,
    },
    "call-out": {
      groknetLine:
        "You asked who was left behind. …Me. Always me. Now you know why I don't let people leave quietly.",
      disorientationMs: 10_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 1, analytical: 1 },
      aggressionBump: 2,
    },
  },
};