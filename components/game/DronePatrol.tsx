import { Button } from "@/components/ui/Button";
import type { DroneStatus } from "@/lib/drone";
import type { PlayerInventory } from "@/types/inventory";
import { cn } from "@/lib/utils";

type DronePatrolProps = {
  position: number;
  status: DroneStatus;
  isSafe: boolean;
  isHiding: boolean;
  inventory: PlayerInventory;
  canSneak: boolean;
  onToggleHide: () => void;
  onSneakPast: () => void;
  onDeployBeacon: () => void;
};

export function DronePatrol({
  position,
  status,
  isSafe,
  isHiding,
  inventory,
  canSneak,
  onToggleHide,
  onSneakPast,
  onDeployBeacon,
}: DronePatrolProps) {
  const statusLabel =
    status === "distracted"
      ? "Drone diverted"
      : isSafe
        ? "Opening clear"
        : "Drone scanning";

  const statusColor =
    status === "distracted"
      ? "text-amber-400/80"
      : isSafe
        ? "text-emerald-500/80"
        : "text-red-400/80";

  return (
    <div className="space-y-4 rounded-sm border border-zinc-800/80 bg-zinc-950/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          Patrol Drone — Unit D-12
        </p>
        <span
          className={cn(
            "font-mono text-[9px] uppercase tracking-widest",
            statusColor,
          )}
        >
          {statusLabel}
        </span>
      </div>

      <div className="relative h-14 overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900/80">
        <div className="absolute inset-y-0 left-[15%] w-px bg-emerald-500/15" />
        <div className="absolute inset-y-0 right-[15%] w-px bg-emerald-500/15" />
        <div className="absolute inset-y-2 left-[15%] right-[15%] rounded-sm bg-zinc-800/50" />

        {status === "distracted" ? (
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: "6%" }}
          >
            <span className="block h-3 w-3 animate-pulse rounded-full bg-accent/80 shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
          </div>
        ) : null}

        <div
          className={cn(
            "absolute top-1/2 flex -translate-y-1/2 items-center gap-1 transition-[left] duration-100 ease-linear",
            status === "distracted" && "opacity-40",
          )}
          style={{ left: `calc(${position}% - 12px)` }}
        >
          <span className="h-2 w-2 rounded-full bg-red-500/90 shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
          <span className="h-5 w-7 rounded-sm border border-zinc-600 bg-zinc-800" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={onToggleHide}
          className={cn(
            "interactable rounded-sm border px-3 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-200",
            isHiding
              ? "border-emerald-800/60 bg-emerald-950/40 text-emerald-400/90"
              : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-300",
          )}
        >
          {isHiding ? "In Cover" : "Take Cover"}
        </button>

        <Button
          variant="accent"
          onClick={onSneakPast}
          disabled={!canSneak}
          className="h-auto py-2.5 font-mono text-[10px] uppercase tracking-widest disabled:opacity-40"
        >
          Sneak Past
        </Button>

        <Button
          variant="ghost"
          onClick={onDeployBeacon}
          disabled={inventory.beaconCount <= 0 || status !== "patrolling"}
          className="font-mono text-[10px] uppercase tracking-widest"
        >
          Deploy Beacon
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-zinc-500">
        {status === "distracted"
          ? "The beacon drew it west. The north airlock is open."
          : isHiding
            ? "Pressed into the alcove. Wait for the drone to reach either end."
            : "The drone moves slowly. Sneak when it reaches either end, or deploy a beacon."}
      </p>
    </div>
  );
}