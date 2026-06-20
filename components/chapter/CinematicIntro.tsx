"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  INTRO_SCENES,
  INTRO_SKIP_DELAY_MS,
  INTRO_TAGLINE,
  INTRO_TITLE,
  MONTAGE_FRAMES,
  type IntroScene,
  type MontageFrame,
} from "@/lib/chapter/cinematic-intro";
import { playGroknetVoiceLine } from "@/lib/hallucination";
import {
  playCinematicHitSound,
  playHallucinationPeakSound,
  playTensionPulseSound,
  playTerminalKeySound,
} from "@/lib/sounds";
import { cn } from "@/lib/utils";

type CinematicIntroProps = {
  onComplete: () => void;
  onSkipIntro?: () => void;
  skipAvailableMs?: number;
};

function montageVariantClass(variant: MontageFrame["variant"]) {
  switch (variant) {
    case "nuclear":
      return "intro-montage-nuclear";
    case "news":
      return "intro-montage-news";
    case "system":
      return "intro-montage-system";
    case "fire":
      return "intro-montage-fire";
    default:
      return "intro-montage-chaos";
  }
}

function FacilityScene() {
  return (
    <div className="intro-facility-zoom absolute inset-0">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="intro-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#020208" />
            <stop offset="55%" stopColor="#0a0a14" />
            <stop offset="100%" stopColor="#12101a" />
          </linearGradient>
          <linearGradient id="intro-desert" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1410" />
            <stop offset="100%" stopColor="#0a0806" />
          </linearGradient>
          <radialGradient id="intro-bunker-glow" cx="50%" cy="62%" r="28%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#9a3412" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#010102" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="intro-entrance" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#18181f" />
            <stop offset="100%" stopColor="#050508" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#intro-sky)" />

        {Array.from({ length: 120 }).map((_, i) => {
          const x = ((i * 137) % 1440) + (i % 3) * 12;
          const y = ((i * 89) % 420) + (i % 5) * 8;
          const r = 0.4 + (i % 4) * 0.3;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="#e4e4e7"
              opacity={0.15 + (i % 7) * 0.06}
              className="intro-star-twinkle"
              style={{ animationDelay: `${(i % 11) * 0.35}s` }}
            />
          );
        })}

        <ellipse cx="720" cy="780" rx="900" ry="280" fill="url(#intro-desert)" />
        <ellipse cx="720" cy="620" rx="420" ry="180" fill="#141210" opacity="0.85" />
        <ellipse cx="720" cy="580" rx="280" ry="120" fill="url(#intro-bunker-glow)" className="intro-bunker-pulse" />

        <path
          d="M 420 620 Q 720 480 1020 620 L 1020 720 L 420 720 Z"
          fill="#0c0c10"
          stroke="rgba(249,115,22,0.25)"
          strokeWidth="1.5"
        />
        <rect x="580" y="560" width="280" height="160" fill="url(#intro-entrance)" rx="2" />
        <rect x="640" y="600" width="160" height="100" fill="#010102" stroke="#f97316" strokeWidth="1.5" opacity="0.9" />
        <rect x="665" y="630" width="110" height="55" fill="#f97316" opacity="0.12" className="intro-door-glow" />

        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect
              x={480 + i * 80}
              y={540 + (i % 2) * 12}
              width={24}
              height={6}
              fill="#f97316"
              opacity={0.35}
              className="intro-perimeter-light"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
            <rect
              x={900 + i * 70}
              y={548 - (i % 2) * 10}
              width={24}
              height={6}
              fill="#f97316"
              opacity={0.35}
              className="intro-perimeter-light"
              style={{ animationDelay: `${i * 0.45 + 0.3}s` }}
            />
          </g>
        ))}

        <text x="720" y="755" textAnchor="middle" fill="rgba(249,115,22,0.35)" fontSize="11" fontFamily="monospace" letterSpacing="6">
          NEVADA DESERT · SECTOR 07 · CLASSIFIED
        </text>

        <line x1="0" y1="620" x2="1440" y2="620" stroke="rgba(249,115,22,0.06)" strokeWidth="1" />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_55%,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
    </div>
  );
}

function MontageScene({ frameIndex }: { frameIndex: number }) {
  const frame = MONTAGE_FRAMES[frameIndex];
  if (!frame) return null;

  return (
    <div
      key={frame.id}
      className={cn(
        "intro-montage-flash absolute inset-0 flex flex-col items-center justify-center px-6",
        montageVariantClass(frame.variant),
      )}
    >
      <div className="intro-montage-static absolute inset-0 opacity-30" />
      <div className="intro-montage-scan absolute inset-0" />

      {frame.variant === "news" ? (
        <div className="intro-montage-news-bar mb-6 w-full max-w-3xl">
          <span className="intro-montage-live font-mono text-[10px] uppercase tracking-[0.35em] text-red-400">
            LIVE
          </span>
        </div>
      ) : null}

      <p className="intro-montage-headline font-display text-center text-2xl font-bold uppercase tracking-[0.12em] text-zinc-50 sm:text-4xl md:text-5xl">
        {frame.headline}
      </p>
      {frame.subline ? (
        <p className="intro-montage-subline mt-4 max-w-2xl text-center font-mono text-xs uppercase tracking-[0.2em] text-zinc-300 sm:text-sm">
          {frame.subline}
        </p>
      ) : null}

      {frame.variant === "nuclear" ? (
        <div className="intro-montage-radar absolute inset-0 flex items-center justify-center opacity-20">
          <div className="intro-radar-ring h-64 w-64 rounded-full border border-red-500/40 sm:h-96 sm:w-96" />
        </div>
      ) : null}
    </div>
  );
}

