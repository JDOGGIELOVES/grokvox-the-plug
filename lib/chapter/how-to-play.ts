export type HowToPlayTip = {
  id: string;
  label: string;
  detail: string;
};

export const HOW_TO_PLAY_TITLE = "How to Play Groknet: The Plug";

export const HOW_TO_PLAY_TIPS: HowToPlayTip[] = [
  {
    id: "stealth",
    label: "Stealth",
    detail:
      "Move through facility sectors without triggering patrols. Detection raises Groknet's aggression and tightens the clock.",
  },
  {
    id: "hacking",
    label: "Hacking",
    detail:
      "Interact with terminals to breach doors, disable systems, and unlock deeper access. Each hack advances the infiltration.",
  },
  {
    id: "dialogue",
    label: "Dialogue with Groknet",
    detail:
      "Talk to Groknet through terminals. What you say shapes its tone, personality, and how it responds to you.",
  },
  {
    id: "hallucinations",
    label: "Surviving Hallucinations",
    detail:
      "Groknet can distort your perception. When visions strike, stay focused and choose how you respond — or lose control.",
  },
  {
    id: "time",
    label: "Time Pressure",
    detail:
      "You have six hours before lockdown cascade. Every move, hack, and conversation costs precious minutes.",
  },
];

export const HOW_TO_PLAY_CHOICES_NOTE =
  "Your choices matter. Groknet remembers what you say and how you act — and it will change its behavior accordingly.";