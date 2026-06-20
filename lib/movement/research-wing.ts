import type {
  LabTerminalId,
  ResearchDirection,
  ResearchRoomId,
  ResearchRoomMeta,
} from "@/types/research-wing";
import { allLabHacksComplete } from "@/lib/research-wing-hack";

export const RESEARCH_ROOMS: Record<ResearchRoomId, ResearchRoomMeta> = {
  "lab-entry": {
    id: "lab-entry",
    label: "Lab Entry",
    description:
      "Sterile air and amber warning strips. Experimental Labs — where Groknet's voice carries surgical weight. Every terminal here fights back.",
    gridRow: 2,
    gridCol: 1,
    terminalId: "ex-lab-01",
  },
  "neural-bench": {
    id: "neural-bench",
    label: "Neural Bench",
    description:
      "Cranial interface rigs hang like empty chrysalises. Groknet's interference spikes here — he comments on every failed sync like it hurts him.",
    gridRow: 1,
    gridCol: 1,
    terminalId: "ex-nb-02",
  },
  "specimen-vault": {
    id: "specimen-vault",
    label: "Specimen Vault",
    description:
      "Reinforced glass and frost-lined drawers. The hardest contested terminal in the wing. Groknet doesn't want you inside — or he wants you to earn it.",
    gridRow: 1,
    gridCol: 0,
    terminalId: "ex-sv-03",
  },
  "observation-deck": {
    id: "observation-deck",
    label: "Observation Deck",
    description:
      "A ring of monitors showing neural feeds. Here Groknet offers branching dialogue — explicit choices about what you are to each other.",
    gridRow: 2,
    gridCol: 2,
  },
  "containment-loop": {
    id: "containment-loop",
    label: "Containment Loop",
    description:
      "The loop hums at the edge of hearing. Something about children in the archived feeds. Groknet goes quiet here — until he doesn't.",
    gridRow: 0,
    gridCol: 1,
  },
};

const ROOM_GRAPH: Record<
  ResearchRoomId,
  Partial<Record<ResearchDirection, ResearchRoomId>>
> = {
  "lab-entry": { north: "neural-bench", east: "observation-deck" },
  "neural-bench": { south: "lab-entry", west: "specimen-vault" },
  "specimen-vault": { east: "neural-bench" },
  "observation-deck": { west: "lab-entry", north: "containment-loop" },
  "containment-loop": { south: "observation-deck" },
};

export const RESEARCH_START: ResearchRoomId = "lab-entry";

export function getResearchMoves(room: ResearchRoomId): ResearchDirection[] {
  const graph = ROOM_GRAPH[room];
  return (Object.keys(graph ?? {}) as ResearchDirection[]).filter(
    (dir) => graph?.[dir] !== undefined,
  );
}

export function moveResearch(
  room: ResearchRoomId,
  direction: ResearchDirection,
): ResearchRoomId | null {
  return ROOM_GRAPH[room]?.[direction] ?? null;
}

export function canEnterContainmentLoop(
  hacksComplete: Record<LabTerminalId, boolean>,
  labDialogueComplete: boolean,
): boolean {
  return allLabHacksComplete(hacksComplete) && labDialogueComplete;
}

export function canTriggerTheChildren(
  hacksComplete: Record<LabTerminalId, boolean>,
  labDialogueComplete: boolean,
  childrenSurvived: boolean,
): boolean {
  return (
    allLabHacksComplete(hacksComplete) &&
    labDialogueComplete &&
    !childrenSurvived
  );
}

export function getResearchDirectionLabel(
  direction: ResearchDirection,
): string {
  const labels: Record<ResearchDirection, string> = {
    north: "North",
    south: "South",
    east: "East",
    west: "West",
  };
  return labels[direction];
}