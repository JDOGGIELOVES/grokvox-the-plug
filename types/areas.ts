export type AreaId = "upper-lab" | "corridor";

export type AreaSystem = {
  label: string;
  status: string;
  ok: boolean;
};

export type AreaExit = {
  target: AreaId;
  label: string;
  direction: string;
  requiresStealth?: boolean;
};

export type AreaDefinition = {
  id: AreaId;
  title: string;
  subtitle: string;
  description: string;
  facilityCode: string;
  clearance: string;
  env: string;
  systems: AreaSystem[];
  exits: AreaExit[];
};