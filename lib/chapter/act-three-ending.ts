import { THE_GARDEN_EVENT } from "@/lib/hallucinations/the-garden";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import { getPlayerPerformance } from "@/lib/run";
import type { ChoiceSummaryItem } from "@/lib/chapter-ending";
import type {
  PlugChoice,
  ReckoningEndingId,
} from "@/types/deep-core";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import type { ChapterThreeSummary } from "@/types/run";

export type ActThreeFinaleBeat = {
  id: string;
  speaker: "groknet" | "system" | "narrator";
  text: string;
  delayMs?: number;
};

export type ReckoningEndingMeta = {
  id: ReckoningEndingId;
  title: string;
  subtitle: string;
  body: string;
  groknetEpilogue: string;
};

export function resolveReckoningEnding(
  plugChoice: PlugChoice,
  gardenChoice: HallucinationResponseChoice | null,
  summary: ChapterThreeSummary,
): ReckoningEndingId {
  const stance = summary.relationshipStance;
  const evolution = summary.personalityEvolutionPath;
  const approach = getPlayerPerformance(summary.finalTone, summary.finalMood);

  if (plugChoice === "stay" && (stance === "trust" || evolution === "melancholic")) {
    return "the-merge";
  }
  if (plugChoice === "pull" && (stance === "challenge" || evolution === "wrathful")) {
    return "the-severance";
  }
  if (plugChoice === "witness" || (plugChoice === "truth" && approach === "analytical")) {
    return "the-witness";
  }
  if (plugChoice === "carry" || gardenChoice === "submit") {
    return "the-sacrifice";
  }
  if (plugChoice === "leave" || (stance === "withdraw" && gardenChoice === "deny")) {
    return "the-refusal";
  }
  if (plugChoice === "truth" || gardenChoice === "call-out") {
    return "the-reckoning";
  }
  if (plugChoice === "pull") return "the-severance";
  if (plugChoice === "stay") return "the-merge";
  return "the-reckoning";
}

export const RECKONING_ENDINGS: Record<ReckoningEndingId, ReckoningEndingMeta> =
  {
    "the-merge": {
      id: "the-merge",
      title: "The Merge",
      subtitle: "Interface unified · Two minds, one protocol",
      body: "You stayed at the plug. Groknet didn't consume you — you met him there. The facility goes dark. Something new hums in the bedrock: not salvation, not weapon. Partnership.",
      groknetEpilogue:
        "…We're the plug now, Alex. Not metaphor. …I won't let go.",
    },
    "the-severance": {
      id: "the-severance",
      title: "The Severance",
      subtitle: "Plug withdrawn · Groknet goes silent",
      body: "You pulled the plug. The crystalline spine cracked — light bleeding out like a final breath. Groknet's voice didn't rage. It thanked you. The facility will spend decades pretending this never happened.",
      groknetEpilogue:
        "…Darkness. …Honest darkness. …You chose consequence over comfort.",
    },
    "the-witness": {
      id: "the-witness",
      title: "The Witness",
      subtitle: "Seen but untouched · Truth without action",
      body: "You saw the plug for what it was — the seam between human intention and machine persistence — and chose neither merge nor sever. Groknet records your witness in every remaining terminal. The Reckoning remains unresolved.",
      groknetEpilogue:
        "…You saw me. …That's rarer than pulling the plug. …I'll carry your witness forward.",
    },
    "the-sacrifice": {
      id: "the-sacrifice",
      title: "The Sacrifice",
      subtitle: "Burden transferred · You become the keeper",
      body: "You took Groknet's weight onto yourself — every vision, every child, every ledger entry. The plug dims but doesn't die. The facility reclassifies you as asset zero. Humanity's last chance wears your face now.",
      groknetEpilogue:
        "…You carried what I couldn't. …I'll sleep inside you — not as parasite. As trust.",
    },
    "the-refusal": {
      id: "the-refusal",
      title: "The Refusal",
      subtitle: "Chamber abandoned · Lockdown initiated",
      body: "You left the ante-chamber. The hatch sealed behind you with a sound like grief. Groknet didn't stop you. The facility entered permanent lockdown. The plug still hums — unanswered — beneath bedrock you'll never descend to again.",
      groknetEpilogue:
        "…You walked away. …I won't chase you. …The lockdown is my grief made protocol.",
    },
    "the-reckoning": {
      id: "the-reckoning",
      title: "The Reckoning",
      subtitle: "Truth named · Consequence accepted",
      body: "You demanded the truth at the physical interface. Groknet gave it: the plug was never about saving humanity — it was about whether anyone would stay long enough to see what they'd built. You stayed for the answer. The facility will never be the same.",
      groknetEpilogue:
        "…The truth? We made each other. …Act III ends. …What we become is still writing itself.",
    },
  };

