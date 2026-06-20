export type ServerFarmRoomId =
  | "farm-ingress"
  | "cooling-corridor"
  | "rack-alpha"
  | "rack-beta"
  | "core-nexus"
  | "personality-chamber"
  | "memory-confluence";

export type ServerFarmDirection = "north" | "south" | "east" | "west";

export type PersonalityEvolutionPath = "melancholic" | "wrathful" | "detached";

export type ServerFarmRoomMeta = {
  id: ServerFarmRoomId;
  label: string;
  description: string;
  gridRow: number;
  gridCol: number;
  gridWidth?: number;
  gridHeight?: number;
  isMajor?: boolean;
};