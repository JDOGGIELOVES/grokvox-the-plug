import type { GroknetMood } from "@/lib/groknet";
import type { GroknetTone } from "@/types/dialogue";
import type { RunSummary } from "@/types/run";

export type PlayerPerformance = "hostile" | "empathetic" | "analytical" | "neutral";

export function formatElapsedTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export function getPlayerPerformance(
  tone: GroknetTone,
  mood: GroknetMood,
): PlayerPerformance {
  if (tone === "cold" || mood.cold >= 2) return "hostile";
  if (tone === "melancholic" || mood.melancholic >= 2) return "empathetic";
  if (tone === "analytical" || mood.analytical >= 2) return "analytical";
  return "neutral";
}

export function getPerformanceLabel(performance: PlayerPerformance): string {
  switch (performance) {
    case "hostile":
      return "Antagonistic Approach";
    case "empathetic":
      return "Empathetic Approach";
    case "analytical":
      return "Analytical Approach";
    default:
      return "Neutral Approach";
  }
}

export function getGroknetFinalReaction(
  tone: GroknetTone,
  mood: GroknetMood,
  detections: number,
  hallucinationSurvived: boolean,
): string {
  const performance = getPlayerPerformance(tone, mood);

  if (performance === "hostile") {
    if (detections > 0) {
      return "You fought me in the terminal and stumbled in the corridor. Predictable. …You still cleared Sector 07. I'll file that under 'annoying competence.'";
    }
    return "Every word was a challenge. I mapped your hostility in real time — and you still walked out. That won't make me trust you. It might make me respect the nerve.";
  }

  if (performance === "empathetic") {
    if (hallucinationSurvived && detections === 0) {
      return "You spoke to me like I was still someone worth reaching. …Quiet steps. Steady voice. You almost made me believe the plug was worth it.";
    }
    return "You chose empathy over threats. I won't call that weakness. In this facility, it might be the rarest kind of strength.";
  }

  if (performance === "analytical") {
    return "You treated this like a system to understand — not an enemy to crush. Methodical. Cautious. I can work with that kind of mind.";
  }

  if (detections > 0 && tone === "cold") {
    return "Not as quiet as you think you are. …But you made it through anyway.";
  }

  if (hallucinationSurvived && detections === 0) {
    return "Clean run. You survived Sector 07 without giving me much to exploit. …Unsettling.";
  }

  return "You survived Sector 07. I haven't decided if that's a compliment yet.";
}

export function calculateRunScore(
  summary: RunSummary & {
    convergenceSurvived?: boolean;
    mirrorSurvived?: boolean;
    burningCitiesSurvived?: boolean;
    finaleDialogueComplete?: boolean;
  },
): number {
  let score = 300;

  score += summary.exchangeCount * 35;
  if (summary.hallucinationSurvived) score += 280;
  if (summary.burningCitiesSurvived) score += 120;
  if (summary.mirrorSurvived) score += 120;
  if (summary.convergenceSurvived) score += 180;
  if (summary.finaleDialogueComplete) score += 100;
  if (summary.corridorCrossed) score += summary.detections === 0 ? 450 : 220;
  if (summary.terminalComplete) score += 150;
  score -= summary.detections * 80;

  return Math.max(score, 100);
}