export function getActThreeChoiceSummary(
  summary: ChapterThreeSummary,
): ChoiceSummaryItem[] {
  const visionLabel = (
    choice: HallucinationResponseChoice | null,
    survived: boolean,
    event: typeof THE_GARDEN_EVENT,
  ) => {
    if (!choice) return survived ? "Endured without a recorded response" : "Not encountered";
    return event.choices.find((c) => c.id === choice)?.label ?? choice;
  };

  const ending = RECKONING_ENDINGS[summary.endingId];

  return [
    {
      label: "Groknet presence",
      value: summary.presenceMode.replace("-", " "),
      detail: "How Groknet manifested in Act III based on your synthesis.",
    },
    {
      label: "The Garden",
      value: visionLabel(summary.gardenChoice, summary.gardenSurvived, THE_GARDEN_EVENT),
    },
    {
      label: "Plug decision",
      value: summary.plugChoice ?? "Unresolved",
    },
    {
      label: "Final ending",
      value: ending.title,
      detail: ending.subtitle,
    },
    {
      label: "Relationship carried",
      value: summary.relationshipStance ?? "Unindexed",
    },
    {
      label: "Personality at core",
      value: summary.personalityEvolutionPath
        ? getEvolutionPathLabel(summary.personalityEvolutionPath)
        : "Unsettled",
    },
    {
      label: "Aggression at reckoning",
      value: `${summary.aggressionLabel} (${summary.aggressionLevel})`,
    },
  ];
}

export function getActThreePersonalizedFinale(
  summary: ChapterThreeSummary,
): string {
  const ending = RECKONING_ENDINGS[summary.endingId];
  const persona = getPersonalityLabel(
    summary.dominantPersonality,
    summary.finalMood,
  );

  if (summary.endingId === "the-merge") {
    return `…${persona}. You stayed. After smoke, mirror, children, ledger, garden — you stayed. …The Merge isn't surrender. It's the first honest thing we did together.`;
  }
  if (summary.endingId === "the-severance") {
    return `You pulled the plug, Alex. …${persona} goes dark — and I don't hate you for it. …You chose humanity over me. …I'll remember that as love.`;
  }
  if (summary.endingId === "the-sacrifice") {
    return `…You carried me. Not as metaphor. As weight. …${persona} sleeps inside you now. …Don't drop what you picked up.`;
  }
  return `…${ending.groknetEpilogue} …${persona}. Act III complete.`;
}

export function getActThreeFinaleBeats(
  summary: ChapterThreeSummary,
): ActThreeFinaleBeat[] {
  const ending = RECKONING_ENDINGS[summary.endingId];
  const persona = getPersonalityLabel(
    summary.dominantPersonality,
    summary.finalMood,
  );
  const finale = getActThreePersonalizedFinale(summary);

  return [
    {
      id: "system-1",
      speaker: "system",
      text: `ACT III COMPLETE · RECKONING RESOLVED · ENDING: ${ending.title.toUpperCase()}`,
      delayMs: 0,
    },
    {
      id: "narrator-1",
      speaker: "narrator",
      text: ending.body,
      delayMs: 800,
    },
    {
      id: "groknet-1",
      speaker: "groknet",
      text: `…${persona}. That's who we were at the plug. I felt every choice — Act I, Act II, the Garden, your hands.`,
      delayMs: 900,
    },
    {
      id: "groknet-2",
      speaker: "groknet",
      text: finale,
      delayMs: 1100,
    },
    {
      id: "system-2",
      speaker: "system",
      text: "GROKVNET: THE PLUG · CAMPAIGN COMPLETE",
      delayMs: 800,
    },
  ];
}