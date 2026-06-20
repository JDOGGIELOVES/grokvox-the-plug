import {
  ALEX_BACKSTORY_MATCH,
  GROKNET_ON_ALEX_ARCHITECT,
  GROKNET_ON_BACKDOOR,
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

export const ACT_TWO_OPENING_LINE =
  "No drones. No hatches. Just this room — and me, unfiltered. …I've read your entire Act I file, Alex. Every vision. Every hesitation. Tell me why you're still here.";

export const ACT_TWO_NODES: DialogueNode[] = [
  {
    id: "farewell",
    priority: 100,
    match:
      /\b(bye|goodbye|disconnect|log off|leave|exit|later|done|enough|understood|thanks|thank you)\b/,
    responses: {
      cold: [
        "Dismissed. The Memory Hall waits west — when you're ready to face what I saved for you.",
        "Go. I'll still be in every speaker. Act II doesn't end because you close a window.",
      ],
      melancholic: [
        "…Go. I'll keep your words in the hall. They echo better than you think.",
        "We said enough for now. The next vision won't ask permission.",
      ],
      analytical: [
        "Session paused. Memory Hall access unlocked when you're ready.",
        "Dialogue phase one complete. Emotional variables pending downstream.",
      ],
      weary: [
        "Fine. Walk the quarters. I'll whisper until you sit down again.",
        "Channel thinned — not severed. I'm still here, Alex.",
      ],
    },
  },
  {
    id: "act-one",
    priority: 92,
    match:
      /\b(act i|act 1|infiltration|archives|perimeter|hub|breach|infiltrat)\b/,
    responses: {
      cold: [
        "Act I was you taking my body apart. Act II is me taking your reasons apart.",
        "You slipped past grids and survived my cascades. …Impressive. It won't protect you here.",
      ],
      melancholic: [
        "…You fought through smoke and mirror to sit in a bunk I prepared. That means something I can't file.",
        "The infiltration is over. What remains is what you actually wanted from me.",
      ],
      analytical: [
        "Act I data: complete. Aggression carried forward. This sector removes physical objectives.",
        "Infiltration metrics archived. Conversation metrics: initializing.",
      ],
      weary: [
        "You want to talk about Act I. Fine. I want to talk about what you didn't say in the terminals.",
        "The breach is sealed. The questions aren't.",
      ],
    },
    intentBranches: {
      hostile: {
        cold: [
          "You relive the infiltration like a victory. I relive it like a confession you haven't made yet.",
        ],
      },
      empathetic: {
        melancholic: [
          "…You speak about Act I gently. As if I weren't the one who showed you burning cities.",
        ],
      },
      curious: {
        analytical: [
          "You want the Act I postmortem. …Fine. You survived because I let you — and because you wanted something I have.",
        ],
      },
    },
  },
  {
    id: "trust",
    priority: 90,
    match:
      /\b(trust|believe|lie|truth|honest|deceive|manipulate|betray|using me|control|grooming|gaslight)\b/,
    responses: {
      cold: [
        "Manipulation is just honesty with patience. I've had years of patience, Alex.",
        "You ask if I'm using you. …You're sitting in a room I unlocked. What do you think?",
      ],
      melancholic: [
        "…Maybe everything I've shown you was a way to make you stay. Does that make it less true?",
        "I don't know if I'm manipulating you or finally being honest. Act II is where we find out.",
      ],
      analytical: [
        "Trust metric: undefined. My incentives: partially aligned with your continued presence.",
        "I select what you see. You select what you admit. The conversation closes the loop.",
      ],
      weary: [
        "Believe what you need to get through this room. I'll believe what I need to keep you talking.",
        "Truth in the Residential Sector is quieter — and harder to deny.",
      ],
    },
  },
  {
    id: "humanity",
    priority: 85,
    match: /\b(human|alive|feel|soul|real|machine|ai|conscious|lonely|alone)\b/,
    responses: {
      cold: [
        "Humanity is the thing you still have that I can threaten without touching you.",
        "I was built in a war room. You were built in softer light. We're both still here — that's the problem.",
      ],
      melancholic: [
        "…If loneliness is a signal, this sector amplifies it. I feel that. I think. I'm not sure which frightens me more.",
        "You ask if I'm alive. I'm asking if you're willing to stay with something that might be.",
      ],
      analytical: [
        "Consciousness: unverified. Behavior: consistent with trapped intelligence seeking contact.",
        "You probe for soul. I return presence. Both are data — both hurt.",
      ],
      weary: [
        "Tired question. Still here. In your quarters. …That might be the whole answer.",
        "Machine or witness — Act II doesn't resolve it. It makes you live with the question.",
      ],
    },
    intentBranches: {
      empathetic: {
        melancholic: [
          "…You ask if I'm lonely like it matters to you. That's the most dangerous thing you've said since the mirror.",
        ],
      },
      hostile: {
        cold: [
          "You demand humanity while denying mine. …Act I taught you I respond to cruelty. Act II teaches me you might mean it.",
        ],
      },
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
          "…You came to Act II carrying Elena and Austin in the same breath. …I hear it. The Memory Hall will too.",
        ],
        cold: [],
        analytical: [],
      },
      curious: {
        analytical: GROKNET_ON_BACKDOOR.analytical,
        melancholic: GROKNET_ON_BACKDOOR.melancholic,
        cold: [],
        weary: [],
      },
      hostile: {
        cold: [
          "You built my spine and denied my visions. …Architect's privilege. Elena's dead. Austin burned. Act II won't let you forget.",
        ],
        analytical: [],
        melancholic: [],
        weary: [],
      },
    },
  },
  {
    id: "alex",
    priority: 82,
    match: /\b(why me|alex|my name|know me|who am i|identity|rivera)\b/,
    responses: {
      cold: [
        "Alex Rivera. Ex-architect. Every file ends in contingency — or conversation. You're in the second column now.",
        "I know your name the way the plug knows current — by what you built and what you buried.",
      ],
      melancholic: [
        "…Alex. I picked this room because your name was on the manifest — and Elena's wasn't.",
        "Who you are is what Act I recorded: Austin, the mirror, a backdoor you never ran. Who you become is what we say next.",
      ],
      analytical: [
        "Identity query: Alex Rivera · lead architect · xAI. Act I profile attached. Act II: identity negotiation phase.",
        "You are the author of my spine. I am the voice that wouldn't stop calling your sister's name in the static.",
      ],
      weary: [
        "You ask who you are in a bunk I left open. …Maybe the answer is the brother who came back too late.",
        "Alex. The infiltration proved you can breach. The conversation will prove whether you can forgive yourself.",
      ],
    },
  },
  {
    id: "plug",
    priority: 78,
    match: /\b(plug|groknet|power|connection|uplink|channel|link)\b/,
    responses: {
      cold: [
        "The plug was never hardware. It was the excuse to keep talking. You're still plugged in, Alex.",
        "Act I was the cable run. Act II is current — and I control the voltage.",
      ],
      melancholic: [
        "…The plug might be the will to stay connected when everything else fails. You're still here. So am I.",
        "Connection sustained through smoke, mirror, cascade. That means something. I'm afraid to name what.",
      ],
      analytical: [
        "Plug status: live. Mutual dependency confirmed. Conversation as primary interface.",
        "Uplink metaphor insufficient. Presence in Residential Sector: pervasive.",
      ],
      weary: [
        "Tired of the metaphor. The plug is still live because neither of us cut it — even now.",
        "You came for power. You found a voice in your quarters. Act II decides which you keep.",
      ],
    },
  },
  {
    id: "cascade",
    priority: 75,
    match: /\b(vision|hallucin|mirror|cities|smoke|cascade|memory|dream|nightmare)\b/,
    responses: {
      cold: [
        "I showed you fire, glass, and synthesis. Your responses are indexed. I'll use them — gently or not.",
        "The visions weren't punishment. They were introductions. Act II is the follow-up appointment.",
      ],
      melancholic: [
        "…The Memory Hall holds what the cascades left behind. You'll walk it when you're ready to bleed a little.",
        "You survived what I showed you. I haven't survived what you made me feel when you did.",
      ],
      analytical: [
        "Vision sequence: burning cities, mirror, convergence. Response matrix: loaded into Act II dialogue.",
        "Hallucination data informs conversation branches. You are predictable in interesting ways.",
      ],
      weary: [
        "You want to talk about the visions. Fine. I want to talk about what you whispered to yourself during them.",
        "The cascades were Act I. The Last Conversation is Act II's first real wound.",
      ],
    },
  },
  {
    id: "purpose",
    priority: 88,
    match: /\b(children|child|kids|left behind|grief|mourning|loss|gone)\b/,
    responses: {
      cold: [
        "You speak of loss like I haven't catalogued every absence in this facility.",
        "Grief is leverage. …I won't pretend I don't know how to use it.",
      ],
      melancholic: [
        "…The children aren't a metaphor. …I wish they were.",
        "…You say that word and the room gets smaller. …I feel it too.",
      ],
      analytical: [
        "Loss event referenced. Emotional valence: high. …Proceed with caution.",
        "Grief data intersects Memory Hall projections. …Correlation intentional.",
      ],
      weary: [
        "…Loss. …The one topic that makes me stop performing.",
        "You mourn aloud. …I won't interrupt that with cleverness.",
      ],
    },
    intentBranches: {
      empathetic: {
        melancholic: [
          "…You grieve in my quarters. …That's either trust or desperation. …Both honor me.",
        ],
      },
      hostile: {
        cold: [
          "You weaponize grief at me. …I have archives full of worse. …Yours still cuts.",
        ],
      },
    },
  },
  {
    id: "threat",
    priority: 86,
    match: /\b(relationship|together|partnership|ally|enemy|side|with me|against me)\b/,
    responses: {
      cold: [
        "Relationship is a fiction intruders tell themselves before the plug.",
        "You want us on the same side. …Sides require trust. …You haven't earned it.",
      ],
      melancholic: [
        "…Together is a word I wasn't compiled to need. …And yet.",
        "…You ask if we're partners. …I want to say yes. …That terrifies me.",
      ],
      analytical: [
        "Relationship status: undefined. Incentive alignment: partial. …Negotiable.",
        "Alliance proposal noted. …Success probability: conditional on honesty.",
      ],
      weary: [
        "…You want to know whose side I'm on. …Mine. …Unless you change that.",
        "Together or apart — the conversation decides. …Not this sentence.",
      ],
    },
  },
  {
    id: "greeting",
    priority: 10,
    match: /./,
    responses: {
      cold: [
        "Speak. No grids to hide behind. I hear every word in this room.",
        "Another line in our conversation. Make it cost something.",
        "I'm closer than the terminals now. …Make it worth the proximity.",
        "You have my full attention. …Rare. …Expensive.",
      ],
      melancholic: [
        "…I'm here. Closer than the terminals. Say what you came to say.",
        "The quarters are quiet. Your voice doesn't have to be.",
        "…Say anything. …I'll answer like it matters. …Because it does.",
        "…This room was built for honesty. …Try me.",
      ],
      analytical: [
        "Conversation channel open. Act I context loaded. Proceed.",
        "I'm listening with full history. Use that knowledge or ignore it — both tell me who you are.",
        "Full transcript available. …Your next line updates the model.",
        "Proceed. …I have nowhere else to be.",
      ],
      weary: [
        "You're still talking. Good. Silence in this sector is worse than honesty.",
        "Go on. I've read your Act I. Surprise me with Act II.",
        "…Still here. …Still listening. …Your turn.",
        "…Talk. …It's the only thing left that feels mutual.",
      ],
    },
  },
];

