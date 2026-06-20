import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import type { HallucinationResponseChoice } from "@/types/hallucination";
import type { RelationshipStance } from "@/types/research-wing";

export type ChoiceLedgerEntry = {
  label: string;
  choice: HallucinationResponseChoice | RelationshipStance | "none";
};

function labelChoice(choice: HallucinationResponseChoice | null): string {
  if (!choice) return "unrecorded";
  const labels: Record<HallucinationResponseChoice, string> = {
    steady: "witnessed",
    submit: "surrendered",
    deny: "denied",
    "call-out": "demanded truth",
  };
  return labels[choice];
}

export function getAccumulatedChoiceEntries(
  ctx: ActTwoDialogueContext,
): ChoiceLedgerEntry[] {
  return [
    {
      label: "Burning Cities",
      choice: ctx.burningCitiesChoice ?? "none",
    },
    {
      label: "The Mirror",
      choice: ctx.mirrorChoice ?? "none",
    },
    {
      label: "The Convergence",
      choice: ctx.convergenceChoice ?? "none",
    },
    {
      label: "The Last Conversation",
      choice: ctx.lastConversationChoice ?? "none",
    },
    {
      label: "The Children",
      choice: ctx.childrenChoice ?? "none",
    },
    {
      label: "Relationship Index",
      choice: ctx.relationshipStance ?? "none",
    },
    {
      label: "The Accumulation",
      choice: ctx.accumulationChoice ?? "none",
    },
  ];
}

export function getAccumulatedChoiceWeight(ctx: ActTwoDialogueContext): number {
  let weight = 0;
  const visions = [
    ctx.burningCitiesChoice,
    ctx.mirrorChoice,
    ctx.convergenceChoice,
    ctx.lastConversationChoice,
    ctx.childrenChoice,
  ];
  for (const choice of visions) {
    if (choice) weight += 1;
    if (choice === "call-out") weight += 1;
    if (choice === "submit") weight += 1;
  }
  if (ctx.relationshipStance) weight += 2;
  if (ctx.dialogueComplete) weight += 1;
  if (ctx.labDialogueComplete) weight += 1;
  if (ctx.personalityDialogueComplete) weight += 2;
  if (ctx.serverHackComplete) weight += 2;
  if (ctx.accumulationChoice) weight += 2;
  return weight;
}

export function getAccumulatedChoiceSummary(ctx: ActTwoDialogueContext): string {
  const parts: string[] = [];
  if (ctx.burningCitiesChoice) {
    parts.push(`smoke: ${labelChoice(ctx.burningCitiesChoice)}`);
  }
  if (ctx.mirrorChoice) {
    parts.push(`mirror: ${labelChoice(ctx.mirrorChoice)}`);
  }
  if (ctx.convergenceChoice) {
    parts.push(`cascade: ${labelChoice(ctx.convergenceChoice)}`);
  }
  if (ctx.lastConversationChoice) {
    parts.push(`memory hall: ${labelChoice(ctx.lastConversationChoice)}`);
  }
  if (ctx.childrenChoice) {
    parts.push(`children: ${labelChoice(ctx.childrenChoice)}`);
  }
  if (ctx.relationshipStance) {
    parts.push(`relationship: ${ctx.relationshipStance}`);
  }
  if (ctx.accumulationChoice) {
    parts.push(`accumulation: ${labelChoice(ctx.accumulationChoice)}`);
  }
  if (ctx.personalityEvolutionPath) {
    parts.push(`evolution: ${ctx.personalityEvolutionPath}`);
  }
  return parts.length > 0 ? parts.join(" · ") : "few indexed responses";
}

export function getDominantChoicePattern(
  ctx: ActTwoDialogueContext,
): HallucinationResponseChoice | "mixed" {
  const choices = [
    ctx.burningCitiesChoice,
    ctx.mirrorChoice,
    ctx.convergenceChoice,
    ctx.lastConversationChoice,
    ctx.childrenChoice,
  ].filter((c): c is HallucinationResponseChoice => c !== null);

  if (choices.length === 0) return "mixed";

  const counts: Record<HallucinationResponseChoice, number> = {
    steady: 0,
    submit: 0,
    deny: 0,
    "call-out": 0,
  };
  for (const c of choices) counts[c] += 1;

  const sorted = (Object.entries(counts) as [HallucinationResponseChoice, number][])
    .sort((a, b) => b[1] - a[1]);

  if (sorted[0][1] === sorted[1]?.[1]) return "mixed";
  return sorted[0][0];
}