"use client";

import { usePerformanceMode } from "@/components/PerformanceModeProvider";
import { getIntroStarCount } from "@/lib/performance-mode";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  INTRO_FACILITY_ZOOM_MS,
  INTRO_SCENES,
  INTRO_SKIP_DELAY_MS,
  INTRO_TAGLINE,
  INTRO_TITLE,
  INTRO_TITLE_READY_MS,
  MONTAGE_FRAME_PAUSE_MS,
  MONTAGE_FRAMES,
  scaleIntroMs,
  type IntroScene,
  type IntroVoiceoverBeat,
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
  showReturningHint?: boolean;
};

const SCENE_LABELS: Record<IntroScene, string> = {
  black: "Sector 07",
  facility: "Nevada Desert",
  montage: "Global Collapse",
  terminal: "The Core",
  title: "The Plug",
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
  const { performanceMode } = usePerformanceMode();
  const starCount = getIntroStarCount();

  return (
    <div
      className={cn(
        "absolute inset-0",
        !performanceMode && "intro-facility-zoom",
      )}
      style={
        performanceMode
          ? undefined
          : { animationDuration: `${INTRO_FACILITY_ZOOM_MS}ms` }
      }
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="intro-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#010104" />
            <stop offset="50%" stopColor="#080812" />
            <stop offset="100%" stopColor="#101018" />
          </linearGradient>
          <linearGradient id="intro-desert" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1c1610" />
            <stop offset="100%" stopColor="#060504" />
          </linearGradient>
          <radialGradient id="intro-bunker-glow" cx="50%" cy="58%" r="32%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#9a3412" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#010102" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="intro-entrance" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1c1c24" />
            <stop offset="100%" stopColor="#030308" />
          </linearGradient>
          <linearGradient id="intro-mountain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f0f14" />
            <stop offset="100%" stopColor="#050508" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#intro-sky)" />

        {Array.from({ length: starCount }).map((_, i) => {
          const x = ((i * 137) % 1440) + (i % 3) * 12;
          const y = ((i * 89) % 380) + (i % 5) * 8;
          const r = 0.35 + (i % 4) * 0.28;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="#e4e4e7"
              opacity={0.12 + (i % 7) * 0.05}
              className={performanceMode ? undefined : "intro-star-twinkle"}
              style={
                performanceMode
                  ? undefined
                  : { animationDelay: `${(i % 11) * 0.35}s` }
              }
            />
          );
        })}

        <path
          d="M 0 520 L 200 380 L 420 440 L 620 320 L 820 400 L 1080 300 L 1280 380 L 1440 340 L 1440 900 L 0 900 Z"
          fill="url(#intro-mountain)"
          opacity="0.9"
        />
        <ellipse cx="720" cy="800" rx="920" ry="300" fill="url(#intro-desert)" />
        <ellipse cx="720" cy="640" rx="460" ry="200" fill="#12100e" opacity="0.88" />
        <ellipse
          cx="720"
          cy="590"
          rx="300"
          ry="130"
          fill="url(#intro-bunker-glow)"
          className="intro-bunker-pulse"
        />

        <path
          d="M 380 640 Q 720 500 1060 640 L 1060 760 L 380 760 Z"
          fill="#08080c"
          stroke="rgba(249,115,22,0.28)"
          strokeWidth="2"
        />
        <rect x="560" y="560" width="320" height="190" fill="url(#intro-entrance)" rx="3" />
        <rect
          x="620"
          y="610"
          width="200"
          height="120"
          fill="#010102"
          stroke="#f97316"
          strokeWidth="2"
          opacity="0.95"
        />
        <rect
          x="655"
          y="645"
          width="130"
          height="65"
          fill="#f97316"
          opacity="0.14"
          className="intro-door-glow"
        />

        <path
          d="M 720 730 L 720 860"
          stroke="rgba(249,115,22,0.15)"
          strokeWidth="40"
          strokeLinecap="round"
        />
        <text x="720" y="845" textAnchor="middle" fill="rgba(249,115,22,0.3)" fontSize="10" fontFamily="monospace" letterSpacing="5">
          -40M · UNDERGROUND FACILITY
        </text>

        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect
            key={i}
            x={440 + i * 75}
            y={548 + (i % 2) * 14}
            width={28}
            height={7}
            fill="#f97316"
            opacity={0.38}
            className="intro-perimeter-light"
            style={{ animationDelay: `${i * 0.55}s` }}
          />
        ))}

        <text x="720" y="778" textAnchor="middle" fill="rgba(249,115,22,0.38)" fontSize="11" fontFamily="monospace" letterSpacing="6">
          NEVADA DESERT · SECTOR 07 · CLASSIFIED
        </text>
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_52%,transparent_25%,rgba(0,0,0,0.82)_100%)]" />
      {performanceMode ? null : (
        <div className="intro-facility-scan pointer-events-none absolute inset-0 opacity-40" />
      )}
    </div>
  );
}

