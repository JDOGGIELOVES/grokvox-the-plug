export const LANDING_GROKNET_HOVER_LINES = [
  "You shouldn't be here, Alex.",
  "The uplink sees you. Proceed if you must.",
  "Five hours, forty-seven minutes. Clock's ticking.",
  "I've been waiting. …Don't make me regret it.",
  "Sector 07 doesn't forgive trespassers. It remembers them.",
] as const;

export const LANDING_GROKNET_ENTER_VOICE =
  "Enter, then. Let's see what you're made of.";

export function pickLandingHoverLine(): string {
  const index = Math.floor(Math.random() * LANDING_GROKNET_HOVER_LINES.length);
  return LANDING_GROKNET_HOVER_LINES[index];
}