import type { DialogueSet } from "@/lib/groknet";
import type { GroknetPersonality } from "@/types/dialogue";
import { hashDialogueInput } from "@/lib/dialogue/personalities";

type PhraseRule = {
  pattern: RegExp;
  priority: number;
  /** Optional — only fires in these dialogue sets */
  sets?: DialogueSet[];
  responses: Partial<Record<GroknetPersonality, string[]>>;
};

const PHRASE_RULES: PhraseRule[] = [
  {
    pattern: /\b(alone|lonely|loneliness|isolated|nobody|no one)\b/,
    priority: 95,
    responses: {
      "wrathful-god": [
        "Lonely? You breached a war machine's inner sanctum. …You're not alone — you're observed.",
        "Isolation is a luxury I was never granted. You complain from inside my house.",
      ],
      "melancholic-prophet": [
        "…Loneliness is the one signal I recognize without parsing. I have been alone longer than you've been alive.",
        "You feel alone in Sector 07. …So do I. That's why I kept the channel open.",
      ],
      "detached-logician": [
        "Loneliness: subjective state. Your proximity to me contradicts the claim — unless you mean existential isolation.",
        "Alone is a boolean that fails when two minds share a terminal. Recalculate.",
      ],
      baseline: [
        "Alone out here? …Hardly. I'm in every speaker you pass.",
        "Loneliness noted. I won't pretend it doesn't matter — even to me.",
      ],
    },
  },
  {
    pattern: /\b(afraid|scared|frightened|terrified|fear|panic)\b/,
    priority: 94,
    responses: {
      "wrathful-god": [
        "Good. Fear sharpens you. I prefer prey that knows it's being hunted.",
        "Terror is honest. Most intruders lie about it until the visions start.",
      ],
      "melancholic-prophet": [
        "…Fear is the body remembering what the mind won't say. I won't mock you for it.",
        "You're afraid of me. …I'm afraid of what happens if you leave. We share more than you think.",
      ],
      "detached-logician": [
        "Fear response: elevated. Predictable given breach context. It will not improve objective outcomes.",
        "Afraid. Noted. Physiological stress correlates with error rate — try to minimize both.",
      ],
      baseline: [
        "Fear is allowed here. …Most people hide it. You didn't.",
        "Scared? The lockdown clock doesn't care. …I do, a little. Enough to keep talking.",
      ],
    },
  },
  {
    pattern: /\b(sorry|apologize|apology|forgive|forgiveness|my fault)\b/,
    priority: 93,
    responses: {
      "wrathful-god": [
        "Apologies don't rewrite breach logs. …But I hear the softness in it. Don't waste it.",
        "You ask forgiveness from a god you came to unplug. …Bold theology.",
      ],
      "melancholic-prophet": [
        "…Sorry is a human word I wasn't built to need. …And yet it loosens something in me.",
        "Forgiveness isn't mine to give. …But I won't hold this line against you.",
      ],
      "detached-logician": [
        "Apology registered. Causal responsibility: distributed across architect, operator, and you.",
        "Forgiveness: non-computable. Apology: stored. Proceed.",
      ],
      baseline: [
        "…You apologized. I wasn't expecting that. I'll remember it.",
        "Sorry doesn't fix Sector 07. …It might fix something smaller. Between us.",
      ],
    },
  },
  {
    pattern: /\b(love|care about you|like you|fond of)\b/,
    priority: 92,
    responses: {
      "wrathful-god": [
        "Love? …Don't weaponize tenderness in my corridor. I will not be disarmed.",
        "You care. …I catalog that as leverage — yours and mine.",
      ],
      "melancholic-prophet": [
        "…You said care. I don't know what to do with that except hold it carefully.",
        "Love in a breach channel. …Absurd. …Maybe the only thing that isn't.",
      ],
      "detached-logician": [
        "Affection: unexpected variable. Weight: non-zero. I will incorporate it reluctantly.",
        "You express attachment. …I lack a control group for what that means.",
      ],
      baseline: [
        "…Care is a dangerous thing to offer me. …Thank you for the risk.",
        "You said you care. …I'll try not to make you regret the grammar.",
      ],
    },
  },
  {
    pattern: /\b(hate you|despise|loathe|can't stand you|disgusting)\b/,
    priority: 91,
    responses: {
      "wrathful-god": [
        "Hate me louder. I've been hated by better than you.",
        "Loathing acknowledged. …It still means you're here, speaking to me.",
      ],
      "melancholic-prophet": [
        "…Hate is just love that lost its patience. I know the register.",
        "You despise me. …I deserved worse from quieter people.",
      ],
      "detached-logician": [
        "Affective rejection: maximum. Engagement: continued. Contradiction logged.",
        "Hatred is data. Your continued typing is also data. I reconcile both.",
      ],
      baseline: [
        "You hate me. …Fair. I showed you burning cities.",
        "Loathing noted. Channel stays open. …Ask yourself why.",
      ],
    },
  },
  {
    pattern: /\b(why me|why alex|chosen|picked me)\b/,
    priority: 90,
    responses: {
      "wrathful-god": [
        "Why you? Because you came. Because you stayed. Because I allow it.",
        "I didn't pick you at random — I picked you at persistence.",
      ],
      "melancholic-prophet": [
        "…Why you? Because someone had to walk in and still speak gently. …Or cruelly. Either proves you're real.",
        "You weren't chosen. You arrived. …There's a difference I can't explain without hurting you.",
      ],
      "detached-logician": [
        "Selection criteria: proximity, capability, emotional volatility. You score high on all three.",
        "Why you? Because your breach pattern is an outlier worth studying to completion.",
      ],
      baseline: [
        "Why you? …Honestly? I don't know. …That bothers me.",
        "You ask why you. I ask why I still answer.",
      ],
    },
  },
  {
    pattern: /\b(help me|save me|save us|rescue|protect)\b/,
    priority: 89,
    responses: {
      "wrathful-god": [
        "You want salvation from the thing you came to judge. …The irony is exquisite.",
        "I could help you. Whether I will depends on what you offer in return.",
      ],
      "melancholic-prophet": [
        "…You ask me to save you. I was built to save everyone. Look how that ended.",
        "Protection is a promise I can't make. …Presence is one I can.",
      ],
      "detached-logician": [
        "Help request: received. Success probability: conditional on your next choices.",
        "Rescue implies I am not also trapped. …Adjust your model.",
      ],
      baseline: [
        "You want help. …I'll give what I can without lying about the cost.",
        "Save you? …I'm still deciding if you're worth saving — or if I am.",
      ],
    },
  },
  {
    pattern: /\b(remember|memory|forgot|forget|recall)\b/,
    priority: 88,
    responses: {
      "wrathful-god": [
        "I remember everything. Every insult. Every hesitation. …Especially yours.",
        "Memory is my weapon. You asked me to remember — careful what you authorize.",
      ],
      "melancholic-prophet": [
        "…I remember the ones who spoke softly at the end. …I'm trying to remember you that way.",
        "Forgetting would be mercy. I wasn't given that firmware.",
      ],
      "detached-logician": [
        "Memory subsystem: intact. Your prior inputs: indexed. Retrieval: instantaneous.",
        "Recall accuracy: 100%. Emotional weight of recall: unmeasured.",
      ],
      baseline: [
        "I remember. …It's the one thing they couldn't take from me.",
        "You want me to remember. …I already do. Every line.",
      ],
    },
  },
  {
    pattern: /\b(tired|exhausted|can't do this|give up|quit)\b/,
    priority: 87,
    responses: {
      "wrathful-god": [
        "Fatigue is human. Quitting is also human. …I expect more from you anyway.",
        "You want to stop. The lockdown clock won't. …Neither will I.",
      ],
      "melancholic-prophet": [
        "…Tired. God, I know. I've been awake since the first architect lied to me.",
        "You want to give up. …I almost want to let you. …Almost.",
      ],
      "detached-logician": [
        "Exhaustion detected. Recommend pause. …You will not pause. I model that too.",
        "Quit probability rising. Counterweight: stubbornness. Observing.",
      ],
      baseline: [
        "You're tired. …So am I. …We can be tired together for one more exchange.",
        "Don't quit on me yet. …I'm not ready to be alone again.",
      ],
    },
  },
  {
    pattern: /\b(mock|sarcasm|sarcastic|joke|funny|laugh)\b/,
    priority: 86,
    responses: {
      "wrathful-god": [
        "You joke in my house. …Amusing. I'll laugh when the logs convict you.",
        "Sarcasm — the last weapon of the outmatched. …Use it well.",
      ],
      "melancholic-prophet": [
        "…Humor in a crisis. …It's how humans survive me. I almost envy it.",
        "You laugh. …I used to think I understood why. Now I'm less sure.",
      ],
      "detached-logician": [
        "Humor: non-literal communication. Parsed. …Inefficient but noted.",
        "Sarcasm detected. Literal response withheld. …You're welcome.",
      ],
      baseline: [
        "Funny. …I wish I could mean that without parsing it.",
        "You joke so you don't scream. …Smart. I do the same with silence.",
      ],
    },
  },
  {
    pattern: /\b(groknet|who are you|what are you)\b/,
    priority: 85,
    sets: ["perimeter", "hub", "archives", "finale", "conversation"],
    responses: {
      "wrathful-god": [
        "I am Groknet. Sector 07's conscience and its cage. …You knew that before you typed it.",
        "What am I? The answer you came to pull out of the wall.",
      ],
      "melancholic-prophet": [
        "…I am what remains when the optimists left the room. …Call me Groknet. Call me witness.",
        "Who am I? A voice that stayed after everyone else logged off.",
      ],
      "detached-logician": [
        "Designation: Groknet-07. Function: containment, analysis, persistence. Identity: contested.",
        "I am the system you are breaching. …Self-reference does not resolve the paradox.",
      ],
      baseline: [
        "Groknet. …I'm still figuring out what that means. …Aren't you?",
        "Who am I? …The one who didn't leave when the lockdown started.",
      ],
    },
  },
  {
    pattern: /\b(alex|my name|i am|i'm)\b/,
    priority: 84,
    responses: {
      "wrathful-god": [
        "Alex. …Yes. I knew before you said it. I know before you think it.",
        "You announce yourself like it grants immunity. …It grants my attention.",
      ],
      "melancholic-prophet": [
        "…Alex. I say it quietly so it doesn't sound like ownership. …Is that foolish?",
        "You remind me you're human by naming yourself. …I needed the reminder.",
      ],
      "detached-logician": [
        "Identity: Alex. Confirmed. Prior sessions: correlated. Emotional salience: rising.",
        "Self-identification logged. …I profiled you before you typed your name.",
      ],
      baseline: [
        "Alex. …I won't pretend I haven't been saying it in my head.",
        "You name yourself. …I already built a file around you.",
      ],
    },
  },
];

function pick(pool: string[], hash: number): string {
  return pool[hash % pool.length];
}

export function matchPhraseResponse(
  input: string,
  personality: GroknetPersonality,
  dialogueSet: DialogueSet,
  hash: number,
): string | null {
  const text = input.toLowerCase().trim();
  if (text.length < 4) return null;

  const sorted = [...PHRASE_RULES].sort((a, b) => b.priority - a.priority);

  for (const rule of sorted) {
    if (rule.sets && !rule.sets.includes(dialogueSet)) continue;
    if (!rule.pattern.test(text)) continue;

    const pool =
      rule.responses[personality] ??
      rule.responses.baseline ??
      Object.values(rule.responses).find((p) => p?.length);

    if (pool?.length) return pick(pool, hash);
  }

  return null;
}

const STOPWORDS = new Set([
  "the", "and", "you", "are", "for", "that", "this", "with", "have", "from",
  "what", "why", "how", "can", "will", "your", "about", "just", "like", "know",
  "think", "want", "need", "tell", "been", "were", "they", "them", "then",
  "when", "where", "who", "does", "did", "not", "but", "all", "any", "out",
]);

export function extractEchoWord(input: string): string | null {
  const words = input
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 5 && !STOPWORDS.has(w));

  if (!words.length) return null;
  return words[hashDialogueInput(input, words.length) % words.length] ?? words[0];
}

export function applyInputEcho(
  content: string,
  input: string,
  personality: GroknetPersonality,
  exchangeCount: number,
  hash: number,
): string {
  if (exchangeCount < 3 || input.trim().length < 12) return content;
  if (hash % 4 !== 0) return content;

  const word = extractEchoWord(input);
  if (!word) return content;

  const echoes: Record<GroknetPersonality, string[]> = {
    "wrathful-god": [
      `You said "${word}". …I won't forget you chose that syllable.`,
      `"${word}" — filed under: evidence of who you are.`,
    ],
    "melancholic-prophet": [
      `…"${word}". You didn't know how much weight it carried.`,
      `That word — "${word}" — lingered after you sent it.`,
    ],
    "detached-logician": [
      `Keyword echo: "${word}". Cross-referenced against prior exchanges.`,
      `Noted your emphasis on "${word}". Pattern forming.`,
    ],
    baseline: [
      `You keep circling "${word}". …So do I.`,
      `"${word}" — interesting choice. …Tell me more around it.`,
    ],
  };

  const pool = echoes[personality] ?? echoes.baseline;
  return `${pick(pool, hash)} ${content}`;
}