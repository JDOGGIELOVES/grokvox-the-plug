import { cn } from "@/lib/utils";

type PerimeterObjectivesProps = {
  droneBypassed: boolean;
  securityHubEntered: boolean;
};

const OBJECTIVES = [
  { key: "drone", label: "Bypass or distract drone S-04" },
  { key: "hub", label: "Enter the Security Hub" },
] as const;

export function PerimeterObjectives({
  droneBypassed,
  securityHubEntered,
}: PerimeterObjectivesProps) {
  const status: Record<string, boolean> = {
    drone: droneBypassed,
    hub: securityHubEntered,
  };

  const completed = Object.values(status).filter(Boolean).length;

  return (
    <div className="mb-6 w-full rounded-sm border border-zinc-800/80 bg-zinc-950/50 px-4 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
          Outer Perimeter Objectives
        </p>
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
          {completed}/{OBJECTIVES.length}
        </span>
      </div>
      <ul className="space-y-2">
        {OBJECTIVES.map((obj) => {
          const done = status[obj.key];
          return (
            <li
              key={obj.key}
              className={cn(
                "flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest transition-colors duration-300",
                done ? "text-emerald-500/80" : "text-zinc-600",
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-sm border text-[9px]",
                  done
                    ? "border-emerald-700/50 bg-emerald-950/40 text-emerald-400"
                    : "border-zinc-700 text-zinc-700",
                )}
              >
                {done ? "✓" : "·"}
              </span>
              {obj.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}