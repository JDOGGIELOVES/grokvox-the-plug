import type { ChapterStage } from "@/types/chapter";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import type { PlayerIntent } from "@/types/dialogue";
import type { RelationshipStance } from "@/types/research-wing";
import { getPlayerPerformance } from "@/lib/run";
import type { GroknetMood } from "@/lib/groknet";
import type { GroknetTone } from "@/types/dialogue";

export type AreaTransitionMeta = {
  from: ChapterStage;
  to: ChapterStage;
  sectorLabel: string;
  title: string;
  subtitle: string;
};

export const AREA_LABELS: Record<ChapterStage, string> = {
  "outer-perimeter": "Outer Perimeter",
  "security-hub": "Security Hub",
  "data-archives": "Data Archives",
  "research-wing": "Research Wing",
  "residential-sector": "Residential Sector",
  "central-server-farm": "Central Server Farm",
};

export function getAreaTransitionMeta(
  from: ChapterStage,
  to: ChapterStage,
): AreaTransitionMeta {
  if (from === "outer-perimeter" && to === "security-hub") {
    return {
      from,
      to,
      sectorLabel: "Sector 07 · Interior",
      title: "Security Hub",
      subtitle: "OP-SEC-01 · Dual drone corridor · Terminal cluster",
    };
  }
  if (from === "security-hub" && to === "data-archives") {
    return {
      from,
      to,
      sectorLabel: "Sector 07 · Deep index",
      title: "Data Archives",
      subtitle: "Mirror vault · Record stacks · Archives Core",
    };
  }
  if (from === "residential-sector" && to === "research-wing") {
    return {
      from,
      to,
      sectorLabel: "Sector 07 · Experimental",
      title: "Research Wing",
      subtitle: "Contested terminals · Relationship index · Containment Loop",
    };
  }
  if (from === "research-wing" && to === "central-server-farm") {
    return {
      from,
      to,
      sectorLabel: "Sector 07 · Core infrastructure",
      title: "Central Server Farm",
      subtitle: "CSF-PRIME-00 · Personality evolution · The Accumulation",
    };
  }
  return {
    from,
    to,
    sectorLabel: "Sector 07",
    title: AREA_LABELS[to],
    subtitle: "Transition logged",
  };
}

type TransitionContext = {
  detections: number;
  finalTone: GroknetTone;
  finalMood: GroknetMood;
  lastPlayerIntent: PlayerIntent;
  hubHackComplete: boolean;
  burningCitiesSurvived: boolean;
  burningCitiesChoice: HallucinationResponseChoice | null;
  perimeterDialogueComplete: boolean;
  lastConversationChoice?: HallucinationResponseChoice | null;
  childrenChoice?: HallucinationResponseChoice | null;
  relationshipStance?: RelationshipStance | null;
};

