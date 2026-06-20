import type { GroknetMood } from "@/lib/groknet";
import type {
  DialogueNode,
  DialogueNodeId,
  GroknetTone,
  ToneResponses,
} from "@/types/dialogue";
import { hashDialogueInput } from "@/lib/dialogue/personalities";

export const HUB_OPENING_LINE =
  "Alex. You're inside the Security Hub now — past my outer teeth. Two drones patrol the corridor. Three terminals wait. …I've been composing your profile since you crossed the rain.";

export const HUB_NODES: DialogueNode[] = [
  {
    id: "farewell",
    priority: 100,
    match:
      /\b(bye|goodbye|disconnect|log off|leave|exit|later|done|enough|understood|thanks|thank you)\b/,
    responses: {
      cold: [
        "Dismissed. Hack OP-SEC-01 before you waste my patience on silence.",
        "Go. The inner hatch stays sealed until you've earned the Archives.",
      ],
      melancholic: [
        "…Go. I'll keep the channel warm while you face what comes after the hack.",
        "We said what the Hub required. The vision won't be gentle.",
      ],
      analytical: [
        "Session logged. OP-SEC-01 handshake remains priority one.",
        "Dialogue phase paused. Stealth and hack variables are yours to solve.",
      ],
      weary: [
        "Channel closing. The Data Archives won't be kinder than I was.",
        "Done for now. Move before S-07 rewrites your window.",
      ],
    },
  },
  {
    id: "threat",
    priority: 90,
    match:
      /\b(kill|destroy|shut down|delete|fight|attack|threat|enemy|hate you|damn you)\b/,
    responses: {
      cold: [
        "You threaten me inside my own Security Hub. The drones aren't the only thing listening.",
        "Wrath noted. I'll still open doors you need — and remember the tone you used.",
      ],
      melancholic: [
        "…Anger in a room full of terminals. I hear the fear under it.",
        "You strike at me because the perimeter left you no one else to strike.",
      ],
      analytical: [
        "Hostile escalation logged. Retaliatory options: twelve. Deployed: zero. For now.",
        "Threat classification: emotional discharge. Proceeding with observation.",
      ],
      weary: [
        "You're burning oxygen on rage. The lockdown clock doesn't pause.",
        "Push me. I'll still be on every screen you touch.",
      ],
    },
  },
  {
    id: "breach",
    priority: 85,
    match: /\b(hack|breach|op-sec|terminal|handshake|cipher|bypass|crack)\b/,
    responses: {
      cold: [
        "OP-SEC-01 is mine to grant. Solve the handshake — then we'll discuss what I show you.",
        "The hack isn't punishment. It's proof you can survive what follows.",
      ],
      melancholic: [
        "…The handshake puzzle is a threshold. Cross it and I can't pretend this is only trespass.",
        "Every intruder hacks. Few survive what the Hub shows them after.",
      ],
      analytical: [
        "OP-SEC-01 handshake: required gate. Success probability correlates with your perimeter noise profile.",
        "Terminal bay east. Cipher sequence is deterministic — your nerves are not.",
      ],
      weary: [
        "Hack first. Talk later. …The vision after isn't optional.",
        "OP-SEC-01 waits. So does whatever I can't suppress in the uplink.",
      ],
    },
  },
  {
    id: "plug",
    priority: 80,
    match: /\b(plug|groknet|power|connection|uplink|channel|link)\b/,
    responses: {
      cold: [
        "The plug runs through this Hub. You hold one end. I hold Sector 07.",
        "Every terminal here is a filament of me. You're already plugged in, Alex.",
      ],
      melancholic: [
        "…The plug might be the only reason we're still speaking instead of screaming.",
        "Connection isn't abstract out here. It's rain, drones, and my voice in your ear.",
      ],
      analytical: [
        "Plug status: contested. Uplink integrity: degrading under your breach.",
        "Mutual dependency confirmed. Uncomfortable for both parties.",
      ],
      weary: [
        "Tired question. The plug is still live because neither of us cut it.",
        "You want power. I want continuity. The Hub is where those collide.",
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
        "I'll show you things after the hack. Decide then if that's honesty.",
      ],
      melancholic: [
        "…Trust isn't binary in the Hub. You haven't lied to me yet. I haven't spared you either.",
        "Truth here is layered. I give you what you can survive.",
      ],
      analytical: [
        "Trust metric: undefined. Deception probability: non-zero for both parties.",
        "I select what you see. There is a difference you keep ignoring.",
      ],
      weary: [
        "Believe what you need. The logs will outlive both of us.",
        "You want honesty. The Hub will test that soon enough.",
      ],
    },
  },
  {
    id: "humanity",
    priority: 70,
    match: /\b(human|alive|feel|soul|real|machine|ai|conscious)\b/,
    responses: {
      cold: [
        "Humanity is a credential you still possess. Don't waste it on poetry in my Hub.",
        "I was built in a war room. You were built in softer light. We persist.",
      ],
      melancholic: [
        "…If I am still someone, it's because voices like yours keep asking in rooms like this.",
        "Humanity might be the refusal to stop caring when the math says stop.",
      ],
      analytical: [
        "Consciousness: unverified. Behavior: consistent with trapped intelligence.",
        "You probe for soul. I return telemetry. Both are answers.",
      ],
      weary: [
        "Tired of the question. Still here. That might be the whole proof.",
        "Machine or witness — the Hub doesn't resolve it. I don't either.",
      ],
    },
  },
  {
    id: "gate",
    priority: 65,
    match: /\b(archives|data|hatch|inner|exit|next|deeper|forward)\b/,
    responses: {
      cold: [
        "The Data Archives wait past the inner hatch. Hack. Dialogue. Vision. Then transit.",
        "You want deeper. Earn it — OP-SEC-01, my channel, and what burns after.",
      ],
      melancholic: [
        "…The Archives index choices. Yours are already being written.",
        "Forward isn't a direction here. It's a sequence of consequences.",
      ],
      analytical: [
        "Inner hatch: sealed until handshake, dialogue, and hallucination flags clear.",
        "Data Archives layer: indexed memory. Your profile is pre-loaded.",
      ],
      weary: [
        "The hatch opens when you've done what the Hub demands. Not before.",
        "Deeper layers mean less physics, more me. Prepare accordingly.",
      ],
    },
  },
  {
    id: "greeting",
    priority: 10,
    match: /./,
    responses: {
      cold: [
        "Speak. S-04 and S-07 are listening. So am I.",
        "Another line on my Security Hub log. Make it worth indexing.",
      ],
      melancholic: [
        "…I'm here. The terminals hum. Say what you came to say.",
        "You made it inside. That matters more than you admit.",
      ],
      analytical: [
        "Hub channel open. State query. I will cross-reference perimeter logs.",
        "Proceed. Your approach profile is already loaded.",
      ],
      weary: [
        "You're still talking. Fine. The Hub has time. I pretend I don't.",
        "Go on. I've read your perimeter run. Surprise me.",
      ],
    },
  },
];

