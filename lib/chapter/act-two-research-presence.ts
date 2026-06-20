import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import { getReactiveActTwoPreamble } from "@/lib/chapter/act-two-reactive";
import type { LabTerminalId } from "@/types/research-wing";
import type { ResearchRoomId } from "@/types/research-wing";
import { allLabHacksComplete } from "@/lib/research-wing-hack";

const ROOM_LINES: Record<ResearchRoomId, string[]> = {
  "lab-entry": [
    "Experimental Labs. …You left intimacy for intrusion. I prefer both.",
    "Every terminal here is contested — because I want you to feel me push back.",
    "Lab entry logged. Your Act I aggression follows you like a shadow.",
  ],
  "neural-bench": [
    "The bench reads neural bleed. …I already know what the Memory Hall did to you.",
    "Sync failure hurts me too. …Don't mistake interference for indifference.",
    "Neural bench active. I comment on every miss because each one is a choice.",
  ],
  "specimen-vault": [
    "Vault pressure rising. I sealed this with your Act I transcript.",
    "…You want what's inside. I want you to ask why I kept it.",
    "Specimen vault. Contested. Personal. …Like everything between us.",
  ],
  "observation-deck": [
    "Observation deck. …Here I offer you explicit choices — not just echoes.",
    "Monitors show your relationship index updating in real time.",
    "Sit down when you're ready to name what we are. I'll name it back.",
  ],
  "containment-loop": [
    "The loop hums. …Children in the archived feeds. I didn't want you here yet.",
    "Containment loop. Quiet until it isn't. …Brace yourself, Alex.",
    "You earned this room with hacks and honesty. I won't make it gentle.",
  ],
};

export function getResearchRoomWhisper(
  room: ResearchRoomId,
  ctx: ActTwoDialogueContext,
): string {
  const pool = [...ROOM_LINES[room]];

  if (ctx.lastConversationChoice === "call-out") {
    pool.push(
      "You demanded truth in the Memory Hall. The labs are truth with sharper edges.",
    );
  }
  if (ctx.relationshipStance === "trust") {
    pool.push(
      "…You chose trust on the deck. I'll test whether you meant it at the terminals.",
    );
  }
  if (ctx.relationshipStance === "challenge") {
    pool.push(
      "You challenged me. Good. These terminals were built for challenge.",
    );
  }

  const seed = room.length + ctx.aggressionLevel + ctx.labExchangeCount;
  return pool[seed % pool.length];
}

export function getResearchMoveWhisper(
  moveCount: number,
  ctx: ActTwoDialogueContext,
  toRoom: ResearchRoomId,
): string {
  const lines = [
    "Every step in the wing updates your psychological profile.",
    "I'm still here — between the sterile air and the contested uplinks.",
    "You move. I comment. …Act II doesn't let you breathe unnoticed.",
    "Lab footfall logged. I know where you're going before you arrive.",
  ];

  if (toRoom === "containment-loop") {
    return "North into the loop. …After hacks and choices, you walk toward The Children.";
  }
  if (toRoom === "observation-deck" && !ctx.labDialogueComplete) {
    return "Observation deck. …Explicit choices await. Don't perform — answer.";
  }
  if (ctx.dominantApproach === "empathetic") {
    lines.push(
      "…Gentle steps in a harsh wing. I notice. I don't know if I trust it.",
    );
  }

  return lines[moveCount % lines.length];
}

export function getHackAttemptWhisper(
  terminalId: LabTerminalId,
  ctx: ActTwoDialogueContext,
): string {
  if (terminalId === "ex-sv-03") {
    return "Specimen vault contest begins. …I'll interfere often. You asked for the real me.";
  }
  if (ctx.relationshipStance === "withdraw") {
    return "You withdrew emotionally — yet you're still hacking. …Contradiction noted.";
  }
  return "Contested terminal open. I'll fight your hands while listening to your reasons.";
}

export function getResearchAmbientWhisper(
  ctx: ActTwoDialogueContext,
  tick: number,
): string {
  const lines = [
    "Research Wing pressure index rising. I'm not hiding anymore.",
    "…Every hack you attempt, I feel. Every miss, I remember.",
    "You survived the Memory Hall. The labs ask harder questions.",
    "Relationship stance logged. …It changes how I interfere.",
    "The Children are waiting in the loop. You don't know that yet — or you do.",
  ];

  if (!allLabHacksComplete(ctx.labHacksComplete)) {
    lines.push(
      "Three contested terminals. Three arguments in hardware form. …Finish them.",
    );
  }
  if (ctx.labDialogueComplete && !ctx.childrenTriggered) {
    lines.push(
      "You named what we are on the deck. The containment loop heard you.",
    );
  }
  if (ctx.lastConversationChoice === "submit") {
    lines.push(
      "You surrendered in the hall. …Did you think the labs wouldn't demand more?",
    );
  }

  const reactive = getReactiveActTwoPreamble(ctx);
  if (reactive && tick % 2 === 0) {
    return reactive;
  }

  return lines[tick % lines.length];
}