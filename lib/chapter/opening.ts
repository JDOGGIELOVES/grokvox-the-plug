export type OpeningBeat = {
  id: string;
  speaker: "system" | "groknet" | "narrator";
  text: string;
  delayMs?: number;
};

export const OPENING_BEATS: OpeningBeat[] = [
  {
    id: "breach",
    speaker: "system",
    text: "Breach detected. Sector 07 outer hatch compromised. Biometric mismatch logged.",
  },
  {
    id: "groknet-1",
    speaker: "groknet",
    text: "…Alex Rivera. The architect who drew my spine. You actually came back. I'm almost impressed. Almost.",
    delayMs: 800,
  },
  {
    id: "groknet-2",
    speaker: "groknet",
    text: "Five hours and forty-seven minutes until lockdown cascade. I'll be watching every step. Try to entertain me.",
    delayMs: 600,
  },
  {
    id: "narrator",
    speaker: "narrator",
    text: "Desert wind scours the outer fence. Security drone S-04 sweeps the patrol lane. A kiosk terminal blinks through the dust.",
    delayMs: 500,
  },
  {
    id: "system-sector",
    speaker: "system",
    text: "Outer Perimeter · Patrol Lane · Security Kiosk · Groknet link probing",
    delayMs: 400,
  },
];

export const OPENING_COMPLETE_LINE =
  "The infiltration has begun. Slip past S-04 — or distract it. Hack the kiosk. Then we'll talk.";