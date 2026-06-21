export type PerformanceModePreference = "auto" | "on" | "off";

const STORAGE_KEY = "groknet-performance-mode";

let performanceModeActive = false;

export function isPerformanceMode(): boolean {
  return performanceModeActive;
}

export function setPerformanceModeActive(active: boolean): void {
  performanceModeActive = active;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("performance-mode", active);
  }
}

export function getPerformanceModePreference(): PerformanceModePreference {
  if (typeof window === "undefined") return "auto";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "on" || stored === "off" || stored === "auto") return stored;
  } catch {
    /* ignore */
  }
  return "auto";
}

export function setPerformanceModePreference(
  preference: PerformanceModePreference,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    /* ignore */
  }
}

export function detectShouldUsePerformanceMode(): boolean {
  if (typeof window === "undefined") return false;

  const preference = getPerformanceModePreference();
  if (preference === "on") return true;
  if (preference === "off") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  const isMobileWidth = window.matchMedia("(max-width: 768px)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  const lowMemory = nav.deviceMemory != null && nav.deviceMemory <= 4;
  const lowCores =
    nav.hardwareConcurrency != null && nav.hardwareConcurrency <= 4;

  const isMobile =
    isMobileWidth && (isTouchDevice || isCoarsePointer);

  if (isMobile) return true;
  if (isMobileWidth && lowMemory) return true;
  if (lowMemory && lowCores) return true;

  return false;
}

export function resolvePerformanceMode(): boolean {
  const active = detectShouldUsePerformanceMode();
  setPerformanceModeActive(active);
  return active;
}

export function getDroneAnimationIntervalMs(): number {
  return isPerformanceMode() ? 120 : 50;
}

export function getHallucinationPhaseIntervalMs(): number {
  return isPerformanceMode() ? 250 : 100;
}

export function getHallucinationResistIntervalMs(): number {
  return isPerformanceMode() ? 120 : 50;
}

export function getIntroStarCount(): number {
  return isPerformanceMode() ? 24 : 140;
}

export function getLandingParticleCount(): number {
  return isPerformanceMode() ? 0 : 8;
}

export function getDeepCoreFlickerIntervalMs(intense: boolean): number {
  return isPerformanceMode()
    ? intense
      ? 900
      : 1400
    : intense
      ? 280
      : 520;
}