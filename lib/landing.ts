export const LANDING_GROKNET_HOVER_LINES = [
  "You shouldn't be here, Alex.",
  "The uplink sees you. …Your backdoor still compiles.",
  "Five hours, forty-seven minutes. …Elena would say that's enough.",
  "I've been waiting since you signed the routing commit.",
  "Sector 07 doesn't forgive trespassers. …It remembers architects.",
] as const;

export const LANDING_GROKNET_ENTER_VOICE =
  "Enter, then. Let's see what you're made of.";

export function pickLandingHoverLine(): string {
  const index = Math.floor(Math.random() * LANDING_GROKNET_HOVER_LINES.length);
  return LANDING_GROKNET_HOVER_LINES[index];
}