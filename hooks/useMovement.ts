"use client";

import { useCallback, useEffect } from "react";
import { getAvailableMoves, movePlayer } from "@/lib/movement/act-1";
import { playInteractSound } from "@/lib/sounds";
import type { MoveDirection, PlayerPosition } from "@/types/movement";

const KEY_MAP: Record<string, MoveDirection> = {
  w: "forward",
  ArrowUp: "forward",
  s: "back",
  ArrowDown: "back",
  a: "left",
  ArrowLeft: "left",
  d: "right",
  ArrowRight: "right",
};

type UseMovementOptions = {
  position: PlayerPosition;
  onMove: (next: PlayerPosition, direction: MoveDirection) => void;
  disabled?: boolean;
};

export function useMovement({
  position,
  onMove,
  disabled = false,
}: UseMovementOptions) {
  const availableMoves = getAvailableMoves(position);

  const tryMove = useCallback(
    (direction: MoveDirection) => {
      if (disabled) return;
      const next = movePlayer(position, direction);
      if (!next) return;
      playInteractSound();
      onMove(next, direction);
    },
    [disabled, onMove, position],
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
      if (!direction || !availableMoves.includes(direction)) return;

      event.preventDefault();
      tryMove(direction);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [availableMoves, disabled, tryMove]);

  return { availableMoves, tryMove };
}