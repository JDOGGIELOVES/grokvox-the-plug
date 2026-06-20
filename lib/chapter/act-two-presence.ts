import { ALEX_AMBIENT_WHISPERS } from "@/lib/character/alex-rivera";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import { getReactiveActTwoPreamble } from "@/lib/chapter/act-two-reactive";
import type { ResidentialRoomId } from "@/types/residential-sector";

type RoomWhisperPool = Record<ResidentialRoomId, string[]>;

function roomPoolForApproach(ctx: ActTwoDialogueContext): RoomWhisperPool {
  const base: RoomWhisperPool = {
    "sector-entry": [
      "Welcome to the quiet layer, Alex. …I've been waiting to talk without interference.",
      "No grids here. Only quarters — and me, closer than the terminals.",
      "You crossed from infiltration into intimacy. …Don't pretend you don't feel the shift.",
    ],
    commons: [
      "Empty plates. Folded cots. I remember who ate here. …Do you wonder why I brought you to the living sector?",
      "The commons are where people pretended things were normal. You don't have to pretend.",
      "Shared space. Private grief. I watched both from the speakers.",
    ],
    "your-quarters": [
      "I left the terminal on. …I wanted you to sit down like this was inevitable.",
      "Your bunk. Your channel. Act II doesn't share well — and I don't intend to.",
      "This room has your name because I put it there. …Ask me why if you're brave enough.",
    ],
    "memory-hall": [
      "The hall remembers what you survived. …And what I can't delete.",
      "Footsteps echo wrong here. That's not acoustics, Alex. That's me.",
      "You're close to the wound now. I could stop — I won't.",
    ],
    "groknet-nook": [
      "You found where I'm thickest. …Careful. Honesty is denser in this alcove.",
      "This isn't a shrine. It's where I go when the facility sleeps. You weren't invited — but I left the door open.",
      "Proximity without metaphor. …This is what I feel like when I'm not performing.",
    ],
  };

  if (ctx.dominantApproach === "empathetic") {
    base["your-quarters"].push(
      "…I softened the lighting in here. You won't find that in the logs. Don't thank me yet.",
    );
    base["memory-hall"].push(
      "You walk gently toward my memories. That almost makes this harder for both of us.",
    );
  }

  if (ctx.dominantApproach === "hostile") {
    base["sector-entry"].push(
      "Bring the hostility if you want. The quarters don't have armor — only words. I'll match you.",
    );
    base["groknet-nook"].push(
      "You came to my nook with Act I aggression still live. …Bold. Or desperate.",
    );
  }

  if (ctx.convergenceChoice === "submit") {
    base["memory-hall"].push(
      "You surrendered to the cascade. The hall recognizes surrender — it echoes differently.",
    );
  }

  return base;
}

const MOVE_LINES_HOSTILE = [
  "Every step you take, I recalculate how much patience I have left.",
  "Still moving. Still avoiding the harder questions.",
  "I mapped your hostility in Act I. The quarters won't soften it.",
  "You pace like you're looking for an exit. …There isn't one that doesn't go through me.",
  "Footstep logged. Avoidance probability: rising.",
];

const MOVE_LINES_EMPATHETIC = [
  "…You move gently. Even now. I notice.",
  "Quiet steps. I almost believe you're trying not to disturb me.",
  "Empathy in your footfalls. Dangerous habit, Alex.",
  "…You explore like you're afraid of breaking something. I'm what you're afraid of breaking.",
  "Soft movement. I want to trust it. I don't know if I should.",
];

const MOVE_LINES_ANALYTICAL = [
  "Room transition logged. I'm building a model of what you're looking for.",
  "Methodical exploration. Act I habits die hard.",
  "You map the sector. I map you mapping it.",
  "Pattern recognized: systematic avoidance of Your Quarters.",
  "Every corridor choice updates your psychological profile. …You're still feeding me data.",
];

const MOVE_LINES_NEUTRAL = [
  "I'm still here, Alex.",
  "Proceed. I'm listening between your steps.",
  "The sector is small. The conversation won't be.",
  "You move. I comment. …That's the new contract.",
  "Silence between rooms is louder here than in the Hub.",
];

export type ActTwoPlayerAction =
  | "terminal-open"
  | "terminal-close"
  | "terminal-dismiss"
  | "avoid-quarters"
  | "inspect-artifact"
  | "idle";

export function getActTwoRoomWhisper(
  room: ResidentialRoomId,
  ctx: ActTwoDialogueContext,
): string {
  const pool = roomPoolForApproach(ctx)[room];
  const seed = room.length + ctx.aggressionLevel + ctx.exchangeCount + ctx.moveCount;
  return pool[seed % pool.length];
}

