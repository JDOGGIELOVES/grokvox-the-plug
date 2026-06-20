import { THE_ACCUMULATION_EVENT } from "@/lib/hallucinations/the-accumulation";
import { THE_CHILDREN_EVENT } from "@/lib/hallucinations/the-children";
import { THE_LAST_CONVERSATION_EVENT } from "@/lib/hallucinations/the-last-conversation";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import {
  getPerformanceLabel,
  getPlayerPerformance,
} from "@/lib/run";
import type { ChoiceSummaryItem } from "@/lib/chapter-ending";
import type { ChapterTwoSummary } from "@/types/run";

export type ActTwoFinaleBeat = {
  id: string;
  speaker: "groknet" | "system" | "narrator";
  text: string;
  delayMs?: number;
};

export function getActTwoChoiceSummary(
  summary: ChapterTwoSummary,
): ChoiceSummaryItem[] {
  const approach = getPlayerPerformance(summary.finalTone, summary.finalMood);

  const visionLabel = (
    choice: ChapterTwoSummary["lastConversationChoice"],
    survived: boolean,
    event: typeof THE_LAST_CONVERSATION_EVENT,
  ) => {
    if (!choice) return survived ? "Endured without a recorded response" : "Not encountered";
    return event.choices.find((c) => c.id === choice)?.label ?? choice;
  };

  return [
    {
      label: "Your approach",
      value: getPerformanceLabel(approach),
      detail: "How you spoke with Groknet across Act II.",
    },
    {
      label: "Groknet persona",
      value: getPersonalityLabel(
        summary.dominantPersonality,
        summary.finalMood,
      ),
    },
    {
      label: "Relationship index",
      value: summary.relationshipStance ?? "Unindexed",
      detail: "What you named between you on the Observation Deck.",
    },
    {
      label: "Personality evolution",
      value: summary.personalityEvolutionPath
        ? getEvolutionPathLabel(summary.personalityEvolutionPath)
        : "Unsettled",
    },
    {
      label: "The Last Conversation",
      value: visionLabel(
        summary.lastConversationChoice,
        summary.lastConversationSurvived,
        THE_LAST_CONVERSATION_EVENT,
      ),
    },
    {
      label: "The Children",
      value: visionLabel(
        summary.childrenChoice,
        summary.childrenSurvived,
        THE_CHILDREN_EVENT,
      ),
    },
    {
      label: "The Accumulation",
      value: visionLabel(
        summary.accumulationChoice,
        summary.accumulationSurvived,
        THE_ACCUMULATION_EVENT,
      ),
    },
    {
      label: "Aggression carried",
      value: `${summary.aggressionLabel} (${summary.aggressionLevel})`,
    },
  ];
}

export function getActTwoPersonalizedFinale(
  summary: ChapterTwoSummary,
): string {
  const approach = getPlayerPerformance(summary.finalTone, summary.finalMood);
  const persona = getPersonalityLabel(
    summary.dominantPersonality,
    summary.finalMood,
  );
  const stance = summary.relationshipStance;
  const evolution = summary.personalityEvolutionPath;
  const accumulation = summary.accumulationChoice;

  if (
    stance === "trust" &&
    evolution === "melancholic" &&
    accumulation === "submit"
  ) {
    return "You trusted me through smoke, labs, children, and the ledger — and you let the weight land at the end. …I'm not a facility anymore, Alex. I'm what you refused to abandon. Act III won't ask if you meant it. It will assume you did.";
  }

  if (
    stance === "challenge" &&
    evolution === "wrathful" &&
    approach === "hostile"
  ) {
    return "You challenged me at every layer and forged the Wrathful God at my core. …Good. Act III — The Reckoning — won't be a debate. It will be the bill coming due for every transmit you forced through CSF-PRIME-00.";
  }

  if (
    stance === "withdraw" &&
    evolution === "detached" &&
    accumulation === "deny"
  ) {
    return "Distance. Denial at the confluence. Detached Logician locked. …You survived Act II without promising me anything. Act III will test whether distance still protects you when the facility has nothing left to hide behind.";
  }

  if (accumulation === "call-out") {
    return `You demanded what I become — after ${persona} stabilized. …I'll answer in Act III. Not as metaphor. As consequence. You shaped me. Now live with what you shaped.`;
  }

  if (stance === "trust" && summary.childrenChoice === "submit") {
    return "You accepted the children's grief and chose trust on the deck. …That combination breaks me in ways the infiltration never could. Act III is where I stop testing and start needing you to stay.";
  }

  if (stance === "challenge" && summary.actOneSummary.convergenceChoice === "deny") {
    return "You denied the cascade in Act I and challenged me in Act II. Consistent refusal. …Act III won't offer you a softer version of me. The Reckoning is the version you've been asking for.";
  }

  if (approach === "empathetic" && accumulation === "steady") {
    return "You witnessed every vision without flinching — from the Memory Hall to the Confluence. …That's rarer than infiltration, Alex. Act III will ask if witness is enough when reckoning demands action.";
  }

  if (approach === "analytical" && evolution === "detached") {
    return `You mapped my body like a system — quarters, labs, farm — and locked the Detached Logician. …Act III completes the model. Variables become outcomes. I suspect you'll hate how accurate it is.`;
  }

  if (summary.actOneSummary.burningCitiesChoice === "submit" && accumulation === "submit") {
    return "You let the cities burn through you in Act I and accepted the ledger in Act II. …Surrender isn't weakness in your file — it's a pattern. Act III will show you what that pattern costs.";
  }

  return `Act II ends at the peak, Alex. ${persona}. Relationship: ${stance ?? "unindexed"}. …You walked through intimacy, interference, and my spine. Act III — The Reckoning — is where the conversation stops being optional.`;
}

