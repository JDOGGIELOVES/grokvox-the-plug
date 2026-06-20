export type ActTwoStage =
  | "residential-sector"
  | "research-wing"
  | "central-server-farm";

export type ResearchRoomId =
  | "lab-entry"
  | "neural-bench"
  | "specimen-vault"
  | "observation-deck"
  | "containment-loop";

export type ResearchDirection = "north" | "south" | "east" | "west";

export type LabTerminalId = "ex-lab-01" | "ex-nb-02" | "ex-sv-03";

export type RelationshipStance = "trust" | "challenge" | "withdraw";

export type ResearchRoomMeta = {
  id: ResearchRoomId;
  label: string;
  description: string;
  gridRow: number;
  gridCol: number;
  terminalId?: LabTerminalId;
};