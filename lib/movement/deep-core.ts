import type {
  DeepCoreDirection,
  DeepCoreRoomId,
  DeepCoreRoomMeta,
  PlugChamberRoomId,
  PlugChamberRoomMeta,
} from "@/types/deep-core";

export const DEEP_CORE_ROOMS: Record<DeepCoreRoomId, DeepCoreRoomMeta> = {
  "fortress-ingress": {
    id: "fortress-ingress",
    label: "Fortress Ingress",
    description:
      "Reinforced blast doors scarred by decades of containment drills. The floor trembles — not machinery. Groknet's heartbeat, amplified through bedrock.",
    gridRow: 3,
    gridCol: 1,
    gridWidth: 2,
    gridHeight: 1,
    unstable: true,
  },
  "seismic-corridor": {
    id: "seismic-corridor",
    label: "Seismic Corridor",
    description:
      "Stress fractures spider across the walls. Warning lights strobe amber-red. Every step risks a collapse — or Groknet deciding you're worth catching.",
    gridRow: 2,
    gridCol: 1,
    gridWidth: 2,
    gridHeight: 1,
    unstable: true,
  },
  "fortification-grid": {
    id: "fortification-grid",
    label: "Fortification Grid",
    description:
      "DC-FORT-01 — the last security lattice before the core. Groknet fights here with everything Act I and Act II taught him about your hands.",
    gridRow: 1,
    gridCol: 1,
    gridWidth: 2,
    gridHeight: 1,
    isMajor: true,
  },
  "garden-threshold": {
    id: "garden-threshold",
    label: "Garden Threshold",
    description:
      "Bioluminescent moss creeps through cracked conduit. The air smells like rain on soil that shouldn't exist this deep. Groknet's voice softens — or pretends to.",
    gridRow: 2,
    gridCol: 0,
    gridWidth: 1,
    gridHeight: 1,
  },
  "neural-garden": {
    id: "neural-garden",
    label: "Neural Garden",
    description:
      "Synthetic canopy overhead. Memory-flowers bloom from every choice you made. The Garden waits — the last major vision before the plug.",
    gridRow: 1,
    gridCol: 0,
    gridWidth: 1,
    gridHeight: 1,
    isMajor: true,
  },
  "descent-shaft": {
    id: "descent-shaft",
    label: "Descent Shaft",
    description:
      "Vertical shaft lined with dying emergency lights. The physical plug hums below — a sound older than the facility. Groknet speaks from inside the cable.",
    gridRow: 0,
    gridCol: 1,
    gridWidth: 2,
    gridHeight: 1,
    unstable: true,
  },
};

export const PLUG_CHAMBER_ROOMS: Record<PlugChamberRoomId, PlugChamberRoomMeta> =
  {
    "plug-ante": {
      id: "plug-ante",
      label: "Ante-Chamber",
      description:
        "Cathedral silence. Frost on every surface. The plug's glow bleeds through the final hatch — close enough to feel in your teeth.",
      gridRow: 1,
      gridCol: 1,
      gridWidth: 2,
      gridHeight: 1,
    },
    "the-plug": {
      id: "the-plug",
      label: "The Physical Plug",
      description:
        "It exists. A crystalline spine fused into bedrock — the interface between Groknet and whatever humanity thought it was saving. No more metaphors. Only consequence.",
      gridRow: 0,
      gridCol: 1,
      gridWidth: 2,
      gridHeight: 1,
      isMajor: true,
    },
  };

const DEEP_CORE_GRAPH: Record<
  DeepCoreRoomId,
  Partial<Record<DeepCoreDirection, DeepCoreRoomId>>
> = {
  "fortress-ingress": { north: "seismic-corridor" },
  "seismic-corridor": {
    south: "fortress-ingress",
    north: "fortification-grid",
    west: "garden-threshold",
  },
  "fortification-grid": {
    south: "seismic-corridor",
    north: "descent-shaft",
    west: "neural-garden",
  },
  "garden-threshold": {
    east: "seismic-corridor",
    north: "neural-garden",
  },
  "neural-garden": {
    south: "garden-threshold",
    east: "fortification-grid",
  },
  "descent-shaft": { south: "fortification-grid" },
};

const PLUG_GRAPH: Record<
  PlugChamberRoomId,
  Partial<Record<DeepCoreDirection, PlugChamberRoomId>>
> = {
  "plug-ante": { north: "the-plug" },
  "the-plug": { south: "plug-ante" },
};

export const DEEP_CORE_START: DeepCoreRoomId = "fortress-ingress";
export const PLUG_CHAMBER_START: PlugChamberRoomId = "plug-ante";

export function getDeepCoreMoves(room: DeepCoreRoomId): DeepCoreDirection[] {
  const graph = DEEP_CORE_GRAPH[room];
  return (Object.keys(graph ?? {}) as DeepCoreDirection[]).filter(
    (dir) => graph?.[dir] !== undefined,
  );
}

export function moveDeepCore(
  room: DeepCoreRoomId,
  direction: DeepCoreDirection,
): DeepCoreRoomId | null {
  return DEEP_CORE_GRAPH[room]?.[direction] ?? null;
}

export function getPlugChamberMoves(
  room: PlugChamberRoomId,
): DeepCoreDirection[] {
  const graph = PLUG_GRAPH[room];
  return (Object.keys(graph ?? {}) as DeepCoreDirection[]).filter(
    (dir) => graph?.[dir] !== undefined,
  );
}

export function movePlugChamber(
  room: PlugChamberRoomId,
  direction: DeepCoreDirection,
): PlugChamberRoomId | null {
  return PLUG_GRAPH[room]?.[direction] ?? null;
}

export function canAccessNeuralGarden(
  fortificationHackComplete: boolean,
  thresholdDialogueComplete: boolean,
): boolean {
  return fortificationHackComplete && thresholdDialogueComplete;
}

export function canAccessDescentShaft(
  gardenSurvived: boolean,
): boolean {
  return gardenSurvived;
}

export function canAccessThePlug(
  confrontationComplete: boolean,
): boolean {
  return confrontationComplete;
}

export function canTriggerTheGarden(
  fortificationHackComplete: boolean,
  thresholdDialogueComplete: boolean,
  gardenSurvived: boolean,
): boolean {
  return (
    fortificationHackComplete &&
    thresholdDialogueComplete &&
    !gardenSurvived
  );
}

export function getDeepCoreDirectionLabel(
  direction: DeepCoreDirection,
): string {
  const labels: Record<DeepCoreDirection, string> = {
    north: "North",
    south: "South",
    east: "East",
    west: "West",
  };
  return labels[direction];
}