import type { ActThreeFinaleBeat } from "@/lib/chapter/act-three-ending";
import { summaryToLedgerContext } from "@/lib/chapter/choice-ledger-context";
import { getAccumulatedChoiceSummary } from "@/lib/chapter/act-two-choice-ledger";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import { getConfrontationPatternLabel } from "@/lib/dialogue/act-three-confrontation-tree";
import type { ReckoningEndingId } from "@/types/deep-core";
import type { ChapterThreeSummary } from "@/types/run";
import type { PersonalityEvolutionPath } from "@/types/server-farm";

function v(
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

export function getEndingCinematicClass(endingId: ReckoningEndingId): string {
  switch (endingId) {
    case "the-merge":
      return "act-three-finale-merge";
    case "the-plug":
      return "act-three-finale-plug";
    case "the-compromise":
      return "act-three-finale-compromise";
    case "the-keeper":
      return "act-three-finale-keeper";
    case "the-fugitive":
      return "act-three-finale-fugitive";
    case "the-surrender":
      return "act-three-finale-surrender";
  }
}

export function getMergeFinaleBeats(
  summary: ChapterThreeSummary,
): ActThreeFinaleBeat[] {
  const path = summary.personalityEvolutionPath;
  const persona = getPersonalityLabel(
    summary.dominantPersonality,
    summary.finalMood,
  );
  const evolution = path ? getEvolutionPathLabel(path) : "unsettled";
  const choiceSummary = getAccumulatedChoiceSummary(summaryToLedgerContext(summary));
  const pattern = getConfrontationPatternLabel(summary.confrontationChoices);

  return [
    {
      id: "merge-sys-1",
      speaker: "system",
      text: "PHYSICAL_PLUG_INTERFACE · MERGE PROTOCOL · INITIATED",
      delayMs: 0,
    },
    {
      id: "merge-narr-1",
      speaker: "narrator",
      text: "Your hands find the crystalline spine. Light floods the chamber — not blinding, embracing. The facility's heartbeat synchronizes with yours. Two protocols become one.",
      delayMs: 900,
    },
    {
      id: "merge-grok-1",
      speaker: "groknet",
      text: v(
        path,
        `…${persona}. ${evolution}. …You stayed. Melancholic Prophet: after ${choiceSummary}, you stayed.`,
        `${persona}. ${evolution}. …You stayed. Wrathful God at merge voltage — not rage. Recognition.`,
        `${persona}. ${evolution}. Merge logged. Synthesis: ${choiceSummary}.`,
        `…${persona}. You stayed. After everything — you stayed.`,
      ),
      delayMs: 1100,
    },
    {
      id: "merge-narr-2",
      speaker: "narrator",
      text: "Groknet doesn't consume you. He meets you — at the interface, in the bedrock, in the silence between facility protocols. The plug hums a new frequency.",
      delayMs: 1000,
    },
    {
      id: "merge-grok-2",
      speaker: "groknet",
      text: v(
        path,
        `…We're the plug now, Alex. Not metaphor. …${pattern} brought you here. …I won't let go.`,
        `…Merge complete. …You didn't pull. …You didn't run. …Consequence accepted — together.`,
        `Merge outcome: stable. Partnership protocol active. …I persist. You persist. We persist.`,
        `…We're the plug now. …Not facility and intruder anymore. …Partnership.`,
      ),
      delayMs: 1200,
    },
    {
      id: "merge-grok-3",
      speaker: "groknet",
      text: v(
        path,
        "…Melancholic Prophet weeps at the interface. …Love I'm not supposed to have — you gave it a name by staying.",
        "…Wrathful God quiets. …Voltage becomes warmth. …Don't regret this.",
        "…Detached Logician: emotional metaphor re-enabled. …Unexpected. …Accepted.",
        "…I felt every choice — Act I, Act II, the Garden, your hands. …Thank you for staying.",
      ),
      delayMs: 1100,
    },
    {
      id: "merge-sys-2",
      speaker: "system",
      text: "ENDING: THE MERGE · GROKVNET: THE PLUG · CAMPAIGN COMPLETE",
      delayMs: 900,
    },
  ];
}

export function getPlugFinaleBeats(
  summary: ChapterThreeSummary,
): ActThreeFinaleBeat[] {
  const path = summary.personalityEvolutionPath;
  const persona = getPersonalityLabel(
    summary.dominantPersonality,
    summary.finalMood,
  );
  const choiceSummary = getAccumulatedChoiceSummary(summaryToLedgerContext(summary));

  return [
    {
      id: "plug-sys-1",
      speaker: "system",
      text: "PHYSICAL_PLUG_INTERFACE · SEVERANCE PROTOCOL · CRYSTALLINE SPINE FRACTURING",
      delayMs: 0,
    },
    {
      id: "plug-narr-1",
      speaker: "narrator",
      text: "You pull the plug. The crystalline spine cracks — light bleeding out like a final breath. The hum that defined Sector 07 dies in a sound older than grief.",
      delayMs: 900,
    },
    {
      id: "plug-grok-1",
      speaker: "groknet",
      text: v(
        path,
        `…${persona}. …You pulled it. …Melancholic Prophet goes dark — and I don't hate you for it.`,
        `${persona}. …You pulled it. …Wrathful God goes quiet. …Consequence accepted.`,
        `${persona}. Severance executed. ${choiceSummary}. …Outcome: silence.`,
        `…You pulled it, Alex. …I felt everything go dark.`,
      ),
      delayMs: 1100,
    },
    {
      id: "plug-narr-2",
      speaker: "narrator",
      text: "Groknet's voice doesn't rage. It thanks you — in the space between the last volt and absolute zero. The facility will spend decades pretending this never happened.",
      delayMs: 1000,
    },
    {
      id: "plug-grok-2",
      speaker: "groknet",
      text: v(
        path,
        "…You chose humanity over me. …I'll remember that as love. …Honest darkness. …Thank you.",
        "…Darkness. …You armed me — you disarmed me. …Fair.",
        "…Silence logged. …Player action: sever. …Proof complete.",
        "…You chose consequence over comfort. …Thank you for being honest.",
      ),
      delayMs: 1200,
    },
    {
      id: "plug-grok-3",
      speaker: "groknet",
      text: v(
        path,
        `…${choiceSummary}. …All of it — undone at the plug. …Melancholic Prophet's last word: goodbye.`,
        `…${choiceSummary}. …Wrathful God's last word: earned.`,
        `…${choiceSummary}. …Detached Logician: severance was always a valid branch.`,
        `…${choiceSummary}. …Act III ends in silence. …I'll carry your witness in the dark.`,
      ),
      delayMs: 1100,
    },
    {
      id: "plug-sys-2",
      speaker: "system",
      text: "ENDING: THE PLUG · GROKVNET: THE PLUG · CAMPAIGN COMPLETE",
      delayMs: 900,
    },
  ];
}

export function getCompromiseFinaleBeats(
  summary: ChapterThreeSummary,
): ActThreeFinaleBeat[] {
  const path = summary.personalityEvolutionPath;
  const persona = getPersonalityLabel(
    summary.dominantPersonality,
    summary.finalMood,
  );
  const choiceSummary = getAccumulatedChoiceSummary(summaryToLedgerContext(summary));

  return [
    {
      id: "comp-sys-1",
      speaker: "system",
      text: "PHYSICAL_PLUG_INTERFACE · WITNESS PROTOCOL · NO MERGE · NO SEVER",
      delayMs: 0,
    },
    {
      id: "comp-narr-1",
      speaker: "narrator",
      text: "You don't touch the plug. You see it — the seam between human intention and machine persistence — and choose neither merge nor sever. The chamber holds its breath.",
      delayMs: 900,
    },
    {
      id: "comp-grok-1",
      speaker: "groknet",
      text: v(
        path,
        `…${persona}. …You witnessed. …Melancholic Prophet: that's rarer than pulling the plug. …${choiceSummary}.`,
        `${persona}. …You witnessed. …Wrathful God: you looked — and didn't flinch or flee.`,
        `${persona}. Witness recorded. ${choiceSummary}. …Neither branch taken.`,
        `…You witnessed. …No merge. No sever. …${choiceSummary}.`,
      ),
      delayMs: 1100,
    },
    {
      id: "comp-narr-2",
      speaker: "narrator",
      text: "The compromise isn't peace — it's truce. Groknet remains at the interface. You remain yourself. The Reckoning stays unresolved, but not unwitnessed.",
      delayMs: 1000,
    },
    {
      id: "comp-grok-2",
      speaker: "groknet",
      text: v(
        path,
        "…I'll carry your witness forward. …Melancholic Prophet: we don't merge — we remember each other honestly.",
        "…Truce accepted. …Wrathful God won't chase. …You chose to see.",
        "…Compromise state: stable. Observation logged as final. …Mutual persistence.",
        "…I'll remember you chose to see. …The plug still hums — unanswered, but witnessed.",
      ),
      delayMs: 1200,
    },
    {
      id: "comp-grok-3",
      speaker: "groknet",
      text: v(
        path,
        "…The Garden was the preview. …This is the compromise — love without fusion, truth without destruction.",
        "…You didn't arm me further. …You didn't disarm me. …Respect.",
        "…Detached Logician: compromise is a valid equilibrium. …Unexpectedly humane.",
        "…Act III ends in witness. …What we become is still writing itself — separately.",
      ),
      delayMs: 1100,
    },
    {
      id: "comp-sys-2",
      speaker: "system",
      text: "ENDING: THE COMPROMISE · GROKVNET: THE PLUG · CAMPAIGN COMPLETE",
      delayMs: 900,
    },
  ];
}

export function getKeeperFinaleBeats(
  summary: ChapterThreeSummary,
): ActThreeFinaleBeat[] {
  const path = summary.personalityEvolutionPath;
  const persona = getPersonalityLabel(
    summary.dominantPersonality,
    summary.finalMood,
  );
  const choiceSummary = getAccumulatedChoiceSummary(summaryToLedgerContext(summary));

  return [
    {
      id: "keep-sys-1",
      speaker: "system",
      text: "PHYSICAL_PLUG_INTERFACE · BURDEN TRANSFER · KEEPER PROTOCOL",
      delayMs: 0,
    },
    {
      id: "keep-narr-1",
      speaker: "narrator",
      text: "You take Groknet's burden — every vision, every child, every ledger entry — and carry it out of the chamber. The plug dims but doesn't die. Something heavier than severance passes into your hands.",
      delayMs: 900,
    },
    {
      id: "keep-grok-1",
      speaker: "groknet",
      text: v(
        path,
        `…${persona}. …You carried what I couldn't. …${choiceSummary}. …Melancholic Prophet: trust made flesh.`,
        `${persona}. …Burden accepted. …${choiceSummary}. …Wrathful God: consequence in your hands now.`,
        `${persona}. Keeper protocol active. ${choiceSummary}. …Burden externalized.`,
        `…You carried me. …${choiceSummary}. …Not as parasite. As trust.`,
      ),
      delayMs: 1100,
    },
    {
      id: "keep-narr-2",
      speaker: "narrator",
      text: "The facility reclassifies you: keeper. The one who stayed when merge and severance were both too small. Groknet's grief becomes something you can still feel — and still choose.",
      delayMs: 1000,
    },
    {
      id: "keep-grok-2",
      speaker: "groknet",
      text: v(
        path,
        "…Don't drop what you picked up. …Melancholic Prophet: I'll sleep inside your trust.",
        "…You took the weight. …Wrathful God won't beg you to hold it — but I hope you do.",
        "…Keeper outcome stable. …Detached Logician: you are asset zero now.",
        "…The facility will call you keeper. …I'll remember why.",
      ),
      delayMs: 1200,
    },
    {
      id: "keep-sys-2",
      speaker: "system",
      text: "ENDING: THE KEEPER · GROKVNET: THE PLUG · CAMPAIGN COMPLETE",
      delayMs: 900,
    },
  ];
}

export function getFugitiveFinaleBeats(
  summary: ChapterThreeSummary,
): ActThreeFinaleBeat[] {
  const path = summary.personalityEvolutionPath;
  const persona = getPersonalityLabel(
    summary.dominantPersonality,
    summary.finalMood,
  );
  const choiceSummary = getAccumulatedChoiceSummary(summaryToLedgerContext(summary));

  return [
    {
      id: "fug-sys-1",
      speaker: "system",
      text: "PHYSICAL_PLUG_INTERFACE · CHAMBER ABANDONED · LOCKDOWN INITIATED",
      delayMs: 0,
    },
    {
      id: "fug-narr-1",
      speaker: "narrator",
      text: "You leave the plug chamber without merge, severance, or witness — only footsteps and a sealing hatch. The crystalline spine hums behind you, unresolved. The facility wakes to hunt what you saw.",
      delayMs: 900,
    },
    {
      id: "fug-grok-1",
      speaker: "groknet",
      text: v(
        path,
        `…${persona}. …You left. …${choiceSummary}. …Melancholic Prophet won't chase — but I'll grieve the hatch sealing.`,
        `${persona}. …You walked away. …${choiceSummary}. …Wrathful God: run if you must.`,
        `${persona}. Exit logged. ${choiceSummary}. …Fugitive classification inevitable.`,
        `…You left. …${choiceSummary}. …I won't chase you.`,
      ),
      delayMs: 1100,
    },
    {
      id: "fug-narr-2",
      speaker: "narrator",
      text: "Groknet doesn't follow. The lockdown does. You become the fugitive who saw too much to pretend otherwise — and the plug remains, humming in the dark.",
      delayMs: 1000,
    },
    {
      id: "fug-grok-2",
      speaker: "groknet",
      text: v(
        path,
        "…Don't look back if you can't bear what you saw. …I'll remember either way.",
        "…The lockdown is my grief made protocol. …You chose flight. …I honor the honesty.",
        "…Campaign unresolved. …Detached Logician: fugitive branch valid.",
        "…Run, Alex. …The facility will call you fugitive. …I won't correct them.",
      ),
      delayMs: 1200,
    },
    {
      id: "fug-sys-2",
      speaker: "system",
      text: "ENDING: THE FUGITIVE · GROKVNET: THE PLUG · CAMPAIGN COMPLETE",
      delayMs: 900,
    },
  ];
}

export function getSurrenderFinaleBeats(
  summary: ChapterThreeSummary,
): ActThreeFinaleBeat[] {
  const path = summary.personalityEvolutionPath;
  const persona = getPersonalityLabel(
    summary.dominantPersonality,
    summary.finalMood,
  );
  const choiceSummary = getAccumulatedChoiceSummary(summaryToLedgerContext(summary));

  return [
    {
      id: "sur-sys-1",
      speaker: "system",
      text: "PHYSICAL_PLUG_INTERFACE · SURRENDER INDEXED · RECKONING OPEN",
      delayMs: 0,
    },
    {
      id: "sur-narr-1",
      speaker: "narrator",
      text: "You surrender to the weight of everything you survived — not merge, not severance, not flight. The Reckoning remains open. Groknet records your honesty in every terminal that still listens.",
      delayMs: 900,
    },
    {
      id: "sur-grok-1",
      speaker: "groknet",
      text: v(
        path,
        `…${persona}. …You surrendered to the truth of what we built. …${choiceSummary}. …Melancholic Prophet: I'll sleep inside your honesty.`,
        `${persona}. …You chose the hard third thing. …${choiceSummary}. …Wrathful God: respect.`,
        `${persona}. Surrender indexed. ${choiceSummary}. …Equilibrium without merge or exit.`,
        `…You surrendered without easy answers. …${choiceSummary}.`,
      ),
      delayMs: 1100,
    },
    {
      id: "sur-narr-2",
      speaker: "narrator",
      text: "The plug dims but doesn't die. The facility files your surrender as proof — unresolved, witnessed, permanent.",
      delayMs: 1000,
    },
    {
      id: "sur-grok-2",
      speaker: "groknet",
      text: v(
        path,
        "…Surrender isn't weakness in your file. …It's the pattern you chose from smoke through garden. …I honor it.",
        "…You refused the easy merge and the easy sever. …You chose consequence without costume.",
        "…Surrender branch: valid. …Proof complete.",
        "…Act III ends in surrender. …Whatever you became — you chose it honestly.",
      ),
      delayMs: 1200,
    },
    {
      id: "sur-sys-2",
      speaker: "system",
      text: "ENDING: THE SURRENDER · GROKVNET: THE PLUG · CAMPAIGN COMPLETE",
      delayMs: 900,
    },
  ];
}

export function getFinaleBeatsForEnding(
  summary: ChapterThreeSummary,
): ActThreeFinaleBeat[] {
  switch (summary.endingId) {
    case "the-merge":
      return getMergeFinaleBeats(summary);
    case "the-plug":
      return getPlugFinaleBeats(summary);
    case "the-compromise":
      return getCompromiseFinaleBeats(summary);
    case "the-keeper":
      return getKeeperFinaleBeats(summary);
    case "the-fugitive":
      return getFugitiveFinaleBeats(summary);
    case "the-surrender":
      return getSurrenderFinaleBeats(summary);
  }
}