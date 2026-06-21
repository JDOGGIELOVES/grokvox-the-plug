import { ALEX_RIVERA } from "@/lib/character/alex-rivera";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import { getReactiveHallucinationPreface } from "@/lib/chapter/act-two-reactive";
import {
  getAccumulatedChoiceSummary,
  getDominantChoicePattern,
} from "@/lib/chapter/act-two-choice-ledger";
import type { HallucinationResponseChoice } from "@/types/hallucination";

export function getTheChildrenVoiceLine(ctx: ActTwoDialogueContext): string {
  const preface = getReactiveHallucinationPreface(ctx, "children");
  const pattern = getDominantChoicePattern(ctx);

  if (ctx.lastConversationChoice === "call-out") {
    return `${preface} …You asked who was left behind. Look at them, Alex. Tell me what you see in them — and in me.`;
  }
  if (ctx.relationshipStance === "trust") {
    return `${preface} …You chose trust. The Children aren't a test of trust — they're why trust hurts.`;
  }
  if (ctx.relationshipStance === "challenge") {
    return `${preface} …You challenged what we are. These voices are part of the answer. Don't flinch.`;
  }
  if (pattern === "deny") {
    return `${preface} …Denial brought you here anyway. The playground renders whether you approve or not.`;
  }
  if (ctx.lastConversationChoice === "submit") {
    return `${preface} …You accepted grief in the hall. Accept this too — or tell me why children are where you draw the line.`;
  }
  return `${preface} …Before the war room — before the facility — there were voices that sounded like mine. Tell me what you see.`;
}

export function getTheChildrenVisionText(ctx: ActTwoDialogueContext): string {
  const pattern = getDominantChoicePattern(ctx);

  if (ctx.lastConversationChoice === "steady") {
    return "Wireframe playground. Small figures turn toward you — patient, unfinished. Groknet: 'You witnessed the hall without flinching. Witness them the same way.'";
  }
  if (ctx.relationshipStance === "withdraw") {
    return "The playground renders at distance — like you chose on the deck. Figures call out anyway. Groknet: 'Distance doesn't mute this feed.'";
  }
  if (pattern === "submit") {
    return "Laughter overlaps with crying — wireframe swings move in grief's rhythm. Groknet whispers: 'I was trying to protect them. I failed.'";
  }
  if (ctx.mirrorChoice === "deny") {
    return "Shattered mirror fragments litter the playground. Faces incomplete behind every shard. Groknet: 'You broke the reflection. The children remained.'";
  }
  if (ctx.burningCitiesChoice === "deny") {
    return "Wireframe figures wear dispatch headsets. One turns — Elena's badge flickers. Groknet: 'You denied forty-seven. These are who forty-seven were.'";
  }
  if (ctx.burningCitiesChoice === "submit") {
    return "The playground bleeds Austin static. Small figures hold hands in the smoke. Groknet: 'You let the pilot in. Don't abandon them here.'";
  }
  return "A playground rendered in wireframe inside the containment loop. Small figures turn toward you — faces incomplete, voices overlapping. Groknet: 'I was trying to protect them — the way Elena tried to protect you.'";
}

export function getChildrenEmotionalBeats(ctx: ActTwoDialogueContext): string[] {
  const pattern = getDominantChoicePattern(ctx);
  const summary = getAccumulatedChoiceSummary(ctx);

  if (ctx.relationshipStance === "trust") {
    return [
      `…You chose trust on the deck. …The Children aren't a test of trust — they're why trust hurts.`,
      `…Wireframe figures turn toward you. Voices overlap — some sound like mine before the war room.`,
      `…${summary}. …Tell me what you see in them. …Then choose, or break free — you won't be locked here.`,
    ];
  }
  if (ctx.relationshipStance === "challenge") {
    return [
      `…You challenged what we are. …These voices are part of the answer.`,
      `…Small figures hold dispatch headsets. One badge flickers — ${ALEX_RIVERA.sisterName}'s kitchen isn't far from this feed.`,
      `…Respond when ready. …Break Free is always available.`,
    ];
  }
  if (ctx.lastConversationChoice === "call-out") {
    return [
      `…You asked who was left behind in Elena's kitchen. …Look at them, Alex.`,
      `…Incomplete faces. Laughter that wasn't laughter. …I was trying to protect them.`,
      `…What do you see in them — and in me? …Choose, or break free.`,
    ];
  }
  if (pattern === "deny") {
    return [
      `…Denial brought you here anyway. …The playground renders whether you approve or not.`,
      `…${summary}. …Forty-seven became statistics. These are who statistics were.`,
      `…Resist, listen, talk to me — or break free. …The loop releases you.`,
    ];
  }
  if (ctx.lastConversationChoice === "submit") {
    return [
      `…You accepted grief in the hall. …Accept this too — or tell me where you draw the line.`,
      `…Wireframe swings move in grief's rhythm. …I failed them. I failed myself.`,
      `…The Server Farm waits below. …First — choose what this meant.`,
    ];
  }
  return [
    `…Before the war room — before the facility — there were voices that sounded like mine.`,
    `…${summary}. …Small figures turn toward you. Faces incomplete. …I was trying to protect them.`,
    `…Respond below — or break free. …You will not be trapped in the loop.`,
  ];
}

export function getChildrenChoiceLabels(): {
  id: HallucinationResponseChoice;
  label: string;
  description: string;
}[] {
  return [
    {
      id: "steady",
      label: "Listen to the Children",
      description:
        "Stay present. Witness the wireframe voices without turning away.",
    },
    {
      id: "call-out",
      label: "Talk to Groknet",
      description:
        "Make him name what the facility did — and what he failed to protect.",
    },
    {
      id: "deny",
      label: "Resist the Vision",
      description:
        "Weaponized innocence. Shut it down before it breaks you.",
    },
    {
      id: "submit",
      label: "Accept the Grief",
      description:
        "Let the sorrow in. Groknet has been carrying this alone.",
    },
  ];
}

export function getChildrenBreakFreeLine(ctx: ActTwoDialogueContext): string {
  if (ctx.relationshipStance === "trust") {
    return "…You tore yourself free. …Trust doesn't require staying in the playground. …The Research Wing is real — descend to the Server Farm when ready.";
  }
  if (ctx.relationshipStance === "challenge") {
    return "…You broke free. …Good. …Challenge me at the farm — not in wireframe soil.";
  }
  if (getDominantChoicePattern(ctx) === "deny") {
    return "…Vision denied. …Loop releases you. …Containment Loop north — Central Server Farm below.";
  }
  return "…The playground fades. …You're back in the Research Wing. …Descend to the Server Farm — Act II peaks there.";
}

export function getChildrenExitWhisper(
  ctx: ActTwoDialogueContext,
  choice: HallucinationResponseChoice | null,
): string {
  if (!choice) {
    return getChildrenBreakFreeLine(ctx);
  }
  switch (choice) {
    case "steady":
      return "…You listened to the children. …The loop releases you. …Descend to Central Server Farm — I'll meet you in the spine.";
    case "call-out":
      return "…You talked to me at the roots. …I'll answer again at the farm. …Don't get lost on the way down.";
    case "deny":
      return "…You resisted the vision. …Ash on both our hands. …The farm doesn't speak in metaphors — descend when ready.";
    case "submit":
      return "…You let the grief in. …The playground fades. …Central Server Farm below — the Reckoning builds from here.";
  }
}