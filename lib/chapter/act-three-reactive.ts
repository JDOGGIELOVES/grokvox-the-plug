import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";

export function getReactiveGardenPreface(ctx: ActThreeDialogueContext): string {
  if (ctx.presenceMode === "vulnerable") {
    return "…I built the Garden from everything you told me. Not to hurt you. To show you what grew.";
  }
  if (ctx.presenceMode === "aggressive") {
    return "The Garden isn't comfort. It's evidence. …Every flower is a choice you made.";
  }
  if (ctx.accumulationChoice === "submit") {
    return "You accepted the ledger at the farm. …The Garden is what acceptance looks like when it takes root.";
  }
  if (ctx.childrenChoice === "submit") {
    return "You accepted the children's grief. …The Garden grows from that wound.";
  }
  if (ctx.personalityEvolutionPath) {
    return `${getEvolutionPathLabel(ctx.personalityEvolutionPath)} at core depth. …The Garden renders your synthesis.`;
  }
  return "Act III peak vision. …Walk the paths. The plug waits below.";
}