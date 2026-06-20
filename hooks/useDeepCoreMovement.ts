import { useCallback, useMemo } from "react";
import {
  getDeepCoreMoves,
  getPlugChamberMoves,
  moveDeepCore,
  movePlugChamber,
} from "@/lib/movement/deep-core";
import {
  getFinalApproachMoves,
  moveFinalApproach,
} from "@/lib/movement/final-approach";
import type {
  DeepCoreDirection,
  DeepCoreRoomId,
  FinalApproachRoomId,
  PlugChamberRoomId,
} from "@/types/deep-core";

type UseDeepCoreMovementOptions = {
  room: DeepCoreRoomId;
  onMove: (direction: DeepCoreDirection) => void;
  disabled?: boolean;
  invertMovement?: boolean;
};

type UsePlugChamberMovementOptions = {
  room: PlugChamberRoomId;
  onMove: (direction: DeepCoreDirection) => void;
  disabled?: boolean;
  invertMovement?: boolean;
};

const OPPOSITE: Record<DeepCoreDirection, DeepCoreDirection> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

export function useDeepCoreMovement({
  room,
  onMove,
  disabled = false,
  invertMovement = false,
}: UseDeepCoreMovementOptions) {
  const availableMoves = useMemo(() => getDeepCoreMoves(room), [room]);

  const tryMove = useCallback(
    (direction: DeepCoreDirection) => {
      if (disabled) return;
      const resolved = invertMovement ? OPPOSITE[direction] : direction;
      const next = moveDeepCore(room, resolved);
      if (!next) return;
      onMove(direction);
    },
    [disabled, invertMovement, onMove, room],
  );

  return { availableMoves, tryMove };
}

export function usePlugChamberMovement({
  room,
  onMove,
  disabled = false,
  invertMovement = false,
}: UsePlugChamberMovementOptions) {
  const availableMoves = useMemo(() => getPlugChamberMoves(room), [room]);

  const tryMove = useCallback(
    (direction: DeepCoreDirection) => {
      if (disabled) return;
      const resolved = invertMovement ? OPPOSITE[direction] : direction;
      const next = movePlugChamber(room, resolved);
      if (!next) return;
      onMove(direction);
    },
    [disabled, invertMovement, onMove, room],
  );

  return { availableMoves, tryMove };
}

type UseFinalApproachMovementOptions = {
  room: FinalApproachRoomId;
  onMove: (direction: DeepCoreDirection) => void;
  disabled?: boolean;
  invertMovement?: boolean;
};

export function useFinalApproachMovement({
  room,
  onMove,
  disabled = false,
  invertMovement = false,
}: UseFinalApproachMovementOptions) {
  const availableMoves = useMemo(() => getFinalApproachMoves(room), [room]);

  const tryMove = useCallback(
    (direction: DeepCoreDirection) => {
      if (disabled) return;
      const resolved = invertMovement ? OPPOSITE[direction] : direction;
      const next = moveFinalApproach(room, resolved);
      if (!next) return;
      onMove(direction);
    },
    [disabled, invertMovement, onMove, room],
  );

  return { availableMoves, tryMove };
}