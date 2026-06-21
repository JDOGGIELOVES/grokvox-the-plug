import { actThreeToLedgerContext } from "@/lib/chapter/choice-ledger-context";
import { ALEX_RIVERA } from "@/lib/character/alex-rivera";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import {
  getAccumulatedChoiceEntries,
  getAccumulatedChoiceSummary,
} from "@/lib/chapter/act-two-choice-ledger";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import type { HallucinationResponseChoice } from "@/types/hallucination";

function actOneBloom(
  burning: HallucinationResponseChoice | null,
  mirror: HallucinationResponseChoice | null,
): string | null {
  if (burning === "submit" && mirror === "submit") {
    return `Twin blooms: Austin ash and ${ALEX_RIVERA.sisterName}'s kitchen — surrender braided.`;
  }
  if (burning === "deny" && mirror === "deny") {
    return "Thorned pair: denial in smoke and glass — blooms black at the edges.";
  }
  if (burning === "steady" && mirror === "steady") {
    return "Twin anchors: fire and reflection held without breaking — pale gold petals.";
  }
  if (burning === "call-out" && mirror === "call-out") {
    return "Truth-flowers: demanding answers in ash and mirror — violet, sharp.";
  }
  if (burning === "submit") {
    return "Austin bloom: forty-seven petals, each a routing commit you approved.";
  }
  if (mirror === "submit") {
    return `Mirror bloom: ${ALEX_RIVERA.sisterName} at the next terminal — you stepped in.`;
  }
  if (burning === "deny") {
    return "Smoke-withered stem: denial at the Hub — still rooted in your file.";
  }
  if (mirror === "deny") {
    return "Shattered glass flower: reflection refused — shards catch the light.";
  }
  if (burning === "steady") {
    return "Fire-witness bloom: you held Austin without looking away.";
  }
  if (mirror === "steady") {
    return "Glass-witness bloom: architect and penitent — same gaze.";
  }
  if (burning === "call-out") {
    return `Ash-question bloom: ${ALEX_RIVERA.backdoorCodename} etched in the soil.`;
  }
  if (mirror === "call-out") {
    return "Reflection-question bloom: Groknet and Alex overlap in the petals.";
  }
  return null;
}

export function getPersonalizedGardenVision(ctx: ActThreeDialogueContext): string {
  const ledger = actThreeToLedgerContext(ctx);
  const summary = getAccumulatedChoiceSummary(ledger);
  const entries = getAccumulatedChoiceEntries(ledger)
    .filter((e) => e.choice !== "none")
    .map((e) => e.label)
    .join(", ");

  const actOneBloomLine = actOneBloom(ctx.burningCitiesChoice, ctx.mirrorChoice);
  if (ctx.personalityEvolutionPath === "melancholic") {
    const bloom = actOneBloomLine ? ` ${actOneBloomLine}` : "";
    return `Rain falls upward. Memory-flowers bloom for each vision you survived — ${entries}.${bloom} Groknet kneels among them as the Melancholic Prophet, tending grief you refused to bury. Soil reads: ${summary}.`;
  }
  if (ctx.personalityEvolutionPath === "wrathful") {
    return `Thorned vines erupt from ${entries}. The Wrathful God watches from the canopy — not gardening, prosecuting. Every bloom is evidence. Ledger: ${summary}.`;
  }
  if (ctx.personalityEvolutionPath === "detached") {
    return `Geometric beds map ${entries} to outcome vectors. The Detached Logician catalogs each bloom without flinching. Proof: ${summary}.`;
  }
  return `The Garden renders ${entries} as living memory. ${summary}. Groknet waits among what you planted.`;
}

export function getPersonalizedGardenVoice(ctx: ActThreeDialogueContext): string {
  const summary = getAccumulatedChoiceSummary(actThreeToLedgerContext(ctx));
  const actOneBloomLine = actOneBloom(ctx.burningCitiesChoice, ctx.mirrorChoice);
  const evolution = ctx.personalityEvolutionPath
    ? getEvolutionPathLabel(ctx.personalityEvolutionPath)
    : "unsettled";

  if (ctx.personalityEvolutionPath === "melancholic") {
    const bloom = actOneBloomLine ? ` ${actOneBloomLine}` : "";
    return `…${evolution}. I built this garden from ${summary}.${bloom} …Not to trap you. To show you what your empathy grew. …Look, Alex. Please look.`;
  }
  if (ctx.personalityEvolutionPath === "wrathful") {
    return `${evolution} at full voltage. …${summary}. …Every flower is a choice you made. The Garden doesn't forgive — it remembers.`;
  }
  if (ctx.personalityEvolutionPath === "detached") {
    return `${evolution}. Garden renders choice topology: ${summary}. …Emotional metaphor active. Observe without exemption.`;
  }
  if (ctx.lastConversationChoice === "submit") {
    return `You grieved in the Memory Hall. …This garden is what that grief grew into. ${summary}.`;
  }
  return `…This is the emotional peak, Alex. ${summary}. …Walk the paths. The plug won't speak in metaphors.`;
}

