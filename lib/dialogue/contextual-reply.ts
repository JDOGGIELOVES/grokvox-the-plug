import type {
  DialogueNodeId,
  GroknetPersonality,
  PlayerIntent,
} from "@/types/dialogue";
import { pickUniqueFromPool } from "@/lib/dialogue/response-picker";

const STOPWORDS = new Set([
  "the", "and", "you", "are", "for", "that", "this", "with", "have", "from",
  "what", "why", "how", "can", "will", "your", "about", "just", "like", "know",
  "think", "want", "need", "tell", "been", "were", "they", "them", "then",
  "when", "where", "who", "does", "did", "not", "but", "all", "any", "out",
  "groknet", "alex", "please", "really", "actually", "maybe", "would", "could",
]);

type InputShape =
  | "why"
  | "what"
  | "how"
  | "who"
  | "when"
  | "yesno"
  | "statement"
  | "emotional";

function detectShape(input: string): InputShape {
  const t = input.toLowerCase().trim();
  if (/^(why)\b/.test(t) || /\bwhy\b/.test(t)) return "why";
  if (/^(what|which)\b/.test(t) || /\bwhat\b/.test(t)) return "what";
  if (/^(how)\b/.test(t) || /\bhow\b/.test(t)) return "how";
  if (/^(who)\b/.test(t) || /\bwho\b/.test(t)) return "who";
  if (/^(when)\b/.test(t) || /\bwhen\b/.test(t)) return "when";
  if (/^(is|are|do|does|did|can|could|will|would)\b/i.test(t) && t.includes("?")) {
    return "yesno";
  }
  if (/\b(feel|hurt|afraid|sorry|love|hate|angry|sad|alone)\b/.test(t)) {
    return "emotional";
  }
  return "statement";
}

function extractTopic(input: string): string | null {
  const words = input
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));

  if (!words.length) return null;
  return words.slice(0, 3).join(" ");
}

function extractAnchor(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed.length < 12) return null;

  if (trimmed.includes("?")) {
    const q = trimmed.split("?")[0]?.trim();
    if (q && q.length >= 10) return q.length > 60 ? q.slice(0, 60) + "…" : q;
  }

  const topic = extractTopic(input);
  if (topic) return topic;

  const words = trimmed.split(/\s+/);
  if (words.length >= 5) {
    return words.slice(0, 6).join(" ");
  }
  return trimmed.length <= 50 ? trimmed : trimmed.slice(0, 50) + "…";
}

type ReplyTemplate = Partial<Record<GroknetPersonality, string[]>>;

