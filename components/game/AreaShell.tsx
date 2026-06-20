import type { AreaDefinition } from "@/types/areas";
import { cn } from "@/lib/utils";

type AreaShellProps = {
  area: AreaDefinition;
  children: React.ReactNode;
  atmosphere?: React.ReactNode;
  alert?: string | null;
};

export function AreaShell({ area, children, atmosphere, alert }: AreaShellProps) {
  return (
    <section
      aria-label={area.title}
      className="relative w-full overflow-hidden rounded-sm border border-zinc-800/90 bg-surface/80 shadow-[inset_0_1px_0_rgba(249,115,22,0.06),0_24px_60px_rgba(0,0,0,0.55)]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(249,115,22,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(249,115,22,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="lab-scan absolute inset-x-0 h-24 bg-gradient-to-b from-accent/0 via-accent/[0.04] to-accent/0" />
      </div>

      {atmosphere}

      <div className="relative border-b border-zinc-800/80 px-5 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="lab-pulse h-2 w-2 rounded-full bg-accent/80 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500">
              Facility // {area.facilityCode}
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            {area.clearance}
          </span>
        </div>
      </div>

      {alert ? (
        <div className="relative border-b border-red-900/40 bg-red-950/30 px-5 py-2.5 sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-red-400/90">
            {alert}
          </p>
        </div>
      ) : null}

      <div className="relative grid gap-0 md:grid-cols-[1fr_200px] lg:grid-cols-[1fr_220px]">
        <div className="flex flex-col gap-5 p-4 sm:gap-6 sm:p-7 md:min-h-[460px]">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
                {area.subtitle}
              </p>
              <h2 className="font-display text-xl font-semibold uppercase tracking-[0.06em] text-zinc-100 sm:text-2xl">
                {area.title}
              </h2>
            </div>
            <p className="max-w-xl text-[15px] leading-7 text-zinc-400">
              {area.description}
            </p>
          </div>

          {children}
        </div>

        <aside className="border-t border-zinc-800/80 bg-zinc-950/50 p-5 md:border-l md:border-t-0">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            Systems Monitor
          </p>
          <ul className="space-y-3">
            {area.systems.map((system) => (
              <li
                key={system.label}
                className="flex items-center justify-between gap-3 border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-xs text-zinc-500">{system.label}</span>
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "lab-pulse h-1.5 w-1.5 rounded-full",
                      system.ok ? "bg-emerald-500/70" : "bg-accent/80",
                    )}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-400">
                    {system.status}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="relative border-t border-zinc-800/80 px-5 py-2.5 sm:px-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-700">
          Env: {area.env}
        </p>
      </div>
    </section>
  );
}