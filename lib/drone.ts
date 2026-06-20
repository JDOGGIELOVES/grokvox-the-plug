export type DroneStatus = "patrolling" | "distracted";

export const DRONE_SAFE_ZONES = { low: 18, high: 82 };
export const DRONE_PATROL_SPEED = 0.55;
export const DRONE_LURE_POSITION = 8;
export const BEACON_DURATION_MS = 9000;

const DETECTION_COMMENTS = [
  "Not as quiet as you think you are.",
  "Alex. The drone flagged you. Try not to make my job harder.",
  "I saw that on the motion grid. So did every camera between here and the terminal.",
  "Detected. You're bleeding position data into the corridor logs.",
  "That was loud, Alex. The facility doesn't forget.",
  "…You tripped the patrol. I can't scrub that from the uplink.",
];

export function getGroknetDetectionComment(detectionCount: number): string {
  return DETECTION_COMMENTS[
    (detectionCount - 1) % DETECTION_COMMENTS.length
  ];
}

export function isDroneInSafeZone(position: number): boolean {
  return (
    position <= DRONE_SAFE_ZONES.low || position >= DRONE_SAFE_ZONES.high
  );
}

export function canSneakPast(position: number, status: DroneStatus): boolean {
  if (status === "distracted") return true;
  return isDroneInSafeZone(position);
}