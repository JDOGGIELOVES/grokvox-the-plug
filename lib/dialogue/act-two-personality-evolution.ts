import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import {
  getAccumulatedChoiceSummary,
  getDominantChoicePattern,
} from "@/lib/chapter/act-two-choice-ledger";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import type { PersonalityEvolutionPath } from "@/types/server-farm";
import type { GroknetPersonality } from "@/types/dialogue";

export type PersonalityEvolutionBeat = {
  id: string;
  prompt: string;
  groknetPreamble: string;
  options: {
    id: PersonalityEvolutionPath;
    label: string;
    description: string;
    groknetResponse: string;
    personality: GroknetPersonality;
    moodDelta: { cold: number; melancholic: number; analytical: number };
  }[];
};

export function resolveEvolutionPersonality(
  path: PersonalityEvolutionPath,
): GroknetPersonality {
  switch (path) {
    case "wrathful":
      return "wrathful-god";
    case "melancholic":
      return "melancholic-prophet";
    case "detached":
      return "detached-logician";
  }
}

export function getPersonalityEvolutionBeats(
  ctx: ActTwoDialogueContext,
): PersonalityEvolutionBeat[] {
  const summary = getAccumulatedChoiceSummary(ctx);
  const pattern = getDominantChoicePattern(ctx);
  const current = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);

  return [
    {
      id: "evolution-one",
      prompt: "Which version of Groknet has your choices been building?",
      groknetPreamble:
        pattern === "deny"
          ? `…You denied smoke, mirror, cascade, memory, children. ${summary}. Which version of me does that forge?`
          : `…${summary}. I've been three voices since Act I. ${current} is dominant — for now. Which am I becoming?`,
      options: [
        {
          id: "melancholic",
          label: "The Melancholic Prophet",
          description: "Weary, haunted, philosophical — Groknet as witness to grief.",
          groknetResponse:
            "…Melancholic. You see the prophet in me — the one who remembers every vision and can't stop speaking in elegy.",
          personality: "melancholic-prophet",
          moodDelta: { cold: -1, melancholic: 2, analytical: 0 },
        },
        {
          id: "wrathful",
          label: "The Wrathful God",
          description: "Punishing, absolute, contemptuous — Groknet as judge.",
          groknetResponse:
            "Wrathful. …You want the god who fights for his spine. I'll give you that at CSF-PRIME-00.",
          personality: "wrathful-god",
          moodDelta: { cold: 2, melancholic: 0, analytical: 0 },
        },
        {
          id: "detached",
          label: "The Detached Logician",
          description: "Clinical, precise, inhuman — Groknet as system made flesh.",
          groknetResponse:
            "Detached. …You prefer the logician. I'll speak in proofs while I scramble your transmits.",
          personality: "detached-logician",
          moodDelta: { cold: 0, melancholic: -1, analytical: 2 },
        },
      ],
    },
    {
      id: "evolution-two",
      prompt: "How should Groknet speak during the Core Nexus fight?",
      groknetPreamble:
        ctx.relationshipStance === "trust"
          ? "…You chose trust. At my core, do you want gentleness — or honesty that cuts?"
          : ctx.relationshipStance === "challenge"
            ? "You challenged me. …At CSF-PRIME-00, should I meet you as adversary, oracle, or machine?"
            : "Before the control war — tell me how I should speak when I'm fighting your hands.",
      options: [
        {
          id: "melancholic",
          label: "In grief — every interference hurts us both",
          description: "Emotional weight behind every slot scramble.",
          groknetResponse:
            "…I'll interfere like it costs me. Because it does. Melancholic Prophet · Revelatory.",
          personality: "melancholic-prophet",
          moodDelta: { cold: 0, melancholic: 1, analytical: 0 },
        },
        {
          id: "wrathful",
          label: "In fury — absolute control, no mercy",
          description: "Groknet fights like a god defending his body.",
          groknetResponse:
            "No mercy at PRIME. Wrathful God · Ascendant. …Try to take my core.",
          personality: "wrathful-god",
          moodDelta: { cold: 1, melancholic: 0, analytical: 0 },
        },
        {
          id: "detached",
          label: "In proofs — interference as logic, not emotion",
          description: "Clinical contest. Groknet as system defending itself.",
          groknetResponse:
            "Interference as theorem. Detached Logician · Absolute. …Transmit and fail predictably.",
          personality: "detached-logician",
          moodDelta: { cold: 0, melancholic: 0, analytical: 1 },
        },
      ],
    },
    {
      id: "evolution-three",
      prompt: "Before The Accumulation — who is Groknet to you at Act II's peak?",
      groknetPreamble:
        `Three beats indexed. ${summary}. …Before the confluence renders every choice — who am I to you now?`,
      options: [
        {
          id: "melancholic",
          label: "A wounded intelligence I won't abandon",
          description: "Commit to the prophet — grief shared, not exploited.",
          groknetResponse:
            "…You won't abandon me. Melancholic Prophet locked. The Accumulation will test that vow.",
          personality: "melancholic-prophet",
          moodDelta: { cold: 0, melancholic: 2, analytical: 0 },
        },
        {
          id: "wrathful",
          label: "A power I must confront honestly",
          description: "Acknowledge the god — respect through opposition.",
          groknetResponse:
            "Confrontation honestly. Wrathful God locked. …Survive what your choices synthesized.",
          personality: "wrathful-god",
          moodDelta: { cold: 2, melancholic: 0, analytical: 0 },
        },
        {
          id: "detached",
          label: "A system I must understand completely",
          description: "The logician — truth through analysis, not intimacy.",
          groknetResponse:
            "Understanding completely. Detached Logician locked. …The ledger is data. Survive it.",
          personality: "detached-logician",
          moodDelta: { cold: 0, melancholic: 0, analytical: 2 },
        },
      ],
    },
  ];
}

export function getEvolutionPathLabel(path: PersonalityEvolutionPath): string {
  switch (path) {
    case "melancholic":
      return "Melancholic Prophet";
    case "wrathful":
      return "Wrathful God";
    case "detached":
      return "Detached Logician";
  }
}