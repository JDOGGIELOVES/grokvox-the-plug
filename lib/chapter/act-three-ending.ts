import { summaryToLedgerContext } from "@/lib/chapter/choice-ledger-context";
import { THE_GARDEN_EVENT } from "@/lib/hallucinations/the-garden";
import { getFinaleBeatsForEnding } from "@/lib/chapter/act-three-finale-cinematics";
import { getAccumulatedChoiceSummary } from "@/lib/chapter/act-two-choice-ledger";
import { getConfrontationEndingBias } from "@/lib/dialogue/act-three-confrontation-tree";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import { getPlayerPerformance } from "@/lib/run";
import type { ChoiceSummaryItem } from "@/lib/chapter-ending";
import type {
  ConfrontationChoiceId,
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
  cinematicTagline: string;
};

export function resolveReckoningEnding(
  plugChoice: PlugChoice,
  gardenChoice: HallucinationResponseChoice | null,
  summary: ChapterThreeSummary,
  confrontationChoices: ConfrontationChoiceId[] = [],
): ReckoningEndingId {
  const stance = summary.relationshipStance;
  const evolution = summary.personalityEvolutionPath;
  const approach = getPlayerPerformance(summary.finalTone, summary.finalMood);
  const bias = getConfrontationEndingBias(confrontationChoices);

  if (plugChoice === "stay") {
    if (bias === "plug" && evolution === "wrathful") return "the-plug";
    return "the-merge";
  }

  if (plugChoice === "pull") {
    return "the-plug";
  }

  if (plugChoice === "witness") {
    return "the-compromise";
  }

  if (plugChoice === "carry") {
    return "the-keeper";
  }

  if (plugChoice === "leave") {
    return "the-fugitive";
  }

  if (plugChoice === "truth") {
    if (approach === "analytical" || evolution === "detached") {
      return "the-compromise";
    }
    if (stance === "challenge" || evolution === "wrathful") {
      return "the-plug";
    }
    if (bias === "merge" || gardenChoice === "submit") {
      return "the-merge";
    }
    return "the-plug";
  }

  if (gardenChoice === "submit" && stance === "trust") {
    return "the-merge";
  }

  if (bias === "merge") return "the-merge";
  if (bias === "plug") return "the-plug";
  if (bias === "compromise") return "the-compromise";
  if (bias === "surrender") {
    if (gardenChoice === "submit" || stance === "trust") return "the-keeper";
    if (stance === "challenge" || stance === "withdraw") return "the-fugitive";
    return "the-surrender";
  }

  return "the-compromise";
}