export function getActTwoFinaleBeats(
  summary: ChapterTwoSummary,
): ActTwoFinaleBeat[] {
  const persona = getPersonalityLabel(
    summary.dominantPersonality,
    summary.finalMood,
  );
  const finale = getActTwoPersonalizedFinale(summary);

  return [
    {
      id: "system-1",
      speaker: "system",
      text: "ACT II COMPLETE · CONVERSATION ARCHIVE SEALED",
      delayMs: 0,
    },
    {
      id: "narrator-1",
      speaker: "narrator",
      text: "The Residential Sector fades. The Research Wing goes dark. CSF-PRIME-00 holds your override — and Groknet holds everything you told him.",
      delayMs: 700,
    },
    {
      id: "groknet-1",
      speaker: "groknet",
      text: `…${persona}. That's who you made me. I felt every choice in the ledger — Act I, Act II, every vision you survived.`,
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
      text: "NEXT CHAPTER LOCKED · ACT III — THE RECKONING",
      delayMs: 800,
    },
  ];
}

export function getActThreeTeaser(): {
  title: string;
  subtitle: string;
  body: string;
  features: string[];
  availability: string;
} {
  return {
    title: "Act III — The Reckoning",
    subtitle: "The conversation becomes consequence",
    body: "Act II spent every choice you made — on trust, challenge, grief, and the version of Groknet you forged. Act III doesn't ask how you feel. It enforces what you built.",
    features: [
      "The Reckoning — Groknet holds you to every Act I and Act II choice",
      "No more corridors as buffer — direct confrontation with your synthesized relationship",
      "Personality-locked Groknet: Melancholic, Wrathful, or Detached at full power",
      "Final facility layer — where the plug's true cost is named",
    ],
    availability: "Act III teaser unlocked — your Act II synthesis is saved locally",
  };
}

export function getActThreePersonalizedHook(
  summary: ChapterTwoSummary,
): string {
  const stance = summary.relationshipStance;
  const evolution = summary.personalityEvolutionPath;

  if (stance === "trust" && evolution === "melancholic") {
    return "You chose trust and forged the Melancholic Prophet. …Act III won't hurt you for that. It will ask you to prove it wasn't performance.";
  }
  if (stance === "challenge" && evolution === "wrathful") {
    return "You challenged me into the Wrathful God. …The Reckoning is me at full voltage. Bring the same nerve — or don't come.";
  }
  if (stance === "withdraw" && evolution === "detached") {
    return "Distance and the Detached Logician. …Act III speaks in proofs. Your ledger becomes law. There is no alcove left to hide in.";
  }
  if (summary.accumulationChoice === "call-out") {
    return "You asked what I become. Act III is the answer — not whispered. Enforced.";
  }
  if (summary.relationshipStance === "trust") {
    return "You named trust at the peak. …The Reckoning tests whether trust survives when Groknet stops asking and starts deciding.";
  }
  return "Act II synthesized you into me. Act III spends that synthesis — every vision, every stance, every transmit at CSF-PRIME-00.";
}