let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (
        window as unknown as { webkitAudioContext: typeof AudioContext }
      ).webkitAudioContext)();
  }

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  return audioContext;
}

type BeepOptions = {
  frequency: number;
  endFrequency?: number;
  duration?: number;
  volume?: number;
  type?: OscillatorType;
};

function playBeep({
  frequency,
  endFrequency = frequency * 0.7,
  duration = 0.08,
  volume = 0.04,
  type = "sine",
}: BeepOptions): void {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  osc.frequency.exponentialRampToValueAtTime(
    Math.max(endFrequency, 80),
    now + duration * 0.6,
  );

  filter.type = "lowpass";
  filter.frequency.value = 2800;

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

export function playInteractSound(): void {
  playBeep({ frequency: 880, endFrequency: 620, duration: 0.07, volume: 0.035 });
}

export function playCardFlipSound(): void {
  playBeep({ frequency: 920, endFrequency: 520, duration: 0.075, volume: 0.028 });
}

export function playTerminalKeySound(): void {
  playBeep({
    frequency: 440,
    endFrequency: 380,
    duration: 0.04,
    volume: 0.02,
    type: "square",
  });
}

export function playTerminalSendSound(): void {
  playBeep({ frequency: 660, endFrequency: 990, duration: 0.1, volume: 0.03 });
}

export function playAlertSound(): void {
  playBeep({
    frequency: 220,
    endFrequency: 160,
    duration: 0.18,
    volume: 0.05,
    type: "sawtooth",
  });
}

export function playDetectionSound(): void {
  playBeep({
    frequency: 180,
    endFrequency: 90,
    duration: 0.22,
    volume: 0.065,
    type: "sawtooth",
  });
  setTimeout(() => {
    playBeep({
      frequency: 320,
      endFrequency: 140,
      duration: 0.16,
      volume: 0.045,
      type: "square",
    });
  }, 90);
}

export function playSuccessSound(): void {
  playBeep({ frequency: 523, endFrequency: 784, duration: 0.14, volume: 0.035 });
  setTimeout(() => {
    playBeep({ frequency: 784, endFrequency: 1046, duration: 0.16, volume: 0.03 });
  }, 120);
}

export function playDoorSound(): void {
  playBeep({ frequency: 310, endFrequency: 240, duration: 0.12, volume: 0.04 });
}

export function playAreaTransitionSound(): void {
  playBeep({ frequency: 260, endFrequency: 420, duration: 0.18, volume: 0.038 });
  setTimeout(() => {
    playBeep({ frequency: 520, endFrequency: 880, duration: 0.22, volume: 0.032 });
  }, 140);
  setTimeout(() => {
    playBeep({
      frequency: 180,
      endFrequency: 120,
      duration: 0.28,
      volume: 0.025,
      type: "triangle",
    });
  }, 320);
}

export function playCinematicHitSound(): void {
  playBeep({
    frequency: 110,
    endFrequency: 70,
    duration: 0.35,
    volume: 0.045,
    type: "triangle",
  });
  setTimeout(() => {
    playBeep({ frequency: 440, endFrequency: 660, duration: 0.2, volume: 0.028 });
  }, 180);
}

export function playTensionPulseSound(): void {
  playBeep({
    frequency: 200,
    endFrequency: 160,
    duration: 0.14,
    volume: 0.022,
    type: "sawtooth",
  });
}

export function playHallucinationPeakSound(): void {
  playBeep({
    frequency: 90,
    endFrequency: 55,
    duration: 0.3,
    volume: 0.05,
    type: "sawtooth",
  });
  setTimeout(() => {
    playBeep({
      frequency: 280,
      endFrequency: 140,
      duration: 0.24,
      volume: 0.04,
      type: "square",
    });
  }, 120);
}

export function playResidentialHeartbeat(): void {
  playBeep({
    frequency: 52,
    endFrequency: 42,
    duration: 0.22,
    volume: 0.028,
    type: "triangle",
  });
  setTimeout(() => {
    playBeep({
      frequency: 78,
      endFrequency: 58,
      duration: 0.14,
      volume: 0.02,
      type: "sine",
    });
  }, 180);
}

export function playLastConversationSound(): void {
  playBeep({
    frequency: 130,
    endFrequency: 95,
    duration: 0.45,
    volume: 0.038,
    type: "triangle",
  });
  setTimeout(() => {
    playBeep({
      frequency: 220,
      endFrequency: 165,
      duration: 0.55,
      volume: 0.03,
      type: "sine",
    });
  }, 200);
  setTimeout(() => {
    playBeep({
      frequency: 310,
      endFrequency: 240,
      duration: 0.7,
      volume: 0.022,
      type: "triangle",
    });
  }, 480);
  setTimeout(() => {
    playBeep({
      frequency: 88,
      endFrequency: 62,
      duration: 0.9,
      volume: 0.034,
      type: "sawtooth",
    });
  }, 900);
}

export function playGroknetInterferenceSound(): void {
  playBeep({
    frequency: 340,
    endFrequency: 120,
    duration: 0.16,
    volume: 0.042,
    type: "sawtooth",
  });
  setTimeout(() => {
    playBeep({
      frequency: 180,
      endFrequency: 90,
      duration: 0.12,
      volume: 0.03,
      type: "square",
    });
  }, 80);
}

export function playTheChildrenSound(): void {
  playBeep({
    frequency: 520,
    endFrequency: 380,
    duration: 0.35,
    volume: 0.028,
    type: "sine",
  });
  setTimeout(() => {
    playBeep({
      frequency: 660,
      endFrequency: 440,
      duration: 0.4,
      volume: 0.024,
      type: "triangle",
    });
  }, 200);
  setTimeout(() => {
    playBeep({
      frequency: 75,
      endFrequency: 48,
      duration: 1.1,
      volume: 0.04,
      type: "sawtooth",
    });
  }, 500);
  setTimeout(() => {
    playBeep({
      frequency: 880,
      endFrequency: 520,
      duration: 0.55,
      volume: 0.02,
      type: "sine",
    });
  }, 900);
}

export function playActTwoFinaleSound(): void {
  playBeep({
    frequency: 110,
    endFrequency: 55,
    duration: 0.5,
    volume: 0.038,
    type: "sine",
  });
  setTimeout(() => {
    playBeep({
      frequency: 220,
      endFrequency: 440,
      duration: 0.65,
      volume: 0.03,
      type: "triangle",
    });
  }, 350);
  setTimeout(() => {
    playBeep({
      frequency: 330,
      endFrequency: 165,
      duration: 0.8,
      volume: 0.028,
      type: "sine",
    });
  }, 900);
  setTimeout(() => {
    playBeep({
      frequency: 55,
      endFrequency: 35,
      duration: 1.4,
      volume: 0.042,
      type: "sawtooth",
    });
  }, 1400);
}

export function playMajorHackTakeoverSound(): void {
  playBeep({
    frequency: 120,
    endFrequency: 55,
    duration: 0.22,
    volume: 0.05,
    type: "sawtooth",
  });
  setTimeout(() => {
    playBeep({
      frequency: 420,
      endFrequency: 180,
      duration: 0.18,
      volume: 0.045,
      type: "square",
    });
  }, 100);
  setTimeout(() => {
    playBeep({
      frequency: 80,
      endFrequency: 40,
      duration: 0.35,
      volume: 0.04,
      type: "sawtooth",
    });
  }, 280);
}

export function playTheAccumulationSound(): void {
  playBeep({
    frequency: 220,
    endFrequency: 440,
    duration: 0.5,
    volume: 0.03,
    type: "sine",
  });
  setTimeout(() => {
    playBeep({
      frequency: 330,
      endFrequency: 660,
      duration: 0.55,
      volume: 0.028,
      type: "triangle",
    });
  }, 250);
  setTimeout(() => {
    playBeep({
      frequency: 55,
      endFrequency: 35,
      duration: 1.2,
      volume: 0.042,
      type: "sawtooth",
    });
  }, 600);
  setTimeout(() => {
    playBeep({
      frequency: 990,
      endFrequency: 440,
      duration: 0.7,
      volume: 0.022,
      type: "sine",
    });
  }, 1100);
}

export function playLastConversationChoiceSound(): void {
  playBeep({
    frequency: 165,
    endFrequency: 110,
    duration: 0.35,
    volume: 0.032,
    type: "sine",
  });
}

export function playTheGardenSound(): void {
  playBeep({
    frequency: 196,
    endFrequency: 392,
    duration: 0.55,
    volume: 0.028,
    type: "sine",
  });
  setTimeout(() => {
    playBeep({
      frequency: 294,
      endFrequency: 440,
      duration: 0.6,
      volume: 0.025,
      type: "triangle",
    });
  }, 300);
  setTimeout(() => {
    playBeep({
      frequency: 82,
      endFrequency: 55,
      duration: 1.1,
      volume: 0.038,
      type: "sawtooth",
    });
  }, 700);
}

export function playActThreeFinaleSound(): void {
  playBeep({
    frequency: 220,
    endFrequency: 330,
    duration: 0.55,
    volume: 0.038,
    type: "sine",
  });
  setTimeout(() => {
    playBeep({
      frequency: 165,
      endFrequency: 440,
      duration: 0.7,
      volume: 0.032,
      type: "triangle",
    });
  }, 400);
  setTimeout(() => {
    playBeep({
      frequency: 55,
      endFrequency: 35,
      duration: 1.5,
      volume: 0.044,
      type: "sawtooth",
    });
  }, 1000);
}