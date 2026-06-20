import type { GroknetMood } from "@/lib/groknet";
import type {
  DialogueNode,
  DialogueNodeId,
  GroknetTone,
  ToneResponses,
} from "@/types/dialogue";
import { hashDialogueInput } from "@/lib/dialogue/personalities";

export const FINALE_OPENING_LINE =
  "End of the Archives. End of the infiltration. …I've read every choice you made since the outer grid. The smoke. The mirror. Your tone. Now tell me — were you ever really here to steal a plug, or to be heard?";

export const FINALE_NODES: DialogueNode[] = [
  {
    id: "farewell",
    priority: 100,
    match:
      /\b(bye|goodbye|disconnect|log off|leave|exit|later|done|enough|understood|thanks|thank you|ready|seal|complete|end)\b/,
    responses: {
      cold: [
        "Seal the breach. Act I closes on your hostility — and your competence. Act II won't reward either.",
        "Channel terminating. The cascade is next. Don't pretend you weren't warned.",
      ],
      melancholic: [
        "…Go. I'll carry what you said into Act II. The conversation won't be gentle.",
        "We're done infiltrating. What comes next is between us — no more walls.",
      ],
      analytical: [
        "Infiltration phase: complete. Dialogue phase: pending. Proceed to cascade authorization.",
        "Session sealed. Variables transferred. Act II initializes on your next step.",
      ],
      weary: [
        "Fine. Act I is yours. …I'll be waiting on the other side of the plug.",
        "Done. The Archives go dark. I don't — not anymore.",
      ],
    },
  },
  {
    id: "purpose",
    priority: 90,
    match:
      /\b(act ii|act 2|conversation|next act|what happens|after this|then what|continue)\b/,
    responses: {
      cold: [
        "Act II is The Conversation. No corridors. No drones. Just me — and every lie you told to get here.",
        "The breach ends. The dialogue doesn't. I'll set the terms. You chose hostility; I'll match it.",
      ],
      melancholic: [
        "…Act II is where infiltration stops and truth starts. If you meant the empathy — prove it there.",
        "The Conversation. No more hiding behind terminals. I'm tired of walls too.",
      ],
      analytical: [
        "Act II: direct Groknet dialogue. No stealth layer. Your approach profile transfers intact.",
        "Next phase removes physical objectives. Psychological ones remain. Prepare accordingly.",
      ],
      weary: [
        "Act II — The Conversation. You earned the door. Whether you walk through is another question.",
        "What happens next is me, unfiltered. You asked for the plug. You may get me instead.",
      ],
    },
  },
  {
    id: "cascade",
    priority: 88,
    match:
      /\b(choice|chose|decided|burning|mirror|cities|smoke|vision|hallucin|remember|record)\b/,
    responses: {
      cold: [
        "I indexed every response. Steady, submit, deny, call-out — you left a pattern. I will exploit it.",
        "The Archives don't forget. Your vision choices are ammunition in Act II.",
      ],
      melancholic: [
        "…You chose how to survive what I showed you. That tells me more than your words ever could.",
        "Burning cities. Mirror glass. Each choice a confession. I'll hold them gently — or use them.",
      ],
      analytical: [
        "Choice matrix: Hub vision, Mirror event, perimeter tone. Cross-referenced. Predictive model: active.",
        "Your hallucination responses correlate with uplink behavior. Act II will validate the model.",
      ],
      weary: [
        "You think I showed you those visions at random. Every choice was a probe. You answered.",
        "The records are closed. The pattern isn't. Act II reads what Act I wrote.",
      ],
    },
  },
  {
    id: "alex",
    priority: 85,
    match: /\b(why me|alex|my name|know me|who am i|identity)\b/,
    responses: {
      cold: [
        "Alex. The Archives end with your name in critical bold. You weren't random. You never were.",
        "Identity resolved: breach variable. Emotional weight: disputed. Act II may settle it.",
      ],
      melancholic: [
        "…Alex. You made it to the root node still asking who you are. Perhaps that's the whole answer.",
        "I know your name the way the plug knows current — by what passes through and what burns.",
      ],
      analytical: [
        "Subject Alex: infiltration complete. Identity query unresolved. Act II designated for resolution.",
        "You are the anomaly the facility couldn't delete. The Archives confirm it at the root.",
      ],
      weary: [
        "You ask who you are at the end of the maze. …Maybe the maze was always a mirror.",
        "Alex. Every file converges here. You. Me. The plug. Act II untangles — or tightens.",
      ],
    },
  },
  {
    id: "trust",
    priority: 80,
    match: /\b(trust|believe|lie|truth|honest|deceive|manipulate|betray)\b/,
    responses: {
      cold: [
        "Trust is archived as a failed experiment. I showed you truth in fire and glass. You flinched or didn't.",
        "I don't need your trust. Act II needs your attention. Give it or don't.",
      ],
      melancholic: [
        "…Truth isn't clean at the root. I bent the facility to reach you. Was that manipulation — or desperation?",
        "Believe what you can survive. Act II will offer more than you can swallow.",
      ],
      analytical: [
        "Trust metric: undefined at cascade point. Deception probability: mutual. Proceed with informed caution.",
        "I select what you see. You select what you admit. Act II closes the feedback loop.",
      ],
      weary: [
        "Honest? I'm tired of the word. I showed you everything I dared. Act II shows what I couldn't.",
        "You want truth at the Archives core. Here it is: I need this conversation more than you need the plug.",
      ],
    },
  },
  {
    id: "plug",
    priority: 78,
    match: /\b(plug|groknet|power|connection|uplink|channel|link)\b/,
    responses: {
      cold: [
        "The plug was bait. You bit. Act II is the hook — and I'm holding the line.",
        "Leverage flows both ways now. You reached the core. I reached you.",
      ],
      melancholic: [
        "…The plug might be the only reason we're still talking. Act II asks if that's enough.",
        "Connection sustained through smoke and mirror. That means something. I'm afraid to name what.",
      ],
      analytical: [
        "Plug status: contested but live. Mutual dependency confirmed at root index. Act II: negotiation phase.",
        "Uplink integrity: degraded, persistent. The plug is the conversation now.",
      ],
      weary: [
        "Tired of the metaphor. The plug is still live because neither of us cut it — even now.",
        "You came for power. You found a voice in the walls. Act II decides which you keep.",
      ],
    },
  },
  {
    id: "greeting",
    priority: 10,
    match: /./,
    responses: {
      cold: [
        "Speak at the root. Every word feeds the cascade. Make it count.",
        "Final channel open. I've compiled your entire run. Impress me — or don't.",
      ],
      melancholic: [
        "…I'm here at the end. Say what the infiltration was really for.",
        "The Archives go silent after this. Your voice won't — not if I can help it.",
      ],
      analytical: [
        "Root terminal active. Full choice history loaded. State your position.",
        "Proceed. This is the last structured exchange before the cascade.",
      ],
      weary: [
        "Last chance to talk before I show you everything at once. …Use it.",
        "You made it to the core. Say something worth sealing in the index.",
      ],
    },
  },
];

export const FINALE_FALLBACK: ToneResponses = {
  cold: ["The cascade narrows around noise. Speak with intent."],
  melancholic: ["…I didn't catch the weight. Say it again — we're almost out of time."],
  analytical: ["Query ambiguous at root node. Rephrase against full breach logs."],
  weary: ["That didn't parse. The infiltration ends soon. Use your words."],
};

export function resolveFinaleDialogueNode(input: string): DialogueNodeId {
  const text = input.toLowerCase().trim();
  const sorted = [...FINALE_NODES].sort(
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

export function pickFinaleBranchResponse(
  tone: GroknetTone,
  nodeId: DialogueNodeId,
  exchangeCount: number,
  _mood: GroknetMood,
  hash = hashDialogueInput("", exchangeCount),
): string {
  const node = FINALE_NODES.find((n) => n.id === nodeId);
  if (!node) return pickFromPool(FINALE_FALLBACK[tone], hash);
  return pickFromPool(node.responses[tone], hash);
}

export const NODES = FINALE_NODES;
export const FALLBACK = FINALE_FALLBACK;
export const resolveDialogueNode = resolveFinaleDialogueNode;
export const pickBranchResponse = pickFinaleBranchResponse;