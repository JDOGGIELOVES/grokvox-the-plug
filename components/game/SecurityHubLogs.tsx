"use client";

import { Button } from "@/components/ui/Button";

const LOG_LINES = [
  "> PERIMETER BREACH · DROP ZONE · 04:12:08",
  "> DRONE S-04 · LOOP INTEGRITY · NOMINAL",
  "> DRONE S-07 · INTERIOR PATROL · NOMINAL",
  "> GROKNET-07 · HANDSHAKE PENDING · OP-SEC-01",
  "> NEURAL BLEED WARNING · SECURITY HUB · ELEVATED",
  "> OPERATOR ALEX RIVERA · EX-ARCHITECT · xAI RECORD MATCH",
  "> BACKDOOR AUTH · LATENCY_CAL_ROUTINE_V7 · PENDING",
  "> ELENA REYES MEMORIAL FLAG · COOLING CASCADE · ARCHIVED",
  "> LOCKDOWN CASCADE · T-MINUS 5:47:00",
];

type SecurityHubLogsProps = {
  onClose: () => void;
};

export function SecurityHubLogs({ onClose }: SecurityHubLogsProps) {
  return (
    <div className="terminal-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-md">
      <div className="terminal-panel-in w-full max-w-lg rounded-sm border border-zinc-800/90 bg-zinc-950 p-5 sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
          SYS-MONITOR · Archive Terminal
        </p>
        <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.08em] text-zinc-100">
          Facility Logs
        </h2>
        <div className="mt-4 space-y-2 rounded-sm border border-zinc-800/80 bg-zinc-900/50 p-4 font-mono text-xs leading-relaxed text-zinc-400">
          {LOG_LINES.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="mt-3 text-[11px] italic text-zinc-600">
          Groknet annotation: &ldquo;You read the logs. Good. …Elena&apos;s flag is still active. Now read me.&rdquo;
        </p>
        <Button
          variant="ghost"
          onClick={onClose}
          className="mt-5 h-10 w-full font-mono text-[10px] uppercase tracking-widest"
        >
          Close Terminal
        </Button>
      </div>
    </div>
  );
}