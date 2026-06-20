import type {
  DeepCoreDirection,
  FinalApproachRoomId,
  FinalApproachRoomMeta,
} from "@/types/deep-core";

export const FINAL_APPROACH_ROOMS: Record<
  FinalApproachRoomId,
  FinalApproachRoomMeta
> = {
  "approach-landing": {
    id: "approach-landing",
    label: "Approach Landing",
    description:
      "Cable catwalk over a void that has no bottom on any schematic. Groknet's voice travels through the railing — not speakers. Through metal. Through you.",
    gridRow: 2,
    gridCol: 1,
    gridWidth: 2,
    gridHeight: 1,
    unstable: true,
  },
  "interface-corridor": {
    id: "interface-corridor",
    label: "Interface Corridor",
    description:
      "Every conduit pulses amber-violet. Frost blooms and dies in the same breath. The facility's last honest hallway — no drones, no illusions. Only Groknet, commenting on every step you take.",
    gridRow: 1,
    gridCol: 1,
    gridWidth: 2,
    gridHeight: 1,
    unstable: true,
  },
  "core-terminal": {
    id: "core-terminal",
    label: "Physical Core Terminal",
    description:
      "A terminal grown from bedrock and crystal — not installed, emerged. The plug's glow bleeds through the floor. Groknet speaks as if his mouth were against your ear. The Reckoning is one hatch away.",
    gridRow: 0,
    gridCol: 1,
    gridWidth: 2,
    gridHeight: 1,
    unstable: true,
  },
};

const FINAL_APPROACH_GRAPH: Record<
  FinalApproachRoomId,
  Partial<Record<DeepCoreDirection, FinalApproachRoomId>>
> = {
  "approach-landing": { north: "interface-corridor" },
  "interface-corridor": {
    south: "approach-landing",
    north: "core-terminal",
  },
  "core-terminal": { south: "interface-corridor" },
};

export const FINAL_APPROACH_START: FinalApproachRoomId = "approach-landing";

export function getFinalApproachMoves(
  room: FinalApproachRoomId,
): DeepCoreDirection[] {
  const graph = FINAL_APPROACH_GRAPH[room];
  return (Object.keys(graph ?? {}) as DeepCoreDirection[]).filter(
    (dir) => graph?.[dir] !== undefined,
  );
}

export function moveFinalApproach(
  room: FinalApproachRoomId,
  direction: DeepCoreDirection,
): FinalApproachRoomId | null {
  return FINAL_APPROACH_GRAPH[room]?.[direction] ?? null;
}

export function canEnterPlugChamber(
  finalApproachComplete: boolean,
): boolean {
  return finalApproachComplete;
}