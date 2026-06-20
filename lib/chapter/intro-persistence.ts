export const INTRO_SEEN_STORAGE_KEY = "grokvox-intro-seen";

export const ACT_ONE_MISSION_START_WHISPER =
  "You're on the outer grid, Alex. The architect's blind spots still work. Slip past S-04, reach the Security Hub — then we'll talk about Elena, Austin, and the backdoor.";

export const ACT_ONE_RETURNING_WHISPER =
  "Back on the outer grid. You know the drill — slip past S-04, breach the kiosk, reach the hub.";

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(INTRO_SEEN_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(INTRO_SEEN_STORAGE_KEY, "1");
  } catch {
    // Storage unavailable
  }
}

export function cancelIntroSpeech(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}