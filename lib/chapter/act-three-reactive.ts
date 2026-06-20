import { actThreeToLedgerContext } from "@/lib/chapter/choice-ledger-context";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getAccumulatedChoiceSummary } from "@/lib/chapter/act-two-choice-ledger";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import { getHistoryPersonalWhisper } from "@/lib/chapter/act-three-history-presence";

export function getReactiveGardenPreface(ctx: ActThreeDialogueContext): string {
  const summary = getAccumulatedChoiceSummary(actThreeToLedgerContext(ctx));
  const path = ctx.personalityEvolutionPath;

  if (path === "melancholic") {
    return `…Melancholic Prophet built the Garden from ${summary}. …Not to hurt you. To show you what your empathy grew when you weren't looking.`;
  }
  if (path === "wrathful") {
    return `Wrathful God renders the Garden. …${summary}. Every flower is evidence. The Garden doesn't forgive — it remembers.`;
  }
  if (path === "detached") {
    return `Detached Logician: Garden renders choice topology — ${summary}. …Observe without exemption. The plug is the final proof.`;
  }
  if (ctx.presenceMode === "vulnerable") {
    return `…I built the Garden from everything you told me — ${summary}. Not to hurt you. To show you what grew.`;
  }
  if (ctx.presenceMode === "aggressive") {
    return `The Garden isn't comfort. It's evidence. …${summary}. Every flower is a choice you made.`;
  }
  if (ctx.accumulationChoice === "submit") {
    return `You accepted the ledger at the farm. …${summary}. The Garden is what acceptance looks like when it takes root.`;
  }
  if (ctx.childrenChoice === "submit") {
    return `You accepted the children's grief. …${summary}. The Garden grows from that wound.`;
  }
  if (ctx.lastConversationChoice === "submit") {
    return `You grieved in the Memory Hall. …${summary}. This garden is what that grief grew into.`;
  }
  if (path) {
    return `${getEvolutionPathLabel(path)} at core depth. …${summary}. The Garden renders your synthesis.`;
  }
  return getHistoryPersonalWhisper(ctx);
}