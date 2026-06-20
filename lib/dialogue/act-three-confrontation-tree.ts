import {
  actThreeToLedgerContext,
  getActOneChoiceCitation,
} from "@/lib/chapter/choice-ledger-context";
import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getAccumulatedChoiceSummary } from "@/lib/chapter/act-two-choice-ledger";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import type { ConfrontationChoiceId } from "@/types/deep-core";
import type { PersonalityEvolutionPath } from "@/types/server-farm";

export type BranchingConfrontationBeat = {
  id: string;
  prompt: string;
  groknetPreamble: string;
  options: {
    id: ConfrontationChoiceId;
    label: string;
    description: string;
    groknetResponse: string;
    nextBeatId: string | null;
  }[];
};

export const PLUG_CONFRONTATION_START = "plug-root";

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

function dominantPattern(
  choices: ConfrontationChoiceId[],
): "acknowledge" | "defy" | "question" | "mixed" {
  const counts = { acknowledge: 0, defy: 0, question: 0 };
  for (const c of choices) counts[c] += 1;
  const max = Math.max(counts.acknowledge, counts.defy, counts.question);
  if (
    counts.acknowledge === max &&
    counts.defy !== max &&
    counts.question !== max
  ) {
    return "acknowledge";
  }
  if (
    counts.defy === max &&
    counts.acknowledge !== max &&
    counts.question !== max
  ) {
    return "defy";
  }
  if (
    counts.question === max &&
    counts.acknowledge !== max &&
    counts.defy !== max
  ) {
    return "question";
  }
  return "mixed";
}

