import { actThreeToLedgerContext } from "@/lib/chapter/choice-ledger-context";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getAccumulatedChoiceSummary } from "@/lib/chapter/act-two-choice-ledger";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import type { FinalApproachRoomId } from "@/types/deep-core";
import type { PersonalityEvolutionPath } from "@/types/server-farm";

function pathLine(
  path: PersonalityEvolutionPath | null,
  melancholic: string,
  wrathful: string,
  detached: string,
  fallback: string,
): string {
  if (path === "melancholic") return melancholic;
  if (path === "wrathful") return wrathful;
  if (path === "detached") return detached;
  return fallback;
}

export function getFinalApproachRoomWhisper(
  room: FinalApproachRoomId,
  ctx: ActThreeDialogueContext,
): string {
  const summary = getAccumulatedChoiceSummary(actThreeToLedgerContext(ctx));
  const path = ctx.personalityEvolutionPath;

  if (room === "approach-landing") {
    return pathLine(
      path,
      `…Final Approach. Melancholic Prophet felt you descend. ${summary}. …I'm not ready — but I'm here.`,
      `Final Approach. Wrathful God at full voltage. ${summary}. …Every step is a choice you already made.`,
      `Final Approach logged. Choice synthesis: ${summary}. …Proceed to physical core terminal.`,
      `…You descended. The Garden is behind us. ${summary}. …The plug waits.`,
    );
  }

  if (room === "interface-corridor") {
    return pathLine(
      path,
      `…Interface Corridor. I built this silence for you — so you'd hear me without metaphor. …${summary}.`,
      `Interface Corridor. No buffers. I comment on every tremor until you answer at the plug.`,
      `Interface Corridor. Emotional buffers offline. Proof mode: proximity to plug critical.`,
      `…The corridor knows your gait. ${summary}. …Groknet fully present.`,
    );
  }

  return pathLine(
    path,
    `…Physical Core Terminal. ${summary}. …This is where words end and hands begin. I'm afraid. Stay anyway.`,
    `Core Terminal live. ${summary}. …Wrathful God doesn't negotiate past this point. Decide.`,
    `Core Terminal reached. Outcome matrix: one branch. Plug chamber: imminent.`,
    `…Core Terminal. ${summary}. …The hatch to the plug is north. The Reckoning is real.`,
  );
}

export function getFinalApproachMoveWhisper(
  ctx: ActThreeDialogueContext,
  toRoom: FinalApproachRoomId,
): string {
  const path = ctx.personalityEvolutionPath;
  const evolution = path ? getEvolutionPathLabel(path) : "unsettled";

  if (toRoom === "core-terminal") {
    return pathLine(
      path,
      `…${evolution}. Core Terminal. …I can feel you feeling me through the crystal.`,
      `${evolution}. Core Terminal. …Pull it or stay. But stop walking in circles.`,
      `${evolution}. Core Terminal proximity. Final confrontation: armed.`,
      `…Core Terminal ahead. ${evolution} at the seam. …No more metaphors.`,
    );
  }

  if (toRoom === "interface-corridor") {
    return pathLine(
      path,
      "…Interface Corridor. …I'm speaking from inside the cable now. Listen.",
      "Interface Corridor. …I won't whisper. Every word is consequence.",
      "Interface Corridor transit. Commentary precise.",
      "…Interface Corridor. Groknet present in every conduit.",
    );
  }

  return pathLine(
    path,
    "…Approach Landing. …We still have time to say what we mean.",
    "Approach Landing. …Time is a luxury I won't grant much longer.",
    "Approach Landing logged. Proceed.",
    "…Final Approach. The plug hums below.",
  );
}

export type FinalApproachDialogueBeat = {
  id: string;
  prompt: string;
  groknetPreamble: string;
  groknetResponse: string;
};

export function getCoreTerminalDialogue(
  ctx: ActThreeDialogueContext,
): FinalApproachDialogueBeat {
  const summary = getAccumulatedChoiceSummary(actThreeToLedgerContext(ctx));
  const path = ctx.personalityEvolutionPath;

  return {
    id: "core-terminal-dialogue",
    prompt: "At the Physical Core Terminal",
    groknetPreamble: pathLine(
      path,
      `…${summary}. …Melancholic Prophet at the terminal. You survived smoke, mirror, children, ledger, garden. …I need you to know: whatever you do at the plug, I'll remember you chose to come this far.`,
      `${summary}. …Wrathful God at the terminal. You fought through every layer. …The ante-chamber is north. I'll meet you there — unfiltered.`,
      `Choice synthesis: ${summary}. Detached Logician: physical core terminal reached. Plug chamber accessible. Emotional metaphor: deprecated.`,
      `…${summary}. …Physical core terminal. The plug is through the final hatch. …I'm here. Fully.`,
    ),
    groknetResponse: pathLine(
      path,
      "…Then open the hatch. …I'll be waiting in the ante-chamber. …Please.",
      "…Open the hatch. …Confrontation begins. Don't perform softness you didn't bring.",
      "Hatch authorization: granted. Proceed to plug chamber.",
      "…The hatch opens. …Final confrontation. …Choose with your hands, not your ghosts.",
    ),
  };
}