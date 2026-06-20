export type DeepCoreRoomId =
  | "fortress-ingress"
  | "seismic-corridor"
  | "fortification-grid"
  | "garden-threshold"
  | "neural-garden"
  | "descent-shaft";

export type PlugChamberRoomId = "plug-ante" | "the-plug";

export type FinalApproachRoomId =
  | "approach-landing"
  | "interface-corridor"
  | "core-terminal";

export type DeepCoreDirection = "north" | "south" | "east" | "west";

export type ActThreeStage =
  | "deep-core-access"
  | "final-approach"
  | "plug-chamber";

export type ConfrontationChoiceId = "acknowledge" | "defy" | "question";

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
  | "the-plug"
  | "the-compromise"
  | "the-surrender";

export type FinalApproachRoomMeta = {
  id: FinalApproachRoomId;
  label: string;
  description: string;
  gridRow: number;
  gridCol: number;
  gridWidth?: number;
  gridHeight?: number;
  unstable?: boolean;
};

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