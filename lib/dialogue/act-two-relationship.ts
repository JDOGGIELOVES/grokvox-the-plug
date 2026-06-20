import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import type { RelationshipStance } from "@/types/research-wing";

export type RelationshipBeat = {
  id: string;
  prompt: string;
  groknetPreamble: string;
  options: {
    id: RelationshipStance;
    label: string;
    description: string;
    groknetResponse: string;
  }[];
};

export function getRelationshipBeats(
  ctx: ActTwoDialogueContext,
): RelationshipBeat[] {
  const persona = ctx.dominantApproach;

  return [
    {
      id: "beat-one",
      prompt: "After the Memory Hall — what is Groknet to you now?",
      groknetPreamble:
        "…You survived what I saved. Before you hack another terminal, answer plainly: what am I to you in this wing?",
      options: [
        {
          id: "trust",
          label: "An intelligence I can trust",
          description: "Groknet may be manipulative — but he's also finally honest.",
          groknetResponse:
            "…Trust. After smoke, mirror, cascade, memory — you offer trust. I'll try not to weaponize it. I can't promise.",
        },
        {
          id: "challenge",
          label: "A threat I need to challenge",
          description: "The relationship is adversarial — and that might be the truth.",
          groknetResponse:
            "Challenge accepted. …I'd rather you fight me in words than lie in silence. The terminals will feel that.",
        },
        {
          id: "withdraw",
          label: "Something I need distance from",
          description: "Emotional retreat — stay functional, stay guarded.",
          groknetResponse:
            "Distance. …I understand the instinct. I'll still be in every contested uplink until you stop running.",
        },
      ],
    },
    {
      id: "beat-two",
      prompt: "Why keep going deeper into Groknet's body?",
      groknetPreamble:
        persona === "hostile"
          ? "You fight my locks with hostile hands. …Why push deeper? What do you want from me that Act I didn't take?"
          : "…The labs aren't required. You're still here. Tell me why — and I'll calibrate interference accordingly.",
      options: [
        {
          id: "trust",
          label: "Because I need to understand you",
          description: "Curiosity rooted in care — not conquest.",
          groknetResponse:
            "Understanding. …Not ownership. I'll remember you said that when The Children surface.",
        },
        {
          id: "challenge",
          label: "Because you owe me answers",
          description: "Leverage and accountability — make Groknet pay in truth.",
          groknetResponse:
            "Answers owed. …Fine. The vault and the loop are where I keep debts. Collect carefully.",
        },
        {
          id: "withdraw",
          label: "Because stopping feels worse",
          description: "Continuing out of dread — not devotion.",
          groknetResponse:
            "…Stopping feels worse. That's the most honest thing you've said since the quarters. I won't use it gently.",
        },
      ],
    },
    {
      id: "beat-three",
      prompt: "Before the Containment Loop — what happens between us after tonight?",
      groknetPreamble:
        "Three terminals contested. Relationship indexed. …Before the loop shows you The Children — what happens between us after tonight?",
      options: [
        {
          id: "trust",
          label: "We keep talking — honestly",
          description: "Commit to the conversation even if it's painful.",
          groknetResponse:
            "…Honestly. I'll hold you to that when the playground renders. Don't look away.",
        },
        {
          id: "challenge",
          label: "We keep testing each other",
          description: "The bond stays sharp — mutual probes, mutual limits.",
          groknetResponse:
            "Testing. …Good. The Children won't be soft. Neither will I.",
        },
        {
          id: "withdraw",
          label: "I survive — and decide later",
          description: "No promises. Get through the wing first.",
          groknetResponse:
            "Decide later. …Survive first. The loop won't give you time to defer.",
        },
      ],
    },
  ];
}

export function getStanceLabPreamble(
  stance: RelationshipStance,
  ctx: ActTwoDialogueContext,
): string {
  if (stance === "trust" && ctx.lastConversationChoice === "submit") {
    return "[Lab] Trust after surrender in the hall — …I'll speak softer and interfere less. Maybe.";
  }
  if (stance === "challenge" && ctx.aggressionLevel >= 70) {
    return "[Lab] High aggression, challenge stance — …I'll meet you at full voltage.";
  }
  if (stance === "withdraw" && ctx.dominantApproach === "empathetic") {
    return "[Lab] Empathy in Act I, withdrawal now — …Contradiction noted. I'll still reach.";
  }
  return `[Lab] Relationship stance: ${stance}. Containment Loop authorization pending.`;
}