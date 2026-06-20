export type HubDroneId = "s04" | "s07";

export type HubDroneStatus = "patrolling" | "distracted";

export const HUB_DRONE_SPEED = { s04: 0.65, s07: 0.55 } as const;
export const HUB_SAFE_LOW = 20;
export const HUB_SAFE_HIGH = 80;
export const HUB_DANGER_LOW = 40;
export const HUB_DANGER_HIGH = 60;
export const HUB_DECOY_DURATION_MS = 7500;
export const HUB_LURE_POSITIONS: Record<HubDroneId, number> = { s04: 8, s07: 88 };

const DETECTION_LINES = [
  "Two sweeps, one mistake. The Hub just logged you, Alex.",
  "S-04 and S-07 don't miss twice. I'm watching the alert bloom.",
  "That corridor is unforgiving. Groknet aggression just ticked up.",
];

export function isHubDroneSafe(position: number): boolean {
  return position <= HUB_SAFE_LOW || position >= HUB_SAFE_HIGH;
}

export function isHubDroneDanger(position: number): boolean {
  return position >= HUB_DANGER_LOW && position <= HUB_DANGER_HIGH;
}

export function canSneakHubCorridor(
  s04Position: number,
  s07Position: number,
  s04Status: HubDroneStatus,
  s07Status: HubDroneStatus,
): boolean {
  if (s04Status === "distracted" || s07Status === "distracted") {
    const other =
      s04Status === "distracted"
        ? { pos: s07Position, status: s07Status }
        : { pos: s04Position, status: s04Status };
    return other.status === "distracted" || isHubDroneSafe(other.pos);
  }
  return isHubDroneSafe(s04Position) && isHubDroneSafe(s07Position);
}

export function isHubCorridorDanger(
  s04Position: number,
  s07Position: number,
  s04Status: HubDroneStatus,
  s07Status: HubDroneStatus,
): boolean {
  if (s04Status === "distracted" && s07Status === "distracted") return false;
  if (s04Status === "distracted") return isHubDroneDanger(s07Position);
  if (s07Status === "distracted") return isHubDroneDanger(s04Position);
  return isHubDroneDanger(s04Position) || isHubDroneDanger(s07Position);
}

export function getHubDetectionComment(count: number): string {
  return DETECTION_LINES[(count - 1) % DETECTION_LINES.length];
}

export function shouldDetectHubEntry(
  s04Position: number,
  s07Position: number,
  s04Status: HubDroneStatus,
  s07Status: HubDroneStatus,
): boolean {
  return isHubCorridorDanger(s04Position, s07Position, s04Status, s07Status);
}