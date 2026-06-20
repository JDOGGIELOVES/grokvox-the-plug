"use client";

import { getPerimeterDirectionLabel } from "@/lib/movement/outer-perimeter";
import { cn } from "@/lib/utils";

export type MovementDirection = "north" | "south" | "east" | "west";

const ARROWS: Record<MovementDirection, string> = {
  north: "↑",
  south: "↓",
  east: "→",
  west: "←",
};

type PerimeterMovementControlsProps = {
  availableMoves: MovementDirection[];
  onMove: (direction: MovementDirection) => void;
  disabled?: boolean;
  roomLabel: string;
  getDirectionLabel?: (direction: MovementDirection) => string;
};

export function PerimeterMovementControls({
  availableMoves,
  onMove,
  disabled = false,
  roomLabel,
  getDirectionLabel = getPerimeterDirectionLabel,
}: PerimeterMovementControlsProps) {
  const canNorth = availableMoves.includes("north");
  const canSouth = availableMoves.includes("south");
  const canWest = availableMoves.includes("west");
  const canEast = availableMoves.includes("east");

  return (
    <div className="w-full rounded-sm border border-zinc-800/80 bg-zinc-950/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
          Room
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80">
          {roomLabel}
        </p>
      </div>

      <div className="mx-auto grid w-fit grid-cols-3 gap-2">
        <div />
        <DirButton dir="north" enabled={canNorth} disabled={disabled} onMove={onMove} labelFor={getDirectionLabel} />
        <div />
        <DirButton dir="west" enabled={canWest} disabled={disabled} onMove={onMove} labelFor={getDirectionLabel} />
        <div className="flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-accent/70" />
        </div>
        <DirButton dir="east" enabled={canEast} disabled={disabled} onMove={onMove} labelFor={getDirectionLabel} />
        <div />
        <DirButton dir="south" enabled={canSouth} disabled={disabled} onMove={onMove} labelFor={getDirectionLabel} />
        <div />
      </div>

      <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
        WASD / Arrows · Navigate between rooms
      </p>
    </div>
  );
}

function DirButton({
  dir,
  enabled,
  disabled,
  onMove,
  labelFor,
}: {
  dir: MovementDirection;
  enabled: boolean;
  disabled: boolean;
  onMove: (d: MovementDirection) => void;
  labelFor: (d: MovementDirection) => string;
}) {
  const inactive = !enabled || disabled;

  return (
    <button
      type="button"
      onClick={() => onMove(dir)}
      disabled={inactive}
      aria-label={`Move ${labelFor(dir)}`}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-sm border font-mono text-sm transition-all duration-200",
        inactive
          ? "cursor-not-allowed border-zinc-800/60 bg-zinc-950/30 text-zinc-700"
          : "interactable border-zinc-700/80 bg-zinc-900/60 text-zinc-300 hover:border-accent/30 hover:text-accent",
      )}
    >
      {ARROWS[dir]}
    </button>
  );
}