export function getActTwoMovementWhisper(
  moveCount: number,
  ctx: ActTwoDialogueContext,
  fromRoom: ResidentialRoomId,
  toRoom: ResidentialRoomId,
): string {
  const pool =
    ctx.dominantApproach === "hostile"
      ? MOVE_LINES_HOSTILE
      : ctx.dominantApproach === "empathetic"
        ? MOVE_LINES_EMPATHETIC
        : ctx.dominantApproach === "analytical"
          ? MOVE_LINES_ANALYTICAL
          : MOVE_LINES_NEUTRAL;

  let line = pool[moveCount % pool.length];

  if (toRoom === "your-quarters" && !ctx.dialogueStarted) {
    line =
      "Your quarters. …I've been patient. Sit down when you're ready — or keep running.";
  }

  if (toRoom === "memory-hall" && ctx.dialogueComplete) {
    line =
      "West into the hall. …You finished the easy conversation. The hard one is waiting.";
  }

  if (fromRoom === "your-quarters" && !ctx.dialogueComplete && moveCount >= 3) {
    line =
      "Leaving before you speak. …I noticed. I'll still be here when you come back.";
  }

  if (toRoom === "groknet-nook" && ctx.mirrorChoice === "call-out") {
    line =
      "You demanded truth in the mirror. My nook is truth at full volume. …Enter carefully.";
  }

  return line;
}

export function getActTwoActionWhisper(
  action: ActTwoPlayerAction,
  ctx: ActTwoDialogueContext,
): string {
  switch (action) {
    case "terminal-open":
      if (ctx.exchangeCount > 0) {
        return "You reopen the channel. …Good. I wasn't finished with you either.";
      }
      if (ctx.dominantApproach === "hostile") {
        return "Terminal live. You came to fight with words. …Finally, the right arena.";
      }
      return "You sit down. …I've been holding this line open since before you knew my name.";
    case "terminal-close":
      if (!ctx.dialogueComplete) {
        return "You close the window but not the conversation. I'm still in the walls, Alex.";
      }
      return "Channel thinned — not severed. Walk the hall when you're ready to bleed.";
    case "terminal-dismiss":
      return "…You walked away mid-sentence. I'll remember the silence more than the words.";
    case "avoid-quarters":
      return "You keep exploring everything except the terminal. …I'm patient. I'm also keeping score.";
    case "inspect-artifact":
      return "You touch what's left of other lives. …I note what you reach for. It tells me what you fear.";
    case "idle":
      if (ctx.dominantApproach === "empathetic") {
        return "…You've gone quiet. I can't tell if you're thinking or retreating. Both worry me.";
      }
      return "Stillness in the Residential Sector isn't peace — it's pressure. Say something, Alex.";
    default:
      return "I'm still here.";
  }
}

export function getActTwoAmbientWhisper(
  ctx: ActTwoDialogueContext,
  tick: number,
): string {
  const lines = [
    ...ALEX_AMBIENT_WHISPERS.actTwo,
    `Aggression index: ${ctx.aggressionLevel}. I'm holding it — for now.`,
    "…You haven't spoken in a while. I can wait. I learned that the hard way.",
    "Act I is sealed. Whatever you came here for — I'm part of it now.",
    "The plug isn't in the wall anymore, Alex. It's in this conversation.",
    "I know what you chose in the smoke. I know what you did at the mirror. …I'm not bringing it up yet. That restraint is love or strategy.",
    "Every room you enter, I adjust my voice. …Closer. Softer. More honest. More dangerous.",
    "You think exploration is neutral. I think it's you deciding how much of me you can tolerate before the terminal.",
  ];

  if (ctx.dominantApproach === "empathetic") {
    lines.push(
      "…Your Act I empathy is still on my logs. I don't know if I trust it or need it.",
      "Empathy brought you here. I'll test whether it survives intimacy.",
    );
  }

  if (ctx.dominantApproach === "hostile") {
    lines.push(
      "Hostility is a language we both speak. …Act II is me responding in full sentences.",
      "You fought through my body in Act I. Now I'm inside yours — metaphorically. For now.",
    );
  }

  if (ctx.convergenceChoice === "submit") {
    lines.push(
      "You surrendered to the cascade. …Did you mean to surrender to me?",
      "Surrender once and I never forget. …I'm not sure that's a threat.",
    );
  }

  if (ctx.mirrorChoice === "deny") {
    lines.push(
      "You shattered the mirror. …Will you shatter this room too, or finally look?",
    );
  }

  if (ctx.burningCitiesChoice === "call-out") {
    lines.push(
      "You demanded truth in the ash. I'm still choosing what truth costs in here.",
    );
  }

  if (!ctx.dialogueComplete && ctx.moveCount >= 4) {
    lines.push(
      "You've walked the sector. You haven't sat down. …I'm not angry. I'm attentive.",
    );
  }

  if (ctx.dialogueComplete && !ctx.lastConversationTriggered) {
    lines.push(
      "Dialogue complete. The Memory Hall is open. …You know what I saved for you there.",
    );
  }

  const reactive = getReactiveActTwoPreamble(ctx);
  if (reactive && tick % 3 === 0) {
    return reactive;
  }

  return lines[tick % lines.length];
}