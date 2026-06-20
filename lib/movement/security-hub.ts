import type {
  SecurityHubDirection,
  SecurityHubRoomId,
  SecurityHubRoomMeta,
} from "@/types/security-hub";

export const SECURITY_HUB_ROOMS: Record<
  SecurityHubRoomId,
  SecurityHubRoomMeta
> = {
  "hub-entry": {
    id: "hub-entry",
    label: "Hub Entry",
    description:
      "Reinforced blast doors seal behind you. Orange status strips pulse along the ceiling — Groknet already knows you're inside.",
    gridRow: 2,
    gridCol: 1,
  },
  "hub-corridor": {
    id: "hub-corridor",
    label: "Patrol Corridor",
    description:
      "Exposed transit corridor. Drones S-04 and S-07 run overlapping sweeps. One blind spot is never enough — read both loops.",
    gridRow: 1,
    gridCol: 1,
  },
  "east-wing": {
    id: "east-wing",
    label: "East Maintenance Wing",
    description:
      "Cable trays and coolant lines throw broken shadows. A maintenance locker holds conduit scrap for emergency decoys.",
    gridRow: 1,
    gridCol: 2,
    isCover: true,
  },
  "terminal-bay": {
    id: "terminal-bay",
    label: "Terminal Bay",
    description:
      "Three active stations: OP-SEC-01 handshake, SYS-MONITOR archives, and the Groknet-07 uplink — locked until you prove you belong.",
    gridRow: 0,
    gridCol: 1,
    hasTerminals: true,
  },
  "inner-exit": {
    id: "inner-exit",
    label: "Sector 07 Hatch",
    description:
      "The inner hatch into the Data Archives. Groknet won't open it until you've spoken to him — and survived what comes after the first hack.",
    gridRow: 0,
    gridCol: 0,
  },
};

const ROOM_GRAPH: Record<
  SecurityHubRoomId,
  Partial<Record<SecurityHubDirection, SecurityHubRoomId>>
> = {
  "hub-entry": { north: "hub-corridor" },
  "hub-corridor": {
    south: "hub-entry",
    east: "east-wing",
    north: "terminal-bay",
  },
  "east-wing": { west: "hub-corridor" },
  "terminal-bay": {
    south: "hub-corridor",
    west: "inner-exit",
  },
  "inner-exit": { east: "terminal-bay" },
};

export const SECURITY_HUB_START: SecurityHubRoomId = "hub-entry";

export function getSecurityHubMoves(
  room: SecurityHubRoomId,
): SecurityHubDirection[] {
  const graph = ROOM_GRAPH[room];
  return (Object.keys(graph ?? {}) as SecurityHubDirection[]).filter(
    (dir) => graph?.[dir] !== undefined,
  );
}

export function moveSecurityHub(
  room: SecurityHubRoomId,
  direction: SecurityHubDirection,
): SecurityHubRoomId | null {
  return ROOM_GRAPH[room]?.[direction] ?? null;
}

export function canExitToDataArchives(
  hackComplete: boolean,
  dialogueComplete: boolean,
  burningCitiesSurvived: boolean,
): boolean {
  return hackComplete && dialogueComplete && burningCitiesSurvived;
}

export function getSecurityHubDirectionLabel(
  direction: SecurityHubDirection,
): string {
  const labels: Record<SecurityHubDirection, string> = {
    north: "North",
    south: "South",
    east: "East",
    west: "West",
  };
  return labels[direction];
}