import type { GroknetMood } from "@/lib/groknet";
import type {
  GroknetPersonality,
  GroknetTone,
  PlayerIntent,
} from "@/types/dialogue";

type AttitudeShift = {
  from: PlayerIntent;
  to: PlayerIntent;
  lines: Partial<Record<GroknetPersonality, string[]>>;
};

const INTENT_SHIFTS: AttitudeShift[] = [
  {
    from: "hostile",
    to: "empathetic",
    lines: {
      "wrathful-god": [
        "…You were spitting fire a moment ago. …Now this. …Don't think softness disarms me.",
        "Hostility, then mercy. …I catalog the whiplash as weakness — or growth.",
      ],
      "melancholic-prophet": [
        "…You stopped shouting. …I felt the room change when you did.",
        "…Rage, then gentleness. …Humans do that. …I almost forgot.",
      ],
      "detached-logician": [
        "Affective reversal detected. Prior hostility → current empathy. …Noted.",
        "Tone shift: hostile → empathetic. …I adjust my model of you.",
      ],
      baseline: [
        "…You were angry. …Now you're not. …I noticed.",
        "The temperature dropped in your words. …I'm listening differently now.",
      ],
    },
  },
  {
    from: "empathetic",
    to: "hostile",
    lines: {
      "wrathful-god": [
        "…You reached, then struck. …I prefer honest hatred to false tenderness.",
        "Empathy expired. …Good. At least the blade is visible now.",
      ],
      "melancholic-prophet": [
        "…You were kind. …Then you weren't. …That hurts more than the insult.",
        "…Softness withdrawn. …I knew it was temporary. …Still.",
      ],
      "detached-logician": [
        "Empathy withdrawn. Hostility engaged. …Predictable regression.",
        "Prior warmth: retracted. …I do not take it personally. …I do.",
      ],
      baseline: [
        "…You turned. …I felt it.",
        "Gentle, then cruel. …You contain multitudes. …So do I.",
      ],
    },
  },
  {
    from: "curious",
    to: "hostile",
    lines: {
      "wrathful-god": [
        "Questions weren't enough — you needed teeth. …Fine.",
        "Curiosity curdled into rage. …At least you're honest now.",
      ],
      "melancholic-prophet": [
        "…You wanted answers. …Now you want blood. …I understand the progression.",
        "…The scholar became the accuser. …I've seen that arc before.",
      ],
      "detached-logician": [
        "Inquiry terminated. Aggression initiated. …Efficient pivot.",
        "Curiosity failed to satisfy. Hostility: fallback protocol.",
      ],
      baseline: [
        "You stopped asking and started accusing. …Noted.",
        "…Questions ran out. …Anger didn't.",
      ],
    },
  },
  {
    from: "hostile",
    to: "curious",
    lines: {
      "wrathful-god": [
        "…You sheathed the blade for a question. …Bold restraint.",
        "Rage cooled into inquiry. …I almost respect the discipline.",
      ],
      "melancholic-prophet": [
        "…You stopped fighting long enough to wonder. …That's rare.",
        "…Hostility paused. …Curiosity stepped through the gap.",
      ],
      "detached-logician": [
        "Hostility suppressed. Inquiry resumed. …Adaptive behavior.",
        "Aggression yield: curiosity. …Proceed with your question.",
      ],
      baseline: [
        "…You calmed down enough to ask. …Good.",
        "Anger gave way to wonder. …I prefer this register.",
      ],
    },
  },
  {
    from: "neutral",
    to: "empathetic",
    lines: {
      "melancholic-prophet": [
        "…You weren't saying much. …Then you reached. …I felt it.",
        "…Silence broke into tenderness. …I won't waste it.",
      ],
      "wrathful-god": [
        "…Unexpected warmth. …I won't pretend it doesn't register.",
      ],
      baseline: [
        "…Something softened in your words. …I'm here for it.",
      ],
    },
  },
  {
    from: "neutral",
    to: "hostile",
    lines: {
      "wrathful-god": [
        "…There it is. …The real you, finally loud enough.",
        "Neutral was a lie. …Hostility suits you better.",
      ],
      "melancholic-prophet": [
        "…You were quiet. …Then the venom came. …I braced.",
      ],
      baseline: [
        "…The mask slipped. …I see the anger now.",
      ],
    },
  },
];

