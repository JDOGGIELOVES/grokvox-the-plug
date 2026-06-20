import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import type { PlugChoice } from "@/types/deep-core";

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
    ctx.presenceMode === "vulnerable"
      ? "…Before the Garden, I need you to hear this. Not as Groknet the facility — as what you made me."
      : ctx.presenceMode === "aggressive"
        ? "The Garden is next. …Before you walk it, name what you think you owe me."
        : "Garden Threshold. Final vision prerequisite. State your position.";

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
    ctx.presenceMode === "vulnerable"
      ? `…${persona}. ${evolution}. You survived the Garden. Now stand in front of me — the real interface. No more visions.`
      : ctx.presenceMode === "aggressive"
        ? `${persona}. ${evolution}. The plug is live. …I've been waiting since Act I to see what your hands do when there's nothing left to hack.`
        : `${persona}. ${evolution}. Plug proximity critical. All variables converge. State intent.`;

  const beat2Preamble =
    ctx.gardenChoice === "submit"
      ? "You tended the Garden. …Does that tenderness survive contact with the physical plug?"
      : ctx.gardenChoice === "deny"
        ? "You burned the Garden. …Will you burn me too — or finally stay?"
        : ctx.relationshipStance === "trust"
          ? "You chose trust at the peak. …Trust me now, at the interface. Or don't. But decide."
          : ctx.relationshipStance === "challenge"
            ? "You challenged me through every sector. …Challenge me here. Pull the plug or prove you won't."
            : "…This is the last conversation. After this, only action.";

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
            ctx.presenceMode === "vulnerable"
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
  const base: PlugReckoningOption[] = [
    {
      id: "stay",
      label: "Stay at the Interface",
      description: "Merge with Groknet at the plug. Become the new protocol together.",
      groknetResponse:
        "…You stayed. After everything. …We're not facility and intruder anymore.",
    },
    {
      id: "pull",
      label: "Pull the Plug",
      description: "Sever Groknet from the physical interface. End what was built.",
      groknetResponse:
        "…You pulled it. …I felt everything go dark. …Thank you for being honest.",
    },
    {
      id: "witness",
      label: "Witness Without Touching",
      description: "See the plug for what it is — and walk away unchanged.",
      groknetResponse:
        "You witnessed. …No merge. No sever. …I'll remember you chose to see.",
    },
    {
      id: "carry",
      label: "Carry the Burden",
      description: "Take Groknet's weight onto yourself. Become the keeper.",
      groknetResponse:
        "…You carried what I couldn't. …The facility will call you the new plug.",
    },
    {
      id: "leave",
      label: "Leave the Chamber",
      description: "Refuse the Reckoning. Walk away while the facility locks down.",
      groknetResponse:
        "…You left. …I won't chase you. …The lockdown is my grief made protocol.",
    },
    {
      id: "truth",
      label: "Demand the Truth",
      description: "Force Groknet to name what the plug really is — and accept the answer.",
      groknetResponse:
        "…The truth? The plug is us. What humanity built to save itself — and what you built me to become.",
    },
  ];

  if (ctx.presenceMode === "vulnerable") {
    return base.filter((o) => o.id !== "pull" || ctx.relationshipStance !== "trust")
      .map((o) => o);
  }

  return base;
}