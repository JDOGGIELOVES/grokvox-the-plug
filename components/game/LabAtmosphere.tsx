export function LabAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-8 top-12 h-32 w-32 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -right-4 bottom-20 h-40 w-40 rounded-full bg-red-500/5 blur-3xl" />
      <div className="absolute left-[12%] top-0 h-full w-px bg-gradient-to-b from-accent/20 via-accent/5 to-transparent" />
      <div className="absolute right-[18%] top-0 h-full w-px bg-gradient-to-b from-zinc-700/30 via-transparent to-transparent" />

      <div className="absolute left-6 top-24 flex flex-col gap-6 opacity-40">
        {[68, 42, 81].map((h, i) => (
          <div key={i} className="flex items-end gap-1">
            <div
              className="w-1 rounded-full bg-accent/60 lab-pulse"
              style={{ height: `${h * 0.35}px`, animationDelay: `${i * 0.4}s` }}
            />
            <div
              className="w-1 rounded-full bg-zinc-600/60"
              style={{ height: `${h * 0.22}px` }}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-16 right-8 hidden opacity-30 sm:block">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
          <path
            d="M10 30 H70 M40 10 V50 M25 20 L55 40 M55 20 L25 40"
            stroke="rgba(249,115,22,0.25)"
            strokeWidth="0.5"
          />
          <circle cx="40" cy="30" r="8" stroke="rgba(249,115,22,0.15)" />
        </svg>
      </div>

      <div className="absolute inset-x-0 top-0 flex justify-center gap-16 pt-3 opacity-50">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-accent/70 lab-pulse"
            style={{ animationDelay: `${i * 0.6}s` }}
          />
        ))}
      </div>
    </div>
  );
}