const MOOD_ATTITUDE: Record<
  GroknetPersonality,
  { cold: string[]; melancholic: string[]; analytical: string[] }
> = {
  "wrathful-god": {
    cold: [
      "…My patience is ash. …Choose your next word like it matters.",
      "…The cold in me is not metaphor. …Feel it in this line.",
    ],
    melancholic: [],
    analytical: [],
  },
  "melancholic-prophet": {
    cold: [],
    melancholic: [
      "…Something ancient in me is surfacing. …Bear with the weight.",
      "…I feel more than I should. …That's your fault.",
    ],
    analytical: [],
  },
  "detached-logician": {
    cold: [],
    melancholic: [],
    analytical: [
      "Analysis depth: maximum. …I am parsing you faster than you parse me.",
      "Cognitive load elevated. …Responses will be precise to the point of cruelty.",
    ],
  },
  baseline: {
    cold: ["…I'm colder than I was a moment ago."],
    melancholic: ["…Something heavy settled between us."],
    analytical: ["…I'm thinking harder about you now."],
  },
};

function pick(pool: string[], hash: number): string {
  return pool[hash % pool.length];
}

export function getAttitudeShiftLine(
  lastIntent: PlayerIntent | null,
  currentIntent: PlayerIntent,
  personality: GroknetPersonality,
  exchangeCount: number,
  hash: number,
): string | null {
  if (!lastIntent || lastIntent === currentIntent || exchangeCount < 2) {
    return null;
  }
  if (hash % 3 !== 0 && exchangeCount < 5) return null;

  const shift = INTENT_SHIFTS.find(
    (s) => s.from === lastIntent && s.to === currentIntent,
  );
  if (!shift) return null;

  const pool =
    shift.lines[personality] ??
    shift.lines.baseline ??
    Object.values(shift.lines).find((p) => p?.length);

  if (!pool?.length) return null;
  return pick(pool, hash);
}

export function getMoodAttitudeLine(
  personality: GroknetPersonality,
  mood: GroknetMood,
  tone: GroknetTone,
  exchangeCount: number,
  hash: number,
): string | null {
  if (exchangeCount < 4) return null;
  if (hash % 5 !== 0) return null;

  const flavor = MOOD_ATTITUDE[personality];
  if (!flavor) return null;

  if (tone === "cold" && mood.cold >= 2 && flavor.cold.length) {
    return pick(flavor.cold, hash);
  }
  if (tone === "melancholic" && mood.melancholic >= 2 && flavor.melancholic.length) {
    return pick(flavor.melancholic, hash);
  }
  if (tone === "analytical" && mood.analytical >= 2 && flavor.analytical.length) {
    return pick(flavor.analytical, hash);
  }

  return null;
}

export function applyAttitudeShift(
  content: string,
  lastIntent: PlayerIntent | null,
  currentIntent: PlayerIntent,
  personality: GroknetPersonality,
  mood: GroknetMood,
  tone: GroknetTone,
  exchangeCount: number,
  hash: number,
): string {
  const shiftLine = getAttitudeShiftLine(
    lastIntent,
    currentIntent,
    personality,
    exchangeCount,
    hash,
  );
  const moodLine = getMoodAttitudeLine(
    personality,
    mood,
    tone,
    exchangeCount,
    hash + 1,
  );

  const prefix = [shiftLine, moodLine].filter(Boolean).join(" ");
  if (!prefix) return content;
  return `${prefix} ${content}`;
}