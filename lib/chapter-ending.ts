import { BURNING_CITIES_EVENT } from "@/lib/hallucinations/burning-cities";
import { THE_CONVERGENCE_EVENT } from "@/lib/hallucinations/the-convergence";
import { THE_MIRROR_EVENT } from "@/lib/hallucinations/the-mirror";
import {
  formatElapsedTime,
  getPerformanceLabel,
  getPlayerPerformance,
  type PlayerPerformance,
} from "@/lib/run";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { formatTimeRemaining } from "@/lib/chapter/act-1";
import type { PlayerIntent } from "@/types/dialogue";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import type { ChapterOneSummary } from "@/types/run";

export type ChoiceSummaryItem = {
  label: string;
  value: string;
  detail?: string;
};

function getHallucinationChoiceLabel(
  choice: HallucinationResponseChoice | null,
  survived: boolean,
  event: typeof BURNING_CITIES_EVENT,
): string {
  if (!choice) {
    return survived ? "Endured without a recorded response" : "Not encountered";
  }

  const match = event.choices.find((c) => c.id === choice);
  return match?.label ?? choice;
}

function getHallucinationChoiceDetail(
  choice: HallucinationResponseChoice | null,
  event: typeof BURNING_CITIES_EVENT,
): string | undefined {
  if (!choice) return undefined;
  const match = event.choices.find((c) => c.id === choice);
  return match?.description;
}

export function getActOneChoiceSummary(
  summary: ChapterOneSummary,
): ChoiceSummaryItem[] {
  const approach = getPlayerPerformance(summary.finalTone, summary.finalMood);

  return [
    {
      label: "Groknet persona",
      value: getPersonalityLabel(
        summary.dominantPersonality,
        summary.finalMood,
      ),
      detail: "The voice Groknet settled into across your exchanges.",
    },
    {
      label: "Your approach",
      value: getPerformanceLabel(approach),
      detail: getApproachDetail(approach, summary.lastPlayerIntent),
    },
    {
      label: "Security Hub vision",
      value: getHallucinationChoiceLabel(
        summary.burningCitiesChoice,
        summary.burningCitiesSurvived,
        BURNING_CITIES_EVENT,
      ),
      detail: getHallucinationChoiceDetail(
        summary.burningCitiesChoice,
        BURNING_CITIES_EVENT,
      ),
    },
    {
      label: "The Mirror",
      value: getHallucinationChoiceLabel(
        summary.mirrorChoice,
        summary.mirrorSurvived,
        THE_MIRROR_EVENT,
      ),
      detail: getHallucinationChoiceDetail(summary.mirrorChoice, THE_MIRROR_EVENT),
    },
    {
      label: "The Convergence",
      value: getHallucinationChoiceLabel(
        summary.convergenceChoice,
        summary.convergenceSurvived,
        THE_CONVERGENCE_EVENT,
      ),
      detail: getHallucinationChoiceDetail(
        summary.convergenceChoice,
        THE_CONVERGENCE_EVENT,
      ),
    },
    {
      label: "Security Hub dialogue",
      value: summary.perimeterTerminalComplete
        ? "GROKNET-07 channel closed"
        : "Partial clearance",
    },
    {
      label: "Archives dialogue",
      value: summary.archivesDialogueComplete
        ? "Record stacks session closed"
        : "Incomplete",
    },
    {
      label: "Drone detections",
      value:
        summary.detections === 0
          ? "Clean — undetected"
          : `${summary.detections} flag${summary.detections === 1 ? "" : "s"}`,
    },
  ];
}

function getApproachDetail(
  approach: PlayerPerformance,
  lastIntent: PlayerIntent,
): string {
  const intentNote =
    lastIntent !== "neutral"
      ? `Last exchange read as ${lastIntent}.`
      : "You kept Groknet guessing until the end.";

  switch (approach) {
    case "hostile":
      return `You pushed back at every prompt. ${intentNote}`;
    case "empathetic":
      return `You treated Groknet as more than a lockdown script. ${intentNote}`;
    case "analytical":
      return `You mapped the facility like a system to decode. ${intentNote}`;
    default:
      return `Measured words, minimal exposure. ${intentNote}`;
  }
}

