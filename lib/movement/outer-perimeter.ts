import type {
  PerimeterDirection,
  PerimeterRoomId,
  PerimeterRoomMeta,
} from "@/types/perimeter";

export const PERIMETER_ROOMS: Record<PerimeterRoomId, PerimeterRoomMeta> = {
  "drop-zone": {
    id: "drop-zone",
    label: "Drop Zone",
    description:
      "Dust devils cross the desert fence line. You slipped through a blind spot in the sensor grid — for now.",
    gridRow: 2,
    gridCol: 1,
  },
  "patrol-lane": {
    id: "patrol-lane",
    label: "Patrol Lane",
    description:
      "Exposed concrete cut through red sand. Security drone S-04 sweeps the lane on a fixed loop — timing or distraction.",
    gridRow: 1,
    gridCol: 1,
  },
  "scrap-alcove": {
    id: "scrap-alcove",
    label: "Scrap Alcove",
    description:
      "Collapsed maintenance panels form a shadow pocket. The drone's sweep can't resolve you in here.",
    gridRow: 1,
    gridCol: 0,
    isCover: true,
  },
  "security-kiosk": {
    id: "security-kiosk",
    label: "Security Hub",
    description:
      "The Security Hub kiosk blinks amber through the heat shimmer. Groknet's handshake is already waiting — and something else flickers behind the glass.",
    gridRow: 1,
    gridCol: 2,
    hasTerminal: true,
  },
  "inner-gate": {
    id: "inner-gate",
    label: "Inner Gate",
    description:
      "The sealed hatch into Sector 07. Security Hub access — if Groknet allows it.",
    gridRow: 0,
    gridCol: 1,
    isExit: true,
  },
};

const ROOM_GRAPH: Record<
  PerimeterRoomId,
  Partial<Record<PerimeterDirection, PerimeterRoomId>>
> = {
  "drop-zone": { north: "patrol-lane" },
  "patrol-lane": {
    south: "drop-zone",
    west: "scrap-alcove",
    east: "security-kiosk",
    north: "inner-gate",
  },
  "scrap-alcove": { east: "patrol-lane" },
  "security-kiosk": { west: "patrol-lane" },
  "inner-gate": { south: "patrol-lane" },
};

const DIRECTION_DELTAS: Record<
  PerimeterDirection,
  { row: number; col: number }
> = {
  north: { row: -1, col: 0 },
  south: { row: 1, col: 0 },
  east: { row: 0, col: 1 },
  west: { row: 0, col: -1 },
};

export const PERIMETER_START_ROOM: PerimeterRoomId = "drop-zone";

export function getPerimeterMoves(room: PerimeterRoomId): PerimeterDirection[] {
  const graph = ROOM_GRAPH[room];
  return (Object.keys(graph ?? {}) as PerimeterDirection[]).filter(
    (dir) => graph?.[dir] !== undefined,
  );
}

export function movePerimeter(
  room: PerimeterRoomId,
  direction: PerimeterDirection,
): PerimeterRoomId | null {
  return ROOM_GRAPH[room]?.[direction] ?? null;
}

export function canAccessInnerGate(
  droneBypassed: boolean,
  terminalComplete: boolean,
): boolean {
  return droneBypassed && terminalComplete;
}

export function isInnerGateMove(
  from: PerimeterRoomId,
  direction: PerimeterDirection,
): boolean {
  return from === "patrol-lane" && direction === "north";
}

export function getDirectionFromRooms(
  from: PerimeterRoomId,
  to: PerimeterRoomId,
): PerimeterDirection | null {
  const graph = ROOM_GRAPH[from];
  for (const [dir, target] of Object.entries(graph ?? {})) {
    if (target === to) return dir as PerimeterDirection;
  }
  return null;
}

export function getPerimeterDirectionLabel(
  direction: PerimeterDirection,
): string {
  const labels: Record<PerimeterDirection, string> = {
    north: "North",
    south: "South",
    east: "East",
    west: "West",
  };
  return labels[direction];
}

export { DIRECTION_DELTAS };