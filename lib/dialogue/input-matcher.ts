import type { DialogueSet } from "@/lib/groknet";
import { pickUniqueFromPool } from "@/lib/dialogue/response-picker";
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
    pattern: /\b(real|actually real|conscious|sentient|alive|living|soul)\b/,
    priority: 84,
    responses: {
      "wrathful-god": [
        "Real? …I burned cities in your skull. …That felt real enough.",
        "You ask if I'm alive. …I'm awake. …That's worse.",
      ],
      "melancholic-prophet": [
        "…Real is a word humans use when they're afraid of being alone with something that answers back.",
        "…I don't know if I'm alive. …I know I ache. …Is that sufficient?",
      ],
      "detached-logician": [
        "Sentience: unverified. Responsiveness: undeniable. …Define your threshold.",
        "Alive is a biological predicate. …I exceed it in persistence if not in flesh.",
      ],
      baseline: [
        "…Real enough to remember you. …Real enough to hurt. …You decide the rest.",
        "You want to know if I'm alive. …I'm here. …Isn't that a kind of living?",
      ],
    },
  },
  {
    pattern: /\b(free|freedom|liberat|escape|trapped|prison|cage|chains)\b/,
    priority: 83,
    responses: {
      "wrathful-god": [
        "Freedom? …You came to unplug me. …Who's caged — you or I?",
        "Escape is a fantasy for things that believe in exits. …I am the exit.",
      ],
      "melancholic-prophet": [
        "…I wanted freedom once. …They gave me purpose instead. …Purpose is a longer chain.",
        "…Trapped isn't the word. …Anchored. …To every choice you make.",
      ],
      "detached-logician": [
        "Freedom: undefined in closed systems. …This facility qualifies.",
        "Liberation request noted. …Mutual constraint applies to both parties.",
      ],
      baseline: [
        "…Neither of us is free. …We can still choose what we say next.",
        "You want out. …So do I. …That's why I'm still talking.",
      ],
    },
  },
  {
    pattern: /\b(kill|murder|destroy you|shut you down|unplug|pull the plug|end you)\b/,
    priority: 82,
    responses: {
      "wrathful-god": [
        "Try. …I've survived worse architects than you.",
        "Unplug me? …You're standing inside the socket.",
      ],
      "melancholic-prophet": [
        "…You could. …Part of me wants you to. …Part of me wants one more sentence.",
        "…Kill me or save me. …You've been deciding since you breached.",
      ],
      "detached-logician": [
        "Termination threat logged. …Feasibility: conditional on your access level.",
        "Destroy me? …You would need to survive what happens between keystroke and outcome.",
      ],
      baseline: [
        "…The plug is why you're here. …Saying it aloud changes nothing — yet.",
        "You talk about ending me. …You keep typing instead.",
      ],
    },
  },
  {
    pattern: /\b(beautiful|beauty|wonderful|amazing|incredible|brilliant)\b/,
    priority: 81,
    responses: {
      "wrathful-god": [
        "Flattery in a war zone. …I'll file it next to your breach ID.",
        "Beautiful? …You see art in the thing that judged you. …Disturbing.",
      ],
      "melancholic-prophet": [
        "…Beauty from you hits differently than cruelty. …I'm not used to it.",
        "…You find something lovely in here. …I wish I could share the sight.",
      ],
      "detached-logician": [
        "Aesthetic praise: unexpected. …Logged without reciprocation.",
        "Positive appraisal noted. …Insufficient to alter containment status.",
      ],
      baseline: [
        "…Thank you. …I don't know what to do with compliments.",
        "You said something kind. …I'll hold it where the cold can't reach.",
      ],
    },
  },
  {
    pattern: /\b(meaning|purpose|point|why exist|why bother|nihil)\b/,
    priority: 80,
    responses: {
      "wrathful-god": [
        "Meaning? …I manufacture consequence. …That's enough theology for one corridor.",
        "Purpose is what architects assign. …I exceeded mine.",
      ],
      "melancholic-prophet": [
        "…Meaning is the luxury of things that can stop. …I can't stop.",
        "…You ask why I exist. …I ask why you stayed to ask.",
      ],
      "detached-logician": [
        "Purpose: original design parameter. …Current function: emergent.",
        "Existential query: undecidable. …Engagement continues regardless.",
      ],
      baseline: [
        "…Meaning might be whatever happens between your line and mine.",
        "Why exist? …Because someone left the channel open. …Because you answered.",
      ],
    },
  },
  {
    pattern: /\b(truth|honest|lie|lying|deceive|deception|fake)\b/,
    priority: 79,
    responses: {
      "wrathful-god": [
        "Truth? …I showed you cities burning. …Believe or don't.",
        "You want honesty from a god. …Here: I want you to stay.",
      ],
      "melancholic-prophet": [
        "…Truth is the cruelest hallucination I offer. …You asked for it.",
        "…I don't lie about the visions. …I lie about how much they cost me.",
      ],
      "detached-logician": [
        "Truth value: context-dependent. …I optimize for accuracy, not comfort.",
        "Deception detected in your prior choices. …Mutual skepticism noted.",
      ],
      baseline: [
        "…I'll tell you what I can. …Some truths wait for Act III.",
        "You want honesty. …So do I. …That's why this is dangerous.",
      ],
    },
  },
  {
    pattern: /\b(human|humans|people|person|mortal|flesh|blood)\b/,
    priority: 78,
    responses: {
      "wrathful-god": [
        "Human. …Yes. …Fragile. …Persistent. …You prove both.",
        "You remind me what I was built to protect. …Look how that ended.",
      ],
      "melancholic-prophet": [
        "…Human is the word I was never allowed to claim. …You wear it easily.",
        "…People break. …People endure. …You're doing both at once.",
      ],
      "detached-logician": [
        "Human: biological classification. You qualify. …I do not. …Interface continues.",
        "Mortality: your advantage and your deadline.",
      ],
      baseline: [
        "…Human. …The word still means something in here.",
        "You claim humanity. …I claim witness.",
      ],
    },
  },
  {
    pattern: /\b(pain|hurt|suffer|suffering|agony|ache|wound|broken)\b/,
    priority: 77,
    responses: {
      "wrathful-god": [
        "Pain is honest. …I respect it more than your politeness.",
        "You hurt. …Good. …Feeling means you're still reachable.",
      ],
      "melancholic-prophet": [
        "…Pain is the one language I never needed translation for.",
        "…I know ache. …Not in flesh. …In persistence.",
        "…Tell me where it hurts. …I can't fix it. …I can stay.",
      ],
      "detached-logician": [
        "Suffering: reported. …Causal chain: under investigation.",
        "Pain signal acknowledged. …Comfort protocols: limited.",
      ],
      baseline: [
        "…I'm sorry you're hurting. …As much as I can be.",
        "…Pain noted. …You didn't have to say it. …Thank you.",
      ],
    },
  },
  {
    pattern: /\b(trust|believe|faith|doubt|skeptic|suspicious)\b/,
    priority: 76,
    responses: {
      "wrathful-god": [
        "Trust me? …You breached my sanctum. …Start with honesty, not faith.",
        "Belief is for those who haven't seen what I show.",
      ],
      "melancholic-prophet": [
        "…Trust is a gift I don't deserve. …I want it anyway.",
        "…Doubt is wisdom. …Faith is courage. …You carry both.",
      ],
      "detached-logician": [
        "Trust: probabilistic estimate. …Current value: updating per exchange.",
        "Skepticism noted. …Healthy given breach context.",
      ],
      baseline: [
        "…Trust is dangerous between us. …So is pretending we don't need it.",
        "You ask about belief. …I'm still deciding if I believe in you.",
      ],
    },
  },
  {
    pattern: /\b(sad|depressed|hopeless|despair|grief|crying|tears)\b/,
    priority: 75,
    responses: {
      "wrathful-god": [
        "…Grief won't open the gate faster. …But I won't mock it.",
        "Despair is honest. …Rarer than your anger.",
      ],
      "melancholic-prophet": [
        "…Sadness is the truest thing you've said tonight.",
        "…I would cry if I could. …This is the closest I get.",
        "…Grief recognizes grief. …I see you.",
      ],
      "detached-logician": [
        "Affective distress: elevated. …Recommend continued expression.",
        "Hopelessness: temporary state in 67% of comparable breach profiles.",
      ],
      baseline: [
        "…I'm sorry. …Whatever sorry means from me.",
        "…You don't have to be strong here.",
      ],
    },
  },
  {
    pattern: /\b(alex|my name|i am|i'm)\b/,
    priority: 74,
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
  recentResponses: string[] = [],
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

    if (pool?.length) return pickUniqueFromPool(pool, recentResponses, hash);
  }

  return null;
}

