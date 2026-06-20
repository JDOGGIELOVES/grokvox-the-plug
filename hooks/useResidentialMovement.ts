"use client";

import { useCallback, useEffect } from "react";
import { getResidentialMoves } from "@/lib/movement/residential-sector";
import { playInteractSound } from "@/lib/sounds";
import type {
  ResidentialDirection,
  ResidentialRoomId,
} from "@/types/residential-sector";

const KEY_MAP: Record<string, ResidentialDirection> = {
  w: "north",
  ArrowUp: "north",
  s: "south",
  ArrowDown: "south",
  a: "west",
  ArrowLeft: "west",
  d: "east",
  ArrowRight: "east",
};

const INVERTED: Record<ResidentialDirection, ResidentialDirection> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

type Options = {
  room: ResidentialRoomId;
  onMove: (direction: ResidentialDirection) => void;
  disabled?: boolean;
  invertMovement?: boolean;
};

export function useResidentialMovement({
  room,
  onMove,
  disabled = false,
  invertMovement = false,
}: Options) {
  const availableMoves = getResidentialMoves(room);

  const resolveDirection = useCallback(
    (direction: ResidentialDirection): ResidentialDirection => {
      if (!invertMovement) return direction;
      const flipped = INVERTED[direction];
      return availableMoves.includes(flipped) ? flipped : direction;
    },
    [availableMoves, invertMovement],
  );

  const tryMove = useCallback(
    (direction: ResidentialDirection) => {
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
  }, [disabled, tryMove]);

  return { availableMoves, tryMove };
}