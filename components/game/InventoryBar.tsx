import type { PlayerInventory } from "@/types/inventory";
import { cn } from "@/lib/utils";

type InventoryBarProps = {
  inventory: PlayerInventory;
  compact?: boolean;
};

export function InventoryBar({ inventory, compact = false }: InventoryBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-sm border border-zinc-800/80 bg-zinc-950/50 px-4 py-3",
        compact && "py-2.5",
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
        Inventory
      </span>
      <span
        className={cn(
          "rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest",
          inventory.beaconCount > 0
            ? "border-accent/30 bg-accent/10 text-accent"
            : "border-zinc-800 text-zinc-600",
        )}
      >
        Beacon ×{inventory.beaconCount}
      </span>
    </div>
  );
}