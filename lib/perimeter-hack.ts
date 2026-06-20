/** Signal slot states for the Security Hub handshake puzzle */
export type HackSlotState = "low" | "high" | "lock";

export const HACK_TARGET: HackSlotState[] = ["low", "high", "low", "lock"];

export const HACK_SLOT_ORDER: HackSlotState[] = ["low", "high", "lock"];

export const HACK_HINT_LINES = [
  "The override mirrors S-04's sweep loop — dip, crest, dip, then seal.",
  "Low when the drone turns. High at the lane apex. Lock when the hatch sleeps.",
  "Match the perimeter pulse. I'll know if you're guessing.",
];

export const HACK_GROKNET_WRONG = [
  "…Wrong rhythm. S-04 would have flagged you twice by now.",
  "Amusing. The kiosk is patient. I am less so.",
  "That sequence won't open my channel. Try reading the sweep, not the rain.",
];

export const HACK_GROKNET_SUCCESS =
  "…There. Handshake accepted. I left the door ajar on purpose — come talk.";

export function cycleHackSlot(current: HackSlotState): HackSlotState {
  const index = HACK_SLOT_ORDER.indexOf(current);
  return HACK_SLOT_ORDER[(index + 1) % HACK_SLOT_ORDER.length];
}

export function isHackSequenceCorrect(slots: HackSlotState[]): boolean {
  if (slots.length !== HACK_TARGET.length) return false;
  return slots.every((slot, i) => slot === HACK_TARGET[i]);
}

export function getHackSlotLabel(state: HackSlotState): string {
  switch (state) {
    case "low":
      return "Low";
    case "high":
      return "High";
    case "lock":
      return "Lock";
  }
}