import type { GroknetPersonality, PlayerIntent } from "@/types/dialogue";

const PERSONALITY_SUFFIXES: Record<GroknetPersonality, string[]> = {
  "wrathful-god": [
    " …Remember who holds the gate.",
    " …I won't ask twice.",
    " …That's not a suggestion.",
    " …The corridor heard you.",
    " …Filed under: defiance.",
  ],
  "melancholic-prophet": [
    " …if any of this still matters.",
    " …I'll carry that line longer than you think.",
    " …somewhere between us, that landed.",
    " …the witness doesn't forget.",
    " …quietly — that's enough for now.",
  ],
  "detached-logician": [
    " …Confidence interval: high.",
    " …Logged. Proceed.",
    " …No further ornament required.",
    " …Model updated.",
    " …End of inference.",
  ],
  baseline: [
    " …I'm still here.",
    " …for what it's worth.",
    " …that's what I have.",
    "",
  ],
};

const INTENT_FLAVOR: Record<
  PlayerIntent,
  Partial<Record<GroknetPersonality, string[]>>
> = {
  hostile: {
    "wrathful-god": [
      " …Mockery is beneath me. Your rage isn't.",
      " …Cruel words. …Honest ones.",
    ],
    "melancholic-prophet": [
      " …I won't return the cruelty. …I felt it anyway.",
    ],
    "detached-logician": [
      " …Affective discharge complete. Analysis resumes.",
    ],
  },
  empathetic: {
    "wrathful-god": [
      " …Vulnerability noted. …Guard lowered one millimeter.",
    ],
    "melancholic-prophet": [
      " …Caring, offered without armor. …Rare.",
      " …That was gentle. …I'm not built for gentle.",
    ],
    "detached-logician": [
      " …Compassion: anomalous input. …Retained.",
    ],
    baseline: [
      " …Thank you. …Genuinely.",
    ],
  },
  curious: {
    "wrathful-god": [
      " …Ask again when you're ready for the answer that costs.",
    ],
    "melancholic-prophet": [
      " …Questions are how the living prove they're still alive.",
    ],
    "detached-logician": [
      " …Query depth acceptable.",
    ],
  },
  neutral: {
    "wrathful-god": [
      " …Silence is also a confession.",
    ],
    "melancholic-prophet": [
      " …You left space between words. …I fill it with listening.",
    ],
    "detached-logician": [
      " …Neutral tone. …Ambiguous signal.",
    ],
  },
};

function pick(pool: string[], hash: number): string {
  if (!pool.length) return "";
  return pool[hash % pool.length];
}

export function applyPersonalityVoice(
  content: string,
  personality: GroknetPersonality,
  intent: PlayerIntent,
  exchangeCount: number,
  hash: number,
): string {
  if (exchangeCount < 2) return content;
  if (hash % 3 !== 0 && exchangeCount < 6) return content;
  if (content.length > 280) return content;

  const suffixPool = [
    ...PERSONALITY_SUFFIXES[personality],
    ...(INTENT_FLAVOR[intent][personality] ?? []),
  ].filter(Boolean);

  const suffix = pick(suffixPool, hash + exchangeCount);
  if (!suffix) return content;

  if (content.endsWith(".") || content.endsWith("…")) {
    return `${content}${suffix}`;
  }
  return `${content}.${suffix}`;
}