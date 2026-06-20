import { cn } from "@/lib/utils";

type ServerFarmAtmosphereProps = {
  children: React.ReactNode;
  intense?: boolean;
  className?: string;
};

export function ServerFarmAtmosphere({
  children,
  intense = false,
  className,
}: ServerFarmAtmosphereProps) {
  return (
    <div
      className={cn(
        "server-farm-atmosphere relative w-full",
        intense && "server-farm-atmosphere-heavy",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm bg-[radial-gradient(ellipse_90%_60%_at_50%_20%,rgba(56,189,248,0.08),transparent_65%)]"
      />
      <div
        aria-hidden
        className="server-farm-rack-glow pointer-events-none absolute inset-0 rounded-sm"
      />
      <div
        aria-hidden
        className="server-farm-coolant pointer-events-none absolute inset-0 rounded-sm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-sm bg-gradient-to-t from-cyan-950/25 to-transparent"
      />
      {intense ? (
        <div
          aria-hidden
          className="server-farm-peak-pressure pointer-events-none absolute inset-0 rounded-sm"
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}