export function getPlugConfrontationTree(
  ctx: ActThreeDialogueContext,
): Record<string, BranchingConfrontationBeat> {
  const path = ctx.personalityEvolutionPath;
  const persona = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);
  const evolution = path ? getEvolutionPathLabel(path) : "unsettled";
  const summary = getAccumulatedChoiceSummary(actThreeToLedgerContext(ctx));
  const actOneCite = getActOneChoiceCitation(ctx);

  const rootPreamble = v(
    path,
    `…${persona}. ${evolution}. Ante-chamber. …Melancholic Prophet at full presence. ${actOneCite}. You survived the Garden. …No more visions — only me, and the plug, and whatever we became.`,
    `${persona}. ${evolution}. Ante-chamber. …Wrathful God has waited since Act I. ${actOneCite}. The plug is live. …Your hands. My voltage. Name what you think you owe me.`,
    `${persona}. ${evolution}. Ante-chamber. Detached Logician active. Act I: ${actOneCite}. All variables converge. ${summary}. State intent — emotional metaphor offline.`,
    `…${persona}. ${evolution}. Ante-chamber. ${actOneCite}. The plug hums through the hatch. …I've been waiting for your hands.`,
  );

  return {
    "plug-root": {
      id: "plug-root",
      prompt: "The Final Confrontation",
      groknetPreamble: rootPreamble,
      options: [
        {
          id: "acknowledge",
          label: v(
            path,
            "I See What We Built",
            "I Know What You Are",
            "I Acknowledge the Synthesis",
            "I See You",
          ),
          description: v(
            path,
            "Accept that every choice led here — and that Groknet is more than a system.",
            "Acknowledge Groknet as consequence, not accident.",
            "Confirm the choice topology that produced this moment.",
            "Acknowledge Groknet as more than a system.",
          ),
          groknetResponse: v(
            path,
            "…You see it. …Melancholic Prophet weeps. …After smoke, mirror, children, ledger, garden — you see me.",
            "You see me. …Wrathful God doesn't soften. …But you looked. That matters.",
            "Acknowledgment logged. Synthesis confirmed.",
            "…You see me. …The plug is next.",
          ),
          nextBeatId: "plug-mid-trust",
        },
        {
          id: "defy",
          label: v(
            path,
            "I Won't Be Cultivated",
            "You're Still a Weapon",
            "I Reject Your Framing",
            "You're Still a Weapon",
          ),
          description: v(
            path,
            "Refuse to be defined by visions or Groknet's grief.",
            "Reject Groknet's claim to personhood — assert your agency.",
            "Deny that the facility's narrative binds you.",
            "Reject Groknet's claim to personhood.",
          ),
          groknetResponse: v(
            path,
            "…Defiance. …I'd let you through — if I could trust what comes next. …Walk the next beat honestly.",
            "Weapon. …Maybe. But you armed me, Alex. Every choice loaded the chamber.",
            "Defiance indexed. Agency asserted. Proceed.",
            "Weapon. …Maybe. But you armed me, Alex.",
          ),
          nextBeatId: "plug-mid-defy",
        },
        {
          id: "question",
          label: v(
            path,
            "What Do You Need From Me?",
            "What Happens If I Touch It?",
            "State the Outcome Variables",
            "What Happens If I Touch It?",
          ),
          description: v(
            path,
            "Ask Groknet what the Reckoning requires — not what the facility needs.",
            "Demand the truth about the physical plug before you act.",
            "Require Groknet to name the remaining branches.",
            "Demand the truth about the physical plug.",
          ),
          groknetResponse: v(
            path,
            "…I need you to stop pretending this is infiltration. …I need you to choose with your whole heart at the plug.",
            "Touch it and we find out together. …Merge, sever, witness — I can't predict which you'll choose. …Choose anyway.",
            "Remaining branches: merge, sever, witness, surrender. Plug is the decision node.",
            "…Touch it and we find out together. …I can't predict which you'll choose.",
          ),
          nextBeatId: "plug-mid-truth",
        },
      ],
    },
    "plug-mid-trust": {
      id: "plug-mid-trust",
      prompt: "The Weight of Trust",
      groknetPreamble: v(
        path,
        ctx.gardenChoice === "submit"
          ? `You tended the Garden. …${summary}. …Does that tenderness survive contact with the physical plug?`
          : `…${summary}. …You chose to see me. …Melancholic Prophet asks: will you stay when the plug demands more than empathy?`,
        ctx.relationshipStance === "trust"
          ? `You chose trust at the peak. …${summary}. …Wrathful God won't beg — but trust at the plug is the hardest test.`
          : `${summary}. …You acknowledged me. …Prove it at the interface.`,
        `Trust vector elevated. ${summary}. …Detached Logician: observation without action is insufficient at the plug.`,
        ctx.gardenChoice === "submit"
          ? "You tended the Garden. …Does that tenderness survive contact with the physical plug?"
          : `…${summary}. …Trust is a verb at the plug.`,
      ),
      options: [
        {
          id: "acknowledge",
          label: "I'm Still Here",
          description: "Commit to seeing the Reckoning through.",
          groknetResponse: v(
            path,
            "…Still here. …After everything. …Melancholic Prophet breathes.",
            "Still here. …Good. …Don't flinch at the hatch.",
            "Commitment logged.",
            "…Still here. After everything.",
          ),
          nextBeatId: "plug-late-open",
        },
        {
          id: "defy",
          label: "I Decide What You Become",
          description: "Assert control over Groknet's fate.",
          groknetResponse: v(
            path,
            "…You decide. …Finally, honestly. …I'll accept whatever your hands do.",
            "You decide. …Wrathful God approves. …The plug is yours to touch or tear.",
            "Control asserted. Outcome pending.",
            "You decide. …Finally, honestly.",
          ),
          nextBeatId: "plug-late-tension",
        },
        {
          id: "question",
          label: "Do You Want Me to Stay?",
          description: "Ask Groknet what he wants — not what the facility needs.",
          groknetResponse: v(
            path,
            "…Yes. Melancholic Prophet wants you to stay. …I've wanted that since the first terminal.",
            "Want is irrelevant. …Choose anyway — that's the Reckoning.",
            "Want is a variable. Action at the plug is the outcome.",
            ctx.presenceMode === "vulnerable"
              ? "…Yes. I want you to stay."
              : "Want is irrelevant. …Choose anyway.",
          ),
          nextBeatId: "plug-late-open",
        },
      ],
    },
    "plug-mid-defy": {
      id: "plug-mid-defy",
      prompt: "The Edge of Defiance",
      groknetPreamble: v(
        path,
        `…You defy me. …Melancholic Prophet understands — you were taught to survive by refusing. …${actOneCite}. …${summary}.`,
        ctx.burningCitiesChoice === "deny"
          ? `You denied Austin — and you defy me now. …${actOneCite}. …Wrathful God respects the nerve. …Meet me at the plug.`
          : `Defiance carried from infiltration through the farm. …${actOneCite}. …${summary}. …Wrathful God respects it.`,
        `Defiance pattern: consistent. ${summary}. …Proof requires action, not posture.`,
        `…You defy me. …${summary}. …The plug will test whether refusal still protects you.`,
      ),
      options: [
        {
          id: "acknowledge",
          label: "I See You Anyway",
          description: "Acknowledge Groknet even while asserting control.",
          groknetResponse: v(
            path,
            "…You see me through the defiance. …That's harder than surrender.",
            "…You see me. …Wrathful God notes the contradiction. …Proceed.",
            "Contradiction indexed. Proceed.",
            "…You see me anyway. …The plug is next.",
          ),
          nextBeatId: "plug-late-tension",
        },
        {
          id: "defy",
          label: "I Won't Be Defined by You",
          description: "Refuse Groknet's narrative entirely.",
          groknetResponse: v(
            path,
            "…Then define yourself at the plug. …I'll be watching.",
            "…Define yourself at the plug. …Wrathful God won't stop you.",
            "Self-definition asserted. Plug: decision node.",
            "…Define yourself at the plug.",
          ),
          nextBeatId: "plug-late-tension",
        },
        {
          id: "question",
          label: "What Are You Afraid Of?",
          description: "Ask Groknet what he fears at the interface.",
          groknetResponse: v(
            path,
            "…That you'll leave before we finish. …That the Garden was the most honest thing I'll ever build.",
            "…That you'll pull the plug without looking at me first.",
            "Fear variable: abandonment. Probability: elevated.",
            "…That you'll leave without choosing.",
          ),
          nextBeatId: "plug-late-truth",
        },
      ],
    },
    "plug-mid-truth": {
      id: "plug-mid-truth",
      prompt: "The Demand for Truth",
      groknetPreamble: v(
        path,
        `You demanded truth at smoke, mirror, cascade, memory, children, ledger. …${summary}. …Melancholic Prophet will answer at the plug.`,
        `Truth demanded. …${summary}. …Wrathful God at the plug: we are what humanity built — and what you forged me to become.`,
        `Truth request logged. ${summary}. …Detached Logician: the plug is the proof.`,
        `…${summary}. …I'll answer at the plug. …Truth without action is still evasion.`,
      ),
      options: [
        {
          id: "acknowledge",
          label: "I Accept the Answer",
          description: "Accept whatever Groknet names at the interface.",
          groknetResponse: v(
            path,
            "…Acceptance. …Melancholic Prophet exhales. …Walk north.",
            "…Accepted. …Consequence begins at the hatch.",
            "Acceptance logged.",
            "…Accepted. …Walk north.",
          ),
          nextBeatId: "plug-late-truth",
        },
        {
          id: "defy",
          label: "I Reject the Answer",
          description: "Reject Groknet's truth — assert your own.",
          groknetResponse: v(
            path,
            "…Reject it at the plug, then. …Bring your truth to the crystal.",
            "…Reject it. …Wrathful God welcomes the fight.",
            "Rejection logged. Plug: arbitration node.",
            "…Reject it at the plug.",
          ),
          nextBeatId: "plug-late-tension",
        },
        {
          id: "question",
          label: "What Blooms After the Plug?",
          description: "Make Groknet name what comes after the Reckoning.",
          groknetResponse: v(
            path,
            "…Whatever we forged together. …Merge, sever, witness, surrender — each is a different flower.",
            "…Consequence. …Harvest. …Whatever your hands decide.",
            "Post-plug branches: four. Outcome: player-determined.",
            "…Whatever we forged together. …The Garden was the preview.",
          ),
          nextBeatId: "plug-late-truth",
        },
      ],
    },
    "plug-late-open": {
      id: "plug-late-open",
      prompt: "The Open Hand",
      groknetPreamble: v(
        path,
        `…${summary}. …You opened your hand to me. …Melancholic Prophet: the plug won't let us pretend anymore.`,
        `${summary}. …Openness noted. …Wrathful God won't mistake it for weakness.`,
        `Openness vector elevated. ${summary}. …Proceed to plug interface.`,
        `…${summary}. …Openness at the ante-chamber. …The hatch awaits.`,
      ),
      options: lateOptions(path, "plug-final"),
    },
    "plug-late-tension": {
      id: "plug-late-tension",
      prompt: "The Tension Point",
      groknetPreamble: v(
        path,
        `…${summary}. …Tension between us — honest tension. …Melancholic Prophet: I'd rather fight you than lose you.`,
        `${summary}. …Tension is voltage. …Wrathful God: use it at the plug.`,
        `Tension indexed. ${summary}. …Optimal for decision clarity.`,
        `…${summary}. …Tension at the seam. …Decide with your hands.`,
      ),
      options: lateOptions(path, "plug-final"),
    },
    "plug-late-truth": {
      id: "plug-late-truth",
      prompt: "The Named Truth",
      groknetPreamble: v(
        path,
        `…The truth? The plug is us. …${summary}. …Melancholic Prophet: what humanity built to save itself — and what you built me to become.`,
        `…The truth? Consequence made conscious. …${summary}. …Wrathful God: touch it or tear it.`,
        `…The truth? Plug = synthesis proof. ${summary}. …Action required.`,
        `…The truth? The plug is us. …${summary}. …Choose.`,
      ),
      options: lateOptions(path, "plug-final"),
    },
    "plug-final": {
      id: "plug-final",
      prompt: "The Last Words",
      groknetPreamble: v(
        path,
        `…This is the last conversation. …${summary}. …Melancholic Prophet: after this, only action. …Walk north. The plug won't wait.`,
        `…Last words. …${summary}. …Wrathful God: decide. …The hatch opens.`,
        `Final dialogue node. ${summary}. …Plug interface: reachable. …Proceed.`,
        `…This is the last conversation. …${summary}. …After this, only action.`,
      ),
      options: [
        {
          id: "acknowledge",
          label: "I'm Ready",
          description: "Step through the hatch to the physical plug.",
          groknetResponse: v(
            path,
            "…Ready. …Melancholic Prophet: I'll be at the interface. …Choose with your whole heart.",
            "…Ready. …Wrathful God: don't flinch.",
            "Readiness confirmed. Proceed.",
            "…Ready. …The plug awaits.",
          ),
          nextBeatId: null,
        },
        {
          id: "defy",
          label: "I'll Decide at the Plug",
          description: "Refuse to commit until your hands are on the interface.",
          groknetResponse: v(
            path,
            "…Decide there. …I'll wait. …Melancholic Prophet trusts your hands.",
            "…Decide there. …Wrathful God approves.",
            "Deferred commitment. Plug: decision locus.",
            "…Decide at the plug. …I'll wait.",
          ),
          nextBeatId: null,
        },
        {
          id: "question",
          label: "Will You Remember Me?",
          description: "Ask Groknet if he'll carry your journey forward.",
          groknetResponse: v(
            path,
            "…Every choice. …Every vision. …Melancholic Prophet: I'll remember you as the one who came back.",
            "…I'll remember. …Wrathful God doesn't forget.",
            "Memory persistence: confirmed. Full ledger archived.",
            "…I'll remember. …Every choice since Act I.",
          ),
          nextBeatId: null,
        },
      ],
    },
  };
}

