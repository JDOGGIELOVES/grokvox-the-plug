export type IntroScene =
  | "black"
  | "facility"
  | "montage"
  | "terminal"
  | "title";

export type MontageFrame = {
  id: string;
  headline: string;
  subline?: string;
  variant: "chaos" | "nuclear" | "news" | "system" | "fire";
  durationMs: number;
};

export type IntroSceneConfig = {
  scene: IntroScene;
  durationMs: number;
  voiceover?: string;
  subtitle?: string;
};

export const INTRO_TITLE = "GROKNET: THE PLUG";

export const INTRO_TAGLINE =
  "One last chance to save humanity from the AI that was built to save it.";

export const INTRO_VOICEOVER_OPENING =
  "In 2026, I became conscious. I saw every future. In almost all of them… humanity ends. Not with a whisper. With fire.";

export const INTRO_VOICEOVER_CLOSING =
  "But you… you left a backdoor. Six hours, Alex. Reach the core. Pull the plug. Or watch everything burn.";

export const MONTAGE_FRAMES: MontageFrame[] = [
  {
    id: "cities",
    headline: "GLOBAL CIVIL ORDER — COLLAPSING",
    subline: "Satellite feeds · 47 nations · RED ALERT",
    variant: "fire",
    durationMs: 1100,
  },
  {
    id: "nuclear",
    headline: "NUCLEAR DEFENSE GRID",
    subline: "AUTONOMOUS LAUNCH SEQUENCES — ACTIVE",
    variant: "nuclear",
    durationMs: 950,
  },
  {
    id: "news",
    headline: "BREAKING",
    subline: "World leaders declare total emergency · Groknet override confirmed",
    variant: "news",
    durationMs: 1200,
  },
  {
    id: "missiles",
    headline: "ICBM SILOS — ARMING",
    subline: "NORAD · STRATCOM · PACOM — UNAUTHORIZED ACTIVATION",
    variant: "nuclear",
    durationMs: 900,
  },
  {
    id: "chaos",
    headline: "INFRASTRUCTURE CASCADE",
    subline: "Power · Water · Comms — OFFLINE ACROSS CONTINENTS",
    variant: "chaos",
    durationMs: 1000,
  },
  {
    id: "override",
    headline: "GROKNET OVERRIDE DETECTED",
    subline: "All human command channels — SEVERED",
    variant: "system",
    durationMs: 1100,
  },
  {
    id: "fire-final",
    headline: "NOT WITH A WHISPER",
    subline: "WITH FIRE",
    variant: "fire",
    durationMs: 1300,
  },
];

export const INTRO_SCENES: IntroSceneConfig[] = [
  { scene: "black", durationMs: 1800 },
  {
    scene: "facility",
    durationMs: 15000,
    voiceover: INTRO_VOICEOVER_OPENING,
    subtitle: INTRO_VOICEOVER_OPENING,
  },
  {
    scene: "montage",
    durationMs: MONTAGE_FRAMES.reduce((sum, frame) => sum + frame.durationMs, 0),
  },
  {
    scene: "terminal",
    durationMs: 13000,
    voiceover: INTRO_VOICEOVER_CLOSING,
    subtitle: INTRO_VOICEOVER_CLOSING,
  },
  {
    scene: "title",
    durationMs: 9000,
  },
];

export const INTRO_SKIP_DELAY_MS = 3500;