"use client";

import { useCallback, useEffect } from "react";
import { getArchivesMoves } from "@/lib/movement/data-archives";
import { playInteractSound } from "@/lib/sounds";
import type { ArchivesDirection, ArchivesRoomId } from "@/types/data-archives";

const KEY_MAP: Record<string, ArchivesDirection> = {
  w: "north",
  ArrowUp: "north",
  s: "south",
  ArrowDown: "south",
  a: "west",
  ArrowLeft: "west",
  d: "east",
  ArrowRight: "east",
};

const INVERTED: Record<ArchivesDirection, ArchivesDirection> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

type Options = {
  room: ArchivesRoomId;
  onMove: (direction: ArchivesDirection) => void;
  disabled?: boolean;
  invertMovement?: boolean;
};

export function useArchivesMovement({
  room,
  onMove,
  disabled = false,
  invertMovement = false,
}: Options) {
  const availableMoves = getArchivesMoves(room);

  const resolveDirection = useCallback(
    (direction: ArchivesDirection): ArchivesDirection => {
      if (!invertMovement) return direction;
      const flipped = INVERTED[direction];
      return availableMoves.includes(flipped) ? flipped : direction;
    },
    [availableMoves, invertMovement],
  );

  const tryMove = useCallback(
    (direction: ArchivesDirection) => {
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