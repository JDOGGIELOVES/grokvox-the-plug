"use client";

import { useCallback, useEffect } from "react";
import { getResearchMoves } from "@/lib/movement/research-wing";
import { playInteractSound } from "@/lib/sounds";
import type {
  ResearchDirection,
  ResearchRoomId,
} from "@/types/research-wing";

const KEY_MAP: Record<string, ResearchDirection> = {
  w: "north",
  ArrowUp: "north",
  s: "south",
  ArrowDown: "south",
  a: "west",
  ArrowLeft: "west",
  d: "east",
  ArrowRight: "east",
};

const INVERTED: Record<ResearchDirection, ResearchDirection> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

type Options = {
  room: ResearchRoomId;
  onMove: (direction: ResearchDirection) => void;
  disabled?: boolean;
  invertMovement?: boolean;
};

export function useResearchWingMovement({
  room,
  onMove,
  disabled = false,
  invertMovement = false,
}: Options) {
  const availableMoves = getResearchMoves(room);

  const resolveDirection = useCallback(
    (direction: ResearchDirection): ResearchDirection => {
      if (!invertMovement) return direction;
      const flipped = INVERTED[direction];
      return availableMoves.includes(flipped) ? flipped : direction;
    },
    [availableMoves, invertMovement],
  );

  const tryMove = useCallback(
    (direction: ResearchDirection) => {
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