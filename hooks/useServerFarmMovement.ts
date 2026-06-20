import { useCallback, useMemo } from "react";
import {
  getServerFarmMoves,
  moveServerFarm,
} from "@/lib/movement/server-farm";
import type { ServerFarmDirection, ServerFarmRoomId } from "@/types/server-farm";

type UseServerFarmMovementOptions = {
  room: ServerFarmRoomId;
  onMove: (direction: ServerFarmDirection) => void;
  disabled?: boolean;
  invertMovement?: boolean;
};

const OPPOSITE: Record<ServerFarmDirection, ServerFarmDirection> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

export function useServerFarmMovement({
  room,
  onMove,
  disabled = false,
  invertMovement = false,
}: UseServerFarmMovementOptions) {
  const availableMoves = useMemo(() => getServerFarmMoves(room), [room]);

  const tryMove = useCallback(
    (direction: ServerFarmDirection) => {
      if (disabled) return;
      const resolved = invertMovement ? OPPOSITE[direction] : direction;
      const next = moveServerFarm(room, resolved);
      if (!next) return;
      onMove(direction);
    },
    [disabled, invertMovement, onMove, room],
  );

  return { availableMoves, tryMove };
}