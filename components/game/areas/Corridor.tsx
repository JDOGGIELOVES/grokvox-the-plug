import { AreaShell } from "@/components/game/AreaShell";
import { DronePatrol } from "@/components/game/DronePatrol";
import { GroknetWhisper } from "@/components/game/GroknetWhisper";
import { InventoryBar } from "@/components/game/InventoryBar";
import { NavigationDoor } from "@/components/game/NavigationDoor";
import { AREAS } from "@/lib/areas";
import type { DroneStatus } from "@/lib/drone";
import type { AreaId } from "@/types/areas";
import type { CorridorPosition } from "@/types/movement";
import type { PlayerInventory } from "@/types/inventory";

type CorridorProps = {
  position: CorridorPosition;
  positionDescription: string;
  dronePosition: number;
  droneStatus: DroneStatus;
  isDroneSafe: boolean;
  isHiding: boolean;
  canSneak: boolean;
  inventory: PlayerInventory;
  alert: string | null;
  groknetComment: string | null;
  terminalComplete: boolean;
  corridorCrossed: boolean;
  onToggleHide: () => void;
  onSneakPast: () => void;
  onDeployBeacon: () => void;
  onNavigate: (target: AreaId, requiresStealth?: boolean) => void;
};

function PositionHint({ target }: { target: string }) {
  return (
    <p className="rounded-sm border border-zinc-800/80 bg-zinc-950/40 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
      Move to {target} to interact
    </p>
  );
}

export function Corridor({
  position,
  positionDescription,
  dronePosition,
  droneStatus,
  isDroneSafe,
  isHiding,
  canSneak,
  inventory,
  alert,
  groknetComment,
  terminalComplete,
  corridorCrossed,
  onToggleHide,
  onSneakPast,
  onDeployBeacon,
  onNavigate,
}: CorridorProps) {
  const area = AREAS.corridor;
  const canCrossNorth = canSneak || droneStatus === "distracted";

  return (
    <AreaShell area={area} alert={alert}>
      <p className="rounded-sm border border-accent/10 bg-accent/[0.03] px-4 py-3 text-sm leading-relaxed text-zinc-400">
        {positionDescription}
      </p>

      {!terminalComplete ? (
        <p className="rounded-sm border border-amber-900/40 bg-amber-950/20 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-amber-400/80">
          Terminal uplink incomplete — finish your conversation in the Upper Lab
        </p>
      ) : corridorCrossed ? (
        <p className="rounded-sm border border-emerald-900/40 bg-emerald-950/20 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-emerald-400/80">
          Corridor breached — return to the lab or await extraction
        </p>
      ) : null}

      {position === "west-hatch" ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          Move forward into the patrol corridor
        </p>
      ) : null}

      {position === "mid-passage" || position === "north-airlock" ? (
        <InventoryBar inventory={inventory} compact />
      ) : (
        <PositionHint target="Mid Passage" />
      )}

      {position === "mid-passage" ? (
        <>
          <DronePatrol
            position={dronePosition}
            status={droneStatus}
            isSafe={isDroneSafe}
            isHiding={isHiding}
            inventory={inventory}
            canSneak={canSneak}
            onToggleHide={onToggleHide}
            onSneakPast={onSneakPast}
            onDeployBeacon={onDeployBeacon}
          />
          <GroknetWhisper message={groknetComment} />
        </>
      ) : (
        <PositionHint target="Mid Passage" />
      )}

      {position === "north-airlock" ? (
        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            Pathways
          </p>
          {area.exits.map((exit) => {
            const isDeepSector = exit.requiresStealth;
            const stealthBlocked = isDeepSector && !canCrossNorth;
            const terminalBlocked = isDeepSector && !terminalComplete;

            return (
              <NavigationDoor
                key={`${exit.target}-${exit.direction}`}
                exit={exit}
                onNavigate={() => onNavigate(exit.target, exit.requiresStealth)}
                disabled={stealthBlocked || terminalBlocked}
                disabledReason={
                  terminalBlocked
                    ? "Complete the terminal conversation first"
                    : stealthBlocked
                      ? "Drone blocking airlock — sneak or deploy beacon"
                      : undefined
                }
              />
            );
          })}
        </div>
      ) : (
        <PositionHint target="Deep Sector Airlock" />
      )}
    </AreaShell>
  );
}