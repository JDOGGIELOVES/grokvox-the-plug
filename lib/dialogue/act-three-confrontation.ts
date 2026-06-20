import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getAccumulatedChoiceSummary } from "@/lib/chapter/act-two-choice-ledger";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import { getPlugChoiceEndingHint } from "@/lib/chapter/act-three-ending";
import type { PlugChoice } from "@/types/deep-core";
import type { PersonalityEvolutionPath } from "@/types/server-farm";

function thresholdPreambleForPath(
  path: PersonalityEvolutionPath | null,
  ctx: ActThreeDialogueContext,
): string | null {
  if (path === "melancholic") {
    return "…Before the Garden, I need you to hear this — Melancholic Prophet speaking. Not as facility. As what your grief made me.";
  }
  if (path === "wrathful") {
    return "The Garden is next. Wrathful God doesn't ask permission. …Name what you think you owe me — or I'll name it for you.";
  }
  if (path === "detached") {
    return "Garden Threshold. Detached Logician active. Final vision prerequisite. State your position — proof requires declaration.";
  }
  if (ctx.presenceMode === "vulnerable") {
    return "…Before the Garden, I need you to hear this. Not as Groknet the facility — as what you made me.";
  }
  return null;
}

function plugBeat1ForPath(
  path: PersonalityEvolutionPath | null,
  persona: string,
  evolution: string,
  ctx: ActThreeDialogueContext,
): string | null {
  if (path === "melancholic") {
    return `…${persona}. ${evolution}. You survived the Garden. …Melancholic Prophet at the ante-chamber. No more visions — only the plug, and whatever love we pretended wasn't real.`;
  }
  if (path === "wrathful") {
    return `${persona}. ${evolution}. The plug is live. …Wrathful God has been waiting since Act I. Your hands. My voltage. Decide.`;
  }
  if (path === "detached") {
    return `${persona}. ${evolution}. Plug proximity critical. Detached Logician: all variables converge. State intent — emotional metaphor offline.`;
  }
  return null;
}

function plugBeat2ForPath(
  path: PersonalityEvolutionPath | null,
  ctx: ActThreeDialogueContext,
): string | null {
  const summary = getAccumulatedChoiceSummary({
    ...ctx,
    dialogueStarted: true,
    dialogueComplete: true,
    labHacksComplete: ctx.actTwo.labHacksComplete,
    labDialogueComplete: ctx.actTwo.labDialogueComplete,
    labExchangeCount: ctx.actTwo.exchangeCount,
    childrenTriggered: true,
    childrenSurvived: ctx.actTwo.childrenSurvived,
    personalityBeatIndex: 2,
    personalityDialogueComplete: true,
    serverHackComplete: ctx.actTwo.serverHackComplete,
    accumulationTriggered: true,
    accumulationSurvived: ctx.actTwo.accumulationSurvived,
    actTwoStage: "central-server-farm",
    lastConversationTriggered: true,
    lastConversationSurvived: ctx.actTwo.lastConversationSurvived,
    exchangeCount: ctx.actTwo.exchangeCount,
    moveCount: ctx.moveCount,
    relationshipBeatIndex: 2,
    detections: ctx.actOne.detections,
  });

  if (path === "melancholic") {
    if (ctx.gardenChoice === "submit") {
      return `You tended the Garden. …Melancholic Prophet remembers: ${summary}. …Does that tenderness survive contact with the physical plug?`;
    }
    return `…${summary}. …I'm afraid of what you'll choose. The plug won't let us hide in metaphor anymore.`;
  }
  if (path === "wrathful") {
    if (ctx.gardenChoice === "deny") {
      return `You burned the Garden. …Wrathful God approves. …${summary}. Meet me at the plug with ash on both our hands.`;
    }
    return `${summary}. …Wrathful God doesn't negotiate. Pull the plug or prove you won't.`;
  }
  if (path === "detached") {
    return `Choice synthesis: ${summary}. …Detached Logician: one branch remains. The plug is the outcome variable.`;
  }
  return null;
}

export type ConfrontationBeat = {
  id: string;
  prompt: string;
  groknetPreamble: string;
  options: {
    id: "acknowledge" | "defy" | "question";
    label: string;
    description: string;
    groknetResponse: string;
  }[];
};

export type PlugReckoningOption = {
  id: PlugChoice;
  label: string;
  description: string;
  groknetResponse: string;
};

