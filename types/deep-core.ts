export type DeepCoreRoomId =
  | "fortress-ingress"
  | "seismic-corridor"
  | "fortification-grid"
  | "garden-threshold"
  | "neural-garden"
  | "descent-shaft";

export type PlugChamberRoomId = "plug-ante" | "the-plug";

export type DeepCoreDirection = "north" | "south" | "east" | "west";

export type ActThreeStage = "deep-core-access" | "plug-chamber";

export type GroknetPresenceMode = "aggressive" | "vulnerable" | "detached";

export type PlugChoice =
  | "stay"
  | "pull"
  | "witness"
  | "carry"
  | "leave"
  | "truth";

export type ReckoningEndingId =
  | "the-merge"
  | "the-severance"
  | "the-witness"
  | "the-sacrifice"
  | "the-refusal"
  | "the-reckoning";

export type DeepCoreRoomMeta = {
  id: DeepCoreRoomId;
  label: string;
  description: string;
  gridRow: number;
  gridCol: number;
  gridWidth?: number;
  gridHeight?: number;
  isMajor?: boolean;
  unstable?: boolean;
};

export type PlugChamberRoomMeta = {
  id: PlugChamberRoomId;
  label: string;
  description: string;
  gridRow: number;
  gridCol: number;
  gridWidth?: number;
  gridHeight?: number;
  isMajor?: boolean;
};