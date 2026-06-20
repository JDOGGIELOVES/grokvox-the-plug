import type { PerimeterRoomId } from "@/types/perimeter";
import { PERIMETER_ROOMS } from "@/lib/movement/outer-perimeter";
import { cn } from "@/lib/utils";

type OuterPerimeterMapProps = {
  playerRoom: PerimeterRoomId;
  dronePosition: number;
  droneActive: boolean;
  innerGateOpen: boolean;
  alert?: string | null;
};

const ROOM_ORDER: PerimeterRoomId[] = [
  "inner-gate",
  "scrap-alcove",
  "patrol-lane",
  "security-kiosk",
  "drop-zone",
];

export function OuterPerimeterMap({
  playerRoom,
  dronePosition,
  droneActive,
  innerGateOpen,
  alert,
}: OuterPerimeterMapProps) {
  return (
    <div className="perimeter-map relative w-full overflow-hidden rounded-sm border border-zinc-800/90 bg-zinc-950/80 p-3 sm:p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(154,52,18,0.12),transparent_55%)]"
      />
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
          Outer Perimeter · Desert Grid · Top View
        </p>
        {alert ? (
          <span className="font-mono text-[9px] uppercase tracking-widest text-red-400/90">
            {alert}
          </span>
        ) : null}
      </div>

      <div className="perimeter-grid relative mx-auto aspect-[4/3] max-w-lg">
        {ROOM_ORDER.map((roomId) => {
          const room = PERIMETER_ROOMS[roomId];
          const isPlayerHere = playerRoom === roomId;
          const isPatrol = roomId === "patrol-lane";
          const isGate = roomId === "inner-gate";
          const isKiosk = roomId === "security-kiosk";
          const isCover = roomId === "scrap-alcove";

          return (
            <div
              key={roomId}
              className={cn(
                "perimeter-room absolute flex flex-col items-center justify-center border p-2 text-center transition-all duration-300",
                isPlayerHere
                  ? "border-accent/50 bg-accent/[0.08] shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                  : "border-zinc-800/80 bg-zinc-900/50",
                isGate && !innerGateOpen && "opacity-60",
              )}
              style={{
                gridRow: room.gridRow + 1,
                gridColumn: room.gridCol + 1,
                top: `${room.gridRow * 33.33}%`,
                left: `${room.gridCol * 33.33}%`,
                width: "33.33%",
                height: "33.33%",
              }}
            >
              {isPatrol && droneActive ? (
                <div className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-zinc-800/80">
                  <div
                    className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] transition-[left] duration-100 ease-linear"
                    style={{ left: `calc(${dronePosition}% - 4px)` }}
                  />
                </div>
              ) : null}

              <span
                className={cn(
                  "font-mono text-[8px] uppercase tracking-[0.15em] sm:text-[9px]",
                  isPlayerHere ? "text-accent" : "text-zinc-500",
                )}
              >
                {room.label}
              </span>

              {isPlayerHere ? (
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              ) : null}

              {isKiosk ? (
                <span className="mt-0.5 font-mono text-[7px] uppercase text-amber-500/70">
                  Sec Hub
                </span>
              ) : null}
              {isCover ? (
                <span className="mt-0.5 font-mono text-[7px] uppercase text-emerald-500/60">
                  Cover
                </span>
              ) : null}
              {isGate ? (
                <span
                  className={cn(
                    "mt-0.5 font-mono text-[7px] uppercase",
                    innerGateOpen ? "text-emerald-500/70" : "text-zinc-600",
                  )}
                >
                  {innerGateOpen ? "Open" : "Sealed"}
                </span>
              ) : null}
            </div>
          );
        })}

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
          aria-hidden
        >
          <line x1="50%" y1="66%" x2="50%" y2="33%" stroke="#f97316" strokeWidth="1" />
          <line x1="50%" y1="33%" x2="17%" y2="33%" stroke="#52525b" strokeWidth="1" />
          <line x1="50%" y1="33%" x2="83%" y2="33%" stroke="#52525b" strokeWidth="1" />
          <line x1="50%" y1="33%" x2="50%" y2="0%" stroke="#52525b" strokeWidth="1" />
        </svg>
      </div>

      <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
        Orange dot = you · Red sweep = drone S-04
      </p>
    </div>
  );
}