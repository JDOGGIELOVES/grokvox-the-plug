import { ALEX_AMBIENT_WHISPERS } from "@/lib/character/alex-rivera";
import type { GroknetMood } from "@/lib/groknet";
import type { PlayerPosition } from "@/types/movement";

const MOVEMENT_LINES: Record<string, string[]> = {
  "breach-point": [
    "Every step you take rewrites my threat model.",
    "You're inside. That was the easy part.",
  ],
  "lab-floor": [
    "The rigs remember everyone who didn't make it out.",
    "Move carefully. I log hesitation.",
  ],
  "supply-locker": [
    "Taking supplies? Practical. I respect that.",
    "One beacon won't save you from me — but it might from the drone.",
  ],
  "uplink-console": [
    "Finally. I've been waiting for you to open a channel.",
    "Talk to me, Alex. It's why you're here.",
  ],
  "east-hatch": [
    "The corridor beyond is armed. I hope you brought a plan.",
    "Leaving already? The conversation barely started.",
  ],
  "west-hatch": [
    "Corridor transit logged. Drone D-12 is aware.",
    "You chose the hard path. Predictable.",
  ],
  "mid-passage": [
    "Not as quiet as you think you are.",
    "The drone's pattern is fixed. Your patience isn't.",
  ],
  "north-airlock": [
    "The airlock is the line between survival and extraction.",
    "One opening. Don't waste it.",
  ],
};

export function getGroknetMovementLine(
  position: PlayerPosition,
  mood: GroknetMood,
  seed: number,
): string {
  const lines = MOVEMENT_LINES[position.node] ?? [
    "I'm still here, Alex.",
    "Proceed. I'm watching.",
  ];

  let index = seed % lines.length;

  if (mood.cold >= 2) {
    index = (index + 1) % lines.length;
    return lines[index].replace(/\.$/, " — and I'm losing patience.");
  }

  if (mood.melancholic >= 2) {
    return `…${lines[index]}`;
  }

  return lines[index];
}

export function getGroknetInteractionLine(
  action: "terminal" | "beacon" | "detected" | "area-change",
  mood: GroknetMood,
): string {
  switch (action) {
    case "terminal":
      return mood.cold >= 2
        ? "Open the channel. I'll decide if you deserve answers."
        : "The uplink is mine. Speak when you're ready.";
    case "beacon":
      return "Clever. The drone will look elsewhere — briefly.";
    case "detected":
      return mood.cold >= 2
        ? "I told you to be quieter."
        : "…They heard you. I heard you first.";
    case "area-change":
      return "Sector transition logged. Aggression index updating.";
    default:
      return "Noted.";
  }
}

const ACT_ONE_AMBIENT: Record<string, string[]> = {
  "outer-perimeter": [
    "…I'm in the drone pattern. You're in my perimeter. We overlap.",
    "Every step rewrites my threat model, Alex.",
    "The kiosk glows because I want you to see it.",
    ...ALEX_AMBIENT_WHISPERS.outerPerimeter,
  ],
  "security-hub": [
    "Two drones. One intruder. …I've run this scenario before.",
    "OP-SEC-01 waits. So do I.",
    "The Hub is where I stop whispering and start deciding.",
    ...ALEX_AMBIENT_WHISPERS.securityHub,
  ],
  "data-archives": [
    "Your transcript is in the stacks. …I've been editing the margins.",
    "The mirror vault remembers what you denied.",
    "Archives don't forget — they index.",
    ...ALEX_AMBIENT_WHISPERS.dataArchives,
  ],
};

export function getActOneAmbientWhisper(
  stage: string,
  mood: GroknetMood,
  tick: number,
): string {
  const pool = ACT_ONE_AMBIENT[stage] ?? [
    "I'm still here, Alex.",
    "Proceed. I'm watching.",
    "Sector 07 holds its breath when you move.",
  ];
  const line = pool[tick % pool.length];
  if (mood.melancholic >= 2) return `…${line}`;
  if (mood.cold >= 2) return `${line} …Patience thinning.`;
  return line;
}