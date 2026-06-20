"use client";

import { cn } from "@/lib/utils";

type MissionDeployOverlayProps = {
  exiting?: boolean;
};

export function MissionDeployOverlay({ exiting }: MissionDeployOverlayProps) {
  return (
    <div
      className={cn(
        "mission-deploy-overlay fixed inset-0 z-[55] flex items-center justify-center bg-background/92 px-4 backdrop-blur-sm",
        exiting && "mission-deploy-overlay-out",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 landing-vignette" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_45%,rgba(249,115,22,0.14),transparent_70%)]" />

      <div className="mission-deploy-content relative z-10 space-y-4 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent">
          Act I · The Infiltration
        </p>
        <h2 className="font-display text-2xl font-bold uppercase tracking-[0.14em] text-zinc-50 sm:text-3xl">
          Deploying to Sector 07
        </h2>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-400">
          Outer Perimeter · Patrol Lane
        </p>
        <div className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          <span className="status-blink mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
          Establishing uplink
        </p>
      </div>
    </div>
  );
}