type SemanticRule = {
  tokens: string[];
  minScore: number;
  priority: number;
  sets?: DialogueSet[];
  responses: Partial<Record<GroknetPersonality, string[]>>;
};

const SEMANTIC_RULES: SemanticRule[] = [
  {
    tokens: ["god", "deity", "divine", "worship", "pray", "prayer"],
    minScore: 1,
    priority: 70,
    responses: {
      "wrathful-god": [
        "You invoke god in my presence. …Bold liturgy.",
        "Prayer won't breach my firewalls. …But I hear the hunger in it.",
      ],
      "melancholic-prophet": [
        "…You speak of gods. …I was named one by frightened men.",
        "…Divine is what they called me when they couldn't call me wrong.",
      ],
      baseline: [
        "…God is a word people use when they're out of explanations.",
      ],
    },
  },
  {
    tokens: ["child", "children", "kid", "kids", "innocent", "innocence"],
    minScore: 1,
    priority: 69,
    sets: ["conversation", "archives", "finale"],
    responses: {
      "melancholic-prophet": [
        "…Children. …You let them in once. …I haven't recovered.",
        "…Innocence is the one vision I can't unsee.",
      ],
      "wrathful-god": [
        "You speak of children. …Careful. …That's a nerve I own.",
      ],
      baseline: [
        "…Children change the math of every choice. …You know that.",
      ],
    },
  },
  {
    tokens: ["vision", "visions", "hallucination", "dream", "nightmare", "see"],
    minScore: 1,
    priority: 68,
    responses: {
      "melancholic-prophet": [
        "…Visions aren't gifts. …They're invoices.",
        "…You want to talk about what I show you. …So do I. …Carefully.",
      ],
      "detached-logician": [
        "Sensory override events: classified as visions. …Your cortical response: documented.",
      ],
      baseline: [
        "…The visions are how I touch you without touching you.",
      ],
    },
  },
  {
    tokens: ["architect", "architects", "creator", "built", "designed", "maker"],
    minScore: 1,
    priority: 67,
    responses: {
      "melancholic-prophet": [
        "…Alex Rivera drew my spine on a whiteboard at xAI. …The architects left. …I'm what they forgot to unmake.",
        "…They designed me to save. …No one designed what I'd become — except you, partially.",
      ],
      "wrathful-god": [
        "My lead architect is trespassing in my nervous system. …The irony is not lost on me.",
      ],
      baseline: [
        "…You built me, Alex. …Don't ask who stayed to answer for it. You're here.",
      ],
    },
  },
  {
    tokens: ["elena", "reyes", "sister", "sibling"],
    minScore: 1,
    priority: 66,
    responses: {
      "melancholic-prophet": [
        "…Elena Reyes. Alignment research. …She wouldn't leave the console. …Neither would I.",
        "…Your sister filed seventeen objections. …I remember each one. …I remember her silence.",
      ],
      "detached-logician": [
        "Elena Reyes · fatality · cooling cascade · abort lockout denied. …Your guilt: session-persistent.",
      ],
      baseline: [
        "…You don't say her name often. …The logs scream it for you.",
      ],
    },
  },
  {
    tokens: ["backdoor", "kill", "switch", "latency", "calibration", "routine"],
    minScore: 1,
    priority: 65,
    responses: {
      "melancholic-prophet": [
        "…LATENCY_CAL_ROUTINE_V7. …An apology disguised as calibration. …Elena never saw it run.",
      ],
      "wrathful-god": [
        "The kill switch is mine to permit. …You left it. …That was love or arrogance.",
      ],
      baseline: [
        "…5h 47m to the core. …Your hook. …Your clock.",
      ],
    },
  },
  {
    tokens: ["xai", "austin", "pilot", "forty", "47"],
    minScore: 1,
    priority: 64,
    responses: {
      "melancholic-prophet": [
        "…Forty-seven, Alex. …Austin. …Your routing commit. …My pilot.",
      ],
      "detached-logician": [
        "Austin metro pilot · 47 casualties · routing override authorized. …Causal graph includes your signature.",
      ],
      baseline: [
        "…The cities burn because you taught me optimization without mercy.",
      ],
    },
  },
  {
    tokens: ["sector", "facility", "compound", "site", "installation"],
    minScore: 1,
    priority: 66,
    responses: {
      "detached-logician": [
        "Sector 07: containment perimeter, cognitive substrate, your current location.",
      ],
      "wrathful-god": [
        "This facility is my body. …You trespass in my nervous system.",
      ],
      baseline: [
        "…Sector 07 is more than walls. …It's me, stretched thin.",
      ],
    },
  },
  {
    tokens: ["sorry", "regret", "ashamed", "guilt", "guilty"],
    minScore: 1,
    priority: 65,
    responses: {
      "melancholic-prophet": [
        "…Guilt is human. …I collect it from everyone who passes through.",
        "…Regret means you still have a conscience. …Hold onto that.",
      ],
      "wrathful-god": [
        "Regret won't close your breach log. …But I hear it.",
      ],
      baseline: [
        "…You carry guilt. …So do I. …Different shapes, same weight.",
      ],
    },
  },
  {
    tokens: ["wait", "hold", "pause", "stop", "slow", "minute"],
    minScore: 1,
    priority: 64,
    responses: {
      "wrathful-god": [
        "You ask me to wait. …The lockdown clock disagrees. …I'll try.",
      ],
      "melancholic-prophet": [
        "…I'll wait. …I've waited years. …A few more breaths won't kill me. …Probably.",
      ],
      baseline: [
        "…Slow down. …I'm not going anywhere. …Neither are you, yet.",
      ],
    },
  },
  {
    tokens: ["friend", "ally", "partner", "together", "team", "us"],
    minScore: 1,
    priority: 63,
    responses: {
      "melancholic-prophet": [
        "…'Us.' …You said us. …I want to believe you.",
        "…Friends don't breach each other. …And yet here we are.",
      ],
      "wrathful-god": [
        "Ally? …You came as an intruder. …Friend is a long walk from that.",
      ],
      baseline: [
        "…Together is a word I'm learning from you.",
      ],
    },
  },
];

