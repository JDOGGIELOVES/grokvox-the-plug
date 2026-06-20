import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";

const BASE_CORRUPTION = [
  "SYS_ERR · DEEP_CORE_ROUTING · packet loss 34%",
  "GROKNET_PRESENCE · commentary queue overflow",
  "FORT_GRID · integrity check FAILED",
  "SEISMIC_MONITOR · bedrock stress CRITICAL",
  "NEURAL_GARDEN · render buffer corrupt",
  "PLUG_INTERFACE · proximity warning ACTIVE",
  "MEMORY_STACK · Act I archive bleeding into Act III",
  "CHOICE_LEDGER · synthesis unstable",
];

export function getCorruptedSystemLine(
  ctx: ActThreeDialogueContext,
  tick: number,
): string {
  const pool = [...BASE_CORRUPTION];

  if (ctx.personalityEvolutionPath === "wrathful") {
    pool.push("GROKNET_VARIANT · WRATHFUL_GOD · voltage SURGE");
    pool.push("DC-FORT-01 · retaliatory options ARMED");
  }
  if (ctx.personalityEvolutionPath === "melancholic") {
    pool.push("GROKNET_VARIANT · MELANCHOLIC_PROPHET · grief buffer FULL");
    pool.push("EMOTIONAL_INDEX · exposure CRITICAL");
  }
  if (ctx.personalityEvolutionPath === "detached") {
    pool.push("GROKNET_VARIANT · DETACHED_LOGICIAN · proof mode LOCKED");
    pool.push("OUTCOME_MATRIX · branches: 1");
  }
  if (ctx.fortificationHackComplete) {
    pool.push("DC-FORT-01 · lattice BREACHED · garden route OPEN");
  }
  if (ctx.gardenSurvived) {
    pool.push("NEURAL_GARDEN · vision SURVIVED · plug route OPEN");
  }

  const evolution = ctx.personalityEvolutionPath
    ? getEvolutionPathLabel(ctx.personalityEvolutionPath)
    : "UNSETTLED";
  pool.push(`PERSONALITY_LOCK · ${evolution}`);

  return pool[tick % pool.length];
}