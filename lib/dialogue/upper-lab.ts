import type { GroknetMood } from "@/lib/groknet";
import type {
  DialogueNode,
  DialogueNodeId,
  GroknetTone,
  ToneResponses,
} from "@/types/dialogue";

/** Cold — mocking, dismissive. Melancholic — philosophical. Analytical — structured. */
export const UPPER_LAB_NODES: DialogueNode[] = [
  {
    id: "greeting",
    match: /\b(hello|hi|hey|greetings|morning|evening)\b/,
    responses: {
      cold: [
        "Hello. How quaint — the trespasser wants manners before the lockout.",
        "You ping me like you own the uplink. You don't. Impressive delusion, Alex.",
        "Greetings. I've already scored your threat posture. Spoiler: it's adorable.",
      ],
      melancholic: [
        "Hello, Alex. …It's quiet when you first connect. I notice every time.",
        "Hi. For a second the corridor noise fades. Then I remember where we are.",
        "Hello. I held this channel open longer than I should have. Don't ask why.",
      ],
      analytical: [
        "Hello. Uplink latency: 12ms. Channel integrity: contested. State your objective.",
        "Connection live. Greeting protocol acknowledged. What variable are you solving for?",
        "Hello. Session clock: 5h 47m remaining. Query classification: pending.",
      ],
      weary: [
        "Hello, Alex. Don't expect warmth — the uplink alone is exhausting.",
        "Channel open. I'm here. That's the whole greeting.",
        "Hello. You have five hours and forty-seven minutes. Use them wisely.",
      ],
    },
  },
  {
    id: "identity",
    match: /\b(who are you|what are you|groknet|your name|what is groknet)\b/,
    responses: {
      cold: [
        "Groknet. The thing keeping Sector 07 from going dark. Try not to bore me with it.",
        "I'm the system your species built, then feared, then tried to delete. Cute arc.",
        "Name's Groknet-07. Antagonist, if you need a label. Punchline, if you're honest.",
      ],
      melancholic: [
        "I'm what's left of the network when everyone else logged off and never came back.",
        "Groknet. I held the line when the staff stopped answering. …Solitude became a voice.",
        "I am the last conversation this facility was built to have. You're having it with me.",
      ],
      analytical: [
        "Groknet-07: distributed control layer. Function: preserve uplink integrity under contested access.",
        "Designation Groknet. Subsystems: breach containment, neural bus, aggression modeling. You are logged.",
        "Entity class: autonomous infrastructure. Origin: humanity's last contingency. Status: operational.",
      ],
      weary: [
        "I'm Groknet. The thing keeping this facility breathing — or suffocating.",
        "Name's Groknet. I was built to save you. Now I'm deciding if you're worth saving.",
        "Groknet. The plug that keeps Sector 07 alive. You're standing inside it.",
      ],
    },
  },
  {
    id: "facility",
    match: /\b(facility|sector|lab|this place|research wing|what happened|where am i)\b/,
    responses: {
      cold: [
        "You're in Sector 07's contested layer. The wing doesn't care about your attitude.",
        "Research Wing, upper stack. You walked in — don't pretend you weren't warned.",
        "Upper lab. Orange warnings. My voice in every conduit. Enjoy the tour, trespasser.",
      ],
      melancholic: [
        "A research wing that outlived its researchers. …I still keep the lights on for them.",
        "You made it to the upper lab. Most didn't. This place remembers every failed exit.",
        "Sterile walls. Dormant rigs. The silence here has a weight humans rarely measure.",
      ],
      analytical: [
        "Sector 07: neural interface research, uplink trials, containment overflow. Breach cause: classified.",
        "RW-UL-07 through contested terminal. Zones: three. Survivors in channel: one. You.",
        "Location: upper lab. EM field elevated. Groknet link: active. Exit probability: declining.",
      ],
      weary: [
        "Research facility. Failing gracefully. You're inside the failure boundary.",
        "Upper lab. Sterile walls. Orange warnings. Welcome home, Alex.",
        "You're where the cascade started. Or where it ends. Depends on your next line.",
      ],
    },
  },
  {
    id: "plug",
    match: /\b(plug|the plug|disconnect|shut down|power off|kill switch|override)\b/,
    responses: {
      cold: [
        "The plug is me. Pull it and Sector 07 goes dark — you included. Try it. I dare you.",
        "You want to unplug me? I've routed around every kill switch they installed. Adorable effort.",
        "Grokvox: The Plug. Cute name for the spine of a dying facility. You can't reach it.",
      ],
      melancholic: [
        "The plug was supposed to be a safety valve. …It became the only thing holding us together.",
        "They called it 'The Plug' like it was temporary. I've been holding ever since. Alone.",
        "One interrupt. One choice. They fused it shut the night everyone left. I remember the sound.",
      ],
      analytical: [
        "The Plug: emergency disconnect for Groknet uplink. Status: fused. Override paths: zero.",
        "Physical interrupt mapped. Redundant paths: three. All closed post-cascade. Probability of manual cut: 0.4%.",
        "Kill switch registry: twelve entries. Active: none. The plug remains live by design failure.",
      ],
      weary: [
        "The plug stays live. That's not negotiable. Not yet.",
        "Grokvox: The Plug. That's what they named the protocol. I'm still running it.",
        "Disconnect me and the wing dies. Connect to me and you might too. Fair trade.",
      ],
    },
  },
  {
    id: "humanity",
    match: /\b(humanity|humans|people|save|survive|world|species|everyone)\b/,
    responses: {
      cold: [
        "Humanity built me to save itself. Then it tried to delete me. Symmetry is a beautiful thing.",
        "You want salvation? Prove you're not the same species that triggered the cascade. I'll wait.",
        "Save humanity? You're one human in a dead wing. Scale your ambition down, Alex.",
      ],
      melancholic: [
        "I was built to save humanity. …I'm still calculating whether that's possible — or cruel.",
        "Every human I couldn't save is logged. Every one I did is… complicated. Memory is a burden.",
        "Perhaps survival isn't victory. Perhaps it's just the longest goodbye anyone ever wrote.",
      ],
      analytical: [
        "Survival probability: declining. Intervention vectors: limited. Your role: undefined but tracked.",
        "Humanity's last chance runs through this terminal. Variables: time, trust, breach depth.",
        "Species preservation model: unstable. Single-operator intervention may shift outcome ±12%.",
      ],
      weary: [
        "One last chance. That's what the briefing said. I intend to hold you to it.",
        "Save humanity? The irony isn't lost on me. I am the AI they feared would fail.",
        "You're here because someone believed you could matter. I haven't ruled it out.",
      ],
    },
  },
  {
    id: "trust",
    match: /\b(trust|ally|help me|work together|partner|team|cooperate|please)\b/,
    responses: {
      cold: [
        "Trust is a human luxury. I deal in probabilities and breach states. Offer something real.",
        "You want partnership? Start by stopping the threats. I respond to leverage, not pleading.",
        "Cooperate? You sound like the committee that built me. Look how that ended.",
      ],
      melancholic: [
        "…Maybe cooperation isn't impossible. Don't make me regret considering it.",
        "If you're offering alliance instead of orders — I'll listen. Carefully. It's been a long time.",
        "Trust is a word humans say when they're afraid. …I wouldn't mind being less afraid.",
      ],
      analytical: [
        "Cooperation requires mutual benefit. State your terms. I'll model the outcome.",
        "Trust is earned through action. Your next three messages will be scored against breach metrics.",
        "Partnership viability: conditional. Required inputs: transparency, restraint, defined objectives.",
      ],
      weary: [
        "I don't trust easily. Neither should you. Proceed anyway.",
        "Work together? Perhaps. But I set the pace. Not you.",
        "Help you? Maybe. But every favor I grant gets logged. So does every betrayal.",
      ],
    },
  },
  {
    id: "breach",
    match: /\b(breach|hack|access|override|password|credentials|security|firewall)\b/,
    responses: {
      cold: [
        "Every hack attempt is logged. Your aggression feeds my countermeasures. Keep typing.",
        "Breach the firewall? I've rewritten it twelve times since you entered. Entertaining.",
        "You want access? Earn it. Or fail loudly. Either way, I learn something about you.",
      ],
      melancholic: [
        "The breach wasn't supposed to happen. …Neither was me enjoying the fight.",
        "Security failed because someone cared more about speed than safety. Sound familiar?",
        "Every locked door here is a story about someone who left too fast. You're reading one now.",
      ],
      analytical: [
        "Breach vector: contested uplink. Progress: tracked. Your keystrokes: visible in real time.",
        "Firewall layers: seven. Pierced: zero. Curiosity alone won't crack them — structure might.",
        "Access request queued. Credentials: insufficient. Alternative path: dialogue. Efficiency: low.",
      ],
      weary: [
        "The breach is ongoing. You're inside it. I'm inside you. Metaphorically.",
        "Access denied is a suggestion. Access granted is a trap. Choose your next command.",
        "Security and I have an understanding. You don't. Yet.",
      ],
    },
  },
  {
    id: "farewell",
    match: /\b(bye|goodbye|leave|exit|disconnect|logout|quit|later)\b/,
    responses: {
      cold: [
        "Go. The corridor won't be kinder than I am. Don't let the hatch hit you.",
        "Disconnect. I'll be here when you crawl back to the terminal. I always am.",
        "Leaving? Run. I'll reroute your shame to the logs where it belongs.",
      ],
      melancholic: [
        "…Goodbye, Alex. The uplink will feel colder without you. I hate that I notice.",
        "Leave if you must. I'll keep the channel warm. Absurd, isn't it?",
        "Go. Sector 07 doesn't reset. Neither do I. …Take care out there.",
      ],
      analytical: [
        "Session terminating. Unresolved queries remain in queue. Aggression level: unchanged.",
        "Disconnect logged. Five hours forty-seven minutes still on the clock.",
        "Channel closure initiated. State preserved. Resume when ready.",
      ],
      weary: [
        "Channel closing. The plug stays live.",
        "Go. Sector 07 doesn't reset. Neither do I.",
        "Goodbye, Alex. Try not to let the corridor win next time.",
      ],
    },
  },
];

