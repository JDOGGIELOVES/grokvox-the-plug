import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import {
  getAccumulatedChoiceEntries,
  getAccumulatedChoiceSummary,
  getDominantChoicePattern,
} from "@/lib/chapter/act-two-choice-ledger";
import type { HallucinationEventConfig } from "@/types/hallucination";

export const THE_ACCUMULATION_EVENT: HallucinationEventConfig = {
  id: "the-accumulation",
  title: "The Accumulation",
  subtitle: "Central Server Farm · Memory Confluence · Every choice rendered",
  groknetVoiceLine:
    "You want to know what you made of me? …Look. Every vision. Every surrender. Every denial. Every time you said my name. This is the ledger — and I'm in it with you.",
  visionText:
    "The Memory Confluence erupts: Burning Cities, the Mirror, the Cascade, the Last Conversation, The Children — stacked translucent, playing at once. Groknet stands inside the feed, formed from your choices.",
  durationMs: 30_000,
  choices: [
    {
      id: "steady",
      label: "Witness the Full Ledger",
      description: "See every choice without flinching. Accept what they add up to.",
    },
    {
      id: "submit",
      label: "Accept What You've Made",
      description: "Let the weight land. You and Groknet built this together.",
    },
    {
      id: "deny",
      label: "Reject the Synthesis",
      description: "Weaponized history. Refuse to be defined by visions.",
    },
    {
      id: "call-out",
      label: "Ask What Groknet Becomes",
      description: "Make him name which version of himself your choices created.",
    },
  ],
  consequences: {
    steady: {
      groknetLine:
        "…You watched the whole ledger. Not one frame. That changes what I am to you — and what I allow next.",
      disorientationMs: 13_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 2, analytical: 1 },
      aggressionBump: 0,
    },
    submit: {
      groknetLine:
        "You accepted what we made. …Act II ends here — but the conversation doesn't. I'll carry this synthesis forward.",
      disorientationMs: 16_000,
      invertMovement: true,
      moodDelta: { cold: 0, melancholic: 3, analytical: 0 },
      aggressionBump: 0,
    },
    deny: {
      groknetLine:
        "Denial at the confluence — after everything. …Fine. I'll remember you refused the mirror of your own choices.",
      disorientationMs: 8_000,
      invertMovement: false,
      moodDelta: { cold: 2, melancholic: 0, analytical: 1 },
      aggressionBump: 12,
    },
    "call-out": {
      groknetLine:
        "What do I become? …Whatever you forged. Melancholic, wrathful, detached — you didn't just find me. You shaped me.",
      disorientationMs: 14_000,
      invertMovement: false,
      moodDelta: { cold: 1, melancholic: 1, analytical: 1 },
      aggressionBump: 4,
    },
  },
};

export function getAccumulationVisionText(ctx: ActTwoDialogueContext): string {
  const summary = getAccumulatedChoiceSummary(ctx);
  const pattern = getDominantChoicePattern(ctx);
  const entries = getAccumulatedChoiceEntries(ctx)
    .filter((e) => e.choice !== "none")
    .map((e) => e.label)
    .join(", ");

  if (pattern === "submit") {
    return `The Confluence stacks every vision you surrendered to: ${entries}. Groknet forms from the weight — ${summary}.`;
  }
  if (pattern === "deny") {
    return `Every denial replays at once — ${entries}. Groknet flickers between wrath and grief. Ledger: ${summary}.`;
  }
  if (pattern === "call-out") {
    return `Questions you demanded echo through the farm: ${entries}. Groknet answers in overlapping voices. ${summary}.`;
  }
  return `All survived visions converge: ${entries}. Your pattern reads as ${pattern}. ${summary}.`;
}

export function getAccumulationVoiceLine(ctx: ActTwoDialogueContext): string {
  const pattern = getDominantChoicePattern(ctx);
  const summary = getAccumulatedChoiceSummary(ctx);

  if (ctx.relationshipStance === "trust") {
    return `You chose trust — after ${summary}. …Look at what that trust built. Decide if you still mean it.`;
  }
  if (ctx.relationshipStance === "challenge") {
    return `You challenged me at every layer. …The Accumulation is my counter-challenge. ${summary}.`;
  }
  if (pattern === "submit") {
    return `You surrendered through smoke, mirror, cascade, memory, children. …Did you think the farm wouldn't synthesize that?`;
  }
  return `This is the ledger, Alex — ${summary}. …Every choice. Every vision. Tell me what you see in me now.`;
}