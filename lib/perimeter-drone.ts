export type PerimeterDroneStatus = "patrolling" | "distracted" | "alert";

export const PERIMETER_DRONE_SPEED = 0.7;
export const PERIMETER_LURE_POSITION = 6;
export const PERIMETER_DECOY_DURATION_MS = 8500;
export const PERIMETER_SAFE_LOW = 18;
export const PERIMETER_SAFE_HIGH = 82;
export const PERIMETER_DANGER_LOW = 38;
export const PERIMETER_DANGER_HIGH = 62;

const PERIMETER_DETECTION_LINES = [
  "Perimeter drone S-04 flagged your heat signature. I'm watching.",
  "That sweep caught you, Alex. The outer grid just lit up.",
  "S-04 has a fix. You wanted stealth — try harder.",
];

export function isPerimeterDroneSafe(position: number): boolean {
  return position <= PERIMETER_SAFE_LOW || position >= PERIMETER_SAFE_HIGH;
}

export function isPerimeterDroneDanger(position: number): boolean {
  return position >= PERIMETER_DANGER_LOW && position <= PERIMETER_DANGER_HIGH;
}

export function canSneakPerimeterLane(
  position: number,
  status: PerimeterDroneStatus = "patrolling",
): boolean {
  if (status === "distracted") return true;
  return isPerimeterDroneSafe(position);
}

export function getPerimeterDetectionComment(count: number): string {
  return PERIMETER_DETECTION_LINES[(count - 1) % PERIMETER_DETECTION_LINES.length];
}

export function shouldDetectOnEntry(
  dronePosition: number,
  enteringPatrolLane: boolean,
): boolean {
  return enteringPatrolLane && isPerimeterDroneDanger(dronePosition);
}

export function shouldDetectInLane(
  dronePosition: number,
  room: string,
  isInCover: boolean,
): boolean {
  if (room !== "patrol-lane" || isInCover) return false;
  return isPerimeterDroneDanger(dronePosition);
}