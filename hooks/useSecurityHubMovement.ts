"use client";

import { useCallback, useEffect } from "react";
import { getSecurityHubMoves } from "@/lib/movement/security-hub";
import { playInteractSound } from "@/lib/sounds";
import type {
  SecurityHubDirection,
  SecurityHubRoomId,
} from "@/types/security-hub";

const KEY_MAP: Record<string, SecurityHubDirection> = {
  w: "north",
  ArrowUp: "north",
  s: "south",
  ArrowDown: "south",
  a: "west",
  ArrowLeft: "west",
  d: "east",
  ArrowRight: "east",
};

const INVERTED: Record<SecurityHubDirection, SecurityHubDirection> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

type Options = {
  room: SecurityHubRoomId;
  onMove: (direction: SecurityHubDirection) => void;
  disabled?: boolean;
  invertMovement?: boolean;
};

export function useSecurityHubMovement({
  room,
  onMove,
  disabled = false,
  invertMovement = false,
}: Options) {
  const availableMoves = getSecurityHubMoves(room);

  const resolveDirection = useCallback(
    (direction: SecurityHubDirection): SecurityHubDirection => {
      if (!invertMovement) return direction;
      const flipped = INVERTED[direction];
      return availableMoves.includes(flipped) ? flipped : direction;
    },
    [availableMoves, invertMovement],
  );

  const tryMove = useCallback(
    (direction: SecurityHubDirection) => {
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