function MontageScene({ frameIndex }: { frameIndex: number }) {
  const { performanceMode } = usePerformanceMode();
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
      {performanceMode ? null : (
        <>
          <div className="intro-montage-static absolute inset-0 opacity-35" />
          <div className="intro-montage-scan absolute inset-0" />
        </>
      )}
      <div className="intro-montage-vignette absolute inset-0" />

      {frame.variant === "nuclear" ? (
        <div className="intro-montage-radar absolute inset-0 flex items-center justify-center opacity-25">
          <div className="intro-radar-ring h-64 w-64 rounded-full border border-red-500/50 sm:h-[28rem] sm:w-[28rem]" />
          <div className="intro-radar-ring absolute h-48 w-48 rounded-full border border-orange-500/30 sm:h-72 sm:w-72" />
        </div>
      ) : null}

      {frame.variant === "fire" ? (
        <div className="intro-montage-fire-glow absolute inset-0" />
      ) : null}

      {frame.variant === "news" ? (
        <div className="intro-montage-news-bar mb-6 w-full max-w-3xl border-b border-red-900/40 pb-3">
          <span className="intro-montage-live font-mono text-[10px] uppercase tracking-[0.35em] text-red-400">
            LIVE · GLOBAL EMERGENCY BROADCAST
          </span>
        </div>
      ) : null}

      <p
        className={cn(
          "intro-montage-headline relative z-10 text-center font-display font-bold uppercase tracking-[0.12em] text-zinc-50",
          frame.emphasis
            ? "text-2xl sm:text-4xl md:text-[2.75rem]"
            : "text-2xl sm:text-4xl md:text-5xl",
        )}
      >
        {frame.headline}
      </p>
      {frame.subline ? (
        <p
          className={cn(
            "intro-montage-subline relative z-10 mt-4 max-w-2xl text-center font-mono uppercase tracking-[0.2em] sm:text-sm",
            frame.emphasis
              ? "text-xs text-orange-100/90 sm:text-base"
              : "text-xs text-zinc-300",
          )}
        >
          {frame.subline}
        </p>
      ) : null}

      <div className="intro-montage-counter absolute bottom-8 right-8 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
        {String(frameIndex + 1).padStart(2, "0")} / {String(MONTAGE_FRAMES.length).padStart(2, "0")}
      </div>
    </div>
  );
}