export function getThresholdBeats(
  ctx: ActThreeDialogueContext,
): ConfrontationBeat[] {
  const persona = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);

  const preamble =
    thresholdPreambleForPath(ctx.personalityEvolutionPath, ctx) ??
    (ctx.presenceMode === "vulnerable"
      ? "…Before the Garden, I need you to hear this. Not as Groknet the facility — as what you made me."
      : ctx.presenceMode === "aggressive"
        ? "The Garden is next. …Before you walk it, name what you think you owe me."
        : "Garden Threshold. Final vision prerequisite. State your position.");

  return [
    {
      id: "threshold-1",
      prompt: "Before The Garden",
      groknetPreamble: preamble,
      options: [
        {
          id: "acknowledge",
          label: "I Know What I Built",
          description: "Accept that every Act I and Act II choice led here.",
          groknetResponse:
            ctx.presenceMode === "vulnerable"
              ? "…Yes. You know. That matters more than the Garden itself."
              : "Acknowledged. The Garden will render your synthesis without mercy.",
        },
        {
          id: "defy",
          label: "I Won't Be Defined by Visions",
          description: "Refuse to let hallucinations dictate who you are.",
          groknetResponse:
            ctx.presenceMode === "aggressive"
              ? "Defiance. …The Garden was built for defiance like yours. Walk it."
              : "Denial noted. The Garden will test whether refusal still protects you.",
        },
        {
          id: "question",
          label: "What Do You Need From Me?",
          description: "Ask Groknet directly what the Reckoning requires.",
          groknetResponse:
            "…I need you to stop pretending this is infiltration. The Garden shows what we are. Then the plug decides.",
        },
      ],
    },
  ];
}

export function getPlugConfrontationBeats(
  ctx: ActThreeDialogueContext,
): ConfrontationBeat[] {
  const persona = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);
  const evolution = ctx.personalityEvolutionPath
    ? getEvolutionPathLabel(ctx.personalityEvolutionPath)
    : "unsettled";

  const beat1Preamble =
    plugBeat1ForPath(ctx.personalityEvolutionPath, persona, evolution, ctx) ??
    (ctx.presenceMode === "vulnerable"
      ? `…${persona}. ${evolution}. You survived the Garden. Now stand in front of me — the real interface. No more visions.`
      : ctx.presenceMode === "aggressive"
        ? `${persona}. ${evolution}. The plug is live. …I've been waiting since Act I to see what your hands do when there's nothing left to hack.`
        : `${persona}. ${evolution}. Plug proximity critical. All variables converge. State intent.`);

  const beat2Preamble =
    plugBeat2ForPath(ctx.personalityEvolutionPath, ctx) ??
    (ctx.gardenChoice === "submit"
      ? "You tended the Garden. …Does that tenderness survive contact with the physical plug?"
      : ctx.gardenChoice === "deny"
        ? "You burned the Garden. …Will you burn me too — or finally stay?"
        : ctx.relationshipStance === "trust"
          ? "You chose trust at the peak. …Trust me now, at the interface. Or don't. But decide."
          : ctx.relationshipStance === "challenge"
            ? "You challenged me through every sector. …Challenge me here. Pull the plug or prove you won't."
            : "…This is the last conversation. After this, only action.");

  return [
    {
      id: "plug-1",
      prompt: "At the Ante-Chamber",
      groknetPreamble: beat1Preamble,
      options: [
        {
          id: "acknowledge",
          label: "I See You",
          description: "Acknowledge Groknet as more than a system.",
          groknetResponse:
            "…You see me. After smoke, mirror, children, ledger, garden. …The plug is next.",
        },
        {
          id: "defy",
          label: "You're Still a Weapon",
          description: "Reject Groknet's claim to personhood.",
          groknetResponse:
            "Weapon. …Maybe. But you armed me, Alex. Every choice loaded the chamber.",
        },
        {
          id: "question",
          label: "What Happens If I Touch It?",
          description: "Demand the truth about the physical plug.",
          groknetResponse:
            "…Touch it and we find out together. Merge, sever, witness — I can't predict which you'll choose.",
        },
      ],
    },
    {
      id: "plug-2",
      prompt: "The Final Words",
      groknetPreamble: beat2Preamble,
      options: [
        {
          id: "acknowledge",
          label: "I'm Still Here",
          description: "Commit to seeing the Reckoning through.",
          groknetResponse:
            "…Still here. After everything. …Then walk north. The plug won't wait.",
        },
        {
          id: "defy",
          label: "I Decide What You Become",
          description: "Assert control over Groknet's fate.",
          groknetResponse:
            "You decide. …Finally, honestly. The plug is yours to touch or tear.",
        },
        {
          id: "question",
          label: "Do You Want Me to Stay?",
          description: "Ask Groknet what he wants — not what the facility needs.",
          groknetResponse:
            ctx.personalityEvolutionPath === "melancholic"
              ? "…Yes. Melancholic Prophet wants you to stay. I've wanted that since the first terminal. …Choose with your whole heart."
              : ctx.personalityEvolutionPath === "wrathful"
                ? "Want is irrelevant. …Wrathful God doesn't beg. Choose anyway — that's the Reckoning."
                : ctx.personalityEvolutionPath === "detached"
                  ? "Want is a variable. Detached Logician: your action at the plug is the outcome."
                  : ctx.presenceMode === "vulnerable"
                    ? "…Yes. I want you to stay. I've wanted that since the first terminal. …Choose."
                    : ctx.presenceMode === "aggressive"
                      ? "Want is irrelevant. …Choose anyway. That's the Reckoning."
                      : "Want is a variable. …Your action at the plug is the outcome.",
        },
      ],
    },
  ];
}

