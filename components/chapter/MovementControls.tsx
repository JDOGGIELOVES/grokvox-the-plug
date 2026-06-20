"use client";

import type { MoveDirection } from "@/types/movement";
import { getDirectionLabel } from "@/lib/movement/act-1";
import { cn } from "@/lib/utils";

const DIRECTION_ARROWS: Record<MoveDirection, string> = {
  forward: "↑",
  back: "↓",
  left: "←",
  right: "→",
};

type MovementControlsProps = {
  availableMoves: MoveDirection[];
  onMove: (direction: MoveDirection) => void;
  disabled?: boolean;
  positionLabel: string;
};

export function MovementControls({
  availableMoves,
  onMove,
  disabled = false,
  positionLabel,
}: MovementControlsProps) {
  const canForward = availableMoves.includes("forward");
  const canBack = availableMoves.includes("back");
  const canLeft = availableMoves.includes("left");
  const canRight = availableMoves.includes("right");

  return (
    <div className="mb-5 w-full rounded-sm border border-zinc-800/80 bg-zinc-950/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
          Position
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80">
          {positionLabel}
        </p>
      </div>

      <div className="mx-auto grid w-fit grid-cols-3 gap-2">
        <div />
        <MoveButton
          direction="forward"
          enabled={canForward}
          disabled={disabled}
          onMove={onMove}
        />
        <div />

        <MoveButton
          direction="left"
          enabled={canLeft}
          disabled={disabled}
          onMove={onMove}
        />
        <div className="flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-accent/70 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
        </div>
        <MoveButton
          direction="right"
          enabled={canRight}
          disabled={disabled}
          onMove={onMove}
        />

        <div />
        <MoveButton
          direction="back"
          enabled={canBack}
          disabled={disabled}
          onMove={onMove}
        />
        <div />
      </div>

      <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
        WASD / Arrow keys · Move to interact
      </p>
    </div>
  );
}

type MoveButtonProps = {
  direction: MoveDirection;
  enabled: boolean;
  disabled: boolean;
  onMove: (direction: MoveDirection) => void;
};

function MoveButton({ direction, enabled, disabled, onMove }: MoveButtonProps) {
  const inactive = !enabled || disabled;

  return (
    <button
      type="button"
      onClick={() => onMove(direction)}
      disabled={inactive}
      aria-label={`Move ${getDirectionLabel(direction)}`}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-sm border font-mono text-sm transition-all duration-200",
        inactive
          ? "cursor-not-allowed border-zinc-800/60 bg-zinc-950/30 text-zinc-700"
          : "interactable border-zinc-700/80 bg-zinc-900/60 text-zinc-300 hover:border-accent/30 hover:bg-zinc-900 hover:text-accent hover:shadow-[0_0_12px_rgba(249,115,22,0.12)]",
      )}
    >
      {DIRECTION_ARROWS[direction]}
    </button>
  );
}