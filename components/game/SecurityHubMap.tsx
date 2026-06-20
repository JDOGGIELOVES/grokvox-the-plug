import { SECURITY_HUB_ROOMS } from "@/lib/movement/security-hub";
import type { SecurityHubRoomId } from "@/types/security-hub";
import type { HubDroneStatus } from "@/lib/security-hub-drone";
import { cn } from "@/lib/utils";

type SecurityHubMapProps = {
  playerRoom: SecurityHubRoomId;
  s04Position: number;
  s07Position: number;
  s04Status: HubDroneStatus;
  s07Status: HubDroneStatus;
  hackComplete: boolean;
  alert?: string | null;
};

const ROOM_ORDER: SecurityHubRoomId[] = [
  "inner-exit",
  "terminal-bay",
  "east-wing",
  "hub-corridor",
  "hub-entry",
];

export function SecurityHubMap({
  playerRoom,
  s04Position,
  s07Position,
  s04Status,
  s07Status,
  hackComplete,
  alert,
}: SecurityHubMapProps) {
  const corridorActive = playerRoom === "hub-corridor" || playerRoom === "hub-entry";

  return (
    <div className="perimeter-map relative w-full overflow-hidden rounded-sm border border-zinc-800/90 bg-zinc-950/80 p-3 sm:p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.08),transparent_65%)]"
      />
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
          Security Hub · Interior Grid
        </p>
        {alert ? (
          <span className="font-mono text-[9px] uppercase tracking-widest text-red-400/90">
            {alert}
          </span>
        ) : null}
      </div>

      <div className="relative mx-auto aspect-[4/3] max-w-lg">
        {ROOM_ORDER.map((roomId) => {
          const room = SECURITY_HUB_ROOMS[roomId];
          const isPlayer = playerRoom === roomId;
          const isCorridor = roomId === "hub-corridor";
          const isTerminalBay = roomId === "terminal-bay";

          return (
            <div
              key={roomId}
              className={cn(
                "absolute flex flex-col items-center justify-center border p-2 text-center transition-all duration-300",
                isPlayer
                  ? "border-accent/50 bg-accent/[0.08] shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                  : "border-zinc-800/80 bg-zinc-900/50",
              )}
              style={{
                top: `${room.gridRow * 25}%`,
                left: `${room.gridCol * 33.33}%`,
                width: "33.33%",
                height: "25%",
              }}
            >
              {isCorridor && corridorActive ? (
                <>
                  <div className="absolute inset-x-2 top-[35%] h-1 overflow-hidden rounded-full bg-zinc-800/80">
                    <div
                      className={cn(
                        "absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-[left] duration-100",
                        s04Status === "distracted"
                          ? "bg-amber-500/60"
                          : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]",
                      )}
                      style={{ left: `calc(${s04Position}% - 4px)` }}
                    />
                  </div>
                  <div className="absolute inset-y-4 right-[18%] w-1 overflow-hidden rounded-full bg-zinc-800/80">
                    <div
                      className={cn(
                        "absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full transition-[top] duration-100",
                        s07Status === "distracted"
                          ? "bg-amber-500/60"
                          : "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.7)]",
                      )}
                      style={{ top: `calc(${s07Position}% - 4px)` }}
                    />
                  </div>
                </>
              ) : null}

              <span
                className={cn(
                  "font-mono text-[8px] uppercase tracking-[0.12em] sm:text-[9px]",
                  isPlayer ? "text-accent" : "text-zinc-500",
                )}
              >
                {room.label}
              </span>
              {isPlayer ? (
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              ) : null}
              {isTerminalBay ? (
                <span className="mt-0.5 font-mono text-[7px] uppercase text-amber-500/70">
                  {hackComplete ? "3 terminals" : "3 · 1 locked"}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
        Red = S-04 sweep · Orange = S-07 sweep
      </p>
    </div>
  );
}