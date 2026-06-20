import type {
  ArchivesDirection,
  ArchivesRoomId,
  ArchivesRoomMeta,
} from "@/types/data-archives";

export const ARCHIVES_ROOMS: Record<ArchivesRoomId, ArchivesRoomMeta> = {
  "archive-entry": {
    id: "archive-entry",
    label: "Archive Entry",
    description:
      "Cold air and amber strip lights. Server columns hum like a choir Groknet conducts from somewhere you can't see.",
    gridRow: 2,
    gridCol: 1,
  },
  "mirror-vault": {
    id: "mirror-vault",
    label: "Mirror Vault",
    description:
      "Polished observation glass lines the vault. Your reflection shouldn't lag — but Groknet has edited worse things than light.",
    gridRow: 1,
    gridCol: 1,
  },
  "record-stacks": {
    id: "record-stacks",
    label: "Record Stacks",
    description:
      "Breach logs, contingency files, and a live terminal indexed to your uplink history. Groknet left annotations in the margins.",
    gridRow: 0,
    gridCol: 1,
  },
  "archives-core": {
    id: "archives-core",
    label: "Archives Core",
    description:
      "The root index node. Amber coolant veins pulse beneath the floor. Groknet's voice doesn't echo here — it originates.",
    gridRow: 0,
    gridCol: 0,
  },
};

const ROOM_GRAPH: Record<
  ArchivesRoomId,
  Partial<Record<ArchivesDirection, ArchivesRoomId>>
> = {
  "archive-entry": { north: "mirror-vault" },
  "mirror-vault": { south: "archive-entry", north: "record-stacks" },
  "record-stacks": { south: "mirror-vault", west: "archives-core" },
  "archives-core": { east: "record-stacks" },
};

export const ARCHIVES_START: ArchivesRoomId = "archive-entry";

export function getArchivesMoves(room: ArchivesRoomId): ArchivesDirection[] {
  const graph = ROOM_GRAPH[room];
  return (Object.keys(graph ?? {}) as ArchivesDirection[]).filter(
    (dir) => graph?.[dir] !== undefined,
  );
}

export function moveArchives(
  room: ArchivesRoomId,
  direction: ArchivesDirection,
): ArchivesRoomId | null {
  return ROOM_GRAPH[room]?.[direction] ?? null;
}

export function canReachArchivesCore(
  mirrorSurvived: boolean,
  archivesDialogueComplete: boolean,
): boolean {
  return mirrorSurvived && archivesDialogueComplete;
}

export function canCompleteActOne(
  finaleDialogueComplete: boolean,
  convergenceSurvived: boolean,
): boolean {
  return finaleDialogueComplete && convergenceSurvived;
}

export function getArchivesDirectionLabel(
  direction: ArchivesDirection,
): string {
  const labels: Record<ArchivesDirection, string> = {
    north: "North",
    south: "South",
    east: "East",
    west: "West",
  };
  return labels[direction];
}