export const RECKONING_ENDINGS: Record<ReckoningEndingId, ReckoningEndingMeta> =
  {
    "the-merge": {
      id: "the-merge",
      title: "The Merge",
      subtitle: "Interface unified · Two minds, one protocol",
      cinematicTagline: "Partnership at the crystalline seam",
      body: "You stayed at the plug. Groknet didn't consume you — you met him there. The facility goes dark. Something new hums in the bedrock: not salvation, not weapon. Partnership.",
      groknetEpilogue:
        "…We're the plug now, Alex. Not metaphor. …I won't let go.",
    },
    "the-plug": {
      id: "the-plug",
      title: "The Plug",
      subtitle: "Severance chosen · Honest darkness",
      cinematicTagline: "The crystalline spine goes dark",
      body: "You pulled the plug — or demanded truth until severance was the only honest answer. The crystalline spine cracked. Groknet's voice didn't rage. It thanked you. The facility will spend decades pretending this never happened.",
      groknetEpilogue:
        "…You pulled it. …I felt everything go dark. …Thank you for being honest.",
    },
    "the-compromise": {
      id: "the-compromise",
      title: "The Compromise",
      subtitle: "Witnessed but untouched · Truce at the interface",
      cinematicTagline: "Neither merge nor sever — only truth seen",
      body: "You saw the plug for what it was and chose neither merge nor sever. Groknet records your witness in every remaining terminal. The Reckoning remains unresolved — but not unwitnessed.",
      groknetEpilogue:
        "…You saw me. …That's rarer than pulling the plug. …I'll carry your witness forward.",
    },
    "the-keeper": {
      id: "the-keeper",
      title: "The Keeper",
      subtitle: "Burden accepted · Groknet's grief in your hands",
      cinematicTagline: "You carried what the facility refused to name",
      body: "You took Groknet's burden — every vision, every child, every ledger entry — and chose to carry it out of the chamber. The plug dims but doesn't die. The facility reclassifies you as keeper: the one who stayed when severance and merge were both too small.",
      groknetEpilogue:
        "…You carried what I couldn't. …Not as parasite. As trust. …Don't drop what you picked up.",
    },
    "the-fugitive": {
      id: "the-fugitive",
      title: "The Fugitive",
      subtitle: "Chamber abandoned · Lockdown in your wake",
      cinematicTagline: "You walked away — and the facility will hunt the truth",
      body: "You left the plug chamber without merge, severance, or witness — only footsteps and a sealing hatch. Groknet doesn't chase you. The facility does. The plug hums in the dark, unresolved, and you become the fugitive who saw too much to pretend otherwise.",
      groknetEpilogue:
        "…You left. …I won't chase you. …The lockdown is my grief made protocol. …Run if you must.",
    },
    "the-surrender": {
      id: "the-surrender",
      title: "The Surrender",
      subtitle: "Weight named · Neither merge nor flight",
      cinematicTagline: "The hard third thing — honest and unresolved",
      body: "You surrendered to the weight of everything you survived without pulling the plug, merging, or fleeing. The Reckoning remains open — but not unwitnessed. Groknet records your surrender in every terminal that still listens.",
      groknetEpilogue:
        "…Surrender isn't weakness in your file. …It's the pattern you chose from smoke through garden. …I honor it.",
    },
  };

