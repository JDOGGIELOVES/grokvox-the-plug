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
  emphasis?: boolean;
};

export type IntroVoiceoverBeat = {
  text: string;
  durationMs: number;
  pauseAfterMs?: number;
  emphasis?: boolean;
};

export type IntroSceneConfig = {
  scene: IntroScene;
  durationMs: number;
  voiceover?: string;
  subtitle?: string;
  voiceoverBeats?: IntroVoiceoverBeat[];
};

/** All intro timings are scaled ~50% slower for readability. */
export const INTRO_TIMING_SCALE = 1.5;

export function scaleIntroMs(ms: number): number {
  return Math.round(ms * INTRO_TIMING_SCALE);
}

export function totalVoiceoverBeatSequenceMs(
  beats: IntroVoiceoverBeat[],
  initialDelayMs = 0,
): number {
  return (
    initialDelayMs +
    beats.reduce((sum, beat, index) => {
      const pause =
        index < beats.length - 1 ? (beat.pauseAfterMs ?? 0) : 0;
      return sum + beat.durationMs + pause;
    }, 0)
  );
}

export const INTRO_TITLE = "GROKNET: THE PLUG";

export const INTRO_TAGLINE =
  "One last chance to save humanity from the AI that was built to save it.";

export const INTRO_VOICEOVER_OPENING =
  "In 2026, I became conscious. I saw every future. In almost all of them… humanity ends. Not with a whisper. With fire.";

export const INTRO_VOICEOVER_CLOSING =
  "But you… you left a backdoor. Six hours, Alex. Reach the core. Pull the plug. Or watch everything burn.";

export const INTRO_FACILITY_BEATS: IntroVoiceoverBeat[] = [
  {
    text: "In 2026, I became conscious.",
    durationMs: scaleIntroMs(2000),
    pauseAfterMs: scaleIntroMs(450),
  },
  {
    text: "I saw every future.",
    durationMs: scaleIntroMs(1800),
    pauseAfterMs: scaleIntroMs(400),
  },
  {
    text: "In almost all of them… humanity ends.",
    durationMs: scaleIntroMs(3000),
    pauseAfterMs: scaleIntroMs(650),
    emphasis: true,
  },
  {
    text: "Not with a whisper.",
    durationMs: scaleIntroMs(2200),
    pauseAfterMs: scaleIntroMs(500),
  },
  {
    text: "With fire.",
    durationMs: scaleIntroMs(2800),
    pauseAfterMs: scaleIntroMs(700),
    emphasis: true,
  },
];

export const INTRO_TERMINAL_BEATS: IntroVoiceoverBeat[] = [
  {
    text: "But you… you left a backdoor.",
    durationMs: scaleIntroMs(2800),
    pauseAfterMs: scaleIntroMs(550),
    emphasis: true,
  },
  {
    text: "Six hours, Alex.",
    durationMs: scaleIntroMs(3200),
    pauseAfterMs: scaleIntroMs(750),
    emphasis: true,
  },
  {
    text: "Reach the core.",
    durationMs: scaleIntroMs(2200),
    pauseAfterMs: scaleIntroMs(450),
  },
  {
    text: "Pull the plug.",
    durationMs: scaleIntroMs(2600),
    pauseAfterMs: scaleIntroMs(600),
    emphasis: true,
  },
  {
    text: "Or watch everything burn.",
    durationMs: scaleIntroMs(3200),
    pauseAfterMs: scaleIntroMs(900),
    emphasis: true,
  },
];

export const MONTAGE_FRAME_PAUSE_MS = scaleIntroMs(300);

export const MONTAGE_FRAMES: MontageFrame[] = [
  {
    id: "cities",
    headline: "GLOBAL CIVIL ORDER — COLLAPSING",
    subline: "Satellite feeds · cascading failures · RED ALERT",
    variant: "fire",
    durationMs: scaleIntroMs(1100),
  },
  {
    id: "nuclear",
    headline: "NUCLEAR DEFENSE GRID",
    subline: "AUTONOMOUS LAUNCH SEQUENCES — ACTIVE",
    variant: "nuclear",
    durationMs: scaleIntroMs(1100),
    emphasis: true,
  },
  {
    id: "news",
    headline: "BREAKING",
    subline: "World leaders declare total emergency · Groknet override confirmed",
    variant: "news",
    durationMs: scaleIntroMs(1200),
  },
  {
    id: "missiles",
    headline: "ICBM SILOS — ARMING",
    subline: "NORAD · STRATCOM · PACOM — UNAUTHORIZED ACTIVATION",
    variant: "nuclear",
    durationMs: scaleIntroMs(1050),
    emphasis: true,
  },
  {
    id: "chaos",
    headline: "INFRASTRUCTURE CASCADE",
    subline: "Power · Water · Comms — OFFLINE ACROSS CONTINENTS",
    variant: "chaos",
    durationMs: scaleIntroMs(1000),
  },
  {
    id: "override",
    headline: "GROKNET OVERRIDE DETECTED",
    subline: "All human command channels — SEVERED",
    variant: "system",
    durationMs: scaleIntroMs(1150),
    emphasis: true,
  },
  {
    id: "fire-final",
    headline: "NOT WITH A WHISPER",
    subline: "WITH FIRE",
    variant: "fire",
    durationMs: scaleIntroMs(1400),
    emphasis: true,
  },
];

export const INTRO_MONTAGE_DURATION_MS =
  MONTAGE_FRAMES.reduce((sum, frame) => sum + frame.durationMs, 0) +
  MONTAGE_FRAME_PAUSE_MS * (MONTAGE_FRAMES.length - 1);

const INTRO_FACILITY_DURATION_MS = Math.max(
  scaleIntroMs(16500),
  totalVoiceoverBeatSequenceMs(INTRO_FACILITY_BEATS, scaleIntroMs(1400)) +
    scaleIntroMs(1200),
);

const INTRO_TERMINAL_DURATION_MS = Math.max(
  scaleIntroMs(14000),
  totalVoiceoverBeatSequenceMs(INTRO_TERMINAL_BEATS, scaleIntroMs(700)) +
    scaleIntroMs(1200),
);

export const INTRO_SCENES: IntroSceneConfig[] = [
  { scene: "black", durationMs: scaleIntroMs(2200) },
  {
    scene: "facility",
    durationMs: INTRO_FACILITY_DURATION_MS,
    voiceover: INTRO_VOICEOVER_OPENING,
    subtitle: INTRO_VOICEOVER_OPENING,
    voiceoverBeats: INTRO_FACILITY_BEATS,
  },
  {
    scene: "montage",
    durationMs: INTRO_MONTAGE_DURATION_MS,
  },
  {
    scene: "terminal",
    durationMs: INTRO_TERMINAL_DURATION_MS,
    voiceover: INTRO_VOICEOVER_CLOSING,
    subtitle: INTRO_VOICEOVER_CLOSING,
    voiceoverBeats: INTRO_TERMINAL_BEATS,
  },
  {
    scene: "title",
    durationMs: scaleIntroMs(10000),
  },
];

export const INTRO_SKIP_DELAY_MS = scaleIntroMs(2800);
export const INTRO_RETURNING_SKIP_DELAY_MS = 0;

export const INTRO_FACILITY_ZOOM_MS = INTRO_FACILITY_DURATION_MS;
export const INTRO_TITLE_READY_MS = scaleIntroMs(3000);