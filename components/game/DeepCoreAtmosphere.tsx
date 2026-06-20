import { cn } from "@/lib/utils";

type DeepCoreAtmosphereProps = {
  children: React.ReactNode;
  intense?: boolean;
  unstable?: boolean;
  presenceMode?: "aggressive" | "vulnerable" | "detached";
  className?: string;
};

export function DeepCoreAtmosphere({
  children,
  intense = false,
  unstable = false,
  presenceMode = "aggressive",
  className,
}: DeepCoreAtmosphereProps) {
  return (
    <div
      className={cn(
        "deep-core-atmosphere relative w-full",
        intense && "deep-core-atmosphere-heavy",
        unstable && "deep-core-unstable",
        presenceMode === "vulnerable" && "deep-core-vulnerable",
        presenceMode === "detached" && "deep-core-detached",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm bg-[radial-gradient(ellipse_90%_60%_at_50%_20%,rgba(244,63,94,0.08),transparent_65%)]"
      />
      <div
        aria-hidden
        className="deep-core-tremor-glow pointer-events-none absolute inset-0 rounded-sm"
      />
      <div
        aria-hidden
        className="deep-core-fracture-lines pointer-events-none absolute inset-0 rounded-sm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-sm bg-gradient-to-t from-rose-950/30 to-transparent"
      />
      {intense ? (
        <div
          aria-hidden
          className="deep-core-peak-pressure pointer-events-none absolute inset-0 rounded-sm"
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}