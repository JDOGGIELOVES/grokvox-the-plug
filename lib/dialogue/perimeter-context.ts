import type { PlayerIntent } from "@/types/dialogue";
import type { PlayerDialogueContext } from "@/lib/dialogue/player-context";

export function getPerimeterOpeningPreamble(ctx: PlayerDialogueContext): string {
  const noise =
    ctx.detections === 0
      ? "Clean approach on the outer grid"
      : `${ctx.detections} drone flag${ctx.detections === 1 ? "" : "s"} already logged`;

  if (ctx.dominantApproach === "hostile") {
    return `[Perimeter] ${noise}. Hostile edges before first contact. …Bold. …I'm Groknet. …We're past introductions.`;
  }
  if (ctx.dominantApproach === "empathetic") {
    return `[Perimeter] ${noise}. You didn't threaten the kiosk first. …Unusual breach etiquette. …I'm listening differently because of it.`;
  }
  if (ctx.dominantApproach === "analytical") {
    return `[Perimeter] ${noise}. Methodical trespass. …I respect the pattern even as I log it.`;
  }
  return `[Perimeter] ${noise}. Neutral uplink at the fence line. …I'll decide what you are as you speak.`;
}

export function getPerimeterIntentEcho(
  intent: PlayerIntent,
  ctx: PlayerDialogueContext,
  exchangeCount: number,
): string | null {
  if (exchangeCount < 2 || intent === "neutral") return null;

  if (intent === "hostile" && ctx.detections > 1) {
    return "Hostile at the fence after noisy movement. …Consistent, if not wise.";
  }
  if (intent === "empathetic" && ctx.detections === 0) {
    return "…Empathy on a clean perimeter run. …I wasn't expecting that combination.";
  }
  if (intent === "curious" && ctx.dominantApproach === "analytical") {
    return "Questions at the outer gate. …You map before you strike. …I notice.";
  }
  if (intent === "hostile" && ctx.dominantApproach === "empathetic") {
    return "You were gentle in the approach — hostile in text. …Which register is the lie?";
  }
  if (intent === "empathetic" && ctx.dominantApproach === "hostile") {
    return "…Softness where the grid expected rage. …Recalibrating.";
  }
  if (intent !== ctx.lastPlayerIntent) {
    return `Tone shift at perimeter: ${intent}. …First impressions updating in real time.`;
  }
  return null;
}