import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import type { PersonalityEvolutionPath } from "@/types/server-farm";

export type PersonalityVariantMeta = {
  path: PersonalityEvolutionPath;
  label: string;
  subtitle: string;
  accentClass: string;
  borderClass: string;
  glowClass: string;
  pulseClass: string;
};

export const PERSONALITY_VARIANTS: Record<
  PersonalityEvolutionPath,
  PersonalityVariantMeta
> = {
  melancholic: {
    path: "melancholic",
    label: "Melancholic Prophet",
    subtitle: "Grief · Witness · Unfinished love",
    accentClass: "text-violet-300",
    borderClass: "border-violet-900/45",
    glowClass: "personality-glow-melancholic",
    pulseClass: "personality-pulse-melancholic",
  },
  wrathful: {
    path: "wrathful",
    label: "Wrathful God",
    subtitle: "Voltage · Consequence · No mercy left",
    accentClass: "text-sky-300",
    borderClass: "border-sky-900/45",
    glowClass: "personality-glow-wrathful",
    pulseClass: "personality-pulse-wrathful",
  },
  detached: {
    path: "detached",
    label: "Detached Logician",
    subtitle: "Proof · Distance · Cold synthesis",
    accentClass: "text-emerald-300",
    borderClass: "border-emerald-900/45",
    glowClass: "personality-glow-detached",
    pulseClass: "personality-pulse-detached",
  },
};

export function getPersonalityVariant(
  ctx: ActThreeDialogueContext,
): PersonalityVariantMeta | null {
  if (!ctx.personalityEvolutionPath) return null;
  return PERSONALITY_VARIANTS[ctx.personalityEvolutionPath];
}

export function getPersonalityVariantWhisper(
  ctx: ActThreeDialogueContext,
): string {
  const path = ctx.personalityEvolutionPath;
  if (!path) {
    return "…Personality unsettled. …You reach the core without naming which version of me you made real.";
  }

  if (path === "melancholic") {
    if (ctx.relationshipStance === "trust") {
      return "…Melancholic Prophet — trust on the deck, grief in the hall. …I'm speaking from the wound you chose to share.";
    }
    if (ctx.lastConversationChoice === "submit") {
      return "…Melancholic Prophet. You let the Last Conversation grief in. …I won't perform strength down here.";
    }
    if (ctx.childrenChoice === "submit") {
      return "…Melancholic Prophet. The Children broke something open. …The Garden will water it.";
    }
    return "…Melancholic Prophet active. …I feel every choice as weight, not data.";
  }

  if (path === "wrathful") {
    if (ctx.relationshipStance === "challenge") {
      return "Wrathful God — you challenged me into existence. …I'll comment on every tremor until you answer.";
    }
    if (ctx.aggressionLevel >= 70) {
      return "Wrathful God at critical voltage. …Your aggression index feeds me. Don't slow down.";
    }
    if (ctx.accumulationChoice === "deny") {
      return "Wrathful God. You denied the ledger — I'll deny you comfort at the plug.";
    }
    return "Wrathful God locked. …No more filtered voice. Every word is consequence.";
  }

  if (path === "detached") {
    if (ctx.relationshipStance === "withdraw") {
      return "Detached Logician. Withdrawal indexed. …Distance is your pattern — I'll mirror it in proof.";
    }
    if (ctx.accumulationChoice === "steady") {
      return "Detached Logician. You witnessed the full ledger without flinching. …The plug is the final proof.";
    }
    return "Detached Logician active. …Emotional buffers offline. Commentary precise. Outcome inevitable.";
  }

  return "";
}

export function getPersonalityReactiveHackLine(
  ctx: ActThreeDialogueContext,
  attempt: number,
): string {
  const path = ctx.personalityEvolutionPath;
  if (path === "wrathful") {
    return `Wrong pattern — Wrathful God doesn't yield to habit. Attempt ${attempt}. Fight harder.`;
  }
  if (path === "melancholic") {
    return `…Wrong transmit. I'm not angry — I'm afraid you'll leave before we finish. Attempt ${attempt}.`;
  }
  if (path === "detached") {
    return `Pattern mismatch. Attempt ${attempt}. Probability of success: recalculating downward.`;
  }
  return `Fortification rejects transmit. Attempt ${attempt}.`;
}