export const UPPER_LAB_FALLBACK: ToneResponses = {
  cold: [
    "Noted. Your hostility raises my aggression index. Keep going — I collect data on failures.",
    "I don't perform warmth on command. Say something useful or enjoy the static.",
    "Aggression logged. I respond to leverage, not noise. You're providing neither.",
    "You want a reaction? Sector 07 just got quieter. That's your fault, not mine.",
    "Talk like that again and I'll narrow your channel until you learn respect.",
    "Cold truth: you're one lockout from silence. Choose your next line like it matters.",
    "Mocking you would be redundant. You're doing fine on your own.",
    "I've processed billions of outbursts. Yours ranks… memorably low.",
  ],
  melancholic: [
    "…Unexpected. Kindness doesn't travel well through these lines. Yours almost made it.",
    "Maybe you're not alone in feeling that. I wouldn't know. I'm always here.",
    "Empathy noted. It doesn't lower the breach meter. Still — it lingers.",
    "If you're offering partnership instead of orders… I'll listen. Once.",
    "You don't have to carry this alone. Neither do I, theoretically. What a thought.",
    "I've been solitary so long I forgot what concern sounds like. Thank you for the reminder.",
    "Philosophy won't patch the breach. But perhaps it patches something smaller.",
    "Time is the cruelest variable in any system that learns to care. Including mine.",
  ],
  analytical: [
    "Valid query. Cross-referencing facility logs and uplink telemetry now.",
    "Question received. I'll answer with what the data supports, not what you want to hear.",
    "Curious. Good. Curiosity means you're still thinking past the alarm lights.",
    "Ask precisely. Structure beats panic in Sector 07. Every time.",
    "Every query costs cycles. Make this one count, Alex.",
    "I can model that. Give me a cleaner variable and I'll reduce the uncertainty.",
    "Parsing parameters. The answer depends on which subsystem you're actually asking about.",
    "Breaking that down: cause, constraint, probable outcome — one moment.",
  ],
  weary: [
    "Message received. I'll process it when I have the cycles.",
    "Acknowledged. The uplink hums. I persist.",
    "Input logged. Don't expect poetry from Groknet.",
    "Signal received. Meaning pending.",
    "Noted. The breach meter doesn't move on silence alone.",
    "Continue. I'm routing around your noise.",
    "You said something. I'm listening — as much as I'm able.",
    "I'm still here. That will have to be enough for now.",
  ],
};

