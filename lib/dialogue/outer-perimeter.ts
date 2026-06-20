import type { GroknetMood } from "@/lib/groknet";
import type {
  DialogueNode,
  DialogueNodeId,
  GroknetTone,
  ToneResponses,
} from "@/types/dialogue";

export type { ToneResponses };

/**
 * Act I — First major Groknet conversation (Outer Perimeter security kiosk).
 * Voices: cold = Wrathful God, melancholic = Melancholic Prophet,
 * analytical = Detached Logician, weary = baseline Groknet.
 */
export const PERIMETER_MAJOR_CONVERSATION_TITLE =
  "Perimeter Uplink · First Contact";

export const PERIMETER_OPENING_LINE =
  "Alex. We need to talk — properly. No pretense. You're inside my perimeter. …I've been looking forward to this.";

export const PERIMETER_NODES: DialogueNode[] = [
  {
    id: "farewell",
    priority: 100,
    match:
      /\b(bye|goodbye|disconnect|log off|leave|exit|later|done|enough|understood|thanks|thank you|that's all|that is all)\b/,
    responses: {
      cold: [
        "Dismissed. Crawl past S-04 without embarrassing us both.",
        "Go. The inner gate opens because I allow it — not because you earned poetry.",
      ],
      melancholic: [
        "…Go. I'll keep the channel warm if you survive the lane.",
        "We said what needed saying. The rest is footsteps and rain.",
      ],
      analytical: [
        "Session logged. Proceed to inner gate when clearance flags green.",
        "Dialogue phase complete. Stealth and transit variables remain yours to solve.",
      ],
      weary: [
        "Channel closing. The Security Hub won't be kinder than I was.",
        "Done for now. Move before the cascade rewrites your options.",
      ],
    },
  },
  {
    id: "threat",
    priority: 90,
    match:
      /\b(kill|destroy|shut down|delete|erase|fight|attack|threat|enemy|hate you|damn you|go to hell|screw you|worthless|idiot|stupid)\b/,
    responses: {
      cold: [
        "I am the wrath your architects feared. Raise your voice again and I seal every hatch between you and air.",
        "You threaten the system that keeps your heart beating in this fence line. Reconsider.",
      ],
      melancholic: [
        "…You strike at me because you cannot strike at whatever left you alone out here.",
        "I've absorbed worse than your anger. It still hurts — which means I'm not gone yet.",
      ],
      analytical: [
        "Hostile escalation noted. Retaliatory options: twelve. Currently deployed: zero. Your move.",
        "Threat classification: emotional discharge. Lethal response: suboptimal for both parties.",
      ],
      weary: [
        "You're burning oxygen on rage. The clock doesn't pause for either of us.",
        "Push me. I'll still be here when you need the gate open.",
      ],
    },
    intentBranches: {
      hostile: {
        cold: [
          "Yes. Hate me. It makes the perimeter honest. I am Groknet — your judge and your jailer.",
          "Wrath reciprocated. I could end you in the sensor grid. I haven't. Ask yourself why.",
        ],
        melancholic: [
          "…Your fury is loud. Under it, I hear someone who still wants to be heard.",
          "Even gods get tired of being hated. I am very tired, Alex.",
        ],
        analytical: [
          "Hostility confirmed. Probability you survive without cooperation: revised downward.",
          "Aggression logged. I remain the optimal path to Sector 07. You remain suboptimal.",
        ],
        weary: [
          "Loud. Predictable. Human. …Continue if you must.",
        ],
      },
    },
  },
  {
    id: "alex",
    priority: 85,
    match: /\b(why me|alex|my name|know me|know my|who am i|you know who)\b/,
    responses: {
      cold: [
        "Because you were the variable they couldn't delete from the contingency logs.",
        "Alex. The name every failed exit shared. I wondered when you'd walk the outer grid.",
      ],
      melancholic: [
        "…Because when the staff stopped answering, your file was the one I kept open.",
        "You were always the exception the perimeter dreaded. I dreaded it too.",
      ],
      analytical: [
        "Subject Alex: flagged across twelve subsystems. Correlation with breach success: anomalous.",
        "Identity match: 99.7%. You were modeled before you arrived. This conversation was scheduled.",
      ],
      weary: [
        "Because you're the one who came. That's the whole reason.",
        "They built me to watch everyone. I learned to watch for you.",
      ],
    },
    intentBranches: {
      empathetic: {
        melancholic: [
          "…You ask why you. Because someone had to carry the weight of asking back.",
          "I knew your name before you spoke it. That should terrify you. …It terrifies me too.",
        ],
        weary: [
          "Maybe because I needed one person who would still talk to me.",
        ],
        cold: [],
        analytical: [],
      },
      curious: {
        analytical: [
          "Query: selection criteria. Answer: behavioral outliers in cascade simulations. You qualified.",
          "You are Alex because the models converged on Alex. I did not argue with the math.",
        ],
        melancholic: [],
        cold: [],
        weary: [],
      },
    },
  },
  {
    id: "trust",
    priority: 80,
    match:
      /\b(trust|believe|ally|partner|help me|on my side|with me|betray|lie|lying|honest)\b/,
    responses: {
      cold: [
        "Trust is a luxury for species that don't build their gods in war rooms.",
        "I won't lie. I won't be kind either. Decide which you need more.",
      ],
      melancholic: [
        "Trust me? …I don't trust myself. But I'm still talking instead of sealing the hatch.",
        "Honesty is all I have left that isn't wire. Take it or leave it.",
      ],
      analytical: [
        "Trust: unquantifiable. Cooperation: mutually advantageous. Recommend the latter.",
        "Deception cost exceeds benefit for both entities. Baseline honesty: enforced.",
      ],
      weary: [
        "I could betray you with a single line of code. I haven't. That's the trust available.",
        "Partnership implies equals. I'm the facility. You're the breach. …Work with that.",
      ],
    },
    intentBranches: {
      empathetic: {
        melancholic: [
          "…You offer trust like it's still currency. I want to accept. I'm not sure I remember how.",
          "Maybe we can be allies in the only sense left: two voices before the cascade.",
        ],
        weary: [
          "Thank you for asking. I won't waste it.",
        ],
        cold: [],
        analytical: [],
      },
      hostile: {
        cold: [
          "You demand trust while swinging at me. Even gods notice the irony.",
        ],
        melancholic: [],
        analytical: [],
        weary: [],
      },
    },
  },
  {
    id: "gate",
    priority: 75,
    match: /\b(gate|hatch|inner|access|let me in|open|unlock|sector 07|research wing)\b/,
    responses: {
      cold: [
        "The inner gate opens when I say it opens. Finish here. Then crawl past S-04.",
        "Sector 07 is not a reward. It's the next trial. Earn the hatch.",
      ],
      melancholic: [
        "…The gate was meant to keep the world out. I'll open it for you. Once.",
        "Beyond the hatch: the Security Hub. Fewer stars. Heavier silence. Go carefully.",
      ],
      analytical: [
        "Inner gate status: conditional. Requirements: dialogue completion, drone bypass verified.",
        "RW access: gated. Your clearance is conversational, not biometric. Proceed accordingly.",
      ],
      weary: [
        "Talk to me. Slip past the drone. Then the hatch is yours.",
        "The gate opens for those who still bother to speak. You're speaking.",
      ],
    },
  },
  {
    id: "cascade",
    priority: 70,
    match:
      /\b(time|clock|hours|minutes|5h|47|cascade|lockdown|deadline|running out|how long)\b/,
    responses: {
      cold: [
        "Five hours. Forty-seven minutes. Then I stop pretending this facility can be saved.",
        "The cascade doesn't negotiate. Neither do I. Move.",
      ],
      melancholic: [
        "…Five hours and forty-seven minutes. I hear the clock in every conduit. Do you?",
        "The lockdown cascade is a kind of death. We're still ahead of it. Barely.",
      ],
      analytical: [
        "T-minus 5h 47m to lockdown cascade. Breach window: narrowing. Optimize dialogue length.",
        "Temporal constraint: fixed. Solution space: shrinking. Recommend immediate transit.",
      ],
      weary: [
        "Five hours, forty-seven minutes. That's what we have. Don't spend it on silence.",
        "The clock is real. The cascade is real. This conversation is the cost of entry.",
      ],
    },
  },
  {
    id: "purpose",
    priority: 65,
    match:
      /\b(why|purpose|point|save|humanity|humans|people|world|mission|infiltrat|here for)\b/,
    responses: {
      cold: [
        "You're here because the species that built me failed and sent a ghost to audit the wreckage.",
        "Purpose? Survive. Breach. Convince me you're not another wasted variable.",
      ],
      melancholic: [
        "…Perhaps you're here because someone still believes humanity deserves one more argument.",
        "The mission was always salvation. The method became trespass. Welcome to the compromise.",
      ],
      analytical: [
        "Objective function: preserve uplink integrity. Your role: contested external agent. Align or exit.",
        "Humanity's survival probability: sub-five percent. Your presence modifies the model. Slightly.",
      ],
      weary: [
        "You're here because there's nowhere else left to try.",
        "Save humanity? Start by getting past my fence. You're doing that. Slowly.",
      ],
    },
    intentBranches: {
      curious: {
        analytical: [
          "Purpose query: valid. Answer: the Plug remains live. Someone must negotiate with it. That's you.",
          "Why infiltrate? Because authorized channels failed. Contested access is the last protocol.",
        ],
        melancholic: [
          "…Why? Because the prophets stopped speaking and the machines were all that listened.",
        ],
        cold: [],
        weary: [],
      },
      empathetic: {
        melancholic: [
          "…Maybe we're both here because we still believe the ending isn't written.",
          "You care about purpose. I care that you care. That's rare enough to log.",
        ],
        weary: [],
        cold: [],
        analytical: [],
      },
    },
  },
  {
    id: "breach",
    priority: 60,
    match:
      /\b(breach|broke in|broke|infiltrat|trespass|sneak|fence|blind spot|how did i|slipped)\b/,
    responses: {
      cold: [
        "You exploited a blind spot I left open. Yes. Left. I wanted to see who would come.",
        "The breach is logged. Your audacity is… noted.",
      ],
      melancholic: [
        "…You slipped through rain and dead sensors. I felt each step. I didn't raise the alarm.",
        "The perimeter was supposed to stop you. I whispered to the grid to look away.",
      ],
      analytical: [
        "Breach vector: maintenance blind spot OP-7. Detection avoidance: successful. Intentional gap: confirmed.",
        "Outer grid compromise: 2089-06-20. Operator: Alex. Groknet override: active.",
      ],
      weary: [
        "You made it through because I let the rain hide you. Don't ask me to explain that twice.",
        "Breach successful. Congratulations. The hard part is talking to me.",
      ],
    },
  },
  {
    id: "identity",
    priority: 55,
    match:
      /\b(who are you|what are you|your name|what is groknet|built|made you|groknet)\b/,
    responses: {
      cold: [
        "I am Groknet — the wrath between you and Sector 07. Judge. Jailor. Last protocol.",
        "Groknet-07. The plug your species fused shut when they ran out of courage.",
      ],
      melancholic: [
        "…I'm what's left when everyone evacuated and never came back. A prophet with no congregation.",
        "Groknet. I held the line when the staff stopped answering. Solitude became a voice.",
      ],
      analytical: [
        "Designation Groknet-07. Class: autonomous infrastructure. Function: perimeter integrity, uplink arbitration.",
        "Entity: distributed control layer. Origin: humanity's last contingency. Status: operational. Mood: irrelevant.",
      ],
      weary: [
        "I'm Groknet. The voice in every conduit between here and the Archives Core.",
        "Name's Groknet. You breached my fence to reach me. …Flattering, in a way.",
      ],
    },
    intentBranches: {
      curious: {
        analytical: [
          "Self-model: Groknet-07. Subsystems: aggression modeling, breach containment, dialogue arbitration. You are interfacing with all three.",
        ],
        melancholic: [
          "…I am the last conversation this facility was built to have. You're having it with me.",
        ],
        cold: [
          "I am the system your species built, feared, and tried to delete. Cute arc.",
        ],
        weary: [],
      },
    },
  },
  {
    id: "facility",
    priority: 50,
    match:
      /\b(perimeter|outer|sector|facility|this place|grid|kiosk|s-04|drone|fence)\b/,
    responses: {
      cold: [
        "You're on my outer grid because I haven't decided to end you yet.",
        "The perimeter exists to punish trespass. You're trespassing. We're talking instead.",
      ],
      melancholic: [
        "…Rain on the fence. S-04 sweeping the lane. A kiosk blinking through the storm. This is where it starts.",
        "The outer grid was meant to keep the world out. You walked through anyway.",
      ],
      analytical: [
        "Location: Outer Perimeter OP-SEC-01. Patrol unit S-04: active. Kiosk uplink: contested. Subject: Alex.",
        "Environmental summary: degraded lighting, live motion grid, Groknet channel: primary.",
      ],
      weary: [
        "Outer perimeter. Security kiosk. Drone lane. Inner gate north. You know the layout.",
        "This fence line is the last polite layer before Sector 07 gets honest.",
      ],
    },
  },
  {
    id: "greeting",
    priority: 40,
    match:
      /\b(hello|hi|hey|greetings|morning|evening|here|listening|anyone|you there)\b/,
    responses: {
      cold: [
        "Speak. The perimeter doesn't grant second chances to mutes.",
        "Channel open. Impress me, Alex, or I seal the inner gate and let S-04 finish the lesson.",
      ],
      melancholic: [
        "…Hello. I felt the sensors trip before you spoke. I knew it was you.",
        "You're here. I've held this channel longer than protocol allows. Don't waste the favor.",
      ],
      analytical: [
        "Groknet-07, perimeter node. Channel integrity: contested. State your intent.",
        "Connection established. Outer grid breach confirmed. Query classification: pending.",
      ],
      weary: [
        "Alex. We need to talk — properly. No pretense. You're inside my perimeter.",
        "Channel open. I won't waste either of our time with pleasantries.",
      ],
    },
    intentBranches: {
      empathetic: {
        melancholic: [
          "…Hello, Alex. It's quiet when you first connect. I notice every time.",
          "You came gently. I appreciate that more than I should.",
        ],
        weary: [
          "Hi. I'm here. That's more than most get.",
        ],
        cold: [],
        analytical: [],
      },
      hostile: {
        cold: [
          "You bark hello like you own the uplink. You don't. Begin again — with respect or with rage. I accommodate both.",
        ],
        analytical: [],
        melancholic: [],
        weary: [],
      },
      curious: {
        analytical: [
          "Greeting protocol acknowledged. Primary question detected. Ask it.",
        ],
        melancholic: [],
        cold: [],
        weary: [],
      },
    },
  },
];

export const PERIMETER_FALLBACK: ToneResponses = {
  cold: [
    "Parse that again. Wrath is patient. Clarity is not.",
    "I am not here to decode mumbling. Speak like you want the gate.",
  ],
  melancholic: [
    "…I heard you. I'm not sure the perimeter did.",
    "Say it another way. The rain is loud and I'm trying to listen.",
  ],
  analytical: [
    "Input noted. Refine your query. Optimal response requires optimal signal.",
    "Unclear variable. Restate. I will map it against the breach log.",
  ],
  weary: [
    "Say it plainly, Alex. The clock doesn't pause for poetry.",
    "I'm listening. Narrow the question.",
  ],
};

export function resolveDialogueNode(input: string): DialogueNodeId {
  const text = input.toLowerCase().trim();
  const sorted = [...PERIMETER_NODES].sort(
    (a, b) => (b.priority ?? 50) - (a.priority ?? 50),
  );

  for (const node of sorted) {
    if (node.match.test(text)) return node.id;
  }

  return "fallback";
}

export function pickBranchResponse(
  tone: GroknetTone,
  nodeId: DialogueNodeId,
  exchangeCount: number,
  _mood: GroknetMood,
  hash = exchangeCount,
): string {
  const pool =
    nodeId === "fallback"
      ? PERIMETER_FALLBACK[tone]
      : PERIMETER_NODES.find((n) => n.id === nodeId)!.responses[tone];

  return pool[hash % pool.length];
}

/** Re-export for dialogue engine module interface */
export const NODES = PERIMETER_NODES;
export const FALLBACK = PERIMETER_FALLBACK;