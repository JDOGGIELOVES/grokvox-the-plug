import { AreaShell } from "@/components/game/AreaShell";
import { InteractableCard } from "@/components/game/InteractableCard";
import { LabAtmosphere } from "@/components/game/LabAtmosphere";
import { NavigationDoor } from "@/components/game/NavigationDoor";
import { Button } from "@/components/ui/Button";
import { AREAS } from "@/lib/areas";
import type { UpperLabPosition } from "@/types/movement";
import { cn } from "@/lib/utils";

const EQUIPMENT = [
  { id: "specimen", label: "Specimen Rack A", load: 68 },
  { id: "interface", label: "Interface Bay", load: 42 },
  { id: "coolant", label: "Coolant Loop", load: 81 },
] as const;

type UpperLabProps = {
  position: UpperLabPosition;
  positionDescription: string;
  onOpenTerminal: () => void;
  onTriggerHallucination: () => void;
  onTakeBeacon: () => void;
  onNavigate: () => void;
  exchangeCount: number;
  terminalComplete: boolean;
  hasBeacon: boolean;
  controlsDisabled?: boolean;
};

function PositionHint({ target }: { target: string }) {
  return (
    <p className="rounded-sm border border-zinc-800/80 bg-zinc-950/40 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
      Move to {target} to interact
    </p>
  );
}

export function UpperLab({
  position,
  positionDescription,
  onOpenTerminal,
  onTriggerHallucination,
  onTakeBeacon,
  onNavigate,
  exchangeCount,
  terminalComplete,
  hasBeacon,
  controlsDisabled = false,
}: UpperLabProps) {
  const area = AREAS["upper-lab"];

  return (
    <AreaShell area={area} atmosphere={<LabAtmosphere />}>
      <p className="rounded-sm border border-accent/10 bg-accent/[0.03] px-4 py-3 text-sm leading-relaxed text-zinc-400">
        {positionDescription}
      </p>

      {position === "breach-point" ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          Move forward to reach the lab floor
        </p>
      ) : null}

      {position === "lab-floor" ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {EQUIPMENT.map((item) => (
            <InteractableCard
              key={item.id}
              label={item.label}
              title="Operational"
              description="Systems nominal. Ambient load within tolerance."
              metric={item.load}
            />
          ))}
        </div>
      ) : (
        <PositionHint target="Lab Floor" />
      )}

      {position === "supply-locker" ? (
        <InteractableCard
          label="Supply Locker"
          title="Distraction Beacon"
          description={
            hasBeacon
              ? "Acquired — deploy in the corridor to lure patrol drone D-12."
              : "Emits a false heat signature. One charge. Click to take."
          }
          onClick={onTakeBeacon}
          disabled={controlsDisabled || hasBeacon}
          acquired={hasBeacon}
        />
      ) : (
        <PositionHint target="Supply Locker" />
      )}

      {position === "uplink-console" ? (
        <>
          <div className="rounded-sm border border-zinc-800/80 bg-zinc-950/60 p-4">
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
              Primary Uplink Console
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={
                    n === 2
                      ? "h-16 rounded-sm border border-accent/40 bg-zinc-950 shadow-[inset_0_0_16px_rgba(249,115,22,0.12)]"
                      : "h-16 rounded-sm border border-zinc-800 bg-zinc-950"
                  }
                >
                  <div className="space-y-1 p-2">
                    <div className="h-1 w-full rounded-full bg-zinc-800" />
                    <div className="h-1 w-2/3 rounded-full bg-zinc-800" />
                    {n === 2 ? (
                      <div className="mt-1 h-1 w-1/2 rounded-full bg-accent/60 lab-pulse" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">
              Groknet has seized the center console. Open a secure channel to
              negotiate — or provoke.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button
                variant="accent"
                onClick={onOpenTerminal}
                disabled={controlsDisabled}
                className={cn(
                  "h-12 min-w-56 px-8 font-mono text-xs uppercase tracking-[0.22em]",
                  controlsDisabled && "opacity-50",
                )}
              >
                {terminalComplete ? "Reopen Terminal" : "Access Terminal"}
              </Button>
              <div className="space-y-1">
                {exchangeCount > 0 ? (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    Exchanges logged: {exchangeCount}
                  </p>
                ) : null}
                {terminalComplete ? (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-500/70">
                    Uplink session closed
                  </p>
                ) : null}
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={onTriggerHallucination}
              disabled={controlsDisabled}
              className="h-9 w-fit border-red-900/40 px-4 font-mono text-[10px] uppercase tracking-widest text-red-400/70 hover:border-red-700/50 hover:bg-red-950/30 hover:text-red-300"
            >
              Trigger Hallucination
            </Button>
          </div>
        </>
      ) : (
        <PositionHint target="Uplink Console" />
      )}

      {position === "east-hatch" ? (
        <div className="space-y-3 border-t border-zinc-800/60 pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            Pathways
          </p>
          {area.exits.map((exit) => (
            <NavigationDoor
              key={exit.target}
              exit={exit}
              onNavigate={onNavigate}
              disabled={controlsDisabled}
            />
          ))}
        </div>
      ) : (
        <PositionHint target="East Corridor Hatch" />
      )}
    </AreaShell>
  );
}