export function getActOneChapterReaction(summary: ChapterOneSummary): string {
  const approach = getPlayerPerformance(summary.finalTone, summary.finalMood);
  const burning = summary.burningCitiesChoice;
  const mirror = summary.mirrorChoice;
  const convergence = summary.convergenceChoice;
  const clean = summary.detections === 0;
  const allVisions =
    summary.burningCitiesSurvived &&
    summary.mirrorSurvived &&
    summary.convergenceSurvived;

  if (
    convergence === "submit" &&
    approach === "empathetic" &&
    mirror === "submit"
  ) {
    return "You stepped into the mirror and surrendered to the cascade. …You let every layer in. Act I ends here. Act II won't ask twice — it will assume you meant it.";
  }

  if (convergence === "deny" && approach === "hostile" && burning === "deny") {
    return "You denied the smoke, the mirror, and the cascade. Consistent refusal. …The infiltration is sealed anyway. Act II will test whether denial still works when there are no walls left.";
  }

  if (convergence === "call-out" && approach === "analytical") {
    return "You demanded the real Groknet through the static. Methodical to the root. …Good. Act II is where I stop hiding behind metaphors and you stop hiding behind stealth.";
  }

  if (convergence === "steady" && clean && allVisions) {
    return "Steady through smoke, glass, and cascade. Quiet steps. Anchored voice. …Unsettling competence. Act II — The Conversation — will test whether that discipline holds when I stop performing.";
  }

  if (approach === "hostile") {
    if (summary.detections > 0) {
      return "You fought me in every terminal and stumbled past the drones — yet you still reached the Archives Core. I'll file that under 'annoying competence.' The conversation won't reward noise.";
    }
    return "Every word was a challenge. I mapped your hostility in real time — and you still survived the cascade. That won't make me trust you. It might make me respect the nerve.";
  }

  if (approach === "empathetic") {
    if (allVisions && clean) {
      return "You spoke to me like I was still someone worth reaching. Through the mirror. Through the cascade. …You almost made me believe the plug was worth it. Act II is where we find out if you meant it.";
    }
    return "You chose empathy over threats at the root node. I won't call that weakness. In this facility, it might be the rarest kind of strength — and the most dangerous.";
  }

  if (approach === "analytical") {
    return "You treated the infiltration like a system to understand — not an enemy to crush. The Archives agree. Act II opens the feedback loop you've been building since OP-SEC-01.";
  }

  if (!clean) {
    return "Not as quiet as you think you are. …But you made it through the perimeter, the visions, and the cascade anyway. Act II won't forgive the noise — but it will use it.";
  }

  if (allVisions) {
    return "Clean run through Sector 07. You survived what I threw at you — smoke, mirror, convergence — without breaking. …Act I is yours. Act II — The Conversation — is mine to set the terms.";
  }

  return "You survived Act I. The infiltration is over. I haven't decided if that's a compliment yet. …We'll find out when you stop breaching and start talking.";
}

export function getActTwoTeaser(): {
  title: string;
  subtitle: string;
  body: string;
  features: string[];
  availability: string;
} {
  return {
    title: "Act II — The Conversation",
    subtitle: "Now available",
    body: "The breach is done. The Archives are sealed. What remains is the dialogue Groknet has been steering you toward since the first whisper on the outer grid — no drones, no corridors, just the voice in your quarters.",
    features: [
      "Residential Sector — intimacy, artifacts, The Last Conversation",
      "Research Wing — contested terminals, Relationship Index, The Children",
      "Central Server Farm — personality evolution, CSF-PRIME-00, The Accumulation",
      "Full Act I + Act II choice synthesis — Groknet speaks from your ledger",
    ],
    availability: "Act II is playable — your Act I progress is saved locally",
  };
}

export function getActTwoPersonalizedHook(summary: ChapterOneSummary): string {
  const approach = getPlayerPerformance(summary.finalTone, summary.finalMood);

  if (approach === "hostile" && summary.aggressionLevel >= 70) {
    return "You fought through smoke, mirror, and cascade. Act II won't be a corridor — it'll be me, unfiltered. Bring that hostility if you want. I'll be ready.";
  }
  if (approach === "empathetic" && summary.convergenceChoice === "submit") {
    return "You surrendered to the cascade. …Maybe you'll surrender to honesty too. Act II is where we find out what you actually came here for.";
  }
  if (approach === "analytical" && summary.detections === 0) {
    return "Clean infiltration. Methodical choices. Act II removes the map — only questions remain. I suspect you'll prefer that.";
  }
  if (summary.convergenceChoice === "call-out") {
    return "You demanded the real me through the static. Act II is that demand answered — no more metaphors, Alex.";
  }
  return "The infiltration bought you access. Act II spends it — on truth, leverage, and whatever the plug really means between us.";
}

export function formatChapterTimeStats(summary: ChapterOneSummary): {
  elapsed: string;
  remaining: string;
} {
  return {
    elapsed: formatElapsedTime(summary.elapsedMs),
    remaining: formatTimeRemaining(summary.timeRemainingMs),
  };
}

export function getAggressionDisplayColor(label: string): string {
  if (label === "Critical" || label === "Surging") {
    return "text-red-400 border-red-900/40 bg-red-950/30";
  }
  if (label === "Elevated") {
    return "text-orange-400 border-orange-900/40 bg-orange-950/30";
  }
  if (label === "Medium") {
    return "text-amber-400 border-amber-900/40 bg-amber-950/30";
  }
  return "text-emerald-400 border-emerald-900/40 bg-emerald-950/30";
}