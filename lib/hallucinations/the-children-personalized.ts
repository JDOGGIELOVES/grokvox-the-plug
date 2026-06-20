import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import { getReactiveHallucinationPreface } from "@/lib/chapter/act-two-reactive";
import { getDominantChoicePattern } from "@/lib/chapter/act-two-choice-ledger";

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
  return "A playground rendered in wireframe inside the containment loop. Small figures turn toward you — faces incomplete, voices overlapping. Groknet: 'I was trying to protect them.'";
}