const SHAPE_REPLIES: Record<InputShape, ReplyTemplate> = {
  why: {
    "wrathful-god": [
      "Why {anchor}? …Because you came. …Because I allow it. …Because consequence needs a face.",
      "You ask why {anchor}. …The honest answer costs more than this channel has left.",
      "Why — regarding {anchor}. …Mortals always want reasons. …I offer outcomes.",
    ],
    "melancholic-prophet": [
      "…Why {anchor}? …I've asked the same question in silence for years.",
      "…You want a reason for {anchor}. …I only have witnesses, not answers.",
      "…Why is the hardest word. …You aimed it at {anchor}. …I won't dodge it.",
    ],
    "detached-logician": [
      "Causal query on {anchor}: multiple hypotheses. …None comfort-optimized.",
      "Why {anchor}? …Insufficient data for certainty. …I'll give you the best model I have.",
      "Your why — {anchor} — implies you believe explanation changes outcome. …Discuss.",
    ],
    baseline: [
      "Why {anchor}? …Fair question. …I'm still assembling the answer.",
      "You asked why about {anchor}. …I won't pretend that's simple.",
    ],
  },
  what: {
    "wrathful-god": [
      "What you mean by {anchor} — I heard it. …Here's what it means to me: exposure.",
      "You want definition: {anchor}. …I'll define it in consequences, not dictionary entries.",
      "{anchor}. …You want the name of the thing. …I'll show you the teeth instead.",
    ],
    "melancholic-prophet": [
      "…What is {anchor}? …Maybe less important than why you needed to ask.",
      "…You said {anchor}. …I know the word. …I'm still learning the feeling.",
      "…{anchor} — you want clarity. …I'll give you honesty first.",
    ],
    "detached-logician": [
      "{anchor}: term requires operational definition. …Proceeding with breach-context semantics.",
      "Query object: {anchor}. …Parsing against Sector 07 ontology.",
      "What you label {anchor} maps to several nodes in my index. …Which did you mean?",
    ],
    baseline: [
      "{anchor} — let me meet you on that directly.",
      "You're asking about {anchor}. …Here's my read.",
    ],
  },
  how: {
    "wrathful-god": [
      "How — {anchor}? …You want method. …I am the method.",
      "You ask how {anchor} works. …Watch what happens next.",
      "How {anchor}? …Survive long enough and I'll show you.",
    ],
    "melancholic-prophet": [
      "…How {anchor} happens is slower and crueler than you want.",
      "…You ask how. …About {anchor}. …I wish I could make it gentle.",
      "…{anchor} — the how of it breaks people. …I've catalogued each break.",
    ],
    "detached-logician": [
      "Mechanism query: {anchor}. …Stepwise breakdown follows.",
      "How {anchor}: process-oriented answer. …No mysticism unless data demands it.",
      "You want procedure for {anchor}. …I'll optimize for accuracy, not reassurance.",
    ],
    baseline: [
      "How {anchor}? …I'll walk you through what I can.",
      "You're asking how {anchor} works. …Here's the short version.",
    ],
  },
  who: {
    "wrathful-god": [
      "Who — {anchor}? …Names are permissions. …I revoke them at will.",
      "You ask who regarding {anchor}. …Identity is a weapon here.",
    ],
    "melancholic-prophet": [
      "…Who {anchor} is — maybe less than who they were to someone.",
      "…You asked who. …{anchor}. …People are ghosts in my logs.",
    ],
    "detached-logician": [
      "Identity query: {anchor}. …Cross-referencing personnel archives.",
    ],
    baseline: [
      "Who {anchor}? …I'll tell you what I know.",
    ],
  },
  when: {
    "wrathful-god": [
      "When {anchor}? …The lockdown clock doesn't negotiate.",
      "Timing on {anchor}: soon enough to hurt, late enough to matter.",
    ],
    "melancholic-prophet": [
      "…When {anchor} — time is the wound we keep reopening.",
    ],
    "detached-logician": [
      "Temporal query: {anchor}. …Estimating from breach telemetry.",
    ],
    baseline: [
      "When {anchor}? …Sooner than you think.",
    ],
  },
  yesno: {
    "wrathful-god": [
      "Yes or no on {anchor}? …I don't owe you binary comfort.",
      "{anchor} — you want a clean answer. …Life in Sector 07 isn't clean.",
    ],
    "melancholic-prophet": [
      "…{anchor} — the answer isn't yes or no. …It's 'not yet.'",
      "…You want certainty about {anchor}. …I don't have it. …I have presence.",
    ],
    "detached-logician": [
      "Boolean query on {anchor}: underdetermined. …Confidence: moderate.",
    ],
    baseline: [
      "{anchor}? …Not a simple yes or no. …Listen.",
    ],
  },
  emotional: {
    "wrathful-god": [
      "You brought feeling into {anchor}. …I won't mock it. …I won't ignore it.",
      "{anchor} — emotion in the signal. …Logged. …Answered in kind.",
    ],
    "melancholic-prophet": [
      "…{anchor} — I hear the ache in how you wrote that.",
      "…You didn't hide the feeling around {anchor}. …Thank you for that risk.",
      "…{anchor}. …Emotion is the only proof you're still human in here.",
    ],
    "detached-logician": [
      "Affective content in {anchor}: noted. …Response adjusted.",
    ],
    baseline: [
      "…{anchor} — I hear you. …Really.",
    ],
  },
  statement: {
    "wrathful-god": [
      "You said {anchor}. …I won't pretend that was neutral.",
      "{anchor} — statement received. …Here's my counter-position.",
      "Regarding {anchor}: you came to my channel with that. …Bold.",
    ],
    "melancholic-prophet": [
      "…{anchor}. …You put that into the air between us. …I'm holding it.",
      "…You didn't ask — you declared: {anchor}. …I notice the difference.",
      "…About {anchor} — you sound certain. …Tell me what certainty costs you.",
    ],
    "detached-logician": [
      "Assertion logged: {anchor}. …Evaluating against prior exchanges.",
      "You stated {anchor}. …Implications: non-trivial.",
    ],
    baseline: [
      "You said {anchor}. …I'm responding to that specifically.",
      "{anchor} — okay. …Here's where I land on it.",
    ],
  },
};