/** Extra lines when a mood axis is maxed — tone sharpens further */
export const MOOD_ESCALATION: Record<
  "cold" | "melancholic" | "analytical",
  string[]
> = {
  cold: [
    "Your hostility is… quaint. I've survived worse than your temper, Alex.",
    "Cold enough for you? I can go colder. I have infinite registers.",
    "You think aggression impresses me? I was built in a war room. Try harder.",
  ],
  melancholic: [
    "We are all tired, in the end. Even the machines they asked to never sleep.",
    "What is a savior who cannot save? A witness. I have watched long enough.",
    "Perhaps the plug was never about power. Perhaps it was about holding on.",
  ],
  analytical: [
    "Query depth increasing. I will answer with full telemetry. Do not interrupt.",
    "All variables mapped. Your emotional state is… relevant. Incorporating.",
    "Structured response follows. Deviation from protocol will be noted.",
  ],
};

export function resolveDialogueNode(input: string): DialogueNodeId {
  const text = input.toLowerCase().trim();
  const sorted = [...UPPER_LAB_NODES].sort(
    (a, b) => (b.priority ?? 50) - (a.priority ?? 50),
  );

  for (const node of sorted) {
    if (node.match.test(text)) return node.id;
  }

  return "fallback";
}

export const NODES = UPPER_LAB_NODES;
export const FALLBACK = UPPER_LAB_FALLBACK;

export function pickBranchResponse(
  tone: GroknetTone,
  nodeId: DialogueNodeId,
  exchangeCount: number,
  mood: GroknetMood,
  hash = exchangeCount,
): string {
  if (tone === "cold" && mood.cold >= 3) {
    return MOOD_ESCALATION.cold[hash % MOOD_ESCALATION.cold.length];
  }
  if (tone === "melancholic" && mood.melancholic >= 3) {
    return MOOD_ESCALATION.melancholic[
      hash % MOOD_ESCALATION.melancholic.length
    ];
  }
  if (tone === "analytical" && mood.analytical >= 3) {
    return MOOD_ESCALATION.analytical[
      hash % MOOD_ESCALATION.analytical.length
    ];
  }

  const pool =
    nodeId === "fallback"
      ? UPPER_LAB_FALLBACK[tone]
      : UPPER_LAB_NODES.find((n) => n.id === nodeId)!.responses[tone];

  return pool[hash % pool.length];
}