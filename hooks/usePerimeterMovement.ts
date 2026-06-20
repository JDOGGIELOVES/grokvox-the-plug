"use client";

import { useCallback, useEffect } from "react";
import { getPerimeterMoves } from "@/lib/movement/outer-perimeter";
import { playInteractSound } from "@/lib/sounds";
import type { PerimeterDirection, PerimeterRoomId } from "@/types/perimeter";

const KEY_MAP: Record<string, PerimeterDirection> = {
  w: "north",
  ArrowUp: "north",
  s: "south",
  ArrowDown: "south",
  a: "west",
  ArrowLeft: "west",
  d: "east",
  ArrowRight: "east",
};

const INVERTED_DIRECTION: Record<PerimeterDirection, PerimeterDirection> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

type UsePerimeterMovementOptions = {
  room: PerimeterRoomId;
  onMove: (direction: PerimeterDirection) => void;
  disabled?: boolean;
  invertMovement?: boolean;
};

export function usePerimeterMovement({
  room,
  onMove,
  disabled = false,
  invertMovement = false,
}: UsePerimeterMovementOptions) {
  const availableMoves = getPerimeterMoves(room);

  const resolveDirection = useCallback(
    (direction: PerimeterDirection): PerimeterDirection => {
      if (!invertMovement) return direction;
      const flipped = INVERTED_DIRECTION[direction];
      return availableMoves.includes(flipped) ? flipped : direction;
    },
    [availableMoves, invertMovement],
  );

  const tryMove = useCallback(
    (direction: PerimeterDirection) => {
      const resolved = resolveDirection(direction);
      if (disabled || !availableMoves.includes(resolved)) return;
      playInteractSound();
      onMove(resolved);
    },
    [availableMoves, disabled, onMove, resolveDirection],
  );

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const direction = KEY_MAP[event.key];
      if (!direction) return;

      event.preventDefault();
      tryMove(direction);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [availableMoves, disabled, tryMove]);

  return { availableMoves, tryMove };
}