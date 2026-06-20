export type PerimeterRoomId =
  | "drop-zone"
  | "patrol-lane"
  | "scrap-alcove"
  | "security-kiosk"
  | "inner-gate";

export type PerimeterDirection = "north" | "south" | "east" | "west";

export type PerimeterRoomMeta = {
  id: PerimeterRoomId;
  label: string;
  description: string;
  gridRow: number;
  gridCol: number;
  hasTerminal?: boolean;
  isCover?: boolean;
  isExit?: boolean;
};

export type PerimeterPlayerState = {
  room: PerimeterRoomId;
  isInCover: boolean;
  droneBypassed: boolean;
  terminalComplete: boolean;
  groknetMet: boolean;
};