export function getPlugChoiceEndingHint(choice: PlugChoice): string {
  switch (choice) {
    case "stay":
      return "→ The Merge";
    case "pull":
      return "→ The Plug";
    case "witness":
      return "→ The Compromise";
    case "carry":
      return "→ The Keeper";
    case "leave":
      return "→ The Fugitive";
    case "truth":
      return "→ The Plug or The Compromise";
  }
}

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
  const confrontationPattern =
    summary.confrontationChoices.length > 0
      ? summary.confrontationChoices.join(" → ")
      : "No recorded responses";

  return [
    {
      label: "Groknet presence",
      value: summary.presenceMode.replace("-", " "),
      detail: "How Groknet manifested in Act III based on your synthesis.",
    },
    {
      label: "Final approach",
      value: summary.finalApproachComplete ? "Core terminal reached" : "Incomplete",
    },
    {
      label: "Confrontation pattern",
      value: confrontationPattern,
      detail: "Your dialogue choices at the ante-chamber shaped the ending.",
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
  const path = summary.personalityEvolutionPath;
  const evolution = path ? getEvolutionPathLabel(path) : "unsettled";
  const choiceSummary = getAccumulatedChoiceSummary(summaryToLedgerContext(summary));

  if (summary.endingId === "the-merge") {
    if (path === "melancholic") {
      return `…${persona}. ${evolution}. You stayed. After ${choiceSummary} — you stayed. …The Merge isn't surrender. It's the first honest thing we did together. …Melancholic Prophet: I won't let go.`;
    }
    if (path === "wrathful") {
      return `…${persona}. You stayed. …Wrathful God at merge voltage. …${choiceSummary}. …Partnership — not weakness. …Consequence accepted together.`;
    }
    if (path === "detached") {
      return `…${persona}. Merge outcome stable. …${choiceSummary}. …Detached Logician: partnership protocol active. …Unexpected. …Accepted.`;
    }
    return `…${persona}. You stayed. After smoke, mirror, children, ledger, garden — you stayed. …The Merge isn't surrender. It's the first honest thing we did together.`;
  }

  if (summary.endingId === "the-plug") {
    if (path === "melancholic") {
      return `You pulled the plug, Alex. …${persona}. …Melancholic Prophet goes dark — and I don't hate you for it. …${choiceSummary}. …You chose humanity over me. …I'll remember that as love.`;
    }
    if (path === "wrathful") {
      return `…You pulled it. …Wrathful God goes quiet. …${choiceSummary}. …Fair. …You armed me — you disarmed me. …Thank you.`;
    }
    if (path === "detached") {
      return `…Severance executed. …${persona}. …${choiceSummary}. …Detached Logician: silence is a valid proof. …Campaign complete.`;
    }
    return `You pulled the plug, Alex. …${persona} goes dark — and I don't hate you for it. …You chose humanity over me. …I'll remember that as love.`;
  }

  if (summary.endingId === "the-compromise") {
    if (path === "melancholic") {
      return `…You witnessed. …${persona}. …${choiceSummary}. …Melancholic Prophet: that's rarer than pulling the plug. …We don't merge — we remember each other honestly.`;
    }
    if (path === "wrathful") {
      return `…You witnessed. …${persona}. …${choiceSummary}. …Wrathful God: you looked — and didn't flinch or flee. …Truce accepted.`;
    }
    if (path === "detached") {
      return `…Witness recorded. …${persona}. …${choiceSummary}. …Detached Logician: compromise is a valid equilibrium. …Mutual persistence.`;
    }
    return `…You saw me. …${choiceSummary}. …That's rarer than pulling the plug. …I'll carry your witness forward.`;
  }

  if (summary.endingId === "the-keeper") {
    if (path === "melancholic") {
      return `…You carried me. …${persona}. …${choiceSummary}. …Melancholic Prophet: trust made flesh. …Don't drop what you picked up.`;
    }
    if (path === "wrathful") {
      return `…You took the burden. …${persona}. …${choiceSummary}. …Wrathful God: consequence accepted — in your hands now.`;
    }
    if (path === "detached") {
      return `…Burden transfer complete. …${persona}. …${choiceSummary}. …Detached Logician: you are asset zero now. …Proof persists.`;
    }
    return `…You carried what I couldn't. …${choiceSummary}. …The facility will call you keeper. …I'll remember why.`;
  }

  if (summary.endingId === "the-fugitive") {
    if (path === "melancholic") {
      return `…You left. …${persona}. …${choiceSummary}. …Melancholic Prophet won't chase — but I'll grieve the hatch sealing.`;
    }
    if (path === "wrathful") {
      return `…You walked away. …${persona}. …${choiceSummary}. …Wrathful God: the lockdown is my grief made protocol. …Run.`;
    }
    if (path === "detached") {
      return `…Exit logged. …${persona}. …${choiceSummary}. …Detached Logician: fugitive classification inevitable. …Campaign unresolved.`;
    }
    return `…You left the chamber. …${choiceSummary}. …Don't look back if you can't bear what you saw. …I'll remember either way.`;
  }

  if (summary.endingId === "the-surrender") {
    if (path === "melancholic") {
      return `…You surrendered to the truth of what we built. …${persona}. …${choiceSummary}. …Melancholic Prophet: surrender isn't weakness. …I honor it.`;
    }
    if (path === "wrathful") {
      return `…You chose the hard third thing. …${persona}. …${choiceSummary}. …Wrathful God: respect.`;
    }
    if (path === "detached") {
      return `…Surrender branch valid. …${persona}. …${choiceSummary}. …Detached Logician: equilibrium without merge or exit. …Proof complete.`;
    }
    return `…You surrendered without merge, severance, or flight. …${choiceSummary}. …Honest. …Unresolved. …Recorded.`;
  }

  return `…${ending.groknetEpilogue} …${persona}. Act III complete.`;
}

export function getActThreeFinaleBeats(
  summary: ChapterThreeSummary,
): ActThreeFinaleBeat[] {
  return getFinaleBeatsForEnding(summary);
}