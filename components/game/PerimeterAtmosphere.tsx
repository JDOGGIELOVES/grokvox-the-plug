type PerimeterAtmosphereProps = {
  children: React.ReactNode;
};

export function PerimeterAtmosphere({ children }: PerimeterAtmosphereProps) {
  return (
    <div className="perimeter-desert relative w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(154,52,18,0.18),transparent_65%)]"
      />
      <div
        aria-hidden
        className="perimeter-heat-haze pointer-events-none absolute inset-0 rounded-sm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-sm bg-gradient-to-b from-amber-950/20 to-transparent"
      />
      <div className="relative">{children}</div>
    </div>
  );
}