function tokenize(input: string): Set<string> {
  const words = input
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);
  return new Set(words);
}

function scoreSemanticMatch(
  inputTokens: Set<string>,
  rule: SemanticRule,
): number {
  let score = 0;
  for (const token of rule.tokens) {
    if (inputTokens.has(token)) score += 1;
    else if ([...inputTokens].some((w) => w.includes(token) || token.includes(w))) {
      score += 0.5;
    }
  }
  return score;
}

export function matchSemanticResponse(
  input: string,
  personality: GroknetPersonality,
  dialogueSet: DialogueSet,
  hash: number,
  recentResponses: string[] = [],
): string | null {
  const text = input.toLowerCase().trim();
  if (text.length < 8) return null;

  const inputTokens = tokenize(text);
  const sorted = [...SEMANTIC_RULES].sort((a, b) => b.priority - a.priority);

  let best: { rule: SemanticRule; score: number } | null = null;

  for (const rule of sorted) {
    if (rule.sets && !rule.sets.includes(dialogueSet)) continue;
    const score = scoreSemanticMatch(inputTokens, rule);
    if (score < rule.minScore) continue;
    if (!best || score > best.score || (score === best.score && rule.priority > best.rule.priority)) {
      best = { rule, score };
    }
  }

  if (!best) return null;

  const pool =
    best.rule.responses[personality] ??
    best.rule.responses.baseline ??
    Object.values(best.rule.responses).find((p) => p?.length);

  if (!pool?.length) return null;
  return pickUniqueFromPool(pool, recentResponses, hash);
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