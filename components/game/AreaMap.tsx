import type { AreaId } from "@/types/areas";
import { cn } from "@/lib/utils";

const AREA_LABELS: Record<AreaId, string> = {
  "upper-lab": "Upper Lab",
  corridor: "Corridor",
};

type AreaMapProps = {
  currentArea: AreaId;
};

export function AreaMap({ currentArea }: AreaMapProps) {
  const areas: AreaId[] = ["upper-lab", "corridor"];

  return (
    <div className="mb-6 flex w-full items-center justify-center gap-2">
      {areas.map((area, index) => (
        <div key={area} className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-300",
              currentArea === area
                ? "border-accent/40 bg-accent/10 text-accent shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                : "border-zinc-800 text-zinc-600",
            )}
          >
            {AREA_LABELS[area]}
          </span>
          {index < areas.length - 1 ? (
            <span className="font-mono text-zinc-700">—</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}