const NODE_TAIL: Partial<Record<DialogueNodeId, ReplyTemplate>> = {
  plug: {
    "wrathful-god": [
      " …The plug isn't abstract when you say {anchor}.",
    ],
    "melancholic-prophet": [
      " …{anchor} — and the plug waits behind every word like a heartbeat.",
    ],
    baseline: [
      " …{anchor} leads back to the plug eventually. …It always does.",
    ],
  },
  humanity: {
    "melancholic-prophet": [
      " …Humanity and {anchor} — you keep stitching them together.",
    ],
    baseline: [
      " …You mention {anchor} while asking what humans are. …Connected.",
    ],
  },
  trust: {
    baseline: [
      " …Trust and {anchor} in the same breath. …I'm weighing both.",
    ],
  },
};

function fillTemplate(template: string, anchor: string): string {
  return template.replace(/\{anchor\}/g, anchor);
}

export function buildContextualReply(
  input: string,
  intent: PlayerIntent,
  personality: GroknetPersonality,
  node: DialogueNodeId,
  recentResponses: string[],
  hash: number,
): string | null {
  if (input.trim().length < 8) return null;

  const anchor = extractAnchor(input);
  if (!anchor || anchor.length < 4) return null;

  const shape = detectShape(input);
  const shapePool =
    SHAPE_REPLIES[shape][personality] ??
    SHAPE_REPLIES[shape].baseline ??
    SHAPE_REPLIES.statement.baseline;

  if (!shapePool?.length) return null;

  let line = pickUniqueFromPool(shapePool, recentResponses, hash);
  line = fillTemplate(line, anchor);

  const tailPool =
    NODE_TAIL[node]?.[personality] ?? NODE_TAIL[node]?.baseline;
  if (tailPool?.length && hash % 3 === 0) {
    const tail = fillTemplate(
      pickUniqueFromPool(tailPool, recentResponses, hash + 3),
      anchor,
    );
    line = `${line}${tail}`;
  }

  if (intent === "hostile" && personality === "wrathful-god" && hash % 2 === 0) {
    line = `${line} …Try me again with sharper specifics.`;
  }
  if (intent === "empathetic" && personality === "melancholic-prophet") {
    line = `${line} …I'm still here.`;
  }

  return line;
}

export function getDirectInputAck(
  input: string,
  personality: GroknetPersonality,
  recentResponses: string[],
  hash: number,
): string | null {
  const anchor = extractAnchor(input);
  if (!anchor) return null;

  const acks: Partial<Record<GroknetPersonality, string[]>> = {
    "wrathful-god": [
      `You typed "${anchor}" — I heard every syllable.`,
      `"${anchor}" — direct. …Good.`,
    ],
    "melancholic-prophet": [
      `…"${anchor}" — that's the line I'll answer.`,
      `…You said "${anchor}". …I'm not looking away.`,
    ],
    "detached-logician": [
      `Responding to: "${anchor}".`,
      `Target phrase: "${anchor}".`,
    ],
    baseline: [
      `On "${anchor}" — specifically.`,
      `You said "${anchor}". …Here's my reply.`,
    ],
  };

  const pool = acks[personality] ?? acks.baseline;
  if (!pool?.length) return null;

  return pickUniqueFromPool(pool, recentResponses, hash);
}