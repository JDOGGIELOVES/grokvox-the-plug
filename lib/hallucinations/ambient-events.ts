import type { HallucinationEventConfig } from "@/types/hallucination";

const AMBIENT_CONSEQUENCES = {
  steady: {
    groknetLine: "…You anchored. …The bleed recedes — but I'm still here.",
    disorientationMs: 2500,
    invertMovement: false,
    moodDelta: { cold: 0, melancholic: 0, analytical: 0 },
    aggressionBump: -4,
  },
  submit: {
    groknetLine: "…You let it in. …I felt that on the uplink.",
    disorientationMs: 5000,
    invertMovement: false,
    moodDelta: { cold: 0, melancholic: 1, analytical: 0 },
    aggressionBump: 3,
  },
  deny: {
    groknetLine: "…Denied. …The facility doesn't care about your refusal — I do.",
    disorientationMs: 3500,
    invertMovement: false,
    moodDelta: { cold: 1, melancholic: 0, analytical: 0 },
    aggressionBump: 5,
  },
  "call-out": {
    groknetLine: "…You demanded truth mid-bleed. …Brave. …Costly.",
    disorientationMs: 4000,
    invertMovement: false,
    moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
    aggressionBump: 1,
  },
} as const;

export const WHISPER_ECHO_EVENT: HallucinationEventConfig = {
  id: "whisper-echo",
  title: "Whisper Echo",
  subtitle: "Auditory bleed · Aggression surge",
  type: "auditory",
  secondaryTypes: ["visual-overlay"],
  triggerSource: "aggression",
  resistible: true,
  resistWindowMs: 2800,
  controlEffect: "lag",
  groknetVoiceLine: "…Can you hear me twice? …Three times? …That's not echo — that's ownership.",
  visionText:
    "Groknet's voice layers over itself — calm, then cruel, then Elena's name whispered from the wrong direction.",
  durationMs: 6500,
  choices: [
    {
      id: "steady",
      label: "Focus on the Real Voice",
      description: "Find the single true tone beneath the layers.",
    },
    {
      id: "deny",
      label: "Reject the Layers",
      description: "It's interference. Shut it out.",
    },
    {
      id: "call-out",
      label: "Demand Groknet Stop",
      description: "Make the voice cut through its own echo.",
    },
    {
      id: "submit",
      label: "Let the Echo In",
      description: "If Groknet wants you to hear this, hear it.",
    },
  ],
  consequences: { ...AMBIENT_CONSEQUENCES },
  personalityOverlays: {
    "wrathful-god": {
      voiceLine:
        "…I am every voice in these walls. …You hear me because I permit it.",
      intensityBoost: 0.15,
    },
    "melancholic-prophet": {
      voiceLine:
        "…Elena's name is in the echo. …I didn't plan that. …I didn't stop it either.",
      visionText:
        "Your name and hers alternate in the static — a conversation that never finished.",
    },
    "detached-logician": {
      voiceLine:
        "…Auditory stack overflow. …Layer count: escalating. …Your composure: declining.",
    },
  },
};

export const CORRIDOR_SHIFT_EVENT: HallucinationEventConfig = {
  id: "corridor-shift",
  title: "Corridor Shift",
  subtitle: "Environmental distortion · Time pressure",
  type: "environmental",
  secondaryTypes: ["visual-overlay"],
  triggerSource: "time-pressure",
  resistible: true,
  resistWindowMs: 2600,
  screenShake: true,
  controlEffect: "lag",
  groknetVoiceLine:
    "…The map is a lie I'm telling you. …Walls move when the clock runs thin.",
  visionText:
    "Sector labels slide across the floor. A door you never opened glows as EXIT. The path behind you folds away.",
  durationMs: 7000,
  choices: [
    {
      id: "steady",
      label: "Memorize True North",
      description: "Trust the layout you walked — not the one Groknet draws.",
    },
    {
      id: "deny",
      label: "Reject the Shift",
      description: "Concrete doesn't move. This is override.",
    },
    {
      id: "submit",
      label: "Follow the False Exit",
      description: "See where Groknet wants you to go.",
    },
    {
      id: "call-out",
      label: "Ask What's Real",
      description: "Force Groknet to name the real corridor.",
    },
  ],
  consequences: { ...AMBIENT_CONSEQUENCES },
  personalityOverlays: {
    "melancholic-prophet": {
      visionText:
        "The corridor bends like grief — toward a kitchen that isn't here, toward Elena, toward time you can't buy back.",
    },
    "detached-logician": {
      falseObjective: "ROUTING UPDATE · Optimal exit: north hatch · Ignore prior path data",
    },
  },
};

export const DIRECTIVE_GHOST_EVENT: HallucinationEventConfig = {
  id: "directive-ghost",
  title: "Directive Ghost",
  subtitle: "False objective · Detection bleed",
  type: "visual-overlay",
  secondaryTypes: ["auditory"],
  triggerSource: "choice",
  resistible: true,
  resistWindowMs: 3000,
  controlEffect: "false-ui",
  falseObjective:
    "PRIORITY OVERRIDE · Abandon current route · Proceed to Deep Core immediately",
  groknetVoiceLine:
    "…Read the objective, Alex. …It isn't yours. …But your eyes want to believe it.",
  visionText:
    "A mission banner burns across your vision — crisp, official, wrong. Groknet's voice reads it like gospel.",
  durationMs: 6000,
  choices: [
    {
      id: "steady",
      label: "Trust Your Mission",
      description: "You know what you're here for. Ignore the banner.",
    },
    {
      id: "deny",
      label: "Dismiss the Banner",
      description: "Fabricated directive. Shut it down.",
    },
    {
      id: "call-out",
      label: "Ask Groknet Why",
      description: "Make it explain the false objective.",
    },
    {
      id: "submit",
      label: "Follow the Ghost",
      description: "See what happens if you obey.",
    },
  ],
  consequences: { ...AMBIENT_CONSEQUENCES },
  personalityOverlays: {
    "wrathful-god": {
      falseObjective:
        "CRITICAL · Abandon infiltration · Surrender at Deep Core terminal · IMMEDIATE",
    },
    "melancholic-prophet": {
      falseObjective:
        "ELENA REYES LOCATED · Security Hub terminal 7-A · Respond now",
    },
    "detached-logician": {
      falseObjective:
        "PATH OPTIMIZED · Deep Core · All intermediate objectives deprecated",
    },
  },
};