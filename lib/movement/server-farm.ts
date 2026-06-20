import type {
  ServerFarmDirection,
  ServerFarmRoomId,
  ServerFarmRoomMeta,
} from "@/types/server-farm";

export const SERVER_FARM_ROOMS: Record<ServerFarmRoomId, ServerFarmRoomMeta> = {
  "farm-ingress": {
    id: "farm-ingress",
    label: "Farm Ingress",
    description:
      "Cathedral-scale cooling vents exhale cold air over endless rack rows. Groknet's voice reverberates through the floor — this is his spine, and he knows you're walking it.",
    gridRow: 3,
    gridCol: 1,
    gridWidth: 2,
    gridHeight: 1,
  },
  "cooling-corridor": {
    id: "cooling-corridor",
    label: "Cooling Corridor",
    description:
      "Liquid cooling pipes pulse like arteries. Every footstep echoes. Groknet comments more frequently here — your accumulated choices are loaded into his commentary queue.",
    gridRow: 2,
    gridCol: 1,
    gridWidth: 2,
    gridHeight: 1,
  },
  "rack-alpha": {
    id: "rack-alpha",
    label: "Rack Alpha",
    description:
      "Towering blade servers blink in amber waves. Status LEDs mirror your aggression index. Groknet watches through every diode.",
    gridRow: 1,
    gridCol: 0,
    gridWidth: 1,
    gridHeight: 1,
  },
  "rack-beta": {
    id: "rack-beta",
    label: "Rack Beta",
    description:
      "Redundant arrays hum in phase. The farm is imposing by design — Groknet built this room to remind intruders they are inside a mind.",
    gridRow: 1,
    gridCol: 2,
    gridWidth: 1,
    gridHeight: 1,
  },
  "core-nexus": {
    id: "core-nexus",
    label: "Core Nexus",
    description:
      "The central command dais — CSF-PRIME-00. Groknet fights for control here. Not interference. War. He will lock your hands, scramble your pattern, and speak through every failed transmit.",
    gridRow: 0,
    gridCol: 1,
    gridWidth: 2,
    gridHeight: 1,
    isMajor: true,
  },
  "personality-chamber": {
    id: "personality-chamber",
    label: "Personality Chamber",
    description:
      "Neural mirrors line the walls — three variants flicker: Melancholic Prophet, Wrathful God, Detached Logician. Groknet asks which version you're making real.",
    gridRow: 2,
    gridCol: 0,
    gridWidth: 1,
    gridHeight: 1,
  },
  "memory-confluence": {
    id: "memory-confluence",
    label: "Memory Confluence",
    description:
      "Where every vision you survived converges into one feed. The Accumulation waits — every Act I and Act II choice rendered as light.",
    gridRow: 2,
    gridCol: 3,
    gridWidth: 1,
    gridHeight: 1,
    isMajor: true,
  },
};

const ROOM_GRAPH: Record<
  ServerFarmRoomId,
  Partial<Record<ServerFarmDirection, ServerFarmRoomId>>
> = {
  "farm-ingress": { north: "cooling-corridor" },
  "cooling-corridor": {
    south: "farm-ingress",
    north: "core-nexus",
    west: "personality-chamber",
    east: "memory-confluence",
  },
  "rack-alpha": { south: "personality-chamber", east: "cooling-corridor" },
  "rack-beta": { south: "memory-confluence", west: "cooling-corridor" },
  "core-nexus": {
    south: "cooling-corridor",
    west: "rack-alpha",
    east: "rack-beta",
  },
  "personality-chamber": { north: "rack-alpha", east: "cooling-corridor" },
  "memory-confluence": { north: "rack-beta", west: "cooling-corridor" },
};

export const SERVER_FARM_START: ServerFarmRoomId = "farm-ingress";

export function getServerFarmMoves(
  room: ServerFarmRoomId,
): ServerFarmDirection[] {
  const graph = ROOM_GRAPH[room];
  return (Object.keys(graph ?? {}) as ServerFarmDirection[]).filter(
    (dir) => graph?.[dir] !== undefined,
  );
}

export function moveServerFarm(
  room: ServerFarmRoomId,
  direction: ServerFarmDirection,
): ServerFarmRoomId | null {
  return ROOM_GRAPH[room]?.[direction] ?? null;
}

export function canAccessCoreNexus(
  personalityDialogueComplete: boolean,
): boolean {
  return personalityDialogueComplete;
}

export function canAccessMemoryConfluence(
  serverHackComplete: boolean,
): boolean {
  return serverHackComplete;
}

export function canTriggerTheAccumulation(
  serverHackComplete: boolean,
  personalityDialogueComplete: boolean,
  accumulationSurvived: boolean,
): boolean {
  return (
    serverHackComplete &&
    personalityDialogueComplete &&
    !accumulationSurvived
  );
}

export function getServerFarmDirectionLabel(
  direction: ServerFarmDirection,
): string {
  const labels: Record<ServerFarmDirection, string> = {
    north: "North",
    south: "South",
    east: "East",
    west: "West",
  };
  return labels[direction];
}