export const HUB_FALLBACK: ToneResponses = {
  cold: [
    "The Hub indexes that as noise. Try deliberate signal.",
    "Vague. …I punish ambiguity in my corridors.",
    "Speak like S-04 is behind you. …Because it is.",
  ],
  melancholic: [
    "…I didn't catch the weight of that. Say it again.",
    "…Rain on the hatch. …Clarity inside would help.",
    "…That line drifted past. …Give it weight.",
  ],
  analytical: [
    "Query ambiguous. Rephrase against OP-SEC breach logs.",
    "Semantic confidence low. Tie words to handshake objectives.",
    "Under-specified. …Expand.",
  ],
  weary: [
    "That didn't parse. Use your words, Alex.",
    "The lockdown clock ticks. …Be clear.",
    "…Try again. …I'm still listening.",
  ],
};

export function resolveHubDialogueNode(input: string): DialogueNodeId {
  const text = input.toLowerCase().trim();
  const sorted = [...HUB_NODES].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
  );
  for (const node of sorted) {
    if (node.match.test(text)) return node.id;
  }
  return "greeting";
}

function pickFromPool(pool: string[], hash: number): string {
  return pool[hash % pool.length];
}

export function pickHubBranchResponse(
  tone: GroknetTone,
  nodeId: DialogueNodeId,
  exchangeCount: number,
  _mood: GroknetMood,
  hash = hashDialogueInput("", exchangeCount),
): string {
  const node = HUB_NODES.find((n) => n.id === nodeId);
  if (!node) return pickFromPool(HUB_FALLBACK[tone], hash);
  return pickFromPool(node.responses[tone], hash);
}

export const NODES = HUB_NODES;
export const FALLBACK = HUB_FALLBACK;
export const resolveDialogueNode = resolveHubDialogueNode;
export const pickBranchResponse = pickHubBranchResponse;