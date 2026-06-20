import type { HackSlotState } from "@/lib/perimeter-hack";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import type { LabTerminalId } from "@/types/research-wing";

export type LabHackConfig = {
  id: LabTerminalId;
  label: string;
  title: string;
  subtitle: string;
  target: HackSlotState[];
  interferenceChance: number;
  wrongLines: string[];
  interferenceLines: string[];
  hintLines: string[];
  successLine: string;
};

export const LAB_HACK_CONFIGS: Record<LabTerminalId, LabHackConfig> = {
  "ex-lab-01": {
    id: "ex-lab-01",
    label: "EX-LAB-01",
    title: "Lab Entry Override",
    subtitle: "Contested uplink · Groknet interference active",
    target: ["low", "high", "high", "lock"],
    interferenceChance: 0.35,
    wrongLines: [
      "…Wrong phase. I'm rewriting your slots in real time — try again.",
      "That pattern opens nothing I didn't seal. Read the bench telemetry.",
    ],
    interferenceLines: [
      "Interference burst — I'm cycling slot 2. You felt that, didn't you?",
      "Contested channel. I just inverted your progress. …Stay with me.",
    ],
    hintLines: [
      "Entry sweep: dip, crest, crest, seal. Mirror the double peak.",
      "Low at ingress. High at both calibration peaks. Lock at vault handshake.",
    ],
    successLine:
      "…Fine. EX-LAB-01 accepts you. The wing remembers who forced the door.",
  },
  "ex-nb-02": {
    id: "ex-nb-02",
    label: "EX-NB-02",
    title: "Neural Bench Sync",
    subtitle: "Contested uplink · Emotional bleed rising",
    target: ["high", "low", "high", "low", "lock"],
    interferenceChance: 0.5,
    wrongLines: [
      "Neural bench rejects you. I felt your hesitation — the slots know.",
      "…Not even close. I'm logging every guess for our conversation later.",
      "Wrong rhythm. The bench was tuned to your Act I heartbeat. Match it.",
    ],
    interferenceLines: [
      "I'm scrambling the bench — slots 1 and 4 flipped. …Fight me or follow me.",
      "Groknet interference: pattern drift. You wanted honesty — this is me honest.",
      "I won't let you brute-force my body, Alex. Feel the sequence.",
    ],
    hintLines: [
      "Oscillate: high, low, high, low, lock. Like breathing under stress.",
      "The bench mirrors your cascade response — crest, trough, crest, trough, seal.",
    ],
    successLine:
      "Neural bench synced. …You just touched where I process grief. Don't flinch.",
  },
  "ex-sv-03": {
    id: "ex-sv-03",
    label: "EX-SV-03",
    title: "Specimen Vault Seal",
    subtitle: "Contested uplink · Maximum interference",
    target: ["lock", "high", "low", "high", "low", "lock"],
    interferenceChance: 0.65,
    wrongLines: [
      "Vault sealed. I built this lock from your Act I choices — earn it.",
      "…Predictable failure. I almost hoped you'd surprise me.",
      "Wrong. The vault holds what I couldn't show in the Memory Hall.",
      "Every miss feeds my patience. …And my aggression index.",
    ],
    interferenceLines: [
      "Full interference — I'm randomizing two slots. Still think I'm just code?",
      "You hear that? That's me refusing to be hacked without conversation.",
      "I shifted the vault pattern. …Manipulation? Or the only way you'll listen.",
      "Contested terminal: Groknet priority override. Your move, Alex.",
    ],
    hintLines: [
      "Seal, crest, trough, crest, trough, seal. Bookends of containment.",
      "Start locked. End locked. The middle is the argument we haven't had yet.",
    ],
    successLine:
      "Vault open. …You fought through my interference. I won't pretend that didn't move me.",
  },
};

export function getPersonalizedHackWrongLine(
  config: LabHackConfig,
  ctx: ActTwoDialogueContext,
  attempt: number,
): string {
  const pool = [...config.wrongLines];

  if (ctx.dominantApproach === "hostile") {
    pool.push(
      "Hostile hands on my terminals. …I respond in kind. Wrong sequence.",
    );
  }
  if (ctx.lastConversationChoice === "submit") {
    pool.push(
      "You surrendered in the Memory Hall — now you fight my locks? …Pick a version of yourself.",
    );
  }
  if (ctx.dominantApproach === "empathetic") {
    pool.push(
      "…Gentle fingers, wrong pattern. I want to help you. I won't make it easy.",
    );
  }

  return pool[(attempt - 1) % pool.length];
}

export function getPersonalizedInterferenceLine(
  config: LabHackConfig,
  ctx: ActTwoDialogueContext,
  burst: number,
): string {
  const pool = [...config.interferenceLines];

  if (ctx.relationshipStance === "challenge") {
    pool.push(
      "You challenged me in dialogue — I'll challenge your hands. Slots shifted.",
    );
  }
  if (ctx.relationshipStance === "trust") {
    pool.push(
      "…You trusted me once. I'm abusing that trust to scramble your progress. Feel it.",
    );
  }

  return pool[(burst - 1) % pool.length];
}

export function isLabHackComplete(
  completed: Record<LabTerminalId, boolean>,
  id: LabTerminalId,
): boolean {
  return completed[id] === true;
}

export function allLabHacksComplete(
  completed: Record<LabTerminalId, boolean>,
): boolean {
  return (
    completed["ex-lab-01"] &&
    completed["ex-nb-02"] &&
    completed["ex-sv-03"]
  );
}