import { cn } from "@/lib/utils";

type ResearchLabAtmosphereProps = {
  children: React.ReactNode;
  intense?: boolean;
  className?: string;
};

export function ResearchLabAtmosphere({
  children,
  intense = false,
  className,
}: ResearchLabAtmosphereProps) {
  return (
    <div
      className={cn(
        "research-lab-atmosphere relative w-full",
        intense && "research-lab-atmosphere-heavy",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm bg-[radial-gradient(ellipse_75%_55%_at_50%_35%,rgba(245,158,11,0.1),transparent_70%)]"
      />
      <div
        aria-hidden
        className="research-lab-scan pointer-events-none absolute inset-0 rounded-sm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 rounded-t-sm bg-gradient-to-b from-amber-950/20 to-transparent"
      />
      {intense ? (
        <div
          aria-hidden
          className="research-lab-pressure pointer-events-none absolute inset-0 rounded-sm"
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}