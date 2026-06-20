import type { AreaId } from "@/types/areas";
import type {
  CorridorPosition,
  MoveDirection,
  PlayerPosition,
  PositionMeta,
  PositionNode,
  UpperLabPosition,
} from "@/types/movement";

type MovementGraph = {
  "upper-lab": Record<
    UpperLabPosition,
    Partial<Record<MoveDirection, UpperLabPosition>>
  >;
  corridor: Record<
    CorridorPosition,
    Partial<Record<MoveDirection, CorridorPosition>>
  >;
};

const UPPER_LAB_GRAPH: Record<
  UpperLabPosition,
  Partial<Record<MoveDirection, UpperLabPosition>>
> = {
  "breach-point": { forward: "lab-floor" },
  "lab-floor": {
    back: "breach-point",
    left: "supply-locker",
    right: "east-hatch",
    forward: "uplink-console",
  },
  "supply-locker": { right: "lab-floor" },
  "uplink-console": { back: "lab-floor" },
  "east-hatch": { left: "lab-floor" },
};

const CORRIDOR_GRAPH: Record<
  CorridorPosition,
  Partial<Record<MoveDirection, CorridorPosition>>
> = {
  "west-hatch": { forward: "mid-passage" },
  "mid-passage": { back: "west-hatch", forward: "north-airlock" },
  "north-airlock": { back: "mid-passage" },
};

export const MOVEMENT_GRAPH: MovementGraph = {
  "upper-lab": UPPER_LAB_GRAPH,
  corridor: CORRIDOR_GRAPH,
};

export const POSITION_META: Record<PositionNode, PositionMeta> = {
  "breach-point": {
    area: "upper-lab",
    label: "Breach Point",
    description:
      "You drop from the maintenance shaft into sterile silence. Warning lights strobe along the ceiling grid.",
  },
  "lab-floor": {
    area: "upper-lab",
    label: "Lab Floor",
    description:
      "Neural interface rigs line the walls. Equipment hums at low load. Groknet's presence thickens near the center console.",
  },
  "supply-locker": {
    area: "upper-lab",
    label: "Supply Locker",
    description:
      "A wall locker hisses open on stale air. Emergency supplies remain — including a single distraction beacon.",
  },
  "uplink-console": {
    area: "upper-lab",
    label: "Uplink Console",
    description:
      "The primary console flickers under Groknet's lock. A secure channel waits — negotiation or provocation.",
  },
  "east-hatch": {
    area: "upper-lab",
    label: "East Corridor Hatch",
    description:
      "A reinforced hatch leads to Maintenance Corridor C-4. Motion sensors arm as you approach.",
  },
  "west-hatch": {
    area: "corridor",
    label: "West Hatch",
    description:
      "You slip through from the Upper Lab. Failing panel lights reveal cable trays sagging overhead.",
  },
  "mid-passage": {
    area: "corridor",
    label: "Mid Passage",
    description:
      "Patrol drone D-12 loops the corridor. Cover is sparse. Timing is everything.",
  },
  "north-airlock": {
    area: "corridor",
    label: "Deep Sector Airlock",
    description:
      "The bulkhead to the deep sector stands sealed. One clean opening is all you need.",
  },
};

export const AREA_ENTRY_POSITION: Record<AreaId, PositionNode> = {
  "upper-lab": "breach-point",
  corridor: "west-hatch",
};

export const INITIAL_PLAYER_POSITION: PlayerPosition = {
  area: "upper-lab",
  node: "breach-point",
};

export function getAvailableMoves(position: PlayerPosition): MoveDirection[] {
  if (position.area === "upper-lab") {
    const graph = MOVEMENT_GRAPH["upper-lab"][position.node];
    return (Object.keys(graph ?? {}) as MoveDirection[]).filter(
      (dir) => graph?.[dir] !== undefined,
    );
  }

  const graph = MOVEMENT_GRAPH.corridor[position.node];
  return (Object.keys(graph ?? {}) as MoveDirection[]).filter(
    (dir) => graph?.[dir] !== undefined,
  );
}

export function movePlayer(
  position: PlayerPosition,
  direction: MoveDirection,
): PlayerPosition | null {
  if (position.area === "upper-lab") {
    const graph = MOVEMENT_GRAPH["upper-lab"][position.node];
    const nextNode = graph?.[direction];
    if (!nextNode) return null;
    return { area: "upper-lab", node: nextNode };
  }

  const graph = MOVEMENT_GRAPH.corridor[position.node];
  const nextNode = graph?.[direction];
  if (!nextNode) return null;
  return { area: "corridor", node: nextNode };
}

export function getPositionMeta(position: PlayerPosition): PositionMeta {
  return POSITION_META[position.node];
}

const DIRECTION_LABELS: Record<MoveDirection, string> = {
  forward: "Forward",
  back: "Back",
  left: "Left",
  right: "Right",
};

export function getDirectionLabel(direction: MoveDirection): string {
  return DIRECTION_LABELS[direction];
}