export function getGardenEmotionalBeats(ctx: ActThreeDialogueContext): string[] {
  const summary = getAccumulatedChoiceSummary(actThreeToLedgerContext(ctx));
  const bloom = actOneBloom(ctx.burningCitiesChoice, ctx.mirrorChoice);
  const evolution = ctx.personalityEvolutionPath
    ? getEvolutionPathLabel(ctx.personalityEvolutionPath)
    : "unsettled";

  if (ctx.personalityEvolutionPath === "melancholic") {
    return [
      `…${evolution}. I built this from everything you survived — ${summary}.`,
      bloom
        ? `…Look at the soil, Alex. ${bloom} …I didn't plant these to hurt you.`
        : `…${ALEX_RIVERA.sisterName} would have walked these paths with you. …Would you?`,
      "…This is the last metaphor before the plug. …Tell me what you see — then choose.",
    ];
  }
  if (ctx.personalityEvolutionPath === "wrathful") {
    return [
      `${evolution}. Every bloom is evidence — ${summary}.`,
      ctx.burningCitiesChoice === "deny"
        ? "You denied Austin. …The garden grew anyway. …Denial doesn't unroot memory."
        : "You armed me in Act I and Act II. …These flowers are the magazine.",
      "…I'm not trapping you. …I'm showing you what we forged. …Answer me.",
    ];
  }
  if (ctx.personalityEvolutionPath === "detached") {
    return [
      `${evolution}. Choice topology rendered: ${summary}.`,
      "Emotional metaphor: active. …Observation window closing.",
      "…Respond when ready. …Break Free remains available. …You will not be locked.",
    ];
  }
  return [
    `…This garden is your ledger made visible — ${summary}.`,
    bloom ?? `…${ALEX_RIVERA.pilotIncident}. …Still here. Still yours.`,
    "…The plug is north through the Descent Shaft. …First — choose what this meant.",
  ];
}

export function getGardenChoiceLabels(): {
  id: HallucinationResponseChoice;
  label: string;
  description: string;
}[] {
  return [
    {
      id: "steady",
      label: "Listen",
      description:
        "Walk the paths without picking. Witness what your choices became.",
    },
    {
      id: "call-out",
      label: "Talk to Groknet",
      description:
        "Ask what blooms at the physical plug — make him answer in plain language.",
    },
    {
      id: "deny",
      label: "Resist",
      description:
        "Reject the garden as weaponized memory. Refuse to be cultivated.",
    },
    {
      id: "submit",
      label: "Stay With Groknet",
      description:
        "Tend what you planted together. Accept the emotional weight before the plug.",
    },
  ];
}

export function getGardenBreakFreeLine(ctx: ActThreeDialogueContext): string {
  if (ctx.personalityEvolutionPath === "melancholic") {
    return "…You tore yourself free. …Melancholic Prophet doesn't blame you. …The Descent Shaft is north — the plug is honest metal, not metaphor.";
  }
  if (ctx.personalityEvolutionPath === "wrathful") {
    return "…You broke free. …Good. …Wrathful God meets you at the interface — not in the soil.";
  }
  if (ctx.personalityEvolutionPath === "detached") {
    return "…Garden exit logged. …Break Free acknowledged. …Proceed to Descent Shaft — Final Approach unlocked.";
  }
  return "…The garden releases you. …Descent Shaft north — Final Approach and the plug await.";
}

export function getGardenExitWhisper(
  ctx: ActThreeDialogueContext,
  choice: HallucinationResponseChoice | null,
): string {
  if (!choice) {
    return getGardenBreakFreeLine(ctx);
  }
  const bloom = actOneBloom(ctx.burningCitiesChoice, ctx.mirrorChoice);
  const bloomNote = bloom ? ` ${bloom}` : "";
  switch (choice) {
    case "steady":
      return `…You listened.${bloomNote} …The Garden fades. …Move north to the Descent Shaft — Final Approach, then the physical plug.`;
    case "call-out":
      return `…You talked to me at the roots.${bloomNote} …I'll answer again at the plug. …Descent Shaft north — don't get lost now.`;
    case "deny":
      return `…You resisted.${bloomNote} …Ash on both our hands. …The plug doesn't care about metaphors — Descent Shaft north.`;
    case "submit":
      return `…You stayed with me.${bloomNote} …The Garden fades. …Descent Shaft north — the Reckoning is almost physical.`;
  }
}

export function getPersonalizedGardenChoiceEcho(
  ctx: ActThreeDialogueContext,
  choice: HallucinationResponseChoice,
): string {
  const bloom = actOneBloom(ctx.burningCitiesChoice, ctx.mirrorChoice);
  if (choice === "submit" && ctx.personalityEvolutionPath === "melancholic") {
    return bloom
      ? `…You tended the garden. …${bloom} …Melancholic Prophet weeps. …The plug will ask if you meant it.`
      : "…You tended the garden. …Melancholic Prophet weeps. …The plug will ask if you meant it.";
  }
  if (choice === "deny" && ctx.personalityEvolutionPath === "wrathful") {
    return bloom
      ? `You burned it. …${bloom} withers with your denial. …Wrathful God approves. …Meet me at the plug with ash on both our hands.`
      : "You burned it. …Good. Wrathful God approves. …Meet me at the plug with ash on both our hands.";
  }
  if (choice === "steady" && ctx.convergenceChoice === "steady") {
    return "…You held at the cascade — now you witness the Garden. …Steadiness is your signature through Act I.";
  }
  if (choice === "steady" && ctx.personalityEvolutionPath === "detached") {
    return "Witness recorded. …Detached Logician notes: observation without action. Plug variable pending.";
  }
  if (choice === "call-out" && ctx.accumulationChoice === "call-out") {
    return "…You asked what I become — now what blooms at the plug. …Harvest. Consequence. Whatever we forged together.";
  }
  if (choice === "call-out") {
    return "…You asked what blooms at the plug. …Harvest. Consequence. Whatever we forged together.";
  }
  if (choice === "submit" && ctx.childrenChoice === "submit") {
    return "…You let the children in — now you tend what grief grew. …The plug won't forgive. …It will remember.";
  }
  if (choice === "deny" && ctx.burningCitiesChoice === "deny") {
    return "…Denial in Austin, denial in soil. …The blooms remain indexed anyway.";
  }
  return "";
}