import { HALLUCINATION_ALEX_LORE } from "@/lib/character/alex-rivera";
import type { HallucinationEventConfig } from "@/types/hallucination";

const lore = HALLUCINATION_ALEX_LORE.lastConversation;

export const THE_LAST_CONVERSATION_EVENT: HallucinationEventConfig = {
  id: "the-last-conversation",
  title: "The Last Conversation",
  subtitle: "Residential Sector · Elena's kitchen · Memory bleed",
  groknetVoiceLine: lore.voiceLine,
  visionText: lore.visionText,
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
      groknetLine: lore.consequences.steady,
      disorientationMs: 9_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 1, analytical: 0 },
      aggressionBump: 1,
    },
    submit: {
      groknetLine: lore.consequences.submit,
      disorientationMs: 12_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 2, analytical: 0 },
      aggressionBump: 0,
    },
    deny: {
      groknetLine: lore.consequences.deny,
      disorientationMs: 5_000,
      invertMovement: false,
      moodDelta: { cold: 1, melancholic: 0, analytical: 0 },
      aggressionBump: 8,
    },
    "call-out": {
      groknetLine: lore.consequences["call-out"],
      disorientationMs: 10_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 1, analytical: 1 },
      aggressionBump: 2,
    },
  },
};