import type { AreaId } from "@/types/areas";

export type UpperLabPosition =
  | "breach-point"
  | "lab-floor"
  | "supply-locker"
  | "uplink-console"
  | "east-hatch";

export type CorridorPosition = "west-hatch" | "mid-passage" | "north-airlock";

export type PositionNode = UpperLabPosition | CorridorPosition;

export type PlayerPosition =
  | { area: "upper-lab"; node: UpperLabPosition }
  | { area: "corridor"; node: CorridorPosition };

export type MoveDirection = "forward" | "back" | "left" | "right";

export type PositionMeta = {
  label: string;
  description: string;
  area: AreaId;
};