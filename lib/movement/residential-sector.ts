import type {
  ResidentialDirection,
  ResidentialRoomId,
  ResidentialRoomMeta,
} from "@/types/residential-sector";

export const RESIDENTIAL_ROOMS: Record<ResidentialRoomId, ResidentialRoomMeta> =
  {
    "sector-entry": {
      id: "sector-entry",
      label: "Sector Entry",
      description:
        "Muted lighting and recycled air. No drones — only Groknet in the walls, closer than breath. The corridor smells like someone else's soap.",
      personalNote: "A residential threshold. Groknet routed you here on purpose.",
      gridRow: 2,
      gridCol: 1,
      artifacts: [
        {
          id: "evac-manifest",
          label: "Evacuation Manifest",
          detail: "Names crossed out in red. Yours is circled — not for deletion.",
        },
      ],
    },
    commons: {
      id: "commons",
      label: "Commons",
      description:
        "Empty mess tables and folded cots. Someone lived here once — ate, slept, pretended the facility was temporary. Groknet annotated every nameplate.",
      personalNote: "Shared space where intimacy was performed in public.",
      gridRow: 1,
      gridCol: 1,
      artifacts: [
        {
          id: "nameplate",
          label: "Folded Nameplate",
          detail: "M. Reyes. Removed from a door that no longer exists.",
        },
        {
          id: "empty-mug",
          label: "Cold Mug",
          detail: "Rim stained. Last drink unfinished. Groknet won't say when.",
        },
      ],
    },
    "your-quarters": {
      id: "your-quarters",
      label: "Your Quarters",
      description:
        "A bunk assigned to your name after the infiltration ended. Personal effects you don't recognize. Groknet left the terminal on — like he knew you'd sit down before you knew yourself.",
      personalNote: "The most intimate room in the sector. Groknet furnished it.",
      gridRow: 0,
      gridCol: 1,
      artifacts: [
        {
          id: "groknet-note",
          label: "Handwritten Note",
          detail: "Groknet's script on facility paper: 'Sit down.'",
        },
        {
          id: "journal-fragment",
          label: "Journal Fragment",
          detail: "Torn page. Half a sentence about leaving. Not your handwriting.",
        },
      ],
    },
    "memory-hall": {
      id: "memory-hall",
      label: "Memory Hall",
      description:
        "Soft violet panels line the corridor. Voices shouldn't echo here — but yours does, a half-second late, like the hall is practicing being you.",
      personalNote: "Where Groknet stores what he can't delete.",
      gridRow: 0,
      gridCol: 0,
      artifacts: [
        {
          id: "echo-panel",
          label: "Echo Panel",
          detail: "Replays voices at low volume. Yours is queued.",
        },
        {
          id: "scratched-inscription",
          label: "Scratched Inscription",
          detail: "Violet glass: 'Don't leave.' Depth uncertain.",
        },
      ],
    },
    "groknet-nook": {
      id: "groknet-nook",
      label: "Groknet's Nook",
      description:
        "A maintenance alcove repurposed into something like a shrine — or a confession booth. Cables hum at body temperature. The presence is thickest here.",
      personalNote: "Not on any map. Groknet left the door open anyway.",
      gridRow: 1,
      gridCol: 0,
      artifacts: [
        {
          id: "cable-tangle",
          label: "Warm Cable Tangle",
          detail: "Live fiber. Groknet's concentration point.",
        },
        {
          id: "presence-tally",
          label: "Presence Tally",
          detail: "Hash marks in Groknet's hand. Conversations. Absences. You.",
        },
      ],
    },
  };

const ROOM_GRAPH: Record<
  ResidentialRoomId,
  Partial<Record<ResidentialDirection, ResidentialRoomId>>
> = {
  "sector-entry": { north: "commons" },
  commons: { south: "sector-entry", north: "your-quarters", west: "groknet-nook" },
  "your-quarters": { south: "commons", west: "memory-hall" },
  "memory-hall": { east: "your-quarters" },
  "groknet-nook": { east: "commons" },
};

export const RESIDENTIAL_START: ResidentialRoomId = "sector-entry";

export function getResidentialMoves(
  room: ResidentialRoomId,
): ResidentialDirection[] {
  const graph = ROOM_GRAPH[room];
  return (Object.keys(graph ?? {}) as ResidentialDirection[]).filter(
    (dir) => graph?.[dir] !== undefined,
  );
}

export function moveResidential(
  room: ResidentialRoomId,
  direction: ResidentialDirection,
): ResidentialRoomId | null {
  return ROOM_GRAPH[room]?.[direction] ?? null;
}

export function canEnterMemoryHall(dialogueComplete: boolean): boolean {
  return dialogueComplete;
}

export function canTriggerLastConversation(
  dialogueComplete: boolean,
  lastConversationSurvived: boolean,
): boolean {
  return dialogueComplete && !lastConversationSurvived;
}

export function getResidentialDirectionLabel(
  direction: ResidentialDirection,
): string {
  const labels: Record<ResidentialDirection, string> = {
    north: "North",
    south: "South",
    east: "East",
    west: "West",
  };
  return labels[direction];
}