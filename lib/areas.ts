import type { AreaDefinition } from "@/types/areas";

export const AREAS: Record<"upper-lab" | "corridor", AreaDefinition> = {
  "upper-lab": {
    id: "upper-lab",
    title: "Research Wing — Upper Lab",
    subtitle: "Sector 07 · Entry Point",
    description:
      "Sterile neural interface rigs line the walls. Orange warning lights pulse along ceiling conduits. A dormant uplink console waits at the center — Groknet's voice already hums through the bus.",
    facilityCode: "RW-UL-07",
    clearance: "Clearance B-2",
    env: "18.4°C · RH 42% · Pressure nominal · EM field elevated",
    systems: [
      { label: "Neural Rigs", status: "Standby", ok: true },
      { label: "Uplink Bus", status: "Contested", ok: false },
      { label: "Containment", status: "Nominal", ok: true },
      { label: "Groknet Link", status: "Active", ok: false },
    ],
    exits: [
      {
        target: "corridor",
        label: "East Corridor Hatch",
        direction: "East",
      },
    ],
  },
  corridor: {
    id: "corridor",
    title: "Maintenance Corridor C-4",
    subtitle: "Stealth Sector",
    description:
      "A narrow service passage lit by failing panel lights. Cable trays sag overhead. Patrol drone D-12 loops the passage — sneak past at an opening, or deploy a distraction beacon.",
    facilityCode: "RW-COR-04",
    clearance: "Restricted Transit",
    env: "16.1°C · RH 58% · Airflow irregular · Motion sensors live",
    systems: [
      { label: "Drone Patrol", status: "Active", ok: false },
      { label: "Motion Grid", status: "Armed", ok: false },
      { label: "Lighting", status: "Degraded", ok: false },
      { label: "Bulkhead", status: "Sealed", ok: true },
    ],
    exits: [
      {
        target: "upper-lab",
        label: "Upper Lab Hatch",
        direction: "West",
      },
      {
        target: "corridor",
        label: "Deep Sector Airlock",
        direction: "North",
        requiresStealth: true,
      },
    ],
  },
};