import type { AreaExit } from "@/types/areas";
import { cn } from "@/lib/utils";

type NavigationDoorProps = {
  exit: AreaExit;
  onNavigate: () => void;
  disabled?: boolean;
  disabledReason?: string;
};

export function NavigationDoor({
  exit,
  onNavigate,
  disabled = false,
  disabledReason,
}: NavigationDoorProps) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      disabled={disabled}
      className={cn(
        "interactable group flex w-full items-center justify-between gap-4 rounded-sm border px-4 py-4 text-left transition-all duration-300",
        disabled
          ? "cursor-not-allowed border-zinc-800/60 bg-zinc-950/30 opacity-50"
          : "border-zinc-700/80 bg-zinc-950/50 hover:border-accent/25 hover:bg-zinc-900/80 hover:shadow-[0_0_20px_rgba(249,115,22,0.06)]",
      )}
    >
      <div className="space-y-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          {exit.direction} — Pathway
        </p>
        <p className="text-sm text-zinc-300 transition-colors group-hover:text-zinc-100">
          {exit.label}
        </p>
        {disabled && disabledReason ? (
          <p className="font-mono text-[9px] uppercase tracking-widest text-amber-500/70">
            {disabledReason}
          </p>
        ) : null}
      </div>
      <span className="font-mono text-lg text-zinc-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent">
        →
      </span>
    </button>
  );
}