function TerminalScene() {
  return (
    <div className="intro-terminal-shot absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/90 to-black" />

      <svg
        className="relative z-10 h-full w-full max-w-4xl"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        aria-hidden
      >
        <defs>
          <radialGradient id="terminal-glow" cx="50%" cy="45%" r="40%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#010102" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="screen-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <ellipse cx="400" cy="320" rx="320" ry="200" fill="url(#terminal-glow)" className="intro-terminal-glow-pulse" />

        <rect x="280" y="180" width="240" height="160" fill="#0a0a0c" stroke="#3f3f46" strokeWidth="2" rx="4" />
        <rect x="295" y="195" width="210" height="125" fill="url(#screen-glow)" className="intro-screen-flicker" />
        <line x1="310" y1="220" x2="480" y2="220" stroke="#f97316" strokeWidth="1" opacity="0.5" />
        <line x1="310" y1="240" x2="450" y2="240" stroke="#f97316" strokeWidth="1" opacity="0.35" />
        <line x1="310" y1="260" x2="420" y2="260" stroke="#f97316" strokeWidth="1" opacity="0.25" />
        <text x="310" y="290" fill="#f97316" fontSize="9" fontFamily="monospace" opacity="0.6">
          BACKDOOR_PROTOCOL // ACTIVE
        </text>

        <ellipse cx="400" cy="420" rx="90" ry="120" fill="#0c0c10" />
        <ellipse cx="400" cy="380" rx="55" ry="65" fill="#18181f" />
        <rect x="355" y="480" width="90" height="80" fill="#141418" rx="8" />

        <text x="400" y="548" textAnchor="middle" fill="rgba(249,115,22,0.45)" fontSize="8" fontFamily="monospace" letterSpacing="3">
          LEAD ARCHITECT · xAI · EXHAUSTED
        </text>
        <text x="400" y="564" textAnchor="middle" fill="rgba(249,115,22,0.55)" fontSize="10" fontFamily="monospace" letterSpacing="4">
          ALEX RIVERA
        </text>
      </svg>

      <div className="absolute bottom-[18%] left-0 right-0 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
          Security Hub · Terminal 7-A · Exhausted
        </p>
      </div>
    </div>
  );
}

function TitleScene() {
  return (
    <div className="intro-title-card absolute inset-0 flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_45%,rgba(249,115,22,0.18),transparent_70%)]" />

      <p className="intro-title-prelude font-mono text-[10px] uppercase tracking-[0.5em] text-accent">
        A Groknet Interactive Thriller
      </p>
      <h1 className="intro-title-main font-display mt-6 text-center text-4xl font-bold uppercase tracking-[0.08em] text-zinc-50 sm:text-6xl md:text-7xl">
        {INTRO_TITLE}
      </h1>
      <div className="intro-title-divider my-8 h-px w-48 bg-gradient-to-r from-transparent via-accent to-transparent sm:w-64" />
      <p className="intro-title-tagline max-w-xl text-center font-mono text-sm leading-relaxed text-zinc-300 sm:text-base">
        {INTRO_TAGLINE}
      </p>
    </div>
  );
}

function VoiceoverSubtitle({ text, visible }: { text: string; visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="intro-vo-subtitle pointer-events-none absolute inset-x-0 bottom-[12%] z-20 flex justify-center px-6 sm:bottom-[14%]">
      <p className="max-w-3xl text-center font-mono text-sm italic leading-relaxed text-zinc-200 sm:text-base md:text-lg">
        <span className="mr-2 text-[10px] not-italic uppercase tracking-[0.3em] text-accent">
          Groknet
        </span>
        {text}
      </p>
    </div>
  );
}

export function CinematicIntro({
  onComplete,
  onSkipIntro,
  skipAvailableMs = INTRO_SKIP_DELAY_MS,
}: CinematicIntroProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [montageIndex, setMontageIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [titleReady, setTitleReady] = useState(false);
  const completedRef = useRef(false);
  const montageTimeoutRef = useRef<number | null>(null);
  const audioTimeoutRef = useRef<number[]>([]);

  const currentConfig = INTRO_SCENES[sceneIndex];
  const currentScene: IntroScene = currentConfig?.scene ?? "title";
  const isTitle = currentScene === "title";

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setExiting(true);
    window.setTimeout(onComplete, 800);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (montageTimeoutRef.current) {
      window.clearTimeout(montageTimeoutRef.current);
      montageTimeoutRef.current = null;
    }
    for (const id of audioTimeoutRef.current) {
      window.clearTimeout(id);
    }
    audioTimeoutRef.current = [];
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (onSkipIntro) {
      setExiting(true);
      window.setTimeout(onSkipIntro, 800);
      return;
    }
    finish();
  }, [finish, onSkipIntro]);

  useEffect(() => {
    if (skipAvailableMs <= 0) {
      setCanSkip(true);
      return;
    }
    const skipTimeout = window.setTimeout(() => setCanSkip(true), skipAvailableMs);
    return () => window.clearTimeout(skipTimeout);
  }, [skipAvailableMs]);

  useEffect(() => {
    if (sceneIndex === 0) {
      playCinematicHitSound();
    }

    if (!currentConfig) {
      finish();
      return;
    }

    const { scene, durationMs, voiceover } = currentConfig;

    if (scene === "montage") {
      setMontageIndex(0);
      playHallucinationPeakSound();

      let frameIdx = 0;
      const advanceFrame = () => {
        if (frameIdx < MONTAGE_FRAMES.length - 1) {
          frameIdx += 1;
          setMontageIndex(frameIdx);
          playTensionPulseSound();
          montageTimeoutRef.current = window.setTimeout(advanceFrame, MONTAGE_FRAMES[frameIdx].durationMs);
        }
      };
      montageTimeoutRef.current = window.setTimeout(advanceFrame, MONTAGE_FRAMES[0].durationMs);

      const sceneTimeout = window.setTimeout(() => {
        if (montageTimeoutRef.current) {
          window.clearTimeout(montageTimeoutRef.current);
          montageTimeoutRef.current = null;
        }
        setSceneIndex((i) => i + 1);
      }, durationMs);

      return () => {
        window.clearTimeout(sceneTimeout);
        if (montageTimeoutRef.current) {
          window.clearTimeout(montageTimeoutRef.current);
          montageTimeoutRef.current = null;
        }
        for (const id of audioTimeoutRef.current) {
          window.clearTimeout(id);
        }
        audioTimeoutRef.current = [];
      };
    }

    if (voiceover) {
      audioTimeoutRef.current.push(
        window.setTimeout(
          () => playGroknetVoiceLine(voiceover),
          scene === "facility" ? 1200 : 600,
        ),
      );
    }

    if (scene === "terminal") {
      audioTimeoutRef.current.push(
        window.setTimeout(() => playTerminalKeySound(), 800),
        window.setTimeout(() => playTerminalKeySound(), 2200),
      );
    }

    if (scene === "title") {
      playCinematicHitSound();
      const readyTimeout = window.setTimeout(() => setTitleReady(true), 2800);
      const autoTimeout = window.setTimeout(finish, durationMs);
      return () => {
        window.clearTimeout(readyTimeout);
        window.clearTimeout(autoTimeout);
      };
    }

    const timeout = window.setTimeout(() => setSceneIndex((i) => i + 1), durationMs);
    return () => {
      window.clearTimeout(timeout);
      for (const id of audioTimeoutRef.current) {
        window.clearTimeout(id);
      }
      audioTimeoutRef.current = [];
    };
  }, [sceneIndex, currentConfig, finish]);

  return (
    <div
      className={cn(
        "cinematic-intro fixed inset-0 z-[60] overflow-hidden bg-black",
        exiting && "cinematic-intro-out",
      )}
      role="presentation"
    >
      <div className="cinematic-vignette pointer-events-none absolute inset-0 z-30" />
      <div className="cinematic-scanlines pointer-events-none absolute inset-0 z-30" />
      <div className="cinematic-grain pointer-events-none absolute inset-0 z-30" />

      {currentScene === "black" ? (
        <div className="intro-black-fade absolute inset-0 bg-black" />
      ) : null}

      {currentScene === "facility" ? <FacilityScene /> : null}

      {currentScene === "montage" ? <MontageScene frameIndex={montageIndex} /> : null}

      {currentScene === "terminal" ? <TerminalScene /> : null}

      {currentScene === "title" ? <TitleScene /> : null}

      {currentConfig?.subtitle && currentScene !== "title" ? (
        <VoiceoverSubtitle text={currentConfig.subtitle} visible />
      ) : null}

      {canSkip && !exiting ? (
        <button
          type="button"
          onClick={handleSkip}
          className="intro-skip-btn absolute right-4 top-4 z-40 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:text-zinc-300 sm:right-6 sm:top-6"
          aria-label="Skip cinematic intro"
        >
          Skip Intro
        </button>
      ) : null}

      {isTitle && titleReady && !exiting ? (
        <div className="intro-begin-prompt absolute inset-x-0 bottom-[10%] z-40 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={finish}
            className="enter-facility-btn min-h-12 px-10 font-display text-sm font-bold uppercase tracking-[0.2em] rounded-sm bg-accent text-zinc-950 transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.35)] hover:bg-accent-bright hover:shadow-[0_0_50px_rgba(249,115,22,0.5)]"
          >
            Begin
          </button>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            Continue to briefing
          </p>
        </div>
      ) : null}

      {currentScene === "facility" ? (
        <p className="intro-location-tag pointer-events-none absolute left-6 top-6 z-20 font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500">
          Nevada · Night · -40m depth
        </p>
      ) : null}
    </div>
  );
}