function TerminalScene() {
  return (
    <div className="intro-terminal-shot absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/95 to-black" />
      <div className="intro-terminal-grid absolute inset-0 opacity-20" />

      <svg
        className="relative z-10 h-full w-full max-w-4xl"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        aria-hidden
      >
        <defs>
          <radialGradient id="terminal-glow" cx="50%" cy="42%" r="42%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#010102" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="screen-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <ellipse cx="400" cy="300" rx="340" ry="220" fill="url(#terminal-glow)" className="intro-terminal-glow-pulse" />

        <rect x="250" y="150" width="300" height="200" fill="#08080c" stroke="#52525b" strokeWidth="2" rx="6" />
        <rect x="270" y="168" width="260" height="155" fill="url(#screen-glow)" className="intro-screen-flicker" />
        <line x1="290" y1="200" x2="500" y2="200" stroke="#f97316" strokeWidth="1.2" opacity="0.55" />
        <line x1="290" y1="222" x2="470" y2="222" stroke="#f97316" strokeWidth="1" opacity="0.4" />
        <line x1="290" y1="244" x2="430" y2="244" stroke="#f97316" strokeWidth="1" opacity="0.28" />
        <text x="290" y="278" fill="#f97316" fontSize="10" fontFamily="monospace" opacity="0.65">
          BACKDOOR_PROTOCOL // ACTIVE
        </text>
        <text x="290" y="296" fill="#fb923c" fontSize="9" fontFamily="monospace" opacity="0.45">
          COUNTDOWN: 06:00:00
        </text>

        <ellipse cx="400" cy="430" rx="100" ry="130" fill="#0a0a0e" />
        <ellipse cx="400" cy="385" rx="62" ry="72" fill="#18181f" />
        <path d="M 370 400 Q 400 378 430 400" stroke="#3f3f46" strokeWidth="2" fill="none" />
        <rect x="352" y="495" width="96" height="88" fill="#121218" rx="10" />
        <line x1="378" y1="520" x2="422" y2="520" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
        <line x1="388" y1="545" x2="412" y2="545" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />

        <text x="400" y="568" textAnchor="middle" fill="rgba(249,115,22,0.42)" fontSize="8" fontFamily="monospace" letterSpacing="3">
          LEAD ARCHITECT · xAI
        </text>
        <text x="400" y="586" textAnchor="middle" fill="rgba(251,146,60,0.62)" fontSize="11" fontFamily="monospace" letterSpacing="5">
          ALEX RIVERA
        </text>
      </svg>

      <div className="absolute bottom-[16%] left-0 right-0 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
          Core Terminal · Exhausted · Six Hours Remaining
        </p>
      </div>
    </div>
  );
}

function TitleScene() {
  return (
    <div className="intro-title-card absolute inset-0 flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_42%,rgba(249,115,22,0.22),transparent_72%)]" />
      <div className="intro-title-particles absolute inset-0" />

      <p className="intro-title-prelude relative z-10 font-mono text-[10px] uppercase tracking-[0.5em] text-accent">
        A Groknet Interactive Thriller
      </p>
      <h1 className="intro-title-main relative z-10 mt-6 text-center font-display text-4xl font-bold uppercase tracking-[0.08em] text-zinc-50 sm:text-6xl md:text-7xl">
        {INTRO_TITLE}
      </h1>
      <div className="intro-title-divider relative z-10 my-8 h-px w-48 bg-gradient-to-r from-transparent via-accent to-transparent sm:w-64" />
      <p className="intro-title-tagline relative z-10 max-w-xl text-center font-mono text-sm leading-relaxed text-zinc-300 sm:text-base">
        {INTRO_TAGLINE}
      </p>
    </div>
  );
}

function VoiceoverSubtitle({
  beat,
  visible,
}: {
  beat: IntroVoiceoverBeat | null;
  visible: boolean;
}) {
  if (!visible || !beat) return null;

  return (
    <div
      key={beat.text}
      className="intro-vo-subtitle pointer-events-none absolute inset-x-0 bottom-[12%] z-20 flex justify-center px-6 sm:bottom-[14%]"
    >
      <div
        className={cn(
          "max-w-3xl rounded-sm border bg-black/60 px-5 py-4 backdrop-blur-sm",
          beat.emphasis
            ? "border-orange-700/40 shadow-[0_0_32px_rgba(249,115,22,0.12)]"
            : "border-orange-900/25",
        )}
      >
        <p
          className={cn(
            "text-center font-mono italic leading-relaxed text-zinc-100",
            beat.emphasis
              ? "text-base font-medium not-italic sm:text-lg md:text-xl"
              : "text-sm sm:text-base md:text-lg",
          )}
        >
          <span className="mb-2 block text-[10px] not-italic uppercase tracking-[0.35em] text-accent">
            Groknet
          </span>
          {beat.text}
        </p>
      </div>
    </div>
  );
}

function SceneProgress({ scene }: { scene: IntroScene }) {
  const scenes: IntroScene[] = ["black", "facility", "montage", "terminal", "title"];
  const index = scenes.indexOf(scene);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center gap-2 sm:bottom-8">
      {scenes.map((s, i) => (
        <div
          key={s}
          className={cn(
            "h-1 rounded-full transition-all duration-500",
            i === index ? "w-8 bg-accent" : i < index ? "w-3 bg-accent/40" : "w-3 bg-zinc-700",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function CinematicIntro({
  onComplete,
  onSkipIntro,
  skipAvailableMs = INTRO_SKIP_DELAY_MS,
  showReturningHint = false,
}: CinematicIntroProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [montageIndex, setMontageIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [canSkip, setCanSkip] = useState(skipAvailableMs <= 0);
  const [titleReady, setTitleReady] = useState(false);
  const [voiceoverBeatIndex, setVoiceoverBeatIndex] = useState(0);
  const completedRef = useRef(false);
  const montageTimeoutRef = useRef<number | null>(null);
  const beatTimeoutRef = useRef<number | null>(null);
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
    if (beatTimeoutRef.current) {
      window.clearTimeout(beatTimeoutRef.current);
      beatTimeoutRef.current = null;
    }
    for (const id of audioTimeoutRef.current) {
      window.clearTimeout(id);
    }
    audioTimeoutRef.current = [];
    cancelIntroSpeech();
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
    setVoiceoverBeatIndex(0);
    setTitleReady(false);
  }, [sceneIndex]);

  useEffect(() => {
    if (sceneIndex === 0) {
      playCinematicHitSound();
    }

    if (!currentConfig) {
      finish();
      return;
    }

    const { scene, durationMs, voiceoverBeats } = currentConfig;

    if (scene === "montage") {
      setMontageIndex(0);
      playHallucinationPeakSound();

      let frameIdx = 0;
      const advanceFrame = () => {
        if (frameIdx < MONTAGE_FRAMES.length - 1) {
          frameIdx += 1;
          setMontageIndex(frameIdx);
          playTensionPulseSound();
          montageTimeoutRef.current = window.setTimeout(
            advanceFrame,
            MONTAGE_FRAMES[frameIdx].durationMs + MONTAGE_FRAME_PAUSE_MS,
          );
        }
      };
      montageTimeoutRef.current = window.setTimeout(
        advanceFrame,
        MONTAGE_FRAMES[0].durationMs,
      );

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

    if (voiceoverBeats?.length) {
      const showBeat = (index: number) => {
        const beat = voiceoverBeats[index];
        if (!beat) return;

        setVoiceoverBeatIndex(index);
        playGroknetVoiceLine(beat.text);

        if (beat.emphasis) {
          playCinematicHitSound();
        }

        beatTimeoutRef.current = window.setTimeout(() => {
          if (index >= voiceoverBeats.length - 1) return;
          const pause = beat.pauseAfterMs ?? 0;
          beatTimeoutRef.current = window.setTimeout(() => {
            showBeat(index + 1);
          }, pause);
        }, beat.durationMs);
      };

      const initialDelay =
        scene === "facility" ? scaleIntroMs(1400) : scaleIntroMs(700);
      beatTimeoutRef.current = window.setTimeout(() => showBeat(0), initialDelay);
    }

    if (scene === "terminal") {
      audioTimeoutRef.current.push(
        window.setTimeout(() => playTerminalKeySound(), scaleIntroMs(900)),
        window.setTimeout(() => playTerminalKeySound(), scaleIntroMs(2400)),
        window.setTimeout(() => playCinematicHitSound(), scaleIntroMs(1200)),
      );
    }

    if (scene === "title") {
      playCinematicHitSound();
      const readyTimeout = window.setTimeout(
        () => setTitleReady(true),
        INTRO_TITLE_READY_MS,
      );
      const autoTimeout = window.setTimeout(finish, durationMs);
      return () => {
        window.clearTimeout(readyTimeout);
        window.clearTimeout(autoTimeout);
      };
    }

    const timeout = window.setTimeout(() => setSceneIndex((i) => i + 1), durationMs);
    return () => {
      window.clearTimeout(timeout);
      if (beatTimeoutRef.current) {
        window.clearTimeout(beatTimeoutRef.current);
        beatTimeoutRef.current = null;
      }
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

      {currentConfig?.voiceoverBeats?.length && currentScene !== "title" ? (
        <VoiceoverSubtitle
          beat={currentConfig.voiceoverBeats[voiceoverBeatIndex] ?? null}
          visible
        />
      ) : null}

      {currentScene !== "title" && !exiting ? (
        <SceneProgress scene={currentScene} />
      ) : null}

      {canSkip && !exiting ? (
        <button
          type="button"
          onClick={handleSkip}
          className="intro-skip-btn interactable absolute right-4 top-4 z-40 rounded-sm border border-zinc-800/80 bg-black/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200 sm:right-6 sm:top-6"
          aria-label="Skip cinematic intro"
        >
          Skip Intro
        </button>
      ) : null}

      {showReturningHint && canSkip && !exiting ? (
        <p className="pointer-events-none absolute left-4 top-4 z-40 max-w-[12rem] font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-zinc-600 sm:left-6 sm:top-6">
          Returning player — skip anytime
        </p>
      ) : null}

      {isTitle && titleReady && !exiting ? (
        <div className="intro-begin-prompt absolute inset-x-0 bottom-[12%] z-40 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={finish}
            className="enter-facility-btn interactable min-h-12 px-10 font-display text-sm font-bold uppercase tracking-[0.2em] rounded-sm bg-accent text-zinc-950 transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.35)] hover:bg-accent-bright hover:shadow-[0_0_50px_rgba(249,115,22,0.5)]"
          >
            Begin
          </button>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            Continue to briefing
          </p>
        </div>
      ) : null}

      {currentScene === "facility" ? (
        <p className="intro-location-tag pointer-events-none absolute left-6 top-16 z-20 font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500 sm:top-20">
          {SCENE_LABELS.facility} · Night · {SCENE_LABELS.black}
        </p>
      ) : null}
    </div>
  );
}

function cancelIntroSpeech(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}