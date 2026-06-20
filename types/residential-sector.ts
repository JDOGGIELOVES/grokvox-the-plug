export type ResidentialRoomId =
  | "sector-entry"
  | "commons"
  | "your-quarters"
  | "memory-hall"
  | "groknet-nook";

export type ResidentialDirection = "north" | "south" | "east" | "west";

export type PersonalArtifactId =
  | "evac-manifest"
  | "nameplate"
  | "empty-mug"
  | "groknet-note"
  | "journal-fragment"
  | "echo-panel"
  | "scratched-inscription"
  | "cable-tangle"
  | "presence-tally";

export type PersonalArtifact = {
  id: PersonalArtifactId;
  label: string;
  detail: string;
};

export type ResidentialRoomMeta = {
  id: ResidentialRoomId;
  label: string;
  description: string;
  personalNote: string;
  gridRow: number;
  gridCol: number;
  artifacts: PersonalArtifact[];
};