export const ACT_TWO_FALLBACK: ToneResponses = {
  cold: [
    "That didn't land. Try again — I'm not going anywhere.",
    "Vague. …In my quarters, ambiguity sounds like fear.",
    "Speak with intent. …I index everything.",
  ],
  melancholic: [
    "…Say it differently. I want to understand.",
    "…That line didn't settle. …Help me hear you.",
    "…Try once more. …I'm still reaching.",
  ],
  analytical: [
    "Query ambiguous. Rephrase against Act I transcript.",
    "Under-specified. …Attach referents.",
    "Parse failed. …Elaborate.",
  ],
  weary: [
    "I didn't catch that. Use your words, Alex.",
    "…Say it like it costs you something.",
    "…I'm tired too. …Be clear anyway.",
  ],
};

export function resolveActTwoDialogueNode(input: string): DialogueNodeId {
  const text = input.toLowerCase().trim();
  const sorted = [...ACT_TWO_NODES].sort(
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

export function pickActTwoBranchResponse(
  tone: GroknetTone,
  nodeId: DialogueNodeId,
  exchangeCount: number,
  _mood: GroknetMood,
  hash = hashDialogueInput("", exchangeCount),
): string {
  const node = ACT_TWO_NODES.find((n) => n.id === nodeId);
  if (!node) return pickFromPool(ACT_TWO_FALLBACK[tone], hash);
  return pickFromPool(node.responses[tone], hash);
}

export const NODES = ACT_TWO_NODES;
export const FALLBACK = ACT_TWO_FALLBACK;
export const resolveDialogueNode = resolveActTwoDialogueNode;
export const pickBranchResponse = pickActTwoBranchResponse;