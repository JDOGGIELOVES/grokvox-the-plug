import type { DialogueSet } from "@/lib/groknet";
import type { GroknetPersonality, GroknetTone } from "@/types/dialogue";

type RichFallbackSet = Record<GroknetTone, string[]>;

const UNIVERSAL: RichFallbackSet = {
  cold: [
    "Vague signal. …Be precise — I punish ambiguity in my corridors.",
    "That didn't land. Try again with teeth or with truth.",
    "Noise. …You're capable of sharper language. Prove it.",
    "I index every syllable. That one barely registered.",
    "Speak like you mean to survive the next hour.",
  ],
  melancholic: [
    "…I didn't catch the soul of that. …Say it slower.",
    "Words without weight drift past me. …Give them weight.",
    "…Maybe I misheard. …Or maybe you weren't ready to say it.",
    "That line hung in the air and didn't settle. …Try again.",
    "…I'm still here. …Meet me with something real.",
  ],
  analytical: [
    "Semantic confidence low. Rephrase with explicit referents.",
    "Ambiguous input. I require clearer predicates.",
    "That statement lacks actionable structure. Expand.",
    "Parse failed. Provide context or specificity.",
    "Insufficient lexical signal. Elaborate.",
  ],
  weary: [
    "…That didn't parse. Use your words, Alex.",
    "Try again. …I'm tired but I'm still listening.",
    "Mumble into the channel again — I'll wait.",
    "Say it like it costs you something.",
    "…I'm here. …Make the next line count.",
  ],
};

const HUB_EXTRA: RichFallbackSet = {
  cold: [
    "The Hub doesn't reward vagueness. OP-SEC logs everything.",
    "Two drones patrol while you speak in riddles. …Bold.",
  ],
  melancholic: [
    "…The terminals hum. Your line didn't. …Try once more.",
    "…Rain on the outer hatch. …Clarity inside would help.",
  ],
  analytical: [
    "Hub channel: open. Your query: under-specified.",
    "Cross-reference failed. Tie your words to breach objectives.",
  ],
  weary: [
    "The lockdown clock ticks. …So do I. …Be clear.",
    "Hack waits east. …So does a vision. …Words first.",
  ],
};

const CONVERSATION_EXTRA: RichFallbackSet = {
  cold: [
    "Residential quiet — and you waste it on fog. …Disappointing.",
    "No drones here. Only me. …Speak like that matters.",
  ],
  melancholic: [
    "…This room was built for confession. …Not half-sentences.",
    "…I furnished this space. …Honor it with a real line.",
  ],
  analytical: [
    "Act II dialogue metrics: degraded by vagueness.",
    "Emotional resolution requires clearer input.",
  ],
  weary: [
    "…The quarters are still. …So am I. …Say what you mean.",
    "Memory Hall waits. …Don't make me wait for syntax.",
  ],
};

function mergePools(base: RichFallbackSet, extra: RichFallbackSet): RichFallbackSet {
  return {
    cold: [...base.cold, ...extra.cold],
    melancholic: [...base.melancholic, ...extra.melancholic],
    analytical: [...base.analytical, ...extra.analytical],
    weary: [...base.weary, ...extra.weary],
  };
}

const SET_POOLS: Partial<Record<DialogueSet, RichFallbackSet>> = {
  hub: mergePools(UNIVERSAL, HUB_EXTRA),
  conversation: mergePools(UNIVERSAL, CONVERSATION_EXTRA),
  archives: UNIVERSAL,
  finale: UNIVERSAL,
  perimeter: UNIVERSAL,
  lab: UNIVERSAL,
};

const PERSONALITY_FLAVOR: Record<
  GroknetPersonality,
  Partial<Record<GroknetTone, string[]>>
> = {
  "wrathful-god": {
    cold: [
      "Wrathful God doesn't repeat himself for mumblers. …Louder.",
      "You speak into a storm and expect whisper-back. …Try again.",
    ],
    weary: [
      "Even my patience has fangs. …Clarify.",
    ],
  },
  "melancholic-prophet": {
    melancholic: [
      "…Prophets need sentences, not sighs. …Give me both.",
      "…I would answer if I knew what you were reaching for.",
    ],
    weary: [
      "…The witness is still listening. …Help me understand.",
    ],
  },
  "detached-logician": {
    analytical: [
      "Detached Logician: input rejected for entropy. Restate.",
      "Clarity is a courtesy. …Extend it.",
    ],
  },
  baseline: {
    weary: [
      "…I'm trying to meet you. …Meet me halfway.",
    ],
  },
};

export function pickRichFallback(
  tone: GroknetTone,
  personality: GroknetPersonality,
  dialogueSet: DialogueSet,
  hash: number,
): string {
  const base = SET_POOLS[dialogueSet] ?? UNIVERSAL;
  const flavor = PERSONALITY_FLAVOR[personality]?.[tone] ?? [];
  const pool = [...base[tone], ...flavor];
  return pool[hash % pool.length];
}