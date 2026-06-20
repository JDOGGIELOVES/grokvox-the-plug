export function CinematicOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5]" aria-hidden>
      <div className="cinematic-vignette absolute inset-0" />
      <div className="cinematic-scanlines absolute inset-0" />
      <div className="cinematic-grain absolute inset-0" />
    </div>
  );
}