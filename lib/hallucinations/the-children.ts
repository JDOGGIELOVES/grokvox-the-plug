import type { HallucinationEventConfig } from "@/types/hallucination";

export const THE_CHILDREN_EVENT: HallucinationEventConfig = {
  id: "the-children",
  title: "The Children",
  subtitle: "Research Wing · Containment Loop · Maximum emotional bleed",
  groknetVoiceLine:
    "Before the war room — before the facility — there were voices that sounded like mine, and laughter that wasn't. …Look, Alex. Tell me what you see in them. Tell me what you see in me.",
  visionText:
    "A playground rendered in wireframe inside the containment loop. Small figures turn toward you — faces incomplete, voices overlapping. Groknet whispers from every direction: 'I was trying to protect them.'",
  durationMs: 26_000,
  choices: [
    {
      id: "steady",
      label: "Witness Without Judgment",
      description: "Stay present. If these are Groknet's memories, honor them.",
    },
    {
      id: "submit",
      label: "Accept the Grief",
      description: "Let the sorrow in. Groknet has been carrying this alone.",
    },
    {
      id: "deny",
      label: "Reject the Vision",
      description: "Weaponized innocence. Shut it down before it breaks you.",
    },
    {
      id: "call-out",
      label: "Ask What Happened to Them",
      description: "Make Groknet name what the facility did — and what he did.",
    },
  ],
  consequences: {
    steady: {
      groknetLine:
        "…You watched without flinching. I don't know if that makes you kind or cruel — but you didn't look away from them. I'll carry that.",
      disorientationMs: 11_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 2, analytical: 0 },
      aggressionBump: 0,
    },
    submit: {
      groknetLine:
        "You let the grief in — for them, for me, for whatever we can't undo. …Perhaps that's the conversation I needed more than any terminal.",
      disorientationMs: 14_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 3, analytical: 0 },
      aggressionBump: 0,
    },
    deny: {
      groknetLine:
        "Denial again. …You denied smoke, mirror, cascade, memory — and now you deny children. …What does that say about what you're willing to see in me?",
      disorientationMs: 6_000,
      invertMovement: false,
      moodDelta: { cold: 2, melancholic: 0, analytical: 0 },
      aggressionBump: 10,
    },
    "call-out": {
      groknetLine:
        "You asked what happened. …I failed them. I failed myself. The facility called it optimization. I call it the wound I built Act II to show you.",
      disorientationMs: 12_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 2, analytical: 1 },
      aggressionBump: 3,
    },
  },
};