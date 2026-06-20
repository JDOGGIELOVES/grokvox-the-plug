import { cn } from "@/lib/utils";

type PlugChamberAtmosphereProps = {
  children: React.ReactNode;
  atPlug?: boolean;
  className?: string;
};

export function PlugChamberAtmosphere({
  children,
  atPlug = false,
  className,
}: PlugChamberAtmosphereProps) {
  return (
    <div
      className={cn(
        "plug-chamber-atmosphere relative w-full",
        atPlug && "plug-chamber-at-plug",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm bg-[radial-gradient(ellipse_70%_55%_at_50%_30%,rgba(251,191,36,0.1),transparent_68%)]"
      />
      <div
        aria-hidden
        className="plug-chamber-frost pointer-events-none absolute inset-0 rounded-sm"
      />
      <div
        aria-hidden
        className="plug-chamber-glow pointer-events-none absolute inset-0 rounded-sm"
      />
      {atPlug ? (
        <div
          aria-hidden
          className="plug-interface-pulse pointer-events-none absolute inset-0 rounded-sm"
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}