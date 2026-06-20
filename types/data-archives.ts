export type ArchivesRoomId =
  | "archive-entry"
  | "mirror-vault"
  | "record-stacks"
  | "archives-core";

export type ArchivesDirection = "north" | "south" | "east" | "west";

export type ArchivesRoomMeta = {
  id: ArchivesRoomId;
  label: string;
  description: string;
  gridRow: number;
  gridCol: number;
};