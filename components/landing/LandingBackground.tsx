export function LandingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="landing-bg-drift absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <defs>
            <linearGradient id="corridor-floor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a0a0c" />
              <stop offset="45%" stopColor="#121218" />
              <stop offset="100%" stopColor="#010102" />
            </linearGradient>
            <linearGradient id="corridor-wall-l" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#18181f" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#010102" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="corridor-wall-r" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#18181f" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#010102" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="distant-glow" cx="50%" cy="42%" r="35%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
              <stop offset="55%" stopColor="#9a3412" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#010102" stopOpacity="0" />
            </radialGradient>
            <filter id="corridor-blur">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>

          <rect width="1440" height="900" fill="#010102" />

          <polygon
            points="0,320 720,420 1440,320 1440,900 0,900"
            fill="url(#corridor-floor)"
            opacity="0.95"
          />
          <polygon
            points="0,0 520,0 720,420 0,320"
            fill="url(#corridor-wall-l)"
            opacity="0.85"
          />
          <polygon
            points="1440,0 920,0 720,420 1440,320"
            fill="url(#corridor-wall-r)"
            opacity="0.85"
          />

          <ellipse cx="720" cy="380" rx="280" ry="120" fill="url(#distant-glow)" className="landing-horizon-pulse" />

          {[0, 1, 2, 3, 4].map((i) => {
            const y = 180 + i * 38;
            const width = 120 + i * 55;
            const x = 720 - width / 2;
            return (
              <g key={i} opacity={0.35 - i * 0.05}>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={3}
                  fill="#f97316"
                  className="landing-light-flicker"
                  style={{ animationDelay: `${i * 0.7}s` }}
                />
                <rect x={x + width * 0.15} y={y + 18} width={width * 0.7} height={1} fill="#3f3f46" opacity="0.5" />
              </g>
            );
          })}

          <rect x="680" y="300" width="80" height="100" fill="#0c0c10" stroke="#f97316" strokeWidth="1" opacity="0.5" />
          <rect x="695" y="330" width="50" height="40" fill="#f97316" opacity="0.15" className="landing-door-glow" />

          <line x1="120" y1="0" x2="620" y2="420" stroke="rgba(249,115,22,0.08)" strokeWidth="1" />
          <line x1="1320" y1="0" x2="820" y2="420" stroke="rgba(249,115,22,0.08)" strokeWidth="1" />
          <line x1="720" y1="420" x2="720" y2="900" stroke="rgba(249,115,22,0.06)" strokeWidth="1" />

          {Array.from({ length: 8 }).map((_, i) => (
            <circle
              key={i}
              cx={280 + i * 110}
              cy={520 + (i % 3) * 40}
              r="1.5"
              fill="#f97316"
              opacity="0.4"
              className="landing-particle"
              style={{ animationDelay: `${i * 0.9}s` }}
            />
          ))}
        </svg>
      </div>

      <div className="landing-scan-sweep absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_38%,rgba(249,115,22,0.14),transparent_65%)]" />
      <div className="cinematic-grain absolute inset-0 opacity-[0.06]" />
    </div>
  );
}