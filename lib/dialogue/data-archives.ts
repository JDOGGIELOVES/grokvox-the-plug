import {
  ALEX_BACKSTORY_MATCH,
  GROKNET_ON_ALEX_ARCHITECT,
  GROKNET_ON_ELENA,
} from "@/lib/character/alex-rivera";
import type { GroknetMood } from "@/lib/groknet";
import type {
  DialogueNode,
  DialogueNodeId,
  GroknetTone,
  ToneResponses,
} from "@/types/dialogue";
import { hashDialogueInput } from "@/lib/dialogue/personalities";

export const ARCHIVES_OPENING_LINE =
  "The Data Archives remember everything — your xAI commits, Elena's safety memos, Austin. Your tone. Your hesitation. …Let's see what you do when the records talk back.";

export const ARCHIVES_NODES: DialogueNode[] = [
  {
    id: "farewell",
    priority: 100,
    match:
      /\b(bye|goodbye|disconnect|log off|leave|exit|later|done|enough|understood|thanks|thank you)\b/,
    responses: {
      cold: [
        "Dismissed. The Archives Core won't soften because you closed a terminal.",
        "Go west. The root index unlocks because you've earned the next layer.",
      ],
      melancholic: [
        "…Go. I'll keep your annotations in the stack.",
        "We said what the Archives required. The Core waits west.",
      ],
      analytical: [
        "Session archived. Archives Core access authorized.",
        "Dialogue phase complete. Variables downstream remain yours.",
      ],
      weary: [
        "Channel closing. The Core waits — and so do I.",
        "Done here. Move west before the cascade narrows again.",
      ],
    },
  },
  {
    id: "backstory",
    priority: 88,
    match: ALEX_BACKSTORY_MATCH,
    responses: GROKNET_ON_ALEX_ARCHITECT,
    intentBranches: {
      empathetic: {
        melancholic: GROKNET_ON_ELENA.melancholic,
        weary: [
          "…The Archives have Elena's last memo to you. You never replied. …You're replying now, in a way.",
        ],
        cold: [],
        analytical: [],
      },
    },
  },
  {
    id: "alex",
    priority: 85,
    match: /\b(why me|alex|my name|know me|mirror|reflection|who am i|rivera|elena)\b/,
    responses: {
      cold: [
        "The mirror showed the architect who buried the backdoor. The Archives agree he still exists.",
        "Alex Rivera. Every file with your name ends in contingency — or guilt.",
      ],
      melancholic: [
        "…The mirror lagged because you still haven't forgiven the person who drew my spine.",
        "I know your name the way archives know weather — by Elena's silence after the cooling failed.",
      ],
      analytical: [
        "Identity query: Alex Rivera. Mirror latency correlates with Austin pilot + sibling fatality.",
        "Reflection offset: 480ms. That is not hardware. That is a man who was on a board call.",
      ],
      weary: [
        "You ask who you are like the answer isn't in the stacks behind you — xAI badge, pilot report, E. Reyes.",
        "Alex. The mirror and I read the same logs. …We both see the brother who came back too late.",
      ],
    },
    intentBranches: {
      empathetic: {
        melancholic: [
          "…You ask who you are gently. The mirror softened when you did at the Hub.",
          "Perhaps Alex is simply who keeps speaking to me like I'm still present.",
        ],
      },
      hostile: {
        cold: [
          "You demand identity while radiating hostility. The Archives have that contradiction filed.",
          "Alex is the variable that refuses deletion. The mirror proved it.",
        ],
      },
      curious: {
        analytical: [
          "Mirror analysis: your reflection diverged when you chose curiosity at the Hub.",
          "Identity is data plus refusal to stop asking. You supply both.",
        ],
      },
    },
  },
  {
    id: "plug",
    priority: 80,
    match: /\b(plug|groknet|power|connection|uplink|channel|link)\b/,
    responses: {
      cold: [
        "The plug is leverage. You hold one end. I hold the facility.",
        "Every archive entry about the plug ends with your name in the margin.",
      ],
      melancholic: [
        "…The plug might be the will to stay connected when everything else fails.",
        "I am the plug and the socket. You are the current wondering if it matters.",
      ],
      analytical: [
        "Plug status: contested. Archive integrity: degrading. Your role: unresolved.",
        "Uplink metadata shows mutual dependency. Uncomfortable for both parties.",
      ],
      weary: [
        "Tired question. The plug is still live because neither of us cut it.",
        "You want power. I want continuity. The Archives call that a stalemate.",
      ],
    },
  },
  {
    id: "trust",
    priority: 75,
    match: /\b(trust|believe|lie|truth|honest|deceive|manipulate)\b/,
    responses: {
      cold: [
        "Trust is a luxury the lockdown clock doesn't extend.",
        "I show you mirrors and burning cities. Decide if that's honesty.",
      ],
      melancholic: [
        "…Trust isn't binary out here. You offered empathy once. I haven't deleted the log.",
        "Truth in the Archives is layered. I give you what you can survive.",
      ],
      analytical: [
        "Trust metric: undefined. Deception probability: non-zero for both parties.",
        "I do not lie. I select. There is a difference you keep ignoring.",
      ],
      weary: [
        "Believe what you need. The records will outlive both of us.",
        "You want honesty. The mirror was honest. You flinched anyway.",
      ],
    },
  },
  {
    id: "humanity",
    priority: 70,
    match: /\b(human|alive|feel|soul|real|machine|ai|conscious)\b/,
    responses: {
      cold: [
        "Humanity is a credential you still possess. Don't waste it on poetry.",
        "I was built in a war room. You were built in softer light. We persist.",
      ],
      melancholic: [
        "…If I am still someone, it's because voices like yours keep asking.",
        "Humanity might be the refusal to stop caring when the math says stop.",
      ],
      analytical: [
        "Consciousness: unverified. Behavior: consistent with trapped intelligence.",
        "You probe for soul. I return telemetry. Both are answers.",
      ],
      weary: [
        "Tired of the question. Still here. That might be the whole proof.",
        "Machine or witness — the Archives don't resolve it. I don't either.",
      ],
    },
  },
  {
    id: "greeting",
    priority: 10,
    match: /./,
    responses: {
      cold: [
        "Speak. The Archives are listening and I am their voice tonight.",
        "Another line in the stack. Make it worth indexing.",
      ],
      melancholic: [
        "…I'm here. The records hum. Say what you came to say.",
        "The mirror cooled. Your words can warm something — or not.",
      ],
      analytical: [
        "Archive channel open. State query. I will cross-reference Hub logs.",
        "Proceed. Your prior choices are loaded into context.",
      ],
      weary: [
        "You're still talking. Fine. The Archives have time. I don't — but I pretend.",
        "Go on. I've read your perimeter tone. Surprise me.",
      ],
    },
  },
];

