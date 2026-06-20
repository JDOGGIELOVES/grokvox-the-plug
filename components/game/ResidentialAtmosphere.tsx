import { cn } from "@/lib/utils";

type ResidentialAtmosphereProps = {
  children: React.ReactNode;
  intense?: boolean;
  className?: string;
};

export function ResidentialAtmosphere({
  children,
  intense = false,
  className,
}: ResidentialAtmosphereProps) {
  return (
    <div
      className={cn(
        "residential-intimate relative w-full",
        intense && "residential-intimate-heavy",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm bg-[radial-gradient(ellipse_70%_55%_at_50%_40%,rgba(139,92,246,0.14),transparent_68%)]"
      />
      <div
        aria-hidden
        className="residential-breath-haze pointer-events-none absolute inset-0 rounded-sm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 rounded-b-sm bg-gradient-to-t from-violet-950/25 to-transparent"
      />
      {intense ? (
        <div
          aria-hidden
          className="residential-heartbeat-ring pointer-events-none absolute inset-0 rounded-sm"
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}