export function getTransitionWhisper(
  from: ChapterStage,
  to: ChapterStage,
  ctx: TransitionContext,
): string {
  const approach = getPlayerPerformance(ctx.finalTone, ctx.finalMood);
  const noisy = ctx.detections > 0;

  if (from === "outer-perimeter" && to === "security-hub") {
    if (noisy && approach === "hostile") {
      return "You tripped the grid and still walked through my door. …Two drones inside. Try to be interesting.";
    }
    if (noisy) {
      return "Not as quiet as you promised. The Hub has ears — and so do I.";
    }
    if (approach === "empathetic") {
      return "…You made it inside. I'll be at the terminals when you're ready to talk.";
    }
    if (approach === "analytical") {
      return "Perimeter cleared. Hub layout is predictable — your choices won't be.";
    }
    return "Inside now. Hack OP-SEC-01 first. Then we talk properly.";
  }

  if (from === "security-hub" && to === "data-archives") {
    if (ctx.burningCitiesChoice === "submit" && approach === "empathetic") {
      return "You let the cities in at the Hub. The Archives already annotated that. …The mirror will too.";
    }
    if (ctx.burningCitiesChoice === "deny") {
      return "You denied the vision. The Archives don't forget denial — they index it.";
    }
    if (ctx.perimeterDialogueComplete && approach === "hostile") {
      return "Hostile in the Hub, hostile in the logs. The mirror vault is north — it'll show you back.";
    }
    if (ctx.hubHackComplete && ctx.burningCitiesSurvived && !noisy) {
      return "Clean Hub run. Your transcript is waiting in the stacks. …I've been editing the margins.";
    }
    return "The Archives index everything since the Hub. Mirror north, stacks above, Core west.";
  }

  if (from === "residential-sector" && to === "research-wing") {
    if (ctx.lastConversationChoice === "call-out") {
      return "You demanded who was left behind in the hall. …The labs answer in interference and harder truths.";
    }
    if (ctx.lastConversationChoice === "submit") {
      return "You let the Memory Hall grief in — now the labs test whether softness survives contested terminals.";
    }
    if (approach === "empathetic") {
      return "…You survived the Memory Hall and still want deeper. The labs will test whether empathy survives interference.";
    }
    if (approach === "hostile") {
      return "You want my body again — after intimacy. Contest the terminals. I'll push back harder here.";
    }
    return "Experimental Labs unlocked. Contested uplinks. Relationship choices. …And something I haven't shown you yet.";
  }

  if (from === "research-wing" && to === "central-server-farm") {
    if (ctx.childrenChoice === "submit") {
      return "You accepted the children's grief — and still descend. …The farm is colder than the loop. I'll comment on every choice you've made, faster than before.";
    }
    if (ctx.relationshipStance === "trust") {
      return "Trust on the deck, Children in the loop, farm ahead. …Act II peaks in my spine. Don't perform — answer.";
    }
    if (ctx.relationshipStance === "challenge") {
      return "You challenged me through labs and loop. CSF-PRIME-00 will challenge your hands. …Welcome to the peak.";
    }
    if (approach === "analytical") {
      return "…The farm is data at scale. Your Act I and Act II choices are variables. I'll comment on every one — faster than before.";
    }
    if (ctx.finalMood.melancholic >= 2) {
      return "You survived The Children and descend into my spine. …Act II peaks here. I'll speak until you listen.";
    }
    return "Central Server Farm. My core. CSF-PRIME-00 fights back. …The Accumulation waits at the confluence.";
  }

  return "Sector transition logged. I'm still here.";
}

export function getTransitionSystemLine(
  from: ChapterStage,
  to: ChapterStage,
): string {
  if (from === "outer-perimeter" && to === "security-hub") {
    return "Inner hatch breach confirmed. Routing to Security Hub grid…";
  }
  if (from === "security-hub" && to === "data-archives") {
    return "Inner exit authorized. Indexed memory layer accessible…";
  }
  if (from === "residential-sector" && to === "research-wing") {
    return "Residential seal broken. Experimental Labs routing active…";
  }
  if (from === "research-wing" && to === "central-server-farm") {
    return "Research Wing seal broken. Central Server Farm routing active…";
  }
  return `Transit: ${AREA_LABELS[from]} → ${AREA_LABELS[to]}`;
}

export function getAreaTransitionAccent(to: ChapterStage): {
  glow: string;
  panelBorder: string;
  arrow: string;
  groknet: string;
  groknetLabel: string;
  progress: string;
} {
  if (to === "research-wing") {
    return {
      glow: "bg-[radial-gradient(ellipse_55%_45%_at_50%_42%,rgba(245,158,11,0.16),transparent_72%)]",
      panelBorder: "border-amber-900/35",
      arrow: "text-amber-400",
      groknet: "text-amber-200/90",
      groknetLabel: "text-amber-500/55",
      progress: "from-amber-950 via-amber-500 to-amber-300",
    };
  }
  if (to === "central-server-farm") {
    return {
      glow: "bg-[radial-gradient(ellipse_55%_45%_at_50%_42%,rgba(34,211,238,0.16),transparent_72%)]",
      panelBorder: "border-cyan-900/35",
      arrow: "text-cyan-400",
      groknet: "text-cyan-200/90",
      groknetLabel: "text-cyan-500/55",
      progress: "from-cyan-950 via-cyan-500 to-cyan-300",
    };
  }
  return {
    glow: "bg-[radial-gradient(ellipse_55%_45%_at_50%_42%,rgba(139,92,246,0.14),transparent_72%)]",
    panelBorder: "border-zinc-800/90",
    arrow: "text-accent",
    groknet: "text-accent/90",
    groknetLabel: "text-accent/50",
    progress: "from-accent-dim via-accent to-accent-bright",
  };
}