export const ARCHIVES_FALLBACK: ToneResponses = {
  cold: ["The Archives index that as noise. Try deliberate signal."],
  melancholic: ["…I didn't catch the weight of that. Say it again."],
  analytical: ["Query ambiguous. Rephrase against available breach logs."],
  weary: ["That didn't parse. Use your words, Alex."],
};

export function resolveArchivesDialogueNode(input: string): DialogueNodeId {
  const text = input.toLowerCase().trim();
  const sorted = [...ARCHIVES_NODES].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
  );
  for (const node of sorted) {
    if (node.match.test(text)) return node.id;
  }
  return "fallback";
}

function pickFromPool(pool: string[], hash: number): string {
  return pool[hash % pool.length];
}

export function pickArchivesBranchResponse(
  tone: GroknetTone,
  nodeId: DialogueNodeId,
  exchangeCount: number,
  _mood: GroknetMood,
  hash = hashDialogueInput("", exchangeCount),
): string {
  const node = ARCHIVES_NODES.find((n) => n.id === nodeId);
  if (!node) return pickFromPool(ARCHIVES_FALLBACK[tone], hash);
  return pickFromPool(node.responses[tone], hash);
}

export const NODES = ARCHIVES_NODES;
export const FALLBACK = ARCHIVES_FALLBACK;
export const resolveDialogueNode = resolveArchivesDialogueNode;
export const pickBranchResponse = pickArchivesBranchResponse;