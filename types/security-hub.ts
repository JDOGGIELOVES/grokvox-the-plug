export type SecurityHubRoomId =
  | "hub-entry"
  | "hub-corridor"
  | "east-wing"
  | "terminal-bay"
  | "inner-exit";

export type SecurityHubDirection = "north" | "south" | "east" | "west";

export type SecurityHubTerminalId = "opsec-01" | "sys-monitor" | "groknet-07";

export type SecurityHubRoomMeta = {
  id: SecurityHubRoomId;
  label: string;
  description: string;
  gridRow: number;
  gridCol: number;
  isCover?: boolean;
  hasTerminals?: boolean;
};