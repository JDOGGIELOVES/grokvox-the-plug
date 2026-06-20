import type { GroknetPersonality } from "@/types/dialogue";
import type { HallucinationType } from "@/types/hallucination";

let distortionInterval: ReturnType<typeof setInterval> | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  return new Ctx();
}

let sharedCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (!sharedCtx) sharedCtx = getAudioContext();
  if (sharedCtx?.state === "suspended") void sharedCtx.resume();
  return sharedCtx;
}

function playTone(
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
  endFrequency?: number,
): void {
  const audio = ctx();
  if (!audio) return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  if (endFrequency) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(endFrequency, 40),
      now + duration * 0.7,
    );
  }

  filter.type = "lowpass";
  filter.frequency.value = type === "sawtooth" ? 1800 : 2600;

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  osc.start(now);
  osc.stop(now + duration);
}

export function playHallucinationSurgeSound(
  type: HallucinationType,
  personality: GroknetPersonality,
): void {
  stopHallucinationDistortion();

  switch (type) {
    case "auditory":
      playTone(180, 0.4, 0.04, "sawtooth", 90);
      setTimeout(() => playTone(260, 0.25, 0.03, "square", 140), 80);
      break;
    case "environmental":
      playTone(70, 0.5, 0.045, "triangle", 45);
      setTimeout(() => playTone(110, 0.35, 0.03, "sine"), 200);
      break;
    case "reality-shift":
      playTone(55, 0.55, 0.05, "sawtooth", 35);
      setTimeout(() => playTone(400, 0.2, 0.035, "square", 120), 150);
      setTimeout(() => playTone(90, 0.4, 0.04, "triangle"), 320);
      break;
    case "memory-recall":
      playTone(140, 0.55, 0.038, "triangle", 95);
      setTimeout(() => playTone(220, 0.45, 0.028, "sine"), 240);
      break;
    default:
      playTone(120, 0.35, 0.035, "square", 80);
  }

  startHallucinationDistortion(personality);
}

export function startHallucinationDistortion(
  personality: GroknetPersonality,
): void {
  stopHallucinationDistortion();

  const profile = {
    "wrathful-god": { base: 95, vol: 0.022, type: "sawtooth" as const, ms: 140 },
    "melancholic-prophet": {
      base: 130,
      vol: 0.018,
      type: "triangle" as const,
      ms: 220,
    },
    "detached-logician": {
      base: 200,
      vol: 0.016,
      type: "square" as const,
      ms: 180,
    },
    baseline: { base: 110, vol: 0.015, type: "sine" as const, ms: 260 },
  }[personality];

  distortionInterval = setInterval(() => {
    const jitter = (Math.random() - 0.5) * 40;
    playTone(
      profile.base + jitter,
      0.06,
      profile.vol * (0.6 + Math.random() * 0.4),
      profile.type,
      profile.base * 0.7,
    );
  }, profile.ms);
}

export function stopHallucinationDistortion(): void {
  if (distortionInterval) {
    clearInterval(distortionInterval);
    distortionInterval = null;
  }
}

export function playHallucinationResistSound(success: boolean): void {
  if (success) {
    playTone(520, 0.12, 0.03, "sine", 660);
    setTimeout(() => playTone(880, 0.1, 0.025, "sine"), 90);
  } else {
    playTone(180, 0.2, 0.035, "sawtooth", 70);
  }
}