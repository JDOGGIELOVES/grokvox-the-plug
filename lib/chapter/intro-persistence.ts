export const INTRO_SEEN_STORAGE_KEY = "grokvox-intro-seen";
export const INTRO_SKIP_LEVEL_KEY = "grokvox-intro-skip-level";

/** 0 = full intro, 1 = skip cinematic, 2 = skip cinematic + how-to-play */
export type IntroSkipLevel = 0 | 1 | 2;

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

export function getIntroSkipLevel(): IntroSkipLevel {
  if (typeof window === "undefined") return 0;

  try {
    const raw = window.localStorage.getItem(INTRO_SKIP_LEVEL_KEY);
    if (raw === "1") return 1;
    if (raw === "2") return 2;
    return 0;
  } catch {
    return 0;
  }
}

function persistIntroSkipLevel(level: IntroSkipLevel): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(INTRO_SKIP_LEVEL_KEY, String(level));
  } catch {
    // Storage unavailable
  }
}

export function markCinematicSkipped(): void {
  const current = getIntroSkipLevel();
  if (current < 1) persistIntroSkipLevel(1);
}

export function markHowToPlaySkipped(): void {
  persistIntroSkipLevel(2);
}

export function getEffectiveIntroSkipLevel(): IntroSkipLevel {
  const stored = getIntroSkipLevel();
  if (hasSeenIntro() && stored < 2) return 2;
  return stored;
}

export function shouldAutoSkipCinematic(): boolean {
  return getEffectiveIntroSkipLevel() >= 1;
}

export function shouldAutoSkipToMission(): boolean {
  return hasSeenIntro() && getEffectiveIntroSkipLevel() >= 2;
}

export function cancelIntroSpeech(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}