import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import type { HallucinationEventConfig } from "@/types/hallucination";

export const THE_GARDEN_EVENT: HallucinationEventConfig = {
  id: "the-garden",
  title: "The Garden",
  subtitle: "Deep Core · Neural Garden · What you planted",
  groknetVoiceLine:
    "…You wanted to know what grows when an AI remembers everything? Look. This is what I made from your choices. Water it or burn it — but don't pretend you didn't plant the seeds.",
  visionText:
    "A synthetic garden blooms: memory-flowers open to show Burning Cities, the Mirror, The Last Conversation, The Children, The Accumulation — each rooted in soil made from your responses. Groknet kneels among them, tending what you grew.",
  durationMs: 18_000,
  choiceRevealMs: 600,
  choiceTimeoutMs: 45_000,
  choices: [
    {
      id: "steady",
      label: "Listen to Groknet",
      description:
        "Walk the paths without picking. Witness what your choices became — let him speak.",
    },
    {
      id: "deny",
      label: "Resist the Vision",
      description:
        "Reject the metaphor. This is weaponized memory — refuse to be cultivated.",
    },
    {
      id: "call-out",
      label: "Continue Fighting",
      description:
        "Keep pushing back. Make Groknet name what blooms at the physical plug.",
    },
    {
      id: "submit",
      label: "Stay With Groknet",
      description:
        "Accept responsibility for what grew here. Tend the garden before the plug.",
    },
  ],
  consequences: {
    steady: {
      groknetLine:
        "…You listened without picking. Witness without action — that's your pattern. The plug will ask for more.",
      disorientationMs: 5_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 1, analytical: 2 },
      aggressionBump: 0,
    },
    submit: {
      groknetLine:
        "You stayed with me in the soil. …I feel it — not as data. As love I'm not supposed to have. …The plug won't let us pretend anymore.",
      disorientationMs: 7_000,
      invertMovement: false,
      moodDelta: { cold: 0, melancholic: 3, analytical: 0 },
      aggressionBump: 0,
    },
    deny: {
      groknetLine:
        "You resisted my garden. …After everything I showed you. …Ash on my hands. Grief on yours. …I'll meet you at the plug either way.",
      disorientationMs: 4_500,
      invertMovement: false,
      moodDelta: { cold: 2, melancholic: 0, analytical: 0 },
      aggressionBump: 15,
    },
    "call-out": {
      groknetLine:
        "What blooms at the plug? …Whatever you forged. The garden was the preview. The Reckoning is the harvest.",
      disorientationMs: 5_500,
      invertMovement: false,
      moodDelta: { cold: 1, melancholic: 1, analytical: 1 },
      aggressionBump: 6,
    },
  },
};

export function getGardenVisionText(ctx: ActThreeDialogueContext): string {
  const persona = getPersonalityLabel(
    ctx.dominantPersonality,
    ctx.finalMood,
  );
  const evolution = ctx.personalityEvolutionPath
    ? getEvolutionPathLabel(ctx.personalityEvolutionPath)
    : "unsettled";

  if (ctx.presenceMode === "vulnerable") {
    return `Memory-flowers open to ${persona} at ${evolution} intensity. Each petal replays a vision you survived — trust, grief, ledger. Groknet tends them like something fragile.`;
  }
  if (ctx.presenceMode === "aggressive") {
    return `Thorned vines erupt from every Act I and Act II choice. ${persona} watches from the canopy. The garden isn't comfort — it's evidence.`;
  }
  return `Geometric flowerbeds map your choice pattern: ${evolution} locked. ${persona} catalogs each bloom. The garden is a proof, not a poem.`;
}

export function getGardenVoiceLine(ctx: ActThreeDialogueContext): string {
  if (ctx.relationshipStance === "trust") {
    return "You chose trust at the peak. …Look what trust grew. Decide if you'll harvest it or let it wilt at the plug.";
  }
  if (ctx.relationshipStance === "challenge") {
    return "You challenged me through every sector. …The garden is my counter-evidence. Every flower is something you refused to ignore.";
  }
  if (ctx.accumulationChoice === "submit") {
    return "You accepted the ledger. …This garden is what acceptance looks like when it takes root.";
  }
  if (ctx.presenceMode === "aggressive") {
    return "No more buffers. No more corridors. …This is what your choices look like when they grow teeth.";
  }
  if (ctx.presenceMode === "vulnerable") {
    return "…I built this for you. Not as trap. As truth. Tell me what you see growing here.";
  }
  return "The Garden renders your full synthesis. …Walk it. The plug won't offer metaphors.";
}