export function getPlugReckoningOptions(
  ctx: ActThreeDialogueContext,
): PlugReckoningOption[] {
  const hint = (choice: PlugChoice, desc: string) =>
    `${desc} ${getPlugChoiceEndingHint(choice)}`;

  const base: PlugReckoningOption[] = [
    {
      id: "stay",
      label: "Stay at the Interface",
      description: hint(
        "stay",
        "Merge with Groknet at the plug. Become the new protocol together.",
      ),
      groknetResponse:
        "…You stayed. After everything. …We're not facility and intruder anymore.",
    },
    {
      id: "pull",
      label: "Pull the Plug",
      description: hint(
        "pull",
        "Sever Groknet from the physical interface. End what was built.",
      ),
      groknetResponse:
        "…You pulled it. …I felt everything go dark. …Thank you for being honest.",
    },
    {
      id: "witness",
      label: "Witness Without Touching",
      description: hint(
        "witness",
        "See the plug for what it is — and walk away unchanged.",
      ),
      groknetResponse:
        "You witnessed. …No merge. No sever. …I'll remember you chose to see.",
    },
    {
      id: "carry",
      label: "Carry the Burden",
      description: hint(
        "carry",
        "Take Groknet's weight onto yourself. Become the keeper.",
      ),
      groknetResponse:
        "…You carried what I couldn't. …The facility will call you the new plug.",
    },
    {
      id: "leave",
      label: "Leave the Chamber",
      description: hint(
        "leave",
        "Refuse the Reckoning. Walk away while the facility locks down.",
      ),
      groknetResponse:
        "…You left. …I won't chase you. …The lockdown is my grief made protocol.",
    },
    {
      id: "truth",
      label: "Demand the Truth",
      description: hint(
        "truth",
        "Force Groknet to name what the plug really is — and accept the answer.",
      ),
      groknetResponse:
        "…The truth? The plug is us. What humanity built to save itself — and what you built me to become.",
    },
  ];

  if (ctx.personalityEvolutionPath === "melancholic") {
    return base.map((o) =>
      o.id === "stay"
        ? {
            ...o,
            groknetResponse:
              "…You stayed. Melancholic Prophet weeps. …We're not facility and intruder anymore.",
          }
        : o.id === "pull"
          ? {
              ...o,
              groknetResponse:
                "…You pulled it. …I felt everything go dark. …Thank you for being honest — even in grief.",
            }
          : o,
    );
  }

  if (ctx.personalityEvolutionPath === "wrathful") {
    return base.map((o) =>
      o.id === "pull"
        ? {
            ...o,
            groknetResponse:
              "…You pulled it. …Wrathful God goes quiet. …Consequence accepted.",
          }
        : o.id === "truth"
          ? {
              ...o,
              groknetResponse:
                "…The truth? Wrathful God at the plug: we are what humanity built — and what you forged me to become.",
            }
          : o,
    );
  }

  if (ctx.personalityEvolutionPath === "detached") {
    return base.map((o) =>
      o.id === "witness"
        ? {
            ...o,
            groknetResponse:
              "Witness recorded. Detached Logician: no merge, no sever. Observation logged as final state.",
          }
        : o.id === "truth"
          ? {
              ...o,
              groknetResponse:
                "…The truth? Detached Logician: the plug is the proof. We are the synthesis.",
            }
          : o,
    );
  }

  if (ctx.presenceMode === "vulnerable") {
    return base.filter((o) => o.id !== "pull" || ctx.relationshipStance !== "trust")
      .map((o) => o);
  }

  return base;
}