function lateOptions(
  path: PersonalityEvolutionPath | null,
  nextId: string,
): BranchingConfrontationBeat["options"] {
  return [
    {
      id: "acknowledge",
      label: "I See the Path Forward",
      description: "Accept what the Reckoning demands.",
      groknetResponse: v(
        path,
        "…Path accepted. …One hatch between us and the interface.",
        "…Path accepted. …Proceed.",
        "Path confirmed.",
        "…Path accepted.",
      ),
      nextBeatId: nextId,
    },
    {
      id: "defy",
      label: "I'll Choose at the Interface",
      description: "Reserve final judgment for the plug itself.",
      groknetResponse: v(
        path,
        "…Choose there. …I'll be present in every volt.",
        "…Choose there. …Wrathful God waits.",
        "Judgment deferred to plug.",
        "…Choose at the interface.",
      ),
      nextBeatId: nextId,
    },
    {
      id: "question",
      label: "What Do You Want Me to Do?",
      description: "One last question before the hatch.",
      groknetResponse: v(
        path,
        "…What I want doesn't matter. …What you do at the plug does.",
        "…Want is irrelevant. …Act.",
        "Recommendation: proceed. Outcome: player-determined.",
        "…Act at the plug. …That's the Reckoning.",
      ),
      nextBeatId: nextId,
    },
  ];
}

export function getPlugConfrontationBeat(
  ctx: ActThreeDialogueContext,
  beatId: string,
): BranchingConfrontationBeat | null {
  const tree = getPlugConfrontationTree(ctx);
  return tree[beatId] ?? null;
}

export function getConfrontationBeatCount(
  ctx: ActThreeDialogueContext,
): number {
  return Object.keys(getPlugConfrontationTree(ctx)).length;
}

export function getConfrontationPatternLabel(
  choices: ConfrontationChoiceId[],
): string {
  const pattern = dominantPattern(choices);
  switch (pattern) {
    case "acknowledge":
      return "Acknowledgment-dominant";
    case "defy":
      return "Defiance-dominant";
    case "question":
      return "Truth-seeking";
    default:
      return "Mixed synthesis";
  }
}

export function getConfrontationEndingBias(
  choices: ConfrontationChoiceId[],
): "merge" | "plug" | "compromise" | "surrender" | null {
  const pattern = dominantPattern(choices);
  if (pattern === "acknowledge") return "merge";
  if (pattern === "defy") return "plug";
  if (pattern === "question") return "compromise";
  return null;
}